# Web Chat Brand Extraction Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract website accents from HTML metadata, linked manifests, and targeted CSS without changing the hero flow.

**Architecture:** Preserve `getBrandProfile` and the API response contract. Separate safe resource loading, pure color/CSS selection, and bounded caching so network behavior and heuristic choices can be tested independently.

**Tech Stack:** Next.js Node runtime, TypeScript, Node test runner, html-react-parser, PostCSS, css-select, Culori, native HTTP(S), ipaddr.js.

Work continues on the existing `feat/web-chat-figma-redesign` feature branch. The user approved the design and implementation in this session; proceed without another execution-choice checkpoint.

## Task 1: Safe bounded resource loading

Files: create `src/lib/site-brand/fetch.ts` and `tests/site-brand-fetch.test.ts`.

1. Write tests for public URL normalization, private addresses including mapped IPv6, redirect validation, stream byte limits, cancellation, deadline and concurrency.
2. Run `pnpm exec tsx --test tests/site-brand-fetch.test.ts` and observe missing behavior.
3. Implement `createResourceLoader()` with `load(url, {maxBytes, accept})` and `close()`. Return final URL, content type and Buffer. Validate DNS results and pin the validated address to the HTTP(S) connection. Apply one deadline through body consumption; close aborts remaining work.
4. Run the tests and fix failures. Keep transport tests isolated from real internet services.

## Task 2: CSS candidates and color selection

Files: create `src/lib/site-brand/colors.ts`, `src/lib/site-brand/css.ts`, and `tests/site-brand-colors.test.ts`.

1. Write fixtures for metadata normalization, modern CSS colors, matching primary CTAs, variable resolution, unused utilities, neutral candidates, conflicts and conditional rules.
2. Run `pnpm exec tsx --test tests/site-brand-colors.test.ts` and observe missing behavior.
3. Implement `AccentCandidate` (`color`, `source`, `score`, `reason`), `collectCssCandidates(nodes, stylesheets)`, and `selectAccent(candidates)`. Normalize candidates with Culori. Prefer supported matching CTA evidence; never select an unused utility solely from its name. Return null for weak or similarly strong conflicting colors.
4. Run the tests and fix failures. Do not reproduce the entire CSS cascade or evaluate JavaScript.

## Task 3: HTML, manifest and cache integration

Files: modify `src/lib/site-brand.ts`; create `src/lib/site-brand/cache.ts`, `tests/site-brand.test.ts`, and `tests/site-brand-cache.test.ts`; update `package.json` and `pnpm-lock.yaml` for direct imports.

1. Write integration fixtures with explicit upstream responses for manifest-only color, neutral meta with useful fallback, malformed manifests, relative links/base/redirects, linked and inline CSS, and identity retention.
2. Run the focused tests against current code; confirm missing behavior.
3. Parse HTML with the existing `htmlToDOM` export. Collect independent metadata candidates, one linked manifest, three stylesheets, and existing logo candidates. Use the resource loader for every URL; discard optional-resource failures without losing identity.
4. Preserve existing display adjustment and append optional `accentSource`. Keep the public `getBrandProfile` entry point; use a factory to supply a resource loader/cache in integration tests without replacing extraction logic.
5. Add cache behavior tests before implementing 100-entry/20-MiB bounds, positive/negative TTLs, normalized-URL keys and in-flight deduplication. Do not cache thrown requests or known transient resource failures.
6. Run focused tests, then `pnpm test` and `pnpm typecheck`.

## Task 4: Verify integration and document results

Files: update the approved design and a task log if implementation evidence requires clarification; retain hero components unless a demonstrated integration issue needs correction.

1. Review all helper boundaries and tests; fix integration issues.
2. Run `pnpm lint --ignore-pattern '.claude/worktrees/**'`, `pnpm typecheck`, `pnpm test`, and `pnpm build`. Record actual errors without assuming the earlier Notion configuration blocker.
3. Exercise the existing Web Chat browser tests on desktop and mobile, including identity retention and hero-only personalization. Inspect a real rendered personalized hero at both breakpoints.
4. Evaluate representative public websites and record extracted color, source, time and limitations. Real websites are exploratory evidence, not CI fixtures.
5. Format changed files, run `git diff --check`, and report the result. Keep implementation changes reviewable in the current workspace; do not push.

## Follow-up: CSS interface evidence and logo palettes

The user requested the next extraction options after manifest theme_color.
This extends the completed implementation in the current branch.

1. Extend CSS fixtures and selection to declared link/CTA text, active
   navigation and highlights. Keep ordinary links weak, exclude determinable
   hidden elements, and prevent nested product badges from inheriting active
   navigation confidence.
2. Add real image fixtures and a bounded Sharp palette helper. Ignore neutral
   and transparent pixels; require dominance or corroborating CSS evidence.
   Cover multicolor ambiguity, corrupt/oversized images, restricted SVG input,
   and PNG/32-bit ICO transparency behavior.
3. Reuse the already downloaded identity icon only when initial candidate
   selection is inconclusive. Add the `logo` diagnostic source and integration
   tests through the profile reader and real POST handler.
4. Review decoding boundaries, run app checks and desktop/mobile hero tests,
   retest public reference domains, and record actual results in the log.
