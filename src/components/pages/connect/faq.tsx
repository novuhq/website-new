import type { IFaqSection } from "@/types/common"

import FAQ from "@/components/pages/faq"

const CONNECT_FAQ: IFaqSection = {
  title: "Frequently asked questions",
  accordion: {
    items: [
      {
        question: "What are Claude Managed Agents?",
        answer:
          "Claude Managed Agents are Anthropic’s fully managed infrastructure for building and running autonomous AI agents. You define what the agent should do, the tools it can use, and the guardrails it should follow, while Anthropic handles the managed runtime behind it. Novu Connect then brings that agent into the channels where people already work, such as Slack, WhatsApp, email, Telegram, and Discord.",
      },
      {
        question: "Does Novu manage or host my Claude agent?",
        answer:
          "No. Your agent runs on Claude Managed Agents. Novu Connect provides the communication layer around the agent, so it can listen, respond, and work across channels without you building separate integrations for each one.",
      },
      {
        question: "Can I use a Claude agent I've already built?",
        answer:
          "Yes. During setup you can choose to create a new agent or connect an existing one you've already configured on Anthropic. Your system prompt, tools, and configuration carry over. You don't need to start from scratch.",
      },
      {
        question: "Can I share my agent with my team?",
        answer:
          "Yes. You can start with an agent for your own workflow, test it in the channels you use, and share it with teammates when it is useful. Teams can also create shared agents from the start for internal workflows across tools, MCP servers, and communication channels.",
      },
      {
        question: "How many channels can I connect to a single agent?",
        answer:
          "There's no limit. One agent can be live in Slack, Teams, Discord, WhatsApp, email, and any other supported channel at the same time. It shares the same context and capabilities across all of them.",
      },
    ],
  },
}

function ConnectFaq() {
  return <FAQ {...CONNECT_FAQ} className="pt-28 md:pt-36 lg:pt-44 xl:pt-50" />
}

export default ConnectFaq
