---
title: "Transactional email service vs notification infrastructure: when you outgrow SendGrid"
slug: transactional-email-vs-notification-infrastructure
description: "An ESP sends email. Notification infrastructure decides what to send, to whom, and on which channel. Here is when you cross that line."
category: Engineering
target_keyword: transactional email vs notification infrastructure
reading_time: 9
---

You picked SendGrid (or Resend, or Postmark) on day one and it was the right call. A password reset, a receipt, a welcome email. One channel, a handful of templates, an API key in an environment variable. It worked, and it kept working for a long time.

Then the product grew. Someone asked for an in-app bell icon. Support wanted a Slack ping when a high-value account hit an error. Users started replying "stop emailing me about this" and you realized you had no preference model. A single noisy job began sending forty separate emails where one summary would do. None of these are email problems. They are notification problems, and an email service provider (ESP) was never built to solve them.

This is a guide to that transition. When one channel and a template stop being enough, what the actual difference is between a transactional email service and multi-channel notification infrastructure, and the concrete signals that tell you which side of the line you are on. The short version, which is worth keeping in mind the whole way through: an ESP sends email. A notification layer decides what to send, to whom, on which channel, and whether to send at all.

## What an ESP is genuinely great at

Let us be fair, because an ESP is a valid starting point and stays valuable long after you outgrow it as your whole notification stack.

An email service provider is a specialist in the mechanics of getting an email into an inbox. That is a genuinely hard problem, and the good ones are excellent at it:

- **Deliverability.** IP warmup, domain reputation, SPF, DKIM, and DMARC alignment, feedback loops with mailbox providers, bounce and complaint handling. This is deep, unglamorous infrastructure work, and outsourcing it is almost always correct.
- **Throughput.** Sending millions of messages with retries and rate control against each mailbox provider's limits.
- **Email-native features.** Template rendering, link tracking, open tracking, suppression lists, and sending-domain management.
- **A clean API.** One POST and the message is on its way.

Here is the key point: none of this goes away when you adopt notification infrastructure. A good notification layer keeps your ESP exactly where it belongs, as the thing that actually delivers email. You do not rip SendGrid out. You stop asking it to be something it is not.

A basic transactional send looks like this, and for a long time it is all you need:

```ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: user.email,
  from: "noreply@acme.com",
  templateId: "d-welcome-template",
  dynamicTemplateData: { firstName: user.firstName },
});
```

Clean. Readable. Nothing wrong with it. The trouble starts when this snippet stops being the only one.

## The moment email alone breaks

The break is rarely a single dramatic event. It is a slow sprawl. Here is the sequence most teams live through.

**You add a second channel.** Product ships an in-app inbox, that bell icon with a dropdown of recent activity. Now every "we sent an email" moment needs a matching in-app record. Your `sendWelcomeEmail` function grows a sibling, `createInAppNotification`, and every call site has to remember to call both.

**You add push, or Slack, or WhatsApp.** Mobile wants push notifications. A B2B workflow needs to notify a shared Slack channel. Now the same underlying event, "invoice overdue", fans out to email, in-app, push, and Slack. Four SDKs, four payload shapes, four failure modes, called from the same handler.

**You add preferences.** Users want control. Email me for security, but only in-app for social. Digest the noisy stuff. Now every send site needs a preference check before it fires. That logic lands wherever it is convenient, which means it lands in ten places, subtly different in each.

**You add digests and throttling.** A batch job that touches a thousand records should not send a thousand emails. You need to collect events over a window and roll them into one. That is stateful. It does not belong in a send call at all, but that is where it ends up, wrapped in a Redis key someone will be afraid to touch in a year.

**You add routing rules.** Try push first, fall back to email if the device token is stale. Route by user tier. Suppress during quiet hours in the user's timezone. This is real business logic, and it is now interleaved with template IDs and API keys.

Step back and look at what you have built. Scattered across your codebase, in controllers and jobs and webhook handlers, is a notification system. Nobody designed it. It emerged. It has no single place to answer basic questions: what did we send this user this week, why did this message not go out, how do we add a channel without touching forty files.

We saw this exact shape at an AI-infrastructure company whose SendGrid calls were scattered across the codebase with no central place to manage them. Adding a channel meant grepping for `sgMail.send` and praying. Every engineer who touched notifications had to reverse-engineer the implicit rules. The email was never the problem. The absence of a decision layer was.

## ESP vs notification infrastructure, feature by feature

The clearest way to see the gap is to line the two up against the jobs a maturing product actually needs.

