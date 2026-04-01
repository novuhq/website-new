"use client"

import { useSearchParams } from "next/navigation"
import { ROUTE } from "@/constants/routes"

import type {
  IIntegration,
  IIntegrationCategoryMeta,
  IntegrationTabType,
} from "@/types/integration"

import Banner from "../banner"
import IntegrationChannelCategory from "./integration-channel-category"

function countIntegrationsInCategory(
  integrations: IIntegration[],
  categorySlug: string
): number {
  return integrations.filter((i) => i.category === categorySlug).length
}

function integrationToCards(integrations: IIntegration[]) {
  return integrations.map((i) => ({
    title: i.title,
    description: i.description,
    iconSrc: i.icon,
    category: i.badge,
    href: i.pathname,
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
  const categoryTitleBySlug = new Map(categories.map((c) => [c.slug, c.title]))

  const filteredIntegrations = normalizedQuery
    ? integrations.filter((integration) => {
        const categoryTitle =
          categoryTitleBySlug.get(integration.category) ?? ""
        const searchTarget = [
          integration.title,
          integration.badge,
          integration.category,
          categoryTitle,
        ]
          .join(" ")
          .toLowerCase()

        return searchTarget.includes(normalizedQuery)
      })
    : integrations
  const resultCount = filteredIntegrations.length
  const liveRegionText = normalizedQuery
    ? resultCount > 0
      ? `${resultCount} integration${resultCount === 1 ? "" : "s"} found for "${query?.trim()}".`
      : `No integrations found for "${query?.trim()}".`
    : `${resultCount} integration${resultCount === 1 ? "" : "s"} available.`

  if (integrations.length === 0) {
    return (
      <>
        <section className="mx-auto w-full max-w-5xl px-5 pb-16 md:px-8 md:pb-18">
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            No integrations published yet.
          </p>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            No integrations published yet. Add markdown files under{" "}
            <code className="text-xs">src/content/integrations</code>.
          </p>
        </section>
        <Banner
          title="Build custom integrations easily"
          description="Connect your tools with flexible APIs and create integrations
                tailored to your workflow."
          cta={{
            label: "Create Integration",
            href: `${ROUTE.dashboardV2SignUp}`,
          }}
          className="pb-18"
        />
      </>
    )
  }

  if (filteredIntegrations.length === 0) {
    return (
      <>
        <section className="mx-auto w-full max-w-5xl px-5 pt-8 pb-16 md:px-8 md:pb-18">
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {liveRegionText}
          </p>
          <p className="text-center text-sm text-muted-foreground">
            No integrations found for "{query?.trim()}".
          </p>
        </section>
        <Banner
          title="Build custom integrations easily"
          description="Connect your tools with flexible APIs and create integrations
                tailored to your workflow."
          cta={{
            label: "Create Integration",
            href: `${ROUTE.dashboardV2SignUp}`,
          }}
          className="pb-18"
        />
      </>
    )
  }

  return (
    <>
      <section className="mx-auto w-full max-w-5xl px-5 pt-8 pb-16 md:px-8 md:pb-18">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {liveRegionText}
        </p>
        <h2 className="sr-only">
          {tab === "sources" ? "Workflow integrations" : "Providers by channel"}
        </h2>
        <div className="flex flex-col gap-17">
          {categories.map((cat) => {
            const items = filteredIntegrations
              .filter((i) => i.category === cat.slug)
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
                count={countIntegrationsInCategory(
                  filteredIntegrations,
                  cat.slug
                )}
                description={cat.description}
                cards={integrationToCards(items)}
                showMore={{ href: ROUTE.docsProviders }}
                className="mt-0"
              />
            )
          })}
        </div>
      </section>
      <Banner
        title="Build custom integrations easily"
        description="Connect your tools with flexible APIs and create integrations
                tailored to your workflow."
        cta={{
          label: "Create Integration",
          href: `${ROUTE.dashboardV2SignUp}`,
        }}
        className="pb-18"
      />
    </>
  )
}

export default IntegrationsSections
