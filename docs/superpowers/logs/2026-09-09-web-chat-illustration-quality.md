# Web Chat illustration quality — 2026-09-09

Scope: illustrations below the hero in Figma page `45487:79054`, file
`sq4Qtfr7jrTKANvKpPFzWI`. The hero is excluded.

The existing raster illustrations are mostly already exported at 2×. The prior
asset pass compressed them to WebP at quality 82; Next.js then serves another
lossy rendition at its default quality 75. Re-export from Figma rather than
upscale or recompress those existing files.

| Property          | Current comparison cards                             | Target                                              |
| ----------------- | ---------------------------------------------------- | --------------------------------------------------- |
| Source dimensions | Desktop 822×960 / 1818×960; mobile 640×748 / 640×645 | Preserve the existing 2× geometry                   |
| Source format     | Lossy WebP                                           | Fresh Figma JPG for opaque artwork                  |
| Browser delivery  | Next.js quality 75 rendition                         | Original 2× asset, without another lossy conversion |
| Layout            | Separate desktop and mobile crops                    | Preserve composition, live copy, and interactions   |

Transparent marks and logos require an alpha-capable format; converting those
to JPG would add a rectangular background. SVG stays vector where available.

## Product bento comparison

| Property                   | Figma                                            | Current                                            | Action                                                   |
| -------------------------- | ------------------------------------------------ | -------------------------------------------------- | -------------------------------------------------------- |
| Art                        | Five opaque image-bg frames; 660×496 and 432×496 | 2× WebP, compressed again in delivery              | Export original 2× JPGs; serve directly                  |
| Message and action accents | Already part of the illustration                 | Additional DOM copies overlap the baked text       | Remove redundant decorative overlays                     |
| Mobile artwork             | No separate authored mobile frame                | Desktop art crops through bubbles at narrow widths | Contain the full artwork at the top of the existing card |

Comparison cards: four fresh JPGs (822×960, 1818×960, 640×748, 640×645).
Desktop and mobile captures show the original files delivered directly, without
image-optimizer recompression or duplicate bubbles. No browser page errors.

Product cards: five fresh JPGs (1320×992 for the first pair, 864×992 for the
remaining three), 69–169 KB each. Desktop and mobile screenshots verified all
five images, with no overlapping decorative controls and no browser errors.

## Surface tabs comparison

| Property       | Figma                                                | Current                                              | Action                                               |
| -------------- | ---------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| Illustration   | Composited dashboard, glass chat, glow, grain, fades | HTML approximation lets table text show through chat | Export the complete decorative UI for each tab at 2× |
| Responsive art | Separate desktop and mobile compositions             | Rebuilt with fixed coordinates                       | Preserve the four authored compositions              |
| Interaction    | Side panel / Full screen switch                      | Working Radix tabs                                   | Keep tab controls and external link live             |

Surface tabs: desktop 2688×1226, mobile 720×484, exported as lossless PNG
masters and flattened onto black before JPG encoding. The responsive picture
selects the mobile source without downloading the desktop source. Both tabs
were clicked and visually verified at 1920 px and 390 px; no page errors.

## Channels grid comparison

| Property            | Figma                                        | Current                     | Action                                                          |
| ------------------- | -------------------------------------------- | --------------------------- | --------------------------------------------------------------- |
| Mascot              | 328×160 opaque tile with fine glow and grain | Compressed raster           | Fresh 656×320 JPG, without delivery recompression               |
| Teams icon          | Vector artwork in 68×68 container            | 48×48 PNG enlarged to 68×68 | Export the complete icon container at 136×136 with transparency |
| Other channel icons | Vector logos                                 | Existing SVGs               | Keep vector sources and live channel links                      |

Channels grid: fresh 656×320 mascot JPG (26 KB), transparent 136×136 Teams PNG
(3 KB). Verified desktop and mobile; channel links and copy-command controls
remain in place.

## ACI illustration comparison

