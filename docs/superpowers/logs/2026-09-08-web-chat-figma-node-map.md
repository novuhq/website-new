# Figma node map — web-chat redesign

File key: `sq4Qtfr7jrTKANvKpPFzWI`

Controller-verified node IDs and values, so visual-task dispatches carry numbers
rather than prose. Written after Task 5 revealed that giving desktop values and
describing mobile in words causes implementers to apply one breakpoint's values
everywhere.

**Rule for every remaining visual task: quote BOTH breakpoints' values in the
dispatch. If only one is known, read the other before dispatching.**

## Page frames

| Frame | Node | Size |
| --- | --- | --- |
| Desktop page | `45487-79054` | 1920 × 10910 |
| Mobile page | `45487-98982` | 360 × 10910 |
| Storyboard section | `45487-82743` | — |
| Mobile hero storyboard (personalized, recent.dev) | `45487-112573` | 360 × 2856 |
| Mobile hero storyboard (fallback) | `45509-163367` | 360 × 1346 |
| Full screen tab, desktop | `45497-141044` | 1920 × 966 |
| Full screen tab, mobile | `45497-139685` | 360 × 872 |
| Configurator, open dropdown | `45497-147645` | 1920 × 966 |
| Configurator, CLI tab | `45501-148681` | 1920 × 966 |
| Framework logo set | `45497-146963` | 526 × 396 |
| Personalized cards preview | `45503-149086`, `45503-149553` | — |
| OG image | `45510-176597` | 1200 × 630 |

## Hero (Tasks 6, 7, 8)

### Desktop
| Part | Node |
| --- | --- |
| `hero-section` | `45487-79055` |
| `bg` group | `45487-111213` |
| `ui` group | `45487-79079` (4282 × 1166 at x −1188) |
| `typography` group | `45487-111212` (1280 × 219 at x 320, y 156) |
| `title` frame | `45487-79692` (width 557) |
| `url` frame | `45487-79717` |
| `url-field` default | `45487-94048` |
| `url-states` (4 states) | `45487-94047` |

Desktop `url-field`: padding `12px 20px 12px 12px`, gap `20px`, radius `40px`,
hug/hug, black fill, border `rgba(255,255,255,0.1)` 1px, shadow
`0 12px 56px rgba(0,0,0,0.64), 0 4px 28px rgba(0,0,0,0.35)`, reset icon 24 × 24
(opacity 0.4 → 1.0 on hover).

Desktop hero copy: badge 8 × 8 `#C25CD6` + `WEB CHAT` (`#F5CFFC`, Inter Medium 13,
lh 1em, uppercase); h1 Inter Regular 56 / lh 1.04em / ls −0.04em / white;
description 18px / lh 1.5em / ls −0.025em / `rgba(255,255,255,0.8)`; meta 15px /
lh 1.38em / ls −0.025em / `rgba(255,255,255,0.4)`.

