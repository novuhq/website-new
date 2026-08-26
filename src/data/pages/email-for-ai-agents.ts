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
      "Give your existing AI agent a real email channel. It reads, replies, and follows up in the same thread. One of five channels, one conversation. Novu delivers, you keep the brain.",
  },
}

// The hero email-client visual. Its own copy rather than the channel transcript:
// the design shows a tighter, self-contained thread (subject line, timestamps,
// secure actions, settled credit note) than the longer use-case transcript.
export const EMAIL_AGENTS_HERO_THREAD = {
  agent: {
    name: "Brightledger Agent (via Novu)",
    email: "billing@brightledger.com",
    time: "9:44 AM",
    subject: "Re: This month's platform fee",
    message:
      "You're right. You moved to the Growth plan on the 12th, so the first half of the month should have been billed at the Starter rate. You're owed a credit on this invoice.",
    approveLabel: "Approve $120 credit",
    denyLabel: "Deny",
    secureLabel: "Secure links",
  },
  customer: {
    name: "Tomás Vidal",
    email: "tomas@meridian.com",
    time: "9:48 AM",
    message: "Yes, please issue the $120 credit.",
  },
  outcome: {
    label: "Credit issued",
    noteLabel: "Credit note:",
    noteValue: "INV-4471-C1",
  },
}

// The use-case section that pairs the email-client animation with the pitch.
// The description is the Email channel's citation and use-case summary minus
// the "connect it with the command" sentence, because the command now sits
// next to the copy as its own field.
export const EMAIL_AGENTS_USE_CASE = {
  title: "Email conversations your agent can resolve",
  description:
    "Novu Connect reaches users by email with rich, actionable notifications, responsive templates, attachments, and high-deliverability routing. A customer questions an invoice. The agent finds the proration error, issues a credit via a secure action link after approval, and replies in the thread.",
}

// The capability cards. Order follows the design, which differs from the Email
// channel's `capabilities` list because each card carries its own illustration.
export const EMAIL_AGENTS_CAPABILITIES = {
  description:
    "Start with the keyless quickstart. Run the command to connect Email and let your agent send its first replies, no account required.",
  cards: [
    { label: "Responsive message templates" },
    { label: "High-deliverability routing" },
    { label: "Attachments and rich content" },
    { label: "Secure action links for approvals" },
  ],
}

// The delivery-layer block. This is the first place ACI is used on the page, so
// it carries the gloss.
export const EMAIL_AGENTS_DELIVERY = {
  title: "We never run your brain.",
  description:
    "Novu Connect is the Agent Communication Infrastructure (ACI) that handles email delivery, threading, and reply routing while your model, prompts, and logic stay yours.",
  points: [
    {
      title: "Your model, your keys",
      description:
        "Bring the agent you already built on any code or model platform. Novu sees only the message it delivers.",
    },
    {
      title: "Two-way by default",
      description:
        "Replies route back to your agent, turning every email thread into a real conversation.",
    },
    {
      title: "One agent, every channel",
      description:
        "Your agent keeps one thread across Slack, Microsoft Teams, WhatsApp, Telegram, and Email.",
    },
  ],
}

export const EMAIL_AGENTS_CTA = {
  title: "Give your agent a voice in the inbox",
  description:
    "Connect the agent you already run without changing its model, runtime, or logic. One agent, every channel, one conversation.",
}
