# Web Chat brand extraction — 2026-09-09

Implemented the [approved design](../specs/2026-09-09-web-chat-brand-extraction-design.md)
on `feat/web-chat-figma-redesign`. Implementation changes are not committed.

## Behavior

- HTML metadata candidates are evaluated independently; a white theme-color no
  longer hides a useful TileColor.
- The extractor follows the linked web app manifest and reads `theme_color`,
  including relative URLs, document bases, redirects, and non-hex colors.
- Inline CSS and up to three linked stylesheets supply candidates from matching
  primary actions and used brand variables, including declared link/CTA text,
  selected navigation and highlights. Ordinary links remain weak. Supported
  hiding declarations and unrelated nested badges are excluded. Source order, basic selector
  specificity, important declarations, variable inheritance and fallbacks are
  respected within the supported subset. Neutral, weak, or conflicting evidence
  yields no accent.
- Culori normalizes named colors, RGB, HSL, Lab, OKLCH, Display P3 and hex into
  opaque sRGB. Existing hero display adjustment remains separate and unchanged.
- `getBrandProfile` retains its response fields and adds `accentSource` for
  diagnostics. Hero components, below-hero sections, and animation are unchanged.
- Optional resource failures preserve successful identity extraction.
- When these candidates remain inconclusive, the already downloaded icon can
  supply a dominant chromatic palette or corroborate a CSS brand variable.
  Transparent/neutral pixels and minor color noise are ignored; ambiguous
  multicolor icons retain the default. Confident CSS/metadata skips decoding.
  The diagnostic source is `logo` for palette-supported selection.

## Resource handling and caching

The native HTTP(S) loader validates public addresses and DNS results, pins the
validated connection address, and revalidates redirects. Requests share an
eight-second deadline including queueing and body reads, with three concurrent
requests and at most three redirects per resource. Body limits are enforced
while reading streams.

HTML permits 2 MiB; manifests 64 KiB; each stylesheet 256 KiB; logos 200 KiB.
The initial 512 KiB HTML budget rejected valid responses from ToDesktop
(539,636 bytes), Novu (620,076 bytes), and Linear (1,267,263 bytes). A regression
test protects the adjusted limit. Requests ask for identity encoding; servers
that nevertheless send compressed bodies are rejected. The first validated DNS
address is used without address failover.

A process-local cache bounds retained values to 100 entries/20 MiB, with
24-hour positive and 15-minute no-accent TTLs. Keys preserve path/query while
normalizing input and dropping fragments. Concurrent reads are deduplicated;
failed requests and profiles affected by optional transient/unknown failures
are not cached. Cache persistence is limited to each server instance.

Sharp decodes the first icon within 200 KiB and 1,048,576 input pixels, then
samples at most 64 × 64 pixels. Its one-second processing timeout excludes time
waiting for a native worker. SVG entities and resource references are skipped,
including namespace-prefixed styles. Simple SVG stylesheets are reconstructed
from literal color rules only; imports and unsupported rules never enter the
rasterizer. Conditional media branches are omitted. Supported ICO frames are PNG and
32-bit BMP; modern alpha overrides the legacy AND mask. Other formats supported
by this helper are PNG, JPEG, WebP, GIF, AVIF and self-contained static SVG.

## Real-site evaluation

Read through the implemented extractor on 2026-09-09. All five retain names and
logos. Times are observations from this machine, not latency guarantees.

| Domain        | Accent  | Source | First read | Immediate repeat |
| ------------- | ------- | ------ | ---------- | ---------------- |
| recent.dev    | #f15406 | logo   | 2,363 ms   | not timed        |
| neon.com      | #37c38f | logo   | 1,137 ms   | not timed        |
| todesktop.com | #0036ff | css    | 790 ms     | <1 ms            |
| novu.co       | null    | null   | 854 ms     | 655 ms           |
| linear.app    | null    | null   | 634 ms     | <1 ms            |

The actual running Next.js API also returned ToDesktop's blue and logo with
HTTP 200. Desktop (1440 px) and mobile (390 px) checks applied the real extracted
blue to the hero, retained the domain, and found no page exceptions or horizontal
overflow. Screenshots are local `/tmp/web-chat-brand-live-{1440,390}.png`.

