"use client"

import { useId, useState } from "react"
import config from "@/configs/website-config"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import IntegrationCard, { type IIntegrationCardProps } from "./integration-card"

export interface IIntegrationChannelCategoryGroup {
  slug: string
  title: string
  description?: string
  cards: IIntegrationCardProps[]
}

export interface IIntegrationChannelCategoryProps {
  title: string
  count?: number
  description: string
  cards?: IIntegrationCardProps[]
  groups?: IIntegrationChannelCategoryGroup[]
  showMoreLabel?: string
  sectionId?: string
  className?: string
}

function IntegrationChannelCategory({
  title,
  count,
  description,
  cards,
  groups,
  showMoreLabel: showMoreLabelProp,
  sectionId,
  className,
}: IIntegrationChannelCategoryProps) {
  const headingId = useId()
  const [expanded, setExpanded] = useState(false)
  const showMoreLabel = showMoreLabelProp ?? "Show more"
  const showLessLabel = "Show less"

  const flatCards = cards ?? []
  const hasOverflow = flatCards.length > config.integrations.visibleCardsCount
  const visibleCards = hasOverflow
    ? flatCards.slice(0, config.integrations.visibleCardsCount)
    : flatCards
  const hiddenCards = hasOverflow
    ? flatCards.slice(config.integrations.visibleCardsCount)
    : []

  const gridClassName = "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={cn("flex w-full scroll-mt-28 flex-col gap-7", className)}
      data-slot="integration-channel-category"
    >
      <div className="flex max-w-xl flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2
            id={headingId}
            className="font-display text-2xl tracking-tighter text-foreground"
          >
            {title}
          </h2>
          {count != null ? (
            <span
              className={cn(
                "inline-flex h-4 min-w-[1.375rem] items-center justify-center rounded-full border border-white/50",
                "bg-gradient-to-b from-[hsl(var(--integration-count-badge-from))] to-[hsl(var(--integration-count-badge-to))]",
                "px-[0.3125rem] text-xs leading-none font-normal tracking-tighter text-black"
              )}
            >
              {count}
            </span>
          ) : null}
        </div>
        <p className="max-w-74 text-[0.9375rem] leading-snug font-book tracking-tighter text-gray-8">
          {description}
        </p>
      </div>

      {groups ? (
        <div className="flex w-full flex-col gap-8">
          {groups.map((group) => (
            <div key={group.slug} className="flex w-full flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-base tracking-tighter text-foreground">
                  {group.title}
                </h3>
                {group.description ? (
                  <p className="max-w-md text-sm leading-snug font-book tracking-tighter text-gray-8">
                    {group.description}
                  </p>
                ) : null}
              </div>
              <ul className={gridClassName}>
                {group.cards.map((card) => (
                  <li
                    key={`${card.title}-${card.iconSrc}`}
                    className="h-full min-w-0"
                  >
                    <IntegrationCard {...card} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3">
          <ul className={gridClassName}>
            {visibleCards.map((card) => (
              <li
                key={`${card.title}-${card.iconSrc}`}
                className="h-full min-w-0"
              >
                <IntegrationCard {...card} />
              </li>
            ))}
          </ul>

          {hasOverflow ? (
            <Collapsible
              className="flex w-full flex-col"
              onOpenChange={setExpanded}
            >
              <CollapsibleContent>
                <ul className={gridClassName}>
                  {hiddenCards.map((card) => (
                    <li
                      key={`${card.title}-${card.iconSrc}`}
                      className="h-full min-w-0"
                    >
                      <IntegrationCard {...card} />
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
              <div className="mt-3 flex justify-center">
                <CollapsibleTrigger
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1 text-[0.9375rem] font-book tracking-tighter text-lagune-3",
                    "hover:text-lagune-2",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                  )}
                >
                  {expanded ? showLessLabel : showMoreLabel}
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 transition-transform duration-200",
                      expanded && "rotate-180"
                    )}
                    aria-hidden
                  />
                </CollapsibleTrigger>
              </div>
            </Collapsible>
          ) : null}
        </div>
      )}
    </section>
  )
}

export default IntegrationChannelCategory
