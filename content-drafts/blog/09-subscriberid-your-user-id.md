---
title: "Set subscriberId to your own user ID: the no-mapping integration pattern"
slug: notification-subscriber-id-pattern
description: "Use your own user ID as the notification subscriberId, skip the mapping table, and let upsert-on-trigger create the record. Gotchas included."
category: Engineering
target_keyword: notification subscriber identity pattern
reading_time: 6
---

Most notification integrations start with a mistake that looks like diligence. You stand up a notification service, it hands you back its own opaque subscriber IDs, and you dutifully store them next to your users. Now you own a mapping table. You own the sync job that keeps it warm. You own the race condition where a user exists in your database but not yet in the notification system, and the on-call page that follows.

None of that work needs to exist. The identifier you already have, your user's ID, is a perfectly good notification identity. Use it directly, and the mapping table, the pre-sync, and a whole category of drift bugs disappear.

## The mapping-table anti-pattern

The pattern shows up in almost every first integration. It looks like this:

```
users
  id            uuid
  email         text

notification_subscribers
  user_id            uuid   -> users.id
  external_sub_id    text   -> the notification system's ID
```

That second table is a liability disguised as a foreign key. Consider what it commits you to:

- **A backfill.** Every existing user needs a subscriber record created before they can receive anything.
- **A sync path.** Every new sign-up has to round-trip to the notification system and store the returned ID before the user is fully usable. If that call fails, you have a user who cannot be notified and a retry queue to manage.
- **A source-of-truth conflict.** When an email changes, which side wins? You now have two systems that both believe they know a user's contact details, and you get to reconcile them.

Every one of those is a place for the two tables to disagree. A mapping table between your users and your notification users is a cache with no invalidation strategy, and it exists only because you let an external system mint identities it had no need to mint.

## subscriberId equals your user ID

The fix is to stop treating notification identity as separate from application identity. Set `subscriberId` to the ID you already trust. Your database primary key is the natural choice. Trigger a workflow with that ID and attach the subscriber's data inline on the same call:

```ts
import { Novu } from '@novu/api';

const novu = new Novu({ secretKey: process.env.NOVU_SECRET_KEY });

await novu.trigger({
  workflowId: 'comment-reply',
  to: {
    // Your own user ID. Not a value the notification system invented.
    subscriberId: user.id,
    email: user.email,
    firstName: user.firstName,
    // Anything the workflow templates need to address this person.
  },
  payload: {
    commentId: comment.id,
    threadUrl: comment.url,
  },
});
```

There is no lookup before this call. You did not ask the notification system who `user.id` is, because you are telling it. The `to` object carries both the identity and the current contact details, so the trigger is self-describing.

If you address subscribers from more than one service, keep the ID construction identical everywhere. A tiny shared helper is enough to guarantee the billing service and the web app never disagree on what a given user's `subscriberId` is:

```ts
export const toSubscriberId = (userId: string) => userId;
```

That looks trivial because it is. The point is having one place that defines the mapping, so it stays a pure function of your user ID and never becomes a stored value someone can edit out from under you.

## Upsert on first trigger, no pre-sync

Here is the part that removes the backfill. You do not have to create the subscriber before you can notify them. When you trigger with a `subscriberId` that has no record yet, Novu creates one from the `to` object on that first call, then updates it on later calls. It is an upsert, keyed on your ID.

That single behavior deletes the pre-sync step. There is no "provision every user first" migration, no readiness flag, no window where a fresh sign-up exists in your database but cannot receive a welcome message. The first time you actually need to notify someone, the record comes into being, populated with whatever contact data you passed. Subscribers who never trigger a workflow never take up space.

Because each trigger carries the current `to` payload, the subscriber's email and profile stay fresh as a side effect of normal traffic. An email change propagates the next time that user is notified. You are not running a sync job. You are letting the write path you already have keep the data current.

## Multi-tenant: topics and a context ID

Per-user identity handles direct messages. Fan-out (notify everyone watching a project, everyone in a workspace) is a different shape, and stapling tenant information into the `subscriberId` is the wrong move. A subscriber is a person and should have one stable ID across every tenant they belong to.

Model the group as a topic instead, and build the topic key from your own tenant and context IDs:

```ts
const topicKey = `org:${orgId}:project:${projectId}`;

// Add a member. subscriberId is still just the user's ID.
await novu.topics.subscriptions.create(topicKey, {
  subscriberIds: [user.id],
});

// Notify the whole project in one trigger.
await novu.trigger({
  workflowId: 'project-activity',
  to: { type: 'Topic', topicKey },
  payload: { event: 'deploy.finished' },
});
```

The same person can belong to `org:a:project:1` and `org:b:project:9` under one `subscriberId`. Tenancy lives in the topic key, identity lives in the subscriber, and the two compose cleanly. If a user leaves a project, you remove them from that topic and their global identity is untouched. Deriving the topic key from IDs you own means it is reproducible: any service can address the same group without a lookup, exactly as with `subscriberId`.

## Gotchas, honestly

This pattern is simpler, not free. Four things to get right.

**Use a stable ID, never a mutable one.** This is the one that will actually hurt you. Email feels convenient, and it works until someone changes their email. Now their `subscriberId` has changed, their old identity is orphaned, in-app history is stranded on the dead ID, and preferences do not follow them. Key on your immutable primary key, the one your database never reassigns. If you only have an email today, keep the real key in reserve and migrate before it bites you.

**PII travels in the `to` object.** Because contact details ride along with each trigger, you are sending real personal data on a hot path. That is fine, and it is a decision to make on purpose. Send the fields the workflow templates actually use and no more. Do not treat the subscriber profile as a general-purpose user store or a place to stash attributes the notifications never render.

**Deletion has two steps.** Removing the user from your database does not remove the subscriber. When you honor a deletion request, delete the subscriber explicitly so contact details and message history are gone from both systems. Wire it into the same routine that erases the user, so the two never fall out of sync (the exact drift the mapping table used to cause, reintroduced through the back door if you forget).

**Do not silently re-identify.** Because the ID is deterministic, re-creating a user with the same primary key resurrects the old subscriber and its history. Usually that is what you want. Occasionally it is a surprise, for example when IDs get recycled in a test environment. Know which regime you are in.

Weigh those against what you were doing before, running a sync job and reconciling two sources of truth, and it is not close. Teams in analytics and research tooling and in AI infrastructure who moved to this pattern report the same outcome: an entire table and its sync job left the codebase, and the drift bugs that came with them left too.

The takeaway is one sentence. Do not build a table to map your users to notification users. Make them the same user.

Ready to wire it up? The [Novu subscribers documentation](https://docs.novu.co/platform/concepts/subscribers) covers identifiers, the `to` object, and topic subscriptions in full.
