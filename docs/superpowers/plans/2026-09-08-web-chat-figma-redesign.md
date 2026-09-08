# Web Chat Figma Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/channels/web-chat` to match the Figma design, including a live brand personalizer that recolours the Hero and two bento sections and drives a looping four-message agent conversation.

**Architecture:** `page.tsx` stays a server component. A `WebChatBrandProvider` client component owns brand state and writes `--wc-accent` / `--wc-accent-soft` / `--wc-hue` CSS custom properties onto a wrapper, so recolouring costs no React re-render. Only the Hero subscribes to the storyboard timeline. Illustration backgrounds recolour via a `mix-blend-mode: hue` overlay; discrete accents read the CSS variables.

**Tech Stack:** Next.js App Router (RSC), React 19, TypeScript, Tailwind CSS v4, `motion/react`, Radix Select, Playwright, `node:test` via `tsx`.

**Spec:** `docs/superpowers/specs/2026-09-08-web-chat-figma-redesign-design.md` — read it before starting. This plan argues from it.

## Global Constraints

- Branch: `feat/web-chat-figma-redesign`. Do not merge into `feat/web-chat-in-app-agent`.
- No `Co-Authored-By` trailers in commit messages.
- Route stays `/channels/web-chat`. Page keeps its "Web Chat" SEO framing.
- Figma file key: `sq4Qtfr7jrTKANvKpPFzWI`. Node IDs are given per task.
- Brand reference variants: `recent.dev` → accent `#E65006`; `todesktop.com` → accent `#0036FF`.
- Default (unpersonalized) accent: `#c25cd6` — the Figma badge square colour. First paint must match the Figma default frame.
- Timing values fixed by the designer: 3000ms between user and agent messages; 3000ms hold on the final state. All other durations are the developer's first-preview proposal and must live in one editable block.
- The storyboard loop re-enters at **step 1**. Step 0 never replays.
- Storyboard start is triggered by form submit, never gated on the `/api/agent-preview` fetch resolving.
- Every `mix-blend-mode: hue` host needs `isolation: isolate`.
- Where the Figma frames and the designer's spec text disagree, **the spec text wins** (see *Known Figma/spec mismatches* in the spec).
- Node tests run under `--conditions=react-server`, so they cannot render client components. Anything unit-tested must be a pure function.
- Node test runner only picks up `tests/*.test.ts` — not nested directories.
- Commands: `pnpm test` (node), `pnpm test:critical:quick` (Playwright, desktop-chromium), `pnpm typecheck`, `pnpm lint`.
- **Never run `pnpm format:fix`.** It is `prettier --write .` — repo-wide — and rewrote 148 unrelated files when Task 1 ran it, `tsconfig.json` included. Format only what you touched: `npx prettier --write <your files>`. `pnpm format` (check-only) is safe.

## Convention for visual tasks

Tasks marked **[visual]** implement a Figma frame. Their source of truth is the frame, not this document. Each carries the exact node ID, the exact copy strings, the exact token values, and the component's interface. For those tasks:

1. Invoke the `figma-to-code` skill with the given node ID.
2. Follow its workflow: extract Figma values, build a diff table, map to Tailwind v4 utilities, add missing design tokens to `src/styles/globals.css` only when no existing token fits.
3. Reuse existing components named in the task rather than rebuilding.
4. Verify against the frame before committing.

Do not invent copy. Every user-visible string is either quoted in the task or must be read from the named node.

## File Structure

| File | Responsibility |
| --- | --- |
| `src/lib/accent.ts` | Pure colour maths: hex normalization, WCAG relative luminance, accent foreground choice |
| `src/lib/web-chat-theme.ts` | Pure brand→theme and theme→CSS-variable mapping |
| `src/data/pages/web-chat.ts` | All copy, storyboard timings, table rows, message scripts, card content |
| `src/data/pages/web-chat-storyboard.ts` | Pure storyboard state machine |
| `src/data/pages/connect-stack-options.ts` | `IStackOption` + default channel/framework lists (extracted) |
| `src/components/ui/select-field.tsx` | Labelled Radix select with option icons (extracted) |
| `src/components/pages/channels/web-chat/brand-provider.tsx` | Brand context, CSS-variable writer, fetch orchestration |
| `…/web-chat/use-storyboard.ts` | Thin timer hook over the pure state machine |
| `…/web-chat/hue-layer.tsx` | Brand-coloured `mix-blend-mode: hue` overlay |
| `…/web-chat/url-personalizer.tsx` | URL pill (desktop) / card (mobile), submit + reset |
| `…/web-chat/brand-alert.tsx` | Fallback alert pill |
| `…/web-chat/hero-product-ui.tsx` | Browser chrome, sidebar, both tables |
| `…/web-chat/hero-agent-panel.tsx` | Agent panel: empty state, message sequence, field table |
| `…/web-chat/hero.tsx` | Hero composition, storyboard wiring |
| `…/web-chat/compare-bento.tsx` | §2 |
| `…/web-chat/product-bento.tsx` | §3 |
| `…/web-chat/surface-tabs.tsx` | §4 |
| `…/web-chat/channels-grid.tsx` | §5 |
| `…/web-chat/deploy-aci.tsx` | §6 |
| `…/web-chat/framework-logo-cycle.tsx` | §6 logo cycling overlay |
| `…/web-chat/design-system-showcase.tsx` | §7 |
| `…/web-chat/configurator.tsx` | §8 |
| `…/web-chat/ownership.tsx` | §9 |
| `tests/web-chat-accent.test.ts` | Unit: colour maths + theme mapping |
| `tests/web-chat-storyboard.test.ts` | Unit: storyboard state machine |
| `tests/critical-flows/web-chat.spec.ts` | E2E: personalize, fallback, reset, configurator |

---

# Phase 1 — The personalizing hero

Ships independently. At the end of Phase 1 the new Hero is live and the existing
sections below it still render.

---

### Task 1: Colour maths and brand theme

**Files:**
- Create: `src/lib/accent.ts`
- Create: `src/lib/web-chat-theme.ts`
- Test: `tests/web-chat-accent.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `normalizeHex(input: string): string | null`
  - `relativeLuminance(hex: string): number`
  - `accentForeground(hex: string): "#ffffff" | "#000000"`
  - `DEFAULT_ACCENT: "#c25cd6"`
  - `interface BrandTheme { accent: string; accentForeground: string; accentSoft: string }`
  - `buildBrandTheme(accent: string | null | undefined): BrandTheme`
  - `brandCssVars(theme: BrandTheme): Record<string, string>`

**Why a luminance threshold and not max contrast:** a pure "pick the higher
contrast" rule returns black on `#E65006` (contrast 5.4 vs black, 3.9 vs white),
but the Figma frames use white on that orange. The design language is white-on-accent;
black is only correct when the accent is genuinely light. Hence a luminance
threshold at 0.5, which yields white for `#E65006` (0.226), `#0036FF` (0.099) and
`#c25cd6` (0.240), and black for a pale accent like `#FFE066` (0.755).

- [ ] **Step 1: Write the failing test**

```ts
// tests/web-chat-accent.test.ts
import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  DEFAULT_ACCENT,
  accentForeground,
  normalizeHex,
  relativeLuminance,
} from "@/lib/accent"
import { brandCssVars, buildBrandTheme } from "@/lib/web-chat-theme"

describe("normalizeHex", () => {
  it("expands shorthand and adds the leading hash", () => {
    assert.equal(normalizeHex("abc"), "#aabbcc")
    assert.equal(normalizeHex("#ABC"), "#aabbcc")
  })

  it("lowercases six-digit values", () => {
    assert.equal(normalizeHex("#E65006"), "#e65006")
  })

  it("returns null for values that are not hex colours", () => {
    assert.equal(normalizeHex(""), null)
    assert.equal(normalizeHex("rebeccapurple"), null)
    assert.equal(normalizeHex("#12345"), null)
    assert.equal(normalizeHex("#gggggg"), null)
  })
})

describe("relativeLuminance", () => {
  it("puts white at 1 and black at 0", () => {
    assert.equal(relativeLuminance("#ffffff"), 1)
    assert.equal(relativeLuminance("#000000"), 0)
  })

  it("orders brand accents between black and white", () => {
    const orange = relativeLuminance("#e65006")
    const paleYellow = relativeLuminance("#ffe066")

    assert.ok(orange > 0 && orange < 1)
    assert.ok(paleYellow > orange)
  })
})

describe("accentForeground", () => {
  it("keeps white on the Figma reference accents", () => {
    assert.equal(accentForeground("#e65006"), "#ffffff")
    assert.equal(accentForeground("#0036ff"), "#ffffff")
    assert.equal(accentForeground(DEFAULT_ACCENT), "#ffffff")
  })

  it("switches to black on a pale accent", () => {
    assert.equal(accentForeground("#ffe066"), "#000000")
  })
})

describe("buildBrandTheme", () => {
  it("falls back to the default accent when extraction produced nothing", () => {
    assert.equal(buildBrandTheme(null).accent, DEFAULT_ACCENT)
    assert.equal(buildBrandTheme(undefined).accent, DEFAULT_ACCENT)
    assert.equal(buildBrandTheme("not-a-colour").accent, DEFAULT_ACCENT)
  })

  it("normalizes a supplied accent and derives its foreground", () => {
    const theme = buildBrandTheme("#E65006")

    assert.equal(theme.accent, "#e65006")
    assert.equal(theme.accentForeground, "#ffffff")
  })

  it("derives a translucent soft variant of the accent", () => {
    assert.equal(buildBrandTheme("#e65006").accentSoft, "#e650061f")
  })
})

describe("brandCssVars", () => {
  it("maps a theme onto the page's custom properties", () => {
    assert.deepEqual(brandCssVars(buildBrandTheme("#0036ff")), {
      "--wc-accent": "#0036ff",
      "--wc-accent-foreground": "#ffffff",
      "--wc-accent-soft": "#0036ff1f",
      "--wc-hue": "#0036ff",
    })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test`
Expected: FAIL — cannot find module `@/lib/accent`.

- [ ] **Step 3: Write `src/lib/accent.ts`**

