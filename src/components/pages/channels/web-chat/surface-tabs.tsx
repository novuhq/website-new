"use client"

import { useState } from "react"
import {
  SURFACE_TABS_BUTTON_HREF,
  SURFACE_TABS_BUTTON_LABEL,
  SURFACE_TABS_DESCRIPTION,
  SURFACE_TABS_HEADING,
  SURFACE_TABS_IMAGE_ALT,
  SURFACE_TABS_TAB_LABELS,
} from "@/data/pages/web-chat-surface-tabs"
import fullScreenLaptop from "@/images/pages/channels/web-chat/surface-full-screen-laptop.jpg"
import fullScreenMobile from "@/images/pages/channels/web-chat/surface-full-screen-mobile.jpg"
import fullScreenTablet from "@/images/pages/channels/web-chat/surface-full-screen-tablet.jpg"
import fullScreen from "@/images/pages/channels/web-chat/surface-full-screen.jpg"
import sidePanelLaptop from "@/images/pages/channels/web-chat/surface-side-panel-laptop.jpg"
import sidePanelMobile from "@/images/pages/channels/web-chat/surface-side-panel-mobile.jpg"
import sidePanelTablet from "@/images/pages/channels/web-chat/surface-side-panel-tablet.jpg"
import sidePanel from "@/images/pages/channels/web-chat/surface-side-panel.jpg"

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { SurfaceTabsIllustration } from "./surface-tabs-illustration"

const [headingStart, headingEnd] = SURFACE_TABS_HEADING.split(" screen.")
const [descriptionStart, descriptionEnd] =
  SURFACE_TABS_DESCRIPTION.split(" with ")

const TAB_TRIGGER_CLASS = cn(
  "h-full min-w-0 flex-1 rounded-none px-6 py-0 text-base leading-none font-normal tracking-[-0.02em] text-gray-60",
  "data-[state=active]:bg-white data-[state=active]:font-medium data-[state=active]:tracking-[-0.025em] data-[state=active]:text-black",
  "focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gray-60 focus-visible:outline-solid"
)

const TABS_CONTENT_CLASS =
  "col-start-1 row-start-1 mt-0 min-w-0 transition-[opacity,filter] duration-400 ease-out data-[state=active]:opacity-100 data-[state=active]:blur-none data-[state=inactive]:pointer-events-none data-[state=inactive]:opacity-0 data-[state=inactive]:blur-sm motion-reduce:transition-none motion-reduce:data-[state=inactive]:blur-none"

/**
 * Each breakpoint uses its authored Figma composition for both tab states.
 * Tabs and the AI Elements link remain interactive; preview UI is decorative.
 */
export function SurfaceTabs() {
  const [activeTab, setActiveTab] = useState("side-panel")

  return (
    <section className="mx-auto w-full max-w-3xl lg:max-w-336">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col gap-14 px-5 md:gap-12 md:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:px-8">
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-6 lg:min-h-38 lg:w-[495px] lg:flex-col lg:items-start lg:justify-start">
            <h2 className="text-[32px] leading-[1.04] tracking-[-0.04em] text-balance text-white md:text-4xl lg:text-[40px] xl:text-[48px]">
              {headingStart}
              <br className="hidden md:block xl:hidden" />
              {` screen.${headingEnd}`}
            </h2>
            <a
              href={SURFACE_TABS_BUTTON_HREF}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 items-center justify-center gap-1.5 rounded-md border border-white px-5 text-base leading-none font-medium tracking-[-0.025em] text-white transition-colors hover:bg-white hover:text-black md:mb-1.25 md:shrink-0 md:self-end lg:mb-0 lg:self-start"
            >
              {SURFACE_TABS_BUTTON_LABEL}
            </a>
          </div>

          <div className="flex flex-col gap-5 md:gap-6 lg:w-104 lg:shrink-0">
            <p className="text-base leading-[1.5] tracking-[-0.025em] text-gray-70 lg:text-lg">
              {descriptionStart}
              <br className="hidden md:block xl:hidden" />
              {` with ${descriptionEnd}`}
            </p>
            <TabsList className="h-11 w-full gap-0 overflow-hidden rounded-md border border-gray-30 bg-black/50 p-0">
              <TabsTrigger value="side-panel" className={TAB_TRIGGER_CLASS}>
                {SURFACE_TABS_TAB_LABELS.sidePanel}
              </TabsTrigger>
              <TabsTrigger value="full-screen" className={TAB_TRIGGER_CLASS}>
                {SURFACE_TABS_TAB_LABELS.fullScreen}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Keep both illustrations in one grid cell so interrupted fades can
            reverse smoothly without changing the section's height. */}
        <div className="mt-8 grid md:mt-10 md:px-8 lg:mt-12 xl:mt-16 xl:px-0">
          <TabsContent
            value="side-panel"
            forceMount
            aria-hidden={activeTab !== "side-panel"}
            inert={activeTab !== "side-panel"}
            tabIndex={activeTab === "side-panel" ? 0 : -1}
            className={TABS_CONTENT_CLASS}
          >
            <SurfaceTabsIllustration
              alt={SURFACE_TABS_IMAGE_ALT.sidePanel}
              desktop={sidePanel}
              mobile={sidePanelMobile}
              tablet={sidePanelTablet}
              laptop={sidePanelLaptop}
            />
          </TabsContent>

          <TabsContent
            value="full-screen"
            forceMount
            aria-hidden={activeTab !== "full-screen"}
            inert={activeTab !== "full-screen"}
            tabIndex={activeTab === "full-screen" ? 0 : -1}
            className={TABS_CONTENT_CLASS}
          >
            <SurfaceTabsIllustration
              alt={SURFACE_TABS_IMAGE_ALT.fullScreen}
              desktop={fullScreen}
              mobile={fullScreenMobile}
              tablet={fullScreenTablet}
              laptop={fullScreenLaptop}
            />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  )
}