The table includes the focused Recent and Neon corrections below. The other
three rows retain the previous follow-up measurements. Deterministic
image/profile/POST fixtures also verify positive logo cases.

Recent's HTML contains a skeleton and serialized JavaScript component data,
without rendered CTA elements. Its white manifest and orange CSS declarations
are insufficient on their own. Its favicon now corroborates the orange
`--brand-red` variable. Novu and Linear still lack
sufficient qualifying evidence in the bounded static inspection. These results
are explicit fallbacks, not hardcoded brand mappings.

## Validation

- `pnpm test`: 226 tests passed, including 69 resource-loader tests, real preview
  POST integration tests, CSS selection, normalization, caching and existing
  application tests. The follow-up adds CSS text/visibility cases, seventeen image
  tests, profile fallback checks, and a real logo-fallback POST integration.
- `pnpm lint --ignore-pattern '.claude/worktrees/**'`: passed with the five
  existing unrelated homepage `no-img-element` warnings. Final CSS review changes
  additionally passed targeted ESLint.
- `pnpm typecheck`: passed.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/critical-flows/web-chat.spec.ts --project=desktop-chromium --project=mobile-chromium`:
  all 14 tests passed, including hero-only personalization, identity retention,
  fallback, reset, conversation and configurator behavior.
- `pnpm build`: compiled successfully in 94 seconds; TypeScript passed in 24.8
  seconds. Page
  data collection failed for `/careers/[slug]` with the existing
  `Missing Notion careers read configuration` error. The build also reported a
  tracing warning through existing `next.config.ts` / integration MDX helpers;
  those files are unchanged by this task.
- Changed files passed Prettier and whitespace checks.

Review found and fixed two integration cases: external CSS must retain its
position among inline styles, and `media="screen"` must be accepted consistently
by resource discovery and CSS collection. Regression tests cover both.

The follow-up review additionally corrected nested selected-tab badge evidence,
namespace-prefixed SVG styles (including Unicode prefixes), and 32-bit favicon
alpha precedence. Each correction has a regression fixture. Screenshot analysis
and `getComputedStyle()` are not used in production extraction.

## Focused Recent retest and correction

The user requested a fresh test of `recent.dev`. Instrumenting the existing
loader confirmed neutral metadata/manifest colors, 623 initial DOM elements
with no anchors or buttons, and these two CSS brand candidates:
`--brand-red: #f15406` and `--accent: #ec3c00`. The downloaded 16 × 16 favicon
contains 22 chromatic pixels among 252 opaque pixels, with a representative
orange of `#f15508`.

The original logo scoring gave both CSS oranges exactly 60 points because
both passed the hue/saturation/lightness match. This artificial tie discarded
useful evidence and explains the earlier null result. Corroboration now gives
a bounded bonus for closer RGB matches to the logo. Recent selects `#f15406`;
equally close shades remain ambiguous. Regression tests cover both behavior
and independence from CSS candidate order. There is no domain-specific override.

A fresh extraction returned `accent: #f15406`, `accentSource: logo` in 2,363 ms.
The running API returned HTTP 200 at desktop 1440 px and mobile 390 px; both
heroes applied that exact accent, retained `recent.dev`, reached conversation,
and reported no page exceptions or horizontal overflow. Screenshots:
`/tmp/web-chat-recent-live-{1440,390}.png`. Diagnostic scratch data:
`/tmp/web-chat-recent-extraction.json`.

A separate rendered-page inspection of Recent confirmed its CSS variables
remain available after hydration. This was a diagnostic browser check only;
production extraction still runs without a browser.

## Focused Neon test and SVG stylesheet support

`neon.com` initially returned HTTP 200 with its name/logo but no accent.
There were no theme meta tags, its manifest supplied an icon without a
`theme_color`, and the static CSS pass found no qualifying accent. Its 429-byte
SVG favicon defined `fill: #37c38f` in an embedded stylesheet and a dark-mode
override `#34d59a`. Rejecting every SVG stylesheet discarded that usable base
color.

The decoder now reconstructs a limited color-only stylesheet from PostCSS
nodes: literal `fill`, `stroke`, and `color`, simple root/tag/class/ID selectors,
and important flags. It omits media branches and rejects imports, resource
paint values and unsupported declarations/selectors. Namespace-prefixed style
tags and inline style attributes remain unsupported. No original CSS text is
sent to Sharp. Limits are 16 style elements, 32 KiB per stylesheet and 128
unconditional rules. Four new tests cover the base theme, cascade/selector
matching, unsupported resources, and conditional-only styles.