| Capability | Transactional email service (ESP) | Notification infrastructure |
|---|---|---|
| Email delivery | Yes, this is the core competency | Delegates to an ESP as a provider |
| Channels | Email only | Email, in-app inbox, push, Slack, Microsoft Teams, WhatsApp, Telegram |
| Multi-channel workflow | No, one send per call | One event fans out across channels |
| User preferences | Suppression lists only | Per-channel, per-category preference model |
| Digest and batching | No | Collect over a window, send one summary |
| Throttling and quiet hours | Rate limits, not user-facing rules | First-class step in the pipeline |
| Routing and fallback | No | Try push, fall back to email, route by tier |
| Provider failover | Single provider | Swap or fail over between providers |
| Activity feed | Per-email event logs | Per-user, cross-channel delivery timeline |
| Where logic lives | In your application code | In a versioned workflow definition |

Read the last row twice, because it is the real distinction. With an ESP, every decision about what to send and to whom lives in your application code, spread across call sites. With notification infrastructure, those decisions move into one workflow definition. The application emits an event and the workflow decides the rest.

The shift in the calling code makes it concrete. Instead of orchestrating channels by hand, you trigger one workflow:

```ts
import { Novu } from "@novu/api";

const novu = new Novu({ secretKey: process.env.NOVU_SECRET_KEY });

// The app emits one event. The workflow decides channels,
// preferences, digest, and delivery.
await novu.trigger({
  workflowId: "invoice-overdue",
  to: { subscriberId: user.id, email: user.email },
  payload: { invoiceId, amountDue, dueDate },
});
```

Every routing rule, preference check, digest window, and channel choice lives inside the `invoice-overdue` workflow, defined once and versioned. Your ESP is still doing the email delivery underneath. It is just no longer the thing making decisions it was never designed to make.

## A migration path from SendGrid or Resend

The good news is this is not a rip-and-replace. You keep your ESP, your templates, and your deliverability reputation. You are changing who makes the routing decisions, not who delivers the email. A staged path keeps you shippable the whole way.

**1. Add your ESP as a provider.** Connect SendGrid or Resend to the notification layer as its email provider. Your sending domain, reputation, and templates carry over. This step changes nothing user-facing.

**2. Model your first workflow.** Pick one high-value flow, say the welcome sequence. Define it as a workflow with a single email step. Trigger it from one call site. Confirm parity with what you had.

```bash
# Trigger the workflow from anywhere, one call, one event.
curl -X POST https://api.novu.co/v1/events/trigger \
  -H "Authorization: ApiKey $NOVU_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "welcome",
    "to": { "subscriberId": "user_123", "email": "dev@acme.com" },
    "payload": { "firstName": "Sam" }
  }'
```

**3. Migrate call sites incrementally.** Replace direct `sgMail.send` calls with workflow triggers, one flow at a time. Each migration collapses a bundle of ad hoc logic into one event. There is no big-bang cutover, and you can run both paths side by side during the transition.

**4. Add the second channel where it earns its place.** Now the payoff. Add an in-app step to a workflow and it appears in both channels with no new call sites. Add push the same way. The fan-out you were dreading becomes a line in a workflow definition.

**5. Move preferences and digest into the pipeline.** Turn on the preference check and the digest step as workflow stages. The stateful batching logic you were nervous about deleting now lives in infrastructure built for it, not in a Redis key in a cron job.

Each step is independently shippable, and you are never in a broken half-state.

## When you do not need this yet

Honesty matters more than a conversion here, so here is the counsel against adopting too early.

If you send one or two transactional emails, a receipt and a password reset, and you have no plan for a second channel, a direct ESP integration is the right tool. Adding a notification layer would be overhead with no payoff. The three or four lines of `sgMail.send` are genuinely simpler, and simpler is correct until it is not.

You have probably outgrown the ESP-only setup when several of these are true:

- You send across more than one channel, or you know you will within a quarter.
- The same event has to reach a user in more than one place.
- Users are asking for notification preferences and you have nowhere clean to put them.
- A batch job can flood someone, and you are hand-rolling batching.
- "Why did this message not go out" takes more than a minute to answer.
- Adding a channel means editing many files instead of one definition.

If you recognized three or more, the sprawl has already started. The question is only whether you manage it deliberately or keep discovering it in production.

Novu keeps your ESP as one provider under a multi-channel workflow, so SendGrid or Resend keeps delivering email while the routing, preferences, and digest logic move into one place you can actually reason about. See the [workflow and provider docs](https://docs.novu.co) to map your first flow.
