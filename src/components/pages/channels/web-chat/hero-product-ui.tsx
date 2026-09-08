"use client"

import {
  HERO_DEFAULT_COMPANY,
  HERO_DEFAULT_DOMAIN,
  HERO_TABLE_DEFAULT,
  HERO_TABLE_PERSONALIZED,
} from "@/data/pages/web-chat"
import type { StoryboardStep } from "@/data/pages/web-chat-storyboard"

import { cn } from "@/lib/utils"
import { useWebChatBrand } from "@/components/pages/channels/web-chat/brand-provider"
import { ChromeBar } from "@/components/pages/channels/web-chat/browser-chrome"
import {
  DataTable,
  type HeroTable,
} from "@/components/pages/channels/web-chat/data-table"
import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"
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

/**
 * Ambient brand glow behind the mockup: a large blurred ellipse, hidden at
 * idle/fallback and faded in at loading/personalized (mirroring HueLayer's
 * own visibility), with `HueLayer` layered on top per Task 4's architecture.
 * Figma: desktop `❖color` #45487:89840 / mobile `❖color` #45487:113300 —
 * both a brand-accent ellipse at `blur(174px)`.
 */
function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 h-[70%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[100px] transition-opacity duration-700 group-data-[wc-state=loading]:opacity-50 group-data-[wc-state=personalized]:opacity-50"
        style={{ backgroundColor: "var(--wc-accent)" }}
      />
      <HueLayer />
    </div>
  )
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
    <div className="relative">
      {/* Desktop: chrome + sidebar + table, ~940px (256 sidebar + 684 main). */}
      <div className="relative hidden overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_-2px_24px_0_rgba(0,0,0,0.45)] md:flex md:w-[940px] md:flex-col">
        <AmbientGlow />
        <ChromeBar domain={domainLabel} />
        <div
          className={cn(
            "flex min-h-[680px] transition-[filter] duration-500 ease-out",
            isTransitioning && "blur-md"
          )}
        >
          <Sidebar companyLabel={companyLabel} faviconUrl={faviconUrl} />
          <DataTable table={table} />
        </div>
      </div>

      {/* Mobile: its own composition (not a scaled desktop). Figma
          45487-112573: the 636×317 `ui` group sits at absolute x -296 on a
          360 viewport, so the dashboard piece (sidebar 119 + main 319 = 438
          wide) bleeds off the left edge — only its right sliver is visible
          before Task 8's conversation panel picks up beside it. */}
      <div className="relative h-[318px] w-full max-w-[360px] overflow-hidden rounded-xl border border-white/10 bg-black md:hidden">
        <AmbientGlow />
        <div className="absolute top-0 left-[-296px] flex w-[438px] flex-col">
          <ChromeBar domain={domainLabel} compact />
          <div
            className={cn(
              "flex transition-[filter] duration-500 ease-out",
              isTransitioning && "blur-md"
            )}
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
    </div>
  )
}
