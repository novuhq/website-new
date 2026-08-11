---
title: "Build vs buy notification infrastructure, honestly (and why AI coding made it worse)"
slug: build-vs-buy-notification-infrastructure
description: "Notifications look like a weekend project. The pain is maintenance, not v1. A build-vs-buy framework, TCO model, and where AI coding tilts the math."
category: Engineering
target_keyword: build vs buy notification system
reading_time: 13
---

A product manager files a ticket: "Send users an email when their report is ready." You wire up an API call to your email provider, template the subject line, ship it that afternoon. It works. Everyone is happy.

Six months later you own a retry queue, a preference center, a template repository nobody wants to touch, a dead-letter table you check every Monday, and a Slack channel that pings you when a provider starts bouncing mail at 3am. Nobody decided to build a notification system. You built one anyway, one ticket at a time.

That is the trap. Notifications look like a weekend project at version one, and the actual work shows up later, after the demo, after the launch, after the person who wrote it moves teams. This piece is about the honest version of the build-vs-buy decision: where the cost really lives, why AI coding tools have made the math worse for building rather than better, when you genuinely should build anyway, and a rough model you can run against your own numbers.

## The trap: version one is always easy

Here is version one of a notification system. It is not a strawman. This is roughly what ships on day one at most companies:

```ts
async function notifyReportReady(user: User, report: Report) {
  await sendgrid.send({
    to: user.email,
    from: "reports@acme.com",
    subject: `Your report ${report.name} is ready`,
    html: renderTemplate("report-ready", { user, report }),
  });
}
```

Nothing wrong with it. It compiles, it sends, the PM closes the ticket. If your entire notification surface is one transactional email to one channel and it never grows, you are done. Genuinely. Stop reading and go build it.

The problem is that this is never where it stops. The second ticket asks for a Slack message instead of email for internal users. The third asks users to choose. The fourth is a digest so you stop spamming people. The fifth is quiet hours because someone in Sydney got paged at 2am by a "your invoice is ready" message. Each ticket is small. The sum is a distributed system with delivery guarantees, and you are now maintaining it.

## The real cost is maintenance, not v1

The line item that kills you is not the code you write in the first afternoon. It is everything that keeps that code alive and correct for the next three years. Walk through what actually lands on your plate.

**Retries and backoff.** Providers fail. Networks partition. A send that returns a 500 needs a retry, and a naive retry loop turns one transient blip into a thundering herd against a provider that is already struggling. You need exponential backoff, jitter, a cap on attempts, idempotency keys so a retry does not double-send, and a dead-letter path for the sends that never succeed. That is a real queue with real semantics, not a `for` loop.

**Provider quirks and outages.** Every provider has edges. SendGrid categorizes bounces differently than you expect. WhatsApp enforces template pre-approval and a messaging window. Slack rate-limits per workspace and returns a `retry_after` you have to honor. Telegram bots have their own throttle. When one provider degrades, you want to fail over or at least degrade gracefully, which means you need a provider abstraction and health signals, not a hardcoded SDK call in a request handler.

**Preference and quiet-hours logic.** "Let users choose what they get and when" sounds like a settings page. Underneath it is a policy engine: per-user, per-channel, per-category opt-in and opt-out, timezone-aware quiet hours, digest batching windows, and a way to enforce all of it consistently at send time no matter which service triggers the notification. Get it wrong and you either spam people who opted out (a compliance problem) or silently drop messages people wanted (a trust problem). Both generate tickets.

**Template sprawl.** Ten notifications across five channels is fifty variants, each with copy, localization, and channel-specific formatting. Slack wants Block Kit. Email wants inlined CSS that survives Outlook. WhatsApp wants pre-approved templates with placeholder variables. SMS wants brevity and a character budget. Six months in, nobody remembers which template is live, marketing wants to edit copy without a deploy, and you are the bottleneck because the copy lives in your codebase.

**Deliverability.** This is its own discipline. SPF, DKIM, DMARC, warming a sending domain, watching your sender reputation, staying off blocklists, keeping bounce and complaint rates low enough that Gmail keeps accepting your mail. It is not code you write once. It is an ongoing operational concern that determines whether your messages arrive at all, and most backend teams have no one who owns it.

**On-call.** All of the above has to run at 3am. When notifications stop, users notice fast, because a missing password reset or a missing "your order shipped" is a support ticket within minutes. Someone carries the pager. That someone is you.

