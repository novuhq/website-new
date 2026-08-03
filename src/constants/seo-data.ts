import config from "@/configs/website-config"

import { ROUTE } from "./routes"

export const SEO_DATA = {
  notFound: {
    title: `Page not found | ${config.projectName}`,
    description: "Sorry, we couldn't find the page you're looking for",
    pathname: "",
  },
  index: {
    title: `${config.projectName} - Connect your AI agents and products to customers`,
    description: `${config.projectName} is the open-source notification and agent communication infrastructure. Connect AI agents and products to customers across in-app, email, SMS, push, WhatsApp, Slack, Microsoft Teams, and Telegram with one API. Start with npx novu connect.`,
    pathname: "",
  },
  bookADemo: {
    title: `Book a Demo | Enterprise Notification Infrastructure | ${config.projectName}`,
    description: `Book a ${config.projectName} demo to discuss enterprise notification infrastructure, SSO/SAML, RBAC, audit logs, SLA, compliance, and self-hosted deployment options.`,
    pathname: ROUTE.bookADemo as string,
  },
  bookADemoConnect: {
    title: `Book a Demo | ${config.projectName} Connect`,
    description: `Book a ${config.projectName} Connect demo to discuss agent notifications across Slack, Teams, email, and more.`,
    imagePath: "/og-images/og-image-connect.jpg",
    imageAlt: `${config.projectName} Connect social preview`,
    pathname: ROUTE.bookADemoConnect as string,
  },
  changelog: {
    title: `Changelog | ${config.projectName}`,
    description: `Stay up-to-date with ${config.projectName}`,
    pathname: ROUTE.changelog as string,
  },
  customers: {
    title: `Customers | ${config.projectName}`,
    description: `Discover how engineering teams use ${config.projectName} to ship faster and simplify their communication workflows.`,
    imagePath: "/social-previews/customers.jpg",
    pathname: ROUTE.customers as string,
  },
  careers: {
    title: `Careers | ${config.projectName}`,
    description: `Join the team creating open-source notification infrastructure for developers, product teams, and the millions of users they reach.`,
    pathname: ROUTE.careers as string,
  },
  pricing: {
    title: `Pricing | ${config.projectName}`,
    description: `Flexible pricing for companies and developers`,
    pathname: ROUTE.pricing as string,
  },
  integrationsSources: {
    title: `Workflow and Agent Runtime Integrations | ${config.projectName}`,
    description:
      "Use workflow tools and AI SDKs with Novu Notify, or connect existing agent runtimes to supported communication channels with Novu Connect.",
    pathname: ROUTE.integrationsSources as string,
  },
  integrationsChannels: {
    title: `Notification and Agent Channel Integrations | ${config.projectName}`,
    description:
      "Connect notification providers with Novu Notify and bring AI agents into Slack, Microsoft Teams, WhatsApp Business, Telegram, email, and iMessage with Novu Connect.",
    pathname: ROUTE.integrationsChannels as string,
  },
  connect: {
    title: `${config.projectName} Connect - Connect Your Agent to Any Channel`,
    description:
      "Connect your agent to Slack, Teams, WhatsApp, Telegram, email, and more. Start from templates, reuse MCP tools, and launch in minutes with Novu.",
    imagePath: "/og-images/og-image-connect.jpg",
    imageAlt: `${config.projectName} Connect social preview`,
    pathname: ROUTE.connect as string,
  },
  mcp: {
    title: "Novu MCP Server — Add Notifications to Any AI Agent",
    description:
      "The Novu MCP server gives AI agents native access to 23 notification tools — subscribers, workflows, triggers, notifications, integrations, and more. Works with Claude, Cursor, and any MCP-compatible client.",
    pathname: ROUTE.mcp as string,
    imagePath: "/og-images/og-image-mcp.jpg",
  },
  copilot: {
    title:
      "Novu Copilot — From Prompt to Production-Ready Notification Workflows",
    description:
      "Product managers can now describe a notification workflow in plain English. Novu Copilot generates your workflow in seconds following Novu's best practices.",
    pathname: ROUTE.copilot as string,
    imagePath: "/og-images/og-image-copilot.jpg",
  },
  blog: {
    title: `Blog`,
    description: "Stay up to date with the latest updates from Novu",
    pathname: ROUTE.blog as string,
  },
  aci: {
    title: "Agent Communication Infrastructure | Novu",
    description:
      "The missing agent-to-user communication layer between every customer, channel, and agent.",
    pathname: ROUTE.aci as string,
    imagePath: "/og-images/og-image-aci.jpg",
  },
}
