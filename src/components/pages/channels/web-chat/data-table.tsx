"use client"

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
  Settings2,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type HeroTableRow = { name: string; updated: string; status: string }
export type HeroTable = {
  title: string
  columns: readonly string[]
  rows: readonly HeroTableRow[]
  selectedRow?: string
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
 * The data table: search/status/view controls, then the table itself with a
 * fixed checkbox column, a fixed name column, a flexible "updated" column, a
 * fixed status column and a fixed actions column — matching the Figma column
 * widths (32/215/fill/164/64 desktop, 15/100/fill/76/30 mobile). Rows fade
 * toward the bottom via an overlay gradient, in both states.
 */
export function DataTable({
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
