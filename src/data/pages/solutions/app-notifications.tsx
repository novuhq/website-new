import { ROUTE } from "@/constants/routes"

import type { ISolutionPageData } from "@/types/solution"

// Persona: Head or Director of Engineering at an 11-500 person SaaS who owns
// a home-grown notification stack (SendGrid or Twilio glue code, a cron
// digest, a half-wired preferences table) and a React front end.
export const appNotificationsSolutionData: ISolutionPageData = {
  slug: "app-notifications",
  name: "For App Notifications",
  seoTitle: "Novu for App Notifications | One Workflow, Every Channel",
  seoDescription:
    "Novu Notify: an embeddable in-app Inbox, a workflow engine with digests and delays, subscriber preferences, and provider integrations. One workflow, every channel: In-App, Email, SMS, Push, Chat.",
  conversionTrack: "self-serve",
  hero: {
    eyebrow: "For app notifications",
    heading: "Retire the notification code nobody wants to own",
    subheading:
      "Every product grows one: an email helper here, a cron digest there, a preferences table that is half wired up. Novu Notify replaces the pile with an embeddable Inbox, a real workflow engine, and your existing providers behind one API. Build the workflow once, deliver to In-App, Email, SMS, Push, and Chat.",
  },
  primaryCta: {
    label: "Start free",
    href: ROUTE.dashboardV2SignUp,
  },
  secondaryCta: {
    label: "Explore the Inbox",
    href: ROUTE.inbox,
  },
  sections: [
    {
      heading: "It worked, until product asked for more",
      body: "The in-house version always starts small and always ends in the same place: product wants digests, quiet hours, per-tenant branding, and a notification center, and suddenly notifications are a roadmap item with no owner. That feature list is exactly what the workflow engine ships with, so your team goes back to building your product.",
    },
    {
      heading: "Keep your providers, retire your glue code",
      body: "You already have SendGrid or Twilio accounts, deliverability history, and contracts. Keep them. Novu routes each workflow step through the provider connections you configure, retries on failure, and records what happened, so what you replace is the orchestration code around the providers, not the providers.",
      variant: "prose",
      bullets: [
        "Bring your own provider connections, like SendGrid for email or Twilio for SMS",
        "Open and click tracking on delivered messages",
        "Delivery status you can query per message",
        "Migrate workflow by workflow, no big-bang cutover",
      ],
    },
    {
      heading: "An Inbox your users expect",
      body: "Ship a real notification center without building one. Embed the React component, or go headless and keep full control of the UI.",
      variant: "prose",
      bullets: [
        "Drop-in <Inbox /> React component, styled to match your app",
        "Headless APIs when you want to build the UI yourself",
        "Subscriber preferences: users pick channels and mute what they don't need",
        "White-labeling end to end, your brand only",
      ],
    },
    {
      heading: "A workflow engine, not an if statement",
      body: "Notification logic grows fast: delays, digests, escalation paths. Novu's workflow engine holds it all, in a visual editor or code-first in TypeScript, typed and reviewed in your repo like everything else.",
      variant: "prose",
      bullets: [
        "Delays and scheduled steps",
        "Digest aggregation: batch 40 events into one summary",
        "Throttling so users never get flooded",
        "Conditional branching on payload, preference, or a prior step",
        "Multi-tenant support for B2B apps",
      ],
    },
    {
      heading: "One layer of the communication layer",
      body: "Notify is not a separate product. The same platform that delivers your product notifications carries your agent conversations. Add Novu Connect later and both run through one workflow, one subscriber identity, one preference center.",
    },
  ],
  codeSnippet: {
    heading: "Define it in TypeScript",
    description:
      "Workflows live in your codebase: typed, versioned, reviewed like any other code. Prefer clicking? The same workflow is editable visually in the dashboard.",
    label: "workflows/comment-digest.ts",
    code: `import { workflow } from "@novu/framework"

export const commentDigest = workflow("comment-digest", async ({ step }) => {
  const digest = await step.digest("digest-comments", () => ({
    amount: 10,
    unit: "minutes",
  }))

  await step.inApp("notify-inbox", () => ({
    subject: digest.events.length + " new comments on your post",
    body: "Open the thread to reply.",
  }))
})`,
  },
  faq: [
    {
      question:
        "We already send email and SMS from our own code. What does migration look like?",
      answer:
        "Incremental. Keep your provider accounts and deliverability history, point Novu at them as provider connections, and move one workflow at a time. Most teams start with the noisiest workflow (usually a digest candidate) and retire the in-house path behind it.",
    },
    {
      question: "Do I have to use the React Inbox component?",
      answer:
        "No. The <Inbox /> component is the fastest path, but everything it does is available through headless APIs, so you can build your own notification UI on top of the same data.",
    },
    {
      question: "Can I define workflows in code instead of the dashboard?",
      answer:
        "Yes. Workflows are code-first in TypeScript if you want them versioned and reviewed in your repo, or you can build the same workflows in the visual editor. Both run on the same engine.",
    },
    {
      question: "Which channels does a workflow cover?",
      answer:
        "One workflow can deliver to In-App, Email, SMS, Push, and Chat. Each step routes through the provider connection you configure, for example SendGrid for email, with open and click tracking on delivery.",
    },
    {
      question: "Does Novu support multi-tenant apps?",
      answer:
        "Yes. Tenants keep separate branding, preferences, and provider configuration, so one workflow serves every customer of your B2B app without custom routing code.",
    },
  ],
  finalCta: {
    title: "Ship your notification system this week",
    description:
      "Embed the Inbox, define one workflow, connect a provider. Delays, digests, and preferences come with the engine, not with more of your code.",
  },
}
