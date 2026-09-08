"use client"

import {
  HERO_DEFAULT_COMPANY,
  HERO_DEFAULT_DOMAIN,
  HERO_SIDEBAR_DEFAULT,
  HERO_TABLE_DEFAULT,
  HERO_TABLE_PERSONALIZED,
} from "@/data/pages/web-chat"
import type { StoryboardStep } from "@/data/pages/web-chat-storyboard"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Database,
  GalleryVerticalEnd,
  LayoutDashboard,
  MoreHorizontal,
  Search,
  Settings2,
  Users,
  Workflow,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useWebChatBrand } from "@/components/pages/channels/web-chat/brand-provider"
import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

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

type HeroTableRow = { name: string; updated: string; status: string }
type HeroTable = {
  title: string
  columns: readonly string[]
  rows: readonly HeroTableRow[]
  selectedRow?: string
}

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

const STATUS_DOT_CLASS: Record<string, string> = {
  Synced: "bg-emerald-400",
  Complete: "bg-emerald-400",
  "Needs review": "bg-amber-400",
  Processing: "bg-sky-400",
  Paused: "bg-gray-60",
}

function statusDotClass(status: string): string {
  return STATUS_DOT_CLASS[status] ?? "bg-gray-60"
}

/**
 * Browser-chrome domain pill. Figma: desktop `title`/`field` #45487:79584
 * (h-13, pill padding 8px, radius 24px), mobile `title`/`field` #45487:113103
 * (h-24.24, radius ~11px) — both a black bar with an inset translucent pill.
 */
function ChromeBar({ domain, compact }: { domain: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center border-b border-white/10 bg-black",
        compact ? "h-6 p-1" : "h-13 p-2"
      )}
    >
      <div
        className={cn(
          "flex w-full items-center gap-2 rounded-full",
          compact ? "gap-1 px-2 py-1" : "px-3 py-2"
        )}
        style={{ backgroundColor: "rgba(42, 43, 51, 0.3)" }}
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={cn(
            "shrink-0 fill-none stroke-white/40",
            compact ? "size-2.5" : "size-4"
          )}
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9Z" />
        </svg>
        <span
          className={cn(
            "truncate text-white/60",
            compact ? "text-[7px]" : "text-sm"
          )}
        >
          {domain}
        </span>
      </div>
    </div>
  )
}

/**
 * The app sidebar: header (mark + company name), nav (with the expanded
 * "Data" group showing Sources as the active sub-item), footer (account row).
 * Figma: desktop #45487:79083 (w-256), mobile #45487:112602 (w-119.34).
 */
function Sidebar({
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

      {/* SidebarFooter */}
      <div
        className={cn(
          "flex shrink-0 items-center rounded-lg bg-[#171717]",
          compact ? "gap-1 p-1" : "gap-2 p-2"
        )}
      >
        <span
          className={cn(
            "shrink-0 rounded-[10px] bg-black",
            compact ? "size-4" : "size-8"
          )}
        />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate font-semibold text-gray-90",
              compact ? "text-[6.5px]" : "text-sm"
            )}
          >
            shadcn
          </p>
          <p
            className={cn(
              "truncate text-gray-90/60",
              compact ? "text-[5px]" : "text-xs"
            )}
          >
            m@example.com
          </p>
        </div>
        <ChevronsUpDown
          className={cn("shrink-0 text-gray-90", compact ? "size-2" : "size-4")}
        />
      </div>
    </aside>
  )
}

/**
 * The data table: search/status/view controls, then the table itself with a
 * fixed checkbox column, a fixed name column, a flexible "updated" column, a
 * fixed status column and a fixed actions column — matching the Figma column
 * widths (32/215/fill/164/64 desktop, 15/100/fill/76/30 mobile). Rows fade
 * toward the bottom via an overlay gradient, in both states.
 */
