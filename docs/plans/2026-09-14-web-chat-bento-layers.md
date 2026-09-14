# Web Chat product bento personalization

Implement the approved trial in the five-card product bento, using Figma node
`45839:21901`. Keep the existing layout, captions, mobile crops, and default
artwork. After accepting this trial, the user approved extending the approach
to the comparison section and the hero's personalized message bubbles.

1. Separate the Figma artwork into background/glow imagery and foreground UI.
   Apply hue blending only to the background. Preserve portraits and neutral UI.
2. Render the foreground as scalable elements with independent accent fills and
   text colors. Use the higher WCAG contrast ratio to choose black or white on
   opaque accent surfaces. Preserve Figma's opacity on translucent highlights.
3. Reuse the current brand provider for successful personalization, repeated
   requests, reset, and fallback. Use the same maximum-contrast rule for hero
   bubbles; retain the existing foreground token for other controls.
4. Verify green and dark blue accents, reset/fallback, desktop/mobile layouts,
   and a full-page pass. Run relevant unit/browser tests, lint, typecheck, build.

Asset source: https://www.figma.com/design/sq4Qtfr7jrTKANvKpPFzWI/Novu-Website-2.0?node-id=45839-21901

Mobile composition sources: `45789:24774` and `45789:25023`.

## Asset structure

The personalized artwork lives in `src/images/pages/channels/web-chat/bento-layers`.
Each variant has a 2× JPEG decorative base and an inline SVG containing only
personalized controls, accent icons, bubble text, and the portrait image.
The base retains Figma's glass blur, neutral UI, and texture masks. Keeping those
effects composited in Figma avoids browser differences with SVG backdrop blur.
The portrait is a shared 160px JPEG in `public/images/web-chat-bento` and sits
outside the hue layer.

| Variant           | Figma image frame | Blur radii retained for foreground masks |
| ----------------- | ----------------- | ---------------------------------------- |
| Subscriber        | `45839:21904`     | 139.56                                   |
| Activity          | `45839:21969`     | 108                                      |
| Context           | `45839:22086`     | 132                                      |
| Actions           | `45839:22221`     | 132                                      |
| Render            | `45839:22302`     | 47.92                                    |
| Subscriber mobile | `45789:24774`     | 95.103386                                |
| Activity mobile   | `45789:25023`     | 82.698929                                |

For regeneration, use temporary copies of these frames. Set the reference hue
overlay, colored foreground paints/controls, and portrait fills to zero opacity
in the base (do not hide nodes, which changes Figma's auto-layout positions);
keep the background, noise, neutral UI, and their existing masks. Export at 2×,
then encode as JPEG quality 92 with 4:4:4 chroma. Export the foreground as SVG
with text outlining disabled, retaining only the removed elements. Restore mask
blur with `feGaussianBlur` at half the Figma radius and expand the mask bounds by
the full radius on each edge; Figma omits this blur in combined SVG exports.
Prefix all SVG IDs per variant, replace accent paints with `--wc-accent`, and
use `--wc-accent-contrast` for text on accent bubbles/buttons. Remove temporary
Figma copies after export.

## Hero and comparison extension

The green hero reference `45839:21140` uses solid accent bubbles with black
text (`45839:21736`). The shared brand CSS now provides
`--wc-accent-contrast`, choosing black or white by the greater contrast ratio.
`BrandArtwork` supplies the shared layer rendering for both illustration sections.

The later Recent reference `45487:87614` explicitly uses white on `#E65006`.
`bubbleForeground` preserves that design choice by accent swatch, while other
colors still use maximum contrast. ToDesktop's `#0036FF` reference `45487:91137`
already selects white. This applies consistently to the hero and personalized
illustration layers, without changing their default artwork.

Comparison assets in `compare-layers` retain the existing desktop/mobile
composition. Only the user bubble and its text move into SVG; the rest of the
illustration, including neutral text and glass effects, stays in the 2× JPEG.
Set the bubble's opacity to zero when exporting the base, preserving auto-layout.
Export the same frame as SVG with text outlining disabled, keeping that bubble,
its ancestor transforms, clipping, masks, and shadow definitions.

| Variant            | Figma image frame | Bubble node    | Foreground mask blur radius |
| ------------------ | ----------------- | -------------- | --------------------------- |
| Web Chat desktop   | `45487:79841`     | `45487:79878`  | 116                         |
| Web Chat mobile    | `45496:138745`    | `45496:138956` | 78.7309265                  |
| Old widget desktop | `45487:79782`     | `45487:79835`  | 44                          |
| Old widget mobile  | `45496:138552`    | `45496:138605` | 34.2579041                  |

The Send button reference `45839:21684` is 34×34 with an 8px radius.
Use the explicit radius in both chat renderers: this site's `rounded-lg` token
resolves to 6px. The compact version retains its scaled 3.7px radius.

Claude's color extraction separately retains already-fetched favicon evidence
when the preferred higher-resolution logo is monochrome. This preserves logo
quality while resolving its clay accent `#d97757`, with no additional fetch.

If extraction returns no accent, preserve the detected identity but use the
default preview colors (black hero bubbles, original illustration artwork).
The provider tracks `hasAccent` separately from successful identity extraction;
`data-wc-color` controls tinting without treating a missing color as an error.

## Tablet and laptop breakpoint extension

The subsequent breakpoint request uses the 768px frame `45902:52824` and
1024px frame `45865:32442`. These supply hero, comparison, product bento, and
surface-tab compositions. Existing phone and wide-desktop artwork remains in
place; the new variants apply at 768–1023px and 1024–1279px respectively.

The hero uses the desktop scene at 70% scale with a fixed-width dashboard and
an overlapping chat panel. Keep the decorative outer stroke outside that
transformed scene so its overlay blend sees the surrounding bloom.

At 768px the comparison and first two product cards stack, with the remaining
three product cards in two columns. At 1024px these use two and three columns.
New artwork follows the same layered personalization process documented above;
each variant also has a complete default 2× JPEG export. The default product
image map stays in a plain module for Server Component use, while SVG component
references stay inside the client artwork boundary.

| Artwork     | 768px source  | 1024px source |
| ----------- | ------------- | ------------- |
| Old widget  | `45902:56235` | `45865:49924` |
| Web Chat    | `45902:56412` | `45865:49807` |
| Subscriber  | `45902:57299` | `45865:50275` |
| Activity    | `45902:57362` | `45865:50161` |
| Context     | `45902:57477` | `45865:50339` |
| Actions     | `45902:57609` | `45865:50473` |
| Render      | `45902:57687` | `45865:50553` |
| Side panel  | `45902:57953` | `45896:51220` |
| Full screen | `45902:58592` | `45896:51858` |

Use the `tablet` and `laptop` asset suffixes. Comparison bubble nodes are
`45902:56288`, `45902:56449`, `45865:49977`, and `45865:49844`; retain their
mask blur radii of 44, 116, 44, and 91.524704 respectively. Product foreground
mask radii in table order are 139.56, 108, 120.078262, 127.554688, and 108.43631
for tablet; 124.647331, 96.459679, 106.736237, 113.381943, and 96.387833 for
laptop. Retain ancestor filters, including inactive-icon blur, and use normal
SVG antialiasing. The new portrait source is shared across breakpoint variants
and resized to fit 200px while preserving its original aspect ratio.

Export surface previews inside clipped black frames matching their authored
704×528 and 960×613 sizes. These remain selectable tab states, with the existing
opacity/blur transition and reduced-motion behavior. The Figma frames show
both states for reference, rather than two simultaneous previews on the page.
