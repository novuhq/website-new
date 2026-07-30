"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { domAnimation, LazyMotion, useReducedMotion } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "@/lib/utils"

import type { IInboxEntry } from "./types"

interface IThemeTabsProps {
  className?: string
  activeTheme: number
  items: IInboxEntry[]
  onThemeChange: (index: number) => void
}

function ThemeTabs({
  className,
  activeTheme,
  items,
  onThemeChange,
}: IThemeTabsProps) {
  const tabsListRef = useRef<HTMLDivElement>(null)
  const [indicatorRect, setIndicatorRect] = useState<{
    x: number
    width: number
  } | null>(null)
  const reducedMotion = Boolean(useReducedMotion())

  useLayoutEffect(() => {
    const tabsList = tabsListRef.current
    const activeTrigger =
      tabsList?.querySelectorAll<HTMLButtonElement>("[role=tab]")[activeTheme]

    if (!tabsList || !activeTrigger) return

    const updateIndicator = () => {
      const tabsListRect = tabsList.getBoundingClientRect()
      const activeTriggerRect = activeTrigger.getBoundingClientRect()

      setIndicatorRect({
        x: activeTriggerRect.left - tabsListRect.left,
        width: activeTriggerRect.width,
      })
    }

    updateIndicator()

    const resizeObserver = new ResizeObserver(updateIndicator)
    resizeObserver.observe(tabsList)
    resizeObserver.observe(activeTrigger)

    return () => resizeObserver.disconnect()
  }, [activeTheme])

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={cn(
          "absolute top-0 left-0 z-10 flex h-10.5 w-[10.75rem] overflow-hidden rounded-full border border-white/70 bg-[linear-gradient(0deg,rgba(255,255,255,.20)_0%,rgba(255,255,255,.20)_100%),radial-gradient(120%_176%_at_54%_-36%,rgba(110,42,194,.30)_2.53%,rgba(38,25,51,.00)_100%)] mix-blend-overlay backdrop-blur-md xl:w-50",
          className
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "absolute top-0 left-0 z-10 flex h-10.5 w-[10.75rem] items-center justify-between gap-0.75 overflow-hidden rounded-full px-1.5 lg:gap-1 xl:w-50 2xl:gap-0.75",
          className
        )}
        ref={tabsListRef}
        role="tablist"
        aria-label="Inbox theme"
      >
        {indicatorRect && (
          <m.span
            className="pointer-events-none absolute top-1.5 left-0 z-0 h-7.5 rounded-full border border-white bg-white/90"
            initial={false}
            animate={{
              x: indicatorRect.x,
              width: indicatorRect.width,
            }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
            aria-hidden
          />
        )}

        {items.map((item, index) => {
          const isActive = index === activeTheme

          return (
            <button
              className={cn(
                "relative z-10 h-7.5 shrink-0 rounded-full px-2.5 text-xs leading-none font-medium tracking-tighter text-[#C9ABFF] transition-colors xl:px-3 xl:text-sm",
                isActive && "text-[#00217C]"
              )}
              key={item.theme}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onThemeChange(index)}
            >
              {item.title}
            </button>
          )
        })}
      </div>
    </LazyMotion>
  )
}

export default ThemeTabs