function DataTable({
  table,
  compact,
}: {
  table: HeroTable
  compact?: boolean
}) {
  const gridCols = compact
    ? "grid-cols-[15px_100px_1fr_76px_30px]"
    : "grid-cols-[32px_215px_1fr_164px_64px]"

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        compact ? "gap-[15px] p-[15px]" : "gap-8 p-8"
      )}
    >
      <div
        className={cn(
          "shrink-0",
          compact
            ? "text-[11px] font-semibold text-gray-90"
            : "text-2xl font-semibold text-gray-90"
        )}
      >
        {table.title}
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          compact ? "gap-[7px]" : "gap-4"
        )}
      >
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center", compact ? "gap-1" : "gap-2")}>
            <div
              className={cn(
                "flex items-center rounded-lg border border-white/15 bg-white/5 text-gray-60",
                compact
                  ? "gap-0.5 px-1 py-0.5 text-[6.5px]"
                  : "gap-1 px-3 py-2 text-sm"
              )}
            >
              <Search className={compact ? "size-2" : "size-3.5"} />
              <span>Search</span>
            </div>
            <div
              className={cn(
                "rounded-lg border border-white/15 bg-white/5 font-medium text-gray-90",
                compact ? "px-1.5 py-0.5 text-[6.5px]" : "px-3.5 py-2 text-sm"
              )}
            >
              Status
            </div>
          </div>
          <div
            className={cn(
              "flex items-center rounded-lg border border-white/15 bg-white/5 font-medium text-gray-90",
              compact
                ? "gap-0.5 px-1.5 py-0.5 text-[6.5px]"
                : "gap-1.5 px-3.5 py-2 text-sm"
            )}
          >
            <Settings2 className={compact ? "size-2" : "size-3.5"} />
            <span>View</span>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-white/10">
          <div className={cn("grid", gridCols)}>
            {/* Head row */}
            <div
              className={cn(
                "border-b border-white/10",
                compact ? "h-[19px]" : "h-10"
              )}
            />
            <div
              className={cn(
                "flex items-center border-b border-white/10 font-medium text-gray-60",
                compact ? "px-1 text-[6.5px]" : "px-2 text-sm"
              )}
            >
              {table.columns[0]}
            </div>
            <div
              className={cn(
                "flex items-center border-b border-white/10 font-medium text-gray-60",
                compact ? "px-1 text-[6.5px]" : "px-2 text-sm"
              )}
            >
              {table.columns[1]}
            </div>
            <div
              className={cn(
                "flex items-center border-b border-white/10 font-medium text-gray-60",
                compact ? "px-1 text-[6.5px]" : "px-2 text-sm"
              )}
            >
              {table.columns[2]}
            </div>
            <div
              className={cn(
                "border-b border-white/10",
                compact ? "h-[19px]" : "h-10"
              )}
            />

            {/* Body rows */}
            {table.rows.map((row) => {
              const isSelected = row.name === table.selectedRow

              return (
                <div
                  key={row.name}
                  className="col-span-5 grid grid-cols-subgrid"
                  style={
                    isSelected
                      ? { backgroundColor: "var(--wc-accent-soft)" }
                      : undefined
                  }
                >
                  <div
                    className={cn(
                      "flex items-center border-b border-white/10",
                      compact ? "pl-1" : "pl-3"
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 rounded-[4px] border border-white/15",
                        compact ? "size-2" : "size-4"
                      )}
                      style={
                        isSelected
                          ? { backgroundColor: "var(--wc-accent)" }
                          : undefined
                      }
                    />
                  </div>
                  <div
                    className={cn(
                      "flex items-center truncate border-b border-white/10 text-gray-90",
                      compact ? "px-1 text-[6.5px]" : "px-2 text-sm"
                    )}
                  >
                    {row.name}
                  </div>
                  <div
                    className={cn(
                      "flex items-center truncate border-b border-white/10 text-gray-90",
                      compact ? "px-1 text-[6.5px]" : "px-2 text-sm"
                    )}
                  >
                    {row.updated}
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1.5 truncate border-b border-white/10 text-gray-90",
                      compact ? "px-1 text-[6.5px]" : "px-2 text-sm"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block shrink-0 rounded-full",
                        compact ? "size-1" : "size-2",
                        statusDotClass(row.status)
                      )}
                    />
                    {row.status}
                  </div>
                  <div className="flex items-center justify-center border-b border-white/10">
                    <MoreHorizontal
                      className={cn(
                        "text-gray-60",
                        compact ? "size-2" : "size-4"
                      )}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Fade toward the bottom of the panel, in both states. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-black"
          />
        </div>

        <div
          className={cn(
            "flex shrink-0 items-center justify-center text-gray-60",
            compact ? "gap-1 text-[6.5px]" : "gap-2 text-sm"
          )}
        >
          <span>0 of 100 row(s) selected.</span>
          <span
            className={cn("flex items-center", compact ? "gap-2" : "gap-8")}
          >
            <span className="font-medium text-gray-90">Page 1 of 10</span>
            <span
              className={cn("flex items-center", compact ? "gap-0.5" : "gap-1")}
            >
              <ChevronsLeft
                className={cn(
                  "text-gray-60/50",
                  compact ? "size-2.5" : "size-4"
                )}
              />
              <ChevronLeft
                className={cn(
                  "text-gray-60/50",
                  compact ? "size-2.5" : "size-4"
                )}
              />
              <ChevronRight
                className={cn("text-gray-90", compact ? "size-2.5" : "size-4")}
              />
              <ChevronsRight
                className={cn("text-gray-90", compact ? "size-2.5" : "size-4")}
              />
            </span>
          </span>
        </div>
      </div>
    </div>
  )
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
