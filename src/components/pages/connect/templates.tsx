"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import type { MutableRefObject, ReactNode } from "react"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { flushSync } from "react-dom"

import type {
  IAgentTemplateData,
  IAgentTemplatesSectionData,
  ITemplateCategoryData,
} from "@/types/templates"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import AgentGuideCard, { type IAgentGuideCardData } from "./agent-guide-card"

const INITIAL_TEMPLATE_COUNT = 6
const ALL_TEMPLATES_CATEGORY = {
  id: "all",
  title: "All",
} satisfies ITemplateFilterCategory

interface ITemplateFilterCategory {
  id: string
  title: string
}

interface ITemplateCard extends IAgentGuideCardData {
  categoryId: string
}

function restoreFilterPosition(
  filterNode: HTMLElement | null,
  previousTop: number | null,
  onComplete?: () => void
) {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      if (!filterNode || previousTop === null) {
        onComplete?.()
        return
      }

      const nextTop = filterNode.getBoundingClientRect().top
      const delta = nextTop - previousTop

      if (Math.abs(delta) > 1) {
        const root = document.documentElement
        const previousScrollBehavior = root.style.scrollBehavior

        root.style.scrollBehavior = "auto"
        window.scrollTo(window.scrollX, window.scrollY + delta)
        root.style.scrollBehavior = previousScrollBehavior
      }

      onComplete?.()
    })
  })
}

function normalizeTemplate(template: IAgentTemplateData): ITemplateCard {
  return {
    id: template.id,
    title: template.name,
    agent: template.agentName,
    categoryId: template.category?.id ?? "",
    category: template.category?.title ?? "",
    quote: template.summary,
    avatar: template.avatar?.darkImage,
    connectors: (template.mcpServerList ?? []).map((connector) => ({
      label: connector.name,
      icon: connector.icon,
    })),
    channels: (template.channels ?? []).map((channel) => ({
      label: channel.name,
      icon: channel.icon,
    })),
    href: ROUTE.dashboardV2SignUp,
  }
}

function normalizeCategory(
  category?: ITemplateCategoryData | null
): ITemplateFilterCategory | null {
  if (!category?.id || !category.title) {
    return null
  }

  return {
    id: category.id,
    title: category.title,
  }
}

function getTemplateFilterCategories({
  categories,
  templates,
}: IAgentTemplatesSectionData): ITemplateFilterCategory[] {
  const categoryMap = new Map<string, ITemplateFilterCategory>()

  for (const category of categories ?? []) {
    const normalizedCategory = normalizeCategory(category)

    if (normalizedCategory) {
      categoryMap.set(normalizedCategory.id, normalizedCategory)
    }
  }

  for (const template of templates ?? []) {
    const normalizedCategory = normalizeCategory(template.category)

    if (normalizedCategory && !categoryMap.has(normalizedCategory.id)) {
      categoryMap.set(normalizedCategory.id, normalizedCategory)
    }
  }

  return [ALL_TEMPLATES_CATEGORY, ...categoryMap.values()]
}

function TemplateActionLink({
  children,
  variant = "primary",
  className,
  clickText,
}: {
  children: ReactNode
  variant?: "primary" | "secondary"
  className?: string
  clickText: string
}) {
  const isPrimary = variant === "primary"

  return (
    <Button
      variant={isPrimary ? "default" : "outline"}
      size="lg"
      className={cn(isPrimary ? "px-5" : "overflow-visible px-6", className)}
      asChild
    >
      <NextLink
        href={ROUTE.dashboardV2SignUp}
        target="_blank"
        rel="noopener noreferrer"
        data-click-location="connect_templates"
        data-click-text={clickText}
      >
        {children}
      </NextLink>
    </Button>
  )
}

