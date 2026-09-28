"use client"

import { useRef, useState } from "react"
import Image from "next/image"

import type { DirectoryImageAsset } from "@/lib/directory"
import { cn } from "@/lib/utils"
import ZoomIllustration from "@/components/ui/zoom-illustration"

interface DirectoryGalleryProps {
  images: DirectoryImageAsset[]
  title: string
}

export default function DirectoryGallery({
  images,
  title,
}: DirectoryGalleryProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateActiveIndex = () => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const items = Array.from(
      viewport.querySelectorAll<HTMLElement>("[data-directory-gallery-item]")
    )
    const step = items[1]
      ? items[1].offsetLeft - items[0].offsetLeft
      : items[0]?.offsetWidth || 1
    const index = Math.round(viewport.scrollLeft / step)

    setActiveIndex(Math.min(Math.max(index, 0), images.length - 1))
  }

  const scrollToImage = (index: number) => {
    const viewport = viewportRef.current
    const items = viewport
      ? Array.from(
          viewport.querySelectorAll<HTMLElement>(
            "[data-directory-gallery-item]"
          )
        )
      : []
    const item = items[index]
    const firstItem = items[0]

    if (!viewport || !item || !firstItem) {
      return
    }

    viewport.scrollTo({
      behavior: "smooth",
      left: item.offsetLeft - firstItem.offsetLeft,
    })
    setActiveIndex(index)
  }

  return (
    <section
      className="relative mt-8 min-h-53 border-y border-[#1f1e2b] bg-[linear-gradient(90deg,rgba(17,16,24,0)_5%,#111018_30%,#111018_70%,rgba(17,16,24,0)_95%)] md:mt-[46px] md:min-h-64 lg:mt-[46px] xl:mt-[54px] xl:min-h-68"
      aria-label={`${title} screenshots`}
    >
      <div
        ref={viewportRef}
        className="scrollbar-hidden relative z-10 mx-auto flex w-full max-w-224 snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-5 py-5 md:w-[calc(100%-4rem)] md:gap-6 md:px-0 md:py-7 lg:w-[calc(100%-5rem)]"
        onScroll={updateActiveIndex}
      >
        {images.map((image, index) => (
          <div
            className="w-72 shrink-0 snap-start rounded-[10px] md:w-88 lg:w-96"
            data-directory-gallery-item
            key={image.src}
          >
            <ZoomIllustration src={image.src}>
              <Image
                className="aspect-video w-full rounded-[10px] object-cover object-center outline-offset-2 hover:outline hover:outline-1 hover:outline-gray-10"
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                priority={index === 0}
                quality={90}
                sizes="(max-width: 767px) 288px, (max-width: 1023px) 352px, 384px"
              />
            </ZoomIllustration>
          </div>
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-20 hidden bg-black [mask-image:linear-gradient(90deg,#05050b_0%,transparent_30%,transparent_70%,#05050b_100%)] lg:block"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-1 z-30 flex justify-center gap-1">
        {images.map((image, index) => (
          <button
            className="group flex size-5 items-center justify-center rounded-full"
            type="button"
            aria-label={`Show screenshot ${index + 1} of ${images.length}`}
            aria-current={activeIndex === index ? "true" : undefined}
            onClick={() => scrollToImage(index)}
            key={image.src}
          >
            <span
              className={cn(
                "size-1.5 rounded-full bg-[#534b5d]/60 transition-colors group-hover:bg-gray-7",
                activeIndex === index && "bg-white/80"
              )}
              aria-hidden
            />
          </button>
        ))}
      </div>
    </section>
  )
}
