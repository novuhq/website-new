# App Router Instructions

These instructions apply to everything under `src/app/`.

Read the root `AGENTS.md` first. Normative keywords in this file inherit their meanings from the root file.

## Scope

- route files
- layouts
- metadata exports
- static params
- JSON-LD or other route-level structured data

## Route Composition Rules

- Route files SHOULD stay thin and compose sections from `src/components/`.
- Reusable visual markup MUST NOT be duplicated in route files when it belongs in `src/components/`.
- Route files MAY own page-level data objects and section composition when that matches the repo pattern.
- Server components SHOULD be the default. Client boundaries SHOULD be added only when the route truly needs client-side behavior.

## Metadata And SEO

- Shared metadata helpers SHOULD be used when they fit the route family.
- Public routes MUST keep metadata intentional and complete.
- If a change affects discoverability, canonical URLs, sitemap behavior, or social metadata, agents SHOULD verify the rendered output directly.
- JSON-LD and other route-level structured data SHOULD stay close to the route that owns the public page.

## Routing And Data Rules

- Existing App Router patterns MUST be followed before introducing a new route shape.
- `generateStaticParams`, `generateMetadata`, and `notFound()` behavior SHOULD stay aligned with the route family already used in the repo.
- Content source-of-truth SHOULD NOT be embedded directly in route markup when the project already has a content system or helper for it.

## Layout Rules

- Shared shell concerns such as providers, header, footer, and cookie banner SHOULD live in layouts.
- Layouts MUST stay structural. Reusable section markup SHOULD NOT be moved into layouts only because multiple pages happen to use it.

## Validation Focus

- Route changes MUST be checked for composition integrity and responsive behavior.
- SEO-sensitive public route changes SHOULD be checked in rendered output when touched.
- Visual route changes SHOULD be verified in-browser with `webapp-testing`.
