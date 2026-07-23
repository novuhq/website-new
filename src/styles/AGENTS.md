# Styles Instructions

These instructions apply to everything under `src/styles/`.

Read the root `AGENTS.md` first. Normative keywords in this file inherit their meanings from the root file.

## Scope

- `src/styles/globals.css`
- `src/styles/typography.css`
- `src/styles/shiki.css`
- `src/styles/video.css`

## Source Of Truth

- `src/styles/globals.css` MUST remain the central source of truth for semantic tokens, shared utilities, and Tailwind v4 theme wiring.
- Design-system-level CSS MUST NOT be scattered across unrelated files when it belongs here.
- Global style files MUST support reusable system behavior, not hide page-specific hacks.

## Tailwind v4 Rules

- Tailwind utilities SHOULD be preferred before custom CSS.
- Existing semantic tokens MUST be preferred before raw values.
- Arbitrary values SHOULD be used only when no scale value, token, or shared utility fits the requirement cleanly.
- Exact quarter-rem sizes SHOULD be mapped to the existing spacing scale instead of left as arbitrary values.
- Named line-height utilities or shared utilities SHOULD be preferred before `leading-[...]`.
- Repeated arbitrary values MUST be promoted into a token, utility, or reusable pattern when they represent system behavior rather than one local exception.
- New shared colors MUST be added centrally and SHOULD use the same HSL component format already used in `globals.css`.
- Tailwind theme exposure for shared color tokens SHOULD use `hsl(var(--token-name))`.
- `@theme inline`, `@utility`, and `@layer` changes MUST be treated as system-level changes because they affect the whole app.

## Token Rules

- Reusable semantic values MUST be added centrally.
- Multiple token names for the same concept SHOULD NOT be introduced.
- Page-specific tokens MUST NOT be added to global styles just to hide one-off values.
- Typography, radius, spacing, and color decisions SHOULD stay aligned with the existing token model.

## Utility Rules

- New custom utilities SHOULD be added only for repeated needs or genuine Tailwind gaps.
- One-off utilities SHOULD NOT be added when a local Tailwind expression is clearer.
- If a utility is added, it MUST be named semantically and stay reusable.

## Change Safety

- Changes here can affect many routes at once, so verification MUST be broad.
- After editing shared styles or tokens, representative pages and component families SHOULD be checked, not only the intended file.
- Visual changes SHOULD be verified with `webapp-testing`.

## Related Files

- Components consume these tokens and utilities through `src/components/`.
- Theme/font wiring also interacts with the helpers in `src/lib/` and route rendering in `src/app/`.
