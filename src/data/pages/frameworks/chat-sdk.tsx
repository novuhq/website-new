import chatSdkIcon from "@/svgs/pages/home/stack/chat-sdk.svg"

import type { IAgentFrameworkData } from "@/types/framework"

export const chatSdkFrameworkData: IAgentFrameworkData = {
  slug: "chat-sdk",
  name: "Chat SDK",
  icon: chatSdkIcon,
  connectPath: "bridge",
  runtimeFlag: "chat-sdk",
  tagline:
    "Chat SDK is the open-source template for building complete chat apps on Next.js and the AI SDK.",
  whatItIs:
    "Chat SDK gives you a production chat app out of the box: streaming UI, message history, artifacts, and an agent loop built on the AI SDK. You customize the app, wire in your own tools, and keep the reasoning in your codebase. Chat SDK runs the agent inside your product. It does not carry the conversation to your users. That last mile, reaching a person in Slack and routing their reply back to your agent, is what Novu Connect adds.",
  strengths: [
    "A complete chat UI with streaming, history, and artifacts",
    "Built on the AI SDK, with tool calling and structured output",
    "A Next.js app you own, customize, and deploy yourself",
    "Your agent loop stays in your codebase",
  ],
  connectIntro:
    "Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, bridge between your Chat SDK agent and {channelName}. Your agent keeps running in your app. Novu delivers its messages to {channelName}, maps each user, and forwards their replies back to your handler. We never run your agent's reasoning. That is the whole point.",
  steps: [
    {
      title: "Keep your Chat SDK app",
      body: "Your chat app, agent loop, and tools stay in your codebase exactly as they are. Novu Connect wraps the input and output, so your Chat SDK logic does not change when you add {channelName}.",
    },
    {
      title: "Connect the channel",
      body: "Run npx novu connect --channel {cliSlug} --runtime chat-sdk. The CLI scaffolds a bridge route in your app and connects {channelName}. You can also paste the prompt below into your coding agent and let it wire the bridge for you.",
    },
    {
      title: "Wire the bridge handler",
      body: "The CLI prints a requirements file with the bridge route and handler. Point it at your Chat SDK agent so messages from {channelName} reach the same loop that powers your in-app chat, and replies route back to the same conversation.",
    },
    {
      title: "Go live",
      body: "Sign in to keep the agent live, then run your dev server. Your Chat SDK agent now holds a two-way conversation in {channelName}, and the same agent can reach every other channel from one thread.",
    },
  ],
  faq: [
    {
      question: "Do I have to rewrite my Chat SDK app to add {channelName}?",
      answer:
        "No. Novu Connect uses a custom-code bridge. Your Chat SDK app keeps running as it is. Novu forwards messages from {channelName} to your handler and routes replies back, so your agent code stays the same.",
    },
    {
      question: "Does Novu run my Chat SDK agent?",
      answer:
        "No. Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, bridge between your agent and {channelName}. You own the reasoning and the tools. We never run your brain, that is the whole point.",
    },
    {
      question:
        "Do users in {channelName} get the same agent as my in-app chat?",
      answer:
        "Yes. The bridge points at the same agent loop that powers your Chat SDK app, so one agent serves your product and {channelName}, with conversation context kept per user.",
    },
  ],
  docsPath: "/agents/custom-code-agent/frameworks/other",
}
