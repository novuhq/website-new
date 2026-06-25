import { SEO_DATA } from "@/constants/seo-data"

import { getStaticPageBySlug } from "@/lib/static"
import { CONNECT_FAQ } from "@/components/pages/connect/faq-data"

import { faqMarkdown, pageFromSeo } from "../page-utils"
import { portableTextToMarkdown } from "../portable-text-to-markdown"
import type { MarkdownPage, SeoEntry } from "../types"

const STATIC_ROUTE_COPY: Record<
  string,
  SeoEntry & { body: string | (() => Promise<string>) }
> = {
  "/": {
    ...SEO_DATA.index,
    body: [
      "Novu is open-source notification infrastructure for developers and product teams.",
      "Use Novu to build multi-channel notification workflows across email, SMS, push, in-app, and chat, with APIs and workflows designed for production teams.",
    ].join("\n\n"),
  },
  "/book-a-demo": {
    ...SEO_DATA.bookADemo,
    body: [
      "Book a Novu demo to discuss enterprise notification infrastructure, security, compliance, deployment, and migration needs.",
      "Relevant topics include SSO/SAML, RBAC, audit logs, SLA requirements, self-hosting, VPC deployment, data residency, and multi-channel notification architecture.",
    ].join("\n\n"),
  },
  "/book-a-demo-connect": {
    ...SEO_DATA.bookADemoConnect,
    body: async () =>
      [
        "Book a Novu Connect demo to discuss connecting AI agents to customer channels.",
        "Novu Connect helps teams route agent conversations across Slack, Teams, email, WhatsApp, and other channels with centralized controls.",
        faqMarkdown(CONNECT_FAQ),
      ].join("\n\n"),
  },
  "/mcp": {
    ...SEO_DATA.mcp,
    body: [
      "The Novu MCP server gives AI agents access to notification tools for subscribers, workflows, triggers, notifications, integrations, and more.",
      "It works with Claude, Cursor, and MCP-compatible clients, and helps agents trigger customer communication through Novu.",
      "Key use cases include adding notifications to AI agents, connecting agent workflows to product communication, and using Novu tools from MCP clients.",
    ].join("\n\n"),
  },
  "/copilot": {
    ...SEO_DATA.copilot,
    body: [
      "Novu Copilot turns a plain-language prompt into a production-ready notification workflow.",
      "Describe the workflow, review the generated result, and deploy it through Novu like any other workflow.",
      "Copilot is built for product teams that need to change notification copy, timing, and channels without turning every update into a separate engineering project.",
    ].join("\n\n"),
  },
  "/aci": {
    ...SEO_DATA.aci,
    body: [
      "Agent Communication Infrastructure (ACI) is the layer between autonomous agents and the people they need to reach.",
      "ACI is different from MCP and A2A: MCP connects agents to tools, A2A coordinates agents with each other, and ACI connects agents to people across channels.",
      "Novu Connect is Novu's implementation of ACI, reusing Novu's delivery backbone for agent-to-user communication.",
    ].join("\n\n"),
  },
}

export async function getStaticMarketingPage(
  pathname: string
): Promise<MarkdownPage | null> {
  const page = STATIC_ROUTE_COPY[pathname]
  if (!page) return null

  const body = typeof page.body === "function" ? await page.body() : page.body
  return pageFromSeo(page, body)
}

export async function getStaticSanityPage(
  pathname: string
): Promise<MarkdownPage | null> {
  const slug = pathname.slice(1)
  if (!slug || slug.includes("/")) return null

  const staticPage = await getStaticPageBySlug(slug, false)
  if (!staticPage) return null

  return {
    title: staticPage.seo?.title || staticPage.title,
    description: staticPage.seo?.description,
    pathname: `/${staticPage.slug.current}`,
    body: portableTextToMarkdown(staticPage.content),
    updatedAt: staticPage.publishedAt || staticPage._createdAt,
    noIndex: staticPage.seo?.noIndex,
  }
}
