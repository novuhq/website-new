import emailIcon from "@/svgs/pages/connect/channels/email.svg"

import type { IChannelPageData } from "@/types/channel"

export const emailChannelData: IChannelPageData = {
  slug: "email",
  channelName: "Email",
  cliSlug: "email",
  icon: emailIcon,
  seoTitle: "Connect Your AI Agent to Email | Novu Connect",
  seoDescription:
    "Reach users in their inbox with rich, actionable agent notifications. Responsive templates, attachments, and high-deliverability routing. Start with npx novu connect --channel email.",
  hero: {
    eyebrow: "Novu Connect",
    heading: "Connect your AI agent to Email",
    subheading:
      "Reach users directly in their inbox with rich, actionable notifications. Responsive templates, attachments, and high-deliverability routing, connected once and live everywhere.",
  },
  citation:
    "Novu Connect reaches users by email with rich, actionable notifications, responsive templates, attachments, and high-deliverability routing. Connect it with the command npx novu connect --channel email.",
  useCase: {
    company: "Brightledger (a fictional billing and finance SaaS)",
    audience: "a business customer who emailed billing support",
    summary:
      "A customer questions an invoice. The agent finds the proration error, issues a credit via a secure action link after approval, and replies in the thread.",
    transcript: [
      {
        from: "Tomás (customer)",
        role: "customer",
        text: "We were on the Starter plan until the 12th, why is this month's platform fee the full amount?",
      },
      {
        from: "Brightledger Agent",
        role: "agent",
        text: "You're right. You moved to the Growth plan on the 12th, so the first half of the month should be billed at Starter. The correct charge is lower, so you're owed a credit on this invoice.",
      },
      {
        from: "Tomás (customer)",
        role: "customer",
        text: "Approve the credit.",
      },
      {
        from: "System",
        role: "system",
        text: "Approve: issue credit to the invoice via secure action link.",
      },
      {
        from: "Brightledger Agent",
        role: "agent",
        text: "Done. The credit is applied and you'll see it on your next statement. The corrected invoice is attached for your records.",
      },
    ],
  },
  capabilities: [
    "Responsive message templates",
    "Attachments and rich content",
    "High-deliverability routing",
    "Secure action links for approvals",
  ],
  prompt: `Connect this project's AI agent to Email with Novu Connect.

Follow https://novu.co/agents.md end to end. Default to the non-interactive CLI (\`npx novu@latest connect … --ci --channel email\`).

Inspect the repo. Detect the runtime from the project (AI SDK / LangChain / etc.), or ask once. Then run one connect command for Email per agents.md.

Prefer the secure setup links the CLI prints. Do not invent setup steps or ask for secrets in chat unless agents.md requires it for this channel.`,
  onRamp: {
    type: "keyless",
    note: "Email works in the keyless quickstart. Run npx novu connect --channel email to get a managed agent sending email, no account needed for the first few replies.",
  },
  faq: [
    {
      question: "How do I connect my AI agent to Email?",
      answer:
        "Run npx novu connect --channel email, or paste the prompt above into your coding agent. Novu Connect handles templates, delivery, and reply routing so your agent code stays the same.",
    },
    {
      question: "Can the agent handle approvals and actions over email?",
      answer:
        "Yes. Novu Connect supports secure action links, so a customer can approve or act on a request straight from the email, and the result routes back to your agent.",
    },
    {
      question: "Does Novu run the agent's intelligence?",
      answer:
        "No. Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, bridge between your agent and the inbox. You own the agent's intelligence.",
    },
    {
      question: "What can an AI agent do over Email?",
      answer:
        "Email suits async, formal agents: an invoice explainer that breaks down every charge, a payment-recovery agent that fixes failed payments, an order-status agent, and a ticket-tracker agent. Start any of them in one click from the templates on this page.",
    },
    {
      question: "Which other channels can the same agent reach?",
      answer:
        "The same agent can reach users on Slack, Microsoft Teams, WhatsApp, Telegram, Email, and iMessage through Novu Connect, with one conversation thread across channels.",
    },
  ],
  starterTemplateIds: [
    "billing-invoice-explainer",
    "billing-payment-recovery",
    "order-status-agent",
    "ticket-tracker-agent",
  ],
}
