import config from "@/configs/website-config"

import { ROUTE } from "./routes"

export const SEO_DATA = {
  notFound: {
    title: `Page not found | ${config.projectName}`,
    description: "Sorry, we couldn't find the page you're looking for",
    pathname: "",
  },
  index: {
    title: `${config.projectName} - Open-source notifications infrastructure for devs and product teams`,
    description: `${config.projectName} is an open-source notification platform that empowers developers to create robust, multi-channel notifications for web and mobile apps. With powerful workflows, seamless integrations, and a flexible API-first approach, ${config.projectName} enables product teams to manage notifications without breaking production.`,
    pathname: "",
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
  pricing: {
    title: `Pricing | ${config.projectName}`,
    description: `Flexible pricing for companies and developers`,
    pathname: ROUTE.pricing as string,
  },
  integrationsSources: {
    title: `Integrations | ${config.projectName}`,
    description:
      "Explore all tools and services that integrate with Novu. Build notification workflows across email, SMS, push, in-app, and chat without switching providers.",
    pathname: ROUTE.integrationsSources as string,
  },
  integrationsChannels: {
    title: `Notification Providers | ${config.projectName}`,
    description:
      "Browse all notification providers supported by Novu. Connect email, SMS, push, in-app, and chat providers to your stack with a unified API.",
    pathname: ROUTE.integrationsChannels as string,
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
}
