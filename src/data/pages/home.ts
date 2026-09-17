import { ROUTE } from "@/constants/routes"

import type { IFaqSection } from "@/types/common"
import { buildChannelConnectPrompt } from "@/lib/connect-prompt"

// Single source of truth for homepage copy. The homepage
// (app/(website)/(connect-footer)/page.tsx), the /index.md markdown alternate
// (lib/markdown/pages/home.ts), and the homepage JSON-LD all read from here so
// the three surfaces cannot drift.

export const HOME_HERO = {
  command: "npx novu connect",
  description:
    "Open-source infrastructure to notify your users and let your agents talk with them, on the channels they already use.",
  title: "Connect your AI agents and products to customers",
}

// Live feature tabs (available integration + primary action) vs coming-soon
// tabs (static preview + notify-me). iMessage is live via the `sendblue` CLI
// slug.
export const HOME_LIVE_CHANNEL_KEYS = [
  "slack",
  "teams",
  "whatsapp",
  "telegram",
  "email",
  "imessage",
  "inbox",
  "push",
  "chat",
  "sms",
] as const

export const HOME_CLI_SLUGS: Record<string, string> = {
  slack: "slack",
  teams: "teams",
  whatsapp: "whatsapp",
  telegram: "telegram",
  email: "email",
  imessage: "sendblue",
}

// Pathnames of feature tabs that have a dedicated product or channel page.
export const HOME_CHANNEL_PAGE_PATHNAMES: Record<string, string> = {
  slack: "/channels/slack",
  whatsapp: "/channels/whatsapp",
  telegram: "/channels/telegram",
  teams: "/channels/microsoft-teams",
  email: "/channels/email",
  imessage: "/channels/imessage",
  inbox: String(ROUTE.inbox),
}

