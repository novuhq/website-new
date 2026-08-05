import imessageIcon from "@/svgs/pages/connect/channels/imessage.svg"

import type { IChannelPageData } from "@/types/channel"

export const imessageChannelData: IChannelPageData = {
  slug: "imessage",
  channelName: "iMessage",
  cliSlug: "sendblue",
  icon: imessageIcon,
  seoTitle: "Connect Your AI Agent to iMessage | Novu Connect",
  seoDescription:
    "Put your AI agent on iMessage with full conversation history, live typing indicators, and reply-based approvals. Start with npx novu connect --channel sendblue.",
  hero: {
    eyebrow: "Novu Connect",
    heading: "Connect your AI agent to iMessage",
    subheading:
      "Give customers a familiar way to reach your agent through the Messages app they already use every day. Two-way conversations with typing indicators and threaded replies, connected once and live everywhere.",
  },
  citation:
    "Novu Connect puts an existing AI agent on iMessage through Sendblue, with full conversation history, live typing indicators, and reply-based approvals. Connect it with the command npx novu connect --channel sendblue.",
  useCase: {
    company: "Alma Pharmacy (a fictional pharmacy chain)",
    audience: "a patient managing a prescription",
    summary:
      "A patient asks about a pickup. The agent confirms it, moves it to a closer location after approval, and offers a refill reminder.",
    transcript: [
      {
        from: "Dana (patient)",
        role: "customer",
        text: "Is my prescription ready for pickup?",
      },
      {
        from: "Alma Agent",
        role: "agent",
        text: "Yes! It's ready at the Main St location, open until 8 PM today.",
      },
      {
        from: "Dana (patient)",
        role: "customer",
        text: "Can you move it to the Oak Ave location? I'm near there now.",
      },
      {
        from: "System",
        role: "system",
        text: "Approve: transfer this pickup to the Oak Ave location.",
      },
      {
        from: "Alma Agent",
        role: "agent",
        text: "Done. Oak Ave will have it ready in about 20 minutes, open until 9 PM. Want a reminder here when your next refill is due?",
      },
    ],
  },
  capabilities: [
    "Full conversation history",
    "Conversation-level threaded replies",
    "Live typing indicators",
    "Reply-based action and MCP approvals",
  ],
  prompt:
    "Connect my AI agent to iMessage with Novu using instructions from https://novu.co/agents.md",
  onRamp: {
    type: "oauth",
    note: "iMessage connects through Sendblue. Run npx novu connect --channel sendblue, enter your Sendblue credentials in the CLI, and reply to the test iMessage to go live.",
  },
  faq: [
    {
      question: "How do I connect my AI agent to iMessage?",
      answer:
        "Run npx novu connect --channel sendblue, or paste the prompt above into your coding agent. You enter your Sendblue credentials in the CLI, and Novu Connect handles user identity and two-way routing so your agent code stays the same.",
    },
    {
      question: "How does iMessage delivery work?",
      answer:
        "Through Sendblue. Your users message a number from the Messages app, Novu routes each message to your agent with its conversation history, and replies come back into the same thread with live typing indicators.",
    },
    {
      question: "Does Novu run the agent's intelligence?",
      answer:
        "No. Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, bridge between your agent and iMessage. You own the agent's intelligence.",
    },
    {
      question: "What can an AI agent do on iMessage?",
      answer:
        "iMessage suits direct customer conversations: order status and delivery updates, appointment and pickup coordination, support with a durable thread, and approvals the user confirms by replying. Start any of them in one click from the templates on this page.",
    },
    {
      question: "Which other channels can the same agent reach?",
      answer:
        "The same agent can reach users on Slack, Microsoft Teams, WhatsApp, Telegram, Email, and iMessage through Novu Connect, with one conversation thread across channels.",
    },
  ],
  starterTemplateIds: [
    "order-status-agent",
    "restock-alert-agent",
    "ecommerce-returns-refunds",
    "support-knowledge-base",
  ],
}
