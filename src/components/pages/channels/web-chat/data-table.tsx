"use client"

import {
  CheckCircle2,
  CirclePause,
  Info,
  Loader2,
  MoreHorizontal,
  Search,
  Settings2,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type HeroTableRow = { name: string; updated: string; status: string }
export type HeroTable = {
  title: string
  /**
   * Exactly 3 header labels, for the name/updated/status columns in that
   * order. The checkbox and actions columns have no header text.
   */
  columns: readonly [string, string, string]
  rows: readonly HeroTableRow[]
  selectedRow?: string
}

/**
 * Figma's status cells (`45487:83107` and friends) are icon + muted label —
 * check-circle / info-circle / spinner / pause, all the same grey — never a
 * coloured status dot.
 */
const STATUS_ICON: Record<string, typeof CheckCircle2> = {
  Synced: CheckCircle2,
  Complete: CheckCircle2,
  "Needs review": Info,
  Processing: Loader2,
  Paused: CirclePause,
}

function statusIcon(status: string) {
  return STATUS_ICON[status] ?? CheckCircle2
}

/**
 * The data table: search/status/view controls, then the table itself with a
 * fixed checkbox column, a fixed name column, a flexible "updated" column, a
 * fixed status column and a fixed actions column — matching the Figma column
 * widths (32/215/fill/164/64 desktop, 15/100/fill/76/30 mobile). Rows are
 * 47px tall on desktop (Figma `45487:83079` and friends) and fade toward the
 * bottom via an overlay gradient, in both states — no pagination footer:
 * the Figma frame has none, the fade is what stands in for "more below."
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
                  : "w-[373px] gap-1 px-3 py-2 text-sm"
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

        {/* Hugs its own row content rather than stretching to fill the
            card — with only 6-7 rows of real data (vs. Figma's fuller
            mock), forcing it to fill the available height just left an
            empty bordered box below the last row. Any leftover height
            shows as plain card background instead, and the fade below now
            covers the last row or two it actually has. */}
        <div className="relative overflow-hidden rounded-lg border border-white/10">
          <div className={cn("grid", gridCols)}>
            {/* Head row */}
            <div
              className={cn(
                "border-b border-white/10",
                compact ? "h-[19px]" : "h-10"
              )}
            />
            {table.columns.map((column) => (
              <div
                key={column}
                className={cn(
                  "flex items-center border-b border-white/10 font-medium text-gray-60",
                  compact ? "px-1 text-[6.5px]" : "px-2 text-sm"
                )}
              >
                {column}
              </div>
            ))}
            <div
              className={cn(
                "border-b border-white/10",
                compact ? "h-[19px]" : "h-10"
              )}
            />

            {/* Body rows */}
            {table.rows.map((row) => {
              const isSelected = row.name === table.selectedRow

              const StatusIcon = statusIcon(row.status)

              return (
                <div
                  key={row.name}
                  className={cn(
                    "col-span-5 grid grid-cols-subgrid",
                    !compact && "h-[47px]"
                  )}
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
                    <StatusIcon
                      className={cn(
                        "shrink-0 text-gray-60",
                        compact ? "size-2" : "size-3.5",
                        row.status === "Processing" && "animate-spin"
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

          {/* Fade toward the bottom of the panel, in both states — Figma
              has no pagination footer below the table; this fade (plus the
              row count we actually have data for) is the whole "more below"
              cue. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-black"
          />
        </div>
      </div>
    </div>
  )
}
