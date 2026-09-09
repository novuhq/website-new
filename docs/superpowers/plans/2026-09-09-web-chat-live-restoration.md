# Restore live Web Chat in the redesigned hero

**Goal:** restore PR #176's live idle/reset behavior inside the current hero,
while retaining the new branded storyboard and accepting accent-less brands.

**Architecture:** one Novu provider and `useAgentChat` session supply both responsive
panels. The existing hero frame, empty state, and storyboard remain reusable.
Live conversation/composer content loads in a separate client module. A URL submit
unmounts the live session and plays the current storyboard; reset mounts a fresh
live session. Missing configuration displays a usable explanation and disabled
composer, without exposing implementation details to visitors.

**Approved scope:** the user's 2026-09-09 “go ahead” following the PR comparison.
Keep the original `webchat` agent and showcase subscriber. Use the existing public
application identifier variable; do not invent production configuration.

1. Add browser regressions in `tests/critical-flows/web-chat.spec.ts` for missing
   accent identity and live composer restoration; observe failures before fixes.
2. Add `live-agent-chat.tsx` using the installed Novu SDK and existing AI Elements
   for real message parts, scrolling, pending actions, errors, and keyboard submit.
   Reuse the hero panel geometry through a content slot rather than restoring the
   old layout. Keep one SDK session above both responsive renderings.
3. Accept successful brand profiles with no accent in `brand-provider.tsx`, using
   `buildBrandTheme(null)` while keeping domain/logo. Malformed or failed responses
   still use the existing fallback alert and storyboard.
4. Verify the actual SDK at its HTTP/WebSocket boundary using Playwright fixtures:
   send/response, failed-send retry, approval, preview/reset, and responsive views.
   Use a separate temporary test server with a fixture public identifier when the
   real identifier is unavailable; never change the user's environment to a dummy.
5. Update the binding spec and handoff to reflect the approved behavior. Run
   desktop/mobile browser checks, `pnpm test`, `pnpm typecheck`,
   `pnpm lint --ignore-pattern '.claude/worktrees/**'`, and `pnpm build`.
   The lint exclusion avoids another checkout; the known Notion build dependency
   must be reported if still unavailable. Format only touched files.

**Result:** implementation and local verification completed on 2026-09-09.
49 unit tests and 16 desktop/mobile browser cases pass; typecheck and scoped lint
pass. Production compilation and TypeScript pass, with page-data collection
blocked by existing Notion careers configuration. The real agent connection
requires the missing public Novu app identifier; neither local configuration nor
the original deployed PR supplied it. Full evidence is in the Web Chat handoff.
