import Image from "next/image"

import { cn } from "@/lib/utils"

import { LandingButtonLink } from "./action-link"
import type { PictureSectionData } from "./types"

interface PictureSectionProps extends PictureSectionData {
  className?: string
  contentClassName?: string
  fadeEdges?: boolean
  imageClassName?: string
  mediaClassName?: string
  mediaInnerClassName?: string
  priority?: boolean
  theme?: "image-left" | "image-right"
}

export function PictureSection({
  action,
  className,
  contentClassName,
  description,
  fadeEdges = false,
  image,
  imageClassName,
  mediaClassName,
  mediaInnerClassName,
  priority = false,
  theme = "image-left",
  title,
}: PictureSectionProps) {
  const imageOnLeft = theme === "image-left"

  return (
    <section className={className ?? "mt-14 md:mt-26 lg:mt-36 xl:mt-40"}>
      <div className="mx-auto w-full max-w-304 px-4 md:px-7">
        <div className="grid grid-cols-1 items-center justify-items-center md:grid-cols-2">
          <div
            className={cn(
              "relative z-10 order-1 mb-6 text-center md:mb-0 md:text-left",
              imageOnLeft
                ? "md:order-2 md:pl-8 lg:pl-16 xl:pl-24"
                : "md:order-1 md:pr-8 lg:pr-16 xl:pr-24",
              contentClassName
            )}
          >
            <h2 className="text-[28px] leading-dense font-medium tracking-tighter text-balance text-white md:text-[32px] lg:text-[40px] xl:text-[48px]">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-normal font-book tracking-tighter text-pretty text-gray-8 lg:text-lg">
              {description}
            </p>
            {action ? (
              <LandingButtonLink
                className="mt-5 md:mt-6 lg:mt-8"
                action={action}
                secondary
              />
            ) : null}
          </div>

          <div
            className={cn(
              "pointer-events-none relative order-2 w-full overflow-visible md:order-none",
              imageOnLeft ? "md:order-1" : "md:order-2",
              mediaClassName
            )}
          >
            <div className={cn("absolute", mediaInnerClassName)}>
              <Image
                className={cn("h-auto max-w-none select-none", imageClassName)}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                quality={100}
                priority={priority}
                sizes="(max-width: 767px) 100vw, 60vw"
              />
              {fadeEdges ? (
                <span
                  className="pointer-events-none absolute inset-0 shadow-[inset_0_0_20px_20px_hsl(var(--background))]"
                  aria-hidden
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
