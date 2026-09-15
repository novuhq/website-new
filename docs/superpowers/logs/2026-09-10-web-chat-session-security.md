# Web Chat visitor authentication

The live hero obtains a signed anonymous visitor session from
`POST /api/web-chat/session` before mounting `NovuProvider`. It must never use a
shared subscriber ID or accept a subscriber ID chosen by the browser.

## Deployment setup

1. Use a dedicated Novu demo environment with the `webchat` agent configured.
2. Enable **Security HMAC encryption** on the environment's active Novu In-App
   integration. Follow [Novu's production authentication instructions](https://docs.novu.co/platform/inbox/prepare-for-production).
3. Configure these server-only environment variables in every deployment that
   should expose the live composer:
   - `NOVU_WEB_CHAT_APPLICATION_IDENTIFIER`: the environment's application
     identifier.
   - `NOVU_WEB_CHAT_SECRET_KEY`: the matching Novu secret API key. Never expose
     this through a `NEXT_PUBLIC_*` variable.
   - `NOVU_WEB_CHAT_HMAC_ENABLED=true`: confirmation that HMAC is enabled in the
     matching Novu environment.

The confirmation flag does not inspect or change Novu's remote setting. The
dashboard setting is essential because sending a signature from this website
does not force Novu to reject unsigned clients. The old published demo
environment must also have HMAC enabled if it remains active because its public
application identifier is already known.

When any of the three server settings is absent, the live composer stays
unavailable. Domain personalization and the scripted preview continue to work.

## Security boundaries

- A server-generated `web-chat-<UUID>` identifies one browser visitor.
- A signed HTTP-only, SameSite Strict cookie preserves that identity for up to
  24 hours. HTTPS uses a Secure `__Host-` cookie without a Domain attribute.
- Expired, altered, or differently scoped cookies receive a new identity.
  Request bodies and query parameters cannot select a subscriber to sign.
- The cookie signature is bound to the Novu application and expiry with a
  separate signing purpose from the Novu subscriber hash.
- The endpoint returns only the public application identifier, anonymous
  subscriber ID, and HMAC-SHA256 subscriber hash. Its response is private and
  non-cacheable.
- Responsive views share one React provider. Resetting personalization reuses
  the browser identity while clearing the local conversation.

## Automated coverage

The unit suite covers independent visitors, signature correctness, cookie
tampering, cross-application reuse, expiry, missing configuration, cache and
cookie headers, and cross-origin requests.

The dedicated CI step supplies fixture-only credentials and intercepts all Novu
HTTP and WebSocket traffic. It exercises streaming, retries, approvals, preview
reset, isolated browser contexts, cookie reuse, and unavailable or unsigned
sessions in desktop and mobile Chromium and WebKit. It does not contact a real
Novu environment or prove that HMAC is enabled in the Novu dashboard.
