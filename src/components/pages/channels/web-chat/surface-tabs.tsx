"use client"

import {
  SURFACE_TABS_BUTTON_HREF,
  SURFACE_TABS_BUTTON_LABEL,
  SURFACE_TABS_DESCRIPTION,
  SURFACE_TABS_HEADING,
  SURFACE_TABS_IMAGE_ALT,
  SURFACE_TABS_TAB_LABELS,
} from "@/data/pages/web-chat-surface-tabs"
import fullScreenMobile from "@/images/pages/channels/web-chat/surface-full-screen-mobile.jpg"
import fullScreen from "@/images/pages/channels/web-chat/surface-full-screen.jpg"
import sidePanelMobile from "@/images/pages/channels/web-chat/surface-side-panel-mobile.jpg"
import sidePanel from "@/images/pages/channels/web-chat/surface-side-panel.jpg"

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { SurfaceTabsIllustration } from "./surface-tabs-illustration"

const TAB_TRIGGER_CLASS = cn(
  "flex-1 rounded-[6px] px-6 py-3.5 text-base font-medium tracking-[-0.02em] text-[#8A8C99]",
  "data-[state=active]:bg-white data-[state=active]:text-black"
)

const TABS_CONTENT_CLASS = "mt-10 data-[state=inactive]:hidden lg:mt-14"

/**
 * Both tab states use the original desktop and mobile Figma illustrations.
 * Tabs and the AI Elements link remain interactive; preview UI is decorative.
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
          <SurfaceTabsIllustration
            alt={SURFACE_TABS_IMAGE_ALT.sidePanel}
            desktop={sidePanel}
            mobile={sidePanelMobile}
          />
        </TabsContent>

        <TabsContent
          value="full-screen"
          forceMount
          className={TABS_CONTENT_CLASS}
        >
          <SurfaceTabsIllustration
            alt={SURFACE_TABS_IMAGE_ALT.fullScreen}
            desktop={fullScreen}
            mobile={fullScreenMobile}
          />
        </TabsContent>
      </Tabs>
    </section>
  )
}
