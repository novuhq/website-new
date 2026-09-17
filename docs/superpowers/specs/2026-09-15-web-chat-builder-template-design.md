# Web Chat Builder Template Design

## Goal

Create a reusable, Figma-driven landing-page template for website builders at `/channels/web-chat/[slug]`. The first published page is `/channels/web-chat/webflow`; additional builder pages will be added later by supplying typed configuration rather than duplicating route or section markup.

## Source of Truth

- Visual layout, responsive behavior, section order, copy, and imagery come from Figma node `45917:59209` in “Novu Website 2.0.”
- Existing repository patterns, design tokens, shared components, and route conventions take precedence over generated reference code.
- The existing `/channels/web-chat` spelling remains canonical.

## Architecture

Add a thin App Router page at `src/app/(website)/(connect-footer)/channels/web-chat/[slug]/page.tsx`. It resolves a builder page from typed data, generates static parameters and metadata, renders the shared template, and calls `notFound()` for unknown slugs.

Builder content lives in a dedicated data module under `src/data/pages/`. It exposes a typed page model, a Webflow entry, a slug lookup helper, and the list used by `generateStaticParams()`. The initial list contains only `webflow`.

Reusable visual sections live under `src/components/pages/channels/web-chat-builder/`. The route owns no reusable section markup. Existing shared primitives and sections are reused when their APIs and rendered output match the Figma design; narrowly different sections remain local to the builder-page family.

## Page Model

The typed builder configuration contains:

- slug and builder identity
- SEO title, description, canonical pathname, and social-image data when present in the design or repository assets
- hero copy and actions
- ordered section content and builder-specific labels
- CTA and FAQ content
- references to builder-specific media

The model describes content, not CSS variants. New builder pages should normally require a data entry and their media, not conditional branches throughout shared components.

## Assets and Styling

Figma-exported icons and images are committed locally because temporary Figma asset URLs expire. True vector marks remain SVG. Complex decorative compositions, screenshots, masks, and glow-heavy artwork are exported as a single 2x raster image where independent DOM interaction is unnecessary.

Tailwind CSS v4 utilities and existing semantic tokens are used first. Reusable missing values are promoted to the global token system; localized geometry may use arbitrary values. Shared component APIs remain coherent and do not gain Webflow-only switches.

## Routing, Metadata, and Failure Behavior

`generateStaticParams()` emits `{ slug: "webflow" }`. `generateMetadata()` resolves the same configuration used by the page so metadata and visible content cannot drift. Unknown slugs return the project 404 through `notFound()`. The route uses the existing Connect footer layout and shared website shell.

## Accessibility

The page preserves semantic heading order, descriptive link text, keyboard-accessible controls, visible focus behavior, and meaningful alternative text. Decorative artwork is hidden from assistive technology. Responsive layout changes must not alter reading order.

## Verification

Implementation proceeds one Figma section at a time. Each section is compared in-browser at desktop and mobile widths before moving to the next, followed by a full-page pass. Verification includes links, metadata, the Webflow route, an unknown slug, responsive overflow, and browser console errors.

Focused tests cover data lookup and route/static-parameter behavior where practical. Required repository checks are `pnpm lint`, `pnpm typecheck`, and `pnpm build`.

## Non-goals

- Publishing builder slugs other than `webflow`
- Introducing a CMS or MDX pipeline for these pages
- Redesigning the existing `/channels/web-chat` landing page
- Refactoring unrelated channel or homepage sections
