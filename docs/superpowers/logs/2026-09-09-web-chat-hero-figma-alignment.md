# Web Chat hero — Figma alignment, 2026-09-09

Scope: the hero on `/channels/web-chat/`. The restored Novu chat and URL
personalization remain interactive. This log supersedes earlier hero-specific
gradient/export guidance in the handoff.

## References

- Desktop: [45440:66780](https://www.figma.com/design/sq4Qtfr7jrTKANvKpPFzWI/Novu-Website-2.0?node-id=45440-66780).
- Mobile: `45487:98982`, typography `45487:111211`, product UI
  `45487:111242`, URL group `45487:112548`.
- Agent panel: `45440:67319`; orb: `45440:67330`.

## Changes

| Area         | Previous difference                                                              | Current implementation                                                                   |
| ------------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Typography   | Inter applied only to the heading group; CLI fell back to system mono            | Entire hero uses Inter; CLI loads Geist Mono                                             |
| CTA          | Extra Copy Prompt icon, incorrect width and placement                            | Text-only 136px button, 393px CLI, matching order and spacing                            |
| Tablet       | Desktop columns squeezed the heading                                             | Mobile composition continues below 1024px                                                |
| Agent panel  | Approximate radial gradient and oversized/misaligned orb                         | Figma affine gradient, exported light, 2× orb, matching insets and composer              |
| Product UI   | Mobile rows collapsed; dashboard lacked the full fade                            | 22px compact rows and the authored fade to black                                         |
| Personalizer | Different globe, mobile font and box sizing                                      | Exported globe, 16px mobile input, 832×68 desktop and 320×114 mobile cards               |
| Background   | Transparent exports changed pass-through blending and made the bottom too bright | Desktop/mobile decorative layers exported against black, including masks, noise and dots |

Shared `CopyCommand`, `CopyPromptButton`, `Button` and `Tooltip` APIs are reused.
The background exports contain only decoration; text, dashboard and chat remain
DOM. Temporary Figma export frames were removed after downloading the assets.

The retired `hero-glow.webp` and `wc-agent-panel-surface` approximation are
replaced by the current exports. Their blend and geometry differences prevented
reuse for this reference. Backgrounds are optimized WebP (about 40KB combined);
the transparent orb is a 700×524 PNG rendered at 350×262 desktop and proportionally
smaller on mobile.

The desktop background keeps a minimum 1920px canvas, centered and clipped at
smaller desktop widths, so the glow stays behind the fixed-height product card.

## Geometry and evidence

At 1920px, the rendered heading starts at `(320, 185)`, the product card is
1364×680 at `(278, 439.47)`, the panel is 408×647 at `(1218, 455.47)`, and the URL
card is 832×68 at `(544, 1139.47)`. The fractional offsets follow browser text
metrics and are within a pixel of the reference's card coordinates.

At 360px, the panel is 190.19×301.61 at `(142, 607.08)` and the URL card starts
at `(20, 944.63)`. The reference is `(142.20, 607.46)` and `(20, 945)`.

Browser screenshots are saved under `test-results/hero-figma/` for widths
360, 390, 768, 1024, 1280 and 1920. Each width passed checks for horizontal
overflow, panel visibility and both clipboard actions, with no page errors.
The complete CLI fits on desktop; the mobile preview truncates while copying
the complete command. Homepage screenshots at 390px and 1440px cover the shared
stylesheet removal.

## Validation

- `pnpm test`: 49 passing tests.
- `pnpm lint --ignore-pattern '.claude/worktrees/**'`: no errors, five existing
  image warnings outside this page. The exclusion is a separate nested checkout.
- `pnpm typecheck`: passed after the final build. Run sequentially with the build
  to avoid the build deleting `.next/types` while TypeScript reads it.
- Personalization Playwright suite: 12 passing desktop/mobile Chromium cases.
- Novu SDK Playwright suite: four passing desktop/mobile cases on an isolated
  server with a fixture identifier and mocked HTTP/WebSocket traffic. Covers
  sending, streaming, failed-draft retry, approvals, responsive session continuity
  and preview reset.
- `pnpm build`: compilation and TypeScript passed; page-data collection fails
  for `/careers/[slug]` with `Missing Notion careers read configuration`.

The local `.env.local` still lacks `NEXT_PUBLIC_NOVU_APP_IDENTIFIER`. Real backend
responses require that existing configuration; the SDK tests use fixtures.
