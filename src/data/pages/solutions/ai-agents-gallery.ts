// Agent gallery for /solutions/ai-agents: runnable example agents (templates).
// Each card is a recognizable scenario on one channel, with a one-click action
// (the scoped coding-agent prompt) and the exact command. The scenarios mirror
// the demo conversations already approved for the channel pages. No real
// customer names.

export interface IAgentGalleryCard {
  /** Channel key, matches the ChannelIcon channel prop (cliSlug). */
  channel: string
  channelLabel: string
  scenario: string
  description: string
  /** Scoped coding-agent prompt (the agents.md on-ramp), the card's action. */
  prompt: string
  /** The exact command this agent starts from. */
  command: string
}

export const AGENT_GALLERY_TITLE = "Or start from a ready-made agent"

export const AGENT_GALLERY_DESCRIPTION =
  "Real agent patterns running on Novu Connect today. Find the one closest to yours, copy the prompt into your coding agent, and it wires the same thing for you."

export const AGENT_GALLERY_CARDS: IAgentGalleryCard[] = [
  {
    channel: "slack",
    channelLabel: "Slack",
    scenario: "Support troubleshooter",
    description:
      "Diagnoses a failing job in the thread, asks for approval, runs the fix, and confirms. The pattern for a product support agent.",
    prompt:
      "Add a support troubleshooter agent to my app on Slack with Novu, with threaded replies and a human approval step. https://novu.co/agents.md",
    command: "npx novu connect --channel slack",
  },
  {
    channel: "whatsapp",
    channelLabel: "WhatsApp",
    scenario: "Order and delivery agent",
    description:
      "Lets a customer reschedule or reroute an order in a few taps, over WhatsApp, with delivery receipts. The pattern for a consumer-facing agent.",
    prompt:
      "Add an order and delivery agent to my app on WhatsApp with Novu, with two-way replies and delivery receipts. https://novu.co/agents.md",
    command: "npx novu connect --channel whatsapp",
  },
  {
    channel: "email",
    channelLabel: "Email",
    scenario: "Finance approval agent",
    description:
      "Answers invoice questions and issues credits over email, behind a human approval. The pattern for a finance or billing agent.",
    prompt:
      "Add a finance agent to my app on email with Novu, that explains charges and issues credits behind a human approval. https://novu.co/agents.md",
    command: "npx novu connect --channel email",
  },
  {
    channel: "telegram",
    channelLabel: "Telegram",
    scenario: "Usage and billing agent",
    description:
      "Answers usage and billing questions in Telegram and upgrades a plan on request. The pattern for a developer-facing API agent.",
    prompt:
      "Add a usage and billing agent to my app on Telegram with Novu, showing real limits and handling plan upgrades. https://novu.co/agents.md",
    command: "npx novu connect --channel telegram",
  },
  {
    channel: "teams",
    channelLabel: "Microsoft Teams",
    scenario: "IT access agent",
    description:
      "Provisions access for client admins in Microsoft Teams with the approvals enterprises require. The pattern for an internal or B2B agent.",
    prompt:
      "Add an IT access agent to my app on Microsoft Teams with Novu, with a human approval workflow for access requests. https://novu.co/agents.md",
    command: "npx novu connect --channel teams",
  },
  {
    channel: "slack",
    channelLabel: "Slack",
    scenario: "SDK setup agent",
    description:
      "Walks a developer to their first successful API call, in Slack. The pattern for a developer-onboarding agent.",
    prompt:
      "Add an SDK setup agent to my app on Slack with Novu, that walks a developer to their first API call. https://novu.co/agents.md",
    command: "npx novu connect --channel slack",
  },
]
