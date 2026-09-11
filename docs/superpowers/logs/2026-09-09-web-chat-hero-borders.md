# Web Chat hero border correction

Source: [Figma UI group, 45487:79081](https://www.figma.com/design/sq4Qtfr7jrTKANvKpPFzWI/Novu-Website-2.0?node-id=45487-79081&m=dev).
The design-context output flattens the strokes into ordinary white CSS borders.
Read-only Plugin API inspection revealed the missing paint blend modes and
outside alignment.

## Comparison

| Surface                         | Figma                                                                                 | Previous implementation         | Correction                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------- |
| Desktop dashboard `45487:79082` | 1px outside stroke; white solid plus two radial gradients, all `OVERLAY`; radius 24px | Normal 10% white inside border  | Separate masked outside paint layers, each using overlay blending |
| Desktop chat `45487:79594`      | 1px inside white 90% stroke, `SOFT_LIGHT`; radius 14px                                | Normal white 90% border         | Inside ring on a soft-light pseudo-element                        |
| Mobile dashboard `45487:112601` | Same overlay paints, 0.466176px outside stroke, radius 12px                           | Normal 1px inset ring           | Fractional masked outside paints                                  |
| Mobile chat `45487:113113`      | White 90% soft-light stroke, 0.466176px inside, radius 6.526471px                     | Normal 1px border, radius 6.5px | Fractional inside ring and matching radius                        |

The `chat-area` wrapper (`45487:79593`) has no visible stroke. The border belongs
to its inner `chat` frame.

## Implementation

- `hero-agent-panel.tsx` separates the stroke from the frame's fill using an
  inset-ring pseudo-element with `mix-blend-soft-light`. Padding reserves the
  content space previously occupied by the border. The background reaches under
  the stroke so the blend has the correct backdrop.
- `hero.tsx` paints the dashboard's three strokes separately, in Figma's
  bottom-to-top paint order. Inverting the gradient transforms gives ellipses
  with radii `44.7844% / 37.5%` at `50% / 105.6618%`, and
  `57.8614% / 102.0107%` at `50% / -2.0107%`; their transparent stops are
  `76.3849%` and `41.0963%`, respectively.
- Outside strokes are siblings of the clipped dashboard surface. The existing
  content geometry remains 1364 × 680 on desktop and 636 × 317 on mobile; the
  stroke extends beyond those bounds as in Figma.
- The content container's `z-10` and the mobile frame's transform created
  stacking contexts that prevented the outside strokes from blending with the
  hero glow. The container retains normal paint order, and relative positioning
  supplies the same mobile offset without creating a transform stacking context.
- The existing `border-gradient` utility uses CSS border widths, which Chromium
  rounds to a full CSS pixel at DPR 1. A padding-based exclusion mask preserves
  the 0.466px mobile stroke. This stays local to the hero; shared styles are
  unchanged.
- All decorative stroke layers ignore pointer events. Chat, personalization,
  reset, keyboard focus, and the conversation state machine retain their logic.

## Validation

- `pnpm lint --ignore-pattern '.claude/worktrees/**'`: passed with the five
  existing homepage image warnings; the exclusion avoids another checkout.
- `pnpm typecheck`: passed.
- Ad-hoc browser checks passed at 1920px, 1440px, and 390px: frame dimensions
  match the pre-change captures; the three outside layers use overlay blending
  and 1px / 0.466px masks; the chat uses a soft-light 1px / 0.466px inset ring.
  Personalization and reset work, stroke layers ignore pointer events, and
  there is no horizontal overflow or page exception.
- Default and personalized screenshots were visually checked at desktop and
  mobile sizes, followed by a full-page pass.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/critical-flows/web-chat.spec.ts --project=desktop-chromium --project=mobile-chromium`:
  all 14 tests passed.
- `pnpm build`: compiled and passed TypeScript, then failed collecting page data
  for `/careers/[slug]` with `Missing Notion careers read configuration`, the
  existing environment blocker.

Local evidence:

- `/tmp/web-chat-border-qa.cjs`
- `/tmp/web-chat-border-{before,after}.json`
- `/tmp/web-chat-border-{1920,1440,390}-{before,after,personalized,page}.png`
- `/tmp/web-chat-border-flows.log`
- `/tmp/web-chat-border-build.log`
