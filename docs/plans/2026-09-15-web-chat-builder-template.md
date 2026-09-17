# Web Chat Builder Template Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a reusable `/channels/web-chat/[slug]` landing-page template and publish the Figma-matched Webflow page at `/channels/web-chat/webflow`.

**Architecture:** A thin App Router route resolves typed builder content and delegates rendering to route-family components. The first data entry is Webflow; future builders extend the data registry without branching the template. Figma sections are implemented and verified sequentially so generated reference code never replaces project components or tokens.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, TypeScript, Tailwind CSS v4, existing shadcn-based primitives, Node test runner, Playwright.

---

## Preconditions

- Work only in `/Users/vanny/PixelPointProjects/website-new/.claude/worktrees/web-chat-builder-template` on `feat/web-chat-builder-template`.
- Read root `AGENTS.md`, `src/app/AGENTS.md`, `src/components/AGENTS.md`, and `src/styles/AGENTS.md` before edits.
- Follow `@figma-to-code` and `@figma-design-to-code` for every design section. Fetch one section, implement it, and verify it before fetching the next.
- Use `@superpowers:test-driven-development` for route/data behavior and `@webapp-testing` for visual and interaction verification.
- Run `pnpm exec next typegen` before `pnpm typecheck` in a clean worktree because `next-env.d.ts` is generated and ignored.
- Figma file: `sq4Qtfr7jrTKANvKpPFzWI`; page node: `45917:59209`.

### Task 1: Add the typed builder registry

**Files:**

- Create: `tests/web-chat-builders.test.ts`
- Create: `src/data/pages/web-chat-builders.ts`

**Step 1: Write the failing registry test**

```ts
import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  getAllWebChatBuilderSlugs,
  getWebChatBuilderBySlug,
} from "@/data/pages/web-chat-builders"

describe("Web Chat builder pages", () => {
  it("publishes Webflow as the only initial builder", () => {
    assert.deepEqual(getAllWebChatBuilderSlugs(), ["webflow"])
    assert.equal(getWebChatBuilderBySlug("webflow")?.builderName, "Webflow")
  })

  it("returns undefined for an unpublished builder", () => {
    assert.equal(getWebChatBuilderBySlug("wix"), undefined)
  })
})
```

**Step 2: Run the test and confirm the missing-module failure**

Run: `pnpm exec tsx --test tests/web-chat-builders.test.ts`

Expected: FAIL because `@/data/pages/web-chat-builders` does not exist.

**Step 3: Implement the minimum typed registry**

Create an `IWebChatBuilderPage` model with `slug`, `builderName`, `seo`, `hero`, `sections`, `faq`, and `finalCta` fields. Seed the known Webflow values from Figma node `45917:59210`:

```ts
const WEBFLOW_PAGE = {
  slug: "webflow",
  builderName: "Webflow",
  seo: {
    title: "Add an AI agent to your Webflow site | Novu Web Chat",
    description:
      "Bring your AI agent to Webflow with one embed. Chat with visitors and reach them across messaging channels and email through one workflow.",
  },
  hero: {
    eyebrow: "Web Chat for Webflow",
    title: "Add an AI agent to your Webflow site",
    description:
      "Bring your AI agent to Webflow with one embed. Chat with visitors and reach them across messaging channels and email through one workflow. Your agent’s channel, not a generic widget.",
    command: "npx novu connect --channel web-chat",
  },
  sections: [],
  faq: [],
  finalCta: null,
} satisfies IWebChatBuilderPage
```

Keep unretrieved section fields as empty typed arrays only until their own Figma task populates them; do not invent copy.

Export `getWebChatBuilderBySlug(slug)` and `getAllWebChatBuilderSlugs()` from a private frozen registry.

**Step 4: Run the focused test**

Run: `pnpm exec tsx --test tests/web-chat-builders.test.ts`

Expected: PASS, 2 tests.

**Step 5: Commit**

