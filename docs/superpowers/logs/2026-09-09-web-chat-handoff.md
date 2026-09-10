# Web Chat redesign — handoff

**Original handoff snapshot:** `feat/web-chat-figma-redesign` — 60 commits ahead of
`feat/web-chat-in-app-agent` (`c5435ef`), 63 ahead of `main`. Nothing pushed,
nothing merged. The follow-up work below is now present as uncommitted changes.

**Scope:** rebuild `/channels/web-chat` to Figma. One page, ten sections, plus a
live "enter your domain → the UI recolours to your brand" personalizer.

**Figma file key:** `sq4Qtfr7jrTKANvKpPFzWI`

**State:** `pnpm typecheck` clean, 49/49 unit tests pass, ESLint clean across
the feature, page assets 732KB.

**2026-09-09 debugging follow-up:** the hydration blocker below is resolved.
`next.config.ts` now allows the `127.0.0.1` development origin used by Playwright.
All eight Web Chat critical-flow tests pass on desktop and mobile Chromium.
The branch and validation summary above describe the original handoff snapshot.

**2026-09-09 live chat restoration:** the original PR #176 Novu integration is
restored inside the redesigned hero. Idle/reset now render a real composer;
submitting a URL plays the existing storyboard. Accent-less brands keep their
domain/logo with default purple. All 12 personalization browser cases and four
Novu SDK integration cases pass across desktop/mobile Chromium. The SDK cases
mock HTTP/WebSocket responses; the local environment still needs
`NEXT_PUBLIC_NOVU_APP_IDENTIFIER` to connect to the real agent.

**2026-09-09 hero alignment:** the current hero reference is the owner's
`45440:66780`, with mobile composition from `45487:98982`. The completed changes
and fresh browser evidence are in
[the hero alignment log](2026-09-09-web-chat-hero-figma-alignment.md).
That log supersedes the older hero export, gradient and typography advice below.

**2026-09-09 storyboard clarification:** the hero now waits for brand extraction
between grayscale/blur and recoloring. The table and local theme update at full
blur; the conversation begins after recoloring and loops without replaying that
transition. Messages are top-anchored to the supplied Figma frames. See
[the transition log](2026-09-09-web-chat-hero-transition.md) for current behavior
and validation.

**2026-09-09 brand extraction:** missing or neutral manifest colors now fall
through to matching CSS variables/interface colors, then a bounded favicon
palette fallback when needed. Static evidence remains deliberately conservative;
rendered-browser extraction is not implemented. See
[the extraction log](2026-09-09-web-chat-brand-extraction.md) for supported
signals, current real-site results, and validation.

**2026-09-09 URL states:** the hero URL control now follows `45487:94047` for
default, hover, active, and filled states, including the exported reset icon,
gray submit hover, and rounded field focus indicator. See
[the URL states log](2026-09-09-web-chat-url-states.md) for comparison and validation.

**2026-09-09 hero borders:** Figma's dashboard strokes use overlay blending and
outside alignment; the chat stroke uses soft-light blending. Both now retain
those properties, including the 0.466px mobile strokes. See
[the border correction log](2026-09-09-web-chat-hero-borders.md). Do not restore
ordinary white borders or isolate the outside strokes from the hero backdrop.

Read these first, in this order:

1. `docs/superpowers/specs/2026-09-08-web-chat-figma-redesign-design.md` — the
   binding spec, including two logged debts at the end.
2. `docs/superpowers/logs/2026-09-08-web-chat-figma-node-map.md` — verified node
   IDs and values per section, both breakpoints, plus a mobile-coverage audit.
3. `docs/superpowers/logs/2026-09-08-web-chat-figma-redesign-log.md` — 94KB
   ledger: 26 rulings with reasoning, 30 findings, 6 recorded controller errors.

---

## 1. Environment traps that will cost you hours

These are all confirmed by direct test, not guessed. Every one of them cost real
time on this branch.

### Turbopack caches `@utility` blocks in `globals.css`

Edits to an `@utility` body in `src/styles/globals.css` **do not reach the
served CSS** until the dev server restarts. The compiled bundle keeps the old
declaration while the file on disk has the new one, and a new `@utility` you add
is silently never emitted at all — the class lands in the HTML and does nothing.

