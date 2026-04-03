"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  DownArrowIcon,
  LinearMoreIcon,
  LinearSettingsIcon,
  OppositeArrowsIcon,
  CheckSelectIcon,
} from "../icons"
import { LINEAR_HEADER_THEMES } from "../theme-config"
import type { IActionItem } from "../types"

interface ILinearHeaderProps {
  theme: "linearDark" | "linearLight"
  ordering: { label: string }[]
  actions: IActionItem[]
  handleAction: (action: IActionItem["action"]) => () => void
  orderingPosition: string
  handleOrdering: (value: string) => void
  toggleShowUnreadFirst: () => void
  showUnreadFirst: boolean
  toggleShowRead: () => void
  showRead: boolean
}

function LinearHeader({
  theme,
  ordering,
  actions,
  handleAction,
  orderingPosition,
  handleOrdering,
  toggleShowUnreadFirst,
  showUnreadFirst,
  toggleShowRead,
  showRead,
}: ILinearHeaderProps) {
  const [isClient, setIsClient] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const currentTheme = LINEAR_HEADER_THEMES[theme]

  const handleSortingClick = () => {
    setIsExpanded(!isExpanded)
  }

  const handleOrderingClick = (value: string) => {
    handleOrdering(value)
    setIsExpanded(false)
  }

  return (
    <div className="relative z-20 mb-2.5 flex shrink-0 items-center justify-between pb-[15px] pl-[26px] pr-5 pt-3.5">
      <div className="flex items-center gap-x-2.5">
        <span
          className={cn(
            currentTheme.titleColor,
            "inline-block font-inter text-xl font-medium leading-none"
          )}
        >
          Inbox
        </span>
        <div className="relative">
          <button
            className={cn(
              "menu-btn relative flex size-7 items-center justify-center rounded-[6px] bg-transparent transition-colors before:absolute before:left-0 before:top-0 before:size-11 before:bg-transparent",
              currentTheme.mainIconsUnderlayStyles
            )}
            type="button"
          >
            <LinearMoreIcon
              className={cn("z-10 size-5", currentTheme.moreIconsColor)}
              aria-hidden
            />
          </button>
          <ul
            className={cn(
              "menu invisible absolute left-0 top-[calc(100%+10px)] z-10 min-w-[280px] rounded-[10px] p-1.5 pt-[5px] font-inter opacity-0 transition-[opacity,visibility] duration-300",
              currentTheme.menuStyles
            )}
          >
            {actions.map(({ label, Icon, action }, index) => (
              <li className="menu-item" key={index}>
                {index === 1 && (
                  <div
                    className={cn(
                      "-mx-1.5 my-[5px] h-px w-[calc(100%+12px)]",
                      currentTheme.menuSeparatorStyles
                    )}
                    aria-hidden
                  />
                )}
                <button
                  className={cn(
                    "group/item flex w-full items-center gap-x-2 rounded-md px-[13px] py-2.5 text-left leading-none",
                    currentTheme.menuItemStyles
                  )}
                  type="button"
                  onClick={handleAction(action)}
                >
                  <Icon
                    className={cn("size-5", currentTheme.menuIconStyles)}
                    aria-hidden
                  />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button
        className={cn(
          "menu-btn relative flex size-7 items-center justify-center rounded-[6px] bg-transparent transition-colors before:absolute before:right-0 before:top-0 before:size-11 before:bg-transparent",
          currentTheme.mainIconsUnderlayStyles
        )}
        type="button"
      >
        <LinearSettingsIcon
          className={cn("z-10 size-5", currentTheme.settingsIconColor)}
          aria-hidden
        />
      </button>
      <div
        className={cn(
          "menu invisible absolute right-5 top-[calc(100%-3px)] min-w-[306px] rounded-[10px] px-[19px] pb-[17px] pt-3 font-inter opacity-0 transition-[opacity,visibility] duration-300",
          currentTheme.orderingMenuStyles
        )}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="relative flex items-center justify-between gap-x-2">
          <div className="flex items-center gap-x-3">
            <OppositeArrowsIcon className="size-4 shrink-0" aria-hidden />
            <span>Ordering</span>
          </div>
          <button
            className={cn(
              "flex items-center gap-x-2.5 rounded-[6px] px-2.5 py-1.5 font-inter text-[16px] leading-none",
              currentTheme.orderingDropdownBtnStyles
            )}
            type="button"
            onClick={handleSortingClick}
          >
            <span>{orderingPosition}</span>
            <DownArrowIcon className="size-2" aria-hidden />
          </button>
          {isExpanded && (
            <div
              className={cn(
                "absolute right-0 top-0 z-10 flex flex-col items-start gap-y-2 rounded-[6px] border-[0.5px] p-2.5",
                currentTheme.orderingDropdownStyles
              )}
            >
              <button
                className="relative pl-6"
                type="button"
                onClick={() => handleOrderingClick(ordering[0].label)}
              >
                {orderingPosition === ordering[0].label && (
                  <CheckSelectIcon
                    className={cn(
                      "absolute left-0 top-1/2 size-3.5 -translate-y-1/2",
                      currentTheme.orderingDropdownIconStyles
                    )}
                    aria-hidden
                  />
                )}
                {ordering[0].label}
              </button>
              <button
                className="relative pl-6"
                type="button"
                onClick={() => handleOrderingClick(ordering[1].label)}
              >
                {orderingPosition === ordering[1].label && (
                  <CheckSelectIcon
                    className={cn(
                      "absolute left-0 top-1/2 size-3.5 -translate-y-1/2",
                      currentTheme.orderingDropdownIconStyles
                    )}
                    aria-hidden
                  />
                )}
                {ordering[1].label}
              </button>
            </div>
          )}
        </div>
        <span
          className={cn(
            "absolute inset-x-0 top-[54px] block h-px",
            currentTheme.menuSeparatorStyles
          )}
          aria-hidden
        />
        <div className="mt-[31px] flex flex-col justify-between gap-y-6">
          <div className="flex items-center justify-between text-[16px] leading-none">
            <p>Show unread first</p>
            <button
              className={cn(
                "relative h-5 w-8 rounded-full px-0.5 py-[3px] transition-colors duration-300 ease-in-out",
                showUnreadFirst
                  ? currentTheme.toggleOnBgColor
                  : currentTheme.toggleOffBgColor
              )}
              type="button"
              aria-label={`Switcher to show unread messages first. Now ${
                showUnreadFirst ? "on" : "off"
              }`}
              onClick={toggleShowUnreadFirst}
            >
              <span
                className={cn(
                  "absolute top-1/2 size-3.5 shrink-0 -translate-y-1/2 rounded-full bg-white transition-transform duration-300 ease-in-out",
                  showUnreadFirst ? "translate-x-0" : "-translate-x-full"
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between text-[16px] leading-none">
            <p>Show read</p>
            <button
              className={cn(
                "relative h-[20px] w-[32px] shrink-0 rounded-full px-[2px] py-[3px] transition-colors duration-300 ease-in-out",
                showRead
                  ? currentTheme.toggleOnBgColor
                  : currentTheme.toggleOffBgColor
              )}
              type="button"
              aria-label={`Switch to show read messages. Now ${
                showRead ? "on" : "off"
              }`}
              onClick={toggleShowRead}
            >
              <span
                className={cn(
                  "absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-white transition-transform duration-300 ease-in-out",
                  showRead ? "translate-x-0" : "-translate-x-full"
                )}
              />
            </button>
          </div>
        </div>
      </div>
      <div
        className={cn(
          currentTheme.headerSeparator,
          "pointer-events-none absolute inset-x-0 top-full -z-10 h-px"
        )}
        aria-hidden
      />
    </div>
  )
}

export default LinearHeader
