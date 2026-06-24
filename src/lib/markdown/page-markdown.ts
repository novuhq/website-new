import fs from "fs/promises"
import path from "path"

import { Children, isValidElement, type ReactNode } from "react"
import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"
import { CHANNEL_CATEGORY_TAXONOMY } from "@/content/integrations/taxonomy/channels"
import { SOURCE_CATEGORY_TAXONOMY } from "@/content/integrations/taxonomy/sources"
import {
  getAllComparisonSlugs,
  getComparisonBySlug,
} from "@/data/pages/comparison"
import { pricingPageData } from "@/data/pages/pricing"
import matter from "gray-matter"

import type { FaqAnswer, IFaqSection } from "@/types/common"
import type {
  IIntegration,
  IIntegrationCategoryMeta,
  IntegrationTabType,
} from "@/types/integration"
import {
  getCategoryBySlug,
  getPaginatedPosts,
  getPaginatedPostsByCategory,
  getPostBySlug,
  getTotalPages,
  getTotalPagesByCategory,
} from "@/lib/blog"
import {
  getChangelogPostBySlug,
  getChangelogPosts,
  getChangelogPostsByCategory,
} from "@/lib/changelog"
import { getCustomersPage, isCustomerStoryCard } from "@/lib/customers"
import { getCustomerBySlug } from "@/lib/customers/customer"
import {
  integrationFrontmatterSchema,
  type IntegrationFrontmatter,
} from "@/lib/integrations/schema"
import {
  getDefaultIntegrationSeoDescription,
  getDefaultIntegrationSeoTitleSegment,
} from "@/lib/integrations/seo-defaults"
import { getStaticPageBySlug } from "@/lib/static"
import { getAgentTemplatesSection } from "@/lib/templates"
import { CONNECT_FAQ } from "@/components/pages/connect/faq-data"

import {
  escapeMarkdownText,
  formatMarkdownLink,
  safeMarkdownUrl,
} from "./markdown-format"
import { portableTextToMarkdown } from "./portable-text-to-markdown"

const INTEGRATIONS_CONTENT_DIR = path.join(
  process.cwd(),
  "src/content/integrations"
)
const PLACEHOLDER_ICON = "/images/logo.svg"

type MarkdownPage = {
  title: string
  description?: string
  pathname: string
  body: string
  updatedAt?: string
  noIndex?: boolean
}

type MarkdownResult =
  | { type: "page"; page: MarkdownPage }
  | { type: "redirect"; location: string }
  | { type: "not-found" }

type SeoEntry = {
  title: string
  description: string
  pathname: string
}

function defaultIntegrationBadge(tab: IntegrationTabType, category: string) {
  const list =
    tab === "channels" ? CHANNEL_CATEGORY_TAXONOMY : SOURCE_CATEGORY_TAXONOMY
  const found = list.find((item) => item.slug === category)
  return found?.defaultBadge ?? category
}

function integrationCategoryMetaFor(
  tab: IntegrationTabType,
  categorySlug: string
): IIntegrationCategoryMeta {
  const list =
    tab === "channels" ? CHANNEL_CATEGORY_TAXONOMY : SOURCE_CATEGORY_TAXONOMY
  const found = list.find((item) => item.slug === categorySlug)

  return {
    slug: found?.slug ?? categorySlug,
    title: found?.title ?? categorySlug,
    description: found?.description ?? "",
    order: found?.order ?? 99,
    tab,
  }
}

async function readMdxFrontmatter(filePath: string) {
  const handle = await fs.open(filePath, "r")

  try {
    const buffer = Buffer.alloc(64 * 1024)
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0)
    const sample = buffer.toString("utf-8", 0, bytesRead)
    const frontmatterMatch = sample.match(/^---\r?\n[\s\S]*?\r?\n---/)

    return matter(frontmatterMatch?.[0] ?? sample).data
  } finally {
    await handle.close()
  }
}