Confirmed by fetching the compiled stylesheet and diffing it against source
after several edits. Arbitrary utilities in `.tsx` files (`bg-[rgba(...)]`) _do_
regenerate; only `@utility` definitions are stuck.

**Current consequence:** the obsolete `wc-agent-panel-surface` utility has been
removed. The hero now uses the exported affine gradient and a
`[data-slot="web-chat-panel"]` inspection hook. Do not inject the old
`panelCss()` helper below: it belongs to the historical snapshot and would add a
second gradient. Restart a warm server when checking other global utility edits.

### React hydration was blocked on `127.0.0.1` — resolved

The dev server accepted the page and JavaScript requests but rejected the HMR
WebSocket's `Origin: http://127.0.0.1:3000`. Its log explicitly reported
`Blocked cross-origin request ... /_next/webpack-hmr from "127.0.0.1"`.
Next.js 16.2.4 sends React debug data through that socket; hydration waited for
the missing stream, leaving the rendered page without event handlers.

An unchanged page on `localhost:3000` hydrated with 1,775 React-bound DOM nodes,
while `127.0.0.1:3000` had zero. Adding
`allowedDevOrigins: ["127.0.0.1"]` to `next.config.ts` fixed the actual origin
rejection. The dev server restarted automatically after the config edit.
No React debug flag or hero component change was needed.

`tests/critical-flows/web-chat.spec.ts` now passes all eight cases across desktop
and mobile Chromium: personalization and conversation, fallback and conversation,
reset, and configurator tab switching. These tests mock brand extraction at the
network boundary.

A separate browser check using the real endpoint verified the final reply, loop
back to the first message, and reset on desktop (1440px) and mobile (390px), with
the HMR connection receiving frames and no browser page errors. Both runs used
`recent.dev` and entered fallback because extraction returned no accent. The
restoration below corrects that classification.

