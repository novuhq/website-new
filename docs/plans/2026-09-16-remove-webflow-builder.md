# Remove Webflow Builder Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Unpublish `/channels/web-chat/webflow` as a real 404 while leaving all 13 remaining Web Chat builder pages unchanged.

**Architecture:** The dynamic route already derives static params and page resolution from the builder registry, so Webflow should be removed at that source of truth instead of special-cased in the route. The Webflow-derived sections, FAQ, and shared channel artwork remain internal template content; only the publishable Webflow record and its unused hero media registration are removed.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Playwright, Node test runner, pnpm.

---

### Task 1: Specify the unpublished Webflow contract

**Skills:** @test-driven-development, @writing-good-tests

**Files:**
- Modify: `tests/web-chat-builders.test.ts`
- Modify: `tests/critical-flows/web-chat-builder.spec.ts`

**Step 1: Write the failing registry test**

Remove the Webflow tuple from the literal `builders` fixture, assert `getWebChatBuilderBySlug("webflow")` is `undefined`, use `blink-new` as the media-resolution fixture, and change the expected published count from 14 to 13.

```ts
it("does not publish the retired Webflow builder", () => {
  assert.equal(getWebChatBuilderBySlug("webflow"), undefined)
  assert.equal(getAllWebChatBuilderSlugs().length, 13)
})
```

The production mutation this catches is re-adding Webflow to the public registry.

**Step 2: Write the failing route test**

Add `"webflow"` to the existing unsupported-slug table so the real dynamic route must return HTTP 404 and emit no JSON-LD.

```ts
for (const slug of [
  "webflow",
  "not-published",
  "toString",
  "constructor",
  "__proto__",
]) {
  // Existing 404 assertions remain unchanged.
}
```

The production mutation this catches is exposing a registry-backed page at the retired slug.

**Step 3: Run the focused tests to verify RED**

Run:

```bash
NODE_OPTIONS=--conditions=react-server pnpm exec tsx --test tests/web-chat-builders.test.ts
```

Expected: FAIL because `webflow` is still present and the slug count is 14.