export const HOME_CHANNELS = [
  {
    key: "slack",
    badges: ["notify", "connect"] as const,
    label: "Slack",
    title: "Connect your AI agent to Slack",
    description:
      "Put your agent where teams coordinate work, investigate issues, and make decisions together.",
    prompt: buildChannelConnectPrompt("Slack"),
    features: [
      "Conversation context across threaded replies",
      "Rich messages built with Block Kit",
      "Buttons for actions and approvals",
      "Live typing and read states",
      "Messages that update in place",
    ],
  },
  {
    key: "teams",
    badges: ["notify", "connect"] as const,
    label: "Microsoft Teams",
    title: "Communicate with users in Microsoft Teams",
    description:
      "Bring your agent into the Microsoft workspace used for internal operations and enterprise collaboration.",
    prompt: buildChannelConnectPrompt("Microsoft Teams"),
    features: [
      "Conversation context across replies",
      "Adaptive Cards that update in place",
      "Buttons for actions and approvals",
      "Rich text and reactions",
      "Ordered message processing",
    ],
  },
  {
    key: "whatsapp",
    badges: ["connect"] as const,
    label: "WhatsApp Business",
    title: "Connect your AI agent to WhatsApp Business",
    description:
      "Give customers a direct way to reach your agent from the messaging app they already use.",
    prompt: buildChannelConnectPrompt("WhatsApp Business"),
    features: [
      "Persistent conversation context",
      "Typing indicators and read receipts",
      "Quick-reply buttons",
      "Secure links for tool and MCP approvals",
      "Ordered message processing",
    ],
  },
  {
    key: "telegram",
    badges: ["connect"] as const,
    label: "Telegram",
    title: "Connect your AI agent to Telegram",
    description:
      "Make your agent available in a fast, lightweight channel suited to direct user conversations.",
    prompt: buildChannelConnectPrompt("Telegram"),
    features: [
      "Conversation context across replies",
      "Markdown-rich messages",
      "Inline buttons and quick actions",
      "Typing indicators and read receipts",
      "Messages that update in place",
    ],
  },
  {
    key: "email",
    badges: ["notify", "connect"] as const,
    label: "Email",
    title: "Communicate with users over email",
    description:
      "Use email for conversations that benefit from a durable record and more room for detail.",
    prompt: buildChannelConnectPrompt("Email"),
    features: [
      "Threaded conversation history",
      "Rich HTML messages",
      "Action links for approvals and tool access",
      "Read tracking",
      "Ordered message processing",
    ],
  },
  {
    key: "imessage",
    badges: ["connect"] as const,
    label: "iMessage",
    title: "Connect your AI agent to iMessage",
    description:
      "Give customers a familiar way to reach your agent through the Messages app.",
    prompt: buildChannelConnectPrompt("iMessage"),
    features: [
      "Full conversation history",
      "Conversation-level threaded replies",
      "Live typing indicators",
      "Reply-based action and MCP approvals",
      "Plain-text MCP connection links",
    ],
  },
  {
    key: "inbox",
    badges: ["notify"] as const,
    label: "Inbox",
    title: "Send notifications to your in-app Inbox",
    description:
      "Give users one place inside your product to see and manage the updates that matter to them.",
    features: [
      "Prebuilt and composable Inbox components",
      "Real-time notifications and unread counts",
      "Built-in notification preferences",
      "Tabs, filters, and flexible layouts",
      "Custom styling, localization, and snoozing",
    ],
    action: {
      label: "Explore Inbox",
      href: String(ROUTE.inbox),
    },
  },
  {
    key: "push",
    badges: ["notify"] as const,
    label: "Push",
    title: "Send push notifications to your users",
    description:
      "Reach users on mobile, desktop, and web when they are away from your product.",
    features: [
      "One workflow layer across push providers",
      "Multiple provider integrations",
      "Subscriber device-token management",
      "Provider-specific delivery overrides",
      "Support for providers such as: FCM, APNS, Expo Push, OneSignal, Pusher Beams and more",
    ],
    action: {
      label: "Explore push providers",
      href: "https://docs.novu.co/platform/integrations/push",
    },
  },
  {
    key: "chat",
    badges: ["notify"] as const,
    label: "Chat",
    title: "Send notifications to chat platforms",
    description:
      "Route product notifications into the workplace and community tools your users already monitor.",
    features: [
      "Workflow-driven chat notifications",
      "Multiple provider integrations",
      "Subscriber-specific channel credentials",
      "Provider-specific formatting and overrides",
      "Selected providers: Slack, Microsoft Teams, Discord, WhatsApp Business, Mattermost and more",
    ],
    action: {
      label: "Explore chat providers",
      href: "https://docs.novu.co/platform/integrations/chat",
    },
  },
  {
    key: "sms",
    badges: ["notify"] as const,
    label: "SMS",
    title: "Send notifications to your users via SMS",
    description:
      "Deliver urgent and transactional updates directly to users' phones.",
    features: [
      "Workflow-driven SMS delivery",
      "Dynamic message content",
      "Multiple provider integrations",
      "Runtime recipient, sender, and content overrides",
      "Support for providers such as: Twilio, Infobip, AWS SNS, Vonage (Nexmo), Telnyx and more",
    ],
    action: {
      label: "Explore SMS providers",
      href: "https://docs.novu.co/platform/integrations/sms",
    },
  },
  {
    key: "discord",
    badges: ["notify", "connect"] as const,
    statusBadge: "Coming Soon",
    label: "Discord",
    title: "Communicate with users over Discord chat",
    description:
      "Bring your agent into the communities where users ask questions, share feedback, and collaborate.",
  },
  {
    key: "linear",
    badges: ["connect"] as const,
    statusBadge: "Coming Soon",
    label: "Linear",
    title: "Connect your AI agent to Linear",
    description:
      "Let teams work with your agent from the issue and project workflows they already manage in Linear.",
  },
  {
    key: "zoom",
    badges: ["connect"] as const,
    statusBadge: "Coming Soon",
    label: "Zoom",
    title: "Connect your AI agent to Zoom",
    description:
      "Bring your agent into the conversations that continue before, during, and after work happens in Zoom.",
  },
  {
    key: "google-chat",
    badges: ["connect"] as const,
    statusBadge: "Coming Soon",
    label: "Google Chat",
    title: "Connect your AI agent to Google Chat",
    description:
      "Bring your agent into Google Chat for conversations inside Google Workspace.",
  },
]

