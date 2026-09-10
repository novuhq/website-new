# Web Chat visual audit — September 10

Reference: [desktop page, 1920px](https://www.figma.com/design/sq4Qtfr7jrTKANvKpPFzWI/Novu-Website-2.0?node-id=45487-79054).
Checked with the user-level Figma MCP and local Chromium screenshots at the authored width.
The previously requested responsive behavior, CSS hero bloom, personalization, and
downward desktop framework animation take precedence over older static frames.

| Section          | Observed difference                                                                                                          | Resolution                                                                                                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page typography  | Most sections inherit Brother 1816; Figma specifies Inter. Hero, configurator, and CTA already use Inter.                    | Apply the existing Inter font to the route wrapper, matching adjacent channel routes. This resolves remaining caption and ownership wrapping differences.      |
| Hero             | Main copy and chat panel align within approximately 1px. The section ends about 60px early, moving the next section upward.  | Reserve the full authored desktop hero height; comparison starts at y1500.                                                                                     |
| Hero backdrop    | CSS light distribution differs from the raster reference.                                                                    | Retain the CSS bloom requested by the user; do not describe it as pixel-identical.                                                                             |
| Comparison       | Card row is 1280px instead of 1344px. Left caption wraps onto three lines. Description is 30px too high.                     | Restore the wider desktop row and description offset; caption returns to two lines.                                                                            |
| Product bento    | Narrow desktop heading wraps onto three lines. Card row is 64px too narrow. Caption padding reduces the intended text width. | Restore two heading lines, 660px/432px card widths, and intended caption width at wide desktop.                                                                |
| Surface selector | Desktop button stretches to 495px and is 10px too tall. Mobile title/description/tab gaps differ.                            | Compact desktop button, 44px height, and authored mobile spacing. Section height now approximately 845px desktop / 605px mobile versus 844px / 604px in Figma. |
| Channels         | Glyphs fill their icon boxes instead of retaining inner padding; email uses white rather than purple.                        | Add the missing padding and use Figma Email and Teams vectors.                                                                                                 |
| Deploy ACI       | Artwork is 1344px rather than 1280px; heading/badges are 32px too far left; feature list is 96px too far right.              | Restore artwork width and text insets. Keep user-approved moving corner frames and reduced-motion behavior.                                                    |
| Design system    | Heading lacks its 32px inset; description gap is 16px rather than 24px.                                                      | Restore heading/action insets and vertical gaps. Artwork stays at its correct 1280×520 size.                                                                   |
| Configurator     | Layout closely matches the current frame; generated prompt text differs from the static mock.                                | Retain working configuration behavior and existing glow/frame treatment.                                                                                       |
| Ownership        | Balanced wrapping overrides the authored line break after “web.”                                                             | Restore the desktop line break, retaining responsive wrapping below xl.                                                                                        |
| Final CTA        | Headline, two-line description, and actions closely match the reference.                                                     | Keep the current shared CTA and its animated background.                                                                                                       |

The global navigation reflects the current shared site, including current GitHub
star count, rather than the older navigation labels in this design. Mobile sections
without authored Figma frames remain responsive adaptations, not exact matches.

Header and footer are explicitly excluded from changes at the user's request.
The final desktop comparison aligns the comparison section at y1500 and product
section at approximately y2376. Later sections retain roughly 5px of cumulative
vertical difference from text line boxes and separators. Ownership also receives
the authored 32px desktop offset. This is not a claim of pixel-identical rendering.

Validation:

- Desktop and mobile screenshots inspected section by section, followed by a
  full-page comparison at 1920px; responsive checks cover 320–1920px.
- `pnpm exec playwright test tests/critical-flows/web-chat-responsive.spec.ts tests/critical-flows/web-chat-aci.spec.ts`: 16 passed across Chromium and WebKit desktop/mobile projects.
- Final responsive rerun after the ownership offset: 2 passed on desktop Chromium
  and mobile WebKit.
- `pnpm lint --ignore-pattern '.claude/worktrees/**'`: passed with five existing
  image-element warnings and no errors.
- `pnpm typecheck`: passed.
- `git diff --check`: passed.
- `pnpm build`: compilation and TypeScript succeeded, but page-data collection
  failed for `/careers/[slug]` with `Missing Notion careers read configuration`.

Concurrent configurator and shared select changes in the workspace belong to a
separate task and are not attributed to this audit.
