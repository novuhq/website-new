# Homepage getting-started flow experiment

## Question

Which single homepage action gets more visitors to commit to a getting-started path: UI signup, the CLI, or a coding-agent prompt?

The experiment compares three committed paths. The existing two-action hero is the rollout baseline when the experiment is disabled; it is not a fourth arm.

| Variant  | Weight | Primary action                             |
| -------- | ------ | ------------------------------------------ |
| `ui`     | 34%    | Get started free → Agents signup           |
| `cli`    | 33%    | Copy `npx novu connect`                    |
| `prompt` | 33%    | Copy the current Novu Connect agent prompt |

The experiment key remains exactly `website-getting-started-flow-ui-vs-cli-vs-prompt-SJw6Uc` so historical planning and reports can be matched to this implementation.

## Runtime design

- `GETTING_STARTED_FLOW_EXPERIMENT_ENABLED=false` is the kill switch and default.
- Production assignment and event delivery require both the kill switch and `GETTING_STARTED_FLOW_EXPERIMENT_RELEASE_APPROVED=true`. The approval flag is fail-closed: it records that the external analytics, privacy, and abuse-protection gates below have been completed. It also defaults to `false`.
- When enabled, a small synchronous first-party script assigns the visitor before the homepage body is painted.
- The assignment is stored for 60 days in `novu_getting_started_flow_v1` with `SameSite=Lax`. Each exposure request also renews it as a server-set first-party cookie, reducing the risk that Safari's script-created-storage limits shorten the planned 28-day cohort; actual retention still follows browser policy.
- The homepage stays cacheable: there is no request-time cookie read, remote flag request, loading skeleton, or Mixpanel bundle in the render path.
- The synchronous bootstrap assigns the visible arm and installs a compact first-party fallback for identity, event delivery, signup decoration, clipboard actions, and copy confirmation. This keeps every arm usable while application chunks are slow or unavailable. The hydrated runtime takes ownership before React handlers can receive clicks, and a copy selection is recorded only after clipboard success.
- If JavaScript is unavailable, the inline script fails, or the experiment is disabled, the current dual CTA is shown. If only application chunks fail after the inline script runs, the assigned experiment CTA remains functional.
- In development and preview deployments, `?gsf=ui`, `?gsf=cli`, and `?gsf=prompt` force an arm for QA without changing the visitor's sticky assignment. Production QA overrides require `GETTING_STARTED_FLOW_EXPERIMENT_QA_ENABLED=true`. QA events include `is_qa: true` and must be excluded from experiment results.

Changing the weights or meaning of an arm requires a new assignment version and cookie name. Do not rebalance an active cohort in place.

## Why the original PR implementation was replaced

The old branch rendered a skeleton while `mixpanel-browser` initialized and `get_variant_value()` waited for a remote flag. Its 2.5-second fallback did not cap the whole SDK-and-network sequence, so throttled visitors could wait several seconds for the hero action. The server/default arm could also be replaced after first paint, creating flicker and exposure/action bias. It additionally introduced a second analytics client even though the current site already uses Segment, and its linked Mixpanel experiment belongs to a different project than the client-designated destination.

This implementation preserves the PR's exact experiment key, arms, allocation, copy, and QA URLs, but replaces the remote render dependency with local sticky assignment and first-party event delivery. The old branch also diverged substantially from current `main`, so it is not used as a merge base or cherry-pick source.

The generated parser-blocking payload is 8,270 bytes of JavaScript plus 807 bytes of visibility/fallback CSS (9,077 bytes raw / 3,122 bytes gzip in the enabled QA configuration). A unit contract keeps the script below 8.75 KB and rejects remote URLs, Mixpanel, or remote flag APIs in this path. The earlier implementation reviewed in this branch used 13,265 bytes of synchronous JavaScript plus 1,545 bytes of CSS, then initialized the additional Mixpanel browser bundle and waited on its remote decision path.

## Analytics contract

Events are posted to the allowlisted same-origin endpoint at `/api/experiments/getting-started-flow/`. Exposure, primary selections, and copy diagnostics all use the same non-blocking `keepalive` request with a `sendBeacon` retry after a rejected request or non-2xx response. The endpoint retries transient Segment network, `408`, `429`, and `5xx` failures up to three times with the same `messageId`; `429` honors `Retry-After` with a two-second cap. No Mixpanel browser SDK or remote decision request is added. Delivery never gates the rendered CTA.

Every request carries a monotonic client occurrence `timestamp` and a `sentAt` value from the same device clock. The endpoint requires canonical ISO timestamps and rejects a gap greater than five minutes between them, but does not compare them with the server clock. Segment can therefore apply its standard clock-skew correction without valid events being discarded for an inaccurate visitor clock. Funnel ordering still reflects the visitor's action order when two actions occur in one clock millisecond or their requests reach the server in a different order.

The server-forwarded events intentionally omit `context.ip`; geography is not a supported breakdown for this experiment. Adding visitor IP forwarding later requires an explicit privacy and reporting decision rather than silently attributing the Segment or hosting region.

