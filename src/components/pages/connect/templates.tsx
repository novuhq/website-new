"use client"

/* eslint-disable @next/next/no-img-element */
import { useEffect, useId, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const TEMPLATE_CATEGORIES = [
  "All",
  "Product",
  "Marketing",
  "Sales",
  "Support / CS",
  "Finance",
  "Engineering",
] as const

const INITIAL_TEMPLATE_COUNT = 6

type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number]
type TemplateCardCategory = Exclude<TemplateCategory, "All">

interface ITemplateBadge {
  label: string
}

interface ITemplateCard {
  title: string
  agent: string
  category: TemplateCardCategory
  quote: string
  connectors: ITemplateBadge[]
  channels: ITemplateBadge[]
}

const TEMPLATES: ITemplateCard[] = [
  {
    title: "Product insights",
    agent: "Iris",
    category: "Product",
    quote:
      "“Catches funnel drops before standup. PMs stop checking dashboards.”",
    connectors: [
      { label: "Mixpanel" },
      { label: "Linear" },
      { label: "Notion" },
    ],
    channels: [{ label: "Slack" }],
  },
  {
    title: "Release notes",
    agent: "Rex",
    category: "Product",
    quote: "“Turns merged PRs into release notes nobody has to write.”",
    connectors: [{ label: "GitHub" }, { label: "Linear" }, { label: "Notion" }],
    channels: [{ label: "Slack" }, { label: "Email" }],
  },
  {
    title: "Ad performance",
    agent: "Addy",
    category: "Marketing",
    quote: "“Spots budget bleed within hours, not weeks.”",
    connectors: [
      { label: "Google Ads" },
      { label: "Meta Ads" },
      { label: "Attio" },
    ],
    channels: [{ label: "WhatsApp" }, { label: "Email" }],
  },
  {
    title: "Content distribution",
    agent: "Cleo",
    category: "Marketing",
    quote:
      "“Every published post lands in the right channel and right list. No more ‘did we tweet that?’”",
    connectors: [
      { label: "Notion" },
      { label: "LinkedIn" },
      { label: "HubSpot" },
    ],
    channels: [{ label: "Slack" }, { label: "Email" }],
  },
  {
    title: "Pipeline coach",
    agent: "Pip",
    category: "Sales",
    quote:
      "“Flags stalled deals before forecast call. Reps know which deal to work today.”",
    connectors: [{ label: "Attio" }, { label: "Grain" }, { label: "Gmail" }],
    channels: [{ label: "Slack" }, { label: "SMS" }],
  },
  {
    title: "Pre-call researcher",
    agent: "Brief",
    category: "Sales",
    quote: "“Every call starts with context. Reps walk in knowing the room.”",
    connectors: [
      { label: "Attio" },
      { label: "LinkedIn" },
      { label: "Notion" },
    ],
    channels: [{ label: "Slack DM" }],
  },
  {
    title: "Escalation brief",
    agent: "Ember",
    category: "Support / CS",
    quote:
      "“Summarizes hot accounts before the handoff. Every escalation starts with context.”",
    connectors: [
      { label: "Zendesk" },
      { label: "Linear" },
      { label: "Notion" },
    ],
    channels: [{ label: "Slack" }, { label: "Email" }],
  },
  {
    title: "Bug triage",
    agent: "Delta",
    category: "Engineering",
    quote:
      "“Groups fresh reports by impact, owner, and release. Triage starts already sorted.”",
    connectors: [{ label: "GitHub" }, { label: "Sentry" }, { label: "Linear" }],
    channels: [{ label: "Slack" }],
  },
  {
    title: "Revenue digest",
    agent: "Ledger",
    category: "Finance",
    quote:
      "“Turns billing movement into a clean morning digest for finance and ops.”",
    connectors: [
      { label: "Stripe" },
      { label: "HubSpot" },
      { label: "Sheets" },
    ],
    channels: [{ label: "Email" }, { label: "Slack" }],
  },
  {
    title: "Incident notifier",
    agent: "Onyx",
    category: "Engineering",
    quote:
      "“Keeps the incident room current, from alert to customer-facing follow-up.”",
    connectors: [
      { label: "Datadog" },
      { label: "Statuspage" },
      { label: "Linear" },
    ],
    channels: [{ label: "Slack" }, { label: "Email" }],
  },
  {
    title: "Renewal watch",
    agent: "Atlas",
    category: "Finance",
    quote:
      "“Flags upcoming renewals, usage shifts, and risk signals before the forecast changes.”",
    connectors: [
      { label: "Stripe" },
      { label: "Salesforce" },
      { label: "Notion" },
    ],
    channels: [{ label: "Slack" }],
  },
  {
    title: "Support QA",
    agent: "Echo",
    category: "Support / CS",
    quote:
      "“Samples conversations, catches misses, and sends coaching notes without another dashboard.”",
    connectors: [
      { label: "Intercom" },
      { label: "Zendesk" },
      { label: "Notion" },
    ],
    channels: [{ label: "Email" }, { label: "Slack" }],
  },
]

