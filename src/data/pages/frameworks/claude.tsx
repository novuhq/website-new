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
  promptTemplate: `Connect a Claude Managed Agent to {channelName} with Novu Connect.

Follow https://novu.co/agents.md end to end (managed agent path). Default to the non-interactive CLI (\`--ci\`).

Infer a short agent description from the project, confirm it with me once, then prefer a connect command shaped like:

export NOVU_AGENT_DESCRIPTION='…'
npx novu@latest connect "$NOVU_AGENT_DESCRIPTION" --ci --keyless --channel {cliSlug} --runtime claude

(Omit --keyless if I am already signed in to the Novu dashboard. Never combine --keyless with --channel teams; follow agents.md.)

Prefer the secure setup links the CLI prints. Do not invent setup steps or ask for secrets in chat unless agents.md requires it.`,
  faq: [
    {
      question:
        "Do I need to host anything to put a Claude Managed Agent in {channelName}?",
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
