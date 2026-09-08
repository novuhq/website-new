"use client"

import {
  FULL_SCREEN_CHECKLIST,
  FULL_SCREEN_COMPOSER_DRAFT,
  FULL_SCREEN_MESSAGES,
  FULL_SCREEN_SIDEBAR_ITEMS,
  SIDE_PANEL_COMPOSER_PLACEHOLDER,
  SIDE_PANEL_MESSAGES,
  SIDE_PANEL_SIDEBAR_ITEMS,
  SURFACE_TABS_BUTTON_HREF,
  SURFACE_TABS_BUTTON_LABEL,
  SURFACE_TABS_DESCRIPTION,
  SURFACE_TABS_HEADING,
  SURFACE_TABS_TAB_LABELS,
} from "@/data/pages/web-chat-surface-tabs"

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { SurfaceTabsIllustration } from "./surface-tabs-illustration"

const TAB_TRIGGER_CLASS = cn(
  "flex-1 rounded-[6px] px-6 py-3.5 text-base font-medium tracking-[-0.02em] text-[#8A8C99]",
  "data-[state=active]:bg-white data-[state=active]:text-black"
)

const TABS_CONTENT_CLASS = "mt-10 data-[state=inactive]:hidden lg:mt-14"

/**
 * §4 "Side panel or full screen. Your choice" (Task 11). A tabbed
 * comparison of the two ways to embed Web Chat: docked in a side panel, or
 * as the full-screen primary surface. Full screen is not a resize of Side
 * panel — it swaps the sidebar's nav group and carries a different
 * conversation (a launch-readiness review with a checklist and a
 * partially-typed composer). Not personalized: every colour here is a fixed
 * Figma literal, no `--wc-accent*` custom properties.
 *
 * Figma: Side panel desktop `45487-80419`, Full screen desktop
 * `45497-141044`, Full screen mobile `45497-139685`, Side panel mobile read
 * from the mobile page frame `45487-98982` (its `45497-139684` section).
 * Desktop puts heading+button left, description+tabs right, with the
 * illustration spanning the full width below; mobile stacks
 * heading → button → description+tabs → illustration, and both mobile
 * illustrations bleed off the viewport edges.
 */
export function SurfaceTabs() {
  return (
    <section className="mx-auto max-w-[1344px]">
      <Tabs defaultValue="side-panel">
        <div className="flex flex-col gap-8 px-5 md:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:px-8">
          <div className="flex flex-col gap-6 lg:max-w-[495px]">
            <h2 className="text-[32px] leading-[1.04] tracking-[-0.04em] text-balance text-white lg:text-[48px]">
              {SURFACE_TABS_HEADING}
            </h2>
            <a
              href={SURFACE_TABS_BUTTON_HREF}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-md border border-white px-5 py-3.5 text-base font-medium tracking-[-0.025em] text-white transition-colors hover:bg-white hover:text-black"
            >
              {SURFACE_TABS_BUTTON_LABEL}
            </a>
          </div>

          <div className="flex flex-col gap-6 lg:max-w-[416px]">
            <p className="text-base leading-[1.5] tracking-[-0.025em] text-[#A3A6B2] lg:text-lg">
              {SURFACE_TABS_DESCRIPTION}
            </p>
            <TabsList className="h-11 w-full gap-0 rounded-md border border-[#41434D] bg-black/50 p-0">
              <TabsTrigger value="side-panel" className={TAB_TRIGGER_CLASS}>
                {SURFACE_TABS_TAB_LABELS.sidePanel}
              </TabsTrigger>
              <TabsTrigger value="full-screen" className={TAB_TRIGGER_CLASS}>
                {SURFACE_TABS_TAB_LABELS.fullScreen}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent
          value="side-panel"
          forceMount
          className={TABS_CONTENT_CLASS}
        >
          {/* desktop */}
          <div className="hidden overflow-x-auto lg:block">
            <SurfaceTabsIllustration
              canvasWidth={1344}
              canvasHeight={613}
              sidebarWidth={304}
              sidebarItems={SIDE_PANEL_SIDEBAR_ITEMS}
              chatBox={{ left: 882, top: 16, width: 444, height: 488 }}
              showTable
              messages={SIDE_PANEL_MESSAGES}
              composerPlaceholder={SIDE_PANEL_COMPOSER_PLACEHOLDER}
            />
          </div>
          {/* mobile — the section itself has no horizontal padding below its 1344px cap, so this spans flush edge-to-edge, matching the Figma mobile frame's inset-0 illustration */}
          <div className="relative h-[242px] w-full overflow-hidden lg:hidden">
            <SurfaceTabsIllustration
              canvasWidth={528}
              canvasHeight={242}
              sidebarWidth={119}
              sidebarItems={SIDE_PANEL_SIDEBAR_ITEMS}
              chatBox={{ left: 347, top: 6, width: 174, height: 193 }}
              showTable
              messages={SIDE_PANEL_MESSAGES}
              composerPlaceholder={SIDE_PANEL_COMPOSER_PLACEHOLDER}
              compact
              className="absolute left-1/2 -translate-x-1/2"
            />
          </div>
        </TabsContent>

        <TabsContent
          value="full-screen"
          forceMount
          className={TABS_CONTENT_CLASS}
        >
          {/* desktop */}
          <div className="hidden overflow-x-auto lg:block">
            <SurfaceTabsIllustration
              canvasWidth={1344}
              canvasHeight={613}
              sidebarWidth={341}
              sidebarItems={FULL_SCREEN_SIDEBAR_ITEMS}
              chatBox={{ left: 357, top: 16, width: 969, height: 488 }}
              messages={FULL_SCREEN_MESSAGES}
              checklist={FULL_SCREEN_CHECKLIST}
              composerDraft={FULL_SCREEN_COMPOSER_DRAFT}
            />
          </div>
          {/* mobile — the section itself has no horizontal padding below its 1344px cap, so this spans flush edge-to-edge, matching the Figma mobile frame's inset-0 illustration */}
          <div className="relative h-[242px] w-full overflow-hidden lg:hidden">
            <SurfaceTabsIllustration
              canvasWidth={528}
              canvasHeight={242}
              sidebarWidth={134}
              sidebarItems={FULL_SCREEN_SIDEBAR_ITEMS}
              chatBox={{ left: 178, top: 6, width: 343, height: 193 }}
              messages={FULL_SCREEN_MESSAGES}
              checklist={FULL_SCREEN_CHECKLIST}
              composerDraft={FULL_SCREEN_COMPOSER_DRAFT}
              compact
              className="absolute left-1/2 -translate-x-1/2"
            />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