const TEMPLATE_CARD_HOVER_BACKGROUND =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 384 428' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.11999999731779099'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-32.568 46.387 -88.035 -76.748 313.18 14.627)'><stop stop-color='rgba(102,122,152,1)' offset='0'/><stop stop-color='rgba(102,122,152,0)' offset='0.88967'/></radialGradient></defs></svg>\"), linear-gradient(90deg, rgba(15, 15, 21, 0.8) 0%, rgba(15, 15, 21, 0.8) 100%)"
const TEMPLATE_BUTTON_BACKGROUND =
  "linear-gradient(210.097deg, rgba(176, 166, 191, 0.06) 8.6198%, rgba(176, 166, 191, 0.03) 113.79%)"
const TEMPLATE_BUTTON_HOVER_BACKGROUND =
  "linear-gradient(210.097deg, rgba(176, 166, 191, 0.24) 8.6198%, rgba(176, 166, 191, 0.12) 113.79%)"

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

function TemplateAvatarPlaceholder() {
  return (
    <span className="relative size-11 shrink-0 overflow-hidden">
      <img alt="" aria-hidden className="block size-full object-contain" />
    </span>
  )
}

function TemplateIconPlaceholder() {
  return (
    <span className="relative size-5 shrink-0 overflow-hidden">
      <img alt="" aria-hidden className="block size-full object-contain" />
    </span>
  )
}

