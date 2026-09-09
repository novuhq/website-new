"use client"

import {
  HERO_DEFAULT_COMPANY,
  HERO_DEFAULT_DOMAIN,
  HERO_TABLE_DEFAULT,
  HERO_TABLE_PERSONALIZED,
} from "@/data/pages/web-chat"
import {
  STORYBOARD_TIMING,
  type StoryboardStep,
} from "@/data/pages/web-chat-storyboard"

import { cn } from "@/lib/utils"
import { useWebChatBrand } from "@/components/pages/channels/web-chat/brand-provider"
import { ChromeBar } from "@/components/pages/channels/web-chat/browser-chrome"
import {
  DataTable,
  type HeroTable,
} from "@/components/pages/channels/web-chat/data-table"
import { Sidebar } from "@/components/pages/channels/web-chat/sidebar-nav"

export interface HeroProductUIProps {
  /** `null` is the pre-submit default state. 0-5 are live storyboard steps. */
  step: StoryboardStep | null
  /**
   * Whether brand extraction actually succeeded (`status === "personalized"`).
   * Separate from `step`: the table and accents advance on the fallback path
   * too, but labels (domain/company/favicon) only change here.
   */
  isPersonalized: boolean
}

export function HeroProductUI({ step, isPersonalized }: HeroProductUIProps) {
  const { domain, favicon } = useWebChatBrand()

  const table: HeroTable =
    step === null ? HERO_TABLE_DEFAULT : HERO_TABLE_PERSONALIZED
  const domainLabel = isPersonalized && domain ? domain : HERO_DEFAULT_DOMAIN
  const companyLabel = isPersonalized && domain ? domain : HERO_DEFAULT_COMPANY
  const faviconUrl = isPersonalized ? favicon : null
  const isTransitioning = step === 0

  return (
    <div className="relative md:min-w-0 md:flex-1">
      {/* Desktop: chrome + sidebar + table. Fills whatever width the shared
          card (`HeroLiveUi` in hero.tsx) leaves it next to the agent panel
          — no border/bg/shadow of its own, since that chrome now lives on
          the shared outer card so the two don't read as separate boxes. */}
      {/* `md:bg-black`: Figma's card fill fades to transparent below 58%
          (we match that gradient exactly), but the frame never shows it —
          the dashboard's own children are opaque, so every point inside the
          card measures 1-6/255. Without this the glow came through the
          card's lower third at up to 137/255. */}
      <div className="relative hidden overflow-hidden md:flex md:h-full md:flex-col md:bg-black">
        <ChromeBar domain={domainLabel} />
        <div
          className={cn(
            "flex min-h-[680px] flex-1 transition-[filter] ease-out",
            isTransitioning && "blur-md"
          )}
          style={{ transitionDuration: `${STORYBOARD_TIMING.blurMs}ms` }}
        >
          <Sidebar companyLabel={companyLabel} faviconUrl={faviconUrl} />
          <DataTable table={table} />
        </div>
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
      <div className="flex h-[317px] w-[438px] shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-black md:hidden">
        <ChromeBar domain={domainLabel} compact />
        <div
          className={cn(
            "flex flex-1 transition-[filter] ease-out",
            isTransitioning && "blur-md"
          )}
          style={{ transitionDuration: `${STORYBOARD_TIMING.blurMs}ms` }}
        >
          <Sidebar
            companyLabel={companyLabel}
            faviconUrl={faviconUrl}
            compact
          />
          <DataTable table={table} compact />
        </div>
      </div>
    </div>
  )
}