function TemplateFilters({
  categories,
  activeCategory,
  filtersRef,
  onCategoryChange,
}: {
  categories: ITemplateFilterCategory[]
  activeCategory: string
  filtersRef: MutableRefObject<HTMLElement | null>
  onCategoryChange: (category: string) => void
}) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollAreaRef.current) {
      return
    }

    const viewport = scrollAreaRef.current.querySelector(
      '[data-slot="scroll-area-viewport"]'
    ) as HTMLElement
    const activeElement = scrollAreaRef.current.querySelector(
      '[data-active="true"]'
    ) as HTMLElement

    if (!viewport || !activeElement) {
      return
    }

    const viewportRect = viewport.getBoundingClientRect()
    const elementRect = activeElement.getBoundingClientRect()
    const isFullyVisible =
      elementRect.left >= viewportRect.left &&
      elementRect.right <= viewportRect.right

    if (isFullyVisible) {
      return
    }

    const scrollLeft =
      activeElement.offsetLeft -
      viewport.offsetWidth / 2 +
      activeElement.offsetWidth / 2

    viewport.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: "smooth",
    })
  }, [activeCategory])

  return (
    <div
      ref={(node) => {
        filtersRef.current = node
      }}
      className="categories-list w-full max-w-full md:overflow-hidden"
    >
      <nav className="relative -mx-5 md:mx-0" aria-label="Template categories">
        <ScrollArea className="w-full" ref={scrollAreaRef}>
          <ul className="flex h-7.5 w-full items-center px-5 md:pl-0">
            {categories.map((category) => {
              const isActive = category.id === activeCategory

              return (
                <li key={category.id} data-active={isActive}>
                  <button
                    type="button"
                    className={cn(
                      "relative inline-flex h-7.5 items-center justify-center overflow-visible rounded-full border px-3 text-sm leading-none tracking-tight whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-lagune-3/40 motion-reduce:transition-none",
                      isActive
                        ? "border-[#81869E] text-white"
                        : "border-background text-gray-8 hover:text-white"
                    )}
                    aria-pressed={isActive}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => onCategoryChange(category.id)}
                  >
                    {category.title}
                  </button>
                </li>
              )
            })}
          </ul>
          <ScrollBar className="invisible" orientation="horizontal" />
        </ScrollArea>
        <div
          className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 my-auto h-full w-26 bg-gradient-to-r from-transparent to-background lg:w-16"
          aria-hidden
        />
      </nav>
    </div>
  )
}

function TemplatesList({
  templates,
  isExpanded,
  extraListId,
  hasToggle,
  onToggle,
}: {
  templates: ITemplateCard[]
  isExpanded: boolean
  extraListId: string
  hasToggle: boolean
  onToggle: () => void
}) {
  const hasExtraTemplates = templates.length > INITIAL_TEMPLATE_COUNT
  const visibleTemplates =
    isExpanded || !hasExtraTemplates
      ? templates
      : templates.slice(0, INITIAL_TEMPLATE_COUNT)

  return (
    <div className="flex w-full flex-col items-center">
      <motion.ul
        id={extraListId}
        className="grid w-full auto-rows-fr grid-cols-1 items-stretch gap-7 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-8"
        layout={false}
      >
        <AnimatePresence initial={false}>
          {visibleTemplates.map((template) => (
            <motion.li
              key={template.id}
              className="h-full min-w-0"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0 }}
            >
              <AgentGuideCard
                card={template}
                buttonLabel="View template"
                clickLocation="connect_templates"
                newTab
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {hasToggle && (
        <button
          type="button"
          className="group mt-7 flex min-h-11 items-center gap-1 overflow-visible text-[0.9375rem] leading-snug font-book tracking-normal text-lagune-3 transition-colors duration-200 ease-out outline-none [overflow-anchor:none] hover:text-lagune-1 focus-visible:ring-2 focus-visible:ring-lagune-3/40 motion-reduce:transition-none"
          aria-expanded={isExpanded}
          aria-controls={extraListId}
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => {
            event.currentTarget.blur()
            onToggle()
          }}
        >
          {isExpanded ? "Show less" : "Show more"}
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200 ease-out group-hover:translate-y-0.5 motion-reduce:transition-none",
              isExpanded && "rotate-180 group-hover:-translate-y-0.5"
            )}
            strokeWidth={1.5}
            aria-hidden
          />
        </button>
      )}
    </div>
  )
}

