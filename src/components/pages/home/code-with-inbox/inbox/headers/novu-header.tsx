"use client"

import { cn } from "@/lib/utils"
import { NovuMoreIcon, NovuSettingsIcon } from "../icons"
import { NOVU_HEADER_THEMES } from "../theme-config"
import type { IFilterItem, IActionItem } from "../types"

interface INovuHeaderProps {
  theme: "novuDark" | "novuLight"
  filters: IFilterItem[]
  actions: IActionItem[]
  handleAction: (action: IActionItem["action"]) => () => void
  handleFilter: (index: number) => () => void
  filterIndex: number
}

function NovuHeader({
  theme,
  filters,
  actions,
  handleAction,
  handleFilter,
  filterIndex,
}: INovuHeaderProps) {
  const currentTheme = NOVU_HEADER_THEMES[theme]

  return (
    <div
      className={cn(
        "relative z-20 mt-3.5 flex shrink-0 items-center justify-between px-[18px]",
        { "mb-3.5": filterIndex === 2 }
      )}
    >
      <div className="flex items-center gap-x-3">
        <span
          className={cn(
            currentTheme.titleColor,
            "font-inter text-xl font-medium leading-none"
          )}
        >
          Inbox
        </span>
      </div>
      <div className="flex items-center gap-x-3.5">
        <button
          className="group relative flex items-center"
          type="button"
        >
          <NovuMoreIcon
            className={cn("size-[26px]", currentTheme.mainIconsColor)}
          />
          <ul
            className={cn(
              "invisible absolute right-0 top-[calc(100%+7px)] w-[219px] rounded-[10px] p-1 opacity-0 transition-[opacity,visibility] duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100",
              currentTheme.menuStyles
            )}
          >
            {actions.map(({ label, Icon, action }, index) => (
              <li key={index}>
                <div
                  className={cn(
                    "flex h-[30px] w-full items-center gap-x-2.5 rounded-md pl-4 text-left font-inter text-sm font-medium leading-none",
                    currentTheme.menuItemStyles
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAction(action)()
                  }
                  onClick={handleAction(action)}
                >
                  <Icon className="size-[18px]" aria-hidden />
                  {label}
                </div>
              </li>
            ))}
          </ul>
        </button>
        <button
          className="group relative flex items-center"
          type="button"
        >
          <NovuSettingsIcon
            className={cn("size-7", currentTheme.mainIconsColor)}
          />
          <ul
            className={cn(
              "invisible absolute right-0 top-[calc(100%+7px)] w-[219px] gap-y-0.5 rounded-[10px] px-1 py-0.5 opacity-0 transition-[opacity,visibility] duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100",
              currentTheme.menuStyles
            )}
          >
            {filters.map(({ label, Icon }, index) => (
              <li key={index}>
                <div
                  className={cn(
                    "flex h-[30px] w-full items-center gap-x-2.5 rounded-md pl-4 text-left font-inter text-sm font-medium leading-none",
                    currentTheme.menuItemStyles
                  )}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleFilter(index)()
                  }
                  onClick={handleFilter(index)}
                >
                  <Icon className="size-[18px]" aria-hidden />
                  {label}
                </div>
              </li>
            ))}
          </ul>
        </button>
      </div>
    </div>
  )
}

export default NovuHeader