```bash
git add tests/web-chat-builders.test.ts src/data/pages/web-chat-builders.ts
git commit -m "feat(web-chat): add builder page registry"
```

### Task 2: Add the dynamic route and metadata

**Files:**

- Create: `src/app/(website)/(connect-footer)/channels/web-chat/[slug]/page.tsx`
- Create: `src/components/pages/channels/web-chat-builder/landing.tsx`
- Modify: `tests/web-chat-builders.test.ts`

**Step 1: Extend the test with pathname coverage**

Add an exported helper and assertion so route metadata uses one canonical source:

```ts
assert.equal(getWebChatBuilderPathname("webflow"), "/channels/web-chat/webflow")
```

**Step 2: Run the focused test and confirm failure**

Run: `pnpm exec tsx --test tests/web-chat-builders.test.ts`

Expected: FAIL because `getWebChatBuilderPathname` is not exported.

**Step 3: Implement pathname helper and thin route**

The route must use asynchronous App Router params, `dynamicParams = false`, `generateStaticParams()`, `generateMetadata()`, and `notFound()`:

```tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getAllWebChatBuilderSlugs,
  getWebChatBuilderBySlug,
  getWebChatBuilderPathname,
} from "@/data/pages/web-chat-builders"

import { getMetadata } from "@/lib/get-metadata"
import WebChatBuilderLanding from "@/components/pages/channels/web-chat-builder/landing"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getAllWebChatBuilderSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getWebChatBuilderBySlug(slug)
  if (!page) return {}

  return getMetadata({
    title: page.seo.title,
    description: page.seo.description,
    pathname: getWebChatBuilderPathname(slug),
  })
}

export default async function WebChatBuilderPage({ params }: Props) {
  const { slug } = await params
  const page = getWebChatBuilderBySlug(slug)
  if (!page) notFound()

  return <WebChatBuilderLanding page={page} />
}
```

Initially, `landing.tsx` renders a semantic `<main>` with the configured `<h1>` and no invented lower-page content.

**Step 4: Generate route types and validate**

Run: `pnpm exec next typegen && pnpm typecheck`

Expected: PASS and generated route types include `/channels/web-chat/[slug]`.

**Step 5: Commit**

```bash
git add 'src/app/(website)/(connect-footer)/channels/web-chat/[slug]/page.tsx' src/components/pages/channels/web-chat-builder/landing.tsx src/data/pages/web-chat-builders.ts tests/web-chat-builders.test.ts
git commit -m "feat(web-chat): add dynamic builder route"
```

### Task 3: Implement and verify the hero section

**Files:**

- Create: `src/components/pages/channels/web-chat-builder/hero.tsx`
- Create: `src/images/pages/channels/web-chat-builder/webflow/hero.png`
- Modify: `src/components/pages/channels/web-chat-builder/landing.tsx`
- Modify: `src/data/pages/web-chat-builders.ts`
- Create: `tests/critical-flows/web-chat-builder.spec.ts`

**Step 1: Write the initial browser contract**

Assert that `/channels/web-chat/webflow` renders the exact Figma heading, the Webflow eyebrow, a `Copy Prompt` button, the configured CLI command, a `Copy` control, and the shared customer-logo region. Also collect page and console errors through existing critical-flow helpers.

**Step 2: Fetch only Figma node `45917:59210`**

Use `get_design_context` with `skillNames: "figma-design-to-code"`. Build this comparison before editing:

| Property    | Figma                        | Current               | Action                                          |
| ----------- | ---------------------------- | --------------------- | ----------------------------------------------- |
| layout      | 544px copy + 608×640 artwork | heading-only scaffold | implement responsive two-column hero            |
| title       | 56px/1.04, -0.04em           | scaffold defaults     | map to existing responsive typography utilities |
| description | 18px/1.5, gray-70            | scaffold defaults     | reuse `text-gray-70` and named leading utility  |
| actions     | Copy Prompt + CLI field      | none                  | reuse `CopyPromptButton` and `CopyCommand`      |
| logos       | 86px masked strip            | none                  | reuse `CustomerLogos`                           |