export const HOME_CONNECT_STACK = {
  title: "Opinionated about communication. Unopinionated about intelligence.",
  description:
    "We solve the communication problem so you can own the agent intelligence, where your customers actually work.",
}

export const HOME_NOVU_CONNECT_INTRO = {
  label: "Novu Connect",
  title: "The Agent Communication Infrastructure",
  description:
    "Talk with your users on the channels they already use, without building the plumbing.",
}

export const HOME_NOVU_CONNECT_ITEMS = [
  {
    title: "Customer-facing agents, connected across every channel",
    description:
      "Allow your customers to reach out to your agents directly, and your agents to initiate conversations with customers. Your agents get the work done with format consistency, reliability, and security in mind.",
  },
  {
    title: "Full context, every message",
    description:
      "Every message includes the full conversation history and state, so your agent keeps context without rebuilding memory or managing its own session store.",
  },
  {
    title: "Human approval, before it acts",
    description:
      "When an agent needs to refund, provision, deploy, or call a tool on an MCP server, Novu brings human-in-the-loop (HITL) approval into the same conversation before it acts.",
  },
  {
    title: "Open source, ready in one command",
    description:
      "Novu Connect is built in the open: inspect the code, contribute integrations, or adapt it for your team’s workflow.",
  },
]

export const HOME_NOVU_NOTIFY_INTRO = {
  label: "Novu Notify",
  title: "Novu Notify overview",
  description:
    "Add an <Inbox /> to your product by end of day. Start sending notifications across every channel with one API tomorrow. Simple.",
}

export const HOME_NOVU_NOTIFY_ITEMS = [
  {
    title: "Fits perfectly into your app",
    description:
      "Deliver a rich in-app notification experience that completely mirrors your existing UX, not an afterthought or a bolt-on.",
  },
  {
    title: "User-controlled preferences",
    description:
      "Let people choose what they receive, when, and where, with quiet hours and snooze built in.",
  },
  {
    title: "Digests & rate limits",
    description:
      "Bundle multiple notifications into one instead of five, and cap how often anyone gets pinged. No noisy inbox, no spam.",
  },
  {
    title: "One workflow, every channel",
    description:
      "Trigger once. Novu handles routing, conditions, delays, and fallbacks across every channel, all from a single workflow.",
  },
]

export const HOME_FEATURED_CUSTOMERS = {
  title: "How engineering teams ship faster with Novu",
  linkText: "See all customers",
  caseStudyLinkText: "Read case study",
  items: [
    {
      company: "Unified",
      href: "/customers/unified/",
      quote:
        "Novu’s UI lets us handle configuration without reinventing the wheel, that's a huge savings on development and maintenance",
      authorName: "Tin Nguyen",
      authorPosition: "Lead Engineer",
      logo: "unified" as const,
    },
    {
      company: "Veritext AI Partners",
      href: "/customers/veritext/",
      quote: "Novu is already working successfully across multiple teams",
      authorName: "Jared Millman",
      authorPosition: "Software Engineer",
      logo: "veritext" as const,
    },
    {
      company: "Deriv",
      href: "/customers/deriv/",
      quote:
        "Implementing new notifications is centralized, secure, and straightforward. It helps us focus on our core business and ship fast",
      authorName: "Denis Safiullin",
      authorPosition: "Deriv Backend Team Lead",
      logo: "deriv" as const,
    },
  ],
}

export const HOME_COMPLIANCE = {
  title: "Built for enterprise environments",
  description:
    "Open source, self-hosted, or fully managed. Choose the deployment model that fits your security, compliance, and operational requirements.",
  items: [
    {
      question: "Compliance",
      answer:
        "Meet enterprise requirements with security and governance designed for regulated environments.",
    },
    {
      question: "Self-hosted",
      answer:
        "Deploy in your own infrastructure or private cloud while keeping full control over your data.",
    },
    {
      question: "Open source",
      answer:
        "Build on a transparent, extensible foundation backed by an active open-source community.",
    },
  ],
}

