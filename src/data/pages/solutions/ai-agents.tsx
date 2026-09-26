import { ROUTE } from "@/constants/routes"
import customerFacingGraphic from "@/images/pages/home/novu-connect/customer-facing.jpg"
import fullContextGraphic from "@/images/pages/home/novu-connect/full-context.jpg"
import humanApprovalGraphic from "@/images/pages/home/novu-connect/human-approval.jpg"
import oneConversationGraphic from "@/images/pages/home/novu-connect/one-conversation.jpg"

import type { ISolutionPageData } from "@/types/solution"

// Persona: "The AI Product Builder". VP Engineering, Head of Platform, or
// senior product engineer at an 11-500 person SaaS. The agent feature works
// in staging; the blocker is the last mile into real channels.
export const aiAgentsSolutionData: ISolutionPageData = {
  slug: "ai-agents",
  name: "For AI Agents",
  seoTitle: "Novu for AI Agents | Put Your Agent in Front of Users",
  seoDescription:
    "Your agent already works. Novu Connect is the ACI, Agent Communication Infrastructure, layer that puts it in front of users on Slack, Microsoft Teams, WhatsApp, Telegram, and Email. Two-way, one thread.",
  conversionTrack: "self-serve",
  heroVariant: "globe",
  hero: {
    eyebrow: "For AI agents",
    heading: "Your agent works. Now put it where your users are.",
    subheading:
      "Novu Connect is the ACI, Agent Communication Infrastructure, that puts the agent you already built in front of users on Slack, Microsoft Teams, WhatsApp, Telegram, and Email. Two-way, one thread, live in minutes.",
  },
  secondaryCta: {
    label: "Explore Novu Connect",
    href: ROUTE.connect,
  },
  command: "npx novu connect",
  prompt: "Add an agent to my app https://novu.co/agents.md",
  sections: [
    {
      heading:
        "The agent was the hard part. The last mile is the annoying part.",
      body: "Your team already did the difficult work. What stands between your agent and your users is channel plumbing: every channel has its own webhook format, identity model, and threading rules. That is weeks of engineering with nothing to do with your product. Novu standardizes it once, so the next channel is a config change, not a quarter.",
    },
    {
      heading: "What Novu handles, so your agent code doesn't",
      body: "Connect once. Your agent writes one reply, and Novu makes it native on every channel while keeping the conversation straight.",
      variant: "cards",
      cards: [
        {
          title: "Identity resolution",
          body: "The same user on Slack and email maps to one person, so your agent always knows who it is talking to.",
          image: fullContextGraphic,
          imageClassName: "bottom-0 left-1/2 w-[80%] -translate-x-1/2",
        },
        {
          title: "Delivery and threading",
          body: "Retries, delivery status, and one conversation thread that follows the user across channels.",
          image: oneConversationGraphic,
          imageClassName: "bottom-0 left-1/2 w-[92%] -translate-x-1/2",
          mascotEyes: true,
        },
        {
          title: "OAuth and credentials",
          body: "Provider connections, tokens, and scopes managed for every channel, no secrets in your agent code.",
          image: humanApprovalGraphic,
          imageClassName: "bottom-0 left-1/2 w-[88%] -translate-x-1/2",
        },
        {
          title: "Content normalization",
          body: "One reply becomes Slack blocks, WhatsApp buttons, or HTML email, native to each channel.",
          image: customerFacingGraphic,
          imageClassName: "bottom-0 left-1/2 w-[92%] -translate-x-1/2",
        },
      ],
    },
    {
      heading: "We never run your brain",
      body: "Novu is the delivery layer between your agent and its users. Your model, your prompts, your logic stay on your side, and Novu carries the messages. MCP connects agents to tools, A2A connects agents to each other, and ACI, Agent Communication Infrastructure, connects agents to people. That is the layer Novu Connect is.",
      variant: "prose",
      bullets: [
        "Bring LangChain, Vercel AI SDK, Chat SDK, custom code, or a Claude Managed Agent. The agent stays yours.",
        "Swap the runtime later and the channels, identity, and conversation history come along.",
        "SOC 2 Type II, HIPAA, ISO 27001, and GDPR. Your model and keys never touch Novu's runtime.",
      ],
    },
  ],
  faq: [
    {
      question: "How do I know this fits our agent?",
      answer:
        "One test: does your agent initiate conversations, respond to user input, or surface things that need a human reply? If yes, it needs a two-way channel layer and Novu Connect fits. If it only pushes one-way alerts, standard Novu notification workflows are the simpler answer.",
    },
    {
      question: "Does Novu run my agent's model or logic?",
      answer:
        "No. Novu Connect is the ACI, Agent Communication Infrastructure, layer between your agent and its users. Your model, prompts, and logic stay on your side. We never run your brain. That's the whole point.",
    },
    {
      question: "Which channels can my agent reach?",
      answer:
        "Slack, Microsoft Teams, WhatsApp, Telegram, and Email. One agent holds one conversation thread across all of them, with identity resolution so the same user maps to one person everywhere.",
    },
    {
      question: "How do I connect my existing agent?",
      answer:
        "Run npx novu connect, or paste 'Add an agent to my app https://novu.co/agents.md' into your coding agent. Connect takes about 2 minutes and does not require changes to your agent's logic.",
    },
    {
      question: "What if I don't have an agent yet?",
      answer:
        "Start from a Managed Agent, a hosted template you configure in about 10 minutes, or write a Custom Code Agent for full control. Whichever path you pick, you only ever change the part that holds your logic.",
    },
  ],
  finalCta: {
    title: "Give your agent a voice",
    description:
      "Run npx novu connect, or paste 'Add an agent to my app https://novu.co/agents.md' into your coding agent. Your agent talks to users in about 2 minutes.",
  },
}
