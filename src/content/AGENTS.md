# Content Instructions

These instructions apply to everything under `src/content/`.

Read the root `AGENTS.md` first. Normative keywords in this file inherit their meanings from the root file.

## Scope

- markdown and MDX content files
- structured content objects and frontmatter
- taxonomy or lookup data if the project keeps it under `src/content/`

## Content Source Of Truth

- Content MUST be edited in its source-of-truth file, not copied into route markup.
- Taxonomy values, slugs, author IDs, and other lookup references MUST stay aligned with the data files that define them.
- If the project already has a structured content model, agents SHOULD preserve existing field names and document shape.

## Frontmatter Rules

Common frontmatter fields in this baseline may include:

- `title`
- `description`
- `caption`
- `slug`
- `publishedAt`
- `updatedAt`
- `cover`
- `seo.title`
- `seo.description`

Frontmatter SHOULD stay complete and internally consistent for new content and major edits.

## Markdown And MDX Rules

- Markdown SHOULD be the default authoring format unless richer presentation is required.
- When richer presentation is needed, agents SHOULD use the MDX vocabulary already supported by the repo instead of inventing unsupported custom tags.
- If a new MDX component is genuinely needed, the rendering pipeline and component mapping MUST be updated centrally.

## SEO And Content Quality

- Titles and descriptions SHOULD stay specific and useful.
- Heading structure SHOULD stay readable and scannable.
- Content edits MUST remain compatible with metadata, excerpt, feed, or listing pipelines that consume the content.
- If content changes affect public discoverability, agents SHOULD verify the rendered metadata and linked content directly.

## Validation Focus

- Validate markdown structure, frontmatter completeness, taxonomy references, and final rendering.
- If content changes include media, tables, tabs, or custom MDX components, the rendered page SHOULD be checked in-browser.