**Step 3: Export the complex hero artwork**

Export node `45917:59278` as one committed 2× PNG. Do not reconstruct its glows, masks, browser shell, chat, or Webflow badge with dozens of DOM/SVG layers. Confirm the PNG dimensions and transparency with `file` before importing it through `next/image`.

**Step 4: Implement the hero with available shared components**

Reuse:

- `src/components/pages/home/copy-prompt-button.tsx`
- `src/components/ui/copy-command.tsx`
- `src/components/customer-logos.tsx`

The hero remains a Server Component except for the reused copy controls. Preserve semantic heading order and use empty alt text for the decorative composite. Mobile order is eyebrow, title, description, actions, artwork, logos.

**Step 5: Run focused checks**

Run: `pnpm exec playwright test tests/critical-flows/web-chat-builder.spec.ts --project=desktop-chromium`

Expected: PASS.

**Step 6: Verify visually before continuing**

Start `pnpm dev` and use `@webapp-testing` to compare `/channels/web-chat/webflow` with Figma at 1440px desktop and 390px mobile. Check typography, two-column balance, action widths, artwork crop, logo-strip spacing, focus states, and console errors. Do not fetch the next Figma section until this section matches.

**Step 7: Commit**

```bash
git add src/components/pages/channels/web-chat-builder src/data/pages/web-chat-builders.ts src/images/pages/channels/web-chat-builder/webflow/hero.png tests/critical-flows/web-chat-builder.spec.ts
git commit -m "feat(web-chat): build Webflow builder hero"
```

### Task 4: Implement the first content section

**Files:**

- Create: `src/components/pages/channels/web-chat-builder/primary-section.tsx`
- Add Figma exports under: `src/images/pages/channels/web-chat-builder/webflow/`
- Modify: `src/components/pages/channels/web-chat-builder/landing.tsx`
- Modify: `src/data/pages/web-chat-builders.ts`
- Modify: `tests/critical-flows/web-chat-builder.spec.ts`

**Step 1: Fetch only Figma node `45917:59747`**

Record its exact text, hierarchy, dimensions, and assets. Inspect nearby shared components before deciding whether `primary-section.tsx` wraps an existing API or owns local markup. Add its Figma copy to the typed Webflow config.

**Step 2: Extend the browser contract before implementation**

Assert the section heading and its primary semantic/interactive element from the retrieved design. Run the focused spec and confirm it fails.

**Step 3: Choose and download assets**

Use exact exported icons for vector marks. Export one 2× raster for any composite with raster fills, blur, masks, or many tiny layers. Never retain temporary Figma URLs.

**Step 4: Implement and validate**

Map reusable values to project tokens and Tailwind scale utilities. Run the focused Playwright spec, then compare the section at desktop and mobile widths with no console errors.

**Step 5: Commit**

```bash
git add src/components/pages/channels/web-chat-builder src/data/pages/web-chat-builders.ts src/images/pages/channels/web-chat-builder/webflow tests/critical-flows/web-chat-builder.spec.ts
git commit -m "feat(web-chat): add first builder content section"
```

### Task 5: Implement the second content section

**Files:**

- Create: `src/components/pages/channels/web-chat-builder/secondary-section.tsx`
- Add Figma exports under: `src/images/pages/channels/web-chat-builder/webflow/`
- Modify: `src/components/pages/channels/web-chat-builder/landing.tsx`
- Modify: `src/data/pages/web-chat-builders.ts`
- Modify: `tests/critical-flows/web-chat-builder.spec.ts`

**Step 1: Fetch only Figma node `45917:59824`**

Create the required Figma/current/action comparison, capture exact copy in data, and identify reusable project primitives.

**Step 2: Add a failing browser expectation**