| Property         | Figma                                               | Current                                         | Action                                       |
| ---------------- | --------------------------------------------------- | ----------------------------------------------- | -------------------------------------------- |
| Artwork          | Separate 1280×480 desktop and 320×658 mobile frames | Lossy 2× WebPs, optimized again                 | Fresh 2× JPGs from original exports          |
| Framework marks  | Rotating logo slot                                  | Existing SVG cycle with reduced-motion fallback | Preserve the live animation and vector logos |
| Compliance marks | Vector badges                                       | Shared SVGs                                     | Keep existing vector sources                 |

ACI diagram: 2560×960 desktop JPG (310 KB), 640×1316 mobile JPG (136 KB).
Both responsive views verified with the original live framework-logo cycle.

## Design-system showcase comparison

| Property        | Figma                         | Current                                   | Action                                                       |
| --------------- | ----------------------------- | ----------------------------------------- | ------------------------------------------------------------ |
| Desktop artwork | One 1280×520 composited card  | Rebuilt chat panels and approximated glow | Export the original full card at 2× as JPG                   |
| Mobile          | No authored frame             | Purple panel above amber/blue pair        | Preserve this arrangement using transparent 2× panel exports |
| CTA controls    | Live links above illustration | Working links                             | Preserve their markup and targets                            |

Design-system showcase: desktop 2560×1040 JPG (353 KB); the three mobile
panels retain transparency at 2×. The purple panel's composer is a sibling in
Figma, so it is composited from the lossless full-card master into its exact
position in the mobile export. Desktop and mobile visually verified.

## Configurator comparison

| Property      | Figma                                              | Current                                       | Action                                         |
| ------------- | -------------------------------------------------- | --------------------------------------------- | ---------------------------------------------- |
| Background    | 640×680 crop of the original glow group            | Lossy 2× WebP and another delivery conversion | Fresh 1280×1360 JPG of the same crop           |
| Builder strip | Vector wordmarks                                   | Lossy 2× WebPs                                | Original SVG assets from Figma                 |
| Form          | Interactive selects, prompt/CLI tabs, copy buttons | Live React controls                           | Preserve behavior and verify the existing flow |

Configurator: fresh 1280×1360 JPG (104 KB) and eight original SVG builder
wordmarks. The export used a temporary clipped frame containing a copy of the
background; all temporary nodes were removed in the same call. Original Figma
nodes were not edited.

## Final audit

- Hero source and assets were not changed.
- Ownership icons already use SVGs and remain sharp; no raster replacement needed.
- The final CTA uses its existing 1920×742 video and JPG poster. Video playback
  was verified on both breakpoints and kept intact.
- 18 opaque illustrations now use JPGs encoded at quality 95 with 4:4:4 chroma.
  All come from original Figma 2× exports, with no upscaling of old WebPs.
- Transparent mobile panels and the Teams mark remain PNG. Eight builder logos
  now use true vector SVGs, with no embedded raster images.
- Next.js serves these assets directly (`unoptimized`), preserving their source
  quality. Lazy loading is retained, with responsive picture sources for tabs
  and the ACI diagram. Higher-quality artwork increases total asset size.
- Final desktop (1920 px) and mobile (390 px) passes decoded all 56 below-hero
  image elements, found no page errors or horizontal overflow, and found no
  remaining image-optimizer URLs for the below-hero raster illustrations.
- Side panel / Full screen tabs were exercised at both breakpoints. The final
  CTA video reported ready state 4 at its original 1920×742 resolution.

## Validation

- `pnpm lint --ignore-pattern '.claude/worktrees/**'`: passed, with five existing
  `no-img-element` warnings in unrelated homepage components.
- `pnpm typecheck`: passed.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/critical-flows/web-chat.spec.ts --project=desktop-chromium --project=mobile-chromium --grep 'scopes personalization|configurator switches'`:
  4 tests passed, covering hero-only personalization and configurator result/action switching.
- `pnpm build`: compilation and TypeScript passed; page-data collection failed
  for `/careers/[slug]` with `Missing Notion careers read configuration`.

Visual evidence is stored locally under `/tmp/art-*-final-*.png` and
`/tmp/web-chat-illustrations-full-{1920,390}.png`. Browser helpers explicitly
load offscreen marquee logos before decoding them; this avoids waiting forever
for intentionally lazy-loaded images outside the visible strip.
