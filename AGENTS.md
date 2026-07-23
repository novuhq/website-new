# AGENTS.md

## Useful Commands

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm format`
- `pnpm format:fix`
- `npx @next/codemod@canary agents-md --version 16.2.1 --output AGENTS.generated.md` to refresh the embedded Next.js docs index after a Next.js upgrade

## Next.js Retrieval Index

Keep the generated block below intact. Refresh it when the project upgrades Next.js.

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output AGENTS.generated.md|01-app:{04-glossary.mdx}|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,03-layouts-and-pages.mdx,04-linking-and-navigating.mdx,05-server-and-client-components.mdx,06-fetching-data.mdx,07-mutating-data.mdx,08-caching.mdx,09-revalidating.mdx,10-error-handling.mdx,11-css.mdx,12-images.mdx,13-fonts.mdx,14-metadata-and-og-images.mdx,15-route-handlers.mdx,16-proxy.mdx,17-deploying.mdx,18-upgrading.mdx}|01-app/02-guides:{ai-agents.mdx,analytics.mdx,authentication.mdx,backend-for-frontend.mdx,caching-without-cache-components.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,data-security.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instant-navigation.mdx,instrumentation.mdx,internationalization.mdx,json-ld.mdx,lazy-loading.mdx,local-development.mdx,mcp.mdx,mdx.mdx,memory-usage.mdx,migrating-to-cache-components.mdx,multi-tenant.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,prefetching.mdx,preserving-ui-state.mdx,production-checklist.mdx,progressive-web-apps.mdx,public-static-pages.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,single-page-applications.mdx,static-exports.mdx,streaming.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx,videos.mdx}|01-app/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|01-app/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|01-app/02-guides/upgrading:{codemods.mdx,version-14.mdx,version-15.mdx,version-16.mdx}|01-app/03-api-reference:{07-edge.mdx,08-turbopack.mdx}|01-app/03-api-reference/01-directives:{use-cache-private.mdx,use-cache-remote.mdx,use-cache.mdx,use-client.mdx,use-server.mdx}|01-app/03-api-reference/02-components:{font.mdx,form.mdx,image.mdx,link.mdx,script.mdx}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.mdx,manifest.mdx,opengraph-image.mdx,robots.mdx,sitemap.mdx}|01-app/03-api-reference/03-file-conventions/02-route-segment-config:{dynamicParams.mdx,instant.mdx,maxDuration.mdx,preferredRegion.mdx,runtime.mdx}|01-app/03-api-reference/03-file-conventions:{default.mdx,dynamic-routes.mdx,error.mdx,forbidden.mdx,instrumentation-client.mdx,instrumentation.mdx,intercepting-routes.mdx,layout.mdx,loading.mdx,mdx-components.mdx,not-found.mdx,page.mdx,parallel-routes.mdx,proxy.mdx,public-folder.mdx,route-groups.mdx,route.mdx,src-folder.mdx,template.mdx,unauthorized.mdx}|01-app/03-api-reference/04-functions:{after.mdx,cacheLife.mdx,cacheTag.mdx,catchError.mdx,connection.mdx,cookies.mdx,draft-mode.mdx,fetch.mdx,forbidden.mdx,generate-image-metadata.mdx,generate-metadata.mdx,generate-sitemaps.mdx,generate-static-params.mdx,generate-viewport.mdx,headers.mdx,image-response.mdx,next-request.mdx,next-response.mdx,not-found.mdx,permanentRedirect.mdx,redirect.mdx,refresh.mdx,revalidatePath.mdx,revalidateTag.mdx,unauthorized.mdx,unstable_cache.mdx,unstable_noStore.mdx,unstable_rethrow.mdx,updateTag.mdx,use-link-status.mdx,use-params.mdx,use-pathname.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,use-selected-layout-segment.mdx,use-selected-layout-segments.mdx,userAgent.mdx}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,appDir.mdx,assetPrefix.mdx,authInterrupts.mdx,basePath.mdx,cacheComponents.mdx,cacheHandlers.mdx,cacheLife.mdx,compress.mdx,crossOrigin.mdx,cssChunking.mdx,deploymentId.mdx,devIndicators.mdx,distDir.mdx,env.mdx,expireTime.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,htmlLimitedBots.mdx,httpAgentOptions.mdx,images.mdx,incrementalCacheHandlerPath.mdx,inlineCss.mdx,logging.mdx,mdxRs.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactCompiler.mdx,reactMaxHeadersLength.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,sassOptions.mdx,serverActions.mdx,serverComponentsHmrCache.mdx,serverExternalPackages.mdx,staleTimes.mdx,staticGeneration.mdx,taint.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,turbopackFileSystemCache.mdx,turbopackIgnoreIssue.mdx,typedRoutes.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,viewTransition.mdx,webVitalsAttribution.mdx,webpack.mdx}|01-app/03-api-reference/05-config:{02-typescript.mdx,03-eslint.mdx}|01-app/03-api-reference/06-cli:{create-next-app.mdx,next.mdx}|02-pages/01-getting-started:{01-installation.mdx,02-project-structure.mdx,04-images.mdx,05-fonts.mdx,06-css.mdx,11-deploying.mdx}|02-pages/02-guides:{analytics.mdx,authentication.mdx,babel.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,lazy-loading.mdx,mdx.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,post-css.mdx,preview-mode.mdx,production-checklist.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx}|02-pages/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|02-pages/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|02-pages/02-guides/upgrading:{codemods.mdx,version-10.mdx,version-11.mdx,version-12.mdx,version-13.mdx,version-14.mdx,version-9.mdx}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.mdx,02-dynamic-routes.mdx,03-linking-and-navigating.mdx,05-custom-app.mdx,06-custom-document.mdx,07-api-routes.mdx,08-custom-error.mdx}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.mdx,02-static-site-generation.mdx,04-automatic-static-optimization.mdx,05-client-side-rendering.mdx}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.mdx,02-get-static-paths.mdx,03-forms-and-mutations.mdx,03-get-server-side-props.mdx,05-client-side.mdx}|02-pages/03-building-your-application/06-configuring:{12-error-handling.mdx}|02-pages/04-api-reference:{06-edge.mdx,08-turbopack.mdx}|02-pages/04-api-reference/01-components:{font.mdx,form.mdx,head.mdx,image-legacy.mdx,image.mdx,link.mdx,script.mdx}|02-pages/04-api-reference/02-file-conventions:{instrumentation.mdx,proxy.mdx,public-folder.mdx,src-folder.mdx}|02-pages/04-api-reference/03-functions:{get-initial-props.mdx,get-server-side-props.mdx,get-static-paths.mdx,get-static-props.mdx,next-request.mdx,next-response.mdx,use-params.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,userAgent.mdx}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,assetPrefix.mdx,basePath.mdx,bundlePagesRouterDependencies.mdx,compress.mdx,crossOrigin.mdx,deploymentId.mdx,devIndicators.mdx,distDir.mdx,env.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,httpAgentOptions.mdx,images.mdx,logging.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,serverExternalPackages.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,webVitalsAttribution.mdx,webpack.mdx}|02-pages/04-api-reference/04-config:{01-typescript.mdx,02-eslint.mdx}|02-pages/04-api-reference/05-cli:{create-next-app.mdx,next.mdx}|03-architecture:{accessibility.mdx,fast-refresh.mdx,nextjs-compiler.mdx,supported-browsers.mdx}|04-community:{01-contribution-guide.mdx,02-rspack.mdx}<!-- NEXT-AGENTS-MD-END -->

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
