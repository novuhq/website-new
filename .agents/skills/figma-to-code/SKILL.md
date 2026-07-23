---
name: figma-to-code
description: Use when given a Figma URL and asked to make a component or section match the Figma design. Covers fetching Figma data, mapping design tokens to Tailwind/CSS, and updating component code.
---

# Figma to Code

## Overview

Use this skill when a Figma frame or node is the visual source of truth for a component, section, or page. Preserve repository patterns where they already fit, but close the visual gap against the current target design.

## Workflow

### 0. Work one section at a time
- For a full page, start with the first unresolved content section after the shared shell.
- Do not read ahead across the whole page or inspect later sections before the current one is closed.
- Fetch only the current section's design data and the current section's code.
- Implement and visually verify the current section before moving to the next one.
- After one section is accepted, continue directly to the next requested section unless the user explicitly asked for checkpoints or you are blocked.
- If a shared component looks close, inspect its current API and usages before deciding whether to reuse or extend it.
- Prefer the existing shared API first. If the required behavior is small and reusable, extend it. If matching the design needs several page-specific switches, create a route-local component instead.

### 0.1 Choose the asset strategy before writing JSX
- If the current node is a mixed-media illustration or decorative visual with raster fills, masks, blur, glow, screenshots, or many tiny vector layers, export it as one raster asset and use a single image in code.
- Do not manually rebuild those visuals from many SVG files or absolute-positioned DOM layers unless the user explicitly asks for that or the design requires independent interaction targets.
- Default these exports to `2x`.
- Prefer `jpg` or `webp` for fully opaque artwork.
- Use `png` only when transparency is required.
- Keep SVG for true vector assets such as logos, icons, simple charts, or reusable diagram pieces.

### 1. Fetch in parallel
- Use the available Figma read tool for the current environment to fetch the current node's design data.
- Read the current component or route files in parallel.
- Convert URL parameters into the node format required by the active Figma tool before reading the node.

### 2. Build a comparison table

Before editing, list the current differences for the active section:

| Property | Figma | Current | Action |
|---|---|---|---|
| font-weight | 400 | `font-semibold` | fix |
| letter-spacing | -0.02em | `tracking-tight` (-0.025em) | fix |
| gap (image) | 40px | `lg:mt-20` (80px) | fix |
| color | #040406 | `text-foreground/80` | fix |

### 3. Map Figma values → Tailwind

- Prefer existing Tailwind scale utilities, semantic tokens, and shared utilities before introducing arbitrary values.
- Map line-height to named utilities or shared typography utilities before using `leading-[...]`.
- Convert exact quarter-rem sizing values to the existing spacing scale when a matching class exists.
- Keep arbitrary values only for localized geometry, cropping, percentages, `calc(...)`, or other values that do not belong in the design system.

### 4. Add missing design tokens to `globals.css`

- If the design needs a reusable value that the system does not expose yet, add it centrally in the project's token file instead of embedding fragile one-off values in JSX.
- If the design references an existing project token, reuse it instead of creating a new raw value.
- Shared color tokens should be exposed through the project's Tailwind theme mapping instead of left as raw hex classes in components.

### 5. Container sizing

- Figma content widths are usually content-only, not outer container widths. Account for horizontal padding when translating frame widths to container `max-w-*` values.
- If the design depends on a font family or weight that is missing from the project, surface that gap explicitly instead of silently approximating it.
- Update page copy in the page-level data source or content source of truth rather than hardcoding it into shared components.

## Spacing: Figma layout → margin/gap

- Figma frame spacing is usually layout spacing, not a signal to add arbitrary responsive overrides.
- Map sibling spacing to the correct parent or child utility instead of stacking unrelated margins.

## Common Mistakes

- Reading several Figma links or nodes before closing the current section.
- Rebuilding mixed-media artwork from many DOM layers when one exported asset is the correct implementation.
- Leaving raw colors or repeated arbitrary values in JSX when the project clearly needs a shared token or utility.
- Extending a shared component with multiple page-specific switches instead of introducing a route-local wrapper or section component.
- Treating visual verification as a final-page-only activity instead of a per-section acceptance gate.

## Acceptance Checklist

- The current section matches the target structure, spacing, typography, content, and assets closely enough to move on.
- Shared components remain coherent and reusable after the change.
- New reusable values have been promoted into the project's token or utility system where appropriate.
- The current section has been visually verified on the required breakpoints before the next section starts.