```ts
/**
 * Pure colour helpers for the Web Chat brand personalizer. No DOM, no fetch —
 * safe to import from server components, client components and node tests.
 */

/** The unpersonalized accent. Matches the Figma badge square (#C25CD6). */
export const DEFAULT_ACCENT = "#c25cd6" as const

const SHORTHAND = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i
const FULL = /^#?([0-9a-f]{6})$/i

/** Normalize `abc`, `#ABC`, `#E65006` to lowercase `#rrggbb`, else null. */
export function normalizeHex(input: string): string | null {
  const value = input.trim()

  const shorthand = SHORTHAND.exec(value)
  if (shorthand) {
    const [, r, g, b] = shorthand
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }

  const full = FULL.exec(value)
  return full ? `#${full[1].toLowerCase()}` : null
}

function channels(hex: string): [number, number, number] {
  const value = hex.slice(1)
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ]
}

function toLinear(channel: number): number {
  return channel <= 0.03928
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4)
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function relativeLuminance(hex: string): number {
  const normalized = normalizeHex(hex)

  if (!normalized) {
    return 0
  }

  const [r, g, b] = channels(normalized).map(toLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Text colour to sit on an accent fill.
 *
 * Deliberately a luminance threshold rather than a max-contrast rule: the design
 * uses white on #E65006 even though black has the higher contrast ratio there.
 * Black is reserved for accents light enough that white would be unreadable.
 */
export function accentForeground(hex: string): "#ffffff" | "#000000" {
  return relativeLuminance(hex) > 0.5 ? "#000000" : "#ffffff"
}
```

- [ ] **Step 4: Write `src/lib/web-chat-theme.ts`**

```ts
import { DEFAULT_ACCENT, accentForeground, normalizeHex } from "@/lib/accent"

export interface BrandTheme {
  accent: string
  accentForeground: string
  /** The accent at 12% alpha, for tinted rows and bubbles. */
  accentSoft: string
}

/** Build a theme from an extracted accent, falling back to the site default. */
export function buildBrandTheme(
  accent: string | null | undefined
): BrandTheme {
  const normalized = (accent && normalizeHex(accent)) || DEFAULT_ACCENT

  return {
    accent: normalized,
    accentForeground: accentForeground(normalized),
    accentSoft: `${normalized}1f`,
  }
}

/** The custom properties every personalized section reads. */
export function brandCssVars(theme: BrandTheme): Record<string, string> {
  return {
    "--wc-accent": theme.accent,
    "--wc-accent-foreground": theme.accentForeground,
    "--wc-accent-soft": theme.accentSoft,
    "--wc-hue": theme.accent,
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS, all cases in `tests/web-chat-accent.test.ts`.

- [ ] **Step 6: Typecheck**

Run: `pnpm typecheck`
Expected: no new errors in `src/lib/accent.ts` or `src/lib/web-chat-theme.ts`. Pre-existing repo-wide errors on this branch are not yours to fix.

- [ ] **Step 7: Commit**

```bash
git add src/lib/accent.ts src/lib/web-chat-theme.ts tests/web-chat-accent.test.ts
git commit -m "feat(web-chat): add accent colour maths and brand theme mapping"
```

---

### Task 2: Storyboard state machine

**Files:**
- Create: `src/data/pages/web-chat-storyboard.ts`
- Test: `tests/web-chat-storyboard.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type StoryboardStep = 0 | 1 | 2 | 3 | 4 | 5`
  - `interface StoryboardTiming { grayscaleMs; blurMs; recolorMs; messageRevealMs; thinkingMs; gapMs; finalHoldMs }` (all `number`)
  - `STORYBOARD_TIMING: StoryboardTiming`
  - `interface StoryboardState { step: StoryboardStep; dwellMs: number }`
  - `STORYBOARD_FIRST_STEP: StoryboardStep` (0)
  - `STORYBOARD_LOOP_STEP: StoryboardStep` (1)
  - `storyboardDwellMs(step: StoryboardStep, timing: StoryboardTiming): number`
  - `nextStoryboardStep(step: StoryboardStep): StoryboardStep`
  - `initialStoryboardState(timing: StoryboardTiming): StoryboardState`
  - `advanceStoryboard(state: StoryboardState, timing: StoryboardTiming): StoryboardState`

Step 0's grayscale and blur run concurrently, then the recolour follows — so its
dwell is `max(grayscaleMs, blurMs) + recolorMs`, not the sum of all three.

- [ ] **Step 1: Write the failing test**

```ts
// tests/web-chat-storyboard.test.ts
import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  STORYBOARD_FIRST_STEP,
  STORYBOARD_LOOP_STEP,
  STORYBOARD_TIMING,
  advanceStoryboard,
  initialStoryboardState,
  nextStoryboardStep,
  storyboardDwellMs,
  type StoryboardStep,
} from "@/data/pages/web-chat-storyboard"

describe("storyboard timings", () => {
  it("holds the designer-fixed three-second values", () => {
    assert.equal(STORYBOARD_TIMING.gapMs, 3000)
    assert.equal(STORYBOARD_TIMING.finalHoldMs, 3000)
  })
})

describe("nextStoryboardStep", () => {
  it("walks the transition into the conversation", () => {
    assert.equal(nextStoryboardStep(0), 1)
    assert.equal(nextStoryboardStep(1), 2)
    assert.equal(nextStoryboardStep(2), 3)
    assert.equal(nextStoryboardStep(3), 4)
    assert.equal(nextStoryboardStep(4), 5)
  })

  it("loops the final step back to the first message, never to the transition", () => {
    assert.equal(nextStoryboardStep(5), STORYBOARD_LOOP_STEP)
    assert.equal(nextStoryboardStep(5), 1)
    assert.notEqual(nextStoryboardStep(5), STORYBOARD_FIRST_STEP)
  })

  it("never revisits step 0 once the conversation has started", () => {
    let step: StoryboardStep = 1
    const seen: StoryboardStep[] = []

    for (let i = 0; i < 12; i += 1) {
      step = nextStoryboardStep(step)
      seen.push(step)
    }

    assert.ok(!seen.includes(0))
  })
})

describe("storyboardDwellMs", () => {
  it("overlaps grayscale and blur in the transition, then adds the recolour", () => {
    assert.equal(
      storyboardDwellMs(0, STORYBOARD_TIMING),
      Math.max(STORYBOARD_TIMING.grayscaleMs, STORYBOARD_TIMING.blurMs) +
        STORYBOARD_TIMING.recolorMs
    )
  })

  it("gives each message its reveal plus the inter-message gap", () => {
    const expected =
      STORYBOARD_TIMING.messageRevealMs + STORYBOARD_TIMING.gapMs

    assert.equal(storyboardDwellMs(1, STORYBOARD_TIMING), expected)
    assert.equal(storyboardDwellMs(3, STORYBOARD_TIMING), expected)
    assert.equal(storyboardDwellMs(4, STORYBOARD_TIMING), expected)
  })

  it("dwells on the thinking step for its own duration", () => {
    assert.equal(
      storyboardDwellMs(2, STORYBOARD_TIMING),
      STORYBOARD_TIMING.thinkingMs
    )
  })

  it("holds the final step before looping", () => {
    assert.equal(
      storyboardDwellMs(5, STORYBOARD_TIMING),
      STORYBOARD_TIMING.messageRevealMs + STORYBOARD_TIMING.finalHoldMs
    )
  })

  it("scales with an edited timing block", () => {
    const doubled = { ...STORYBOARD_TIMING, thinkingMs: 1800 }

    assert.equal(storyboardDwellMs(2, doubled), 1800)
  })
})

describe("advanceStoryboard", () => {
  it("starts on the transition step", () => {
    const state = initialStoryboardState(STORYBOARD_TIMING)

    assert.equal(state.step, 0)
    assert.equal(state.dwellMs, storyboardDwellMs(0, STORYBOARD_TIMING))
  })

  it("carries the dwell for the step it moves to", () => {
    const state = advanceStoryboard(
      initialStoryboardState(STORYBOARD_TIMING),
      STORYBOARD_TIMING
    )

    assert.equal(state.step, 1)
    assert.equal(state.dwellMs, storyboardDwellMs(1, STORYBOARD_TIMING))
  })

  it("produces the full cycle then repeats from the first message", () => {
    let state = initialStoryboardState(STORYBOARD_TIMING)
    const steps = [state.step]

    for (let i = 0; i < 6; i += 1) {
      state = advanceStoryboard(state, STORYBOARD_TIMING)
      steps.push(state.step)
    }

    assert.deepEqual(steps, [0, 1, 2, 3, 4, 5, 1])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test`
Expected: FAIL — cannot find module `@/data/pages/web-chat-storyboard`.

- [ ] **Step 3: Write the implementation**

```ts
// src/data/pages/web-chat-storyboard.ts

/**
 * The Hero storyboard, as a pure state machine.
 *
 * Step 0 is the transition into the personalized theme and plays exactly once.
 * Steps 1-5 are the conversation, and the loop re-enters at step 1 so the
 * grayscale-and-blur transition never replays. Reference frames:
 * hero-personalization-00(transition) through -05 in Figma node 45487-82743.
 */

export type StoryboardStep = 0 | 1 | 2 | 3 | 4 | 5

export interface StoryboardTiming {
  /** Chat desaturating to grayscale. Runs concurrently with the blur. */
  grayscaleMs: number
  /** Dashboard content blurring. Runs concurrently with the grayscale. */
  blurMs: number
  /** New table and accent-coloured chat resolving in. */
  recolorMs: number
  /** One message going from blurred-and-transparent to sharp. */
  messageRevealMs: number
  /** How long the "agent is thinking" state holds. */
  thinkingMs: number
  /** Pause between a message landing and the next one starting. */
  gapMs: number
  /** How long the final state holds before the loop restarts. */
  finalHoldMs: number
}

/**
 * gapMs and finalHoldMs are fixed by the designer at 3s. The rest are the
 * first-preview proposal and are meant to be tuned here, in one place.
 */
export const STORYBOARD_TIMING: StoryboardTiming = {
  grayscaleMs: 600,
  blurMs: 600,
  recolorMs: 800,
  messageRevealMs: 700,
  thinkingMs: 900,
  gapMs: 3000,
  finalHoldMs: 3000,
}

export interface StoryboardState {
  step: StoryboardStep
  /** How long to stay on `step` before advancing. */
  dwellMs: number
}

export const STORYBOARD_FIRST_STEP: StoryboardStep = 0
export const STORYBOARD_LOOP_STEP: StoryboardStep = 1
export const STORYBOARD_LAST_STEP: StoryboardStep = 5

export function storyboardDwellMs(
  step: StoryboardStep,
  timing: StoryboardTiming
): number {
  switch (step) {
    case 0:
      return Math.max(timing.grayscaleMs, timing.blurMs) + timing.recolorMs
    case 2:
      return timing.thinkingMs
    case 5:
      return timing.messageRevealMs + timing.finalHoldMs
    default:
      return timing.messageRevealMs + timing.gapMs
  }
}

export function nextStoryboardStep(step: StoryboardStep): StoryboardStep {
  return step === STORYBOARD_LAST_STEP
    ? STORYBOARD_LOOP_STEP
    : ((step + 1) as StoryboardStep)
}

export function initialStoryboardState(
  timing: StoryboardTiming
): StoryboardState {
  return {
    step: STORYBOARD_FIRST_STEP,
    dwellMs: storyboardDwellMs(STORYBOARD_FIRST_STEP, timing),
  }
}

export function advanceStoryboard(
  state: StoryboardState,
  timing: StoryboardTiming
): StoryboardState {
  const step = nextStoryboardStep(state.step)

  return { step, dwellMs: storyboardDwellMs(step, timing) }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/pages/web-chat-storyboard.ts tests/web-chat-storyboard.test.ts
git commit -m "feat(web-chat): add storyboard state machine"
```

---

### Task 3: Extract the configurator core

Independent of the redesign — the homepage must behave exactly as before. The
existing `connectStackContract` Playwright test is the regression gate.

**Files:**
- Create: `src/components/ui/select-field.tsx`
- Create: `src/data/pages/connect-stack-options.ts`
- Modify: `src/components/pages/home/connect-stack.tsx`
- Modify: `src/components/pages/channels/channel-connect-stack.tsx`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `src/data/pages/connect-stack-options.ts`: `interface IStackOption { cliSlug?: string; connectPath?: "bridge" | "managed"; icon?: StaticImageData | string; label: string; promptLabel?: string; value: string }`, `DEFAULT_CHANNELS: IStackOption[]`, `DEFAULT_FRAMEWORKS: IStackOption[]`, `WEB_CHAT_CHANNEL: IStackOption`
  - `src/components/ui/select-field.tsx`: `SelectField({ label, options, value, onValueChange }: { label: string; options: IStackOption[]; value: string; onValueChange: (value: string) => void })`

`WEB_CHAT_CHANNEL` is new — the current channel list has no Web Chat entry, and
§8's configurator defaults to it. Its `cliSlug` must be `web-chat` so the generated
command reads `npx novu connect --channel web-chat`, matching the Hero's CLI pill.

- [ ] **Step 1: Capture the current homepage behaviour as the baseline**

Run: `pnpm test:critical:quick -g "TC-HOME-003"`
Expected: PASS. Record the output — this exact test must still pass in Step 6.

If it fails before you change anything, stop and report: the baseline is broken and that is not this task's problem to fix.

- [ ] **Step 2: Move the option types and lists**

Create `src/data/pages/connect-stack-options.ts`. Move `IStackOption`,
`DEFAULT_CHANNELS` and `DEFAULT_FRAMEWORKS` out of
`src/components/pages/home/connect-stack.tsx` verbatim — same values, same icon
imports, same order. Do not change any label, value or `cliSlug`; the homepage
contract asserts on the generated command and prompt.

Then append the new Web Chat entry:

```ts
export const WEB_CHAT_CHANNEL: IStackOption = {
  value: "web-chat",
  label: "Web Chat",
  cliSlug: "web-chat",
  icon: webChatIcon,
}
```

Use the Web Chat channel icon already in the repo. If none exists, export it from
Figma node `45487-81559` (the channels grid, Web Chat tile) into
`src/svgs/pages/connect/channels/web-chat.svg`.

- [ ] **Step 3: Move `SelectField` and `OptionLabel`**

Create `src/components/ui/select-field.tsx` with `"use client"` at the top. Move
`OptionLabel` and `SelectField` out of `connect-stack.tsx` verbatim, keeping every
Tailwind class exactly as it is — this is a move, not a restyle. Export
`SelectField` as a named export. Keep `OptionLabel` module-private.

- [ ] **Step 4: Update both consumers**

In `src/components/pages/home/connect-stack.tsx`: delete the moved code, and import
`SelectField` from `@/components/ui/select-field` and the option types/lists from
`@/data/pages/connect-stack-options`. Re-export `IStackOption` from `connect-stack.tsx`
only if removing the re-export would break other files — prefer updating importers.

In `src/components/pages/channels/channel-connect-stack.tsx`: change the
`IStackOption` import to `@/data/pages/connect-stack-options`.

- [ ] **Step 5: Typecheck and lint**

Run: `pnpm typecheck && pnpm lint`
Expected: no new errors. A missing-import error here means a consumer was missed.

- [ ] **Step 6: Verify the homepage is unchanged**

Run: `pnpm test:critical:quick -g "TC-HOME-003"`
Expected: PASS, identical to the Step 1 baseline.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/select-field.tsx \
        src/data/pages/connect-stack-options.ts \
        src/components/pages/home/connect-stack.tsx \
        src/components/pages/channels/channel-connect-stack.tsx
git commit -m "refactor(connect): extract SelectField and stack options for reuse"
```

---

### Task 4: Brand provider and hue layer

**Files:**
- Create: `src/components/pages/channels/web-chat/brand-provider.tsx`
- Create: `src/components/pages/channels/web-chat/hue-layer.tsx`

**Interfaces:**
- Consumes: `buildBrandTheme`, `brandCssVars` (Task 1)
- Produces:
  - `type BrandStatus = "idle" | "loading" | "personalized" | "fallback"`
  - `interface WebChatBrand { status: BrandStatus; theme: BrandTheme; domain: string | null; favicon: string | null; errorMessage: string | null }`
  - `WebChatBrandProvider({ children }: { children: ReactNode })`
  - `useWebChatBrand(): WebChatBrand & { personalize: (url: string) => Promise<void>; reset: () => void }`
  - `HueLayer({ className }: { className?: string })`

Notes for the implementer:

- The provider renders a `<div>` carrying `style={brandCssVars(theme)}` and
  `data-wc-state={status}`, plus `isolation: isolate` so `HueLayer` cannot bleed
  onto the page background.
- `personalize` sets `status: "loading"`, POSTs `{ url }` as JSON to
  `/api/agent-preview`, and on a 2xx reads `{ brand: { accent, domain, logo } }`.
  On success: `status: "personalized"`, theme from `buildBrandTheme(brand.accent)`,
  `domain` and `favicon` from the response. On any non-2xx, network error, or a
  response with no usable accent: `status: "fallback"`, theme
  `buildBrandTheme(null)`, `errorMessage` set to the copy in Task 5.
- `personalize` must never throw. Callers rely on it resolving so the storyboard
  can start regardless of the outcome.
- `reset` returns to `status: "idle"`, the default theme, and null domain/favicon.
- `HueLayer` is `absolute inset-0 pointer-events-none` with
  `background: var(--wc-hue)` and `mixBlendMode: "hue"`, at opacity 0 when
  `data-wc-state` is `idle` or `fallback` and 1 otherwise. Drive that from the
  attribute in CSS rather than from React state, so it costs no re-render.

- [ ] **Step 1: Write the provider**

Implement to the interface above. Keep the fetch in a `useCallback` and guard
against a stale response overwriting a newer one (an ignore flag or an
`AbortController`) — a visitor can submit twice.

- [ ] **Step 2: Write the hue layer**

Implement to the interface above.

- [ ] **Step 3: Typecheck and lint**

Run: `pnpm typecheck && pnpm lint`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/channels/web-chat/brand-provider.tsx \
        src/components/pages/channels/web-chat/hue-layer.tsx
git commit -m "feat(web-chat): add brand provider and hue overlay"
```

---

### Task 5: URL personalizer and fallback alert **[visual]**

**Files:**
- Create: `src/components/pages/channels/web-chat/url-personalizer.tsx`
- Create: `src/components/pages/channels/web-chat/brand-alert.tsx`

**Figma:** `url-states` node `45487-94047` (desktop, four states); mobile card in
`hero-360 (pesronalization-fallback)` node `45509-163367`; alert in the same node.

**Interfaces:**
- Consumes: `useWebChatBrand` (Task 4)
- Produces:
  - `UrlPersonalizer({ onSubmit }: { onSubmit: (url: string) => void })`
  - `BrandAlert({ message }: { message: string })`

**Exact values from the frame:**

- Container: background `#000000`, border `rgba(255,255,255,0.1)` 1px, radius 40px,
  padding `12px 20px 12px 12px`, gap 20px, shadow
  `0 12px 56px rgba(0,0,0,0.64), 0 4px 28px rgba(0,0,0,0.35)`
- Input placeholder: `yourdomain.com`
- Submit button label: `See it in your product`
- Reset icon: 24×24, opacity 0.4 default, 1.0 on hover
- Caption below the component: `Live and interactive. Paste your site to see the agent in your product.`
- Alert: background `rgba(255,152,186,0.2)`, text `#FF98BA`, radius 96px, padding
  `8px 16px 8px 8px`, gap 8px, 20×20 ⓘ glyph, font-size 15, line-height 1.38em,
  letter-spacing -0.025em, centred
- Alert copy, verbatim: `We couldn't load your brand styles. Showing the default preview.`

**Two layouts, not one that wraps:**

- Desktop (`md` and up): a single pill — input, submit, reset icon in one row.
- Mobile: a rounded dark card with two rows — full-width input on top, then a row
  of the submit button filling the width with the reset icon beside it.

**Behaviour:**

- Submitting calls `onSubmit(value)` and must not reload the page.
- The submit button is disabled while `status === "loading"`.
- The reset control calls `reset()` from the provider and clears the input.
- Once personalized the input keeps what the visitor typed. The Figma frame showing
  the placeholder mid-storyboard is stale (see the spec's mismatch section).
- `BrandAlert` renders with `role="status"`.

- [ ] **Step 1: Invoke `figma-to-code` for node `45487-94047`**

Follow its workflow to produce the diff table and the Tailwind mapping for all four
states before writing markup.

- [ ] **Step 2: Build `BrandAlert`**

Use the exact values above.

- [ ] **Step 3: Build `UrlPersonalizer`**

Use a real `<form>` with `onSubmit` and `preventDefault`, a labelled `<input>` (a
visually hidden label is fine — do not ship an unlabelled input), and the existing
`Button` from `@/components/ui/button` for the submit control.

- [ ] **Step 4: Verify against the frames**

Run: `pnpm dev`, open `/channels/web-chat` once Task 8 has mounted it, or render the
component in isolation. Check all four desktop states and the mobile card against
nodes `45487-94047` and `45509-163367`.

- [ ] **Step 5: Typecheck and lint**

Run: `pnpm typecheck && pnpm lint`

- [ ] **Step 6: Commit**

```bash
git add src/components/pages/channels/web-chat/url-personalizer.tsx \
        src/components/pages/channels/web-chat/brand-alert.tsx
git commit -m "feat(web-chat): add URL personalizer and fallback alert"
```

---

### Task 6: Hero product UI **[visual]**

**Files:**
- Create: `src/components/pages/channels/web-chat/hero-product-ui.tsx`
- Modify: `src/data/pages/web-chat.ts` (create it here if Task 7 has not yet)

**Figma:** default state in `hero-section` node `45487-79055`; personalized state in
`hero-personalization-05-recent.dev` node `45487-89814`; transition state in
`hero-personalization-00(transition)-recent.dev` node `45487-94116`; mobile
composition in node `45487-112573`.

**Interfaces:**
- Consumes: `useWebChatBrand` (Task 4), `HueLayer` (Task 4), `StoryboardStep` (Task 2)
- Produces: `HeroProductUI({ step, isPersonalized }: { step: StoryboardStep | null; isPersonalized: boolean })` — `step: null` means the pre-submit default state.

**Content, in `src/data/pages/web-chat.ts`:**

```ts
export const HERO_DEFAULT_DOMAIN = "yourdomain.com"
export const HERO_DEFAULT_COMPANY = "Your company"

export const HERO_SIDEBAR_DEFAULT = {
  items: ["Overview", "Data", "Automations", "Users", "Integrations", "Settings"],
  expanded: { under: "Data", items: ["Sources", "Records", "Activity"] },
  activeItem: "Sources",
} as const

export const HERO_TABLE_DEFAULT = {
  title: "Data sources",
  columns: ["Source", "Last updated", "Status"],
  rows: [
    { name: "User profiles", updated: "2 min ago", status: "Synced" },
    { name: "Form submissions", updated: "12 min ago", status: "Needs review" },
    { name: "Content library", updated: "8 min ago", status: "Synced" },
    { name: "Activity events", updated: "1 hr ago", status: "Processing" },
    { name: "Messages", updated: "Yesterday", status: "Paused" },
    { name: "Uploaded files", updated: "Yesterday", status: "Synced" },
  ],
} as const

export const HERO_TABLE_PERSONALIZED = {
  title: "Form submissions",
  columns: ["Submission", "Submitted", "Status"],
  selectedRow: "Contact form #1048",
  rows: [
    { name: "Contact form #1048", updated: "12 min ago", status: "Needs review" },
    { name: "Newsletter signup #1047", updated: "18 min ago", status: "Complete" },
    { name: "Support request #1046", updated: "32 min ago", status: "Complete" },
    { name: "Feedback form #1045", updated: "46 min ago", status: "Complete" },
    { name: "General inquiry #1044", updated: "1 hr ago", status: "Complete" },
    { name: "Callback request #1042", updated: "2 hr ago", status: "Complete" },
    { name: "Summit Works", updated: "Yesterday", status: "Complete" },
  ],
} as const
```

The table controls above the rows are `Search`, `Status` and `View`. Rows fade out
toward the bottom of the panel in both states.

**Behaviour by step:**

| `step` | Table | Content blur | Labels |
| --- | --- | --- | --- |
| `null` | `HERO_TABLE_DEFAULT` | none | `yourdomain.com`, `Your company`, generic mark |
| `0` | swaps to `HERO_TABLE_PERSONALIZED` after the blur | blurs, then clears | swap per `isPersonalized` |
| `1`–`5` | `HERO_TABLE_PERSONALIZED`, selected row tinted with `--wc-accent-soft` and its checkbox filled `--wc-accent` | none | per `isPersonalized` |

**Why `isPersonalized` is a separate prop from `step`:** the table swap and the
conversation are driven by `step` and must happen even on the fallback path, but the
*labels* can only change when extraction actually succeeded — in fallback there is no
domain or favicon to show. So:

- `isPersonalized: true` → browser-chrome domain, sidebar favicon and the sidebar
  `Your company` label all become the entered domain, per the spec. The frames that
  still show `Your company` are stale.
- `isPersonalized: false` → labels stay `yourdomain.com`, `Your company` and the
  generic mark, while the table and conversation still advance.

Derive it in the Hero as `status === "personalized"`, not from `step`.

The active sidebar item (`Sources`) is filled with `--wc-accent` and its label uses
`--wc-accent-foreground`.

- [ ] **Step 1: Invoke `figma-to-code` for node `45487-79055`, then `45487-89814`**

Produce the diff table for both states before writing markup, so the shared
structure is clear and only the data and accents differ.

- [ ] **Step 2: Add the content to `src/data/pages/web-chat.ts`**

Use the block above verbatim.

- [ ] **Step 3: Build `HeroProductUI`**

Render browser chrome, sidebar and table from the data. Drive every accent from the
CSS variables — no hardcoded purple. Wrap the ambient background in `HueLayer` with
`isolation: isolate` on its host.

- [ ] **Step 4: Build the mobile composition**

Per node `45487-112573`: the panel bleeds off the left edge at roughly 60/40
dashboard-to-agent-panel. This is its own composition, not a scaled desktop.

- [ ] **Step 5: Verify against the frames**

Compare the default, transition and personalized states against nodes `45487-79055`,
`45487-94116` and `45487-89814`, at desktop and at 360px.

- [ ] **Step 6: Typecheck and lint**

Run: `pnpm typecheck && pnpm lint`

- [ ] **Step 7: Commit**

```bash
git add src/components/pages/channels/web-chat/hero-product-ui.tsx \
        src/data/pages/web-chat.ts
git commit -m "feat(web-chat): add hero product UI with both table states"
```

---

### Task 7: Hero agent panel **[visual]**

**Files:**
- Create: `src/components/pages/channels/web-chat/hero-agent-panel.tsx`
- Modify: `src/data/pages/web-chat.ts`

**Figma:** empty state in node `45487-79055`; message states across
`hero-personalization-01`…`-05` (nodes `45487-87013`, `45487-87703`, `45487-88406`,
`45487-89109`, `45487-89814`).

**Interfaces:**
- Consumes: `StoryboardStep` (Task 2), `useWebChatBrand` (Task 4)
- Produces: `HeroAgentPanel({ step }: { step: StoryboardStep | null })`

**Content, appended to `src/data/pages/web-chat.ts`:**

```ts
export const HERO_AGENT_EMPTY_STATE = {
  title: "Ask about your workspace",
  body: "The agent understands what's on screen, finds relevant data, and can take action in your product.",
} as const

export const HERO_COMPOSER_PLACEHOLDER = "Message the agent ..."

export const HERO_PANEL_TITLE = "Your Agent"

/** Which storyboard step each message first appears on. */
export const HERO_MESSAGES = [
  { step: 1, role: "user", text: "Why does this form submission need review?" },
  {
    step: 3,
    role: "agent",
    text: "Should I check the missing fields or review the full submission?",
  },
  { step: 4, role: "user", text: "Missing fields" },
  {
    step: 5,
    role: "agent",
    text: "In this form (#1048), the Email field is not filled out.",
  },
] as const

/** Shown inside the step-5 agent message. */
export const HERO_FIELD_TABLE = {
  rows: [
    { label: "Full name", value: "Jordan Lee", missing: false },
    { label: "Email address", value: "Not provided", missing: true },
    { label: "Phone number", value: "+1 415 555 0148", missing: false },
    { label: "Message", value: "I'd like to learn more", missing: false },
  ],
} as const
```

**Behaviour:**

- `step: null` → empty state: the orb, the title and body above, and the composer.
- Step 0 → the panel is desaturated (grayscale) and carries no messages.
- Steps 1–5 → every message whose `step` is at or below the current step is
  visible. Step 2 additionally shows an "Agent is thinking" indicator, which
  disappears once step 3 lands.
- Each message enters from blurred-and-transparent to sharp. **Reuse the existing
  curve** rather than inventing one: `ENTER_FROM` → `VISIBLE` in
  `src/components/pages/connect/focus-blur-text-cycle.tsx` (blur 14px, opacity 0,
  `translate3d(0, 8.12px, 0) scale(1.01)` → blur 0, opacity 1, identity), easing
  `cubic-bezier(0.22, 1, 0.36, 1)`. Duration comes from
  `STORYBOARD_TIMING.messageRevealMs`.
- User bubbles fill with `--wc-accent` and text `--wc-accent-foreground`. Agent
  replies are plain text on the panel background. The send button and the avatar
  ring use `--wc-accent`.
- In `HERO_FIELD_TABLE`, the row with `missing: true` is highlighted and its value
  rendered in the design's red.
- Under `prefers-reduced-motion` render the step-5 state with no transitions.

- [ ] **Step 1: Invoke `figma-to-code` for node `45487-89814`**

Extract the panel's message and field-table styling.

- [ ] **Step 2: Add the content to `src/data/pages/web-chat.ts`**

Use the block above verbatim.

- [ ] **Step 3: Build `HeroAgentPanel`**

- [ ] **Step 4: Verify against the frames**

Step through nodes `45487-87013` → `45487-89814` and confirm each message appears on
the right step, and that the grayscale state at step 0 matches node `45487-94116`.

- [ ] **Step 5: Typecheck and lint**

Run: `pnpm typecheck && pnpm lint`

- [ ] **Step 6: Commit**

```bash
git add src/components/pages/channels/web-chat/hero-agent-panel.tsx \
        src/data/pages/web-chat.ts
git commit -m "feat(web-chat): add hero agent panel with the message script"
```

---

### Task 8: Hero composition, storyboard hook, and page mount

This is the Phase 1 milestone. At the end of it the new Hero is live, the old hero
is gone, Remotion is gone, and the three headline behaviours are covered by
Playwright.

**Files:**
- Create: `src/components/pages/channels/web-chat/use-storyboard.ts`
- Create: `src/components/pages/channels/web-chat/hero.tsx`
- Modify: `src/app/(website)/(connect-footer)/channels/web-chat/page.tsx`
- Modify: `src/data/pages/web-chat.ts`
- Modify: `package.json`
- Modify: `tests/critical-flows/contracts.ts`
- Create: `tests/critical-flows/web-chat.spec.ts`
- Delete: `src/components/pages/channels/agent-in-product.tsx`
- Delete: `src/components/pages/channels/agent-preview-player.tsx`
- Delete: `src/components/pages/channels/agent-preview-composition.tsx`

**Figma:** hero copy in `title` node `45487-79692`; hero meta and CTAs in
`typography` node `45487-111212`; mobile order in node `45509-163367`.

**Interfaces:**
- Consumes: everything from Tasks 1, 2, 4, 5, 6, 7
- Produces:
  - `useStoryboard({ isRunning, isInView }: { isRunning: boolean; isInView: boolean }): StoryboardStep | null`
  - `WebChatHero()`

**Hero copy, exact:**

- Badge: 8×8 `#C25CD6` square + `WEB CHAT`, colour `#F5CFFC`, Inter Medium 13, line-height 1em, uppercase
- H1: `Your agent, live inside your product` — Inter Regular 56, line-height 1.04em, letter-spacing -0.04em, white, column width 557px on desktop
- Description: `Web Chat uses product context, takes action, and continues conversations across channels. Live in two minutes.` — 18px, line-height 1.5em, letter-spacing -0.025em, `rgba(255,255,255,0.8)`
- Meta line: `~40K GitHub stars · open source · no OAuth to install.` then `Choose the CLI or Copy Prompt (recommended).` — 15px, line-height 1.38em, letter-spacing -0.025em, `rgba(255,255,255,0.4)`
- Primary button: `Copy Prompt`
- CLI pill: `npx novu connect --channel web-chat`
- Tooltip on the primary button: `Paste this prompt into Claude, Cursor, or Codex — your coding agent will set up Web Chat for you.` plus a link `How agent onboarding works →`

**Layout:** desktop is two columns — title/description left, meta line above
`Copy Prompt` + CLI pill on the right. Mobile stacks as badge → h1 → description →
CLI pill → `Copy Prompt` → meta line. The CTA order flips and the meta line moves
below; this is the frame's order, not a reflow accident.

**`useStoryboard` contract:**

- Returns `null` until `isRunning` is true, then the current `StoryboardStep`.
- Uses `initialStoryboardState` / `advanceStoryboard` from Task 2 with a `setTimeout`
  of `state.dwellMs`. No frame loop, no `setInterval`.
- Pauses when `isInView` is false and resumes from the same step.
- Under `useReducedMotion` returns `5` immediately once `isRunning` and never
  advances.
- Clears its timer on unmount and on `isRunning` going false.

- [ ] **Step 1: Write the hook and the hero**

`WebChatHero` holds `isRunning` state, uses `useInView` for `isInView`, renders the
copy above, `HeroProductUI`, `HeroAgentPanel`, `UrlPersonalizer` and — when
`status === "fallback"` — `BrandAlert`. Submitting sets `isRunning` to true **and**
calls `personalize(url)`. Do not await the fetch before starting; a failed or slow
extraction must not delay or block the animation. Reset sets `isRunning` false.

Reuse `CopyPromptButton` from `@/components/pages/home/copy-prompt-button` for
`Copy Prompt`, `CopyCommand` from `@/components/ui/copy-command` for the CLI pill,
and `Reveal` from `@/components/pages/channels/web-chat-reveal` for the scroll
entrance. That file stays where it is — do not move it into the `web-chat/`
directory, since nothing else in this plan touches it.

- [ ] **Step 2: Mount it and drop the old hero**

In `page.tsx`, replace the hero `<section>` and the `AgentInProduct` usage with
`<WebChatBrandProvider><WebChatHero /></WebChatBrandProvider>`. Leave every other
section as it is for now. Delete `agent-in-product.tsx`,
`agent-preview-player.tsx` and `agent-preview-composition.tsx`, and remove their
imports.

- [ ] **Step 3: Remove Remotion**

```bash
pnpm remove remotion @remotion/player
```

- [ ] **Step 4: Verify nothing still references the deleted files**

```bash
grep -rn "agent-in-product\|agent-preview-player\|agent-preview-composition\|remotion" src package.json
```
Expected: no matches.

- [ ] **Step 5: Add the contract entry**

In `tests/critical-flows/contracts.ts`, following the shape of the existing
`channelPagesContract`:

```ts
export const webChatContract = {
  ...monitorContract,
  id: "TC-WEBCHAT-001",
  priority: "P0",
  mode: "submit",
  route: "/channels/web-chat",
  heading: "Your agent, live inside your product",
  command: "npx novu connect --channel web-chat",
  domain: "recent.dev",
  accent: "#e65006",
  submitLabel: "See it in your product",
  firstMessage: "Why does this form submission need review?",
  defaultTableTitle: "Data sources",
  personalizedTableTitle: "Form submissions",
  fallbackAlert:
    "We couldn't load your brand styles. Showing the default preview.",
} as const
```

- [ ] **Step 6: Write the failing E2E spec**

```ts
// tests/critical-flows/web-chat.spec.ts
import { expect, test } from "@playwright/test"

import { webChatContract } from "./contracts"
import {
  expectHealthyPage,
  gotoCriticalPage,
  observeApplicationErrors,
} from "./helpers"

const PREVIEW_ROUTE = "**/api/agent-preview"

test.describe("web chat personalizer", () => {
  test(`[${webChatContract.id}] personalizes the hero and plays the conversation`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)

    await page.route(PREVIEW_ROUTE, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          brand: {
            url: `https://${webChatContract.domain}`,
            domain: webChatContract.domain,
            name: "Recent",
            description: "",
            accent: webChatContract.accent,
            logo: null,
          },
        }),
      })
    )

    await gotoCriticalPage(page, webChatContract.route)

    await expect(
      page.getByRole("heading", { level: 1, name: webChatContract.heading })
    ).toBeVisible()
    await expect(
      page.getByText(webChatContract.defaultTableTitle, { exact: true })
    ).toBeVisible()

    await page.getByRole("textbox", { name: /site|domain|url/i }).fill(
      webChatContract.domain
    )
    await page
      .getByRole("button", { name: webChatContract.submitLabel })
      .click()

    await expect(
      page.getByText(webChatContract.personalizedTableTitle, { exact: true })
    ).toBeVisible()
    await expect(
      page.getByText(webChatContract.firstMessage)
    ).toBeVisible()

    const accent = await page
      .locator("[data-wc-state]")
      .first()
      .evaluate((node) =>
        getComputedStyle(node).getPropertyValue("--wc-accent").trim()
      )
    expect(accent).toBe(webChatContract.accent)

    expectHealthyPage(applicationErrors)
  })

  test(`[${webChatContract.id}] keeps the default theme and still animates when extraction fails`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)

    await page.route(PREVIEW_ROUTE, (route) =>
      route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({ error: true, message: "Could not read that site" }),
      })
    )

    await gotoCriticalPage(page, webChatContract.route)

    await page
      .getByRole("textbox", { name: /site|domain|url/i })
      .fill(webChatContract.domain)
    await page
      .getByRole("button", { name: webChatContract.submitLabel })
      .click()

    await expect(
      page.getByRole("status").filter({ hasText: webChatContract.fallbackAlert })
    ).toBeVisible()

    // The spec is explicit: a personalization failure must not block the animation.
    await expect(page.getByText(webChatContract.firstMessage)).toBeVisible()

    expectHealthyPage(applicationErrors)
  })

  test(`[${webChatContract.id}] reset returns the hero to its default state`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)

    await page.route(PREVIEW_ROUTE, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          brand: {
            url: `https://${webChatContract.domain}`,
            domain: webChatContract.domain,
            name: "Recent",
            description: "",
            accent: webChatContract.accent,
            logo: null,
          },
        }),
      })
    )

    await gotoCriticalPage(page, webChatContract.route)

    await page
      .getByRole("textbox", { name: /site|domain|url/i })
      .fill(webChatContract.domain)
    await page
      .getByRole("button", { name: webChatContract.submitLabel })
      .click()
    await expect(
      page.getByText(webChatContract.personalizedTableTitle, { exact: true })
    ).toBeVisible()

    await page.getByRole("button", { name: /reset/i }).click()

    await expect(
      page.getByText(webChatContract.defaultTableTitle, { exact: true })
    ).toBeVisible()
    await expect(page.getByText(webChatContract.firstMessage)).toBeHidden()

    expectHealthyPage(applicationErrors)
  })
})
```

- [ ] **Step 7: Run the spec to verify it fails for the right reason**

Run: `pnpm test:critical:quick -g "TC-WEBCHAT-001"`
Expected: FAIL on a missing element, not on a page error or a 500. If the page
itself errors, fix that before reading the assertions.

- [ ] **Step 8: Make the spec pass**

Adjust the accessible names in the component (not in the test) until the role-based
queries resolve: the URL input needs an accessible name matching `/site|domain|url/i`
and the reset control needs one matching `/reset/i`. If a query cannot be satisfied
without contorting the markup, change the test's selector and say why in the commit
message.

- [ ] **Step 9: Run the full gate**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm test:critical:quick`
Expected: all pass. Report any pre-existing failures separately rather than folding
them into this task.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(web-chat): rebuild the hero with the live brand personalizer

