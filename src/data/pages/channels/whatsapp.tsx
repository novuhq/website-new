import whatsappIcon from "@/svgs/pages/connect/channels/whatsapp.svg"

import type { IChannelPageData } from "@/types/channel"

export const whatsappChannelData: IChannelPageData = {
  slug: "whatsapp",
  channelName: "WhatsApp",
  cliSlug: "whatsapp",
  icon: whatsappIcon,
  seoTitle: "Connect Your AI Agent to WhatsApp | Novu Connect",
  seoDescription:
    "Put your AI agent on WhatsApp with secure two-way conversations, approved templates, and delivery receipts. Novu is an official Meta Business Partner, so you can be working in 5 minutes.",
  hero: {
    eyebrow: "Novu Connect",
    heading: "Connect your AI agent to WhatsApp",
    subheading:
      "Start secure two-way customer conversations with templates, attachments, and delivery receipts. Novu is an official Meta Business Partner, so WhatsApp is working in 5 minutes with embedded signup.",
  },
  citation:
    "Novu Connect puts an existing AI agent on WhatsApp with secure two-way conversations, approved message templates, and delivery receipts. Novu is an official Meta Business Partner, so WhatsApp is working in about 5 minutes.",
  useCase: {
    company: "Fernweh (a fictional travel-gear brand)",
    audience: "a shopper on their phone",
    summary:
      "A shopper asks where their order is. The agent finds the delay, offers options with quick replies, reroutes to a pickup point, and confirms.",
    transcript: [
      {
        from: "Ravi (shopper)",
        role: "customer",
        text: "Hey, where's my order? It was supposed to arrive today.",
      },
      {
        from: "Fernweh Agent",
        role: "agent",
        text: "Hi Ravi. Your order is out for delivery, but the courier hit a delay and now shows tomorrow by 6pm. Want me to keep it for tomorrow, or reroute it to a pickup point near you?",
      },
      {
        from: "Ravi (shopper)",
        role: "customer",
        text: "Find a pickup point.",
      },
      {
        from: "Fernweh Agent",
        role: "agent",
        text: "There's a pickup point 400m from your address, open till 9pm. Reroute it there?",
      },
      {
        from: "Ravi (shopper)",
        role: "customer",
        text: "Yes, reroute.",
      },
      {
        from: "Fernweh Agent",
        role: "agent",
        text: "Done. Your order is heading to the pickup point, ready after 2pm tomorrow. I'll text you the code when it's there.",
      },
    ],
  },
  capabilities: [
    "Secure two-way conversations",
    "Approved message templates",
    "Attachments and delivery receipts",
    "Embedded WhatsApp Business signup (official Meta Business Partner)",
  ],
  prompt: `Connect this project's AI agent to WhatsApp with Novu Connect.

Follow https://novu.co/agents.md end to end. Default to the non-interactive CLI (\`npx novu@latest connect … --ci --channel whatsapp\`).

Inspect the repo. Detect the runtime from the project (AI SDK / LangChain / etc.), or ask once. Then run one connect command for WhatsApp per agents.md.

Prefer the secure setup links the CLI prints. Do not invent setup steps or ask for secrets in chat unless agents.md requires it for this channel.`,
  onRamp: {
    type: "oauth",
    note: "WhatsApp connects from the Novu dashboard with embedded signup: log in with your business account, pick your WhatsApp number, and you are working in about 5 minutes.",
  },
  faq: [
    {
      question: "How do I connect my AI agent to WhatsApp?",
      answer:
        "Connect WhatsApp from the Novu dashboard. Novu is an official Meta Business Partner, so the embedded signup lets you pick your business number and go live in about 5 minutes, then your agent talks to users through Novu Connect.",
    },
    {
      question: "Do I need my own WhatsApp Business account?",
      answer:
        "Yes. WhatsApp requires a verified business account through Meta. Novu Connect handles the connection with embedded signup, so you log in once and Novu manages templates, delivery, and two-way routing after that.",
    },
    {
      question:
        "Why does WhatsApp connect from the dashboard and not the keyless command?",
      answer:
        "WhatsApp needs a verified business identity, so it connects through dashboard authentication rather than the keyless npx novu connect flow that Slack, Telegram, and Email use.",
    },
    {
      question: "What can an AI agent do on WhatsApp?",
      answer:
        "Common starter agents on WhatsApp are an order-status agent with live tracking, a restock-alert agent, a returns and refunds agent, and a knowledge-base agent that answers product questions. Start any of them in one click from the templates on this page.",
    },
    {
      question: "Which other channels can the same agent reach?",
      answer:
        "The same agent can reach users on Slack, Microsoft Teams, WhatsApp, Telegram, and Email through Novu Connect, with one conversation thread across channels.",
    },
  ],
  starterTemplateIds: [
    "order-status-agent",
    "restock-alert-agent",
    "ecommerce-returns-refunds",
    "support-knowledge-base",
  ],
}
