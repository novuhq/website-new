import aiSdkIcon from "@/svgs/pages/home/stack/vercel-ai-sdk.svg"

import type { IAgentFrameworkData } from "@/types/framework"

export const aiSdkFrameworkData: IAgentFrameworkData = {
  slug: "ai-sdk",
  name: "Vercel AI SDK",
  icon: aiSdkIcon,
  connectPath: "bridge",
  runtimeFlag: "ai-sdk",
  tagline:
    "The Vercel AI SDK is the open-source TypeScript toolkit for building agents and AI apps on any model provider.",
  whatItIs:
    "The Vercel AI SDK gives developers one TypeScript API for agents: generateText and streamText, tool calling, structured output, and a provider layer for OpenAI, Anthropic, Google, Groq, and more. You write the agent loop in your own app and swap models without rewriting it. The AI SDK runs the agent. It does not carry the conversation to your users. That last mile, reaching a person in Slack and routing their reply back to your agent, is what Novu Connect adds.",
  strengths: [
    "One TypeScript API across OpenAI, Anthropic, Google, Groq, and more",
    "Tool calling and structured output for real agent actions",
    "generateText for full replies, streamText for streaming ones",
    "Runs anywhere JavaScript runs, from Next.js to plain Node",
  ],
  connectIntro:
    "Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, bridge between your AI SDK agent and {channelName}. Your agent keeps running in your app. Novu delivers its messages to {channelName}, maps each user, and forwards their replies back to your handler. We never run your agent's reasoning. That is the whole point.",
  steps: [
    {
      title: "Keep your AI SDK agent",
      body: "Your agent loop, tools, and prompts stay in your codebase exactly as they are. Novu Connect wraps the input and output, so your AI SDK logic does not change when you add {channelName}.",
    },
    {
      title: "Connect the channel",
      body: "Run npx novu connect --channel {cliSlug} --runtime ai-sdk. The CLI scaffolds a bridge route in your app and connects {channelName}. You can also paste the prompt below into your coding agent and let it wire the bridge for you.",
    },
    {
      title: "Wire the bridge handler",
      body: "The CLI prints a requirements file with the bridge route and handler. Return your generateText or streamText result from the handler, and use toModelMessages to pass the {channelName} conversation history to your model.",
    },
    {
      title: "Go live",
      body: "Sign in to keep the agent live, then run your dev server. Your AI SDK agent now holds a two-way conversation in {channelName}, and the same agent can reach every other channel from one thread.",
    },
  ],
  faq: [
    {
      question: "Do I have to rewrite my AI SDK agent to add {channelName}?",
      answer:
        "No. Novu Connect uses a custom-code bridge. Your AI SDK agent keeps running in your app. Novu forwards messages from {channelName} to your handler and routes replies back, so your agent code stays the same.",
    },
    {
      question: "Does Novu run my AI SDK agent?",
      answer:
        "No. Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, bridge between your agent and {channelName}. You own the reasoning and the tools. We never run your brain, that is the whole point.",
    },
    {
      question: "Can I keep using streamText and my model provider?",
      answer:
        "Yes. The bridge handler accepts the results your AI SDK code already produces, including streaming ones, and you can swap model providers at any time. Novu only carries the conversation to and from {channelName}.",
    },
  ],
  docsPath: "/agents/custom-code-agent/frameworks/ai-sdk",
}
