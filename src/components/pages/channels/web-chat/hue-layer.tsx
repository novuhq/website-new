"use client"

import { cn } from "@/lib/utils"

/**
 * Recolours whatever illustration sits behind it to the personalized brand hue,
 * via a `mix-blend-mode: hue` overlay reading `--wc-accent` through `--wc-hue`.
 *
 * Defaults to the provider's `data-wc-color`. Choreographed previews can
 * control visibility explicitly.
 *
 * Fade the tint over 500ms. Isolated hosts must supply an opaque backdrop
 * wherever the artwork does not cover them.
 */
export function HueLayer({
  className,
  active,
}: {
  className?: string
  /** Explicit visibility for previews whose theme is revealed in stages. */
  active?: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-data-[wc-color=brand]:opacity-100 motion-reduce:transition-none",
        className
      )}
      style={{
        background: "var(--wc-hue)",
        mixBlendMode: "hue",
        opacity: active === undefined ? undefined : Number(active),
      }}
    />
  )
}