function Templates({
  templatesSection,
}: {
  templatesSection: IAgentTemplatesSectionData
}) {
  const [activeCategory, setActiveCategory] = useState(
    ALL_TEMPLATES_CATEGORY.id
  )
  const [isExpanded, setIsExpanded] = useState(false)
  const filtersRef = useRef<HTMLElement | null>(null)
  const extraListId = useId()
  const categories = useMemo(
    () => getTemplateFilterCategories(templatesSection),
    [templatesSection]
  )
  const templates = useMemo(
    () => (templatesSection.templates ?? []).map(normalizeTemplate),
    [templatesSection.templates]
  )
  const visibleTemplates = useMemo(() => {
    if (activeCategory === ALL_TEMPLATES_CATEGORY.id) {
      return templates
    }

    return templates.filter(
      (template) => template.categoryId === activeCategory
    )
  }, [activeCategory, templates])
  const hasExpandableTemplates =
    activeCategory === ALL_TEMPLATES_CATEGORY.id &&
    visibleTemplates.length > INITIAL_TEMPLATE_COUNT

  const handleCategoryChange = (category: string) => {
    if (category === activeCategory) {
      return
    }

    const filterNode = filtersRef.current
    const previousTop = filterNode?.getBoundingClientRect().top ?? null
    const root = document.documentElement
    const body = document.body
    const previousRootOverflowAnchor = root.style.overflowAnchor
    const previousBodyOverflowAnchor = body.style.overflowAnchor

    root.style.overflowAnchor = "none"
    body.style.overflowAnchor = "none"

    flushSync(() => {
      setActiveCategory(category)
      setIsExpanded(false)
    })

    restoreFilterPosition(filterNode, previousTop, () => {
      root.style.overflowAnchor = previousRootOverflowAnchor
      body.style.overflowAnchor = previousBodyOverflowAnchor
    })
  }

  const handleToggleTemplates = () => {
    if (!isExpanded) {
      const root = document.documentElement
      const body = document.body
      const previousRootOverflowAnchor = root.style.overflowAnchor
      const previousBodyOverflowAnchor = body.style.overflowAnchor

      root.style.overflowAnchor = "none"
      body.style.overflowAnchor = "none"

      flushSync(() => {
        setIsExpanded(true)
      })

      window.requestAnimationFrame(() => {
        root.style.overflowAnchor = previousRootOverflowAnchor
        body.style.overflowAnchor = previousBodyOverflowAnchor
      })

      return
    }

    setIsExpanded(false)
  }

  return (
    <section
      id="templates"
      className="scroll-mt-16 pt-28 [overflow-anchor:none] md:pt-36 lg:pt-44 xl:pt-50"
      data-connect-section="templates"
    >
      <div className="mx-auto flex w-full max-w-304 flex-col items-center gap-9 px-5 md:px-8 2xl:px-0">
        <div className="flex w-full flex-col items-start gap-11">
          <div className="flex w-full flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex w-full max-w-137.5 flex-col items-start gap-4">
              <h2 className="max-w-full text-[1.75rem] leading-dense font-medium tracking-tighter text-white md:text-5xl">
                Don't start from a blank prompt
              </h2>
              <p className="max-w-137.5 text-base leading-normal font-normal tracking-tighter text-gray-8 md:text-lg">
                Choose a ready-to-use template, connect its tools, and send
                updates to the channels your team already uses.
              </p>
            </div>

            <div className="flex flex-col gap-4 xs:flex-row lg:gap-7">
              <TemplateActionLink
                clickText="start_from_scratch"
                className="w-fit"
              >
                Start From Scratch
              </TemplateActionLink>
              <TemplateActionLink
                variant="secondary"
                clickText="start_with_claude"
                className="w-fit px-6"
              >
                Start with Claude
              </TemplateActionLink>
            </div>
          </div>

          <div className="h-px w-full bg-gray-2" />

          <TemplateFilters
            categories={categories}
            activeCategory={activeCategory}
            filtersRef={filtersRef}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-7">
          {visibleTemplates.length > 0 ? (
            <TemplatesList
              templates={visibleTemplates}
              isExpanded={
                activeCategory === ALL_TEMPLATES_CATEGORY.id && isExpanded
              }
              extraListId={extraListId}
              hasToggle={hasExpandableTemplates}
              onToggle={handleToggleTemplates}
            />
          ) : (
            <div className="flex min-h-107 w-full items-center justify-center rounded-xl border border-[rgba(51,51,71,0.5)] bg-[rgba(15,15,21,0.8)] px-6 text-center text-base leading-normal font-book tracking-tighter text-gray-8">
              No templates in this category yet.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Templates
