import fs from "fs/promises"
import path from "path"

import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"
import { CHANNEL_CATEGORY_TAXONOMY } from "@/content/integrations/taxonomy/channels"
import { SOURCE_CATEGORY_TAXONOMY } from "@/content/integrations/taxonomy/sources"
import matter from "gray-matter"

import type {
  IIntegration,
  IIntegrationCategoryMeta,
  IntegrationTabType,
} from "@/types/integration"
import {
  integrationFrontmatterSchema,
  type IntegrationFrontmatter,
} from "@/lib/integrations/schema"
import {
  getDefaultIntegrationSeoDescription,
  getDefaultIntegrationSeoTitleSegment,
} from "@/lib/integrations/seo-defaults"

import { escapeMarkdownText, safeMarkdownUrl } from "../markdown-format"
import { bulletList, linkList, pageFromSeo } from "../page-utils"
import type { MarkdownResult } from "../types"
import { absoluteUrl, toCanonicalPathname, toMarkdownPathname } from "../url"

const INTEGRATIONS_CONTENT_DIR = path.join(
  process.cwd(),
  "src/content/integrations"
)
const PLACEHOLDER_ICON = "/images/logo.svg"

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

export async function getIntegrations(
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
