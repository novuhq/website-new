"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ROUTE } from "@/constants/routes"

import type { IntegrationTabType } from "@/types/integration"
import { cn } from "@/lib/utils"

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
  tab,
  categories,
  className,
}: IntegrationCategoriesNavProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [fadeEdges, setFadeEdges] = useState({ left: false, right: false })
  const requestedCategory = searchParams.get("category") ?? ""
  const selectedCategory = categories.some(
    (category) => category.slug === requestedCategory
  )
    ? requestedCategory
    : ""
  const categoryOptions = [{ slug: "", title: "All" }, ...categories]

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) {
      return
    }

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el
      const overflow = scrollWidth - clientWidth
      if (overflow <= 1) {
        setFadeEdges({ left: false, right: false })
        return
      }
      setFadeEdges({
        left: scrollLeft > 2,
        right: scrollLeft < overflow - 2,
      })
    }

    update()
    el.addEventListener("scroll", update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", update)
      ro.disconnect()
    }
  }, [categories])

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set("category", slug)
    } else {
      params.delete("category")
    }

    const queryString = params.toString()
    const pathname = `${ROUTE.integrations}/${tab}`
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    })
  }

  return (
    <section
      className={cn(
        "categories-list w-full max-w-full min-w-0 flex-1",
        className
      )}
    >
      <h2 className="sr-only">Integration categories</h2>
      <div className="relative md:mx-0">
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-black to-transparent transition-opacity duration-200",
            fadeEdges.left ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-black to-transparent transition-opacity duration-200",
            fadeEdges.right ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        />
        <div
          ref={scrollRef}
          className="scrollbar-hidden overflow-x-auto overflow-y-hidden"
        >
          <nav aria-label="Filter by category">
            <ul className="flex min-h-9 w-max min-w-full flex-nowrap items-center justify-center py-0.5 md:justify-start">
              {categoryOptions.map(({ slug, title }) => {
                const isActive = selectedCategory === slug
                return (
                  <li key={slug} className="shrink-0">
                    <button
                      type="button"
                      className={cn(
                        "relative inline-flex h-7.5 items-center justify-center rounded-full border border-transparent px-3 leading-none tracking-tight whitespace-nowrap text-gray-8 transition-colors hover:border-transparent hover:text-white",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:ring-inset",
                        isActive && "bg-white/10 text-white"
                      )}
                      aria-pressed={isActive}
                      onClick={() => handleCategoryClick(slug)}
                    >
                      {title}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  )
}

export default IntegrationCategoriesNav
