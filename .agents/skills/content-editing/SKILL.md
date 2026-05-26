---
name: content-editing
description: Use when updating marketing copy, markdown or MDX content, frontmatter, structured content objects, or other user-facing content sources. Keeps edits aligned with the existing content model and rendering pipeline.
---

# Content Editing

## When to Use

- Update headlines, descriptions, CTA labels, or other page copy
- Edit markdown or MDX documents
- Change frontmatter or structured content fields
- Fix broken content references, links, images, or taxonomy values
- Refresh public content while preserving the existing content model

## Workflow

1. Identify the content source of truth before editing.
   - Prefer markdown, MDX, structured content objects, or page-level content data over hardcoded JSX copy.
2. Inspect nearby examples before changing the shape of the content.
   - Reuse existing field names, frontmatter conventions, and taxonomy patterns where they already exist.
3. Keep content changes local to the right layer.
   - Update page copy in data or content files.
   - Do not hide route-specific copy inside shared UI primitives.
4. Preserve the rendering contract.
   - If the repo already has an MDX component map or content pipeline, keep content compatible with it.
   - If a new MDX component is genuinely needed, update the central mapping and renderer instead of relying on unsupported one-off tags.
5. If discoverability changes, verify the rendered metadata and linked content directly.

## Validation

- Check frontmatter or structured fields for completeness and correct field names.
- Validate internal links, image paths, slugs, and taxonomy references.
- Keep heading structure readable and scannable.
- Render the page in-browser when the edit affects MDX, media, tables, tabs, or custom components.