| Event                                   | When                                                     |
| --------------------------------------- | -------------------------------------------------------- |
| `Website Getting Started Flow Exposed`  | Once when an assigned homepage arm is selected           |
| `Website Getting Started Flow Selected` | The arm's committed primary copy/signup action           |
| `Website CLI Command Copied`            | Clipboard confirms a successful CLI command copy         |
| `Website Prompt Copied`                 | Clipboard confirms a successful coding-agent prompt copy |

Every event includes:

- `experiment_key`
- `assignment_version`
- `getting_started_flow`
- `variant`
- `assignment_source` (`random`, `cookie`, or `qa`)
- `is_qa`

`Website Getting Started Flow Selected` also includes `action`: `sign_up_primary`, `copy_cli`, or `copy_prompt`. The secondary “Sign up instead” links retain normal site click tracking but intentionally do not count toward the experiment's common primary conversion.

The hydrated runtime resolves a bounded `ajs_anonymous_id` in the same order as Analytics.js (`localStorage`, then cookie), synchronizes both stores, and uses that ID for the exposure. It prepares every experiment signup link with the same ID through Segment's documented `ajs_aid` query parameter, including context-menu and modified-click navigation. The server also renews the shared `.novu.co` cookie.

CLI and prompt are copy-first paths and the current CLI/dashboard handoff does not carry the website anonymous ID. Therefore activation is not a valid symmetric primary metric for this version: it would be attributable for signup links but not reliably for the two copy arms. Use the common `Website Getting Started Flow Selected` event as the primary conversion. Treat later account activation only as a directional guardrail until the CLI, dashboard, or backend implements an explicit experiment-attribution handoff.

Failed or unconfigured Segment delivery returns `503`, allowing platform alerts to distinguish analytics loss from accepted events. A sanitized structured error records only the event name, `messageId`, attempt count, delivery status, and upstream HTTP status. It never logs the anonymous ID or event properties.

This implementation intentionally does not create or edit a Mixpanel flag, experiment, or report.

## Release approval gate

Set `GETTING_STARTED_FLOW_EXPERIMENT_RELEASE_APPROVED=true` only after an owner records completion of every item below:

1. **Privacy and consent:** the analytics/privacy owner confirms that experiment events follow the site's approved analytics policy. This repository currently has no visitor consent manager. If explicit visitor-level consent is required, keep approval `false` until a site-wide consent integration controls both the existing analytics and these experiment events.
2. **Destination:** record the authoritative Mixpanel destination in the private release ticket. Remove or replace the stale destination link inherited from the original PR before approval.
3. **End-to-end analytics:** confirm that the Segment source identified by the deployed `NEXT_PUBLIC_SEGMENT_WRITE_KEY` routes to the client-designated Mixpanel destination. Send QA exposures and selections for all three arms, verify their arrival, and exclude `is_qa: true` from the production report.
4. **Abuse protection and alerting:** publish a Vercel WAF rate-limit rule for `POST /api/experiments/getting-started-flow/`, scoped per IP. Start with approximately 60 requests per 60 seconds in log mode on preview, confirm expected traffic, then enable `429` rate limiting for production. Alert on sustained WAF `429` responses and application `503` analytics-delivery errors.

The rate limit is deliberately a platform gate rather than an in-process map: serverless instances do not share memory, so a repository-local limiter would not provide distributed protection.

## Readout and launch

Use `Website Getting Started Flow Selected` after exposure as the primary outcome: signup-link click for `ui`, successful CLI copy for `cli`, and successful prompt copy for `prompt`. The arm-specific copy events are diagnostics. Exclude `is_qa: true`, check sample-ratio mismatch and exposure counts after 48 hours, and use the planned 28-day or sequential-testing decision point.

1. Deploy a preview with the experiment off and QA overrides available; verify all three `?gsf=` URLs.
2. Complete and record every release approval gate above. Configure the exposure-to-selection report and exclude QA traffic.
3. With `GETTING_STARTED_FLOW_EXPERIMENT_ENABLED=false`, set `GETTING_STARTED_FLOW_EXPERIMENT_RELEASE_APPROVED=true` and deploy. This separates approval from exposure.
4. Set `GETTING_STARTED_FLOW_EXPERIMENT_ENABLED=true` and redeploy to start assignment.
5. To stop the test, set the kill switch to `false` and redeploy; the baseline returns immediately without deleting assignments. Leave approval unchanged unless one of its external guarantees is withdrawn.

For local Playwright runs, the configured web server is not reused by default, preventing a stale process without the experiment flag from producing misleading results. Set `PLAYWRIGHT_REUSE_EXISTING_SERVER=1` only when the existing target was started with the same experiment settings. A target supplied through `PLAYWRIGHT_SKIP_WEB_SERVER=1` must likewise have the experiment enabled; the production-exposure assertion fails otherwise.