Replaces the Remotion-driven preview with a motion-based storyboard, adds the
URL personalizer with its fallback path, and drops remotion + @remotion/player."
```

- [ ] **Step 11: Phase 1 checkpoint — stop and report**

Run `pnpm dev` and walk the Hero at desktop and 360px: default state, submit,
transition, all four messages, the loop back to message one, the fallback alert, and
reset. Report what matches the frames and what does not before starting Phase 2.
Phase 1 is shippable on its own; the sections below the Hero are still the old ones.

---

# Phase 2 — The remaining sections

Each task replaces one old section with its Figma counterpart. The page stays
renderable after every commit.

---

### Task 9: §2 comparison bento **[visual]**

**Files:**
- Create: `src/components/pages/channels/web-chat/compare-bento.tsx`
- Modify: `src/app/(website)/(connect-footer)/channels/web-chat/page.tsx`
- Modify: `src/data/pages/web-chat.ts`

**Figma:** desktop node `45487-79779`; personalized reference node `45503-149553`;
mobile in node `45487-112573` (lower half).

**Interfaces:**
- Consumes: `HueLayer` (Task 4), `WebChatBrandProvider` context (Task 4)
- Produces: `CompareBento()`

**Exact copy:**

- Heading: `You know the old chat widget. This is Web Chat`
- Description: `Old widgets follow scripts and create tickets. Web Chat brings your AI agent into the product to understand context, act, and render real UI.`
- Card 1 title: `The old chat widget`
- Card 1 body: `Scripted replies lead to ticket forms and walls of text, losing context as soon as the user leaves.`
- Card 2 title: `Web Chat`
- Card 2 body: `Your logic and model stay yours while the agent acts inside the product, renders real UI, and continues conversations across channels.`

Card 1 illustration copy: bubble `Find creators we haven't worked with yet.`,
`Support service`, `Please submit a request.`, field value `tomas@meridian.com`,
placeholder `Describe the creators you're looking for?`

