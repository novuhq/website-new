# AGENTS.md

## Useful Commands

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm format`
- `pnpm format:fix`

# Project Instructions

## Instruction Model

- The keywords `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, `MAY`, and `OPTIONAL` in this file and in nested `AGENTS.md` files are to be interpreted as described in BCP 14 / RFC 2119 / RFC 8174 when, and only when, they appear in all capitals.
- `NEVER` is a project-specific hard prohibition for destructive or high-cost mistakes.
- This file is the canonical source of project-wide policy.
- The nearest nested `AGENTS.md` adds local rules for the subtree being edited. It does not replace this file.
- Skills own detailed workflows. `AGENTS.md` files MUST stay focused on policy, ownership, and acceptance criteria rather than duplicating skill runbooks.
- If a referenced path, workflow, or architectural rule changes, the matching instruction source MUST be updated in the same change or immediately after it.

Current nested instruction zones:

- `src/components/AGENTS.md`
- `src/app/AGENTS.md`
- `src/content/AGENTS.md`
- `src/styles/AGENTS.md`

## Project Baseline

- Stack: `Next.js 16`, `React 19`, `TypeScript`, `Tailwind CSS v4`, `shadcn/ui`, App Router
- Package manager: `pnpm`
- UI model: routes are composed from reusable sections and shared UI primitives
- Common source folders:
  - `src/app/`: routes, layouts, metadata wiring
  - `src/components/`: shared UI, route-family sections, content renderers
  - `src/content/`: markdown, MDX, or structured content sources when the project uses them
  - `src/styles/`: global tokens, utilities, and Tailwind v4 theme wiring
  - `src/lib/`: shared helpers, metadata helpers, utilities
  - `public/`: static assets and route media

## Core Workflow

- Agents MUST read this file first and then the nearest nested `AGENTS.md` for the touched subtree.
- Agents MUST inspect the current implementation and nearby patterns before creating new files or APIs.
- Existing behavior MUST remain unchanged unless the task explicitly changes it.
- Agents SHOULD reuse or extend existing components, helpers, and content structures before creating bespoke replacements.
- If an existing close match is not reused, agents MUST state the concrete blocker in the response or PR.
- Root-cause fixes MUST be preferred over suppressing symptoms.
- If `node_modules/` is missing, agents MUST install dependencies before relying on local validation commands or bundled Next.js docs.

## Skill Routing

- Project-level skills live in `.agents/skills/`.
- Explicit skill mention by the user MUST be treated as deterministic routing.
- When a request clearly matches a skill, agents SHOULD use the matching skill instead of improvising a custom workflow.
- If more than one skill applies, agents SHOULD use the smallest useful set in this order:
  1. planning
  2. implementation
  3. verification or audit

Default skill map for this baseline:

- `figma-to-code`
  - Figma URL, frame, node, or design-as-source-of-truth implementation work
- `shadcn`
  - missing primitive, standard UI component, CLI-managed component work
- `webapp-testing`
  - browser verification, screenshots, responsive QA, console inspection, local flow checks
- `content-editing`
  - markdown, MDX, frontmatter, copy refreshes, structured content updates
- `implementation-planning`
  - explicit planning, scoping, roadmap, or phased implementation requests
- `conventional-commit`
  - conventional commit message generation and commit workflow when the user asks to create a commit

If a skill should apply but is unavailable in the current environment, agents MUST follow the same workflow manually and SHOULD note the missing skill if it materially affected the process.

## Local Ownership

- Route composition, layouts, and route metadata rules live in `src/app/AGENTS.md`.
- Component placement, reuse, and shared-vs-local component rules live in `src/components/AGENTS.md`.
- Content source-of-truth and content-model rules live in `src/content/AGENTS.md`.
- Token, utility, and global styling rules live in `src/styles/AGENTS.md`.
- Detailed implementation workflows such as Figma delivery, planning, or content editing live in the matching skills.

## Validation

- When dependencies are installed, agents MUST run the relevant validation commands for the touched scope.
- Default full-app checks are:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm build`
- `pnpm lint` MUST run explicitly; `next build` does not replace it.
- UI changes MUST be verified in-browser on desktop and mobile breakpoints or the response MUST explain why that verification did not run.
- Public route metadata or discoverability changes SHOULD be verified in rendered output when touched.
- Figma-driven or multi-section visual work MUST follow the `figma-to-code` acceptance loop: verify the current section before advancing, then perform a final full-page pass.
- If any required command cannot run, the final response MUST state the exact command and the concrete reason.

## Change Expectations

- Changes SHOULD stay small, cohesive, and easy to review.
- Accessibility MUST remain intact when changing layout, content structure, or interaction behavior.
- New shared rules or architectural expectations MUST be documented in the correct instruction source.
- Styling changes MUST use Tailwind CSS v4 utility classes and current Tailwind documentation as the source of truth.
- Design tokens SHOULD use Tailwind v4 CSS custom property syntax instead of Tailwind arbitrary values.
- Agents SHOULD minimize Tailwind arbitrary values; prefer theme tokens, standard utilities, and reusable variants where practical.
- Raw values, one-off styling hacks, and duplicated workflow rules SHOULD be treated as drift and cleaned up when they materially affect the touched scope.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
