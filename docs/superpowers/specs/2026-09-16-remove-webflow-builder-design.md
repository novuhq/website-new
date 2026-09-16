# Remove the Webflow Web Chat Builder Page

## Goal

Unpublish `/channels/web-chat/webflow` so it returns the same real 404 response as any other unsupported builder slug. Keep the remaining 13 Figma-backed Web Chat builder pages unchanged.

## Design

- Remove `webflow` from the public Web Chat builder registry and from `generateStaticParams()` output.
- Keep the shared Webflow-derived sections, FAQ content, and channel artwork that the remaining builder pages currently reuse.
- Refactor the internal base data only as needed to ensure it is not itself a publishable Webflow page.
- Remove the unused Webflow hero media registration and import if no published page references it.
- Do not add a redirect, tombstone page, or special-case route handler; the existing dynamic route will call `notFound()` for the absent registry entry.

## Public Behavior

- `/channels/web-chat/webflow` returns HTTP 404 and emits no page JSON-LD.
- `getWebChatBuilderBySlug("webflow")` returns `undefined`.
- `getAllWebChatBuilderSlugs()` returns the 13 supported builder slugs.
- Every other builder page keeps its current hero, shared body sections, metadata, CTA, and media.

## Testing

- Update the registry contract test first and confirm it fails while Webflow remains published.
- Add Webflow to the existing unsupported-slug browser coverage.
- Move shared page interaction and geometry coverage to a remaining published page, using Blink.new where hero-specific assertions are required.
- Run unit tests, lint, typecheck, formatting, and focused desktop/mobile browser checks.

## Non-goals

- Rewriting Webflow-derived shared body copy.
- Changing the remaining builder slugs or hero designs.
- Redirecting the removed URL.
