"use client"

/* eslint-disable @next/next/no-img-element */
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
  ITemplateImage,
} from "@/types/templates"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const INITIAL_TEMPLATE_COUNT = 6
const ALL_TEMPLATES_CATEGORY = {
  id: "all",
  title: "All",
} satisfies ITemplateFilterCategory

interface ITemplateFilterCategory {
  id: string
  title: string
}

interface ITemplateBadge {
  label: string
  icon?: ITemplateImage | null
}

interface ITemplateCard {
  id: string
  title: string
  agent: string
  categoryId: string
  category: string
  quote: string
  avatar?: ITemplateImage | null
  connectors: ITemplateBadge[]
  channels: ITemplateBadge[]
}

const TEMPLATE_CARD_HOVER_BACKGROUND =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 384 428' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.11999999731779099'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-32.568 46.387 -88.035 -76.748 313.18 14.627)'><stop stop-color='rgba(102,122,152,1)' offset='0'/><stop stop-color='rgba(102,122,152,0)' offset='0.88967'/></radialGradient></defs></svg>\"), linear-gradient(90deg, rgba(15, 15, 21, 0.8) 0%, rgba(15, 15, 21, 0.8) 100%)"
const TEMPLATE_BUTTON_BACKGROUND =
  "linear-gradient(210.097deg, rgba(176, 166, 191, 0.06) 8.6198%, rgba(176, 166, 191, 0.03) 113.79%)"
const TEMPLATE_BUTTON_HOVER_BACKGROUND =
  "linear-gradient(210.097deg, rgba(176, 166, 191, 0.24) 8.6198%, rgba(176, 166, 191, 0.12) 113.79%)"

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
  const categoriesWithTemplates = new Map<string, ITemplateFilterCategory>()

  for (const template of templates ?? []) {
    const normalizedCategory = normalizeCategory(template.category)

    if (normalizedCategory) {
      categoriesWithTemplates.set(normalizedCategory.id, normalizedCategory)
    }
  }

  const orderedCategories: ITemplateFilterCategory[] = []
  const orderedCategoryIds = new Set<string>()

  for (const category of categories ?? []) {
    const normalizedCategory = normalizeCategory(category)

    if (
      normalizedCategory &&
      categoriesWithTemplates.has(normalizedCategory.id)
    ) {
      orderedCategories.push(normalizedCategory)
      orderedCategoryIds.add(normalizedCategory.id)
    }
  }

  for (const category of categoriesWithTemplates.values()) {
    if (!orderedCategoryIds.has(category.id)) {
      orderedCategories.push(category)
    }
  }

  return orderedCategories.length > 0
    ? [ALL_TEMPLATES_CATEGORY, ...orderedCategories]
    : []
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
        href={ROUTE.connectApp}
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

function TemplateAvatar({ image }: { image?: ITemplateImage | null }) {
  const imageSrc = image?.url || undefined

  return (
    <span className="relative size-11 shrink-0 overflow-hidden">
      <img
        src={imageSrc}
        alt={image?.alt ?? ""}
        aria-hidden={image?.alt ? undefined : true}
        className="block size-full object-contain"
      />
    </span>
  )
}

function TemplateIcon({ image }: { image?: ITemplateImage | null }) {
  const imageSrc = image?.url || undefined

  return (
    <span className="relative size-5 shrink-0 overflow-hidden">
      <img
        src={imageSrc}
        alt={image?.alt ?? ""}
        aria-hidden={image?.alt ? undefined : true}
        className="block size-full object-contain"
      />
    </span>
  )
}

function TemplateCardBadge({ label, icon }: ITemplateBadge) {
  return (
    <span className="flex min-h-8 max-w-full shrink-0 items-center gap-1 rounded border border-[rgba(51,51,71,0.5)] py-1.5 pr-2.5 pl-1.5">
      <TemplateIcon image={icon} />
      <span className="min-w-0 text-[0.9375rem] leading-snug font-normal tracking-normal whitespace-nowrap text-gray-10">
        {label}
      </span>
    </span>
  )
}

function TemplateBadgeRow({
  title,
  items,
}: {
  title: string
  items: ITemplateBadge[]
}) {
  return (
    <div className="flex w-full flex-col items-start justify-center gap-3">
      <p className="w-full overflow-visible text-[0.9375rem] leading-none font-book tracking-normal text-gray-7">
        {title}
      </p>
      <div className="flex w-full flex-wrap items-center gap-2">
        {items.map((item) => (
          <TemplateCardBadge key={item.label} {...item} />
        ))}
      </div>
    </div>
  )
}