The PR comparison found a decorative hero composer: only the website URL form
started a scripted conversation. This was a regression from
[PR #176](https://github.com/novuhq/website-new/pull/176), whose head was verified
as `c5435ef7fe8f2506cd5cf7383bcde4faa15dd153` on 2026-09-09:

- Before personalization, `AgentInProduct` rendered `AgentChatProvider` and
  `AgentChatWidget`. The widget called `useAgentChat({ agentId: "webchat" })`,
  submitted real messages, rendered responses and pending approvals, and exposed
  a working textarea/send button.
- Successful URL extraction switched to the branded scripted Remotion preview;
  reset returned to the live widget. The redesign's replacement of Remotion with
  a storyboard does not account for removing the separate live-chat state.
- Commit `e6cb4f3` replaced the hero and removed `agent-in-product.tsx`.
  Commit `1883ec7` then deleted `agent-chat-showcase.tsx`, including its provider
  and hook integration. At that point, the new hero composer was only spans.
- The original preview accepted a successful brand response even without an
  accent, retaining its domain/logo and using default purple. The redesign had
  classified a missing accent as fallback and hidden the extracted identity.
  Accent extraction itself was not broadened or narrowed; its metadata-only
  strategy already existed in the original branch.

The restoration uses `live-agent-chat.tsx` with one provider/hook shared by both
responsive frames. It reuses AI Elements for messages, scrolling, reasoning,
tools, and approvals; the real composer fits the existing hero frame. Failed
sends retain the draft, switching breakpoints retains the conversation, URL
submit unmounts it, and reset starts a fresh session. Missing configuration shows
an unavailable status and disabled composer. `.env.example` documents the
required public identifier; `.env.local` was not changed.

Final restoration validation:

- `pnpm test`: 49/49 passed; `pnpm typecheck` passed.
- `pnpm lint --ignore-pattern '.claude/worktrees/**'`: passed, five existing
  image warnings. The exclusion avoids linting another checkout.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test
tests/critical-flows/web-chat.spec.ts --project=desktop-chromium
--project=mobile-chromium`: 12/12 passed on the normal local server.
- `PLAYWRIGHT_NOVU_FIXTURE=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3002
PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test
tests/critical-flows/web-chat-live.spec.ts --project=desktop-chromium
--project=mobile-chromium`: 4/4 passed. This requires a separate dev server
  started with a fixture `NEXT_PUBLIC_NOVU_APP_IDENTIFIER`; the test intercepts
  Novu session/conversation HTTP requests and `wss://socket.novu.co` events.
  It verifies sends, streamed replies, retry, breakpoint continuity, approval,
  and reset. Desktop/mobile panel screenshots were inspected.
- `pnpm build`: compiled and passed TypeScript, then failed collecting
  `/careers/[slug]` with `Missing Notion careers read configuration`.

The real live backend remains unverified until the app identifier is supplied.
The original PR's successful deployment at
`https://website-4hs59mom6-novuhq.vercel.app/channels/web-chat/` was inspected; its
public bundle also retains an unresolved app-identifier environment reference,
so no valid identifier could be recovered there.

A final unmocked brand check on the normal server returned HTTP 200 for
`recent.dev`, with `accent: null` and `data-wc-state="personalized"`, at 1440px
and 390px. Reset restored the disabled composer and unavailable status in this
unconfigured environment. Both panels were visually inspected.

Follow-up validation: `TC-HOME-003` also passes, `pnpm typecheck` passes, and the
two changed files pass Prettier. `pnpm lint` was stopped after it traversed the
separate `.claude/worktrees` checkout; rerunning as
`pnpm lint --ignore-pattern '.claude/worktrees/**'` passes with five existing
`no-img-element` warnings. `pnpm build` compiles and passes TypeScript, then fails
collecting `/careers/[slug]` with `Missing Notion careers read configuration`.

### Playwright: `networkidle` never settles

Use `waitUntil: "domcontentloaded"` plus an explicit `waitForTimeout`. With
`networkidle` every `page.goto` hits the 60s timeout (almost certainly the HMR
socket, which also fails `ERR_INVALID_HTTP_RESPONSE` at `/_next/webpack-hmr`).

### The Chrome extension is not usable for visual checks

Two independent failures: screenshots of far-scrolled content come back **stale**
(one was pixel-identical to a pre-change shot while showing the footer inside a
crop that should have contained only the form), and `resize_window` reports
success while `innerWidth` stays at whatever the window was (2062, 2400).
Programmatic scrolling is also blocked — `window.scrollTo` and
`documentElement.scrollTop` are no-ops; only real input events scroll.

Use Playwright for anything visual. It is deterministic and honours the viewport.

### Never run `pnpm format:fix`

It is `prettier --write .` — repo-wide. It rewrote 148 unrelated files including
`tsconfig.json` on this branch. Format only what you touched:
`npx prettier --write <your files>`.

### `next/image` + static import + negative insets does not stretch

A static import carries intrinsic `width`/`height`, so setting `left` and
`right` no longer stretches the box — the image renders at its intrinsic size or
(with lazy loading, which is also unreliable here) not at all. `fill` forces
`inset: 0` via inline style and overrides your insets.

For decorative layers sized by negative insets, use a CSS `background-image` on
a `<span>`. Both agent marks and the hero glow do this deliberately; don't
"modernise" them back to `next/image`.

---

## 2. The pixel-diff workflow

This is how the last three commits were made, and it is the only reliable way to
judge fidelity here. It found real defects that eyeballing had missed for two
rounds (a 42px column offset, a 54px card overflow, a grain layer contributing
4× what it should).

### Building a reference you can trust

**Historical reference:** this subsection and its helper script describe
`45487:79055`. The current `45440:66780` reference includes its title and URL
groups and exports from `(0, 0)` at 1920px; no sibling-copy composite is needed.

Figma image exports **bleed past the node's geometry** wherever there is a blur,
so you cannot assume the export lines up with the frame. Two things make this
tractable:

- **Derive the origin from the bleed.** For the hero, `bg` (`45487-79056`) is a
  1408×1127 ellipse with `blur(246px)` and exports at 2392×2111. Both bleeds
  compute to exactly 492px, and the `hero-section` export (2392×2159) matches the
  union of the glow (y −323..1788) and the noise instance (1920×1836 at y0) to
  the pixel. So `hero.png`'s frame origin is **(−217, −323)**: crop at
  `(217, 323, 1920, 1320)`.
- **Composite the siblings.** `hero-section` does **not** contain the headline —
  the badge/h1/description/CTA column is a sibling group `45487-111212` that
  Figma places at page offset **(320, 156)**. Open the hero node alone and you
  see a hero with no copy, which is misleading. Paste the typography export on
  top of the cropped hero.

```python
from PIL import Image
hero = Image.open("hero.png").convert("RGBA")       # node 45487-79055, scale 1
typo = Image.open("typography.png").convert("RGBA") # node 45487-111212, scale 1
ref = Image.new("RGBA", (1920, 1320), (0, 0, 0, 255))
ref.alpha_composite(hero, dest=(0, 0), source=(217, 323, 217 + 1920, 323 + 1320))
ref.alpha_composite(typo, dest=(320, 156))
ref.convert("RGB").save("figma.png")
```

**Always validate the reference before trusting a diff.** The nav logo lands at
`x224..325 y16..47` in both the reference and the implementation. If a landmark
like that doesn't match, your crop origin is wrong and every number downstream is
noise.

### The capture script

`@playwright/test` is already a devDependency. Write this to a scratch path
(`.superpowers/px/` is convenient but **not** git-ignored in this repo — clean it
up, or use `/tmp`).

```js
// shot.js — deterministic 1920x1320 capture of the hero
const { chromium } = require("@playwright/test")
const fs = require("fs")

// Read the cached-at-runtime utility straight from source so what you verify
// cannot drift from what you commit. See the Turbopack trap above.
function panelCss() {
  const css = fs.readFileSync("src/styles/globals.css", "utf8")
  const m = css.match(/@utility wc-agent-panel-surface \{[\s\S]*?\n\}/)
  if (!m) return ""
  const body = m[0]
    .replace(/^@utility wc-agent-panel-surface \{/, "")
    .replace(/\n\}$/, "")
  return `.wc-agent-panel-surface{${body}}`
}

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1320 },
    deviceScaleFactor: 1, // 2 for component-level work
  })
  await page.goto("http://localhost:3000/channels/web-chat/", {
    waitUntil: "domcontentloaded", // networkidle never settles here
    timeout: 60000,
  })
  await page.addStyleTag({
    content:
      `nextjs-portal,[id*="intercom"],[class*="intercom"],
       iframe[title*="hat"]{display:none!important}\n` + panelCss(),
  })
  await page.waitForTimeout(3000)
  await page.screenshot({
    path: process.argv[2] || "mine.png",
    clip: { x: 0, y: 0, width: 1920, height: 1320 },
  })
  await browser.close()
})()
```

Two variants are worth keeping around:

- **Geometry probe** — same setup, but instead of a screenshot,
  `page.evaluate` the `getBoundingClientRect()` of the elements you care about.
  Far more reliable than pixel forensics for positions and sizes; that is how
  the card's 734-vs-680 height and the URL field's 577-vs-832 width were found.
- **A/B isolation** — same setup with an extra `addStyleTag` that hides layers
  (`.wc-agent-panel-surface > *{display:none!important}`), so you can measure one
  layer at a time. This is what separated the panel's gradient error from the
  layers stacked on it, and turned a vague "too bright" into a fitted curve.

### Reading the diff

- **Compare patch means, never single pixels.** Both renders carry grain; a
  single pixel is meaningless. 44×44 patches were used throughout.
- **Score with mean absolute difference** over the frame, plus an 8×6 grid to
  localise. The grid is what tells you _where_ to look.
- **Exclude known reference artifacts.** Figma's frame has the Copy-Prompt
  tooltip open for documentation; the implementation's is hover-only, so that
  region always reads as a difference. Same for any sample that lands on a layer
  you are not currently fitting — the panel's bottom sample sits on the `input`
  frame's own `rgba(0,0,0,0.88)`, not on the gradient, and including it in the
  fit pulls the curve badly wrong.

---

## 3. Where fidelity stands

Measured at 1920×1320, deviceScaleFactor 1, mean absolute difference per channel
over the whole frame.

| Surface                                   | Start       | Now       |
| ----------------------------------------- | ----------- | --------- |
| Hero frame (`45487-79055` + typography)   | 28.01 / 255 | **10.95** |
| Chat panel (`45487-79593`), at 2×         | 35.80 / 255 | **16.19** |
| Transition, waiting phase (`45487-94116`) | —           | **5.96**  |
| Conversation step 5 (`45487-89814`)       | 4.86 / 255  | **4.71**  |

The hero-frame figure predates the 2026-09-09 background replacement and the
move to reference `45440:66780`; treat it as historical rather than current.
The transition and step-5 figures are post-change, and both are tighter than
the default hero — the storyboard states match the frames more closely than
the idle state does.

Exact or within 2px after this work: badge dot `x320 y158`, card
`1364×680 @ x278 y439`, agent panel `408×646 @ x1217 y455`, URL field
`832×68` centred, section gaps at all nine boundaries, nav logo, CTA title block
`842 @ x539`, `§9` heading `40px/1.25em/−0.04em`.

**Section rhythm** is deliberately non-uniform and lives entirely in
`page.tsx`'s `GAP` map — 180 / 240 / 240 / 144 / 240 / 228 / 228 / 228 / 240.
Sections carry no vertical spacing of their own. Don't reintroduce a single
shared constant; it cannot express this.

---

## 4. Open items

Ordered by how much they matter.

1. **Figma keeps the agent orb coloured while the panel desaturates.** In the
   transition frame (`45487-94116`) the panel chrome is grey (saturation 6) but
   the orb is still vividly violet (saturation 165) and the header avatar is
   coloured (70). The current implementation desaturates the whole panel, so all
   three read 0. This is the worst cell in that frame's diff grid (21.4), and it
   needs a decision rather than a guess: `filter` applies to a subtree as a
   whole, so excluding the mark means moving it out of the filtered element, and
   an earlier pass deliberately moved _to_ whole-panel filtering from an
   orb-only filter. Three readings exist — orb only, whole panel,
   everything-but-orb — and the frame supports the third. Confirm with the
   designer before restructuring.
2. **The active nav pill renders at alpha 0.513 where its CSS says 0.72.**
   Isolated and cosmetic (25/255 on one small element), but unexplained. Ruled
   out by direct test: the computed background is `rgba(230, 80, 6, 0.72)` and
   forcing it inline with `!important` changes nothing; no ancestor has
   `opacity != 1`, `filter != none` or a blend mode; nothing sits above it in
   `elementsFromPoint`; it is not an in-flight transition (unchanged after a 3s
   settle); it is not the dashboard's settled `blur(0px)` layer; and there is no
   global dimming (the h1 and the Copy Prompt button are 255 in both). The
   effective alpha is almost exactly 0.72², the signature of the same alpha
   applied twice. Worth fresh eyes rather than more probing.
3. **Critical-flow blocker resolved in the follow-up above.** The Web Chat specs
   pass on desktop and mobile Chromium. Production-build validation remains
   separate from this dev-origin fix; the original handoff's build was blocked by
   missing external-service configuration.
4. **The orb region still reads ~27** in the panel diff. The blob export itself
   is faithful, so what remains is how its soft edges meet the panel gradient.
   Worth a fresh look rather than another curve fit.
5. **Mobile is half-unauthored.** Figma's mobile frame (`45487-98982`) contains
   only four of the ten sections: `§2`, `§4`, `§5`, `§6`. `§3`, `§7`, `§8`, `§9`
   and the CTA have **no authored mobile frame** and are extrapolated. Three
   separate implementers reported this independently. This needs the designer,
   not code.
6. **`font-mono` is not bound to Geist Mono anywhere in the repo**, so every
   "Geist Mono" line in the designer's spec is unmet — on this page and every
   other. One-line theme fix, but it is a site-wide decision.
   The 2026-09-09 hero pass resolves this locally for the CLI control by loading
   Geist Mono with `next/font`; it does not change the site-wide mono font.
7. **Contrast debt, partially paid.** The spec logs white-on-accent at 3.62:1.
   The sidebar's active pill is fixed (it now matches Figma's desaturated mauve
   with dark text, which also passes at 7.5:1), but `accentForeground` in
   `src/lib/accent.ts` still flips at luminance 0.5 where the WCAG crossover is
   ~0.18, and `usableAccent` clamps lightness into [0.48, 0.68] — squarely in the
   failing band. Any other white-on-accent surface still fails.
