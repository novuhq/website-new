# Components Instructions

These instructions apply to everything under `src/components/`.

Read the root `AGENTS.md` first. Normative keywords in this file inherit their meanings from the root file.

## Scope

- `src/components/ui/`: shared primitives and wrappers
- `src/components/pages/`: route-family sections and page fragments
- `src/components/content/`: MDX and rich-content rendering components
- header, footer, cookie-banner, and other shared UI areas

## Placement Rules

- Generic reusable primitives MUST live in `src/components/ui/`.
- Route-family sections SHOULD live in `src/components/pages/<route-family>/`.
- Markdown and MDX presentation MUST live in `src/components/content/`.
- Route-specific section markup SHOULD NOT live in `src/app/` when it can be owned here.

## Component Rules

- Agents MUST inspect `src/components/ui/`, `src/components/content/`, and nearby `src/components/pages/*` files before adding a new component.
- Shared components SHOULD stay composable and prop-driven.
- Route-specific copy MUST NOT be hardcoded into shared primitives when the project already has a page-level data object or content source.
- If the missing piece is a UI primitive, agents SHOULD use `shadcn` before inventing custom primitive markup.

## `src/components/ui/`

- Components here MUST stay generic and reusable.
- Variants and composition SHOULD be preferred over route-specific one-off branches.
- Use `cn()` for class composition where the project already uses it.
- shadcn-managed components MUST be added through the CLI and then adapted. Do not paste registry code by hand.

## `src/components/pages/`

- These components SHOULD remain presentation-first sections for one route family or one repeatable page pattern.
- Copy, media, and actions SHOULD come through props or page-level data objects when that matches the repo pattern.
- Before introducing bespoke markup, agents MUST map the design or request against existing sections, shared blocks, and primitives.
- Before extending a shared component, agents MUST inspect its current API and current usages.
- One-off props or branches SHOULD NOT be added to shared components for a single section unless the behavior is likely to be reused.
- If matching a section requires several page-specific knobs, agents SHOULD keep the shared component stable and create a route-local subcomponent instead.

## `src/components/content/`

- Compatibility with the central MDX component mapping MUST be preserved.
- If a new MDX component is needed, it MUST be wired through the central mapping instead of being assumed ad hoc in one document.
- Markdown and MDX renderers SHOULD stay accessible and resilient because they affect many pages at once.

## Styling Rules For Components

- Tailwind utilities and semantic tokens SHOULD be preferred over raw values.
- Arbitrary values SHOULD be used only when no scale value, token, or shared utility fits the requirement cleanly.
- Raw hex colors MUST NOT stay in component JSX when the value belongs in a shared token.
- Repeated arbitrary values or repeated class groups SHOULD be promoted into a token, utility, variant, or reusable wrapper.
- Global token and utility ownership lives in `src/styles/AGENTS.md`.

## Validation Focus

- Shared component edits MUST be checked across affected routes, not only the page being edited.
- Interactive component work MUST preserve keyboard behavior, focus states, and basic aria expectations.
- Visual component changes SHOULD be verified with `webapp-testing`.