Card 2 illustration copy: bubble `Which new creator best fits our brand?`,
`The agent is thinking...`, `Using your brand memory:`, checklist
`Your target audience` / `Past campaign results` / `Creators you've worked with`,
`Agent's response`, `I compared 29 creators. AI Odyssey is the strongest match.`,
table columns `Creator` / `Reach` / `Eng.Rate` / `Price`, rows
`AI Odyssey 78K 6.0% $2.3K` (selected), `DiamantAI 35K 7.0% $8.5K`,
`Towards AI 108K 7.0% $2K`, `DevTools Weekly 64K 4.8% $1.5K`.

**Layout:** desktop is two cards, card 1 narrower than card 2, card 2's agent
response table floating over its right edge. Mobile stacks both cards full width
and card 2's table is cropped at the right edge — its own composition per the spec.

**Personalization:** both cards recolour. Illustration backgrounds get a `HueLayer`
on an `isolation: isolate` host; bubbles, the selected table row and the icons read
`--wc-accent` / `--wc-accent-soft` / `--wc-accent-foreground`.

- [ ] **Step 1: Invoke `figma-to-code` for node `45487-79779`**

- [ ] **Step 2: Export the illustrations**

Export card 1's and card 2's illustrations, plus card 2's mobile variant, into
`src/images/pages/channels/web-chat/`. Per the spec's hybrid decision the
illustration is an image; the accent elements listed above are DOM on top of it.