async function getIntegrationMdxFiles(
  directory = INTEGRATIONS_CONTENT_DIR
): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        return entry.name === "taxonomy"
          ? []
          : getIntegrationMdxFiles(entryPath)
      }

      return entry.isFile() && entry.name.endsWith(".mdx") ? [entryPath] : []
    })
  )

  return files.flat()
}

async function fileToMarkdownIntegration(
  filePath: string
): Promise<IIntegration | null> {
  const data = await readMdxFrontmatter(filePath)
  const parsed = integrationFrontmatterSchema.safeParse(data)

  if (!parsed.success) {
    console.error(
      `[markdown] Invalid integration frontmatter: ${filePath}`,
      parsed.error
    )
    return null
  }

  const frontmatter: IntegrationFrontmatter = parsed.data
  const relativePath = path
    .relative(INTEGRATIONS_CONTENT_DIR, filePath)
    .replace(/\\/g, "/")

  return {
    slug: frontmatter.slug,
    title: frontmatter.title,
    tab: frontmatter.tab,
    category: frontmatter.category,
    badge:
      frontmatter.badge?.trim() ||
      defaultIntegrationBadge(frontmatter.tab, frontmatter.category),
    icon: frontmatter.icon?.trim() || PLACEHOLDER_ICON,
    tagline: frontmatter.tagline,
    description: frontmatter.shortDescription,
    docsUrl: frontmatter.docsUrl,
    order: frontmatter.order ?? 0,
    features: frontmatter.features,
    relatedProviders: frontmatter.relatedProviders ?? [],
    relatedArticles: frontmatter.relatedArticles ?? [],
    seo: frontmatter.seo,
    primaryCtaLabel: frontmatter.primaryCtaLabel,
    primaryCtaHref: frontmatter.primaryCtaHref,
    secondaryCtaLabel: frontmatter.secondaryCtaLabel,
    secondaryCtaHref: frontmatter.secondaryCtaHref,
    relativePath,
    pathname:
      `${ROUTE.integrations}/${frontmatter.slug}` as IIntegration["pathname"],
  }
}

let markdownIntegrationsPromise: Promise<IIntegration[]> | null = null

async function getMarkdownIntegrations() {
  if (!markdownIntegrationsPromise) {
    markdownIntegrationsPromise = getIntegrationMdxFiles()
      .then((files) => Promise.all(files.map(fileToMarkdownIntegration)))
      .then((items) =>
        items
          .filter((item): item is IIntegration => item !== null)
          .sort((a, b) =>
            a.order === b.order
              ? a.title.localeCompare(b.title)
              : a.order - b.order
          )
      )
  }

  return markdownIntegrationsPromise
}

async function getMarkdownIntegrationBySlug(slug: string) {
  const integrations = await getMarkdownIntegrations()
  return integrations.find((integration) => integration.slug === slug) ?? null
}

async function getMarkdownIntegrationsByTab(tab: IntegrationTabType) {
  const integrations = await getMarkdownIntegrations()
  return integrations.filter((integration) => integration.tab === tab)
}

async function getMarkdownIntegrationCategories(tab: IntegrationTabType) {
  const integrations = await getMarkdownIntegrationsByTab(tab)
  const slugs = new Set(integrations.map((integration) => integration.category))

  return Array.from(slugs)
    .map((slug) => integrationCategoryMetaFor(tab, slug))
    .sort((a, b) => a.order - b.order)
}

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

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || "https://novu.co"
  ).replace(/\/$/, "")
}

function withLeadingSlash(pathname: string) {
  return pathname.startsWith("/") ? pathname : `/${pathname}`
}

function withoutTrailingSlash(pathname: string) {
  if (pathname === "/") return pathname
  return pathname.replace(/\/+$/, "")
}

export function toCanonicalPathname(pathname: string) {
  const normalized = withoutTrailingSlash(withLeadingSlash(pathname))
  return normalized === "/" ? "/" : `${normalized}/`
}

export function toMarkdownPathname(pathname: string) {
  const normalized = withoutTrailingSlash(withLeadingSlash(pathname))
  return normalized === "/" ? "/index.md" : `${normalized}.md`
}

