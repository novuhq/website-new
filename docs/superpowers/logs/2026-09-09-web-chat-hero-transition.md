# Hero personalization transition — 2026-09-09

The owner supplied frames `45487:94116`, `45487:87013`, `45487:87703`,
`45487:88406`, `45487:89109`, and `45487:89814` in Figma file
`sq4Qtfr7jrTKANvKpPFzWI`. Scope is the hero's existing domain preview.

| Property | Supplied design | Previous implementation | Change |
| --- | --- | --- | --- |
| Brand readiness | Brand applied before conversation | Fixed 1.4s delay independent of extraction | Explicit grayscale, waiting, recolor, conversation phases |
| Grayscale | Chat fades before recoloring | Filter applied only to empty-state orb | Animate the full panel filter |
| Dashboard | Content swaps through blur | Personalized rows appeared when blur started | Keep old content until full blur and extraction completion |
| Brand publication | Reveal during recolor | Provider colors changed immediately | Hero snapshots its displayed brand and scopes its CSS variables |
| Conversation | Top-anchored, cumulative messages | Bottom-anchored, first bubble wraps | Match measured message positions and widths |
| Final reply | Missing Email address table | Table font/spacing drift; separate reveal | Loaded Geist Mono, exact sizing, one entrance with reply |

Grayscale and blur take 600ms concurrently. Waiting has no timer. Once the brand
or fallback is ready, the dashboard and theme change under full blur, then resolve
over 800ms. The existing four-message sequence follows, with its thinking dwell
and 3s pauses. The final message holds before returning to message 1; the brand
persists. Reset immediately restores the live composer and invalidates pending
requests. Reduced motion waits for extraction then shows the complete static
conversation. The timer pauses when the hero leaves the viewport.

The panel's isolated hue blend needs an opaque black canvas beneath the exported
transparent gradient. Without it, the overlay paints transparent pixels solid
orange. Transparent orb assets use their own alpha as the hue-layer mask.

Desktop geometry verified against the final Figma panel: message group tops
81/150/242/311px, final table x16/y379, size289×124. Compact typography explicitly
preserves line-height when overriding font size, avoiding Tailwind merge drift.

The existing Novu provider remains dynamically loaded for idle/reset. URL
personalization still replaces the live session with the scripted preview.
