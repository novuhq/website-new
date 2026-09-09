# Web Chat hero URL states

Source: [Figma URL states, 45487:94047](https://www.figma.com/design/sq4Qtfr7jrTKANvKpPFzWI/Novu-Website-2.0?node-id=45487-94047&m=dev).
The design contains default (`45487:94048`), hover (`45487:94064`), active
(`45487:94080`), and filled (`45487:94096`) examples.

## Comparison and changes

| Property               | Figma                                                              | Previous implementation                                   | Result                                                                               |
| ---------------------- | ------------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Desktop geometry       | Outer pill 832 × 68; field 541 × 44; submit 205 × 44               | Already matched                                           | Retained                                                                             |
| Default / filled field | White 10% background and border                                    | Already matched                                           | Retained                                                                             |
| Hover / focused field  | White 14% background, white 60% border                             | Already matched                                           | Retained                                                                             |
| Focus indicator        | Bright rounded field border                                        | Global focus ring added a blue rectangle around the input | Suppressed the inner ring locally; kept the rounded border and forced-colors outline |
| Text                   | Inter Regular 18px / 18px; 46px from field edge                    | Inherited line height; text started at 47px               | Explicit `leading-none`; adjusted left padding for the 1px border                    |
| Submit hover           | `#e6e6e6`                                                          | Local `hover:bg-white` overrode the shared button hover   | Reused `gray-10` for hover and keyboard focus                                        |
| Reset icon             | Figma's 1.5px-stroke glyph, 20.5px visible bounds centered in 24px | Lucide `RotateCw` used different geometry                 | Replaced with the exact Figma SVG export                                             |

The placeholder remains white at 40% opacity; entered text remains white. The
reset icon remains at 40% opacity and becomes fully visible on hover or keyboard
focus. Each control responds to its own hover target. The existing mobile
two-row layout retains 16px input text and uses the same state colors and icon.

The input's extra focus ring came from `:where(:focus-visible)` in
`src/styles/globals.css`, which applies a 2px ring and 2px offset. The local input
classes now clear both; `outline-hidden` preserves a visible outline in forced
colors. The global rule and other controls' focus indicators are unchanged.

## Implementation and asset provenance

- `src/components/pages/channels/web-chat/url-personalizer.tsx` reuses the shared
  `Button`, existing field styles, and a shared local input class for both layouts.
- `src/images/pages/channels/web-chat/hero-reset.svg` is the unchanged vector
  export from Figma `45487:94076` / group `45487:94077`, rendered at its 20.5px
  visible bounds inside a 24px wrapper. It is exported through
  `src/data/pages/web-chat.ts` alongside the existing globe asset.
- Submission, reset, loading, brand extraction, and conversation logic are
  unchanged by this pass. The source provides no additional loading/error state.

## Validation

- `pnpm lint --ignore-pattern '.claude/worktrees/**'`: passed with five existing
  homepage image warnings. The exclusion avoids linting another checkout.
- `pnpm typecheck`: passed.
- Ad-hoc Playwright checks at 1440px and 390px verified default, field/button/reset
  hover, active and filled states, text alignment, keyboard focus and reset,
  forced-colors focus visibility, no horizontal overflow, and no page exceptions.
  Individual state screenshots were visually compared with the Figma reference.
  The final full-page pass covered both breakpoints after scrolling to load the
  illustrations.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/critical-flows/web-chat.spec.ts --project=desktop-chromium --project=mobile-chromium`:
  all 14 tests passed.
- `pnpm build`: compiled successfully and passed TypeScript, then failed while
  collecting `/careers/[slug]` page data with
  `Missing Notion careers read configuration`, the existing environment blocker.

Local evidence:

- `/tmp/web-chat-url-states-qa.cjs`
- `/tmp/web-chat-url-states-results.json`
- `/tmp/web-chat-url-{1440,390}-{default,field-hover,button-hover,reset-hover,active,filled}.png`
- `/tmp/web-chat-url-{1440,390}-{hero,page}.png`
- `/tmp/web-chat-url-flows.log`
- `/tmp/web-chat-url-build.log`
