# Web Chat page redesign — design

Date: 2026-09-08
Branch: `feat/web-chat-figma-redesign` (branched from `feat/web-chat-in-app-agent`)
Route: `/channels/web-chat`

## Sources

- Desktop design: Figma `web-chat-general-1920` — node `45487-79054`
- Hero storyboard + personalization: Figma section `hero-storyboard&personalization` — node `45487-82743`
- Mobile page: `web-chat-general-360` — node `45487-98982`
- Mobile hero storyboard: `hero-360 (pesronalization)` — node `45487-112573`
- Mobile hero fallback: `hero-360 (pesronalization-fallback)` — node `45509-163367`
- Full screen tab: desktop `45497-141044`, mobile `45497-139685`
- Configurator states: `45497-147645` (open dropdown), `45501-148681` (CLI tab)
- Framework logo set: `items-for-animation (logos-ai-framework)` — node `45497-146963`
- Personalized bento references: `personalized-cards-preview` — nodes `45503-149086`, `45503-149553`
- Designer spec: `Novu-Web-Chat-Specification.docx` (Russian, 3 pages)

Brand reference variants in Figma: `recent.dev` (accent `#E65006`) and `todesktop.com` (accent `#0036FF`).

## Goal

Replace the current `/channels/web-chat` page with the Figma design. Figma's copy
supersedes the page's current copy. The page keeps its route and its SEO framing
("Web Chat").

Two behaviours carry most of the risk and most of the value:

1. A visitor types their domain, presses **See it in your product**, and the Hero
   plus two bento sections restyle to their brand while a four-message agent
   conversation plays and loops.
2. If brand extraction fails, the default theme is kept, an alert appears, and the
   conversation plays anyway.

## Decisions

| Decision | Choice | Reason |
| --- | --- | --- |
| Bento illustrations | Exported image + hue overlay + coded accent elements | Mirrors the two mechanisms the designer's spec describes; keeps effort proportionate; separate mobile exports are cheap |
| Animation engine | `motion/react` + a step hook; remove Remotion | `motion` is already the site's motion language; Remotion adds a large player bundle to a marketing page for no gain |
| Hero labels on personalization | Follow the spec text | Spec states it explicitly and the step-00 frame agrees; later frames are stale |
| Navbar | Out of scope | Web Chat is not in the header today; a global nav change deserves its own branch |
| Architecture | Brand provider + CSS variables; storyboard local to the Hero | Keeps brand and timeline independent, which is the seam the fallback requirement draws |

### Known Figma/spec mismatches

Both resolved in favour of the spec text. Flag to the designer so the frames get
re-synced:

- `hero-personalization-01..05-*` still show `yourdomain.com` in the browser chrome
  and `Your company` in the sidebar. The spec requires both to become the entered
  domain. `hero-personalization-00(transition)-recent.dev` already shows
  `recent.dev`, so the later frames look un-synced.
- The mobile personalized frame still shows `yourdomain.com` as the URL input's
  placeholder mid-storyboard. The input keeps what the visitor typed.

## Architecture

`page.tsx` stays a server component. `WebChatBrandProvider` is a client component
wrapping only the Hero and the two bento sections; §4–§9 and the CTA stay
server-rendered.

The provider owns `{ status, accent, accentForeground, domain, favicon }` and writes
`--wc-accent`, `--wc-accent-soft` and `--wc-hue` onto its wrapper element, plus a
`data-wc-state` attribute. Sections read the CSS variables, so recolouring costs no
React re-render. Only the Hero subscribes to `useStoryboard`, so step ticks
re-render the Hero alone.

`status` is one of `idle | loading | personalized | fallback`.

### Files

```
src/app/(website)/(connect-footer)/channels/web-chat/page.tsx
src/data/pages/web-chat.ts
src/components/ui/select-field.tsx                    # extracted from ConnectStack
src/data/pages/connect-stack-options.ts               # IStackOption + default channel/framework lists
src/components/pages/channels/web-chat/
  brand-provider.tsx
  url-personalizer.tsx
  brand-alert.tsx
  use-storyboard.ts
  hue-layer.tsx
  hero.tsx
  hero-product-ui.tsx
  hero-agent-panel.tsx
  compare-bento.tsx
  product-bento.tsx
  surface-tabs.tsx
  channels-grid.tsx
  deploy-aci.tsx
  framework-logo-cycle.tsx
  design-system-showcase.tsx
  configurator.tsx
  ownership.tsx
```

