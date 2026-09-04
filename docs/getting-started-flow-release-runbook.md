# Getting-started flow preview and release runbook

This runbook is safe to keep in the repository. Store real environment values, analytics source and destination names, project IDs, dashboard links, and owner names only in the private release ticket and the relevant service settings.

## Preview deployment

### 1. Configure the Vercel Preview environment

Use the branch preview deployment and set:

```text
GETTING_STARTED_FLOW_EXPERIMENT_ENABLED=false
GETTING_STARTED_FLOW_EXPERIMENT_RELEASE_APPROVED=false
GETTING_STARTED_FLOW_EXPERIMENT_QA_ENABLED=true
NEXT_PUBLIC_SEGMENT_WRITE_KEY=<approved website source write key>
```

Keep the actual write key in Vercel. Never paste it into the PR, repository, screenshots, or test output. Redeploy the branch after changing environment variables.

### 2. Verify the disabled baseline

Open the preview root without query parameters in a fresh private browser window.

- The existing two-action homepage CTA is visible immediately.
- There is no loading skeleton or delayed CTA replacement.
- The document does not have a `data-getting-started-flow` assignment.
- No request is made to a browser Mixpanel SDK or a remote feature-flag decision endpoint.

This confirms that an unapproved preview cannot start production-style assignment.

### 3. Verify every QA arm

Open each URL in desktop and mobile layouts:

```text
https://<preview-host>/?gsf=ui
https://<preview-host>/?gsf=cli
https://<preview-host>/?gsf=prompt
```

Check the following matrix:

| Arm      | Primary check                                                     | Secondary check                                    |
| -------- | ----------------------------------------------------------------- | -------------------------------------------------- |
| `ui`     | “Get started free” opens the expected signup destination          | Signup URL contains the identity handoff parameter |
| `cli`    | Copy succeeds and shows confirmation only after clipboard success | “Sign up instead” remains usable                   |
| `prompt` | Copy succeeds and shows confirmation only after clipboard success | “Sign up instead” remains usable                   |

For every arm:

- Only the selected arm is visible; there is no flicker through another arm.
- The primary control is keyboard accessible and at least 44 px high.
- Reloading the QA URL keeps the requested arm.
- A QA override does not create or replace the production assignment cookie.
- The browser console has no application exceptions. Report-only CSP notices are non-enforcing browser diagnostics and are not application failures.

Do not complete a real signup or create production data during this check.

### 4. Verify first-party event delivery

In browser DevTools, filter Network requests by:

```text
/api/experiments/getting-started-flow/
```

For each QA arm, verify:

1. One exposure request returns `204`.
2. The primary action emits one selection request.
3. CLI and prompt copies emit their matching diagnostic event after a successful copy.
4. Requests contain `timestamp` and `sentAt` in canonical ISO format.
5. Event properties contain the expected arm, assignment version, assignment source, and `is_qa: true`.
6. Signup links carry the same anonymous identity used by the exposure event.

A `503` response means the analytics source is missing or Segment delivery failed. Treat it as a preview blocker and inspect the sanitized Vercel function log for the event name, message ID, attempt count, delivery status, and upstream status.

### 5. Verify the analytics destination

In the private release ticket, record the approved Segment source and Mixpanel destination. Then:

1. Confirm that the deployed write key belongs to the approved website source.
2. Confirm that this source routes to the designated destination.
3. Trigger an exposure and primary action for `ui`, `cli`, and `prompt` through the QA URLs.
4. Find all six events in the destination and verify `is_qa: true`.
5. Confirm that the exposure and selection share the same anonymous identity and arm.
6. Configure the experiment report to exclude `is_qa: true`.

No Mixpanel feature flag or browser SDK configuration is required by this implementation.

### 6. Verify performance

Compare the disabled root with each QA URL using three cold reloads per URL, disabled cache, Fast 4G networking, and 4× CPU slowdown.

- The CTA must be usable before application chunks finish loading.
- There must be no remote decision request in the render path.
- There must be no CTA layout shift or loading skeleton.
- Investigate a median LCP regression greater than 10% or a CLS increase greater than `0.01` relative to the disabled root.

The synchronous experiment bootstrap is contract-tested to remain below its repository byte budget.

### 7. Run automated checks against preview

Run the QA-safe subset without starting a local server:

```bash
PLAYWRIGHT_BASE_URL=https://<preview-host> \
PLAYWRIGHT_SKIP_WEB_SERVER=1 \
GETTING_STARTED_FLOW_EXPERIMENT_ENABLED=false \
pnpm exec playwright test tests/critical-flows/getting-started-flow.spec.ts \
  --grep "QA can render|QA assignment does not require"
```

Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` locally or rely on the equivalent green CI checks. Do not enable production-style random assignment on preview merely to exercise it: those events would not carry the QA marker. The production assignment path is covered by the route contracts and CI's local production-build browser run.

## Production release

### 1. Complete the private release gate

Do not set `GETTING_STARTED_FLOW_EXPERIMENT_RELEASE_APPROVED=true` until the private release ticket confirms:

- The privacy/analytics owner approved the consent behavior.
- The production Segment source routes to the designated Mixpanel destination.
- QA events for all arms arrived with the required properties and are excluded from reporting.
- The exposure-to-selection report uses the common selection event as its primary outcome.
- A Vercel WAF rule covers `POST /api/experiments/getting-started-flow/` per IP.
- Alerts exist for sustained WAF `429` responses and application `503` delivery failures.
- A named owner can operate the kill switch.

Recommended initial WAF policy: observe approximately 60 requests per 60 seconds per IP in log mode, validate normal traffic, and then enable rate limiting. Keep the final threshold and dashboard links in the private release ticket.

### 2. Deploy safely

1. Deploy the code to production with both release flags set to `false`; verify the existing homepage CTA.
2. Set `GETTING_STARTED_FLOW_EXPERIMENT_RELEASE_APPROVED=true` while keeping `GETTING_STARTED_FLOW_EXPERIMENT_ENABLED=false`; redeploy.
3. Confirm the homepage is still the disabled baseline and the release build remains one-hour ISR.
4. Set `GETTING_STARTED_FLOW_EXPERIMENT_ENABLED=true`; redeploy to begin assignment.
5. Verify the homepage in a fresh private window, the event endpoint response, Vercel logs, and the analytics destination.

If any gate becomes invalid, set `GETTING_STARTED_FLOW_EXPERIMENT_ENABLED=false` and redeploy. Do not delete assignment cookies; retaining them permits a consistent restart.

## After release

During the first 48 hours:

- Watch exposure volume, selection volume, `503` delivery failures, and WAF `429` responses.
- Confirm the observed arm split is close to the configured 34/33/33 allocation; investigate sample-ratio mismatch before interpreting conversion.
- Confirm production events have `is_qa: false` and reports continue to exclude QA traffic.
- Confirm no arm has a material increase in client exceptions, LCP, CLS, or failed copy actions.
- Exercise the kill switch once through the normal deployment process if the release procedure requires a rollback drill.

At the planned experiment decision point:

1. Use the common selection event as the primary conversion metric.
2. Treat downstream activation as directional until CLI and prompt paths carry explicit attribution.
3. Record the decision and supporting report in the private experiment record.
4. Roll out the winning behavior or restore the baseline.
5. Retire the experiment flags, temporary events, QA overrides, and monitoring contract after the final behavior is stable.
