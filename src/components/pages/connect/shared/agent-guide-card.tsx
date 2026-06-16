"use client"

/* eslint-disable @next/next/no-img-element */
import type { Route } from "next"
import NextLink from "next/link"

import { temporarilyDisableSmoothScroll } from "@/lib/scroll"
import { cn } from "@/lib/utils"

import AgentAuthorLine from "./agent-author-line"

export interface IAgentGuideImage {
  url: string
  alt?: string
}

export interface IAgentGuideBadge {
  label: string
  icon?: IAgentGuideImage | null
}

export interface IAgentGuideCardData {
  id: string
  title: string
  heading?: string
  agent?: string | null
  agentCompany?: string | null
  category?: string
  quote: string
  avatar?: IAgentGuideImage | null
  connectors: IAgentGuideBadge[]
  channels: IAgentGuideBadge[]
  href: Route<string> | URL
}

const CARD_HOVER_BACKGROUND =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 384 428' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.11999999731779099'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-32.568 46.387 -88.035 -76.748 313.18 14.627)'><stop stop-color='rgba(102,122,152,1)' offset='0'/><stop stop-color='rgba(102,122,152,0)' offset='0.88967'/></radialGradient></defs></svg>\"), linear-gradient(90deg, rgba(15, 15, 21, 0.8) 0%, rgba(15, 15, 21, 0.8) 100%)"
const BUTTON_BACKGROUND =
  "linear-gradient(210.097deg, rgba(176, 166, 191, 0.06) 8.6198%, rgba(176, 166, 191, 0.03) 113.79%)"
const BUTTON_HOVER_BACKGROUND =
  "linear-gradient(210.097deg, rgba(176, 166, 191, 0.24) 8.6198%, rgba(176, 166, 191, 0.12) 113.79%)"

function GuideAvatar({ image }: { image?: IAgentGuideImage | null }) {
  return (
    <span className="relative size-11 shrink-0 overflow-hidden">
      {image?.url && (
        <img
          src={image.url}
          alt={image.alt ?? ""}
          aria-hidden={image.alt ? undefined : true}
          className="block size-full object-contain"
        />
      )}
    </span>
  )
}

function GuideIcon({ image }: { image?: IAgentGuideImage | null }) {
  return (
    <span className="relative size-5 shrink-0 overflow-hidden">
      {image?.url && (
        <img
          src={image.url}
          alt={image.alt ?? ""}
          aria-hidden={image.alt ? undefined : true}
          className="block size-full object-contain"
        />
      )}
    </span>
  )
}

function GuideCardBadge({ label, icon }: IAgentGuideBadge) {
  return (
    <span className="flex min-h-8 max-w-full shrink-0 items-center gap-1 rounded border border-connect-card-border py-1.5 pr-2.5 pl-1.5">
      <GuideIcon image={icon} />
      <span className="min-w-0 text-[0.9375rem] leading-snug font-normal tracking-normal whitespace-nowrap text-gray-10">
        {label}
      </span>
    </span>
  )
}

function GuideBadgeRow({
  title,
  items,
  className,
}: {
  title: string
  items: IAgentGuideBadge[]
  className?: string
}) {
  if (!items.length) {
    return null
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col items-start justify-center gap-3",
        className
      )}
    >
      <p className="w-full overflow-visible text-[0.9375rem] leading-none font-book tracking-normal text-gray-7">
        {title}
      </p>
      <div className="flex w-full flex-wrap items-center gap-2">
        {items.map((item) => (
          <GuideCardBadge key={item.label} {...item} />
        ))}
      </div>
    </div>
  )
}

function GuideCardButton({
  href,
  cardId,
  title,
  label,
  clickLocation,
  newTab = false,
}: {
  href: Route<string> | URL
  cardId: string
  title: string
  label: string
  clickLocation: string
  newTab?: boolean
}) {
  return (
    <NextLink
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      onNavigate={() => temporarilyDisableSmoothScroll()}
      className="group/button relative flex h-10 w-full items-center justify-center overflow-visible rounded border border-[#534b5d] px-5 py-3.5 text-center text-xs leading-none font-medium tracking-normal text-white uppercase transition-[border-color] duration-200 ease-out outline-none hover:border-[#686170] focus-visible:border-[#686170] focus-visible:ring-2 focus-visible:ring-lagune-3/40 motion-reduce:transition-none"
      style={{ backgroundImage: BUTTON_BACKGROUND }}
      aria-label={`${label} for ${title}`}
      data-click-location={clickLocation}
      data-click-text={`${label.toLowerCase().replace(/\s+/g, "_")}_${cardId}`}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded opacity-0 transition-opacity duration-200 ease-out group-hover/button:opacity-100 group-focus-visible/button:opacity-100 motion-reduce:transition-none"
        style={{ backgroundImage: BUTTON_HOVER_BACKGROUND }}
        aria-hidden
      />
      <span className="relative z-10">{label}</span>
    </NextLink>
  )
}

function AgentGuideCard({
  card,
  buttonLabel,
  clickLocation,
  newTab,
  showCategory = true,
  compactBadges = false,
}: {
  card: IAgentGuideCardData
  buttonLabel: string
  clickLocation: string
  newTab?: boolean
  showCategory?: boolean
  compactBadges?: boolean
}) {
  const heading = card.heading ?? card.title

  return (
    <article
      className="group/card relative flex h-full min-h-107 w-full flex-col items-start overflow-hidden rounded-xl border border-connect-card-border bg-[rgba(15,15,21,0.8)] p-7 transition-[border-color] duration-200 ease-out focus-within:border-[rgba(51,51,71,0.65)] motion-reduce:transition-none"
      data-template-card
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 ease-out group-focus-within/card:opacity-100 group-hover/card:opacity-100 motion-reduce:transition-none"
        style={{ backgroundImage: CARD_HOVER_BACKGROUND }}
        aria-hidden
      />

      <div className="relative z-10 flex w-full flex-1 flex-col items-start gap-6">
        <div className="flex w-full flex-col items-start gap-6">
          <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4.5">
            <GuideAvatar image={card.avatar} />

            <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-3 gap-y-2">
              <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2 overflow-visible leading-none">
                <span className="max-w-full overflow-visible text-lg leading-tight font-medium tracking-tighter text-white">
                  {heading}
                </span>
                <AgentAuthorLine
                  name={card.agent}
                  company={card.agentCompany}
                />
              </div>

              {showCategory && card.category && (
                <span className="flex h-6.25 shrink-0 items-center justify-center overflow-visible rounded-xl border border-[#333347] bg-[rgba(38,38,52,0.8)] px-2.5 pt-1.25 pb-1.75 text-[0.8125rem] leading-none font-normal tracking-tighter text-gray-10">
                  {card.category}
                </span>
              )}
            </div>
          </div>

          <p className="min-h-16.5 w-full text-base leading-snug font-light tracking-normal text-gray-9">
            {card.quote}
          </p>
        </div>

        <div
          className={cn(
            "flex w-full flex-col items-start gap-6",
            compactBadges && "lg:flex-row lg:items-start lg:gap-6"
          )}
        >
          <GuideBadgeRow
            title="MCP connectors"
            items={card.connectors}
            className={compactBadges ? "lg:w-50 lg:shrink-0" : undefined}
          />
          <GuideBadgeRow title="Channels" items={card.channels} />
        </div>
      </div>

      <div className="relative z-10 mt-auto w-full pt-8">
        <GuideCardButton
          href={card.href}
          cardId={card.id}
          title={card.title}
          label={buttonLabel}
          clickLocation={clickLocation}
          newTab={newTab}
        />
      </div>
    </article>
  )
}

export default AgentGuideCard