function TemplateCardBadge({ label }: ITemplateBadge) {
  return (
    <span className="flex h-8 shrink-0 items-center gap-1 rounded border border-[rgba(51,51,71,0.5)] py-1.5 pr-2.5 pl-1.5">
      <TemplateIconPlaceholder />
      <span className="text-[0.9375rem] leading-snug font-normal tracking-normal whitespace-nowrap text-gray-10">
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

function TemplateCardButton({ templateTitle }: { templateTitle: string }) {
  return (
    <NextLink
      href={ROUTE.dashboardV2SignUp}
      target="_blank"
      rel="noopener noreferrer"
      className="group/button relative flex h-10 w-full items-center justify-center overflow-visible rounded border border-[#534b5d] px-5 py-3.5 text-center text-xs leading-none font-medium tracking-normal text-white uppercase transition-[border-color] duration-200 ease-out outline-none hover:border-[#686170] focus-visible:border-[#686170] focus-visible:ring-2 focus-visible:ring-lagune-3/40 motion-reduce:transition-none"
      style={{ backgroundImage: TEMPLATE_BUTTON_BACKGROUND }}
      aria-label={`View ${templateTitle} template`}
      data-click-location="connect_templates"
      data-click-text={`view_${templateTitle.toLowerCase().replace(/\s+/g, "_")}_template`}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded opacity-0 transition-opacity duration-200 ease-out group-hover/button:opacity-100 group-focus-visible/button:opacity-100 motion-reduce:transition-none"
        style={{ backgroundImage: TEMPLATE_BUTTON_HOVER_BACKGROUND }}
        aria-hidden
      />
      <span className="relative z-10">View template</span>
    </NextLink>
  )
}

function TemplateCard({
  title,
  agent,
  category,
  quote,
  connectors,
  channels,
}: ITemplateCard) {
  return (
    <article
      className="group/card relative flex min-h-107 w-full flex-col items-start gap-8 overflow-hidden rounded-xl border border-[rgba(51,51,71,0.5)] bg-[rgba(15,15,21,0.8)] p-7 transition-[border-color] duration-200 ease-out focus-within:border-[rgba(51,51,71,0.65)] motion-reduce:transition-none xl:h-107"
      data-template-card
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 ease-out group-focus-within/card:opacity-100 group-hover/card:opacity-100 motion-reduce:transition-none"
        style={{ backgroundImage: TEMPLATE_CARD_HOVER_BACKGROUND }}
        aria-hidden
      />

      <div className="relative z-10 flex w-full flex-col items-start gap-6">
        <div className="relative flex w-full flex-col items-start gap-6">
          <div className="flex w-full items-center gap-4.5">
            <TemplateAvatarPlaceholder />

            <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2 overflow-visible leading-none">
              <h3 className="max-w-full overflow-visible text-lg leading-none font-medium tracking-tighter whitespace-nowrap text-white">
                {title}
              </h3>
              <p className="max-w-full overflow-visible text-base leading-none font-book tracking-normal whitespace-nowrap text-gray-7">
                {agent}
              </p>
            </div>
          </div>

          <p className="min-h-16.5 w-full text-base leading-snug font-light tracking-normal text-gray-9">
            {quote}
          </p>

          <span className="absolute top-0 right-0 flex h-6.25 items-center justify-center overflow-visible rounded-xl border border-[#333347] bg-[rgba(38,38,52,0.8)] px-2.5 pt-1.25 pb-1.75 text-[0.8125rem] leading-none font-normal tracking-tighter text-gray-10">
            {category}
          </span>
        </div>

        <div className="flex w-full flex-col items-start gap-6">
          <TemplateBadgeRow title="MCP connectors" items={connectors} />
          <TemplateBadgeRow title="Channels" items={channels} />
        </div>
      </div>

      <div className="relative z-10 w-full">
        <TemplateCardButton templateTitle={title} />
      </div>
    </article>
  )
}

function TemplateFilters({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: TemplateCategory
  onCategoryChange: (category: TemplateCategory) => void
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
    <section className="categories-list w-full max-w-full md:overflow-hidden">
      <h2 className="sr-only">Template categories</h2>
      <nav className="relative -mx-5 md:mx-0" aria-label="Template categories">
        <ScrollArea className="w-full" ref={scrollAreaRef}>
          <ul className="flex h-7.5 w-full items-center px-5 md:pl-0">
            {TEMPLATE_CATEGORIES.map((category) => {
              const isActive = category === activeCategory

              return (
                <li key={category} data-active={isActive}>
                  <button
                    type="button"
                    className={cn(
                      "relative inline-flex h-7.5 items-center justify-center overflow-visible rounded-full border px-3 text-sm leading-none tracking-tight whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-lagune-3/40 motion-reduce:transition-none",
                      isActive
                        ? "border-[#81869E] text-white"
                        : "border-background text-gray-8 hover:text-white"
                    )}
                    aria-pressed={isActive}
                    onClick={() => onCategoryChange(category)}
                  >
                    {category}
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
    </section>
  )
}

function TemplatesList({
  templates,
  isExpanded,
  extraListId,
}: {
  templates: ITemplateCard[]
  isExpanded: boolean
  extraListId: string
}) {
  const primaryTemplates = templates.slice(0, INITIAL_TEMPLATE_COUNT)
  const extraTemplates = templates.slice(INITIAL_TEMPLATE_COUNT)

  return (
    <div className="flex w-full flex-col items-center">
      <ul className="grid w-full grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
        {primaryTemplates.map((template) => (
          <li key={template.title} className="min-w-0">
            <TemplateCard {...template} />
          </li>
        ))}
      </ul>

      {extraTemplates.length > 0 && (
        <div
          id={extraListId}
          className={cn(
            "grid w-full overflow-hidden transition-[grid-template-rows,margin-top,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            isExpanded
              ? "mt-7 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0"
          )}
          aria-hidden={!isExpanded}
          inert={isExpanded ? undefined : true}
        >
          <div className="min-h-0 overflow-hidden">
            <ul
              className={cn(
                "grid w-full grid-cols-1 gap-7 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:grid-cols-2 xl:grid-cols-3 xl:gap-x-8",
                isExpanded ? "translate-y-0" : "translate-y-4"
              )}
            >
              {extraTemplates.map((template) => (
                <li key={template.title} className="min-w-0">
                  <TemplateCard {...template} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

function Templates() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>("All")
  const [isExpanded, setIsExpanded] = useState(false)
  const extraListId = useId()
  const visibleTemplates = useMemo(() => {
    if (activeCategory === "All") {
      return TEMPLATES
    }

    return TEMPLATES.filter((template) => template.category === activeCategory)
  }, [activeCategory])
  const hasExpandableTemplates =
    activeCategory === "All" && visibleTemplates.length > INITIAL_TEMPLATE_COUNT

  const handleCategoryChange = (category: TemplateCategory) => {
    setActiveCategory(category)
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
                <span className="block md:whitespace-nowrap">
                  Start faster with
                </span>
                <span className="block md:whitespace-nowrap">
                  Novu Connect templates
                </span>
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
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-7">
          {visibleTemplates.length > 0 ? (
            <TemplatesList
              templates={visibleTemplates}
              isExpanded={activeCategory === "All" && isExpanded}
              extraListId={extraListId}
            />
          ) : (
            <div className="flex min-h-107 w-full items-center justify-center rounded-xl border border-[rgba(51,51,71,0.5)] bg-[rgba(15,15,21,0.8)] px-6 text-center text-base leading-normal font-book tracking-tighter text-gray-8">
              No templates in this category yet.
            </div>
          )}

          {hasExpandableTemplates && (
            <button
              type="button"
              className="group flex items-center gap-1 text-[0.9375rem] leading-snug font-book tracking-normal text-lagune-3 transition-colors duration-200 ease-out outline-none hover:text-lagune-1 focus-visible:ring-2 focus-visible:ring-lagune-3/40 motion-reduce:transition-none"
              aria-expanded={isExpanded}
              aria-controls={extraListId}
              onClick={() => setIsExpanded((current) => !current)}
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
      </div>
    </section>
  )
}

export default Templates
