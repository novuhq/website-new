"use client"

import { cn } from "@/lib/utils"

/**
 * Recolours whatever illustration sits behind it to the personalized brand hue,
 * via a `mix-blend-mode: hue` overlay reading `--wc-accent` through `--wc-hue`.
 *
 * Defaults to the provider's `data-wc-state`. Choreographed previews can
 * control visibility explicitly and mask transparent artwork to its alpha.
 *
 * Fade the tint over 500ms. Isolated hosts must supply an opaque backdrop
 * wherever the artwork does not cover them, or mask this layer to its alpha.
 */
export function HueLayer({
  className,
  active,
  maskImage,
}: {
  className?: string
  /** Explicit visibility for previews whose theme is revealed in stages. */
  active?: boolean
  /** Preserve the silhouette when the source artwork has transparent edges. */
  maskImage?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-data-[wc-state=loading]:opacity-100 group-data-[wc-state=personalized]:opacity-100 motion-reduce:transition-none",
        className
      )}
      style={{
        background: "var(--wc-hue)",
        mixBlendMode: "hue",
        opacity: active === undefined ? undefined : Number(active),
        maskImage: maskImage ? `url("${maskImage}")` : undefined,
        maskSize: maskImage ? "100% 100%" : undefined,
        maskRepeat: maskImage ? "no-repeat" : undefined,
      }}
    />
  )
}
