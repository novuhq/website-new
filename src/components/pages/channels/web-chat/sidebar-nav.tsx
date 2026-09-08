"use client"

import { HERO_SIDEBAR_DEFAULT } from "@/data/pages/web-chat"
import {
  ChevronRight,
  ChevronsUpDown,
  Database,
  GalleryVerticalEnd,
  LayoutDashboard,
  Settings2,
  Users,
  Workflow,
} from "lucide-react"

import { cn } from "@/lib/utils"

const NAV_ICONS: Record<
  (typeof HERO_SIDEBAR_DEFAULT.items)[number],
  typeof Database
> = {
  Overview: LayoutDashboard,
  Data: Database,
  Automations: Workflow,
  Users: Users,
  Integrations: GalleryVerticalEnd,
  Settings: Settings2,
}

/**
 * The app sidebar: header (mark + company name) and nav (with the expanded
 * "Data" group showing Sources as the active sub-item). Per the actual
 * `hero-personalization-05-recent.dev` frame, the sidebar ends after
 * "Settings" — there is no footer/account row in the design.
 * Figma: desktop #45487:79083 (w-256), mobile #45487:112602 (w-119.34).
 */
export function Sidebar({
  companyLabel,
  faviconUrl,
  compact,
}: {
  companyLabel: string
  faviconUrl: string | null
  compact?: boolean
}) {
  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col bg-[rgba(23,23,23,0.6)]",
        compact ? "w-[119px] gap-1 p-1" : "w-64 gap-2 p-2"
      )}
    >
      {/* SidebarHeader */}
      <div
        className={cn(
          "flex items-center rounded-lg",
          compact ? "gap-1 p-1" : "gap-2 p-2"
        )}
      >
        <span
          className={cn(
            "flex shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-purple-1",
            compact ? "size-4" : "size-8"
          )}
        >
          {faviconUrl ? (
            // Arbitrary remote favicon URL: next/image would need a remote
            // pattern for any visitor domain, so this follows the same
            // pattern already used for logos elsewhere in this codebase.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={faviconUrl} alt="" className="size-full object-contain" />
          ) : (
            <GalleryVerticalEnd
              className={cn("text-black", compact ? "size-2.5" : "size-4")}
            />
          )}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 truncate font-semibold text-gray-90",
            compact ? "text-[6.5px]" : "text-sm"
          )}
        >
          {companyLabel}
        </span>
        <ChevronsUpDown
          className={cn("shrink-0 text-gray-90", compact ? "size-2" : "size-4")}
        />
      </div>

      {/* SidebarContent */}
      <nav
        className={cn(
          "flex flex-1 flex-col",
          compact ? "gap-0.5 p-1" : "gap-1 p-2"
        )}
      >
        {HERO_SIDEBAR_DEFAULT.items.map((item) => {
          const Icon = NAV_ICONS[item]
          const isExpandable = item === HERO_SIDEBAR_DEFAULT.expanded.under

          return (
            <div key={item} className="flex flex-col">
              <div
                className={cn(
                  "flex items-center rounded-lg text-gray-90",
                  compact
                    ? "gap-1 px-1 py-0.5 text-[6.5px]"
                    : "gap-2 px-2 py-1.5 text-sm"
                )}
              >
                <Icon
                  className={cn("shrink-0", compact ? "size-2.5" : "size-4")}
                />
                <span className="min-w-0 flex-1 truncate">{item}</span>
                {isExpandable ? (
                  <ChevronRight className={compact ? "size-2.5" : "size-4"} />
                ) : null}
              </div>
              {isExpandable ? (
                <div
                  className={cn(
                    "flex flex-col border-l border-white/10",
                    compact
                      ? "ml-2 gap-0.5 px-1.5 py-0.5"
                      : "ml-4 gap-1 px-3 py-0.5"
                  )}
                >
                  {HERO_SIDEBAR_DEFAULT.expanded.items.map((subItem) => {
                    const isActive = subItem === HERO_SIDEBAR_DEFAULT.activeItem

                    return (
                      <span
                        key={subItem}
                        className={cn(
                          "truncate rounded-lg",
                          compact
                            ? "px-1 py-0.5 text-[6.5px]"
                            : "px-2 py-1 text-sm",
                          isActive ? "font-normal" : "text-gray-90/60"
                        )}
                        style={
                          isActive
                            ? {
                                backgroundColor: "var(--wc-accent)",
                                color: "var(--wc-accent-foreground)",
                              }
                            : undefined
                        }
                      >
                        {subItem}
                      </span>
                    )
                  })}
                </div>
              ) : null}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
