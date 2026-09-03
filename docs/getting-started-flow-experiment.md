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
- When enabled, a small synchronous first-party script assigns the visitor before the homepage body is painted.
- The assignment is stored for 60 days in `novu_getting_started_flow_v1` with `SameSite=Lax`. Each exposure request also renews it as a server-set first-party cookie, reducing the risk that Safari's script-created-storage limits shorten the planned 28-day cohort; actual retention still follows browser policy.
- The homepage stays cacheable: there is no request-time cookie read, remote flag request, loading skeleton, or Mixpanel bundle in the render path.
- CLI and prompt copying works from the same bootstrap before React hydrates, so slow devices do not favor the native signup-link arm. A selection is recorded only after a successful copy.
- If JavaScript is unavailable, the script fails, or the experiment is disabled, the current dual CTA is shown.
- In development and preview deployments, `?gsf=ui`, `?gsf=cli`, and `?gsf=prompt` force an arm for QA without changing the visitor's sticky assignment. Production QA overrides require `GETTING_STARTED_FLOW_EXPERIMENT_QA_ENABLED=true`. QA events include `is_qa: true` and must be excluded from experiment results.

Changing the weights or meaning of an arm requires a new assignment version and cookie name. Do not rebalance an active cohort in place.

## Why the original PR implementation was replaced

The old branch rendered a skeleton while `mixpanel-browser` initialized and `get_variant_value()` waited for a remote flag. Its 2.5-second fallback did not cap the whole SDK-and-network sequence, so throttled visitors could wait several seconds for the hero action. The server/default arm could also be replaced after first paint, creating flicker and exposure/action bias. It additionally introduced a second analytics client even though the current site already uses Segment, and its linked Mixpanel experiment belongs to a different project than `Novu-dev`.

This implementation preserves the PR's exact experiment key, arms, allocation, copy, and QA URLs, but replaces the remote render dependency with local sticky assignment and first-party event delivery. The old branch also diverged substantially from current `main`, so it is not used as a merge base or cherry-pick source.

## Analytics contract

Events are posted with non-blocking `keepalive` requests to the allowlisted same-origin endpoint at `/api/experiments/getting-started-flow/`. The endpoint forwards them to the existing Segment source with its current write key; no Mixpanel browser SDK or remote decision request is added. A failed delivery is retried with `sendBeacon` and never changes the rendered CTA.

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

The bootstrap resolves `ajs_anonymous_id` in the same order as Analytics.js (`localStorage`, then cookie), synchronizes both stores, and uses that ID for the exposure. Signup links receive the same ID as Segment's documented `ajs_aid` query parameter before navigation, so even an immediate signup click can be stitched to the later identified dashboard account. The server also renews the shared `.novu.co` cookie.

CLI and prompt are copy-first paths and the current CLI/dashboard handoff does not carry the website anonymous ID. Therefore activation is not a valid symmetric primary metric for this version: it would be attributable for signup links but not reliably for the two copy arms. Use the common `Website Getting Started Flow Selected` event as the primary conversion. Treat later account activation only as a directional guardrail until the CLI, dashboard, or backend implements an explicit experiment-attribution handoff.

Before launch, verify in Segment and Mixpanel that the website source routes to the intended `Novu-dev` project and the common selection event arrives for all three arms. This implementation intentionally does not create or edit a Mixpanel flag, experiment, or report.

## Readout and launch

Use `Website Getting Started Flow Selected` after exposure as the primary outcome: signup-link click for `ui`, successful CLI copy for `cli`, and successful prompt copy for `prompt`. The arm-specific copy events are diagnostics. Exclude `is_qa: true`, check sample-ratio mismatch and exposure counts after 48 hours, and use the planned 28-day or sequential-testing decision point.

1. Deploy a preview with the experiment off and QA overrides available; verify all three `?gsf=` URLs.
2. Confirm the four events and signup-link identity handoff in the intended Mixpanel project.
3. Configure the exposure-to-selection report and exclude QA traffic.
4. Apply a platform rate limit and anomaly alert to `/api/experiments/getting-started-flow/`. The route requires browser-controlled same-origin headers and accepts only the experiment schema, but this repository has no shared distributed rate limiter; an in-process limiter would be misleading on serverless instances.
5. Set `GETTING_STARTED_FLOW_EXPERIMENT_ENABLED=true` and redeploy.
6. To stop the test, set the kill switch to `false` and redeploy; the baseline returns immediately without deleting assignments.

For local Playwright runs, the configured web server is not reused by default, preventing a stale process without the experiment flag from producing misleading results. Set `PLAYWRIGHT_REUSE_EXISTING_SERVER=1` only when the existing target was started with the same experiment settings. A target supplied through `PLAYWRIGHT_SKIP_WEB_SERVER=1` must likewise have the experiment enabled; the production-exposure assertion fails otherwise.