8. **Orphaned code.** `src/components/ai-elements/` is ~3,075 lines with zero
   importers, plus eight `ui/*` primitives (~950 lines) and nine unused deps
   (`streamdown`, `@streamdown/{cjk,code,math,mermaid}`, `ai`, `cmdk`, `nanoid`,
   `use-stick-to-bottom`, `@radix-ui/react-use-controllable-state`). `@novu/react`
   is pinned to RC `3.20.0-rc.d57e78e026`. The owner chose to leave this; it is a
   follow-up, not a defect.
9. **Two sections sit off-centre in Figma** — `§8` by 16px and `§9` by 32px,
   while `§6`/`§7` at the same 1280px width are centred. Read as designer nudge
   rather than intent and kept centred here. Confirm with the designer.
10. **Brand extraction now includes manifest, static CSS and icon evidence.** The
    [2026-09-09 extraction follow-up](2026-09-09-web-chat-brand-extraction.md)
    resolves the original metadata-only limitation: `todesktop.com` now produces
    `#0036ff` from its primary-button CSS in the real endpoint. `recent.dev`
    now produces `#f15406`: its favicon corroborates the CSS `--brand-red` token
    despite a loading skeleton and neutral manifest. A focused retest found
    that two similar orange variables received identical logo scores; the
    corrected scoring favors the closer favicon match. Desktop/mobile live
    checks confirm the orange theme and retained identity.
    `neon.com` now extracts `#37c38f` from its SVG favicon after adding
    restricted support for embedded literal color rules; its manifest declares
    no theme color. Conditional SVG media rules remain excluded.
    Browser rendering remains a follow-up; mocked Figma colors do not establish
    live extraction accuracy.

