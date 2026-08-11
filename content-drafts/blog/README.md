# Blog content drafts: voice-of-customer, first 10

Ten draft long-form articles for the Novu blog. This is the first wave of a 25-piece content plan built from real demand: we mined roughly 50 customer and prospect call transcripts for the questions developers actually ask, then cross-referenced each theme against live search results. Every article is grounded in a recurring, real question, not guesswork.

**These are drafts. We want two things from this PR.**

## Ask 1: make the content better

The writing is a solid, brand-clean first pass, not a finished piece. Please edit for sharpness, accuracy, flow, and voice. Push back on anything that reads generic. A few known placeholders to fix before any of these publish:

- Cover images: all 10 currently reuse one placeholder asset. Each needs real art.
- Author byline: currently an existing author as a placeholder. Set the real author.
- Category: all set to "How to" as a placeholder. Assign the right category.
- Pricing and competitor claims: verify current numbers before publish (the drafts flag this inline).

## Ask 2: rethink the blog article structure so it is readable and clickable

This is the bigger ask. Right now the blog article template renders these as a wall of text. We do not want a dump of text. We want the article page rebuilt to be scannable, engaging, and clickable. Think about:

- A sticky table of contents and clear section anchors for long reads.
- Typography and spacing that make a 2,500-word piece easy to scan.
- First-class treatment for code blocks, tables, callouts, and diagrams (several drafts use mermaid diagrams and comparison tables that should look great, not like preformatted text).
- Pull quotes for the one-line takeaways each article already contains.
- Related content, a strong end CTA, and internal links so a reader clicks onward instead of bouncing.
- Reading time, share, and other signals that make the page feel alive.

Treat the ten drafts as the content system these templates need to serve.

## Where these already live

- **Sanity:** all ten are staged as `blogPost` drafts (noIndex on) and render locally in draft mode at `localhost:3007/blog/<slug>/`. Ask Netanel for a fresh preview link (the draft-mode secret is short-lived).
- **Notion:** each article is also a "Full draft" sub-page under its brief in the VoC Content Briefs database, with native tables and rendered mermaid diagrams. That is the nicest surface to read them on.
- **This folder:** the raw markdown source, so edits can be reviewed and suggested inline in this PR.

## The ten drafts

| # | File | Working title |
|---|---|---|
| 1 | 01-build-vs-buy.md | Build vs buy notification infrastructure, honestly (and why AI coding made it worse) |
| 2 | 02-notification-pricing-models.md | How notification pricing models actually work (and why per-message billing is a trap) |
| 3 | 03-delivery-guarantee.md | What "delivery guarantee" really means for notifications |
| 4 | 04-push-delivery-apns-fcm.md | What "delivered" really means for push: APNs vs FCM |
| 5 | 05-transactional-email-vs-infra.md | Transactional email service vs notification infrastructure |
| 6 | 06-notification-system-architecture.md | Design a multi-channel notification system: a real architecture guide |
| 7 | 07-notification-microservice.md | The notification microservice: components, patterns, and when to extract it |
| 8 | 08-notifications-internal-platform.md | Notifications as an internal platform: wrap the vendor behind your own service |
| 9 | 09-subscriberid-your-user-id.md | Set subscriberId to your own user ID: the no-mapping integration pattern |
| 10 | 10-notification-spikes-scale.md | Handle notification spikes: fan-out, backpressure, and at-least-once at scale |

## One code change in this PR

`src/lib/blog/index.ts`: the two latest-posts helpers now skip posts with no category or slug. Three existing in-progress drafts had unfilled required fields and were crashing the blog article page in draft-preview mode. This guard is a small robustness fix so a draft with unfilled fields cannot 500 the related-posts list.

## Brand rules these drafts follow (please keep them)

No em dashes. ACI is glossed as "Agent Communication Infrastructure" on first use. GitHub stars are ~40K. Channels are exactly Slack, Microsoft Teams, WhatsApp, Telegram, Email. No customer names anywhere (industry descriptors only). Competitor names are stated factually. Novu is the delivery layer, never the agent's brain.
