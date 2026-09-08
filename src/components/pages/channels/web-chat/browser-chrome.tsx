"use client"

import { cn } from "@/lib/utils"

/**
 * Browser-chrome domain pill. Figma: desktop `title`/`field` #45487:79584
 * (h-13, pill padding 8px, radius 24px), mobile `title`/`field` #45487:113103
 * (h-24.24, radius ~11px) — both a black bar with an inset translucent pill.
 */
export function ChromeBar({
  domain,
  compact,
}: {
  domain: string
  compact?: boolean
}) {
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
