"use client"

import { cn } from "@/lib/utils"

/**
 * Recolours whatever illustration sits behind it to the personalized brand hue,
 * via a `mix-blend-mode: hue` overlay reading `--wc-accent` through `--wc-hue`.
 *
 * Visibility is driven entirely by the ancestor `data-wc-state` attribute
 * (written by `WebChatBrandProvider`) through the Tailwind `group-data-*`
 * variant below, never by React state — so a colour change never re-renders
 * this component or anything else.
 *
 * `transition-opacity duration-500` (final-review "also fix" item) matches
 * the sibling accent glow's `transition-opacity duration-500` (see
 * `GLOW_CLASSES` in the compare cards) — without it this layer had no
 * transition at all, so at the personalize moment the glow faded in over
 * 500ms while this hue overlay popped in instantly.
 */
export function HueLayer({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-data-[wc-state=loading]:opacity-100 group-data-[wc-state=personalized]:opacity-100",
        className
      )}
      style={{ background: "var(--wc-hue)", mixBlendMode: "hue" }}
    />
  )
}
