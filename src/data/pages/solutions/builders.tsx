import { ROUTE } from "@/constants/routes"

import type { ISolutionPageData } from "@/types/solution"

// Persona: founder, indie builder, or first engineer at a 1-50 person team.
// No platform team, evaluates through GitHub, allergic to lock-in and
// surprise bills, wants to ship this week.
export const buildersSolutionData: ISolutionPageData = {
  slug: "builders",
  name: "For Builders",
  seoTitle: "Novu for Builders | Open Source Notification Infrastructure",
  seoDescription:
    "MIT-licensed core, roughly 40,000 GitHub stars, 4 years of notification infrastructure. Ship notifications and agent chat from a free tier, or self-host the whole thing.",
  conversionTrack: "self-serve",
  hero: {
    eyebrow: "For builders",
    heading: "Ship notifications like you have a platform team",
    subheading:
      "You don't have a platform team. You have a product to ship. Novu is open source notification infrastructure with an MIT-licensed core, roughly 40,000 GitHub stars, and 4 years of production history: notifications and agent chat from the free tier, or self-host and run every piece yourself.",
  },
  primaryCta: {
    label: "View on GitHub",
    href: ROUTE.github,
  },
  secondaryCta: {
    label: "Start free",
    href: ROUTE.dashboardV2SignUp,
  },
  sections: [
    {
      heading: "Open source, actually",
      body: "Not open-core marketing with the real product behind a wall. The core is MIT-licensed: read it, run it, patch it.",
      variant: "prose",
      bullets: [
        "MIT-licensed core, every line on GitHub",
        "Roughly 40,000 GitHub stars",
        "4 years of production notification infrastructure",
        "Self-host with Docker, or use the cloud free tier",
      ],
    },
    {
      heading: "The parts you skip building",
      body: "A notification system is a pile of undifferentiated work: provider APIs, retry queues, batching logic, preference storage. Novu ships it so your weekend project keeps its weekend.",
      variant: "prose",
      bullets: [
        "Provider connections for email, SMS, push, chat, and in-app",
        "Digest, delay, and throttle logic",
        "Subscriber identity and preferences",
        "Delivery status, retries, and logs",
      ],
    },
    {
      heading: "No lock-in, by construction",
      body: "The exit is built in. Workflows are TypeScript in your repo, provider accounts stay yours, and the MIT core means self-hosting is always on the table. If Novu ever stops earning its place in your stack, you leave with your code and your data.",
    },
    {
      heading: "Agent chat, same stack",
      body: "When your project grows an agent, the same infrastructure carries the conversation. Run npx novu connect and your agent talks to users on Slack, Microsoft Teams, WhatsApp, Telegram, and Email. No new vendor, no second identity model.",
    },
  ],
  codeSnippet: {
    heading: "First notification, a few lines",
    description:
      "Trigger a workflow from your backend. Novu resolves the subscriber, walks the workflow steps, and delivers through your provider connections.",
    label: "notify.ts",
    code: `import { Novu } from "@novu/api"

const novu = new Novu({ secretKey: process.env.NOVU_SECRET_KEY })

await novu.trigger({
  workflowId: "deploy-finished",
  to: { subscriberId: "dev_512" },
  payload: { project: "api", status: "passed" },
})`,
  },
  faq: [
    {
      question: "Is Novu really open source?",
      answer:
        "Yes. The core is MIT-licensed and developed in the open on GitHub, with roughly 40,000 stars and 4 years of history. You can read the code, run it locally, and self-host it.",
    },
    {
      question: "Can I self-host Novu?",
      answer:
        "Yes. Run the full stack yourself with Docker, or start on the cloud free tier and move later. The same workflows run in both.",
    },
    {
      question: "What does the free tier cover?",
      answer:
        "Enough to ship a real project: the in-app Inbox, workflows, and provider integrations. Check the pricing page for current limits before you rely on a number.",
    },
    {
      question: "What happens when I outgrow the free tier?",
      answer:
        "Your workflows don't change, your subscriber data stays, and pricing scales on the pricing page in the open. If cloud pricing ever stops making sense for you, self-hosting the MIT core is a real option, not a threat we hope you never test.",
    },
    {
      question: "Can I add an AI agent later without new infrastructure?",
      answer:
        "Yes. Run npx novu connect and the agent you built talks to users on Slack, Microsoft Teams, WhatsApp, Telegram, and Email, on the same Novu stack that sends your notifications.",
    },
  ],
  finalCta: {
    title: "Build the product, not the plumbing",
    description:
      "Star the repo, read the code, then trigger your first workflow. Notifications and agent chat on one open source stack.",
  },
}
