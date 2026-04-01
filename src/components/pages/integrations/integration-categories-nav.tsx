"use client"

import type { MouseEvent } from "react"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { IntegrationTabType } from "@/types/integration"

export interface IIntegrationCategoryNavItem {
  slug: string
  title: string
}

interface IntegrationCategoriesNavProps {
  tab: IntegrationTabType
  categories: IIntegrationCategoryNavItem[]
  className?: string
}

function IntegrationCategoriesNav({
  tab: _tab,
  categories,
  className,
}: IntegrationCategoriesNavProps) {
  const handleCategoryClick = (
    event: MouseEvent<HTMLButtonElement>,
    slug: string
  ) => {
    event.preventDefault()
    const element = document.getElementById(`integration-category-${slug}`)
    if (!element) {
      return
    }

    element.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section className={cn("categories-list max-w-full", className)}>
      <h2 className="sr-only">Integration categories</h2>
      <nav className="relative md:mx-0" aria-label="Jump to category">
        <ScrollArea className="w-full">
          <ul className="flex min-h-9 w-full items-center justify-center px-5 py-0.5 md:justify-start md:pl-0">
            {categories.map(({ slug, title }) => {
              return (
                <li key={slug}>
                  <button
                    type="button"
                    className={cn(
                      "relative inline-flex h-7.5 items-center justify-center rounded-full border border-transparent px-3 leading-none tracking-tight whitespace-nowrap text-gray-8 transition-colors hover:border-transparent hover:text-white",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:ring-inset"
                    )}
                    onClick={(event) => handleCategoryClick(event, slug)}
                  >
                    {title}
                  </button>
                </li>
              )
            })}
          </ul>
          <ScrollBar className="invisible" orientation="horizontal" />
        </ScrollArea>
      </nav>
    </section>
  )
}

export default IntegrationCategoriesNav
