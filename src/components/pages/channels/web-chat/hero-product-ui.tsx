"use client"

import {
  HERO_DEFAULT_COMPANY,
  HERO_DEFAULT_DOMAIN,
  HERO_TABLE_DEFAULT,
  HERO_TABLE_PERSONALIZED,
} from "@/data/pages/web-chat"
import {
  STORYBOARD_TIMING,
  type StoryboardPhase,
} from "@/data/pages/web-chat-storyboard"

import { cn } from "@/lib/utils"
import type { WebChatBrand } from "@/components/pages/channels/web-chat/brand-provider"
import { ChromeBar } from "@/components/pages/channels/web-chat/browser-chrome"
import {
  DataTable,
  type HeroTable,
} from "@/components/pages/channels/web-chat/data-table"
import { Sidebar } from "@/components/pages/channels/web-chat/sidebar-nav"

export interface HeroProductUIProps {
  phase: StoryboardPhase
  /** The brand currently revealed by the hero, rather than the pending fetch. */
  brand: WebChatBrand
  personalizedTable: boolean
}

export function HeroProductUI({
  phase,
  brand,
  personalizedTable,
}: HeroProductUIProps) {
  const { domain, favicon } = brand
  const isPersonalized = brand.status === "personalized"

  const table: HeroTable = personalizedTable
    ? HERO_TABLE_PERSONALIZED
    : HERO_TABLE_DEFAULT
  const domainLabel = isPersonalized && domain ? domain : HERO_DEFAULT_DOMAIN
  const companyLabel = isPersonalized && domain ? domain : HERO_DEFAULT_COMPANY
  const faviconUrl = isPersonalized ? favicon : null
  const isTransitioning = phase === "grayscale" || phase === "waiting"
  const duration = isTransitioning
    ? STORYBOARD_TIMING.blurMs
    : STORYBOARD_TIMING.recolorMs

  return (
    <div className="relative lg:min-w-0 lg:flex-1">
      {/* Desktop: chrome + sidebar + table. Fills whatever width the shared
          card (`HeroLiveUi` in hero.tsx) leaves it next to the agent panel
          — no border/bg/shadow of its own, since that chrome now lives on
          the shared outer card so the two don't read as separate boxes. */}
      <div className="relative hidden overflow-hidden lg:flex lg:h-full lg:flex-col">
        <ChromeBar domain={domainLabel} />
        <div
          data-slot="hero-dashboard-content"
          className={cn(
            "flex min-h-0 flex-1 transition-[filter] ease-out motion-reduce:blur-none! motion-reduce:transition-none!",
            isTransitioning && "blur-md"
          )}
          style={{ transitionDuration: `${duration}ms` }}
        >
          <Sidebar companyLabel={companyLabel} faviconUrl={faviconUrl} />
          <DataTable table={table} />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[52px] bottom-0 bg-linear-to-b from-transparent to-black to-[86.463%]"
        />
      </div>

      {/* Mobile: the dashboard slice only, at its natural size — not a
          scaled desktop. Figma `45487-112573`: the `ui` group
          (`45487-112600`, 636×317) sits at absolute x -296 on a 360
          viewport, bleeding off the left edge with the dashboard on the
          left (mostly clipped) and the agent panel immediately beside it,
          fully visible. Sizing that bleed needs a shared frame around both
          pieces, so the clipping, the -296px offset and the adjacency to
          `HeroAgentPanel` all live one level up, in `HeroLiveUi`
          (hero.tsx) — this piece just renders at its own fixed 438×317. */}
      <div className="flex h-[317px] w-[438px] shrink-0 flex-col overflow-hidden lg:hidden">
        <ChromeBar domain={domainLabel} compact />
        <div
          data-slot="hero-dashboard-content"
          className={cn(
            "flex flex-1 transition-[filter] ease-out motion-reduce:blur-none! motion-reduce:transition-none!",
            isTransitioning && "blur-md"
          )}
          style={{ transitionDuration: `${duration}ms` }}
        >
          <Sidebar
            companyLabel={companyLabel}
            faviconUrl={faviconUrl}
            compact
          />
          <DataTable table={table} compact />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[24.24px] bottom-0 bg-linear-to-b from-transparent to-black to-[86.463%]"
        />
      </div>
    </div>
  )
}
