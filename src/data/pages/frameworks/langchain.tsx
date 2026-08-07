import langChainIcon from "@/svgs/pages/home/stack/lang-chain.svg"

import type { IAgentFrameworkData } from "@/types/framework"

export const langchainFrameworkData: IAgentFrameworkData = {
  slug: "langchain",
  name: "LangChain",
  icon: langChainIcon,
  connectPath: "bridge",
  runtimeFlag: "langchain",
  tagline:
    "LangChain is the open-source framework for building agents and LLM apps in Python and JavaScript.",
  whatItIs:
    "LangChain gives developers the building blocks for agents: models, tools, memory, and control flow. You compose chains and agents, wire in your own tools, and keep the reasoning in your codebase. LangChain runs the agent. It does not carry the conversation to your users. That last mile, reaching a person in Slack and routing their reply back to your agent, is what Novu Connect adds.",
  strengths: [
    "Tool calling and structured output for real agent actions",
    "Memory and retrieval for context across a conversation",
    "Runs in Python or JavaScript, in your own app",
    "A large ecosystem of integrations you already use",
  ],
  connectIntro:
    "Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, bridge between your LangChain agent and {channelName}. Your agent keeps running in your app. Novu delivers its messages to {channelName}, maps each user, and forwards their replies back to your handler. We never run your agent's reasoning. That is the whole point.",
  steps: [
    {
      title: "Keep your LangChain agent",
      body: "Your agent, tools, and memory stay in your codebase exactly as they are. Novu Connect wraps the input and output, so your LangChain logic does not change when you add {channelName}.",
    },
    {
      title: "Connect the channel",
      body: "Run npx novu connect --channel {cliSlug} --runtime langchain. The CLI scaffolds a bridge route in your app and connects {channelName}. You can also paste the prompt below into your coding agent and let it wire the bridge for you.",
    },
    {
      title: "Wire the bridge handler",
      body: "The CLI prints a requirements file with the bridge route and handler. Point it at your LangChain agent so messages from {channelName} reach your agent and its replies route back to the same conversation.",
    },
    {
      title: "Go live",
      body: "Sign in to keep the agent live, then run your dev server. Your LangChain agent now holds a two-way conversation in {channelName}, and the same agent can reach every other channel from one thread.",
    },
  ],
  faq: [
    {
      question: "Do I have to rewrite my LangChain agent to add {channelName}?",
      answer:
        "No. Novu Connect uses a custom-code bridge. Your LangChain agent keeps running in your app. Novu forwards messages from {channelName} to your handler and routes replies back, so your agent code stays the same.",
    },
    {
      question: "Does Novu run my LangChain agent?",
      answer:
        "No. Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, bridge between your agent and {channelName}. You own the reasoning and the tools. We never run your brain, that is the whole point.",
    },
    {
      question: "Is the conversation two-way, or just outbound messages?",
      answer:
        "Two-way. Novu Connect maps each {channelName} user to your LangChain agent and forwards their replies back into the same conversation, with retries on delivery.",
    },
  ],
  docsPath: "/agents/custom-code-agent/frameworks/langchain",
}