---

## 5. Decisions not to undo

Each of these looks like something to "fix" and isn't. Reasons are in the
commits and the ledger.

- **The card and the copy run on different columns.** Card `1364 @ x278`,
  typography `1280 @ x320`; `HeroCopy` re-centres to 1280 inside the card's
  container, and `(1364 − 1280) / 2 = 42` is why that lands on x320. An earlier
  pass unified them and logged the resulting 42px offset as "an accepted
  trade-off"; it was a false dilemma.
- **`§5` is narrower than its neighbours.** `max-w-288` = the 1088px Figma row
  (496 + 48 + 544) plus padding. It is _meant_ not to share the 1280px content
  edge. A final-review pass normalised it to 1344 and that was wrong.
- **The card is a fixed `md:h-[680px]`.** The table has more rows than fit and
  Figma clips them behind the fade the table already draws. Left to grow it
  reached 734 and pushed everything below it down by ~53px.
- **The card carries `md:bg-black` _under_ its gradient.** Figma's fill genuinely
  fades to transparent below 58% and we match that gradient exactly, but the
  frame never shows the fade — every interior point measures 1–6/255 because the
  dashboard's children are opaque. Without the base, glow leaked through the
  card's lower third at up to 137/255 and lit the 0.56-alpha chat panel ~40/255
  too bright.
