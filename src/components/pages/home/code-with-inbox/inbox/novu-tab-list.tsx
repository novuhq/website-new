"use client"

import { useEffect, useRef, useState } from "react"
import { domAnimation, LazyMotion } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "@/lib/utils"
import { NOVU_TAB_LIST_THEMES } from "./theme-config"
import type { ITabItem } from "./types"

const ANIMATION_DURATION = 0.2
const MOTION_EASY = [0.25, 0.1, 0.25, 1]

interface INovuTabListProps {
  theme: "novuDark" | "novuLight"
  tabs: ITabItem[]
  activeTab: string
  setActiveTab: (tab: string) => void
}

function NovuTabList({
  theme,
  tabs,
  activeTab,
  setActiveTab,
}: INovuTabListProps) {
  const [activeTabIndicator, setActiveTabIndicator] = useState({
    left: 0,
    width: 0,
  })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const activeTabIndex = tabs.findIndex((tab) => tab.label === activeTab)
    if (tabRefs.current[activeTabIndex]) {
      setActiveTabIndicator({
        left: tabRefs.current[activeTabIndex]!.offsetLeft,
        width: tabRefs.current[activeTabIndex]!.offsetWidth,
      })
    }
  }, [activeTab, tabs])

  const currentTheme = NOVU_TAB_LIST_THEMES[theme]

  return (
    <div className="tab-list scrollbar-hidden relative z-10 mt-0.5 h-12 shrink-0 overflow-scroll font-inter">
      <ul className="flex h-full items-center gap-x-[22px] px-[18px]">
        {tabs.map(({ label, count }, index) => (
          <li className="h-full" key={label}>
            <button
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              className={cn(
                "flex h-full items-center justify-center gap-[5px] text-nowrap px-1 text-[0.9375rem] font-medium capitalize",
                activeTab === label
                  ? currentTheme.activeTabStyles
                  : currentTheme.tabStyles
              )}
              type="button"
              onClick={() => setActiveTab(label)}
            >
              {label}
              {count !== 0 && (
                <span
                  className={cn(
                    currentTheme.badge,
                    "flex size-[18px] items-center justify-center rounded-full text-xs font-medium leading-none"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <div
        className={cn(
          currentTheme.border,
          "pointer-events-none absolute inset-x-0 bottom-0 h-px"
        )}
      />
      <LazyMotion features={domAnimation}>
        <m.div
          className={cn(
            currentTheme.borderActive,
            "pointer-events-none absolute bottom-0 h-px"
          )}
          animate={{
            left: activeTabIndicator.left,
            width: activeTabIndicator.width,
          }}
          transition={{
            duration: ANIMATION_DURATION,
            ease: MOTION_EASY,
          }}
        />
      </LazyMotion>
    </div>
  )
}

export default NovuTabList
