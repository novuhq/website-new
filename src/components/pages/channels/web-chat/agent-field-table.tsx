"use client"

import { HERO_FIELD_TABLE } from "@/data/pages/web-chat"

import { cn } from "@/lib/utils"

/**
 * The inline field-check card shown inside the step-5 agent reply. The row
 * with `missing: true` (Email address) is highlighted and its value
 * rendered in the design's red (`#E44343`, a literal Figma value with no
 * existing token — same pattern as `brand-alert.tsx`'s hardcoded `#FF98BA`).
 *
 * Figma (desktop `45487:90440`): container 289px wide, `rgba(0,0,0,0.7)`
 * fill, left border only `rgba(255,255,255,0.5)`, radius rounded on the
 * right only (`0 12px 12px 0`) so it reads as a continuation of the message
 * above it. Rows (`45487:90441`-`45487:90452`) are Geist Mono 13px/
 * `-0.02em` (`font-mono tracking-tighter`, project has no Geist Mono font
 * loaded so this falls back to the default mono stack); the missing row
 * (`45487:90444`) gets a `rgba(255,255,255,0.1)` highlight, a full-opacity
 * label (others are 40%), and the red value. Mobile scaled ~0.4662x.
 */
export function AgentFieldTable({ compact }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex w-[289px] flex-col gap-1 rounded-r-xl border-l border-white/50 bg-black/70 py-2 pr-3 pl-2",
        compact && "w-[135px] gap-0.5 rounded-r-md py-1 pr-1.5 pl-1"
      )}
    >
      {HERO_FIELD_TABLE.rows.map((row) => (
        <div
          key={row.label}
          className={cn(
            "flex items-center justify-between gap-2 rounded p-1 font-mono text-[13px] leading-[1.2] tracking-tighter",
            row.missing && "bg-white/10",
            compact && "gap-1 p-0.5 text-[6px]"
          )}
        >
          <span className={cn("text-white/40", row.missing && "text-white")}>
            {row.label}
          </span>
          <span className={cn("text-white", row.missing && "text-[#E44343]")}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
  )
}