// Mirrors the certification logos rendered by components/pages/home/compliance.tsx.
export const HOME_COMPLIANCE_CERTIFICATIONS = [
  "SOC 2 Type II certification",
  "ISO 27001 certification",
  "GDPR compliance",
  "HIPAA compliance",
]

export const HOME_FAQ = {
  title: "Frequently asked questions",
  accordion: {
    items: [
      {
        question: "What is Novu?",
        answer:
          "Novu is open-source communication infrastructure for products and AI agents. Novu Notify sends product notifications across Inbox, email, SMS, push, and chat. Novu Connect lets AI agents talk with users on the channels they already use, such as Slack, Microsoft Teams, WhatsApp, Telegram, and email.",
      },
      {
        question:
          "What is the difference between Novu Notify and Novu Connect?",
        answer:
          "Novu Notify handles workflow-driven notifications from your product to your users. Novu Connect handles two-way conversations between AI agents and people. Both use Novu's channel, identity, and delivery infrastructure.",
      },
      {
        question: "What is ACI, Agent Communication Infrastructure?",
        answer:
          "ACI, Agent Communication Infrastructure, is the layer that connects AI agents to the channels people already use. It handles message delivery, threading, conversation state, user identity, and human approvals, while your agent keeps its own model, tools, and logic. Novu Connect is Novu's ACI.",
      },
      {
        question: "Can I connect an AI agent I have already built?",
        answer:
          "Yes. You keep your model, prompts, tools, business logic, keys, and runtime. Novu Connect provides the communication layer that receives messages, preserves the conversation, and delivers responses through the selected channels.",
      },
      {
        question: "Which agent frameworks and runtimes can I use?",
        answer:
          "Novu Connect works with popular agent frameworks and runtimes, including Claude Managed Agents, AWS Claude Managed Agents, Vercel AI SDK, Chat SDK, LangChain, and custom code. The homepage prompt generator shows the runtimes the CLI currently supports.",
      },
      {
        question: "Which channels does Novu support?",
        answer:
          "Availability depends on the product. Novu Notify supports Inbox and external notification channels such as email, SMS, push, and chat through provider integrations. Novu Connect supports two-way agent conversations on its live channels. Each channel card shows separate Novu Notify and Novu Connect badges so you can see what is available today.",
      },
      {
        question: "Can one agent communicate across multiple channels?",
        answer:
          "Yes. You can connect the same agent to multiple supported channels without rebuilding its core logic for each one. Novu Connect handles communication concerns such as channel delivery, conversation persistence, threading, and user identity while your agent keeps its existing intelligence and tools.",
      },
      {
        question: "Can I use my existing push, SMS, and chat providers?",
        answer:
          "Yes. Connect your provider accounts through the Novu Integration Store. Novu gives your application one workflow and API layer while the configured provider handles delivery. You can also configure multiple integrations and use provider-specific settings where required.",
      },
      {
        question: "How do I connect my agent to a channel?",
        answer:
          "Choose a channel and your agent framework. The website generates a prompt containing the complete Novu CLI command. Run the command in your project, complete the interactive channel setup, and approve the required dependencies. When the CLI returns a continuation prompt, paste it into your coding agent to finish the integration.",
      },
      {
        question:
          "Do I need to paste API keys or provider credentials into my coding agent?",
        answer:
          "No. Complete authorization and credential entry through the Novu CLI or the provider's secure flow. The generated prompt explicitly tells the coding agent not to request secrets in chat or hardcode them in the project.",
      },
      {
        question: "Can I self-host Novu?",
        answer:
          "Novu Community Edition can be self-hosted for core notification infrastructure, including Inbox, email, SMS, push, and chat. Novu Cloud adds managed and enterprise capabilities.",
      },
    ],
  },
} satisfies IFaqSection

export const HOME_CTA = {
  title: "One engine underneath",
  description:
    "Whether you're building a modern app or an AI agent, Novu is the delivery layer that connects you to the world.",
}