export function pathSegmentsToPathname(pathSegments: string[]) {
  const cleaned: string[] = []

  for (const segment of pathSegments.filter(Boolean)) {
    try {
      cleaned.push(decodeURIComponent(segment))
    } catch {
      return null
    }
  }

  if (
    cleaned.length === 0 ||
    (cleaned.length === 1 && cleaned[0] === "index")
  ) {
    return "/"
  }

  return `/${cleaned.join("/")}`
}

function normalizePathname(pathname: string) {
  return withoutTrailingSlash(withLeadingSlash(pathname))
}

function absoluteUrl(pathname: string) {
  return `${getSiteUrl()}${pathname}`
}

function compact(value: string) {
  return value
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function asText(value: ReactNode): string {
  if (value === null || value === undefined || typeof value === "boolean") {
    return ""
  }

  if (typeof value === "string" || typeof value === "number") {
    return escapeMarkdownText(String(value))
  }

  if (Array.isArray(value)) {
    return value.map(asText).filter(Boolean).join(" ")
  }

  if (!isValidElement(value)) {
    return ""
  }

  const props = value.props as {
    children?: ReactNode
    href?: string | URL
  }
  const text = Children.toArray(props.children).map(asText).join(" ").trim()

  if (typeof value.type === "string" && value.type === "a" && props.href) {
    return formatMarkdownLink(text, props.href, { labelIsEscaped: true })
  }

  return text
}

function maybeAnswerToText(answer: FaqAnswer) {
  if (typeof answer === "function") {
    return asText(answer(() => undefined))
  }

  return asText(answer)
}

function bulletList(items: Array<string | undefined | null>) {
  return items
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item))
    .map((item) => `- ${escapeMarkdownText(item)}`)
    .join("\n")
}

function linkList(
  items: Array<{ title: string; href: string; description?: string }>
) {
  return items
    .map((item) => {
      const link = `- ${formatMarkdownLink(item.title, item.href)}`
      return item.description
        ? `${link}: ${escapeMarkdownText(item.description)}`
        : link
    })
    .join("\n")
}

function faqMarkdown(section: IFaqSection) {
  const items = section.accordion.items
    .map(
      (item) =>
        `### ${escapeMarkdownText(item.question)}\n\n${maybeAnswerToText(item.answer)}`
    )
    .join("\n\n")

  return `## ${escapeMarkdownText(section.title)}\n\n${items}`
}

function formatPage(page: MarkdownPage) {
  const canonicalPathname = toCanonicalPathname(page.pathname)
  const markdownPathname = toMarkdownPathname(page.pathname)
  const header = [
    `# ${escapeMarkdownText(page.title)}`,
    page.description ? `> ${escapeMarkdownText(page.description)}` : "",
    `Canonical: ${absoluteUrl(canonicalPathname)}`,
    `Markdown: ${absoluteUrl(markdownPathname)}`,
    page.updatedAt ? `Last updated: ${page.updatedAt}` : "",
  ]
    .filter(Boolean)
    .join("\n\n")

  return `${header}\n\n${compact(page.body)}\n`
}

function pageFromSeo(
  entry: SeoEntry,
  body: string,
  noIndex?: boolean
): MarkdownPage {
  return {
    title: entry.title,
    description: entry.description,
    pathname: entry.pathname || "/",
    body,
    noIndex,
  }
}

async function getStaticMarketingPage(
  pathname: string
): Promise<MarkdownPage | null> {
  const page = STATIC_ROUTE_COPY[pathname]
  if (!page) return null

  const body = typeof page.body === "function" ? await page.body() : page.body
  return pageFromSeo(page, body)
}

function postListMarkdown(
  posts: Array<{
    title: string
    url?: string
    pathname?: string
    caption?: string
    publishedAt?: string
  }>
) {
  return linkList(
    posts.map((post) => ({
      title: post.title,
      href: absoluteUrl(toCanonicalPathname(post.url ?? post.pathname ?? "")),
      description: [post.publishedAt, post.caption].filter(Boolean).join(" - "),
    }))
  )
}

