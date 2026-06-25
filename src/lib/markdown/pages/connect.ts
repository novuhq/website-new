import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import { getAgentTemplatesSection } from "@/lib/templates"
import { CONNECT_FAQ } from "@/components/pages/connect/faq-data"

import {
  escapeMarkdownText,
  formatCodeFence,
  formatMarkdownLink,
} from "../markdown-format"
import { bulletList, faqMarkdown, linkList, pageFromSeo } from "../page-utils"
import type { MarkdownPage } from "../types"
import { absoluteUrl, toCanonicalPathname } from "../url"

const CONNECT_COMMAND = "npx novu connect"
const CONNECT_PROMPT = "Add an agent to my app https://novu.co/agents.md"
const PRODUCT_HUNT_LAUNCH_URL =
  "https://www.producthunt.com/products/novu/launches/novu-connect"

const CHANNELS = [
  { name: "Slack", description: "Send team alerts" },
  { name: "WhatsApp", description: "Reach users fast" },
  { name: "Email", description: "Deliver clean digests" },
  { name: "Telegram", description: "Push instant updates" },
  { name: "Teams", description: "Notify team channels" },
  { name: "Google Chat", state: "Coming soon" },
  { name: "iMessage", state: "Coming soon" },
  { name: "Linear", state: "Coming soon" },
  { name: "Zoom", state: "Coming soon" },
  { name: "Discord", state: "Coming soon" },
  { name: "Messenger", state: "Coming soon" },
  { name: "GitHub", state: "Coming soon" },
] as const

const HOW_IT_WORKS_STEPS = [
  {
    title: "Start from a template, or bring your own",
    description:
      "Pick a pre-built agent template with prompts, tools, and skills already wired up, or point Novu Connect at the Claude Managed Agent you have already built.",
  },
  {
    title: "Keep your tools and skills",
    description:
      "Connect the sources your agent relies on, from docs and code to MCP tools and product data, so it can work with real context.",
  },
  {
    title: "Show up where work happens",
    description:
      "Bring the same agent into the tools your team already uses, so it can answer questions, move work forward, and stay visible in one place.",
  },
] as const

const CLI_TERMINAL_COPY = [
  "Welcome to Novu Connect",
  "Spin up an AI SDK Agent and connect it to Slack, Telegram, MS Team and more — all from your terminal",
  "Press Enter to sign in or create an account →",
  "System prompt",
  "You are a Pull Request review agent focused on analyzing code changes, identifying risks, and producing concise, actionable review output for...",
] as const

const COMPLIANCE_ITEMS = [
  "SOC2 Type II",
  "HIPAA",
  "ISO 27001:2013",
  "GDPR",
] as const

const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0/month",
    cta: "Sign up for free",
    features: [
      "100 active conversations",
      "2 agents",
      "2 channels",
      "Powered by Novu branding",
    ],
  },
  {
    name: "Pro",
    price: "$30/month",
    cta: "Get started",
    featured: true,
    features: [
      "1,000 active conversations",
      "5 agents",
      "5 channels",
      "$0.02 / extra conversation",
      "Remove Novu branding",
    ],
  },
  {
    name: "Team",
    price: "$250/month",
    cta: "Get started",
    features: [
      "5,000 active conversations",
      "10 agents",
      "10 channels",
      "$0.015 / extra conversation",
      "Custom email domain",
    ],
  },
] as const

const ENTERPRISE_PLAN = {
  name: "Enterprise",
  description:
    "For complex workflows: custom volume, compliance controls, dedicated support, and flexible hosting.",
  cta: "Contact us",
  features: [
    "Unlimited agents & channels",
    "Custom volume",
    "HIPAA BAA, SSO/SCIM",
    "Audit logs and dedicated support",
  ],
} as const

function rawText(value: unknown) {
  return typeof value === "string" ? value : ""
}

function markdownText(value: unknown) {
  const text = rawText(value)
  return text ? escapeMarkdownText(text) : ""
}

function templateUrl(templateId: string) {
  const url = new URL(String(ROUTE.connectApp))
  url.searchParams.set("agentTemplateId", templateId)
  return url.toString()
}

function namedItems(
  items: Array<{ name?: string | null } | null> | null | undefined
) {
  return (items ?? []).map((item) => rawText(item?.name)).filter(Boolean)
}

function inlineList(items: unknown[] | null | undefined) {
  return (items ?? [])
    .map(rawText)
    .filter(Boolean)
    .map(escapeMarkdownText)
    .join(", ")
}

function templateDetailsMarkdown(
  templates: Awaited<ReturnType<typeof getAgentTemplatesSection>>["templates"]
) {
  if (!templates.length) return ""

  return templates
    .map((template) => {
      const templateId = rawText(template.id)
      const templateName =
        rawText(template.name) ||
        rawText(template.agentName) ||
        "Agent template"
      const details = [
        template.category?.title
          ? `Category: ${markdownText(template.category.title)}`
          : "",
        template.agentName ? `Agent: ${markdownText(template.agentName)}` : "",
        markdownText(template.summary),
        namedItems(template.mcpServerList).length
          ? `MCP connectors: ${inlineList(namedItems(template.mcpServerList))}`
          : "",
        namedItems(template.channels).length
          ? `Channels: ${inlineList(namedItems(template.channels))}`
          : "",
        template.skillsList?.length
          ? `Skills: ${inlineList(template.skillsList)}`
          : "",
        template.tools?.length
          ? `Tools: ${inlineList(namedItems(template.tools))}`
          : "",
        templateId
          ? formatMarkdownLink("Use template", templateUrl(templateId))
          : "",
      ]
        .filter(Boolean)
        .join("\n\n")

      return `### ${escapeMarkdownText(templateName)}\n\n${details}`
    })
    .join("\n\n")
}

