import customCodeIcon from "@/svgs/pages/home/stack/custom-code.svg"

import type { IAgentFrameworkData } from "@/types/framework"

export const customCodeFrameworkData: IAgentFrameworkData = {
  slug: "custom-code",
  name: "Custom code",
  icon: customCodeIcon,
  connectPath: "bridge",
  runtimeFlag: "custom-code",
  tagline:
    "No framework required. Connect the agent loop you already wrote to every channel your users are on.",
  whatItIs:
    "Custom code means the agent is fully yours: your own loop, your own model calls, your own tools, no framework in between. Novu does not care how your agent thinks. The bridge hands your handler each incoming message with its conversation context, and whatever your handler returns goes back to the user. That last mile, reaching a person in Slack and routing their reply back to your agent, is what Novu Connect adds.",
  strengths: [
    "Any model provider and any agent loop you already run",
    "A plain handler: message in, reply out",
    "Conversation context and user identity handled for you",
    "No framework dependency to adopt",
  ],
  connectIntro:
    "Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, bridge between your custom agent and {channelName}. Your agent keeps running in your app. Novu delivers its messages to {channelName}, maps each user, and forwards their replies back to your handler. We never run your agent's reasoning. That is the whole point.",
  steps: [
    {
      title: "Keep your agent",
      body: "Your loop, model calls, and tools stay in your codebase exactly as they are. Novu Connect wraps the input and output, so your agent code does not change when you add {channelName}.",
    },
    {
      title: "Connect the channel",
      body: "Run npx novu connect --channel {cliSlug} --runtime custom-code. The CLI scaffolds a bridge route in your app and connects {channelName}. You can also paste the prompt below into your coding agent and let it wire the bridge for you.",
    },
    {
      title: "Wire the bridge handler",
      body: "The CLI prints a requirements file with the bridge route and handler. Point the handler at your agent: it receives each {channelName} message with conversation context, and whatever it returns routes back to the same conversation.",
    },
    {
      title: "Go live",
      body: "Sign in to keep the agent live, then run your dev server. Your agent now holds a two-way conversation in {channelName}, and the same agent can reach every other channel from one thread.",
    },
  ],
  promptTemplate:
    "Connect this project's custom code agent to {channelName} with Novu Connect. Inspect the repo to find the agent entry point, then have me run npx novu connect --channel {cliSlug} --runtime custom-code from the project root. I will complete the interactive CLI. When the CLI copies a follow-up prompt, ask me to paste it here and continue. Do not invent setup steps or ask for secrets in chat. Stop after giving me the command.",
  faq: [
    {
      question: "My agent uses no framework at all. Does that work with {channelName}?",
      answer:
        "Yes. That is what the custom-code runtime is for. The bridge is a plain handler: Novu passes in each {channelName} message with its conversation context, and whatever you return goes back to the user.",
    },
    {
      question: "Does Novu run my agent?",
      answer:
        "No. Novu Connect is the communication layer, the ACI, Agent Communication Infrastructure, bridge between your agent and {channelName}. You own the reasoning and the tools. We never run your brain, that is the whole point.",
    },
    {
      question: "Can I switch model providers later?",
      answer:
        "Yes. Novu only carries the conversation to and from {channelName}. What happens inside your handler, including which model you call, is entirely up to you and can change at any time.",
    },
  ],
  docsPath: "/agents/custom-code-agent/quickstart",
}