None of these show up in the version-one demo. All of them show up in year two. The build-vs-buy decision is really a maintenance decision wearing a v1 costume.

## The 2026 twist: AI writes v1 for free and rots at maintenance

Here is the part that changed. Two years ago, "we could just build it" was throttled by the cost of writing version one. That afternoon of work was a real afternoon. Now an LLM writes it in ten minutes. You describe the notification service, and a coding assistant hands you the sender, the template renderer, a queue consumer, even a first pass at retry logic. The friction that used to make teams pause before building has mostly evaporated.

The instinct is to read that as a point for building. It is the opposite. Look again at where the cost actually lives. It is not in version one, which is exactly the part AI does well. It is in the long-lived maintenance, which is exactly the part AI does poorly.

LLMs are excellent at first drafts of well-understood patterns. A retry loop, a template function, a webhook handler: these are all over the training data, and you get a competent version instantly. What an LLM does not do is carry the context of a living system across three years. It was not on-call when WhatsApp changed its template policy. It did not feel the incident when a retry storm took down your own API. It does not remember that the preference table has a subtle timezone bug that only fires during daylight-saving transitions. It will happily generate a plausible-looking `sendWithRetry` that lacks idempotency, and it will do it with total confidence, because plausible-looking is the job.

So AI lowers the cost of the cheap part and does nothing for the expensive part. That makes the build option look cheaper than it is, precisely because the sticker price you now see (an afternoon, or ten minutes) is more misleading than ever. A team that would have hesitated to build in 2023 now ships a v1 in an afternoon and inherits the full maintenance burden without having priced it.

> **AI can write your notification service in an afternoon. It cannot carry the pager for it at 2am.**

That is the whole argument in one line. The economics of build-vs-buy were always about who owns the maintenance. AI changed the cost of the part that was never the problem.

## A build-vs-buy decision framework

Skip the vibes. Answer five concrete questions about your actual situation.

**1. How many channels, and will that number grow?** One channel that will stay one channel is a strong build signal. The cost of a notification system scales with channels, because each channel is its own provider, its own template format, its own failure mode, its own rate limits. If you can honestly commit to a single channel forever, building is defensible. If product has already asked for a second, you are on the multi-channel path whether you admit it or not.

**2. Do you need user-facing preferences?** A preference center is where "simple notification code" becomes a policy engine. If every user gets every message and that is acceptable, you have dodged the hardest part. The moment users need to choose channels, categories, or timing, you are building and maintaining consent logic, and that logic has compliance consequences.

**3. What is your tolerance for delivery failure?** A missed marketing digest is an annoyance. A missed password reset or a missed "your trade executed" alert is a support escalation or worse. The higher the stakes of a dropped message, the more you need mature retry, failover, and observability, and the more expensive building that becomes.

**4. Who owns this in year two?** Name the team. If the answer is "whoever built it," and that person is planning to still be on this team in two years and wants to own notification infrastructure, fine. If the answer is a shrug, you are about to create orphaned infrastructure that decays until it pages someone who does not understand it.

**5. Is notification delivery a differentiator for your product?** Be honest. For almost every product, users do not choose you because your retry logic is elegant. They never see it. Delivery is table stakes that hurts when it breaks and is invisible when it works. If that describes you, building it is spending your scarcest engineering hours on something no customer will ever credit you for.

Tally the answers. Multi-channel, preference-heavy, high-stakes, unowned, and non-differentiating points hard at buy. Single-channel, no preferences, low-stakes, clearly-owned, and core-to-the-product points at build. Most teams land closer to buy than they expect, because they answer question one as "just email" and question two as "not yet," and both are usually wrong within a year.

## When you should actually build

Buying is not always right, and pretending otherwise is how vendors lose credibility. Three cases where building is the correct call:

**A single trivial channel with no growth path.** Internal tool, one email a day to a fixed list of admins, no preferences, nobody's password depends on it. Wiring an SDK call is the right amount of engineering. A notification platform is overkill.

**Hard data-residency or air-gap constraints.** If you operate under regulatory or contractual rules that forbid message content from leaving your infrastructure, or you run in an air-gapped environment where an external delivery service is a non-starter, self-hosting or building may be the only compliant path. Note that this argues for self-hosting an open-source platform as much as for building from scratch, since you get to keep the code inside your walls either way.