async function getBlogListing(
  pathname: string
): Promise<MarkdownResult | null> {
  const pageMatch = pathname.match(/^\/blog\/page\/(\d+)$/)
  const categoryMatch = pathname.match(/^\/blog\/category\/([^/]+)$/)
  const categoryPageMatch = pathname.match(
    /^\/blog\/category\/([^/]+)\/page\/(\d+)$/
  )

  if (pathname === "/blog" || pageMatch) {
    const currentPage = pageMatch ? Number(pageMatch[1]) : 1
    const totalPages = await getTotalPages(false)

    if (
      !Number.isInteger(currentPage) ||
      currentPage < 1 ||
      currentPage > totalPages
    ) {
      return { type: "not-found" }
    }

    if (currentPage === 1 && pageMatch) {
      return { type: "not-found" }
    }

    const posts = await getPaginatedPosts(currentPage, false, {
      nonFeaturedOnly: true,
    })

    return {
      type: "page",
      page: pageFromSeo(
        {
          title: `${SEO_DATA.blog.title}${currentPage > 1 ? ` - Page ${currentPage}` : ""} | ${config.projectName}`,
          description: `${SEO_DATA.blog.description}${currentPage > 1 ? ` Page ${currentPage}` : ""}`,
          pathname: currentPage > 1 ? `/blog/page/${currentPage}` : "/blog",
        },
        [`## Posts`, postListMarkdown(posts)].join("\n\n")
      ),
    }
  }

  if (categoryMatch || categoryPageMatch) {
    const category = categoryMatch?.[1] ?? categoryPageMatch?.[1] ?? ""
    const currentPage = categoryPageMatch ? Number(categoryPageMatch[2]) : 1
    const [categoryData, totalPages] = await Promise.all([
      getCategoryBySlug(category, false),
      getTotalPagesByCategory(category, false),
    ])

    if (
      !categoryData ||
      !Number.isInteger(currentPage) ||
      currentPage < 1 ||
      currentPage > totalPages
    ) {
      return { type: "not-found" }
    }

    if (currentPage === 1 && categoryPageMatch) {
      return { type: "not-found" }
    }

    const posts = await getPaginatedPostsByCategory(
      category,
      currentPage,
      false,
      currentPage > 1 ? { nonFeaturedOnly: true } : undefined
    )

    return {
      type: "page",
      page: pageFromSeo(
        {
          title: `${SEO_DATA.blog.title}: ${categoryData.title}${currentPage > 1 ? ` - page ${currentPage}` : ""} | ${config.projectName}`,
          description: `${categoryData.title} ${SEO_DATA.blog.description}${currentPage > 1 ? ` Page ${currentPage}` : ""}`,
          pathname:
            currentPage > 1
              ? `/blog/category/${category}/page/${currentPage}`
              : `/blog/category/${category}`,
        },
        [`## Posts in ${categoryData.title}`, postListMarkdown(posts)].join(
          "\n\n"
        )
      ),
    }
  }

  return null
}

async function getBlogPost(pathname: string): Promise<MarkdownPage | null> {
  const match = pathname.match(/^\/blog\/([^/]+)$/)
  if (!match) return null

  const post = await getPostBySlug(match[1], false)
  if (!post) return null

  const authors = post.authors?.map((author) => author.name).filter(Boolean)
  const body = [
    post.caption,
    authors?.length ? `Authors: ${authors.join(", ")}` : "",
    post.publishedAt ? `Published: ${post.publishedAt}` : "",
    post.category?.title ? `Category: ${post.category.title}` : "",
    portableTextToMarkdown(post.content),
  ]
    .filter(Boolean)
    .join("\n\n")

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.caption,
    pathname: `/blog/${post.slug.current}`,
    body,
    updatedAt: post.publishedAt,
    noIndex: post.seo?.noIndex,
  }
}

