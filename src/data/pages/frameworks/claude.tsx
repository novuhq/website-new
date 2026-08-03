import claudeIcon from "@/svgs/pages/home/stack/claude.svg"

import type { IAgentFrameworkData } from "@/types/framework"

export const claudeFrameworkData: IAgentFrameworkData = {
  slug: "claude",
  name: "Claude Managed Agent",
  icon: claudeIcon,
  connectPath: "managed",
  runtimeFlag: "claude",
  tagline:
    "Claude Managed Agents are hosted agents you create from one CLI command. No agent server, no bridge code.",
  whatItIs:
    "A Claude Managed Agent is an agent you create without hosting any agent code. You bring your Anthropic credentials, describe the agent you want, and review the skills and tools Novu adds. Claude handles the reasoning, planning, and tool use. Novu resolves identity and conversation state and delivers every message. There is no repo to scaffold and no bridge to wire: the guided CLI flow takes you from nothing to a live agent in a channel.",
  strengths: [
    "No agent server or bridge code to host",
    "Claude handles reasoning, planning, and tool use",
    "System prompt, skills, and MCP servers editable in the dashboard",
    "Create it once, connect it to every channel",
  ],
  connectIntro:
    "Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, between your Claude Managed Agent and {channelName}. Claude runs the reasoning with your Anthropic credentials. Novu maps each user, keeps the conversation state, and delivers every message and reply in {channelName}.",
  steps: [
    {
      title: "Run one command",
      body: "Run npx novu connect --channel {cliSlug} --runtime claude. There is no project to scaffold and no application code to modify. The CLI guides the complete setup.",
    },
    {
      title: "Describe your agent",
      body: "Connect your Anthropic credentials, describe the agent you want to create, and review the skills and tools Novu adds to it.",
    },
    {
      title: "Preview and create",
      body: "Preview the generated agent, then create it. The system prompt, skills, and MCP servers stay editable in the Novu dashboard afterward.",
    },
    {
      title: "Connect {channelName}",
      body: "The guided flow connects {channelName}. Your agent now holds a two-way conversation there, and the same agent can reach every other channel from one thread.",
    },
  ],
  promptTemplate:
    "Create a Claude Managed Agent with Novu and connect it to {channelName}. Run this command: npx novu connect --channel {cliSlug} --runtime claude. The Novu CLI will guide you through the complete setup. Follow the prompts to connect your Anthropic credentials, describe the agent you want to create, review the skills and tools Novu adds, preview the agent, create it, and connect {channelName}. You do not need to scaffold a project or modify application code for this setup.",
  faq: [
    {
      question: "Do I need to host anything to put a Claude Managed Agent in {channelName}?",
      answer:
        "No. There is no agent server and no bridge code. You bring Anthropic credentials, Claude does the reasoning, and Novu keeps the conversation running in {channelName}.",
    },
    {
      question: "Does Novu run the agent's reasoning?",
      answer:
        "No. Claude handles the reasoning, planning, and tool use with your Anthropic credentials. Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, that resolves identity, keeps conversation state, and delivers messages in {channelName}.",
    },
    {
      question: "Can I change the agent after I create it?",
      answer:
        "Yes. The system prompt, skills, and MCP servers stay editable in the Novu dashboard, and the same agent can connect to more channels at any time.",
    },
  ],
  docsPath: "/agents/managed-agent/quickstart",
}