- **The hero grain is inline, at 0.086, with no blend mode.** `wc-noise-overlay`'s
  `mix-blend-mode: overlay` has no backdrop to blend against inside an isolated
  stacking context wherever the glow hasn't painted, so it fell through at full
  strength and lifted blacks to 30/255 against the design's 8. Figma's texture is
  also _sparse_ — measured mean alpha 14.7% — so its 0.32 gives only that ~8
  lift, where a full-coverage SVG needs 0.086. The configurator still uses the
  overlay-blended utility; that one is fine.
- **The panel gradient's stops are 28/73/98, not Figma's stated 15/57/79.**
  Figma exports the geometry of its own gradient transform as an approximation.
  At the stated positions a CSS radial saturates to the outer colour across the
  whole upper half and never reaches black at the bottom. The refit brings the
  gradient alone from mean error 13.6 to 6.6. The _colours_ are exact.
- **Accent-derived colours are expressed as mixes that evaluate to Figma's exact
  values at the default accent.** e.g. `50% accent + #6634ec` → `rgb(148,72,225)`
  and `30% accent + #fb9bfa` → `rgb(234,136,239)`. This keeps the brand recolour
  working while being pixel-exact at rest. Don't hardcode the literals — a
  personalized frame (`45487:93325`) confirms these surfaces recolour per
  visitor.
- **`HueLayer` sits between the agent blob and its glyph** for the same reason.
- **Both agent marks and the hero glow are CSS backgrounds, not `next/image`.**
  See the trap above.
- **`§4`'s texture is approximated in CSS** rather than shipping the 19.7MB
  source, and the hero glow ships at 800px pre-blurred because Figma bakes
  gradient dither into a render that soft (248KB at 1200px for detail that isn't
  there).