### Data flow

1. `UrlPersonalizer` POSTs `{ url }` to the existing `/api/agent-preview`.
2. On success the provider stores accent, domain and favicon, sets
   `status: "personalized"`, and writes the CSS variables.
3. On failure it sets `status: "fallback"`, keeps the default accent, and renders
   `BrandAlert`.
4. The storyboard is started by the *submit*, not by the fetch resolving. A failed
   or slow fetch never blocks or delays it.

## Personalization

Two independent mechanisms, matching how the designer's spec splits them.

**Hue shift** — backgrounds and illustrations. `<HueLayer>` is an absolutely
positioned layer filled with `var(--wc-accent)` in `mix-blend-mode: hue`,
`pointer-events-none`, animated from opacity 0. It is a port of Figma's `❖color`
layer, a large blurred ellipse in hue blend mode. Every host element needs
`isolation: isolate` or the blend leaks onto the page background.

**Discrete accents** — driven by `--wc-accent`:

- Hero: sidebar active `Sources` row, selected table row and its checkbox, user
  message bubbles, send button, agent avatar ring
- Hero, on personalization only: browser chrome domain, sidebar favicon, sidebar
  label (`Your company` → the entered domain)
- §2 and §3: message bubbles, active rows, individual icons

Accent extraction and clamping already exist in `src/lib/site-brand.ts`. One
correction: `accentForeground` must be derived from the accent's relative
luminance rather than assumed white — correct on `#E65006` and `#0036FF`, wrong on
a pale brand colour.

The unpersonalized default accent is the current purple, so first paint matches the
Figma default frame.

### Fallback

- Theme stays default; `--wc-accent` unchanged
- Alert pill: `rgba(255,152,186,0.2)` background, `#FF98BA` text, radius 96px, ⓘ
  glyph, copy: "We couldn't load your brand styles. Showing the default preview."
- `role="status"`
- The storyboard runs all six steps in default colours. The
  `fallback-hero-personalization-00..05` frames confirm identical staging.

### Reset

The reset icon (24px, 40% opacity, 100% on hover) restores the initial state:
default theme, the `Data sources` table with its original rows, `yourdomain.com` in
the chrome, `Your company` and the generic mark in the sidebar, the empty-state
agent panel, storyboard stopped, alert cleared, input cleared.

## Hero storyboard

Before submit the Hero is the static default: `Data sources` table, agent panel
showing the orb and "Ask about your workspace".

| Step | Content |
| --- | --- |
| 0 | Agent panel desaturates to grayscale, dashboard content blurs; then the `Form submissions` table and accent-coloured chat resolve in. **Plays once.** |
| 1 | User: "Why does this form submission need review?" |
| 2 | Agent thinking dwell |
| 3 | Agent: "Should I check the missing fields or review the full submission?" |
| 4 | User: "Missing fields" |
| 5 | Agent: "In this form (#1048), the Email field is not filled out." plus the compact field table with `Not provided` highlighted. Holds, then loops to **step 1**. |

The loop re-enters at step 1. Step 0 never repeats and the personalized theme
persists across loops.

`Form submissions` rows: Contact form #1048 (Needs review, selected),
Newsletter signup #1047, Support request #1046, Feedback form #1045,
General inquiry #1044, Callback request #1042, Summit Works — remainder fading out.
The step-5 field table: Full name `Jordan Lee`, Email address `Not provided`
(highlighted), Phone number `+1 415 555 0148`, Message `I'd like to learn more`.

### Timings

A single exported block in `src/data/pages/web-chat.ts`:

```ts
export const STORYBOARD_TIMING = {
  grayscaleMs: 600,
  blurMs: 600,
  recolorMs: 800,
  messageRevealMs: 700,
  thinkingMs: 900,
  gapMs: 3000,
  finalHoldMs: 3000,
}
```

`gapMs` and `finalHoldMs` are the two values the spec fixes at 3s; the rest are the
developer's proposal for the first preview, per the spec, and are meant to be tuned
in one edit afterwards.

### Reveal mechanic

The spec asks for opacity-0-and-blurred to sharp, referencing a Dribbble typography
effect. This is the `ENTER_FROM → VISIBLE` curve already in
`src/components/pages/connect/focus-blur-text-cycle.tsx`. Lift those constants
rather than introduce a second motion vocabulary.

### Lifecycle