async function getStaticSanityPage(
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

async function getChangelog(pathname: string): Promise<MarkdownPage | null> {
  if (pathname === "/changelog") {
    const posts = await getChangelogPosts(false)

    return pageFromSeo(
      SEO_DATA.changelog,
      [`## Product updates`, postListMarkdown(posts)].join("\n\n")
    )
  }

  const categoryMatch = pathname.match(/^\/changelog\/category\/([^/]+)$/)
  if (categoryMatch) {
    const posts = await getChangelogPostsByCategory(categoryMatch[1], false)
    if (!posts) return null

    const categoryTitle =
      posts[0]?.categories?.find(
        (category) => category.slug.current === categoryMatch[1]
      )?.title || categoryMatch[1]

    return pageFromSeo(
      {
        title: `${categoryTitle} | Changelog | Novu`,
        description: `Latest updates and improvements in the ${categoryTitle.toLowerCase()} category.`,
        pathname,
      },
      [`## ${categoryTitle} updates`, postListMarkdown(posts)].join("\n\n")
    )
  }

  const postMatch = pathname.match(/^\/changelog\/([^/]+)$/)
  if (!postMatch) return null

  const entry = await getChangelogPostBySlug(postMatch[1], false)
  if (!entry) return null

  const { post } = entry
  const body = [
    post.caption,
    post.publishedAt ? `Published: ${post.publishedAt}` : "",
    post.categories?.length
      ? `Categories: ${post.categories.map((category) => category.title).join(", ")}`
      : "",
    portableTextToMarkdown(post.content),
  ]
    .filter(Boolean)
    .join("\n\n")

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.caption,
    pathname: `/changelog/${post.slug.current}`,
    body,
    updatedAt: post.publishedAt || post._createdAt,
    noIndex: post.seo?.noIndex,
  }
}

async function getCustomers(pathname: string): Promise<MarkdownPage | null> {
  if (pathname === "/customers") {
    const page = await getCustomersPage(false)
    if (!page) return null

    const featured = page.cards.filter(isCustomerStoryCard)
    const customers = page.customersGrid.map((customer) => ({
      title: customer.name,
      href:
        customer.type === "story" && customer.slug?.current
          ? absoluteUrl(
              toCanonicalPathname(`/customers/${customer.slug.current}`)
            )
          : customer.url || absoluteUrl("/customers/"),
      description: customer.about,
    }))

    return pageFromSeo(
      SEO_DATA.customers,
      [
        featured.length
          ? `## Featured customer stories\n\n${linkList(
              featured.map((customer) => ({
                title: customer.name,
                href: absoluteUrl(
                  toCanonicalPathname(`/customers/${customer.slug.current}`)
                ),
                description: customer.quoteText,
              }))
            )}`
          : "",
        `## Customers\n\n${linkList(customers)}`,
      ]
        .filter(Boolean)
        .join("\n\n")
    )
  }

  const match = pathname.match(/^\/customers\/([^/]+)$/)
  if (!match) return null

  const customerData = await getCustomerBySlug(match[1], false)
  if (!customerData) return null

  const { customer } = customerData
  const body = [
    customer.about,
    customer.industry ? `Industry: ${customer.industry}` : "",
    customer.channelsList?.length
      ? `Channels: ${customer.channelsList.join(", ")}`
      : "",
    customer.quote?.text
      ? `> ${customer.quote.text}\n>\n> - ${[
          customer.quote.authorName,
          customer.quote.authorPosition,
        ]
          .filter(Boolean)
          .join(", ")}`
      : "",
    customer.challengesSolution?.challenges?.length
      ? `## Key Challenges\n\n${bulletList(customer.challengesSolution.challenges)}`
      : "",
    customer.challengesSolution?.solution?.length
      ? `## Novu Solution\n\n${bulletList(customer.challengesSolution.solution)}`
      : "",
    customer.body ? portableTextToMarkdown(customer.body) : "",
  ]
    .filter(Boolean)
    .join("\n\n")

  return {
    title: customer.seo?.title || customer.title,
    description: customer.seo?.description || customer.about,
    pathname: `/customers/${customer.slug?.current ?? match[1]}`,
    body,
    updatedAt: customer._createdAt,
    noIndex: customer.seo?.noIndex,
  }
}