**Notifications are your core product.** If you are building a notification product, an alerting company, an incident-response platform, then delivery is your differentiator and you should own every layer of it. That is the one case where question five flips.

Outside those, the honest answer is usually buy or self-host something that already exists.

## What buying actually offloads

The pitch for buying is not "less code," though it is that too. It is that you stop owning the maintenance categories from earlier as your problem. A notification platform absorbs:

- Retry, backoff, idempotency, and dead-letter handling as a managed workflow engine rather than code you keep patching.
- A provider abstraction across channels (Slack, Microsoft Teams, WhatsApp, Telegram, Email, plus in-app Inbox and push as product features) so a provider swap is configuration, not a refactor.
- A preference and subscription layer with per-channel, per-category, timezone-aware logic already built and enforced at send time.
- Template management your non-engineers can edit without a deploy.
- Deliverability tooling and provider health, so a degraded provider is handled by the platform instead of your pager.
- Observability into every message: sent, delivered, failed, retried, why.

Novu is one option here, and worth naming because it covers the case most teams actually have. It is open source (around 40K GitHub stars), so you can self-host the whole thing if data residency is your constraint, or use the managed cloud if it is not. Either way the retry logic, provider abstraction, preference layer, and template management are code you no longer own line by line. That is the real trade: you give up total control of a system that is not your differentiator, and you get back the engineering hours and the sleep.

## A rough TCO model

Numbers make the trade concrete. These are illustrative, not a quote. Plug in your own rates and hours, because the shape of the answer matters more than the exact figures.

Assume a fully loaded engineer costs about 200,000 per year, roughly 100 per hour. Assume a multi-channel system with preferences, the common case.

| Cost line | Build (year 1) | Build (steady state, per year) | Buy / self-host |
| --- | --- | --- | --- |
| Initial build (3 channels, retries, preferences, templates) | ~320 hours (~32,000) | 0 | Integration: ~40 hours (~4,000) |
| Ongoing maintenance and provider changes | included above | ~0.3 FTE (~60,000) | ~0.05 FTE (~10,000) |
| On-call load attributable to notifications | ~40 hours (~4,000) | ~0.1 FTE (~20,000) | near 0 (platform absorbs delivery) |
| Deliverability and provider ops | ~40 hours (~4,000) | ~0.1 FTE (~20,000) | mostly absorbed |
| Platform / infra cost | hosting only | hosting only | subscription or self-host infra |
| Opportunity cost (features not shipped) | high | recurring | low |
| **Rough year-one total** | **~40,000 in labor, before opportunity cost** | **~100,000/year recurring** | **~14,000 labor + platform cost** |

The build column looks cheapest at the initial-build cell, which is exactly the cell AI just made even cheaper. Then the steady-state row shows up and never leaves. Around half an FTE of recurring cost is a reasonable estimate for keeping a multi-channel notification system healthy, and that is before you count the features your best engineers did not ship because they were debugging a retry storm.

The opportunity-cost row is the one teams underweight most. Every hour on notification plumbing is an hour not on the product that actually differentiates you.

## The analogy buyers reach for on their own

Sit through enough of these decisions across cybersecurity tooling, automotive-retail software, logistics platforms, capital-markets systems, and health platforms, and the same realization repeats. Different domains, same arc: v1 was easy, year two was a slog, and someone eventually said the quiet part.

The analogy they reach for, unprompted, is payments. Nobody builds their own payment processor anymore. Stripe exists, it handles the boring, high-stakes, compliance-heavy, endlessly-maintained parts, and you integrate it and move on. Not because you could not build a payments system, but because it would be a bad use of your engineers to own that maintenance forever when the differentiator is your product, not your card-processing retry logic.

Notifications are following the same path. High-stakes, boring when they work, painful when they break, endless to maintain, and not your differentiator. The question stopped being "can we build this," because with AI you obviously can, in an afternoon. The question is whether you want to own it at 2am for the next three years.

## Where to land

Run the five questions against your real situation, not the version-one demo in your head. If you are genuinely single-channel, preference-free, low-stakes, clearly owned, and notifications are your product, build it and do not overthink it. Everyone else is on the multi-channel maintenance path and should price it honestly, including the recurring FTE and the on-call the demo never showed.

If you want to see what buying or self-hosting actually offloads, Novu is open source and you can run it yourself or start on the managed cloud. Try the self-serve setup, read the code, and decide against your own numbers.
