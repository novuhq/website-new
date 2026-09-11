# Web Chat hero design feedback — September 10

Scope: the six annotated screenshots supplied by the designer. Header and footer
are unchanged.

| Detail                         | Previous implementation                       | Updated implementation                                                                 |
| ------------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------------- |
| Backdrop grain                 | Synthetic 180px tile at 10% opacity           | Original Figma 1024px tile, overlay at 32% (`45487:79075`)                             |
| Dots                           | Width stretched independently of fixed height | Both desktop and mobile exports retain their intrinsic aspect ratio                    |
| Copy Prompt tooltip            | Shared arrow explicitly hidden                | Existing site arrow positioned below the tooltip, including collision fallback         |
| Transition                     | Grayscale on the whole panel                  | Grayscale and reduced brightness on background layers only (`45487:94656`)             |
| Default/fallback user messages | Purple accent fill                            | Black fill and white text (`45487:138548`); brand previews retain the extracted accent |
| Header avatar                  | Glow clipped to a circle                      | Original logomark with unclipped blur; header expand icon matches the design diagonal  |
| Selected submission            | Solid purple checkbox without a check         | Exact Figma SVG checkbox (`45487:86525`) and default `purple-1/30` row (`45487:86523`) |
| Default send button            | Accent purple with white chevron              | `purple-2` with black chevron; personalized colors remain dynamic                      |
| Processing status              | Continuously spinning                         | Static icon                                                                            |
| Message timing                 | 700ms reveal, 900ms thinking, 3000ms gap      | 350ms reveal, 450ms thinking, 1500ms gap; final hold remains 3000ms                    |

The motion review recommended keeping the existing entrance easing
`cubic-bezier(0.22, 1, 0.36, 1)` and branding transition durations. The final reply
now arrives six seconds after the first message instead of twelve. Reduced motion
still waits for the brand and then shows the complete conversation without motion.

Assets: `hero-noise.png` is the original Figma texture; `hero-selected-checkbox.svg`
includes the check and its translucent background. An attempted avatar export
included the parent panel background and was discarded; the existing logomark
asset remains in use.

Visual checks covered 390px, 639px, 1920px, and 2560px layouts, default state,
grayscale waiting, failed extraction, and successful personalization. The browser
captures confirmed no horizontal overflow and uniform dot scaling. Final gray
brightness, header icon, and tooltip arrow were also checked at desktop and mobile
sizes. Browser captures are stored under `/tmp/web-chat-feedback-*.png`.

Validation:

- `pnpm test`: 247 passing tests.
- `pnpm typecheck`: passed.
- `pnpm lint --ignore-pattern '.claude/**' --ignore-pattern '.superpowers/**'`:
  no errors; five existing home-page image warnings. Excludes unrelated nested
  worktrees and local scratch files.
- `pnpm build` with critical-flow fixtures: passed, 387 routes generated.
- Production Playwright run of `web-chat.spec.ts`, `web-chat-transition.spec.ts`,
  and `web-chat-responsive.spec.ts`: all 52 tests passed across desktop/mobile
  Chromium and WebKit. Earlier browser runs had intermittent timeouts; the final
  run passed without retries, with screenshot capture running separately.
- Prettier and `git diff --check`: passed.
