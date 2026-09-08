import type { ReactNode } from "react"
import Image, { type StaticImageData } from "next/image"

import { cn } from "@/lib/utils"
import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

export interface ProductBentoCardProps {
  /** `660/496` for the two row-one cards, `432/496` for the three row-two
   * cards — matches Figma's per-card `card`/`card-key` frame ratio exactly,
   * so at the 1344px desktop container the rendered box is pixel-identical
   * to Figma while still reflowing losslessly at any other width (including
   * the full-width mobile stack, which Figma has no authored frame for —
   * see the task report). */
  aspectRatio: `${number}/${number}`
  illustration: StaticImageData
  sizes: string
  title: string
  body: string
  /** The discrete accent elements (bubbles, buttons, the step pill) that sit
   * on top of the illustration image as real DOM per the shared rules'
   * hybrid decision, positioned in percentages of this card's own box so
   * they track the image at any rendered size. */
  children?: ReactNode
}

/**
 * One card of §3's five-card bento (Task 10). The illustration is a single
 * exported PNG (Figma's `image-bg` group for that card) with a `HueLayer` on
 * top so its baked-in pink accent pixels recolour to the visitor's brand hue
 * exactly the way Figma's own personalized frame does it — a big blurred
 * `❖color`/`!color` ellipse in `hue` blend mode sitting over the same
 * illustration (`45503-149086`). `isolation: isolate` on the illustration
 * host keeps that blend from leaking onto the page behind the card (shared
 * rule 6).
 */
export function ProductBentoCard({
  aspectRatio,
  illustration,
  sizes,
  title,
  body,
  children,
}: ProductBentoCardProps) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border border-[#2A2B33] bg-[#101114]"
      style={{ aspectRatio }}
    >
      <div className="absolute inset-0 isolate">
        <Image
          src={illustration}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
        />
        <HueLayer />
      </div>

      {children}

      <div className="absolute inset-x-0 bottom-0 flex max-w-[376px] flex-col gap-2.5 p-7">
        <h3
          className={cn(
            "text-[20px] leading-[1.25] tracking-[-0.02em] text-white"
          )}
        >
          {title}
        </h3>
        <p className="text-base leading-[1.5] tracking-[-0.02em] text-white/70">
          {body}
        </p>
      </div>
    </div>
  )
}