- [ ] **Step 3: Add the copy to `src/data/pages/web-chat.ts`**

Use the strings above verbatim.

- [ ] **Step 4: Build `CompareBento`**

- [ ] **Step 5: Replace the old section**

In `page.tsx`, delete the "A new era" section and render `<CompareBento />` inside
the brand provider in its place.

- [ ] **Step 6: Verify against the frames**

Check the default state against node `45487-79779` and the personalized state
against node `45503-149553`, at desktop and 360px. Confirm the hue overlay does not
bleed past the card.

- [ ] **Step 7: Typecheck, lint and regression**

Run: `pnpm typecheck && pnpm lint && pnpm test:critical:quick -g "TC-WEBCHAT-001"`

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(web-chat): add the comparison bento section"
```

---

### Task 10: §3 product bento **[visual]**

**Files:**
- Create: `src/components/pages/channels/web-chat/product-bento.tsx`
- Modify: `src/app/(website)/(connect-footer)/channels/web-chat/page.tsx`
- Modify: `src/data/pages/web-chat.ts`

**Figma:** desktop node `45487-79958`; personalized reference node `45503-149086`.

**Interfaces:**
- Consumes: `HueLayer` (Task 4), brand context (Task 4)
- Produces: `ProductBento()`

**Exact copy:**

- Heading: `Not a chat box on your site. An agent inside your app`
- Description: `Embedded in your product, Web Chat understands context, takes action, and responds with your own UI.`

| Card | Title | Body |
| --- | --- | --- |
| 1 | `Connects users to their profiles` | `When a user is identified, their details and conversation are linked to one subscriber profile.` |
| 2 | `Keeps every conversation` | `Review every Web Chat conversation, its messages, activity, and user context in Novu.` |
| 3 | `Works in your app's context` | `Knows the user and current task, keeping every response relevant.` |
| 4 | `Takes real actions` | `Uses your tools to update records and resolve requests with approval.` |
| 5 | `Renders your components` | `Renders your components, tool calls, and approvals directly in the thread.` |