async function getIntegrations(
  pathname: string
): Promise<MarkdownResult | null> {
  if (pathname === "/integrations") {
    return {
      type: "redirect",
      location: toMarkdownPathname(ROUTE.integrationsChannels as string),
    }
  }

  if (
    pathname === "/integrations/channels" ||
    pathname === "/integrations/sources"
  ) {
    const tab = pathname.endsWith("/sources") ? "sources" : "channels"
    const seo =
      tab === "channels"
        ? SEO_DATA.integrationsChannels
        : SEO_DATA.integrationsSources
    const [categories, integrations] = await Promise.all([
      getMarkdownIntegrationCategories(tab),
      getMarkdownIntegrationsByTab(tab),
    ])

    const categorySections = categories
      .map((category) => {
        const categoryItems = integrations.filter(
          (integration) => integration.category === category.slug
        )

        return [
          `### ${category.title}`,
          category.description,
          linkList(
            categoryItems.map((integration) => ({
              title: integration.title,
              href: absoluteUrl(
                toCanonicalPathname(`/integrations/${integration.slug}`)
              ),
              description: integration.description,
            }))
          ),
        ]
          .filter(Boolean)
          .join("\n\n")
      })
      .join("\n\n")

    return {
      type: "page",
      page: pageFromSeo(
        seo,
        `## ${tab === "channels" ? "Notification providers" : "Sources"}\n\n${categorySections}`
      ),
    }
  }

  const match = pathname.match(/^\/integrations\/([^/]+)$/)
  if (!match) return null

  const integration = await getMarkdownIntegrationBySlug(match[1])
  if (!integration) return null

  const raw = await fs.readFile(
    path.join(INTEGRATIONS_CONTENT_DIR, integration.relativePath),
    "utf-8"
  )
  const parsed = matter(raw)
  const titleSegment =
    integration.seo?.title ?? getDefaultIntegrationSeoTitleSegment(integration)
  const description =
    integration.seo?.description ??
    getDefaultIntegrationSeoDescription(integration)

  return {
    type: "page",
    page: {
      title: `${titleSegment} | ${config.projectName}`,
      description,
      pathname: `/integrations/${integration.slug}`,
      body: [
        integration.tagline,
        `Badge: ${integration.badge}`,
        integration.features?.length
          ? `## Features\n\n${bulletList(integration.features)}`
          : "",
        parsed.content.trim(),
        integration.docsUrl
          ? `Docs: ${
              safeMarkdownUrl(integration.docsUrl) ??
              escapeMarkdownText(integration.docsUrl)
            }`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
      noIndex: integration.seo?.noIndex,
    },
  }
}

function comparisonTableMarkdown(rows: Array<Array<ReactNode>>) {
  return rows
    .map((row) => {
      const [feature, novu, competitor, meaning] = row.map(asText)
      return [
        `### ${feature}`,
        `- Novu: ${novu}`,
        `- Alternative: ${competitor}`,
        `- What this means: ${meaning}`,
      ].join("\n")
    })
    .join("\n\n")
}

async function getComparison(pathname: string): Promise<MarkdownPage | null> {
  const match = pathname.match(/^\/comparison\/([^/]+)$/)
  if (!match) return null

  const data = getComparisonBySlug(match[1])
  if (!data) return null

  const title =
    `${data.hero.heading.prefix} ${data.hero.heading.highlight}`.replace(
      /\u00a0/g,
      " "
    )
  const body = [
    data.hero.subheading,
    `## ${data.intro.title}\n\n${data.intro.description}\n\n${bulletList(data.intro.benefits)}`,
    `## ${data.frustrations.title}\n\n${data.frustrations.subtitle}\n\n${data.frustrations.items.map((item) => `### ${item.title}\n\n${item.description}`).join("\n\n")}`,
    `## ${data.difference.title}\n\n${data.difference.subtitle}\n\n${data.difference.cards.map((card) => `### ${card.title}\n\n${card.description}`).join("\n\n")}`,
    `## ${data.codeSection.title}\n\n${data.codeSection.subtitle}\n\n${data.codeSection.items.map((item) => `### ${item.title}\n\n${item.description}`).join("\n\n")}`,
    `## ${data.comparisonTable.title}\n\n${data.comparisonTable.subtitle}\n\n${comparisonTableMarkdown(data.comparisonTable.rows)}`,
    `## ${data.banner.title}\n\n${data.banner.description}`,
    faqMarkdown(data.faqSection),
  ].join("\n\n")

  return {
    title,
    description: data.description,
    pathname: `/comparison/${data.slug}`,
    body,
  }
}

function priceToText(
  price: Array<{
    _type: string
    value: string | number
    paymentPeriod?: string
  }>
) {
  return price
    .map((item) =>
      item._type === "numericPrice"
        ? `$${item.value}/${item.paymentPeriod ?? "month"}`
        : String(item.value)
    )
    .join(", ")
}

async function getPricing(pathname: string): Promise<MarkdownPage | null> {
  if (pathname !== "/pricing") return null

  const data = pricingPageData
  const body = [
    data.hero.title,
    data.hero.description,
    `## Plans\n\n${data.hero.plans
      .map((plan) =>
        [
          `### ${plan.title}`,
          plan.description,
          `Price: ${priceToText(plan.price)}`,
          asText(plan.details),
          plan.extraInfo,
        ]
          .filter(Boolean)
          .join("\n\n")
      )
      .join("\n\n")}`,
    `## ${data.onPrem.title}\n\n${data.onPrem.description}\n\n${bulletList(data.onPrem.features)}`,
    faqMarkdown(data.faq),
    `## ${data.cta.text}\n\n${data.cta.description}`,
  ]
    .filter(Boolean)
    .join("\n\n")

  return pageFromSeo(SEO_DATA.pricing, body, false)
}

