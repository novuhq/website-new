---
title: "How notification pricing models actually work (and why per-message billing is a trap)"
slug: notification-pricing-models
description: "Per-message, per-subscriber, per-profile, or per-workflow-run: the four notification pricing models explained, with a worked cost model at scale."
category: Engineering
target_keyword: notification service pricing model
reading_time: 9
---

You picked a notification vendor because the demo was clean and the entry price looked fine. Then you hit real volume, the invoice tripled, and finance is in your Slack asking why. Nothing about your product changed. You just ran into the pricing model, and you never actually evaluated it.

This is the single most common source of confusion when teams buy notification infrastructure. The features across vendors converge. The pricing models do not, and they diverge in ways that can swing your bill by an order of magnitude at scale. Two vendors can look comparably priced on the pricing page and bill you numbers that are nowhere near each other once you send real traffic. The model, not the sticker rate, decides what you pay.

Here are the four models in plain terms, a worked example that shows where each one explodes, and a method to forecast your real cost before you sign anything.

## Why notification bills surprise people

The surprise is almost always a mismatch between the unit you think in and the unit you are billed in. You think in events: "a user did a thing, so we told them." The vendor might bill in messages, and one event can fan out to many messages. You think in active users, but the vendor might bill in stored profiles, and you are storing far more profiles than you have active users.

The bill scales on the vendor's unit, not yours. When those two units diverge, and they usually do at scale, the invoice does something your capacity planning did not predict. The fix is to understand which unit each model charges on before you commit, so the unit you are billed in is one you can actually forecast.

## The four pricing models, plainly

**Per-message (or per-send).** You pay for each individual message that leaves the system. One email is one unit. One event that sends email plus Slack plus SMS is three units. This is the classic model for single-channel senders. SendGrid, for example, prices email in volume tiers, effectively per message sent. The model is easy to reason about for one channel and gets expensive fast the moment you fan out across channels, because every added channel multiplies your unit count.

**Per-subscriber or per-MAU.** You pay based on how many recipients you can notify, often counted as monthly active users. Send that user one message or fifty in the month and the count is the same. This rewards high message volume per user and punishes large, sparsely-messaged audiences, because you pay for every reachable user whether or not you contacted them much.

**Per-profile.** You pay for every profile stored in the system, active or not. Customer.io bills on profiles (its billable-profile model), and CleverTap similarly meters on monthly active or tracked profiles. The trap here is dormant data: profiles you imported, churned users you never deleted, test accounts, and duplicates all sit in the billable count. Your bill can grow while your actual sending stays flat, purely from data you are storing.

**Per-workflow-run (per-event).** You pay once when a workflow fires, regardless of how many channels it fans out to. One event that sends email, then falls back to Slack, then pushes an in-app Inbox message is one run, not three sends. Channels are included in the run. This decouples your bill from channel count, which is the thing that blows up the other models at multi-channel scale. Novu prices this way.

A quick caveat before the numbers: vendor pricing changes, and every vendor structures tiers, overages, and add-ons differently. Treat the model descriptions as the durable part and verify current rates on each vendor's pricing page before you plan a budget around them.

## A worked example: one event, 500,000 recipients, three channels

Take a concrete scenario. You fire one notification workflow: a service announcement that goes to 500,000 recipients. It sends across three channels, say email, plus a push or in-app Inbox message, plus a Slack or Telegram message for the segment that connected one. Assume for simplicity the fan-out averages out so that this single event produces roughly 1.5 million individual messages across the three channels (not every recipient gets all three, but many get two).

Now price that one event under each model. The rates below are round illustrative numbers for comparison, not vendor quotes.

| Model | Billable unit | Units for this event | Illustrative rate | Cost of this one event |
| --- | --- | --- | --- | --- |
| Per-message | Individual message sent | ~1,500,000 | ~0.0004 each | ~600 |
| Per-subscriber / MAU | Reachable users this month | 500,000 | tiered by user count | high fixed floor, scales with audience |
| Per-profile | Stored profiles | 500,000+ (plus dormant) | tiered by profile count | high, and grows with stored data |
| Per-workflow-run | Workflow execution | 1 run (x recipients) | per-run tier | lowest per delivered message at this fan-out |