**Layout:** row one is cards 1–2, row two is cards 3–5. Mobile stacks all five.

**Personalization:** same two mechanisms as Task 9.

- [ ] **Step 1: Invoke `figma-to-code` for node `45487-79958`**

- [ ] **Step 2: Export the five illustrations**

Into `src/images/pages/channels/web-chat/`, plus any mobile variants the 360 frame
requires.

- [ ] **Step 3: Add the copy to `src/data/pages/web-chat.ts`**

- [ ] **Step 4: Build `ProductBento`**

Consider `MagicBento` from `@/components/pages/home/magic-bento` for the hover
spotlight if the frame shows one; pass `particles={false}` for content-heavy cards.

- [ ] **Step 5: Replace the old section**

Delete the "Lives in your product" section from `page.tsx` and render
`<ProductBento />` inside the brand provider in its place.

- [ ] **Step 6: Verify against the frames**

Default against `45487-79958`, personalized against `45503-149086`, at both widths.

- [ ] **Step 7: Typecheck, lint and regression**

Run: `pnpm typecheck && pnpm lint && pnpm test:critical:quick -g "TC-WEBCHAT-001"`

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(web-chat): add the product bento section"
```

---

### Task 11: §4 side panel / full screen tabs **[visual]**

The heaviest visual task: four layouts and two message scripts. The Full screen
state is **not** a resize of Side panel — it changes the sidebar and carries a
different conversation.

**Files:**
- Create: `src/components/pages/channels/web-chat/surface-tabs.tsx`
- Modify: `src/app/(website)/(connect-footer)/channels/web-chat/page.tsx`
- Modify: `src/data/pages/web-chat.ts`
- Delete: `src/components/pages/channels/agent-center-surface.tsx`
- Delete: `src/components/pages/channels/agent-chat-showcase.tsx`

**Figma:** Side panel desktop node `45487-80419`; Full screen desktop node
`45497-141044`; Full screen mobile node `45497-139685`. Read the 360 frame
(`45487-98982`) for the Side panel mobile state.

**Interfaces:**
- Consumes: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from `@/components/ui/tabs`
- Produces: `SurfaceTabs()`

**Exact copy:**

- Heading: `Side panel or full screen. Your choice`
- Description: `Switch layouts and customize the experience with flexible components from AI Elements.`
- Button: `Explore AI elements` → `https://elements.ai-sdk.dev/`, `target="_blank"`, `rel="noreferrer"`
- Tabs: `Side panel` (default) and `Full screen`

Side panel conversation: user `What changed since my last visit?`, agent
`Should I show everything, or only changes that affect you?`, user
`Only what affects me.`, `Agent responds...`, `Here's your personalized update...`

Full screen conversation: user
`Can you check whether the new workspace is ready to launch on Monday?`, agent
`I reviewed the workspace setup, member permissions, notification workflows, and connected integrations. Most of the configuration is ready, but three items still need attention:`,
checklist `Two team members have not accepted their invitations` /
`The billing workflow has no fallback channel` /
`The production API key has not been verified`, composer showing the partially
typed `Fix what you can and prepare a summary I can share with`

Full screen sidebar: `Overview`, `Conversations` (expanded: `Launch readiness review`
active, `Q3 usage report`, `Team access review`), `Automations`, `Users`,
`Integrations`, `Settings`.

**Layout:** desktop puts heading and button left, description and tabs right.
Mobile stacks heading → button → description → tabs → illustration. Both mobile
illustrations bleed off the edges. Not personalized — this section sits outside the
brand provider.

- [ ] **Step 1: Invoke `figma-to-code` for node `45487-80419`, then `45497-141044`**

Build the diff table for both tab states before writing markup so the shared shell
is factored out and only the sidebar and script differ.

- [ ] **Step 2: Add both scripts and the sidebar data to `src/data/pages/web-chat.ts`**

Use the strings above verbatim.

- [ ] **Step 3: Build `SurfaceTabs`**

Radix `Tabs` with `defaultValue="side-panel"`. Both panels must be in the DOM order
the frames show; do not lazily mount, so the tab switch is instant.

- [ ] **Step 4: Build both mobile compositions**

Per nodes `45497-139685` and `45487-98982`. Each mode has its own geometry.

- [ ] **Step 5: Replace the old section and delete the superseded components**

Delete the "Ship it your way" section and the `AgentCenterSurface` import from
`page.tsx`, render `<SurfaceTabs />` in its place, then delete
`agent-center-surface.tsx` and `agent-chat-showcase.tsx`.

- [ ] **Step 6: Verify nothing still references them**

```bash
grep -rn "agent-center-surface\|agent-chat-showcase" src
```
Expected: no matches.

- [ ] **Step 7: Verify against the frames**

All four layouts. Confirm switching tabs swaps both the sidebar and the
conversation.

- [ ] **Step 8: Typecheck, lint and regression**

