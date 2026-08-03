# Critical user flow monitoring

This Playwright suite monitors the smallest set of business-critical website
journeys whose failure would block visitors from understanding Novu, reaching a
product, choosing a plan, or completing a high-intent form.

Failures are monitoring signals for now. The GitHub check should not become a
required release gate until the release policy is agreed with the website owners.

## Contract model

Every journey is recorded in `contracts.ts` with three explicit properties:

- `priority`: user impact if the journey breaks (`P0` or `P1`)
- `mode`: how deeply the journey is exercised (`navigate`, `render`, or `submit`)
- `policy`: whether a failure monitors a regression or blocks a release

Update the contract, test, selectors, and PR description together when an expected
destination or business outcome changes.

## Monitored journeys

| ID                   | Priority | Journey                              | Required outcome                                            |
| -------------------- | -------- | ------------------------------------ | ----------------------------------------------------------- |
| `TC-NAV-001`         | P0       | Responsive header → pricing and auth | Mobile/desktop navigation and dashboard destinations work   |
| `TC-HOME-001`        | P0       | Homepage → live channel              | Channel content and the generated CLI command are usable    |
| `TC-HOME-002`        | P1       | Homepage → coming-soon waitlist      | Validation, failure feedback, and retry all work            |
| `TC-HOME-003`        | P0       | Homepage Connect Stack setup         | Channel/runtime selection and both copy actions work        |
| `TC-CHANNEL-001`     | P0       | Published channel landing pages      | All five pages render their content, CLI, FAQ, and CTA      |
| `TC-CHANNEL-002`     | P0       | Channel page → Novu Connect          | The primary channel CTA reaches the Connect experience      |
| `TC-CONNECT-001`     | P0       | Novu Connect setup → product         | Copy actions, signup, and template handoffs remain usable   |
| `TC-INTEGRATION-001` | P0       | Find provider → integration detail   | Search, provider detail, and documentation handoff work     |
| `TC-ACQ-001`         | P0       | Pricing plan selection               | Self-serve links and the enterprise scheduling handoff work |
| `TC-SUB-001`         | P1       | Blog subscription                    | Validation, failure feedback, retry, and payload work       |
| `TC-LEAD-001`        | P1       | Careers interest application         | Validation, file upload, payload, and success state work    |

Browser journeys run in desktop Chromium, Pixel-sized Chromium, desktop WebKit,
and iPhone-sized WebKit. Each test also fails on unhandled application errors.

## Safety

Tests must never create accounts, leads, applications, subscriptions, or waitlist
registrations. Submission endpoints are intercepted in the browser, HubSpot forms
use the non-persisting `+skipform@hubspot.com` address, Notion forms use
`@example.com`, and the careers CV is an in-memory fixture. Separate Node
integration tests call the real Next.js form route handlers while replacing only
their outbound HubSpot and Notion requests.

## Commands

Install browser binaries once:

```bash
pnpm exec playwright install chromium webkit
```

Run the full desktop/mobile Chromium and WebKit matrix:

```bash
pnpm test
pnpm test:critical
```

Run a fast desktop Chromium check, open UI mode, or inspect the latest report:

```bash
pnpm test:critical:quick
pnpm test:critical:ui
pnpm test:critical:report
```

Playwright starts the local Next.js development server automatically. CI builds
the production application first and starts it with `pnpm start`. Set
`PLAYWRIGHT_BASE_URL` to exercise an existing local or preview deployment, and set
`PLAYWRIGHT_SKIP_WEB_SERVER=1` when that server is managed separately.
