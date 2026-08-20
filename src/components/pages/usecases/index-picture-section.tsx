import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import type { IndexPictureSectionData } from "./types"

const textClassNames: Record<IndexPictureSectionData["id"], string> = {
  hero: "pt-0 pb-16 lg:pt-[76px] lg:pb-[100px]",
  "multi-channel": "mt-28 pt-0 pb-20 md:mt-0 md:py-40 lg:py-52",
  application: "pt-0 pb-36 sm:pb-28 md:py-32 lg:py-46",
  management: "pt-0 pb-32 sm:pb-20 md:py-10 lg:py-20",
  content: "pt-0 pb-20 md:py-32 lg:py-72",
}

const imageClassNames: Record<IndexPictureSectionData["id"], string> = {
  hero: "w-[160%] -translate-x-[calc(50%+50px)] -translate-y-[calc(50%+76px)] sm:w-[130%] md:w-[700px] lg:w-[1000px] lg:-translate-y-[calc(50%+94px)] xl:w-[1216px] xl:-translate-x-1/2",
  "multi-channel":
    "w-[150%] -translate-x-[calc(50%+4px)] -translate-y-[calc(50%+42px)] sm:w-[130%] md:w-[1000px] lg:w-[1354px]",
  application:
    "w-[150%] -translate-x-[calc(50%-73px)] -translate-y-[calc(50%+156px)] sm:w-[130%] md:w-[1000px] lg:w-[1106px]",
  management:
    "w-[150%] -translate-x-[calc(50%+49px)] -translate-y-[calc(50%+111px)] sm:w-[130%] md:w-[800px] lg:w-[919px] lg:-translate-x-[calc(50%+19px)]",
  content:
    "w-[150%] -translate-x-[calc(50%-55px)] -translate-y-[calc(50%-20px)] min-[501px]:w-[130%] md:w-[700px] md:-translate-y-[calc(50%+56px)] lg:w-[850px] xl:w-[1000px] xl:-translate-x-[calc(50%-60px)] 2xl:w-[1343px] 2xl:-translate-x-1/2",
}

interface IndexPictureSectionProps {
  data: IndexPictureSectionData
}

function IndexPictureSection({ data }: IndexPictureSectionProps) {
  return (
    <section className="mt-14 md:mt-26 lg:mt-36 xl:mt-40">
      <div className="mx-auto w-full max-w-304 px-4 md:px-7 lg:px-8">
        <div className="grid items-center justify-items-center md:grid-cols-2">
          <div
            className={cn(
              "relative z-10 order-first mb-6 text-center md:mb-0 md:text-left",
              data.imageSide === "left"
                ? "md:order-last md:pl-8 lg:pl-16 xl:pl-24"
                : "md:pr-8 lg:pr-16 xl:pr-24",
              textClassNames[data.id]
            )}
          >
            <h2 className="text-3xl leading-[1.125] font-medium tracking-tighter text-white md:text-[32px] lg:text-5xl xl:text-6xl">
              {data.title}
            </h2>
            <p className="mt-4 text-sm font-book tracking-tighter text-gray-8 lg:text-lg">
              {data.description}
            </p>
            <Button
              className="mt-5 !h-12 !px-6 !text-sm uppercase md:mt-6 lg:mt-8"
              variant="outline"
              size="none"
              asChild
            >
              <a
                href={data.action.href}
                data-click-location={`usecases_${data.id}`}
                data-click-text={data.action.label
                  .toLowerCase()
                  .replaceAll(" ", "_")}
              >
                {data.action.label}
              </a>
            </Button>
          </div>
          <div className="pointer-events-none relative z-0 h-[200px] w-full sm:h-[300px] md:h-full">
            <div
              className={cn(
                "absolute top-1/2 left-1/2 aspect-[var(--usecase-image-ratio)] max-w-none",
                imageClassNames[data.id]
              )}
              style={
                {
                  "--usecase-image-ratio": `${data.image.width} / ${data.image.height}`,
                } as React.CSSProperties
              }
            >
              <Image
                className="object-cover"
                src={data.image.src}
                alt={data.image.alt}
                fill
                sizes="(max-width: 767px) 160vw, (max-width: 1023px) 1000px, 1354px"
                priority={data.id === "hero"}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IndexPictureSection