Run: `pnpm typecheck && pnpm lint && pnpm test:critical:quick -g "TC-WEBCHAT-001"`

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(web-chat): add the side panel / full screen section"
```

---

### Task 12: §5 channels grid **[visual]**

**Files:**
- Create: `src/components/pages/channels/web-chat/channels-grid.tsx`
- Modify: `src/app/(website)/(connect-footer)/channels/web-chat/page.tsx`
- Modify: `src/data/pages/web-chat.ts`

**Figma:** node `45487-81559`.

**Interfaces:**
- Consumes: channel icons from `src/svgs/pages/connect/channels/`, `CopyCommand` from `@/components/ui/copy-command`
- Produces: `ChannelsGrid()`

**Exact copy:**

- Heading: `Your agent starts in-app and continues across every connected channel` — Inter Regular 48, line-height 1.04em, letter-spacing -0.04em, white, column width 544px. The frame breaks it after `in-app` and after `across`.
- Description: `Novu Connect, our Agent Communication Infrastructure (ACI), keeps the same agent and conversation across your product and every channel, without code changes. Choose a channel to learn how to connect it.` — 16px, line-height 1.5em, letter-spacing -0.025em, `#A3A6B2` (`text-gray-70`), width 483px
- Actions: `Book a demo` → `ROUTE.bookADemoConnect`, white fill, radius 6px, padding `14px 20px`, Inter Medium 16; then the CLI pill `npx novu connect` — 232×44, black fill, border `#41434D` 1px, radius 6px, Geist Mono 16, with a 16×16 copy icon

**Layout:** a 3×3 grid on the left — `Telegram`, `MS Teams`, `Email`, `iMessage`,
`Slack`, `WhatsApp`, then a two-wide mascot card and a `Web Chat` tile. Right column
carries heading, description and the two actions. Each channel tile links to its
channel page; `Web Chat` is the current page, so render it as the active tile rather
than a link.

- [ ] **Step 1: Invoke `figma-to-code` for node `45487-81559`**

- [ ] **Step 2: Add the copy to `src/data/pages/web-chat.ts`**

Use the strings above verbatim.

- [ ] **Step 3: Build `ChannelsGrid`**

Reuse the existing channel icons rather than re-exporting them. For the mascot card,
check `src/components/pages/home/connect-mascot-eyes.tsx` before building a new one.

- [ ] **Step 4: Replace the old section**

Delete the "Same agent, every channel" section from `page.tsx` and render
`<ChannelsGrid />` in its place.

- [ ] **Step 5: Verify against the frame**

- [ ] **Step 6: Typecheck, lint and regression**

Run: `pnpm typecheck && pnpm lint && pnpm test:critical:quick -g "TC-WEBCHAT-001"`

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(web-chat): add the channels grid section"
```

---

### Task 13: §6 Deploy the ACI, with framework logo cycling **[visual]**

**Files:**
- Create: `src/components/pages/channels/web-chat/deploy-aci.tsx`
- Create: `src/components/pages/channels/web-chat/framework-logo-cycle.tsx`
- Modify: `src/app/(website)/(connect-footer)/channels/web-chat/page.tsx`
- Modify: `src/data/pages/web-chat.ts`
- Delete: `src/components/pages/channels/aci-package.tsx`

**Figma:** section node `45487-81046`; logo set node `45497-146963`; mobile
illustration in node `45487-98982`.

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces:
  - `DeployAci()`
  - `FrameworkLogoCycle({ direction }: { direction?: "up" | "down" })` — default `"up"`

**Exact copy:**

- Heading: `Deploy the ACI, not just chat`
- Description: `Add your agent. ACI handles identity, threads, delivery, compliance, and scale. Production-ready in under two minutes.`
- Illustration labels: `Your agent` / `Your stack`, and `ACI LAYER`
- Compliance badges: SOC 2 Type II, ISO 27001, GDPR, HIPAA

| Item | Body |
| --- | --- |
| `Identity & subscribers` | `Every user identified and secured with HMAC. No auth or user store to build.` |
| `One durable thread` | `Context and history follow each user across every channel, on their own subscriber.` |
| `Delivery that lands` | `Retries, fallbacks, and deliverability from four years of notification infrastructure.` |
| `Compliance, built in` | `SOC 2 Type II, HIPAA, ISO 27001, and GDPR, in US and EU data regions.` |
| `Scale from day one` | `The same rails the open-source Novu, ~40K GitHub stars, runs in production.` |

**Logo cycle behaviour, from the spec:** logos travel through the central black
plate; the centred logo reaches full opacity, holds ~3s, then exits and fades out.
Desktop travel is vertical, mobile is horizontal left-to-right. Entry → centre →
exit must stay sequential — never two logos at the centre at once. Vertical
direction is unsettled by the designer, hence the `direction` prop with a constant
default; speed and fade are tuned at the first preview, so put those durations in
one exported constant beside the component.

- [ ] **Step 1: Invoke `figma-to-code` for node `45487-81046`**

- [ ] **Step 2: Export the illustration and the logo set**

The illustration goes to `src/images/pages/channels/web-chat/` as an image per the
hybrid decision. Export the logo set from node `45497-146963` as individual SVGs
into `src/svgs/pages/channels/web-chat/frameworks/`. Also export the mobile
vertical-composition illustration.

- [ ] **Step 3: Add the copy to `src/data/pages/web-chat.ts`**

- [ ] **Step 4: Build `FrameworkLogoCycle`**

Position it over the illustration's "Your agent / Your stack" plate. Use
`motion/react`. Respect `prefers-reduced-motion` by rendering one static logo.

- [ ] **Step 5: Build `DeployAci`**

Illustration plus `FrameworkLogoCycle`, then the compliance badge row and the
five items.

- [ ] **Step 6: Replace the old section and delete `aci-package.tsx`**

Delete the "ACI package" section and its import from `page.tsx`, render
`<DeployAci />`, then delete `aci-package.tsx`.

```bash
grep -rn "aci-package" src
```
Expected: no matches.

- [ ] **Step 7: Verify against the frame**

Watch a full logo cycle and confirm entry → centre → exit never overlaps at the
centre.

- [ ] **Step 8: Typecheck, lint and regression**

Run: `pnpm typecheck && pnpm lint && pnpm test:critical:quick -g "TC-WEBCHAT-001"`

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(web-chat): add the deploy-the-ACI section with logo cycling"
```

---

### Task 14: §7 design system showcase **[visual]**

**Files:**
- Create: `src/components/pages/channels/web-chat/design-system-showcase.tsx`
- Modify: `src/app/(website)/(connect-footer)/channels/web-chat/page.tsx`
- Modify: `src/data/pages/web-chat.ts`
- Delete: `src/components/pages/channels/chat-theme-showcase.tsx`

**Figma:** node `45487-82563`.

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces: `DesignSystemShowcase()`

**Exact copy:**

- Heading: `Works with your design system. Ship to production`
- Description: `Web Chat is a flexible React hook, not a fixed widget. Style it with your own components or any compatible library to match your brand.`
- Buttons: `Start building` → `ROUTE.connect`; `Explore AI elements` → `https://elements.ai-sdk.dev/`
- Centre surface title: `Product Assistant`, composer placeholder `Enter a message...`

Centre conversation: user `Can you move my product demo to Thursday afternoon?`,
agent `Sure — I found your 2 PM booking. Move it to Thursday at 3:30?`, user
`Yes, and invite Maya from my team.`, `Agent is typing...`, agent
`Done — the demo is rescheduled, and Maya has been added.` with a `View...` link.

Left surface (amber): `Your Pro plan renews on October 18.` /
`No changes are currently scheduled.`, user
`Can you switch me to annual billing and keep my current features?`,
`Agent is typing...`, `Yes — your current features will stay the same.`,
`Updating your subscription` with checklist `Checked plan eligibility` /
`Preserved current features` / `Calculated annual...`

Right surface (blue): user `Can you give Maya access to the analytics dashboard?`,
agent `I found Maya Chen in your workspace. Should I add her as a Viewer?`, user
`Yes, and let her know in Slack!`, agent
`Done — Maya has Viewer access, and the Slack message was sent.`

**Layout:** three themed surfaces, centre one prominent and overlapping the two
behind it. Not personalized — its three themes are fixed, and that is the point of
the section. Read the mobile treatment from node `45487-98982`.

- [ ] **Step 1: Invoke `figma-to-code` for node `45487-82563`**

- [ ] **Step 2: Add the three scripts to `src/data/pages/web-chat.ts`**

- [ ] **Step 3: Build `DesignSystemShowcase`**

Start from `chat-theme-showcase.tsx` — it already models per-theme chat surfaces —
and refit it to this layout rather than starting blank.

- [ ] **Step 4: Replace the old section and delete `chat-theme-showcase.tsx`**

```bash
grep -rn "chat-theme-showcase" src
```
Expected: no matches.

- [ ] **Step 5: Verify against the frame**

- [ ] **Step 6: Typecheck, lint and regression**