Fresh extraction selected `#37c38f` from the logo in 1,137 ms. A separate
rendered-site diagnostic found a green CLI action using the dark-mode variant
`#34d59a`; the extractor deliberately retains the favicon's unconditional
color. Raw evidence is in `/tmp/web-chat-neon-extraction.json` and
`/tmp/neon-rendered-colors.json`.

The running API then returned HTTP 200 and `accentSource: logo` at both desktop
1440 px and mobile 390 px. Both heroes applied exactly `#37c38f`, retained
`neon.com`, and reached the final missing-email reply. No page exceptions or
horizontal overflow were observed. Screenshots with entrance animations
completed are `/tmp/web-chat-neon-live-{1440,390}.png`.

## September 10: sharper identity icons

The previous selection used the first downloadable HTML icon. Recent and
ToDesktop therefore supplied 16×16 PNGs for a 32px CSS slot (64 physical pixels
at DPR 2), despite declaring better sources later in the document.

Selection now ranks SVG declarations first, followed by declared raster sizes.
Apple touch icons without a size hint use a 180px ranking estimate. Manifest
icons are considered independently of `theme_color`, with paths resolved
against the final manifest URL. Duplicate URLs are fetched once; the shared
six-icon attempt limit, 200 KiB per icon, and existing network deadline remain.
A page icon loads alongside the manifest, then a higher-ranked manifest source
can replace it. Failed preferred downloads retain the available fallback.

Fresh extraction and desktop/mobile browser checks selected Recent's SVG,
ToDesktop's 192×192 PNG, and Neon's existing SVG. The respective accents remain
`#f15406`, `#0036ff`, and `#37c38f`. All 181 brand tests pass, including six new
source-selection cases. Screenshots are `/tmp/logo-source-browser-*.png` and
`/tmp/logo-source-hero-*.png`. The personalized logo wrapper is unchanged.
Lint and typecheck pass. `pnpm build` compiles and passes TypeScript, then fails
collecting `/careers/[slug]` because the existing Notion careers read
configuration is missing.

## September 10: dark logo preference

Neon's SVG declares default green `#37c38f` and dark green `#34d59a`. Personalized
logo tiles now use a black background and `color-scheme: dark`; the default
placeholder keeps its purple tile. Explicit dark icon links rank ahead of
unqualified links, then light links, with format/size ranking within each group.
Failed dark sources fall back through the same bounded download pipeline.

Chromium honors the SVG image's inherited color scheme, but the tested WebKit
does not. `src/lib/site-brand/icons.ts` therefore resolves simple dark/light
SVG media rules to `all`/`not all` before returning the image. Vector paths and
unrelated media queries stay intact. This applies after accent extraction, so
Neon's page accent remains `#37c38f` while its logo uses `#34d59a`.

All 187 brand tests pass. Live API/browser checks at 1440px and 390px in Chromium
and WebKit confirm dark-green pixels even with a light OS preference, black
logo tiles, and no page exceptions. Screenshots: `/tmp/neon-dark-hero-*.png` and
`/tmp/neon-dark-logo-*.png`. Lint and typecheck pass. After another workspace
build released its lock, `pnpm build` compiled and passed TypeScript, then
encountered the existing missing Notion careers read configuration for
`/careers/[slug]`.

## Remaining limits

This is static extraction. It does not execute website JavaScript, inspect a
rendered browser, crawl CSS imports, evaluate conditional media/supports rules,
or implement the full CSS layer cascade. Logo analysis reuses the selected identity
icon; it does not locate header logos or inspect screenshots, and unsupported
image variants stay inconclusive. A browser-based step remains separate. The current
hero foreground/lightness policy is preserved; lightness clamping alone is not
a general accessibility guarantee.
Icon ranking uses published size/type hints; arbitrary sites can mislabel those
hints. It does not upscale or reconstruct missing source detail.
Dark-variant detection recognizes explicit standalone scheme queries, optionally
qualified by `screen` or `all`; it does not infer filename conventions or evaluate
arbitrary compound/negated queries. Unsupported SVG styles retain their source.
