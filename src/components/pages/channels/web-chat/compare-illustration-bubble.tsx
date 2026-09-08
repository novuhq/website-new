import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

export interface IllustrationBubbleProps {
  text: string
  /** Absolute `left`/`top`/`width` in px, measured against the exported illustration at 1x (CSS) scale. */
  left: number
  top: number
  width: number
  compact?: boolean
}

/**
 * The single "discrete accent element" the brief calls for on top of each
 * card's exported illustration: the user's chat bubble. Per the hybrid
 * decision, the illustration PNG already bakes in a bubble at this exact
 * position/size (whatever colour the exported reference happened to use) —
 * this div is sized and positioned to sit pixel-for-pixel on top of it, so
 * its opaque `var(--wc-accent)` fill fully occludes the baked pixels rather
 * than blending with them. Position/size verified empirically against the
 * exported PNGs (pixel-sampled the bubble's fill boundary), not solely
 * derived from the Figma JSON — the JSON's nested-group offsets undershot
 * the true render position by a few px in one case (card 2 desktop).
 *
 * Desktop style: Figma `style_daa6c90d` (Inter 16px/1.2/-0.01em) + bubble
 * frame padding `9px 20px 9px 10px`, border `rgba(255,255,255,0.2)`, radius
 * `14px 14px 2px 14px`, shadow `0 3.6px 7.3px rgba(0,0,0,0.2)`
 * (`45487:79835`/`45487:79878`). Mobile uses a single representative style
 * averaged from the two mobile bubble frames (`45510:177618` scale ~0.7786x,
 * `45510:177664` scale ~0.6787x) rather than two card-specific scale
 * factors — a deliberate simplification, the two differ by under 2px.
 */
export function IllustrationBubble({
  text,
  left,
  top,
  width,
  compact,
}: IllustrationBubbleProps) {
  return (
    <p
      className={cn(
        "absolute flex items-center rounded-tl-[14px] rounded-tr-[14px] rounded-br-[2px] rounded-bl-[14px] border border-white/20 pt-[9px] pr-5 pb-[9px] pl-2.5 text-[16px] leading-[1.2] tracking-[-0.01em] shadow-[0_4px_7px_rgba(0,0,0,0.2)]",
        compact &&
          "rounded-tl-[11px] rounded-tr-[11px] rounded-br-[2px] rounded-bl-[11px] pt-[7px] pr-3.5 pb-[7px] pl-[7px] text-[12px]"
      )}
      style={
        {
          left,
          top,
          width,
          backgroundColor: "var(--wc-accent)",
          color: "var(--wc-accent-foreground)",
        } as CSSProperties
      }
    >
      {text}
    </p>
  )
}
