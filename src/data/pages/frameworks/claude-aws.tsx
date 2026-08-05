import awsIcon from "@/svgs/pages/home/stack/aws.svg"

import type { IAgentFrameworkData } from "@/types/framework"

export const claudeAwsFrameworkData: IAgentFrameworkData = {
  slug: "claude-aws",
  name: "AWS Claude Managed Agent",
  icon: awsIcon,
  connectPath: "managed",
  runtimeFlag: "claude-aws",
  tagline:
    "The same Claude Managed Agent, set up through your AWS credential flow. One CLI command, no agent server.",
  whatItIs:
    "An AWS Claude Managed Agent is the managed setup for teams that run their Claude access through AWS. You complete the AWS credential flow, describe the agent you want, and review the skills and tools Novu adds. Claude handles the reasoning, planning, and tool use. Novu resolves identity and conversation state and delivers every message. There is no repo to scaffold and no bridge to wire.",
  strengths: [
    "No agent server or bridge code to host",
    "Uses your AWS credential flow for Claude access",
    "Claude handles reasoning, planning, and tool use",
    "System prompt, skills, and MCP servers editable in the dashboard",
  ],
  connectIntro:
    "Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, between your AWS Claude Managed Agent and {channelName}. Claude runs the reasoning through your AWS credential flow. Novu maps each user, keeps the conversation state, and delivers every message and reply in {channelName}.",
  steps: [
    {
      title: "Run one command",
      body: "Run npx novu connect --channel {cliSlug} --runtime claude-aws. There is no project to scaffold and no application code to modify. The CLI guides the complete setup.",
    },
    {
      title: "Describe your agent",
      body: "Complete the required AWS credential flow, describe the agent you want to create, and review the skills and tools Novu adds to it.",
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
  faq: [
    {
      question: "How is this different from the standard Claude Managed Agent?",
      answer:
        "The setup is the same guided CLI flow. The difference is the credential step: this runtime uses your AWS credential flow for Claude access instead of direct Anthropic credentials.",
    },
    {
      question: "Does Novu run the agent's reasoning?",
      answer:
        "No. Claude handles the reasoning, planning, and tool use. Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, that resolves identity, keeps conversation state, and delivers messages in {channelName}.",
    },
    {
      question: "Do I need to host anything?",
      answer:
        "No. There is no agent server and no bridge code. The CLI creates the agent, and Novu keeps the conversation running in {channelName}.",
    },
  ],
  docsPath: "/agents/managed-agent/quickstart",
}