Assert the retrieved section heading and its most important visible behavior. Run the focused spec and confirm failure.

**Step 3: Implement the section and local assets**

Keep layout presentation-first and data-driven. Avoid builder-specific switches in shared primitives.

**Step 4: Verify before advancing**

Run the focused Playwright spec and visually compare desktop/mobile structure, typography, spacing, and media crop.

**Step 5: Commit**

```bash
git add src/components/pages/channels/web-chat-builder src/data/pages/web-chat-builders.ts src/images/pages/channels/web-chat-builder/webflow tests/critical-flows/web-chat-builder.spec.ts
git commit -m "feat(web-chat): add second builder content section"
```

### Task 6: Implement the third content section and tooltip behavior

**Files:**

- Create: `src/components/pages/channels/web-chat-builder/tertiary-section.tsx`
- Add Figma exports under: `src/images/pages/channels/web-chat-builder/webflow/`
- Modify: `src/components/pages/channels/web-chat-builder/landing.tsx`
- Modify: `src/data/pages/web-chat-builders.ts`
- Modify: `tests/critical-flows/web-chat-builder.spec.ts`

**Step 1: Fetch only Figma nodes `45917:59856`, `45917:60023`, and `45917:60035`**

Treat the tooltip and pointing hand as part of the current section. Determine whether the tooltip represents a real interaction annotation or decorative artwork; preserve keyboard access if interactive, otherwise export it with the illustration and hide it from assistive technology.

**Step 2: Add failing behavior and content expectations**

Assert the exact heading plus hover/focus behavior when the tooltip is interactive. Run the focused spec and confirm failure.

**Step 3: Implement assets and responsive layout**

Use existing `Tooltip` only if the design represents a genuine interactive tooltip. Otherwise keep the composite decorative and avoid a misleading focus target.

**Step 4: Verify before advancing**

Run the focused Playwright spec and visually compare at desktop/mobile. Include keyboard focus and reduced-motion checks when interaction or animation exists.

**Step 5: Commit**

```bash
git add src/components/pages/channels/web-chat-builder src/data/pages/web-chat-builders.ts src/images/pages/channels/web-chat-builder/webflow tests/critical-flows/web-chat-builder.spec.ts
git commit -m "feat(web-chat): add final builder content section"
```

### Task 7: Implement FAQ, structured data, and 404 behavior

**Files:**

- Modify: `src/components/pages/channels/web-chat-builder/landing.tsx`
- Modify: `src/data/pages/web-chat-builders.ts`
- Modify: `src/app/(website)/(connect-footer)/channels/web-chat/[slug]/page.tsx`
- Modify: `tests/critical-flows/web-chat-builder.spec.ts`

**Step 1: Fetch only Figma node `45917:60036`**

Capture exact FAQ title, questions, answers, width, separators, and default-open state. Compare it with `src/components/pages/faq.tsx` and reuse the shared `minimal` variant if it matches without page-specific branches.

**Step 2: Add failing FAQ and 404 tests**

Assert the FAQ heading/questions on Webflow and a 404 status for `/channels/web-chat/not-published`. Run the spec and confirm failure.

**Step 3: Populate config and render shared FAQ**

Pass config values to `FAQ`; do not hardcode Webflow questions inside the shared component.

**Step 4: Add route-owned JSON-LD**

Build `WebPage`, `BreadcrumbList`, and `FAQPage` entries from the same config, using `absoluteUrl`, `toCanonicalPathname`, and `safeJsonLdStringify`. Keep the script in the route file.

**Step 5: Verify FAQ and unknown slug**

Run the focused Playwright spec. Verify keyboard accordion operation, visible focus, semantic heading order, rendered canonical URL, JSON-LD, and 404 behavior.

**Step 6: Commit**