- **The `shadcn` / `m@example.com` sidebar footer is replaced** with
  `Your company`. It is genuinely in the frame; a fake person's email on a public
  marketing page is a defect regardless of provenance.
- **The prompt preview is one truncated line.** Figma makes it the third item in
  the same `dropdowns` stack as the two selects, clipped with an ellipsis. The
  full value stays in the DOM and `Copy prompt` is how you take it.

---

## 6. Figma nodes found during the pixel work

Additions to the node map. All verified by fetch, not inferred.

| What                            | Node                                | Key values                                                                                               |
| ------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Desktop page                    | `45487-79054`                       | 1920 × 10910                                                                                             |
| `hero-section`                  | `45487-79055`                       | 1920 × 1320; export origin (−217, −323)                                                                  |
| Hero `typography` (sibling!)    | `45487-111212`                      | 1280 × 219 at (320, 156)                                                                                 |
| Hero glow `bg`                  | `45487-79056`                       | 1408 × 1127 at (275, 169), `blur(246px)`                                                                 |
| Glow colour stack               | `45487-79058`                       | `#523FFD`, `#664BEC`, `#4B73EC`, `#FFA3F4`, `#D0A3FF`, `#FFA488`                                         |
| Hero `noise`                    | `45487-79075`                       | 1920 × 1836, opacity 0.32, sparse texture                                                                |
| `ui` → inner `ui` → `dashboard` | `45487-79079` / `-79081` / `-79082` | card 1364 × 680 at y439; fill `rgba(0,0,0,0.98) 58% → transparent`                                       |
| `url` frame                     | `45487-79717`                       | 832 wide = 12 + `left` 756 + 20 + icon 24 + 20; caption 15px                                             |
| `chat-area` / `chat`            | `45487-79593` / `-79594`            | 408 × 647, radius 14, `backdrop-blur(48px)`                                                              |
| Chat `noise`                    | `45487-79595`                       | opacity 0.10                                                                                             |
| Chat `light`                    | `45487-79596`                       | 746 × 1082 at (−348, −652), `#E4C1EA`, `blur(54px)`, 0.10                                                |
| Chat `input`                    | `45487-79597`                       | 384 × 42 at (12, 593), `rgba(0,0,0,0.88)`, radius 12                                                     |
| Chat `header`                   | `45487-79643`                       | 56 tall; avatar 40 at (8,8); title Inter 18/1.2em/−0.02em at (60,17); icons 20 × 20, gap 16, at (332,18) |
| Avatar logomark                 | `45487-79645`                       | 36.67, blurred, inside a 40px circle                                                                     |
| Orb logomark                    | `45487-79608`                       | 140 × 140; export 208 × 201 for a 140 core                                                               |
| Agent glyph                     | `45487-79640`                       | 40 × 40, `white` at 50%, `mix-blend-mode: plus-lighter`                                                  |
| `§8` group / form / inner       | `45487-81721` / `-81722` / `-81877` | 1248 × 680; form 640 × 680 radius 28; inner 408 wide, pad 24, gap 24                                     |
| `§8` prompt item                | `45487-81913`                       | label + one `12px 14px` control, text clipped                                                            |
| `§8` copy button                | `45487-81920`                       | pad `14px 20px`, `#E0E1E5`, Inter Medium 16/1em                                                          |
| `§5` row                        | `45487-81559`                       | 1088 = 496 + 48 + 544, centred at x416                                                                   |
| `§9`                            | `45487-81961`                       | 1280 designed, gap 72, heading 40/1.25em/−0.04em                                                         |
| CTA                             | `45487-81999` / `-82554`            | title block 842 at x539, y +3                                                                            |
| Mobile page                     | `45487-98982`                       | only 8 children — see the coverage audit                                                                 |

---

## 7. Verification commands

```bash
pnpm typecheck
NODE_OPTIONS=--conditions=react-server npx tsx --test tests/*.test.ts   # 49 tests
npx eslint src/components/pages/channels/web-chat/ src/data/pages/web-chat.ts

# format ONLY what you touched — never `pnpm format:fix`
npx prettier --write <files>

# cannot currently run: needs hydration or credentials
npx playwright test tests/critical-flows/web-chat.spec.ts
```

**Restart the dev server** before judging anything that lives in an `@utility`
block in `globals.css`.
