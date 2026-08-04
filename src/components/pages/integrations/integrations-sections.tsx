"use client"

import { useSearchParams } from "next/navigation"

import type {
  IIntegration,
  IIntegrationCategoryMeta,
  IntegrationTabType,
} from "@/types/integration"

import IntegrationChannelCategory from "./integration-channel-category"

function integrationToCards(
  integrations: IIntegration[],
  categoryContext: string
) {
  return integrations.map((i) => ({
    title: i.title,
    description: i.description,
    iconSrc: i.icon,
    category: categoryContext === "agent-runtimes" ? "Agent runtime" : i.badge,
    status:
      i.product === "connect" || categoryContext === "agent-runtimes"
        ? i.availability === "live"
          ? "Live"
          : "Coming soon"
        : undefined,
    href: i.hasDedicatedPage ? i.pathname : undefined,
  }))
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

          return (
            <IntegrationChannelCategory
              key={cat.slug}
              sectionId={`integration-category-${cat.slug}`}
              title={cat.title}
              count={items.length}
              description={cat.description}
              cards={integrationToCards(items, cat.slug)}
              className="mt-0"
            />
          )
        })}
      </div>
    </section>
  )
}

export default IntegrationsSections
