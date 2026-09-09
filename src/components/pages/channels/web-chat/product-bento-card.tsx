import type { CSSProperties } from "react"
import Image, { type StaticImageData } from "next/image"

import { cn } from "@/lib/utils"
import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

export interface ProductBentoCardProps {
  /** Figma's illustration ratio: 660/496 for wide cards, 432/496 otherwise. */
  aspectRatio: `${number}/${number}`
  /** Extra mobile height reserves room for live captions below the artwork. */
  mobileAspectRatio?: `${number}/${number}`
  illustration: StaticImageData
  sizes: string
  title: string
  body: string
}

/** Original 2× artwork is served directly to preserve small UI text. */
export function ProductBentoCard({
  aspectRatio,
  mobileAspectRatio,
  illustration,
  sizes,
  title,
  body,
}: ProductBentoCardProps) {
  return (
    <div
      className="relative aspect-[var(--card-aspect-mobile)] w-full overflow-hidden rounded-3xl border border-[#2A2B33] bg-[#101114] md:aspect-[var(--card-aspect-desktop)]"
      style={
        {
          "--card-aspect-mobile": mobileAspectRatio ?? aspectRatio,
          "--card-aspect-desktop": aspectRatio,
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 isolate">
        <Image
          src={illustration}
          alt=""
          fill
          unoptimized
          sizes={sizes}
          className="object-contain object-top"
        />
        <HueLayer />
      </div>

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