```bash
git add 'src/app/(website)/(connect-footer)/channels/web-chat/[slug]/page.tsx' src/components/pages/channels/web-chat-builder/landing.tsx src/data/pages/web-chat-builders.ts tests/critical-flows/web-chat-builder.spec.ts
git commit -m "feat(web-chat): add builder FAQ and metadata"
```

### Task 8: Implement the final CTA and complete the page

**Files:**

- Create or modify: `src/components/pages/channels/web-chat-builder/final-cta.tsx`
- Add Figma exports under: `src/images/pages/channels/web-chat-builder/webflow/`
- Modify: `src/components/pages/channels/web-chat-builder/landing.tsx`
- Modify: `src/data/pages/web-chat-builders.ts`
- Modify: `tests/critical-flows/web-chat-builder.spec.ts`

**Step 1: Fetch only Figma node `45917:60062`**

Inspect the CTA portion rather than rebuilding the header/footer shown within the large frame; the route already receives shared shell and Connect footer from its layout. Compare the CTA with `src/components/pages/home/cta.tsx`, reusing it when its prop-driven layout matches.

**Step 2: Add failing CTA expectations**

Assert the exact final heading `Give your Webflow site an AI agent`, command, and CTA controls from Figma. Run the focused spec and confirm failure.

**Step 3: Implement the CTA**

Populate final CTA copy in Webflow data. Reuse `CopyCommand`, `CopyPromptButton`, and existing background media where available; otherwise keep a route-family component rather than extending the home CTA with one-off props.

**Step 4: Run section and full-page visual checks**

Verify CTA and Connect footer boundaries at desktop/mobile, then perform a full-page screenshot comparison for every section and check that the shared site header/footer were not duplicated.

**Step 5: Commit**

```bash
git add src/components/pages/channels/web-chat-builder src/data/pages/web-chat-builders.ts src/images/pages/channels/web-chat-builder/webflow tests/critical-flows/web-chat-builder.spec.ts
git commit -m "feat(web-chat): complete Webflow builder landing page"
```

### Task 9: Final verification and cleanup

**Files:**

- Modify only files required by failures attributable to this branch.

**Step 1: Run unit tests**

Run: `pnpm test`

Expected: PASS.

**Step 2: Run lint**

Run: `pnpm lint`

Expected: PASS with no new warnings. Five existing `@next/next/no-img-element` warnings in homepage inbox files are baseline warnings.

**Step 3: Generate route types and typecheck**

Run: `pnpm exec next typegen && pnpm typecheck`

Expected: PASS.

**Step 4: Run the production build**

Run: `pnpm build`

Expected: PASS; build output includes the Web Chat builder route and `next-sitemap` completes.

**Step 5: Run browser checks on both projects**

Run: `pnpm exec playwright test tests/critical-flows/web-chat-builder.spec.ts --project=desktop-chromium --project=mobile-chromium`

Expected: PASS.

**Step 6: Inspect final rendered output**

Using `@webapp-testing`, verify at minimum 1440×1000 and 390×844:

- no horizontal overflow
- exact section order and Figma copy
- correct artwork crops and breakpoint transitions
- keyboard-accessible copy controls and FAQ
- working CTA links
- canonical `/channels/web-chat/webflow/`
- valid WebPage/BreadcrumbList/FAQPage JSON-LD
- 404 for an unknown slug
- no browser console or page errors

**Step 7: Review the final diff**

Run: `git diff origin/main...HEAD --check && git status --short --branch`

Expected: no whitespace errors and no untracked temporary screenshots, generated docs indexes, or Figma download artifacts.

**Step 8: Commit any verification-only corrections**

```bash
git add 'src/app/(website)/(connect-footer)/channels/web-chat/[slug]/page.tsx' src/components/pages/channels/web-chat-builder src/data/pages/web-chat-builders.ts src/images/pages/channels/web-chat-builder/webflow tests/web-chat-builders.test.ts tests/critical-flows/web-chat-builder.spec.ts
git commit -m "fix(web-chat): finish builder page verification"
```
