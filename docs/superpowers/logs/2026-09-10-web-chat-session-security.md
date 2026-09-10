# Web Chat visitor authentication

The live hero previously used the same hardcoded subscriber for all visitors.
This behavior came from the original working demo and was retained in the
redesign. The hero now obtains a signed anonymous visitor session from
`POST /api/web-chat/session` before mounting `NovuProvider`.

## Server configuration required before enabling live chat

1. Use a dedicated Novu demo environment with the `webchat` agent configured.
2. Enable **Security HMAC encryption** on that environment's active Novu In-App
   integration. Follow [Novu's production authentication instructions](https://docs.novu.co/platform/inbox/prepare-for-production).
3. Set these server-only environment variables:
   - `NOVU_WEB_CHAT_APPLICATION_IDENTIFIER`: the environment's application identifier.
   - `NOVU_WEB_CHAT_SECRET_KEY`: the matching Novu secret API key, never a `NEXT_PUBLIC_*` variable.
   - `NOVU_WEB_CHAT_HMAC_ENABLED=true`: explicit deployment confirmation that step 2 is complete.

The confirmation flag does not inspect or change the remote Novu setting.
Passing a signature from this website does not make Novu require signatures from
other clients; the dashboard setting is essential. The old published demo
environment also needs HMAC enabled if it remains active, because its identifier
has already been public. Creating a new environment does not secure the old one.

The legacy `NEXT_PUBLIC_NOVU_APP_IDENTIFIER` no longer enables the hero. Missing
server configuration keeps the live composer unavailable while the scripted
domain-personalization preview remains usable. No real Novu environment was
modified or enabled as part of the code change.

## Identity and signing boundaries

- A server-generated `web-chat-<UUID>` identifies one browser visitor.
- A signed HTTP-only, SameSite Strict cookie preserves that identity for up to
  24 hours. HTTPS uses a Secure `__Host-` cookie without a Domain attribute.
- Expired, altered, or differently scoped cookies receive a new identity.
  Request bodies and query parameters cannot select a subscriber to sign.
- Cookie signatures are bound to the application and expiry, with a separate
  signing purpose from Novu's subscriber hash. A leaked subscriber hash cannot
  be substituted as a valid visitor-cookie signature.
- The endpoint returns only the application identifier, subscriber ID, and its
  HMAC-SHA256 signature; responses are private and non-cacheable.
- The cookie lifetime does not expire an already issued Novu subscriber hash.
  Novu controls its own session lifetime and key revocation.
- Responsive views share the same React provider. Resetting the preview reuses
  the browser's identity while creating a fresh local conversation state.

## Validation

Unit tests cover independent visitors, signature correctness, tampering,
cross-application cookie reuse, expiry, cache/cookie headers, missing configuration,
and cross-origin requests. Browser tests cover separate visitor contexts, reloads,
streaming, retries, approvals, preview reset, and unavailable/unsigned sessions.
The signed-visitor assertion was first confirmed to fail against the original
shared-subscriber implementation.

For isolated browser fixtures, start the development server with a non-production
application identifier and signing key using the variables above. Then run:

```sh
PLAYWRIGHT_NOVU_FIXTURE=1 pnpm exec playwright test tests/critical-flows/web-chat-live.spec.ts
```

The browser fixtures intercept Novu HTTP and WebSocket traffic. They verify local
integration behavior; they do not prove that a deployed Novu environment has HMAC
enabled.

Verified on September 10, 2026: 259 unit tests passed, including 12 session tests.
All 10 live-chat browser checks passed across desktop Chromium and mobile WebKit.
Four more browser checks confirmed responsive layout and domain personalization
still work without any Novu credentials. The production build compiled and
completed TypeScript checking, then failed collecting `/careers/[slug]` data
because this checkout lacks the required Notion careers configuration.
`pnpm typecheck` and formatting checks passed. Plain `pnpm lint` picked up another
task's nested `.claude/worktrees/` checkout and its generated build files;
`pnpm lint --ignore-pattern '.claude/worktrees/**'` passed with five existing image
warnings. No lint configuration or unrelated worktree files were changed.

## PR comment triage

Reviewed the inline comments, submitted reviews, and discussion comments on
[PR #181](https://github.com/novuhq/website-new/pull/181).

- The shared-subscriber security finding is valid and addressed by this change,
  subject to the deployment configuration above.
- Socket flagged `culori@4.0.2` as likely obfuscated. Its installed source,
  package metadata, and license matched all 157 corresponding files in the
  upstream `v4.0.2` archive. Its [build script](https://github.com/Evercoder/culori/blob/v4.0.2/build.js)
  explicitly produces minified bundles alongside readable source and bundles.
  The package exports readable source for ESM and a readable bundle for CommonJS.
  This evidence points to a minification false positive; no dependency change or
  automated dismissal was made.
- The remaining comments were a dependency inventory and deployment status,
  with no further code defect reported.
