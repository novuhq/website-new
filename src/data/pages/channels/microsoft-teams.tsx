import teamsIcon from "@/svgs/pages/connect/channels/teams.png"

import type { IChannelPageData } from "@/types/channel"

export const microsoftTeamsChannelData: IChannelPageData = {
  slug: "microsoft-teams",
  channelName: "Microsoft Teams",
  cliSlug: "teams",
  icon: teamsIcon,
  seoTitle: "Connect Your AI Agent to Microsoft Teams | Novu Connect",
  seoDescription:
    "Bring your AI agent into Microsoft Teams with channel and thread awareness, human handoff workflows, and reliable delivery. Connect it from the Novu dashboard.",
  hero: {
    eyebrow: "Novu Connect",
    heading: "Connect your AI agent to Microsoft Teams",
    subheading:
      "Bring agent updates and human handoffs into the channels your organization already uses. Approval-shaped, enterprise-native, connected once and live everywhere.",
  },
  citation:
    "Novu Connect brings an existing AI agent into Microsoft Teams with channel and thread awareness, human handoff workflows, and reliable delivery. Teams connects from the Novu dashboard with authentication.",
  useCase: {
    company: "Vesta (a fictional enterprise IT and security vendor)",
    audience: "an IT admin at Vesta's client, in an external Teams chat",
    summary:
      "A client needs access for new analysts. The agent checks the seat pool, grants roles with MFA after approval, and confirms.",
    transcript: [
      {
        from: "Dana (client IT)",
        role: "customer",
        text: "We onboarded 3 analysts today, they need access to the Vesta compliance dashboard.",
      },
      {
        from: "Vesta Agent",
        role: "agent",
        text: "You have 5 seats free. I can grant the 3 analysts the Compliance Viewer role and send each of them a setup link.",
      },
      {
        from: "Dana (client IT)",
        role: "customer",
        text: "Grant, and require MFA.",
      },
      {
        from: "System",
        role: "system",
        text: "Approve: assign_role { role: compliance_viewer, users: 3, mfa: required }",
      },
      {
        from: "Vesta Agent",
        role: "agent",
        text: "Done. All 3 analysts have Compliance Viewer access with MFA required, and their setup links are on the way. Seat pool now shows 2 free.",
      },
    ],
  },
  capabilities: [
    "Channel and thread awareness",
    "Human handoff workflows",
    "Reliable team notifications",
    "Native Adaptive Cards and approval prompts",
  ],
  prompt:
    "Connect my AI agent to Microsoft Teams with Novu and include a human handoff workflow. Keep channel and thread context, and route replies back to the same conversation.",
  onRamp: {
    type: "oauth",
    note: "Microsoft Teams connects from the Novu dashboard. Authenticate your workspace once, and Novu Connect manages delivery, identity, and two-way routing after that.",
  },
  faq: [
    {
      question: "How do I connect my AI agent to Microsoft Teams?",
      answer:
        "Connect Microsoft Teams from the Novu dashboard. Authenticate your workspace once, and Novu Connect handles the app, identity, and two-way routing so your agent code does not change.",
    },
    {
      question: "Can the agent do approvals and human handoffs in Teams?",
      answer:
        "Yes. Novu Connect renders native Adaptive Cards and approval prompts, and supports human handoff workflows so a person can step in when needed.",
    },
    {
      question:
        "Why does Teams connect from the dashboard and not the keyless command?",
      answer:
        "Microsoft Teams needs an authenticated workspace, so it connects through the Novu dashboard rather than the keyless npx novu connect flow that Slack, Telegram, and Email use.",
    },
    {
      question: "What can an AI agent do in Microsoft Teams?",
      answer:
        "Teams suits internal and enterprise agents: an API reference agent, a webhook debug agent, a support troubleshooter for the IT helpdesk, and a welcome-guide agent that walks new hires through setup. Start any of them in one click from the templates on this page.",
    },
    {
      question: "Which other channels can the same agent reach?",
      answer:
        "The same agent can reach users on Slack, Microsoft Teams, WhatsApp, Telegram, Email, and iMessage through Novu Connect, with one conversation thread across channels.",
    },
  ],
  starterTemplateIds: [
    "api-reference-agent",
    "webhook-debug-agent",
    "support-troubleshooter",
    "onboarding-welcome-guide",
  ],
}
