import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import type { IFaqSection } from "@/types/common"

import {
  escapeMarkdownTableCell,
  formatCodeFence,
  formatMarkdownLink,
} from "../markdown-format"
import { bulletList, faqMarkdown, pageFromSeo } from "../page-utils"
import type { MarkdownPage } from "../types"

const CONNECT_COMMAND = "npx novu connect"
const ACI_PROMPT =
  "Add an agent to my app using instructions from https://novu.co/agents.md"
const CLAUDE_PROMPT_URL = `https://claude.ai/new?q=${encodeURIComponent(
  ACI_PROMPT
)}`
const GITHUB_REPO_URL = "https://github.com/novuhq/novu"
const PRODUCT_HUNT_LAUNCH_URL =
  "https://www.producthunt.com/products/novu/launches/novu-connect"

const ACI_FAQ: IFaqSection = {
  title: "Frequently asked questions",
  accordion: {
    items: [
      {
        question: "What is Agent Communication Infrastructure (ACI)?",
        answer:
          "ACI is the layer between an autonomous agent and the channels where people actually receive messages. Where older software waited for users to open it and notify them one way, agents reach out, follow up, and hold a conversation and ACI is the infrastructure that makes that conversation work across every channel without you building the plumbing yourself.",
      },
      {
        question: "How is ACI different from MCP and A2A?",
        answer:
          "They solve three different connection problems. MCP is how an agent thinks with the world (agent-to-tools), A2A is how agents coordinate with each other (agent-to-agent), and ACI is how an agent reaches the people who care (agent-to-people). Most teams wire up the first two and then spend months hand-building the third. ACI is the standardized layer for that last mile.",
      },
      {
        question: "Does Novu ever see my model, prompts, or data?",
        answer:
          "No. The principle is simple: you own the brain, ACI owns the communication. ACI never sees your prompts, memory, or model. Novu runs only the agent bridge while your model, prompts, tools, business logic, keys, and runtime stay entirely on your side.",
      },
      {
        question: "Can I connect an agent I've already built?",
        answer:
          "Yes. ACI is unopinionated about intelligence. You can bring your own agent built on the Agent SDK, LangChain, a managed Claude agent, or your own server. Connecting it is a single command `npx novu connect` which wires up the SDK with no plumbing for you to maintain.",
      },
      {
        question: "How many channels can one agent talk on?",
        answer:
          "Build the agent once; ACI handles every channel. A single brain answering on Slack also answers on Teams, WhatsApp, Telegram, and Email, with every long-tail channel sitting behind one adapter normalized to a single message shape. Channel availability depends on your plan, and more channels are on the way, including Google Chat, iMessage, Discord, and others.",
      },
      {
        question: "How does ACI relate to Novu Connect and the Novu Platform?",
        answer:
          "ACI is the category; Novu Connect is Novu's implementation of that ACI layer. The broader Novu Platform is the notification infrastructure the company has run for half a decade; channels, identity, and delivery for product notifications. Connect brings that same delivery backbone to agents, and like the rest of Novu, the adapters, identity resolver, and conversation store are open source on GitHub.",
      },
    ],
  },
}

const STOP_REINVENTING_METRICS = [
  ["5+", "channels to build and maintain"],
  ["0%", "of this plumbing makes your agent smarter"],
  ["100%", "undifferentiated heavy lifting"],
] as const

const ACI_CONNECTIONS = [
  {
    label: "MCP",
    from: "Agent",
    to: "Tools",
    description: "How the agent thinks with the world.",
  },
  {
    label: "A2A",
    from: "Agent",
    to: "Agent",
    description: "How agents coordinate with each other.",
  },
  {
    label: "ACI",
    from: "Agent",
    to: "People",
    description: "How the agent reaches the people who care.",
  },
] as const

const COMMUNICATION_FLOW = [
  {
    title: "Communication providers — where humans actually are.",
    description:
      "Slack, WhatsApp, Teams, Telegram, Email — and every long-tail channel behind a single adapter, normalized to one message shape.",
  },
  {
    title: "Agent bridge (ACI) — the only piece we run.",
    description:
      "Stateful, idempotent, traced end-to-end. One brain answering on Slack also answers on Teams, WhatsApp, and Email.",
  },
  {
    title: "Agent Brain — stays on your side.",
    description:
      "Bring your own — Agent SDK, LangChain, a managed Claude agent, or your own server. ACI never sees your prompts, memory, or model.",
  },
] as const

const OWNERSHIP_ROWS = [
  ["Webhook ingestion", "Your model"],
  ["Cross-channel message normalization", "Your prompts"],
  ["Exact thread delivery", "Your tools"],
  ["Conversation persistence & state", "Your business logic"],
  ["Participants identity resolution", "Your keys"],
  ["Agent communication experience", "Your runtime & your code"],
] as const

const FOUNDER_TESTIMONIALS = [
  {
    quote:
      "The real work is everything that makes the conversation feel human. Why we're building ACI, and why we're doing it in the open source",
    authorName: "Dima Grossman",
    authorRole: "Co-founder & CTO, Novu",
    linkLabel: "Read Dima’s essay",
    linkHref: "/blog/the-missing-layer-between-agents-and-people/",
  },
  {
    quote:
      "The hardest part of shipping an AI agent isn't building it. It's getting it in front of the people it works for.",
    authorName: "Tomer Barnea",
    authorRole: "Co-founder, Novu",
    linkLabel: "Read Tomer’s essay",
    linkHref: "/blog/agents-can-think-now-they-can-talk/",
  },
] as const

const FOUNDER_STATS = [
  ["39,8k", "Stars on GitHub"],
  ["412B+", "Messages a month"],
  ["12", "Channels"],
  ["6", "Regions"],
] as const