Run against the current local server:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3116 PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/critical-flows/web-chat-builder.spec.ts --project=desktop-chromium --grep "returns a true 404 without structured data for webflow"
```

Expected: FAIL because the response status is 200 instead of 404.

### Task 2: Remove Webflow from the registry and media map

**Skills:** @content-editing, @next-best-practices

**Files:**
- Modify: `src/data/pages/web-chat-builders.ts`
- Modify: `src/components/pages/channels/web-chat-builder/media.ts`

**Step 1: Separate shared content from the publishable page shape**

Replace `WEBFLOW_PAGE` with an internal shared-content object containing only `sections`, `faqTitle`, and `faq`. Keep the current shared text unchanged.

```ts
const WEB_CHAT_BUILDER_SHARED_CONTENT = {
  sections: [/* existing shared sections */],
  faqTitle: "Frequently asked questions",
  faq: [/* existing shared FAQ */],
} satisfies Pick<IWebChatBuilderPage, "sections" | "faqTitle" | "faq">
```

Update `createWebChatBuilderPage()` to spread this shared content and construct its own media and complete hero data:

```ts
return {
  ...WEB_CHAT_BUILDER_SHARED_CONTENT,
  slug,
  builderName,
  media: { hero: heroMedia, channels: "webflow-channels" },
  seo: { title: `${title} | Novu Web Chat`, description },
  hero: {
    eyebrow: `Web Chat for ${heroName}`,
    title,
    description,
    command: "npx novu connect --channel web-chat",
    prompt,
    promptLabel: "Copy Prompt",
  },
}
```

**Step 2: Remove the publishable Webflow entry**

Delete `webflow: WEBFLOW_PAGE` from `WEB_CHAT_BUILDER_PAGES`. Leave the lookup helper and route unchanged; the absent entry makes `getWebChatBuilderBySlug("webflow")` return `undefined`, and the existing page calls `notFound()`.

**Step 3: Remove unused Webflow hero media registration**

Remove `"webflow-hero"` from `WebChatBuilderMediaKey`, and remove the corresponding import and `WEB_CHAT_BUILDER_MEDIA` entry. Retain `"webflow-channels"` and the shared artwork used by every remaining page.

**Step 4: Run focused tests to verify GREEN**

Run the same unit and Playwright commands from Task 1.

Expected: both PASS; Webflow returns 404 and 13 slugs remain published.

**Step 5: Commit**

```bash
git add src/data/pages/web-chat-builders.ts src/components/pages/channels/web-chat-builder/media.ts tests/web-chat-builders.test.ts tests/critical-flows/web-chat-builder.spec.ts
git commit -m "feat(web-chat): unpublish Webflow builder"
```

### Task 3: Move shared browser coverage to Blink.new

**Skills:** @webapp-testing

**Files:**
- Modify: `tests/critical-flows/web-chat-builder.spec.ts`

**Step 1: Replace published-page navigation**

Change the shared page tests from `/channels/web-chat/webflow` to `/channels/web-chat/blink-new`. Preserve the assertions for the intentionally shared Webflow-derived body sections and FAQ.

**Step 2: Update hero and metadata expectations**

Use literal Blink.new values for hero-specific and metadata-specific assertions:

```ts
const config = getWebChatBuilderBySlug("blink-new")!
expect(new URL(url).pathname).toBe("/channels/web-chat/blink-new/")
// Breadcrumb name: Blink.new
// Hero title: Add an AI agent to your Blink.new app
// Eyebrow: Web Chat for Blink.new
```

Update the copied prompt expectation to the registry's literal Blink.new prompt. Rename the test from “renders the Webflow hero” to “renders the Blink.new hero”.

**Step 3: Keep design-source naming explicit**

Rename the geometry test to “matches the shared Webflow Figma section geometry at 1920px”; it now visits Blink.new but still compares the common layout to the Webflow source frame.

**Step 4: Run the focused browser matrix**

Run:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3116 PLAYWRIGHT_SKIP_WEB_SERVER=1 pnpm exec playwright test tests/critical-flows/web-chat-builder.spec.ts --grep "Blink.new hero|true 404 without structured data for webflow|shared Webflow Figma|accessible setup actions|shows every channel|keyboard focus scrolls"
```

Expected: PASS in desktop/mobile Chromium and WebKit.

**Step 5: Commit**

```bash
git add tests/critical-flows/web-chat-builder.spec.ts
git commit -m "test(web-chat): cover shared page with Blink"
```

### Task 4: Validate and publish the change

**Skills:** @verification-before-completion

**Files:**
- Verify: `src/data/pages/web-chat-builders.ts`
- Verify: `src/components/pages/channels/web-chat-builder/media.ts`
- Verify: `tests/web-chat-builders.test.ts`
- Verify: `tests/critical-flows/web-chat-builder.spec.ts`

**Step 1: Run repository checks**

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm exec prettier --check src/data/pages/web-chat-builders.ts src/components/pages/channels/web-chat-builder/media.ts tests/web-chat-builders.test.ts tests/critical-flows/web-chat-builder.spec.ts
```

Expected: all commands exit 0. Existing lint warnings may remain, but no new warning or error may be introduced.

**Step 2: Verify the rendered routes**

Use Playwright or an HTTP request to confirm:

- `/channels/web-chat/webflow` returns 404.
- `/channels/web-chat/blink-new` returns 200 with its expected hero.
- A desktop and mobile remaining-builder page render without console or application errors.

**Step 3: Review the final diff**

```bash
git status --short
git diff --check
git diff origin/main...HEAD -- src/data/pages/web-chat-builders.ts src/components/pages/channels/web-chat-builder/media.ts tests/web-chat-builders.test.ts tests/critical-flows/web-chat-builder.spec.ts
```

Expected: only the approved registry, media, and test changes are present, plus the committed design and implementation plan.

**Step 4: Push the branch and monitor PR #182**

```bash
git push origin feat/web-chat-builder-template
gh pr checks 182 --repo novuhq/website-new --watch
```

Expected: the branch pushes successfully and all PR checks pass.