Run: `pnpm typecheck && pnpm lint && pnpm test:critical:quick -g "TC-WEBCHAT-001"`

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(web-chat): add the design system showcase section"
```

---

### Task 15: §8 configurator **[visual]**

**Files:**
- Create: `src/components/pages/channels/web-chat/configurator.tsx`
- Modify: `src/app/(website)/(connect-footer)/channels/web-chat/page.tsx`
- Modify: `src/data/pages/web-chat.ts`
- Modify: `tests/critical-flows/contracts.ts`
- Modify: `tests/critical-flows/web-chat.spec.ts`

**Figma:** section node `45487-81721`; open dropdown node `45497-147645`; CLI tab
node `45501-148681`.

**Interfaces:**
- Consumes: `SelectField`, `IStackOption`, `DEFAULT_FRAMEWORKS`, `WEB_CHAT_CHANNEL`, `DEFAULT_CHANNELS` (Task 3); `buildFrameworkChannelConnectPrompt` from `@/lib/connect-prompt`; `CopyPromptButton`
- Produces: `WebChatConfigurator()`

**Exact copy:**

- Heading: `Build your connection. Ship it from any builder.`
- Description: `Choose Web Chat and your framework. Copy the generated prompt or CLI command to connect your agent.`
- Card title: `Configure your agent`
- Card subtitle: `Pick a channel and framework.`
- Tabs: `AI prompt` (default) and `CLI command`
- Select labels: `Communication channel` (default `Web Chat`), `AI framework` (default `Vercel AI SDK`)
- Result labels: `Prompt` in the AI prompt tab, `CLI command` in the CLI tab
- Primary button: `Copy prompt` in the AI prompt tab, `Copy CLI command` in the CLI tab
- Builder logos: Lovable, Base44, bolt.new — read the full set from the frame

**Behaviour, from the spec:** switching tabs changes the result content **and** the
primary button together. The copied value always matches the active tab and the
current selections. Prompt and CLI must never mix. Derive the prompt with
`buildFrameworkChannelConnectPrompt` and the command as
`npx novu connect --channel <channelSlug> --runtime <frameworkSlug>`, matching
`ConnectStack`'s existing derivation exactly.

- [ ] **Step 1: Invoke `figma-to-code` for node `45487-81721`, then `45501-148681` and `45497-147645`**

- [ ] **Step 2: Export the blob illustration**

To `src/images/pages/channels/web-chat/`.

- [ ] **Step 3: Add the copy to `src/data/pages/web-chat.ts`**

- [ ] **Step 4: Build `WebChatConfigurator`**

Channel options are `[WEB_CHAT_CHANNEL, ...DEFAULT_CHANNELS]` with `web-chat` as the
default value; framework options are `DEFAULT_FRAMEWORKS` defaulting to `ai-sdk`.

- [ ] **Step 5: Replace the old section**

Delete the "Works anywhere" / copy-prompt section from `page.tsx` and render
`<WebChatConfigurator />` in its place.

- [ ] **Step 6: Extend the contract**

Add to `webChatContract` in `tests/critical-flows/contracts.ts`:

```ts
  configuratorHeading: "Build your connection. Ship it from any builder.",
  configuratorCommand:
    "npx novu connect --channel web-chat --runtime ai-sdk",
  configuratorPromptTab: "AI prompt",
  configuratorCliTab: "CLI command",
  configuratorCopyPrompt: "Copy prompt",
  configuratorCopyCli: "Copy CLI command",
```

- [ ] **Step 7: Add the failing configurator test**

Append to `tests/critical-flows/web-chat.spec.ts`:

```ts
test(`[${webChatContract.id}] configurator switches result and action together`, async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page)

  await gotoCriticalPage(page, webChatContract.route)

  await expect(
    page.getByRole("heading", { name: webChatContract.configuratorHeading })
  ).toBeVisible()

  await expect(
    page.getByRole("button", { name: webChatContract.configuratorCopyPrompt })
  ).toBeVisible()

  await page
    .getByRole("tab", { name: webChatContract.configuratorCliTab })
    .click()

  await expect(
    page.getByText(webChatContract.configuratorCommand)
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: webChatContract.configuratorCopyCli })
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: webChatContract.configuratorCopyPrompt })
  ).toBeHidden()

  expectHealthyPage(applicationErrors)
})
```

- [ ] **Step 8: Run it to verify it fails, then make it pass**

Run: `pnpm test:critical:quick -g "TC-WEBCHAT-001"`

- [ ] **Step 9: Verify against all three frames**

Default tab, CLI tab, and the open-dropdown state.

- [ ] **Step 10: Typecheck and lint**

Run: `pnpm typecheck && pnpm lint`

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(web-chat): add the connection configurator section"
```

---

### Task 16: §9 ownership, and retire the vertical heuristic **[visual]**

**Files:**
- Create: `src/components/pages/channels/web-chat/ownership.tsx`
- Modify: `src/components/pages/channels/web-chat-tagline.tsx`
- Modify: `src/app/(website)/(connect-footer)/channels/web-chat/page.tsx`
- Modify: `src/data/pages/web-chat.ts`
- Modify: `src/data/pages/agent-preview.ts`
- Modify: `src/lib/site-brand.ts`

**Figma:** node `45487-81961`.

**Interfaces:**
- Consumes: `TaglineReveal` (generalized here)
- Produces:
  - `TaglineReveal({ words, className }: { words: Array<{ text: string; accent: boolean }>; className?: string })`
  - `Ownership()`

**Exact copy:**

- Line, white through `We never run your brain.`, then grey: `Novu brings your agent to the web and carries every conversation, while your code, model, prompts, tools, and logic remain entirely yours`
- Type: Inter Regular 40, line-height 1.25em, letter-spacing -0.04em; grey portion `#707280`

| Card | Body |
| --- | --- |
| `Bring any agent` | `Connect the agent you already use — LangChain, Vercel AI SDK, custom code, or any other runtime.` |
| `Change runtime later` | `Swap models or frameworks without rebuilding Web Chat or losing conversation history.` |
| `Keep your logic yours` | `Your prompts, tools, model calls, and keys stay in your infrastructure. Novu carries conversations — not your agent's logic.` |

- [ ] **Step 1: Generalize `TaglineReveal`**

It currently hardcodes `We never run your brain. That's the whole point.` in a
module-level `WORDS` array. Change it to take `words` as a prop, keeping the
existing reveal behaviour, easing and 0.11s stagger unchanged. Move the old array
into the section that still needs it, or delete it if nothing does.

- [ ] **Step 2: Add the copy to `src/data/pages/web-chat.ts`**

Split the line into `words` with `accent: false` for `We never run your brain.` and
`accent: true` for the rest, so the grey portion reveals as the accented half.

- [ ] **Step 3: Build `Ownership`**

`TaglineReveal` plus the three cards.

- [ ] **Step 4: Replace the old section**

Delete the tagline boundary section from `page.tsx` and render `<Ownership />`.

- [ ] **Step 5: Retire the vertical heuristic**

The storyboard content is now fixed regardless of the visitor's site, so the
per-vertical mock data is dead. Remove `VERTICAL_PRESETS` from
`src/data/pages/agent-preview.ts` and the `vertical` field and its inference from
`src/lib/site-brand.ts`. If `src/data/pages/agent-preview.ts` ends up empty, delete
it. Keep everything the personalizer still uses: `normalizeUrl`, the SSRF guard,
accent extraction, logo inlining, `domain` and `name`.

- [ ] **Step 6: Verify nothing still references the removed exports**

```bash
grep -rn "VERTICAL_PRESETS\|vertical" src/lib/site-brand.ts src/data/pages src/components/pages/channels
```
Expected: no matches for `VERTICAL_PRESETS`, and no `vertical` field on the brand
profile.

- [ ] **Step 7: Typecheck, lint and regression**

Run: `pnpm typecheck && pnpm lint && pnpm test:critical:quick -g "TC-WEBCHAT-001"`

The personalize test must still pass — it asserts on the accent, which is unaffected
by dropping the vertical inference.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(web-chat): add the ownership section and retire vertical presets"
```

---

### Task 17: Metadata, social image, and the full gate

**Files:**
- Modify: `src/app/(website)/(connect-footer)/channels/web-chat/page.tsx`
- Create: `src/images/pages/channels/web-chat/og-image.png` (exported)

**Figma:** `og-image` node `45510-176597`, 1200×630.

**Interfaces:**
- Consumes: `getMetadata` from `@/lib/get-metadata`
- Produces: nothing consumed downstream

- [ ] **Step 1: Export the social image**

Export node `45510-176597` at 1200×630 into
`src/images/pages/channels/web-chat/og-image.png`.

- [ ] **Step 2: Wire it into the metadata**

`getMetadata` already accepts `imagePath` and `imageAlt`; the page currently falls
back to `config.defaultSocialImage`. Pass the exported image and a real
`imageAlt`. Update `title` and `description` to reflect the new hero copy — the
current values still describe the previous framing.

- [ ] **Step 3: Update the CTA copy**

Node `45487-82554` gives the designed CTA, which differs from the props currently in
`page.tsx`. Update `<Cta />` to:

- Title: `Put your agent inside your product` — Inter Regular 64, line-height 1.13em, letter-spacing -0.04em, centred, width 842px
- Description: `Keep your agent's model, runtime, and logic. One agent, every channel, one conversation.` — 20px, line-height 1.5em, letter-spacing -0.02em, `#8A8C99` (`text-gray-60`), width 648px
- Primary action: `Explore Novu Connect` → `ROUTE.connect`
- Secondary action: `Book a Demo` → `ROUTE.bookADemoConnect`

Keep the existing `data-click-location` / `data-click-text` tracking attributes — see
`docs/cta-tracking-conventions.md`.

- [ ] **Step 4: Confirm the page is fully rebuilt**

```bash
grep -rn "agent-in-product\|agent-center-surface\|aci-package\|agent-chat-showcase\|chat-theme-showcase\|agent-preview-composition\|agent-preview-player\|remotion" src package.json
```
Expected: no matches.

- [ ] **Step 5: Run the full gate**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm test:critical`
Expected: all pass across all four Playwright projects. Pre-existing repo-wide
failures unrelated to web-chat should be reported, not silently fixed.

Then check formatting on this branch's files only:
`git diff --name-only $(git merge-base main HEAD) HEAD | grep -E '\.(ts|tsx|css|md)$' | xargs npx prettier --check`
Do **not** run `pnpm format:fix` — it rewrites the whole repo.

- [ ] **Step 6: Walk the finished page**

Run `pnpm dev` and review `/channels/web-chat` at 1920, 1280, 768 and 360 against
`web-chat-general-1920` (node `45487-79054`) and `web-chat-general-360` (node
`45487-98982`). Check the personalize flow, the fallback flow, reset, both §4 tabs,
the logo cycle, and the configurator's two tabs.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(web-chat): add the designed social image and finalize metadata"
```

- [ ] **Step 8: Report**

Summarize: what matches the frames, what does not and why, any token added to
`globals.css`, and the two Figma frames that need re-syncing by the designer (see
the spec's *Known Figma/spec mismatches*).

---

## Notes for the executor

- **Do not merge into `feat/web-chat-in-app-agent`.** All work lands on
  `feat/web-chat-figma-redesign`.
- Pre-existing type errors on this branch are not yours to fix. Report them; do not
  fold them into a task.
- If a Figma frame contradicts this plan, the frame wins on *visuals* and the spec
  wins on *behaviour*. Two known contradictions are already resolved in the spec's
  mismatch section — do not re-litigate them.
- If a task's verification step cannot pass without changing an interface an earlier
  task produced, stop and report rather than silently diverging. Later tasks depend
  on those exact names.