The point of the table is the direction, not the decimals. Per-message pricing scales with the fan-out, so the more channels you add and the wider you send, the faster it climbs. At half a million recipients across three channels, per-message billing gets expensive fast, because you are paying 1.5 million times for one logical event. Per-profile and per-subscriber pricing do not care how many messages you sent, but they charge you for your whole audience every month, including the users you barely touch and the dormant profiles you forgot to delete. Per-workflow-run pricing charges for the event and includes the channels, so adding the third channel does not multiply the bill.

The teams that feel this most are the ones with wide fan-out and multiple channels: healthcare-staffing platforms blasting shift alerts, online-trading systems pushing time-sensitive notices across app and messaging channels, pharma-compliance tools with multi-step approval notifications, and consumer-fintech apps sending transactional confirmations everywhere at once. A recurring pattern in those spaces: the workflow-run model is harder to estimate at first, because you have to think in events rather than the messages you are used to counting, but it comes out cheaper at multi-channel scale precisely because it does not multiply by channel.

> **You are not paying to send a message. You are paying for a pricing model. Pick the model before you pick the vendor.**

## How to forecast your real monthly cost

Do not price off the headline rate. Model your own traffic in four steps.

**1. Count your events, not your messages.** How many distinct notification-worthy things happen per month? A signup, an order, a report finishing, an alert firing. This is your event volume, and it is the number you actually control.

**2. Measure your fan-out.** For an average event, how many individual messages go out across all channels? If a typical event hits two channels for most recipients, your fan-out is roughly 2x. Multiply event volume by fan-out to get message volume. The gap between these two numbers is exactly what separates a per-run bill from a per-message bill.

**3. Count your real profiles, including the dead ones.** How many profiles will actually sit in the system, not how many you actively message? Include churned users, imports, test accounts, and duplicates. For per-profile and per-subscriber models, this is your billable base, and it is usually bigger than you think.

**4. Compute the bill under each model and stress it.** Take your event count, message count, and profile count, and run each against the vendor's tiers. Then multiply your growth: if you 5x next year, which model 5x's your bill and which 20x's it? The model that stays proportional to your actual growth is the one you want. The one that multiplies faster than your business is the trap.

This takes an afternoon in a spreadsheet and saves you the renegotiation later.

## The questions to ask any vendor before you sign

Get these answered in writing before a signature:

- **What exactly is a billable unit?** Message, event, workflow run, profile, or active user. Make them define it precisely.
- **Does adding a channel multiply my bill?** This separates per-run models from per-message models, and it is the question that predicts your multi-channel cost.
- **Am I billed for stored profiles I never message?** For profile-based models, ask how dormant and duplicate profiles are counted and whether deleting them lowers the bill.
- **What are the overage rates past my tier?** The in-tier rate is marketing. The overage rate is what you pay when you grow.
- **How is a retry or a fallback counted?** If a failed email retries or falls back to another channel, is that one unit or several? At scale this compounds.
- **Can I see a bill modeled on my real volume?** Give them your event, message, and profile numbers and ask for a modeled invoice, not a headline price.

If a vendor cannot answer these cleanly, that is information too.

## Where to land

The mistake is picking a vendor on features and inheriting a pricing model you never evaluated. Reverse the order. Model your own event volume, fan-out, and real profile count, run them against each model, and stress the numbers against your growth. The model that stays proportional to your business is the one to buy, whatever the logo on it.

Novu prices per workflow-run with channels included, so adding Slack, Microsoft Teams, WhatsApp, Telegram, Email, or in-app Inbox to a workflow does not multiply your bill by channel. Model your own numbers against it and check the current rates on the pricing page before you plan a budget.
