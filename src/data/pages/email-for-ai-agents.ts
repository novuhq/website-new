import { emailChannelData } from "@/data/pages/channels/email"

import type { IChannelPageData } from "@/types/channel"

// Single source of truth for the /email-for-ai-agents master landing page. The
// page (app/(website)/(connect-footer)/email-for-ai-agents/page.tsx), its
// JSON-LD, and the markdown alternate all read from here so the surfaces cannot
// drift. It reuses the shipped Email channel content (transcript, capabilities,
// FAQ, starter templates) from channels/email.tsx and layers a higher-altitude
// "Email for AI agents" framing on top for the search category.

export const EMAIL_AGENTS_COMMAND = "npx novu connect --channel email"

export const EMAIL_AGENTS_PROMPT =
  "Connect my AI agent to Email using the instructions on https://novu.co/agents.md"

export const EMAIL_AGENTS_SEO_TITLE = "Email for AI agents | Novu Connect"

export const EMAIL_AGENTS_SEO_DESCRIPTION =
  "Give the AI agent you already run a real email channel. It sends, replies, and follows up in one thread, as one of five channels in a single conversation. Start with npx novu connect --channel email."

// A full IChannelPageData object so the page can reuse the channel section
// components verbatim. cliSlug stays "email" so the CLI command and the
// email-client-facing video resolve to the shipped Email assets.
export const emailForAiAgentsData: IChannelPageData = {
  ...emailChannelData,
  slug: "email-for-ai-agents",
  seoTitle: EMAIL_AGENTS_SEO_TITLE,
  seoDescription: EMAIL_AGENTS_SEO_DESCRIPTION,
  hero: {
    eyebrow: "Novu Connect · Email",
    heading: "Email for AI agents",
    subheading:
      "Give the AI agent you already run a real email channel. It reads, replies, and follows up in the same thread, not a one-way sender and not a separate email product. One of five channels, one conversation. Novu delivers, you keep the brain.",
  },
}

// The delivery-layer block. This is the first place ACI is used on the page, so
// it carries the gloss.
export const EMAIL_AGENTS_DELIVERY = {
  title: "We never run your brain. That's the whole point.",
  description:
    "Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, bridge between your agent and the inbox. The intelligence stays yours. Novu handles email templates, delivery, threading, and reply routing, so your agent code never changes.",
  points: [
    {
      title: "Your model, your keys",
      description:
        "Bring the agent you already built on your own code or model platform. Novu never sees the reasoning, only the message to deliver.",
    },
    {
      title: "Two-way by default",
      description:
        "Replies route straight back to your agent, so an email thread is a real conversation, not a fire-and-forget notification.",
    },
    {
      title: "One agent, every channel",
      description:
        "The same agent reaches users on Slack, Microsoft Teams, WhatsApp, Telegram, and Email, holding one thread across all of them.",
    },
  ],
}

export const EMAIL_AGENTS_CTA = {
  title: "Give your agent a voice in the inbox",
  description:
    "Pro tip: paste 'Add an agent to my app https://novu.co/agents.md' into your coding agent, or run npx novu connect --channel email. One agent, every channel, one conversation.",
}
