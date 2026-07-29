import { ROUTE } from "@/constants/routes"

import type { IFaqSection } from "@/types/common"

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
  inbox: String(ROUTE.inbox),
}

export const HOME_CHANNELS = [
  {
    key: "slack",
    badges: ["connect"] as const,
    label: "Slack",
    title: "Connect your AI agent to Slack",
    description:
      "Reach teams where work happens with rich, actionable messages, threads, and reliable delivery routing.",
    prompt:
      "Connect my AI agent to Slack with Novu, including threaded replies and delivery status handling.",
    features: [
      "Two-way threaded conversations",
      "Team and user identity mapping",
      "Reliable delivery with retries",
    ],
  },
  {
    key: "whatsapp",
    badges: ["connect"] as const,
    label: "WhatsApp",
    title: "Connect your AI agent to WhatsApp",
    description:
      "Start secure two-way customer conversations with templates, attachments, and delivery receipts.",
    prompt:
      "Connect my AI agent to WhatsApp with Novu and configure approved templates plus two-way replies.",
    features: [
      "Secure two-way conversations",
      "Approved message templates",
      "Attachments and delivery receipts",
    ],
  },
  {
    key: "telegram",
    badges: ["connect"] as const,
    label: "Telegram",
    title: "Connect your AI agent to Telegram",
    description:
      "Reach users with fast, conversational updates, rich media, and replies inside Telegram.",
    prompt:
      "Connect my AI agent to Telegram with Novu and configure rich messages, user identity, and two-way replies.",
    features: [
      "Fast conversational delivery",
      "Rich messages and media",
      "Replies routed to the right context",
    ],
  },
  {
    key: "teams",
    badges: ["connect", "notify"] as const,
    label: "MS Teams",
    title: "Connect your AI agent to Microsoft Teams",
    description:
      "Bring agent updates and human handoffs into the channels your organization already uses.",
    prompt:
      "Connect my AI agent to Microsoft Teams with Novu and include a human handoff workflow.",
    features: [
      "Channel and thread awareness",
      "Human handoff workflows",
      "Reliable team notifications",
    ],
  },
  {
    key: "email",
    badges: ["notify", "connect"] as const,
    label: "Email",
    title: "Connect your AI agent to Email",
    description:
      "Reach users directly in their inbox with rich, actionable notifications. Support for templates, attachments, and high-deliverability routing.",
    prompt:
      "Connect my AI agent to Email with Novu using a responsive template, attachments, and delivery tracking.",
    features: [
      "Responsive message templates",
      "Attachments and rich content",
      "High-deliverability routing",
    ],
  },
  {
    key: "imessage",
    badges: ["connect"] as const,
    label: "iMessage",
    title: "Connect your AI agent to iMessage",
    description:
      "Bring agent conversations and timely updates into the native messaging experience customers already use.",
    prompt:
      "Connect my AI agent to iMessage with Novu and configure secure two-way conversations plus delivery tracking.",
    features: [
      "Native messaging experience",
      "Secure two-way conversations",
      "Delivery status tracking",
    ],
  },
  {
    key: "inbox",
    badges: ["notify"] as const,
    label: "Inbox",
    title: "Connect your AI agent to Inbox",
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
    title: "Connect your AI agent to Push",
    description:
      "Reach users on mobile, desktop, and web when they are away from your product.",
    features: [
      "One workflow layer across push providers",
      "Multiple provider integrations",
      "Subscriber device-token management",
      "Provider-specific delivery overrides",
      "Selected providers: FCM, APNS, Expo Push, OneSignal, Pusher Beams and more",
    ],
    action: {
      label: "Explore Push Providers",
      href: String(ROUTE.docsProviders),
    },
  },
  {
    key: "chat",
    badges: ["notify"] as const,
    label: "Chat",
    title: "Send notifications to chat platforms",
    description:
      "Deliver personalized notifications through Slack, Microsoft Teams, WhatsApp, Telegram, Discord, and other supported chat providers, all managed through Novu workflows.",
    features: [
      "Slack, Teams, WhatsApp, and more",
      "Personalized workflow messages",
      "Multiple provider integrations",
    ],
    action: {
      label: "Explore Chat Providers",
      href: String(ROUTE.docsProviders),
    },
  },
  {
    key: "sms",
    badges: ["notify"] as const,
    label: "SMS",
    title: "Connect your AI agent to SMS",
    description:
      "Deliver urgent and transactional updates directly to users' phones.",
    features: [
      "Workflow-driven SMS delivery",
      "Dynamic message content",
      "Multiple provider integrations",
      "Runtime recipient, sender, and content overrides",
      "Selected providers: Twilio, Infobip, AWS SNS, Vonage (Nexmo), Telnyx and more",
    ],
    action: {
      label: "Explore SMS Providers",
      href: String(ROUTE.docsProviders),
    },
  },
  {
    key: "github",
    badges: ["notify"] as const,
    label: "GitHub",
    title: "Connect your AI agent to GitHub workflows",
    description:
      "Notify maintainers about releases, incidents, and reviews with the right context attached.",
    prompt:
      "Connect my AI agent to GitHub events with Novu for pull request and release notifications.",
    features: [
      "Pull request notifications",
      "Release and incident updates",
      "Repository context included",
    ],
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
    key: "linear",
    badges: ["connect"] as const,
    statusBadge: "Coming Soon",
    label: "Linear",
    title: "Connect your AI agent to Linear",
    description:
      "Let teams work with your agent from the issue and project workflows they already manage in Linear.",
  },
  {
    key: "discord",
    badges: ["notify", "connect"] as const,
    statusBadge: "Coming Soon",
    label: "Discord",
    title: "Connect your AI agent to Discord",
    description:
      "Bring your agent into the communities where users ask questions, share feedback, and collaborate.",
  },
  {
    key: "messenger",
    badges: ["notify", "connect"] as const,
    statusBadge: "Coming Soon",
    label: "FB Messenger",
    title: "Connect your AI agent to Facebook Messenger",
    description:
      "Bring your agent into the Microsoft workspace used for internal operations and enterprise collaboration.",
    features: [
      "Conversation context across replies",
      "Adaptive Cards that update in place",
      "Buttons for actions and approvals",
      "Rich text and reactions",
      "Ordered message processing",
    ],
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
    "Converse with humans on any channel without building the plumbing. ",
}

export const HOME_NOVU_CONNECT_ITEMS = [
  {
    title: "Customer-facing agents, connected across every channel",
    description:
      "Novu routes and normalizes every conversation through one reliable layer, ensuring consistent responses, automatic retries, and a single integration for Slack, WhatsApp, Teams, and more.",
  },
  {
    title: "Full context, every message",
    description:
      "Every message includes the full conversation history and state, so your agent keeps context without rebuilding memory or managing its own session store.",
  },
  {
    title: "Human approval, before it acts",
    description:
      "When an agent needs to refund, provision, deploy, or trigger an MCP tool, Novu brings approval into the same conversation before it acts.",
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
    "Stop building notification centers. Drop in our React/Vue components and start delivering across every channel with a single API call.",
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
          "Novu is open-source communication infrastructure for products and AI agents. Use Novu Notify to orchestrate product notifications across Inbox, email, SMS, push, and chat. Use Novu Connect to bring AI agents into the channels where users already communicate.",
      },
      {
        question:
          "What is the difference between Novu Notify and Novu Connect?",
        answer:
          "Novu Notify handles workflow-driven notifications from your product to your users. Novu Connect handles two-way conversations between AI agents and people. Both use Novu's channel, identity, and delivery infrastructure.",
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
