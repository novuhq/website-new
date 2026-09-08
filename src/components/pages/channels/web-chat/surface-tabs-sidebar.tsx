import type { CSSProperties } from "react"
import {
  SURFACE_TABS_SIDEBAR_ACCOUNT_EMAIL,
  SURFACE_TABS_SIDEBAR_ACCOUNT_NAME,
  SURFACE_TABS_SIDEBAR_COMPANY,
  SURFACE_TABS_SIDEBAR_SETTINGS_LABEL,
  type SurfaceTabsSidebarItem,
} from "@/data/pages/web-chat-surface-tabs"
import {
  ChevronRight,
  Database,
  GalleryVerticalEnd,
  LayoutDashboard,
  MessagesSquare,
  Settings2,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Icon per top-level nav label. Figma exposes named icon components only for
 * "Settings" (`Icon / Settings2`) and the header/company mark
 * (`Icon / GalleryVerticalEnd`) — every other nav row is an unresolved
 * generic vector in the file's own data, so the rest of this map mirrors the
 * choices already shipped for this identical item list in the hero's own
 * sidebar (`sidebar-nav.tsx`'s `NAV_ICONS`) for visual consistency across
 * the page, rather than inventing a different arbitrary set here.
 */
const NAV_ICONS: Record<string, LucideIcon> = {
  Overview: LayoutDashboard,
  Data: Database,
  Conversations: MessagesSquare,
  Automations: Workflow,
  Users: Users,
  Integrations: GalleryVerticalEnd,
}

export interface SurfaceTabsSidebarProps {
  items: SurfaceTabsSidebarItem[]
  className?: string
  /** Fixed pixel width, set by the parent illustration per breakpoint/tab. */
  style?: CSSProperties
  compact?: boolean
}

/**
 * The mock app sidebar shared by both tab states (Figma "Sidebar 07."
 * `45487-80422` / `45497-141048`). Only the nav item list differs between
 * Side panel and Full screen — passed in via `items`.
 */
export function SurfaceTabsSidebar({
  items,
  className,
  style,
  compact,
}: SurfaceTabsSidebarProps) {
  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col justify-between bg-[rgba(23,23,23,0.6)]",
        compact ? "gap-[3px] p-[3px]" : "gap-2 p-2",
        className
      )}
      style={style}
    >
      <div className={cn("flex flex-col", compact ? "gap-[3px]" : "gap-2")}>
        {/* SidebarHeader */}
        <div
          className={cn(
            "flex items-center rounded-lg",
            compact ? "gap-[3px] p-[3px]" : "gap-2 p-2"
          )}
        >
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-[10px] bg-purple-1",
              compact ? "size-[13px] rounded-[4px]" : "size-8"
            )}
          >
            <GalleryVerticalEnd
              className={cn("text-black", compact ? "size-[8px]" : "size-4")}
            />
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate font-semibold text-[#FAFAFA]",
              compact ? "text-[5.5px]" : "text-sm"
            )}
          >
            {SURFACE_TABS_SIDEBAR_COMPANY}
          </span>
        </div>

        {/* SidebarContent */}
        <nav className={cn("flex flex-col", compact ? "gap-[3px]" : "gap-2")}>
          {items.map((item) => {
            const Icon = NAV_ICONS[item.label] ?? LayoutDashboard
            if (item.kind === "link") {
              return (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center rounded-lg text-[#FAFAFA]",
                    compact ? "gap-[3px] p-[3px]" : "gap-2 p-2"
                  )}
                >
                  <Icon
                    className={cn(compact ? "size-[6px]" : "size-4")}
                    strokeWidth={1.75}
                  />
                  <span className={cn(compact ? "text-[5.5px]" : "text-sm")}>
                    {item.label}
                  </span>
                </div>
              )
            }

            return (
              <div key={item.label} className="flex flex-col">
                <div
                  className={cn(
                    "flex items-center rounded-lg text-[#FAFAFA]",
                    compact ? "gap-[3px] p-[3px]" : "gap-2 p-2"
                  )}
                >
                  <Icon
                    className={cn(compact ? "size-[6px]" : "size-4")}
                    strokeWidth={1.75}
                  />
                  <span
                    className={cn(
                      "flex-1",
                      compact ? "text-[5.5px]" : "text-sm"
                    )}
                  >
                    {item.label}
                  </span>
                  <ChevronRight
                    className={cn(compact ? "size-[6px]" : "size-4")}
                  />
                </div>
                <div
                  className={cn(
                    "flex flex-col border-l border-white/10",
                    compact
                      ? "mt-[1px] ml-[9px] gap-[1.5px] pl-[3px]"
                      : "mt-1 ml-4 gap-1 pl-3"
                  )}
                >
                  {item.items.map((sub) => (
                    <span
                      key={sub.label}
                      className={cn(
                        "truncate rounded-lg text-[#FAFAFA]",
                        sub.active ? "bg-[#262626]" : "opacity-60",
                        compact
                          ? "px-[3px] py-[1px] text-[5.5px]"
                          : "px-2 py-1 text-sm"
                      )}
                    >
                      {sub.label}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Settings sits outside the collapsible groups, per Figma. */}
          <div
            className={cn(
              "flex items-center rounded-lg text-[#FAFAFA]",
              compact ? "gap-[3px] p-[3px]" : "gap-2 p-2"
            )}
          >
            <Settings2
              className={cn(compact ? "size-[6px]" : "size-4")}
              strokeWidth={1.75}
            />
            <span className={cn(compact ? "text-[5.5px]" : "text-sm")}>
              {SURFACE_TABS_SIDEBAR_SETTINGS_LABEL}
            </span>
          </div>
        </nav>
      </div>

      {/* SidebarFooter */}
      <div
        className={cn(
          "flex items-center rounded-lg bg-[#171717]",
          compact ? "gap-[3px] p-[3px]" : "gap-2 p-2"
        )}
      >
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-[10px] bg-[#0A0A0A] font-semibold text-[#FAFAFA]",
            compact ? "size-[13px] rounded-[4px] text-[4px]" : "size-8 text-xs"
          )}
        >
          CN
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span
            className={cn(
              "truncate font-semibold text-[#FAFAFA]",
              compact ? "text-[5.5px]" : "text-sm"
            )}
          >
            {SURFACE_TABS_SIDEBAR_ACCOUNT_NAME}
          </span>
          <span
            className={cn(
              "truncate text-[#FAFAFA]",
              compact ? "text-[4px]" : "text-xs"
            )}
          >
            {SURFACE_TABS_SIDEBAR_ACCOUNT_EMAIL}
          </span>
        </span>
      </div>
    </aside>
  )
}