- `useReducedMotion` renders step 5 directly, no loop, no blur transitions
- The loop pauses when the Hero leaves the viewport (`useInView`)

## Sections

Numbered in page order.

**§1 Hero.** Badge (8×8 `#C25CD6` square + `WEB CHAT`, `#F5CFFC`, Inter Medium 13,
line-height 1em). H1 "Your agent, live inside your product" — Inter Regular 56,
line-height 1.04em, letter-spacing -0.04em, width 557 on desktop. Description
"Web Chat uses product context, takes action, and continues conversations across
channels. Live in two minutes." — 18px, line-height 1.5em, letter-spacing -0.025em,
white at 80%.

Desktop is two columns: title left; right column holds the meta line ("~40K GitHub
stars · open source · no OAuth to install. / Choose the CLI or Copy Prompt
(recommended).") above `Copy Prompt` and the `npx novu connect --channel web-chat`
copy pill. A hover tooltip on `Copy Prompt` reads "Paste this prompt into Claude,
Cursor, or Codex — your coding agent will set up Web Chat for you." with a
"How agent onboarding works →" link.

Below: the product UI mock, then the URL personalizer, then the caption "Live and
interactive. Paste your site to see the agent in your product."

**§2 Comparison bento.** "You know the old chat widget. This is Web Chat" with a
right-hand description. Two cards — `The old chat widget` (narrow) and `Web Chat`
(wide, with a floating agent-response table). Personalized.

**§3 Product bento.** "Not a chat box on your site. An agent inside your app".
Five cards, two then three: Connects users to their profiles / Keeps every
conversation / Works in your app's context / Takes real actions / Renders your
components. Personalized.

**§4 Side panel or full screen.** Tabs over `ui/tabs.tsx`. Two full compositions,
not one that resizes — the Full screen state also changes the sidebar (`Overview /
Conversations` expanded to *Launch readiness review, Q3 usage report, Team access
review*) and carries its own conversation about workspace launch readiness with a
three-item checklist and a partially-typed composer. Four layouts total across two
tabs and two breakpoints; two message scripts in the data file. Not personalized.

**§5 Channels grid.** 3×3 channel tiles with a two-wide mascot card, and a right
column carrying the description, `Book a demo`, and the `npx novu connect` copy
pill. Reuses `connect/connect-channels-data.ts` and `ui/copy-command.tsx`.

**§6 Deploy the ACI, not just chat.** Exported illustration with one coded overlay:
`framework-logo-cycle`. Logos pass through the central "Your agent / Your stack"
plate, reach full opacity at centre, hold ~3s, then exit and fade. Vertical on
desktop, horizontal left-to-right on mobile. Travel direction is a prop with a
constant default, since the spec defers it to first preview. Below: the compliance
badge row (SOC 2 Type II, ISO 27001, GDPR, HIPAA) and five items — Identity &
subscribers / One durable thread / Delivery that lands / Compliance, built in /
Scale from day one. Separate vertical mobile illustration.

**§7 Works with your design system.** Three themed chat surfaces with the centre
one prominent, plus `Start building` and `Explore AI elements`. Refit from
`chat-theme-showcase.tsx`. Not personalized.

**§8 Build your connection.** Left: title, description, builder logos. Right: the
configurator card on an exported blob illustration — "Configure your agent / Pick a
channel and framework", tabs `AI prompt` | `CLI command`, a Communication channel
select defaulting to Web Chat, an AI framework select defaulting to Vercel AI SDK,
the result field, and a primary button that switches between `Copy prompt` and
`Copy CLI command`. The copied value always matches the active tab and the current
selections — prompt and CLI never mix. Open-dropdown styling per
`configurator-1920 (open-dropdown)`.

**§9 Ownership.** "We never run your brain." in white, then "Novu brings your agent
to the web and carries every conversation, while your code, model, prompts, tools,
and logic remain entirely yours" in grey. Three cards: Bring any agent / Change
runtime later / Keep your logic yours.

**§10 CTA + footer.** Existing `home/cta.tsx` and the `(connect-footer)` route
group's footer.

**Social image.** The designer supplied an `og-image` frame (1200×630, node
`45510-176597`) for this page. Export it and pass it through the `imagePath` /
`imageAlt` options `getMetadata` already accepts — currently the page falls back to
`config.defaultSocialImage`.

## Responsive

Separate compositions rather than scaled desktop, per the spec, for the Hero, §2's
second card, §4's two tab states, and §6.

- **Hero, mobile:** stacks badge → h1 → description → CLI pill → `Copy Prompt` →
  meta text. The CTA order flips relative to desktop and the meta text moves below.
  The product UI bleeds off the left edge at roughly 60/40 dashboard-to-panel.
- **URL personalizer:** two layouts. Desktop is the single pill from `url-states`
  (field, `See it in your product`, reset icon). Mobile is a rounded card with two
  rows — full-width input, then `See it in your product` filling the row with the
  reset icon beside it.
- **§2, mobile:** cards stack full width; card two's creators table is cropped at
  the right edge as its own composition. Personalization reaches both cards.
- **§4, mobile:** each tab has its own geometry; both bleed off the edges.

Built fluid between Figma's 360 and 1920 against the repo's existing container
conventions (`max-w-288`, `px-5 md:px-8`).

## URL component states

From `url-states` (node `45487-94047`): background black, border
`rgba(255,255,255,0.1)` 1px, radius 40px, padding `12px 20px 12px 12px`, gap 20px,
shadow `0 12px 56px rgba(0,0,0,0.64), 0 4px 28px rgba(0,0,0,0.35)`.

| State | Appearance |
| --- | --- |
| default | Placeholder `yourdomain.com`; white button; reset icon at 40% opacity |
| hover | Button background lightens; reset icon at 100% |
| active | Caret in field, partial value |
| filled | Full value, e.g. `recent.dev` |

## Refactors to existing code

**Extract the configurator core.** `ConnectStack`
(`src/components/pages/home/connect-stack.tsx`, 402 lines) fuses layout with the
select UI the new configurator needs. Prompt derivation is *already* shared —
`buildFrameworkChannelConnectPrompt` lives in `src/lib/connect-prompt.ts` and both
shells can call it directly, so nothing needs extracting there. What does need
lifting:

- `SelectField` → `src/components/ui/select-field.tsx`, alongside the existing
  `ui/select.tsx`
- `IStackOption` and the default channel/framework lists →
  `src/data/pages/connect-stack-options.ts`

`IStackOption` is currently re-exported from `connect-stack.tsx` and imported by
`src/components/pages/channels/channel-connect-stack.tsx`, so that import moves
too. `ConnectStack` and the new configurator then share the pieces without a third
`variant` on an already-large component. The homepage keeps its current behaviour.

**Generalize `TaglineReveal`.** `web-chat-tagline.tsx` hard-codes "We never run your
brain. That's the whole point." Take the words and their accent flags as props so
§9's longer line can use the same reveal.

## Cleanup

Every file below is reachable only from the web-chat page (verified), so removal is
safe:

- Delete `agent-in-product.tsx`, `agent-center-surface.tsx`, `aci-package.tsx`,
  `agent-chat-showcase.tsx`, `agent-preview-composition.tsx`,
  `agent-preview-player.tsx`
- Remove `remotion` and `@remotion/player` from `package.json` — used only by the
  two preview files
- Drop `VERTICAL_PRESETS` from `src/data/pages/agent-preview.ts` and vertical
  inference from `src/lib/site-brand.ts`. The storyboard content is now fixed
  regardless of the visitor's site, so the heuristic is dead code
- `web-chat-reveal.tsx` stays

## Testing

**Playwright** — `tests/critical-flows/web-chat.spec.ts` plus a contract entry in
`tests/critical-flows/contracts.ts`, following the existing pattern
(`gotoCriticalPage`, `observeApplicationErrors`, `expectHealthyPage`). The
`/api/agent-preview` response is mocked at the network layer so specs do not depend
on a third-party site being reachable.

1. Personalize a domain → accent applied, dialogue advances
2. Extraction fails → alert visible **and** the storyboard still plays
3. Reset → default theme, `Data sources`, empty-state panel restored
4. Configurator → switching to `CLI command` changes both the result and the
   primary button, and the copied value matches the active tab

**Node runner** — `tests/` alongside the existing `*.test.ts`:

1. Storyboard step sequencing, including that the loop re-enters at step 1 and
   never replays step 0
2. `accentForeground` luminance derivation, including a pale accent

## Out of scope

- The `navbar` frame — Web Chat in the header nav is follow-up work
- Any other channel page
- Re-syncing the stale Figma frames (a designer task; see *Known Figma/spec
  mismatches*)