async function getConnect(pathname: string): Promise<MarkdownPage | null> {
  if (pathname !== "/connect") return null

  const templatesSection = await getAgentTemplatesSection(false)
  const templates = templatesSection.templates.slice(0, 12)
  const body = [
    SEO_DATA.connect.description,
    "Connect existing agents to customer channels with reusable tools, templates, and channel adapters.",
    templates.length
      ? `## Agent templates\n\n${linkList(
          templates.map((template) => ({
            title: template.name,
            href: absoluteUrl(toCanonicalPathname("/connect")),
            description: template.summary,
          }))
        )}`
      : "",
    faqMarkdown(CONNECT_FAQ),
  ]
    .filter(Boolean)
    .join("\n\n")

  return pageFromSeo(SEO_DATA.connect, body)
}

export async function getMarkdownPageByPath(
  pathname: string
): Promise<MarkdownResult> {
  const normalized = normalizePathname(pathname)
  const direct = await getStaticMarketingPage(normalized)
  if (direct) return { type: "page", page: direct }

  const maybeRedirectOrIntegration = await getIntegrations(normalized)
  if (maybeRedirectOrIntegration) return maybeRedirectOrIntegration

  const maybeBlogListing = await getBlogListing(normalized)
  if (maybeBlogListing) return maybeBlogListing

  const builders = [
    getPricing,
    getConnect,
    getBlogPost,
    getChangelog,
    getCustomers,
    getComparison,
    getStaticSanityPage,
  ]

  for (const builder of builders) {
    const page = await builder(normalized)
    if (page) return { type: "page", page }
  }

  return { type: "not-found" }
}

export function markdownResponseBody(page: MarkdownPage) {
  return formatPage(page)
}

export function getKnownMarkdownPathnames() {
  return [
    "/",
    "/book-a-demo",
    "/book-a-demo-connect",
    "/mcp",
    "/copilot",
    "/aci",
    "/connect",
    "/pricing",
    "/blog",
    "/changelog",
    "/customers",
    "/integrations/channels",
    "/integrations/sources",
    ...getAllComparisonSlugs().map((slug) => `/comparison/${slug}`),
  ]
}
