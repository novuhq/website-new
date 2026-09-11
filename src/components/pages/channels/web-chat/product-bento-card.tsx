import type { CSSProperties } from "react"
import Image, { type StaticImageData } from "next/image"

import { cn } from "@/lib/utils"
import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

export interface ProductBentoCardProps {
  /** Figma's illustration ratio: 660/496 for wide cards, 432/496 otherwise. */
  aspectRatio: `${number}/${number}`
  /** Crop the artwork above a caption that stays in normal flow below sm. */
  mobileArtworkAspectRatio?: `${number}/${number}`
  illustration: StaticImageData
  mobileIllustration?: StaticImageData
  sizes: string
  title: string
  body: string
}

/** Original 2× artwork is served directly to preserve small UI text. */
export function ProductBentoCard({
  aspectRatio,
  mobileArtworkAspectRatio,
  illustration,
  mobileIllustration,
  sizes,
  title,
  body,
}: ProductBentoCardProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-[#2A2B33] bg-[#101114] sm:aspect-auto sm:h-124 lg:h-auto lg:min-h-112 xl:aspect-[var(--card-aspect-desktop)] xl:min-h-0",
        !mobileArtworkAspectRatio && "aspect-[var(--card-aspect-desktop)]"
      )}
      style={
        {
          "--card-artwork-aspect-mobile": mobileArtworkAspectRatio,
          "--card-aspect-desktop": aspectRatio,
        } as CSSProperties
      }
    >
      {/* Mobile artwork and its caption determine the card height together.
          Keep the painted backdrop for the isolated personalization hue layer. */}
      <div
        className={cn(
          "isolate overflow-hidden bg-inherit",
          mobileArtworkAspectRatio
            ? "relative aspect-[var(--card-artwork-aspect-mobile)] mask-b-from-90% sm:absolute sm:inset-0 sm:aspect-auto sm:mask-none"
            : "absolute inset-0"
        )}
      >
        <picture className="block size-full">
          {mobileIllustration && (
            <source
              media="(max-width: 639px)"
              srcSet={mobileIllustration.src}
              width={mobileIllustration.width}
              height={mobileIllustration.height}
            />
          )}
          <Image
            src={illustration}
            alt=""
            fill
            unoptimized
            sizes={sizes}
            className={cn(
              "object-top sm:object-contain",
              mobileArtworkAspectRatio ? "object-cover" : "object-contain"
            )}
          />
        </picture>
        <HueLayer />
      </div>

      <div
        className={cn(
          "inset-x-0 bottom-0 flex flex-col gap-2.5 p-5 sm:absolute md:max-w-136 md:p-7 lg:max-w-[376px] lg:p-5 xl:max-w-108 xl:p-7",
          mobileIllustration && "gap-2 p-4 sm:gap-2.5 sm:p-5",
          !mobileArtworkAspectRatio && "absolute"
        )}
      >
        <h3
          className={cn(
            "text-xl leading-[1.25] tracking-[-0.02em] text-white",
            mobileIllustration && "text-base sm:text-xl"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-base leading-[1.5] tracking-[-0.02em] text-white/70",
            mobileIllustration && "text-sm sm:text-base"
          )}
        >
          {body}
        </p>
      </div>
    </div>
  )
}
