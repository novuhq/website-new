"use client"

import { useSearchParams } from "next/navigation"

import { AGENT_RUNTIME_GROUP_TAXONOMY } from "@/content/integrations/taxonomy/agent-runtime-groups"
import type {
  IIntegration,
  IIntegrationCategoryMeta,
  IntegrationTabType,
} from "@/types/integration"

import IntegrationChannelCategory, {
  type IIntegrationChannelCategoryGroup,
} from "./integration-channel-category"

function integrationToCards(
  integrations: IIntegration[],
  categoryContext: string
) {
  return integrations.map((i) => ({
    title: i.title,
    description: i.description,
    iconSrc: i.icon,
    category: categoryContext === "agent-runtimes" ? "Agent runtime" : i.badge,
    href: i.hasDedicatedPage ? i.pathname : undefined,
  }))
}

function buildAgentRuntimeGroups(
  items: IIntegration[]
): IIntegrationChannelCategoryGroup[] {
  const groups: IIntegrationChannelCategoryGroup[] = AGENT_RUNTIME_GROUP_TAXONOMY.slice()
    .sort((a, b) => a.order - b.order)
    .map((group) => ({
      slug: group.slug,
      title: group.title,
      description: group.description,
      cards: [],
    }))

  const groupBySlug = new Map(groups.map((g) => [g.slug, g]))
  const ungrouped: IIntegration[] = []

  for (const item of items) {
    const target = item.group ? groupBySlug.get(item.group) : undefined
    if (target) {
      target.cards.push(...integrationToCards([item], "agent-runtimes"))
    } else {
      ungrouped.push(item)
    }
  }

  if (ungrouped.length > 0) {
    groups.push({
      slug: "other",
      title: "Other",
      cards: integrationToCards(ungrouped, "agent-runtimes"),
    })
  }

  return groups.filter((group) => group.cards.length > 0)
}

interface IntegrationsSectionsProps {
  tab: IntegrationTabType
  integrations: IIntegration[]
  categories: IIntegrationCategoryMeta[]
}

function IntegrationsSections({
  tab,
  integrations,
  categories,
}: IntegrationsSectionsProps) {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") ?? ""
  const normalizedQuery = query.trim().toLowerCase()
  const requestedCategory = searchParams.get("category") ?? ""
  const categorySlugSet = new Set(categories.map((category) => category.slug))
  const selectedCategory = categorySlugSet.has(requestedCategory)
    ? requestedCategory
    : ""
  const categoryTitleBySlug = new Map(categories.map((c) => [c.slug, c.title]))
  const categoryScopedIntegrations = selectedCategory
    ? integrations.filter((integration) =>
        integration.categories.includes(selectedCategory)
      )
    : integrations

  const filteredIntegrations = normalizedQuery
    ? categoryScopedIntegrations.filter((integration) => {
        const categoryTitles = integration.categories.map(
          (category) => categoryTitleBySlug.get(category) ?? ""
        )
        const searchTarget = [
          integration.title,
          integration.badge,
          ...integration.categories,
          ...categoryTitles,
        ]
          .join(" ")
          .toLowerCase()

        return searchTarget.includes(normalizedQuery)
      })
    : categoryScopedIntegrations
  const resultCount = filteredIntegrations.length
  const liveRegionText = normalizedQuery
    ? resultCount > 0
      ? `${resultCount} integration${resultCount === 1 ? "" : "s"} found for "${query?.trim()}".`
      : `No integrations found for "${query?.trim()}".`
    : `${resultCount} integration${resultCount === 1 ? "" : "s"} available.`

  if (integrations.length === 0) {
    return (
      <section className="mx-auto w-full max-w-5xl px-5 pb-16 md:px-8 md:pb-18">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          No integrations published yet.
        </p>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No integrations published yet. Add markdown files under{" "}
          <code className="text-xs">src/content/integrations</code>.
        </p>
      </section>
    )
  }

  if (filteredIntegrations.length === 0) {
    return (
      <section className="mx-auto w-full max-w-5xl px-5 pt-8 pb-16 md:px-8 md:pb-18">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {liveRegionText}
        </p>
        <p className="text-center text-sm text-muted-foreground">
          No integrations found for "{query?.trim()}".
        </p>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-5 pt-8 pb-16 md:px-8 md:pb-18">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {liveRegionText}
      </p>
      <h2 className="sr-only">
        {tab === "sources" ? "Workflow integrations" : "Providers by channel"}
      </h2>
      <div className="flex flex-col gap-17">
        {categories.map((cat) => {
          if (selectedCategory && cat.slug !== selectedCategory) {
            return null
          }

          const items = filteredIntegrations
            .filter((i) => i.categories.includes(cat.slug))
            .sort((a, b) => {
              if (a.order !== b.order) {
                return a.order - b.order
              }
              return a.title.localeCompare(b.title)
            })
          if (items.length === 0) {
            return null
          }

          const isAgentRuntimes = cat.slug === "agent-runtimes"

          return (
            <IntegrationChannelCategory
              key={cat.slug}
              sectionId={`integration-category-${cat.slug}`}
              title={cat.title}
              count={items.length}
              description={cat.description}
              cards={isAgentRuntimes ? undefined : integrationToCards(items, cat.slug)}
              groups={isAgentRuntimes ? buildAgentRuntimeGroups(items) : undefined}
              className="mt-0"
            />
          )
        })}
      </div>
    </section>
  )
}

export default IntegrationsSections