const MANIFESTO_LINES = [
  "For decades, software waited. It opened when you opened it.",
  "Agents don't wait. They reach out, they follow up, they live where you live.",
  "MCP connects agents to tools. A2A connects agents to each other.",
  "ACI connects agents to people. Novu Connect is the ACI layer.",
] as const

function tableMarkdown(rows: readonly (readonly [string, string])[]) {
  return [
    "| ACI Handles | You Keep |",
    "| --- | --- |",
    ...rows.map(
      ([aci, customer]) =>
        `| ${escapeMarkdownTableCell(aci)} | ${escapeMarkdownTableCell(
          customer
        )} |`
    ),
  ].join("\n")
}

export async function getAci(pathname: string): Promise<MarkdownPage | null> {
  if (pathname !== "/aci") return null

  const body = [
    [
      "The missing agent-user layer",
      "ACI",
      "Agent Communication Infrastructure",
      "Defining the missing agent-to-user communication layer — and the best-practices that come with it. One layer between every app, every channel, and every smart agent.",
      [
        formatMarkdownLink("Read the docs", ROUTE.docsOverview),
        formatMarkdownLink("What is ACI", "#what-is-aci"),
      ]
        .map((item) => `- ${item}`)
        .join("\n"),
      `Prompt for Claude:\n\n${formatCodeFence(ACI_PROMPT, "text")}`,
      `Featured on ${formatMarkdownLink("Product Hunt", PRODUCT_HUNT_LAUNCH_URL)}`,
    ].join("\n\n"),
    [
      "## Notifications → Communication",
      "For decades, products notifed users one way via notifications, that always lacked the correct context, and limited users' ability to perform meaningful interactions with them. Software has changed, now it needs to communicate via conversations.",
    ].join("\n\n"),
    [
      "## Stop re-inventing the wheel",
      "Instead of focusing on building the most capable and intelligent agent, teams spend months to wire and establish communication patterns that have nothing to do with their core value.",
      STOP_REINVENTING_METRICS.map(
        ([value, description]) => `- ${value}: ${description}`
      ).join("\n"),
    ].join("\n\n"),
    [
      "## ACI — Agent Communication Infrastructure",
      "The infrastructure layer between an autonomous agent and the channels where humans actually receive messages. The third leg of the agent triad, alongside MCP and A2A.",
      ACI_CONNECTIONS.map(
        ({ label, from, to, description }) =>
          `### ${label}: ${from} ↔ ${to}\n\n${description}`
      ).join("\n\n"),
    ].join("\n\n"),
    [
      "## You own the brain. ACI owns the communication.",
      "Three columns, one seam. Channels feed ACI, ACI hands a single conversation to your agent, your agent replies on the thread of origin.",
      [
        formatMarkdownLink("Start building", ROUTE.dashboardV2),
        "Talk to the team",
      ]
        .map((item) => `- ${item}`)
        .join("\n"),
    ].join("\n\n"),
    [
      "## Communication flow",
      COMMUNICATION_FLOW.map(
        ({ title, description }) => `### ${title}\n\n${description}`
      ).join("\n\n"),
    ].join("\n\n"),
    [
      "## One command and connect your agent to your customers.",
      "Run it in your terminal or hand the prompt to Claude and let it wire up the SDK for you. Either way, no plumbing to own.",
      formatCodeFence(CONNECT_COMMAND, "bash"),
      formatMarkdownLink("Copy prompt to Claude", CLAUDE_PROMPT_URL),
    ].join("\n\n"),
    [
      "## Opinionated about communication infrastructure. Unopinionated about intelligence.",
      "We solve the delivery problem so you can own the capability problem.",
      tableMarkdown(OWNERSHIP_ROWS),
    ].join("\n\n"),
    [
      "## We've been the notification layer for half a decade.",
      "Channels, identity, and delivery — we built the infrastructure so you don't have to. ACI brings it to agents. Hear from the founders.",
      FOUNDER_TESTIMONIALS.map((testimonial) =>
        [
          `### ${testimonial.authorName}`,
          `> ${testimonial.quote}`,
          `${testimonial.authorRole}`,
          formatMarkdownLink(testimonial.linkLabel, testimonial.linkHref),
        ].join("\n\n")
      ).join("\n\n"),
      FOUNDER_STATS.map(([value, label]) => `- ${value}: ${label}`).join("\n"),
    ].join("\n\n"),
    [
      "## Built in the open. Send a PR, file an issue, ship a channel.",
      "ACI are open source. Contribute what missing, review the code, run it by yourself. The adapters, the identity resolver, the conversation store — all on GitHub. If there's a channel we don't speak yet, you can teach us.",
      [
        formatMarkdownLink("Star us on GitHub", GITHUB_REPO_URL),
        formatMarkdownLink("Contribute", ROUTE.githubIssues),
        formatMarkdownLink("github.com/novuhq/novu", GITHUB_REPO_URL),
      ]
        .map((item) => `- ${item}`)
        .join("\n"),
    ].join("\n\n"),
    [
      "## Manifesto",
      bulletList([...MANIFESTO_LINES]),
      "Share the manifesto on x.com",
    ].join("\n\n"),
    faqMarkdown(ACI_FAQ),
    [
      "## Give your agent a voice everywhere your users are",
      "Build the agent once. ACI handles the rest.",
      [
        formatMarkdownLink("Start building", ROUTE.dashboardV2),
        "Talk to the team",
      ]
        .map((item) => `- ${item}`)
        .join("\n"),
    ].join("\n\n"),
  ].join("\n\n")

  return pageFromSeo(SEO_DATA.aci, body)
}