function TemplateCardButton({
  templateId,
  templateTitle,
}: {
  templateId: string
  templateTitle: string
}) {
  return (
    <NextLink
      href={`${ROUTE.connectApp}?agentTemplateId=${templateId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group/button relative flex h-10 w-full items-center justify-center overflow-visible rounded border border-[#534b5d] px-5 py-3.5 text-center text-xs leading-none font-medium tracking-normal text-white uppercase transition-[border-color] duration-200 ease-out outline-none hover:border-[#686170] focus-visible:border-[#686170] focus-visible:ring-2 focus-visible:ring-lagune-3/40 motion-reduce:transition-none"
      style={{ backgroundImage: TEMPLATE_BUTTON_BACKGROUND }}
      aria-label={`Use ${templateTitle} template`}
      data-click-location="connect_templates"
      data-click-text={`use_${templateId}_template`}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded opacity-0 transition-opacity duration-200 ease-out group-hover/button:opacity-100 group-focus-visible/button:opacity-100 motion-reduce:transition-none"
        style={{ backgroundImage: TEMPLATE_BUTTON_HOVER_BACKGROUND }}
        aria-hidden
      />
      <span className="relative z-10">Use template</span>
    </NextLink>
  )
}

function TemplateCard({
  id,
  title,
  agent,
  category,
  quote,
  avatar,
  connectors,
  channels,
}: ITemplateCard) {
  return (
    <article
      className="group/card relative flex h-full min-h-107 w-full flex-col items-start overflow-hidden rounded-xl border border-[rgba(51,51,71,0.5)] bg-[rgba(15,15,21,0.8)] p-7 transition-[border-color] duration-200 ease-out focus-within:border-[rgba(51,51,71,0.65)] motion-reduce:transition-none"
      data-template-card
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 ease-out group-focus-within/card:opacity-100 group-hover/card:opacity-100 motion-reduce:transition-none"
        style={{ backgroundImage: TEMPLATE_CARD_HOVER_BACKGROUND }}
        aria-hidden
      />

      <div className="relative z-10 flex w-full flex-1 flex-col items-start gap-6">
        <div className="flex w-full flex-col items-start gap-2.5">
          <div className="flex w-full flex-col items-start gap-6">
            <div className="flex w-full items-start justify-between gap-4">
              <TemplateAvatar image={avatar} />

              <span className="flex h-6.25 shrink-0 items-center justify-center overflow-visible rounded-xl border border-[#333347] bg-[rgba(38,38,52,0.8)] px-2.5 pt-1.25 pb-1.75 text-[0.8125rem] leading-none font-normal tracking-tighter text-gray-10">
                {category}
              </span>
            </div>

            <div className="flex max-w-full min-w-0 items-baseline gap-1.5 overflow-visible leading-none">
              <h3 className="min-w-0 text-lg leading-tight font-medium tracking-tighter text-white">
                {title}
              </h3>
              <span
                className="shrink-0 text-base leading-none font-book tracking-normal text-gray-7"
                aria-hidden
              >
                &bull;
              </span>
              <p className="min-w-0 text-base leading-none font-book tracking-normal whitespace-nowrap text-gray-7">
                {agent}
              </p>
            </div>
          </div>

          <p className="min-h-16.5 w-full text-base leading-snug font-light tracking-normal text-gray-9">
            {quote}
          </p>
        </div>

        <div className="flex w-full flex-col items-start gap-6">
          <TemplateBadgeRow title="MCP connectors" items={connectors} />
          <TemplateBadgeRow title="Channels" items={channels} />
        </div>
      </div>

      <div className="relative z-10 mt-auto w-full pt-8">
        <TemplateCardButton templateId={id} templateTitle={title} />
      </div>
    </article>
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
              <TemplateCard {...template} />
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
      className="scroll-mt-16 [overflow-anchor:none]"
      data-connect-section="templates"
    >
      <div className="mx-auto flex w-full max-w-304 flex-col items-center gap-9 px-5 md:px-8 2xl:px-0">
        <div className="flex w-full flex-col items-start gap-11">
          <div className="flex w-full flex-col items-center gap-8 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
            <div className="flex w-full max-w-174 flex-col items-center gap-4 lg:items-start">
              <h2 className="max-w-full text-[1.75rem] leading-dense font-medium tracking-tighter text-white md:text-5xl">
                Don't start from a blank prompt
              </h2>
              <p className="max-w-137.5 text-base leading-normal font-normal tracking-tighter text-gray-8 md:text-lg">
                Choose a ready-to-use template, connect its tools, and send
                updates to the channels your team already uses.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 xs:flex-row lg:justify-start lg:gap-7">
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

          {categories.length > 0 && (
            <TemplateFilters
              categories={categories}
              activeCategory={activeCategory}
              filtersRef={filtersRef}
              onCategoryChange={handleCategoryChange}
            />
          )}
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
