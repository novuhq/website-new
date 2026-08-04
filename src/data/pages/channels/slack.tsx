import slackIcon from "@/svgs/pages/connect/channels/slack.svg"

import type { IChannelPageData } from "@/types/channel"

export const slackChannelData: IChannelPageData = {
  slug: "slack",
  channelName: "Slack",
  cliSlug: "slack",
  icon: slackIcon,
  seoTitle: "Connect Your AI Agent to Slack | Novu Connect",
  seoDescription:
    "Give your AI agent a voice in Slack. Two-way threaded conversations, user identity mapping, and reliable delivery with Novu Connect. Start with npx novu connect --channel slack.",
  hero: {
    eyebrow: "Novu Connect",
    heading: "Connect your AI agent to Slack",
    subheading:
      "Reach teams where work happens with rich, actionable messages, threads, and reliable delivery routing. One agent, built once, holds a real two-way conversation that feels native in Slack.",
  },
  citation:
    "Novu Connect lets an existing AI agent talk to users in Slack with two-way threaded replies, user identity mapping, and reliable delivery. Connect it with the command npx novu connect --channel slack.",
  useCase: {
    company: "Helix (a fictional data-pipeline SaaS)",
    audience:
      "a data engineer at Helix's customer, in a shared Slack Connect channel",
    summary:
      "A nightly sync fails. Helix's agent diagnoses the cause, asks for approval, runs the fix, and confirms, all in the thread.",
    transcript: [
      {
        from: "Maya (customer)",
        role: "customer",
        text: "@Helix Agent our nightly sync to the warehouse didn't land, dashboards are empty this morning.",
      },
      {
        from: "Helix Agent",
        role: "agent",
        text: "Last night's sync failed at 02:14. The warehouse connector token expired, so all 6 nightly jobs were skipped. I can rotate the token and re-run the 6 jobs now.",
      },
      {
        from: "System",
        role: "system",
        text: "Approve: rotate_token { account: customer }, rerun_jobs { scope: nightly, count: 6 }",
      },
      {
        from: "Maya (customer)",
        role: "customer",
        text: "Approve once.",
      },
      {
        from: "Helix Agent",
        role: "agent",
        text: "Done. Token rotated and all 6 jobs re-ran, your dashboards are filling in now. I'll watch tonight's run and flag it here if anything slips.",
      },
    ],
  },
  capabilities: [
    "Two-way threaded conversations",
    "Team and user identity mapping",
    "Reliable delivery with retries",
    "Native Block Kit messages and tool-approval prompts",
  ],
  prompt: `Connect this project's AI agent to Slack with Novu Connect.

Follow https://novu.co/agents.md end to end. Default to the non-interactive CLI (\`npx novu@latest connect … --ci --channel slack\`).

Inspect the repo. Detect the runtime from the project (AI SDK / LangChain / etc.), or ask once. Then run one connect command for Slack per agents.md.

Prefer the secure setup links the CLI prints. Do not invent setup steps or ask for secrets in chat unless agents.md requires it for this channel.`,
  onRamp: {
    type: "keyless",
    note: "Slack works in the keyless quickstart. Run npx novu connect --channel slack and you get a managed agent on Slack, no account needed for the first few replies.",
  },
  faq: [
    {
      question: "How do I connect my AI agent to Slack?",
      answer:
        "Run npx novu connect --channel slack, or paste the prompt above into your coding agent. Novu Connect handles the Slack app, user identity, and two-way message routing so your agent code does not change when you add the channel.",
    },
    {
      question:
        "Can the agent hold a two-way conversation in Slack, not just post alerts?",
      answer:
        "Yes. Novu Connect maps each Slack user to your agent and routes their replies back into the same thread, so the conversation is genuinely two-way with retries on delivery.",
    },
    {
      question: "Does Novu run the agent's intelligence?",
      answer:
        "No. Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, bridge between your agent and the channel. You own the agent's intelligence. We never run your brain, that is the whole point.",
    },
    {
      question: "What can an AI agent do in Slack?",
      answer:
        "Common starter agents in Slack are a support troubleshooter that diagnoses and fixes issues in the thread, an SDK setup agent that gets developers to their first API call, an API reference agent, and a webhook debug agent. Start any of them in one click from the templates on this page.",
    },
    {
      question: "Which other channels can the same agent reach?",
      answer:
        "The same agent can reach users on Slack, Microsoft Teams, WhatsApp, Telegram, and Email through Novu Connect, with one conversation thread across channels.",
    },
  ],
  starterTemplateIds: [
    "support-troubleshooter",
    "sdk-setup-agent",
    "api-reference-agent",
    "webhook-debug-agent",
  ],
}
