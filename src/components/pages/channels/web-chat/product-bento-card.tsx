import type { CSSProperties } from "react"
import Image, { type StaticImageData } from "next/image"
import type { ProductBentoCardCopy } from "@/data/pages/web-chat-product-bento"

import { cn } from "@/lib/utils"
import { ProductBentoArtwork } from "@/components/pages/channels/web-chat/product-bento-artwork"

import { PRODUCT_TABLET_IMAGES } from "./product-bento-tablet-images"

export interface ProductBentoCardProps {
  id: ProductBentoCardCopy["id"]
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

/** Original 2× artwork plus separate layers for personalized controls. */
export function ProductBentoCard({
  id,
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
        "relative w-full overflow-hidden rounded-3xl border border-[#2A2B33] bg-[#101114] after:pointer-events-none after:absolute after:-inset-px after:z-20 after:rounded-[inherit] after:border-x after:border-[#2A2B33] sm:aspect-auto sm:h-124 md:h-120 lg:h-112 xl:aspect-[var(--card-aspect-desktop)] xl:h-auto xl:min-h-0",
        !mobileArtworkAspectRatio &&
          "aspect-[var(--card-aspect-desktop)] lg:rounded-[17.143px] xl:rounded-3xl",
        mobileArtworkAspectRatio && "lg:h-120"
      )}
      style={
        {
          "--card-artwork-aspect-mobile": mobileArtworkAspectRatio,
          "--card-aspect-desktop": aspectRatio,
        } as CSSProperties
      }
    >
      {/* Mobile artwork and its caption determine the card height together. */}
      <div
        className={cn(
          "isolate overflow-hidden bg-inherit",
          mobileArtworkAspectRatio
            ? "relative aspect-[var(--card-artwork-aspect-mobile)] mask-b-from-90% sm:absolute sm:inset-0 sm:aspect-auto sm:mask-none"
            : "absolute inset-0"
        )}
      >
        <picture className="absolute inset-0 block size-full">
          {PRODUCT_TABLET_IMAGES[id].map(({ id: variantId, image, media }) => (
            <source
              key={variantId}
              media={media}
              srcSet={image.src}
              width={image.width}
              height={image.height}
            />
          ))}
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
              "object-top sm:object-contain md:object-cover md:object-center xl:object-contain xl:object-top",
              mobileArtworkAspectRatio ? "object-cover" : "object-contain"
            )}
          />
        </picture>
        <ProductBentoArtwork id={id} sizes={sizes} />
      </div>

      <div
        className={cn(
          "inset-x-0 bottom-0 flex flex-col gap-2.5 p-5 sm:absolute md:p-4 lg:max-w-none lg:p-4 xl:max-w-108 xl:p-7",
          mobileIllustration && "gap-2 p-4 sm:gap-2.5 sm:p-5 md:p-4",
          id === "subscriber" && "md:max-w-[422px] lg:max-w-none xl:max-w-108",
          id === "activity" && "md:max-w-[457px] lg:max-w-none xl:max-w-108",
          !mobileArtworkAspectRatio && "absolute"
        )}
      >
        <h3
          className={cn(
            "text-xl leading-[1.25] tracking-[-0.02em] text-white",
            mobileIllustration &&
              "text-base sm:text-xl md:leading-[1.25] xl:leading-7"
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