function channelMarkdown() {
  return CHANNELS.map((channel) => {
    const status =
      "state" in channel && channel.state ? ` (${channel.state})` : ""
    const description =
      "description" in channel && channel.description
        ? `: ${channel.description}`
        : ""

    return `${channel.name}${status}${description}`
  })
}

export async function getConnect(
  pathname: string
): Promise<MarkdownPage | null> {
  if (pathname !== "/connect") return null

  const templatesSection = await getAgentTemplatesSection(false)
  const templates = templatesSection.templates
  const templateCategories = templatesSection.categories
    .filter((category) =>
      templates.some((template) => template.category?.id === category.id)
    )
    .map((category) => rawText(category.title))
    .filter(Boolean)

  const body = [
    [
      "Novu connect",
      "Connect your Claude agent where your customers actually work",
      SEO_DATA.connect.description,
      formatCodeFence(CONNECT_COMMAND, "bash"),
      formatMarkdownLink("Sign Up", ROUTE.dashboardV2AgentsSignUp),
      `Prompt for Claude:\n\n${formatCodeFence(CONNECT_PROMPT, "text")}`,
      `Featured on ${formatMarkdownLink("Product Hunt", PRODUCT_HUNT_LAUNCH_URL)}`,
    ].join("\n\n"),
    "## Novu is trusted by leading teams worldwide",
    [
      "## Work with your agent like a teammate in any channel",
      "Pick one. Or all of them. Your agent shows up everywhere at once.",
      bulletList(channelMarkdown()),
      formatMarkdownLink("Connect agent", ROUTE.connectApp),
    ].join("\n\n"),
    [
      "## Everything your agent needs to run like a teammate",
      HOW_IT_WORKS_STEPS.map(
        (step) => `### ${step.title}\n\n${step.description}`
      ).join("\n\n"),
      formatMarkdownLink("Connect an agent for free", ROUTE.connectApp),
    ].join("\n\n"),
    [
      "## Open source, ready in one command",
      "Novu Connect is built in the open — inspect the code, contribute integrations, or adapt it for your team's workflow.",
      formatCodeFence(CONNECT_COMMAND, "bash"),
      CLI_TERMINAL_COPY.map((line) => `- ${line}`).join("\n"),
    ].join("\n\n"),
    [
      "## Don't start from a blank prompt",
      "Choose a ready-to-use template, connect its tools, and send updates to the channels your team already uses.",
      [
        formatMarkdownLink("Start From Scratch", ROUTE.connectApp),
        formatMarkdownLink("Start with Claude", ROUTE.connectApp),
      ]
        .map((item) => `- ${item}`)
        .join("\n"),
      templateCategories.length
        ? `Template categories: ${inlineList(templateCategories)}`
        : "",
      templateDetailsMarkdown(templates),
    ]
      .filter(Boolean)
      .join("\n\n"),
    [
      "## Connect to your work environment without losing your privacy",
      bulletList([...COMPLIANCE_ITEMS]),
    ].join("\n\n"),
    [
      "## Pricing Novu Connect",
      PRICING_PLANS.map((plan) =>
        [
          `### ${plan.name}${
            "featured" in plan && plan.featured ? " (featured)" : ""
          }`,
          `Price: ${plan.price}`,
          `Action: ${formatMarkdownLink(plan.cta, ROUTE.connectApp)}`,
          `Includes:\n\n${bulletList([...plan.features])}`,
        ].join("\n\n")
      ).join("\n\n"),
      [
        `### ${ENTERPRISE_PLAN.name}`,
        ENTERPRISE_PLAN.description,
        bulletList([...ENTERPRISE_PLAN.features]),
        `Action: ${formatMarkdownLink(
          ENTERPRISE_PLAN.cta,
          absoluteUrl(toCanonicalPathname(String(ROUTE.contactUs)))
        )}`,
      ].join("\n\n"),
    ].join("\n\n"),
    templates.length
      ? `## Agent template links\n\n${linkList(
          templates.map((template) => ({
            title:
              rawText(template.name) ||
              rawText(template.agentName) ||
              "Agent template",
            href: templateUrl(rawText(template.id)),
            description: rawText(template.summary) || undefined,
          }))
        )}`
      : "",
    faqMarkdown(CONNECT_FAQ),
    [
      "## Two minutes. One live agent. One month of Pro.",
      "Take the Novu Connect challenge: go live in under 2 minutes and get one month of Pro.",
      formatMarkdownLink("Connect an agent", ROUTE.connectApp),
    ].join("\n\n"),
  ]
    .filter(Boolean)
    .join("\n\n")

  return pageFromSeo(SEO_DATA.connect, body)
}
