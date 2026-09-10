import {
  DASHBOARD_TABLE_COLUMNS,
  DASHBOARD_TABLE_FILTER_LABEL,
  DASHBOARD_TABLE_HEADING,
  DASHBOARD_TABLE_ROWS,
  DASHBOARD_TABLE_SEARCH_PLACEHOLDER,
  DASHBOARD_TABLE_VIEW_LABEL,
} from "@/data/pages/web-chat-surface-tabs"

import { cn } from "@/lib/utils"

/**
 * The faded "Data sources" table behind the Side panel dashboard (Figma
 * "Blocks / Tasks" `45487-80519`). Purely decorative background chrome —
 * rendered at 40% opacity by the parent, with a bottom gradient fade on top
 * of it — so this keeps only enough structure to read as a real data table
 * from a glance, not a pixel-exact rebuild.
 */
export function SurfaceTabsDashboardTable({ compact }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col",
        compact ? "gap-[5px] p-[5px]" : "gap-4 p-8"
      )}
    >
      <p
        className={cn(
          "font-semibold text-[#FAFAFA]",
          compact ? "text-[9px]" : "text-2xl"
        )}
      >
        {DASHBOARD_TABLE_HEADING}
      </p>

      <div className={cn("flex items-center", compact ? "gap-[3px]" : "gap-2")}>
        <span
          className={cn(
            "rounded-lg border border-white/15 bg-white/5 text-[#A3A3A3]",
            compact ? "px-[3px] py-px text-[5px]" : "px-3 py-2 text-sm"
          )}
        >
          {DASHBOARD_TABLE_SEARCH_PLACEHOLDER}
        </span>
        <span
          className={cn(
            "rounded-lg border border-white/15 bg-white/5 font-medium text-[#FAFAFA]",
            compact ? "px-[3px] py-px text-[5px]" : "px-3 py-2 text-sm"
          )}
        >
          {DASHBOARD_TABLE_FILTER_LABEL}
        </span>
        <span
          className={cn(
            "ml-auto rounded-lg border border-white/15 bg-white/5 font-medium text-[#FAFAFA]",
            compact ? "px-[3px] py-px text-[5px]" : "px-3 py-2 text-sm"
          )}
        >
          {DASHBOARD_TABLE_VIEW_LABEL}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <div
          className={cn(
            "grid grid-cols-[1.6fr_1fr_1fr] border-b border-white/10 font-medium text-[#A3A3A3]",
            compact
              ? "gap-[3px] px-[3px] py-[2px] text-[5px]"
              : "gap-2 px-3 py-2 text-sm"
          )}
        >
          {DASHBOARD_TABLE_COLUMNS.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        {DASHBOARD_TABLE_ROWS.map((row) => (
          <div
            key={row.source}
            className={cn(
              "grid grid-cols-[1.6fr_1fr_1fr] border-b border-white/10 text-[#FAFAFA] last:border-b-0",
              compact
                ? "gap-[3px] px-[3px] py-[2px] text-[5px]"
                : "gap-2 px-3 py-2 text-sm"
            )}
          >
            <span className="truncate">{row.source}</span>
            <span className="truncate">{row.updated}</span>
            <span className="truncate">{row.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
