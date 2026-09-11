# Web Chat ACI Logo Track Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Animate the outer and center framework logos as one coordinated track.

**Architecture:** Retain the Figma illustration as clean 2× JPGs and render SVG
logos over it. Extend the existing server-rendered CSS animation to all three
positions, with a shared 3000ms hold and 700ms movement per step.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS keyframes, Tailwind v4, Playwright.

---

### Task 1: Export clean artwork

Files: `src/images/pages/channels/web-chat/deploy-aci-illustration-{desktop,mobile}.jpg`.

1. Read the exact desktop/mobile framework nodes from Figma.
2. Clone the image temporarily, hide the three framework logo nodes, export at
   2×, and remove the clone in `finally`. Preserve original Figma nodes.
3. Convert PNG exports to quality-95 JPEG with the existing Sharp dependency.
4. Inspect both exports for leftover logos and changes outside removed regions.
5. Export separate exact glyph and corner-frame SVGs if needed for center styling.

### Task 2: Verify the missing behavior

File: `tests/critical-flows/web-chat-aci.spec.ts`.

1. Add browser assertions for three coordinated positions and five center holds.
2. Pause browser CSS animations and set their current time deterministically.
3. Run against the existing center-only implementation and confirm a meaningful
   failure before implementing the full track.

### Task 3: Implement the track

Files:

- `src/components/pages/channels/web-chat/framework-logo-cycle.tsx`
- `src/components/pages/channels/web-chat/deploy-aci.tsx`
- `src/data/pages/web-chat-deploy-aci.ts`

1. Replace center-slot geometry with a full illustration overlay.
2. Position each logo from the Figma coordinates in the approved design.
3. Define a shared 18.5s cycle: center hold, outgoing hold, invisible return,
   incoming hold, then center. Apply staggered negative delays so three logos
   occupy the intended positions immediately and advance in the documented order.
4. Keep corner frames attached to each logo, including its center hold and
   reduced-motion state; retain transparent logo backgrounds.
5. Disable animations under reduced motion and show only the first centered mark.
6. Default desktop travel downward per the user preference, preserve the upward option, and force
   left-to-right mobile travel.

### Task 4: Verify and document

1. Run `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/critical-flows/web-chat-aci.spec.ts --project=desktop-chromium --project=mobile-chromium`.
2. Inspect hold/mid-transition/wrap screenshots at desktop and mobile sizes in
   Chromium and WebKit; check downward travel and reduced motion.
3. Run `pnpm lint --ignore-pattern '.claude/worktrees/**'`, `pnpm typecheck`, and
   `pnpm build`, retaining exact failure evidence for unrelated configuration.
4. Update the main design spec and handoff to supersede the center-only behavior.
5. Leave implementation changes ready for review; do not include unrelated files.
