import fs from "fs"
import path from "path"

import { unstable_cache } from "next/cache"
import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"
import { CHANNEL_CATEGORY_TAXONOMY } from "@/content/integrations/taxonomy/channels"
import { SOURCE_CATEGORY_TAXONOMY } from "@/content/integrations/taxonomy/sources"
import { globSync } from "glob"
import matter from "gray-matter"

import type {
  IIntegration,
  IIntegrationCategoryMeta,
  IIntegrationRelatedArticle,
  IntegrationTabType,
} from "@/types/integration"
import { markdownToHtml } from "@/lib/markdown/to-html"

import { splitIntegrationSections } from "./parse-body"
import {
  integrationFrontmatterSchema,
  type IntegrationFrontmatter,
} from "./schema"

const PLACEHOLDER_ICON = "/images/logo.svg"

const INTEGRATIONS_DIR = path.join(
  process.cwd(),
  config.integrations.contentDir
)

function defaultBadge(tab: IntegrationTabType, category: string): string {
  const list =
    tab === "channels" ? CHANNEL_CATEGORY_TAXONOMY : SOURCE_CATEGORY_TAXONOMY
  const found = list.find((c) => c.slug === category)
  return found?.defaultBadge ?? category
}

function categoryMetaFor(
  tab: IntegrationTabType,
  categorySlug: string
): IIntegrationCategoryMeta | null {
  const list =
    tab === "channels" ? CHANNEL_CATEGORY_TAXONOMY : SOURCE_CATEGORY_TAXONOMY
  const found = list.find((c) => c.slug === categorySlug)
  if (!found) {
    return {
      slug: categorySlug,
      title: categorySlug,
      description: "",
      order: 99,
      tab,
    }
  }
  return {
    slug: found.slug,
    title: found.title,
    description: found.description,
    order: found.order,
    tab: found.tab,
  }
}

async function fileToIntegration(
  filePath: string
): Promise<IIntegration | null> {
  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)
  const parsed = integrationFrontmatterSchema.safeParse(data)

  if (!parsed.success) {
    console.error(
      `[integrations] Invalid frontmatter: ${filePath}`,
      parsed.error
    )
    return null
  }

  const fm: IntegrationFrontmatter = parsed.data
  const sections = splitIntegrationSections(content)

  const [overviewHtml, howItWorksHtml, configureHtml] = await Promise.all([
    markdownToHtml(sections.overview),
    markdownToHtml(sections.howItWorks),
    markdownToHtml(sections.configure),
  ])

  const badge = fm.badge?.trim() || defaultBadge(fm.tab, fm.category)

  return {
    slug: fm.slug,
    title: fm.title,
    tab: fm.tab,
    category: fm.category,
    badge,
    icon: fm.icon?.trim() || PLACEHOLDER_ICON,
    tagline: fm.tagline,
    description: fm.shortDescription,
    docsUrl: fm.docsUrl,
    order: fm.order ?? 0,
    features: fm.features,
    relatedProviders: fm.relatedProviders ?? [],
    relatedArticles: fm.relatedArticles ?? [],
    seo: fm.seo,
    primaryCtaLabel: fm.primaryCtaLabel,
    primaryCtaHref: fm.primaryCtaHref,
    secondaryCtaLabel: fm.secondaryCtaLabel,
    secondaryCtaHref: fm.secondaryCtaHref,
    rawBody: content.trim(),
    pathname: `${ROUTE.integrations}/${fm.slug}` as IIntegration["pathname"],
    overviewHtml,
    howItWorksHtml,
    configureHtml,
  }
}

async function loadIntegrationsFromDisk(): Promise<IIntegration[]> {
  const files = globSync("**/*.md", {
    cwd: INTEGRATIONS_DIR,
    absolute: true,
    ignore: ["**/taxonomy/**"],
  })

  const results: IIntegration[] = []

  for (const filePath of files) {
    const entry = await fileToIntegration(filePath)
    if (entry) {
      results.push(entry)
    }
  }

  results.sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order
    }
    return a.title.localeCompare(b.title)
  })

  return results
}

// Cache integrations in Vercel Data Cache so ISR re-renders don't
// need to re-read .md files from disk.
const getCachedIntegrations = unstable_cache(
  loadIntegrationsFromDisk,
  ["integrations-all"],
  { revalidate: false }
)

export async function getAllIntegrations(): Promise<IIntegration[]> {
  return getCachedIntegrations()
}

export async function getIntegrationBySlug(
  slug: string
): Promise<IIntegration | null> {
  const all = await getAllIntegrations()
  return all.find((i) => i.slug === slug) ?? null
}

export async function getIntegrationsByTab(
  tab: IntegrationTabType
): Promise<IIntegration[]> {
  const all = await getAllIntegrations()
  return all.filter((i) => i.tab === tab)
}

export async function getIntegrationCategories(
  tab: IntegrationTabType
): Promise<IIntegrationCategoryMeta[]> {
  const inTab = await getIntegrationsByTab(tab)
  const slugs = new Set(inTab.map((i) => i.category))

  const meta: IIntegrationCategoryMeta[] = []
  for (const slug of slugs) {
    const m = categoryMetaFor(tab, slug)
    if (m) {
      meta.push(m)
    }
  }

  meta.sort((a, b) => a.order - b.order)
  return meta
}

export async function getIntegrationsByCategory(
  tab: IntegrationTabType,
  categorySlug: string
): Promise<IIntegration[]> {
  const list = await getIntegrationsByTab(tab)
  return list.filter((i) => i.category === categorySlug)
}

export async function getRelatedIntegrations(
  slug: string
): Promise<IIntegration[]> {
  const entry = await getIntegrationBySlug(slug)
  if (!entry || entry.relatedProviders.length === 0) {
    return []
  }

  const all = await getAllIntegrations()
  const bySlug = new Map(all.map((i) => [i.slug, i]))
  const out: IIntegration[] = []

  for (const ref of entry.relatedProviders) {
    const item = bySlug.get(ref)
    if (item && out.length < 6) {
      out.push(item)
    }
  }

  return out
}

export function countIntegrationsInCategory(
  integrations: IIntegration[],
  categorySlug: string
): number {
  return integrations.filter((i) => i.category === categorySlug).length
}

export function getRelatedArticles(
  entry: IIntegration
): IIntegrationRelatedArticle[] {
  return entry.relatedArticles
}