### Mobile (`45487-112573`)
| Part | Node | Values |
| --- | --- | --- |
| `ui&bg` group | `45487-112574` | 515 × 1700 at x 42, y −34 |
| `mask` ellipse | `45487-112575` | 515 × 1700, `#FFFFFF`, `blur(82px)` |
| `❖color` glow | `45487-113300` | 1298 × 2075 at x −511, y −261, fill = brand accent, `blur(174px)` |
| `ui` group | `45487-112600` | 636 × 317 at x −338, y 634 → **absolute x −296 on a 360 viewport**, so it bleeds off both edges, mostly left. Visible-width split computes to **≈40/60 dashboard-to-chat** from the raw pixel data — an earlier note in this file said "60/40", which was my error; trust the pixel data (verified by Task 6's implementer) |
| `url` wrapper | `45487-113210` | column, gap 16px, width 320, at x 20, y 945 |
| `url-field` | `45509-163349` | row, padding `8px`, gap `20px`, radius `20px`, stretch, same border + shadow as desktop |
| `row-caption` | `45487-113228` | row, padding `0 24px`, centred, gap 8px |
| `typography` | `45487-113230` | column, gap 40px, width 320, at x 20, y 116 |
| `button&footnote` | `45487-113239` | column, gap 18px, height 179 |
| `header-new` | `45487-113256` | 360 × 64; logo at x 20 y 16 (102 × 32); hamburger 20 × 20 at x 320 y 22 |

Mobile caption (`45509-173682` equivalent): 14px / lh 1.38em / ls −0.025em,
`CENTER`, `rgba(255,255,255,0.4)`.

Mobile hero stacking order: badge → h1 → description → CLI pill → `Copy Prompt` →
meta line. Desktop puts the meta line ABOVE the CTAs and splits into two columns.

## Fallback alert — TWO variants, both correct

| | Desktop `45487-84157` | Mobile `45509-173755` |
| --- | --- | --- |
| radius | `96px` | `16px` |
| text align | `CENTER` | `LEFT` |
| sizing | hug / hug (one line → pill) | fixed width 320 (wraps to two lines) |

Shared: row, padding `8px 16px 8px 8px`, gap `8px`, fill
`rgba(255,152,186,0.2)`, 20 × 20 icon, text `#FF98BA` 15px / lh 1.38em /
ls −0.025em. Copy uses U+2019: `We couldn’t load your brand styles. Showing the
default preview.`

## §2 comparison bento (Task 9)

Desktop `45487-79779`; personalized reference `45503-149553`;
mobile `45510-177550` (column, gap 40px, width 320, at x 20, y 1301) inside the
mobile hero storyboard frame — note the mobile §2 lives in `45487-112573`, not only
in the full mobile page.

## §5 channels grid (Task 12)

`right` column `45487-81702` (width 544, column gap 32px):
- heading `45487-81704` — Inter Regular 48 / lh 1.04em / ls −0.04em / white, breaks
  after `in-app` and after `across`
- description `45487-81705` — 16px / lh 1.5em / ls −0.025em / `#A3A6B2`, width 483
- `Book a demo` button `45487-81707` — white fill, radius 6px, padding `14px 20px`,
  label Inter Medium 16 `#000`
- CLI pill `45487-81715` — 232 × 44, black fill, border `#41434D` 1px, radius 6px,
  Geist Mono 16 / ls −0.02em, 16 × 16 copy icon

## §5 channels grid — MOBILE (verified after Task 12's review)

My original §5 entry covered desktop only, which left Task 12's mobile values
unverifiable at review. Verified directly in Figma afterwards; the implementer's
extraction was correct on every point, including the non-obvious one.

| Part | Node | Values |
| --- | --- | --- |
| heading | `45497-144386` | Inter Regular **32px**, line-height **1.25em**, ls −0.04em, **white** — note desktop is 48px / 1.04em. Breaks after `Your agent starts` |
| description | `45497-144387` | 16px, line-height 1.5em, ls −0.025em, fill **`rgba(255,255,255,0.8)`** — **differs from desktop's `#A3A6B2`.** This divergence is real, not an error |
| tiles | `45497-144406` | ~103.23px |

**Lesson for the remaining sections:** a per-breakpoint colour divergence like that
description fill is precisely what gets lost when a brief gives one breakpoint's
numbers and describes the other in prose. Extract both.

## MOBILE COVERAGE AUDIT — the mobile frame is roughly HALF-AUTHORED

I audited `web-chat-general-360` (`45487-98982`, 360 x 10910) at depth 1. It has
only **eight** children:

| Child | Node | y | Covers |
| --- | --- | --- | --- |
| `ui&bg` | `45487-112572` | −34 | hero background |
| `typography` | `45487-111211` | 116 | hero copy |
| `header-new` | `45487-111139` | 0 | header |
| `url` | `45487-112548` | 945 | hero personalizer |
| `section` | `45496-139032` | 1301 | **§2** comparison bento (w320, gap 40) |
| `section` | `45497-139684` | 3810 | **§4** surface tabs (w360, centred, gap 32) |
| `section` | `45497-144406` | 4542 | **§5** channels grid (w320, gap 40) |
| `section` | `45497-147576` | 5474 | **§6** deploy the ACI (w320, h1518) |

§6's internals: `image` `45497-147061` 320x658 at y212, stroke `#2A2B33` 0.5px,
radius 16px; `title` `45497-147505` column gap 20px; badge row `45497-147508` at
y910 gap 28px (horizontal on mobile too); items column `45497-147550` at y1030
gap 16px.

**Sections with NO authored mobile frame: §3 product bento, §7 design-system
showcase, §8 configurator, §9 ownership, and the §10 CTA.**

Two implementers independently reported this for §3 and §9 and were RIGHT both
times — §3's agent verified it across three separate fetches. It is systemic, not a
one-off. Those sections are necessarily extrapolated (aspect-ratio preserved at
full width, ~0.7 type scale), which every affected agent disclosed rather than
presenting as extracted. FLAG TO THE DESIGNER: half the page has no mobile design.

## §10 CTA (Task 17)

`title&button` `45487-82554` (width 842, column, gap 32px, centred):
- title `45487-82556` — `Put your agent inside your product`, Inter Regular 64 /
  lh 1.13em / ls −0.04em, centred
- description `45487-82557` — `Keep your agent’s model, runtime, and logic. One
  agent, every channel, one conversation.` (U+2019), 20px / lh 1.5em / ls −0.02em,
  `#8A8C99`, width 648
- primary `Explore Novu Connect`; secondary `Book a Demo` (border `#534B5D` 1px)

## Brand reference accents

`recent.dev` = `#E65006` · `todesktop.com` = `#0036FF` · default = `#c25cd6`

The `❖color` ellipse is the hue-shift source in both breakpoints — a large blurred
ellipse filled with the brand accent, `blur(174px)`, in Figma's `hue` blend mode.
