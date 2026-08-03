import telegramIcon from "@/svgs/pages/connect/channels/telegram.svg"

import type { IChannelPageData } from "@/types/channel"

export const telegramChannelData: IChannelPageData = {
  slug: "telegram",
  channelName: "Telegram",
  cliSlug: "telegram",
  icon: telegramIcon,
  seoTitle: "Connect Your AI Agent to Telegram | Novu Connect",
  seoDescription:
    "Put your AI agent on Telegram with fast conversational delivery, rich media, and inline replies. Start with npx novu connect --channel telegram, no account needed to try it.",
  hero: {
    eyebrow: "Novu Connect",
    heading: "Connect your AI agent to Telegram",
    subheading:
      "Reach users with fast, conversational updates, rich media, and replies inside Telegram. Bot-native and developer-friendly, connected once and live everywhere.",
  },
  citation:
    "Novu Connect puts an existing AI agent on Telegram with fast conversational delivery, rich media, inline keyboards, and two-way replies. Connect it with the command npx novu connect --channel telegram.",
  useCase: {
    company: "Lumen (a fictional developer API platform)",
    audience: "a developer using Lumen's API",
    summary:
      "A developer hits rate limits. The agent shows their usage, explains the cause, and upgrades the plan after approval.",
    transcript: [
      {
        from: "Sam (developer)",
        role: "customer",
        text: "Getting 429s on the /embeddings endpoint since this morning, am I rate limited?",
      },
      {
        from: "Lumen Agent",
        role: "agent",
        text: "Yes. You're on the Starter plan (60 req/min) and you've been hitting ~140 req/min since 08:00, so the extra calls get 429s. The Scale plan lifts you to 600 req/min. Upgrade now, or raise a temporary burst limit for today?",
      },
      {
        from: "Sam (developer)",
        role: "customer",
        text: "Upgrade to Scale.",
      },
      {
        from: "System",
        role: "system",
        text: "Approve: upgrade this workspace to the Scale plan (600 req/min).",
      },
      {
        from: "Lumen Agent",
        role: "agent",
        text: "Done. You're on Scale now, 600 req/min is live and the 429s should stop within a minute. Your usage is at 23% of the new limit.",
      },
    ],
  },
  capabilities: [
    "Fast conversational delivery",
    "Rich messages and media",
    "Inline keyboards for quick actions",
    "Replies routed to the right context",
  ],
  prompt:
    "Connect my AI agent to Telegram with Novu and configure rich messages, user identity, and two-way replies. Route each user's replies back to the same conversation.",
  onRamp: {
    type: "keyless",
    note: "Telegram works in the keyless quickstart. Run npx novu connect --channel telegram to get a managed agent on Telegram, no account needed for the first few replies.",
  },
  faq: [
    {
      question: "How do I connect my AI agent to Telegram?",
      answer:
        "Run npx novu connect --channel telegram, or paste the prompt above into your coding agent. Novu Connect handles the bot, user identity, and two-way routing so your agent code stays the same.",
    },
    {
      question: "Can the agent use inline keyboards and rich media?",
      answer:
        "Yes. Novu Connect renders native Telegram elements including inline keyboards and rich media, and routes each reply back to your agent.",
    },
    {
      question: "Does Novu run the agent's intelligence?",
      answer:
        "No. Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, bridge between your agent and Telegram. You own the agent's intelligence.",
    },
    {
      question: "What can an AI agent do on Telegram?",
      answer:
        "Telegram suits developer and bot-native agents: an SDK setup agent that gets developers to their first API call, an API reference agent, a webhook debug agent, and a plan advisor that reads usage and recommends the right plan. Start any of them in one click from the templates on this page.",
    },
    {
      question: "Which other channels can the same agent reach?",
      answer:
        "The same agent can reach users on Slack, Microsoft Teams, WhatsApp, Telegram, Email, and iMessage through Novu Connect, with one conversation thread across channels.",
    },
  ],
  starterTemplateIds: [
    "sdk-setup-agent",
    "api-reference-agent",
    "webhook-debug-agent",
    "plan-advisor-agent",
  ],
}
