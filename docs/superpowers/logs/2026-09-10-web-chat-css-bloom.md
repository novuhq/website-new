# Web Chat hero — CSS bloom, 2026-09-10

The owner requested a CSS alternative to the low-quality hero bloom and asked
whether PNG or JPEG would improve it. This supersedes the background export
strategy in the September 9 hero alignment log.

## Cause and decision

The desktop WebP was 1200×1118 but displayed on a minimum 1920×1788 canvas;
the mobile WebP was 360×1407. Both flattened the bloom, grain and dot pattern,
so viewport scaling also magnified their baked-in texture. A fresh lossless
PNG export could retain more detail, but converting those WebPs cannot recover
it. JPEG adds lossy compression to a visual dominated by smooth color fades.

The hero now uses six CSS radial gradients with screen blending per breakpoint,
in the route-local `hero-backdrop.tsx`. Smooth falloff approximates the shape and
palette of Figma's layered ellipses (`45440:66781` and `45487:111217`) without
large blur filters. The light positions were fitted to the existing decorative
reference; this is a CSS approximation, not an exact reproduction of Figma's
nested vector masks.

The dots remain a separate Figma asset, described below. Fine grain reuses the
existing small SVG noise utility at a fixed tile size and reduced opacity, so it
does not scale with the bloom. There is no raster bloom request.

The 1788px desktop/1407px mobile canvas heights, desktop centering and minimum
width, hero-only hue transition, reduced-motion behavior, and border blending
remain intact. The static background image imports are retired.

## Dot-pattern correction

The first CSS pass also replaced the dots with a uniform circular grid and an
approximate radial mask. The owner reported that this differed from Figma.
The authored texture, blurred mask, opacity and additive blending need to be
preserved independently of the bloom.

`hero-dots-desktop.png` and `hero-dots-mobile.png` are transparent 2× exports of
`45440:66801` and `45487:111237`, including their original masks. They render
with `mix-blend-plus-lighter` and no additional opacity or mask. Their rendered
bounds include blur bleed: desktop `(255.508, 1039, 1408.984, 212)` and mobile
`(0, 887.09, 360, 117.547)` in the authored hero canvases. Desktop horizontal
placement scales with the existing canvas; both heights stay fixed. The CSS
bloom and the personalization transition are unchanged by this correction.

The correction passed Retina Chromium checks at 360, 1920 and 2560px and WebKit
checks at 390 and 1440px: source image dimensions, rendered placement, additive
blending, personalization/reset, no horizontal overflow, and no page exceptions.
Lint and TypeScript passed. Evidence is under `/tmp/web-chat-dots-*`.

## Verification

- Lint and TypeScript checks passed; lint retains five existing homepage image
  warnings.
- Desktop/mobile border checks passed with identical frame and panel dimensions,
  the expected blend modes, working personalization/reset, and no page exceptions.
- All 14 existing Web Chat critical-flow tests passed in desktop/mobile Chromium.
- Retina Chromium checks passed at 360, 390, 768, 1920 and 2560px; WebKit passed
  at 390 and 1440px. Checked overflow, CSS-only bloom requests, fixed canvas
  heights, personalization/reset, and reduced-motion transitions. Inspected
  default/personalized hero screenshots and the desktop/mobile full-page pass.
- `pnpm build` compiled and passed TypeScript, then failed collecting
  `/careers/[slug]` with the existing `Missing Notion careers read configuration`.
- Browser screenshots and validation logs are saved under
  `/tmp/web-chat-bloom-*`.
