"use client"

import Image from "next/image"
import { HERO_GLOBE_IMAGE } from "@/data/pages/web-chat"

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
        <Image
          src={HERO_GLOBE_IMAGE}
          alt=""
          width={16}
          height={16}
          className={cn("shrink-0 opacity-40", compact ? "size-2.5" : "size-4")}
        />
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
