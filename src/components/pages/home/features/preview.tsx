"use client"

import Image, { type StaticImageData } from "next/image"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface IPreviewData {
  backgroundImage: StaticImageData | string
  clientFacingImage: StaticImageData | string
  clientFacingVideo?: {
    webm: string
    mp4: string
    poster: string
    displaySize?: {
      width: number
      height: number
    }
  }
  company?: {
    name: string
    about: string
    useCase: string
  }
}

interface IPreviewProps extends IPreviewData {
  channelLabel: string
}

function Preview({
  backgroundImage,
  clientFacingImage,
  clientFacingVideo,
  company,
  channelLabel,
}: IPreviewProps) {
  return (
    <div className="relative flex size-full flex-col justify-center">
      <Image
        className="z-0 object-cover"
        src={backgroundImage}
        alt=""
        fill
        sizes="(min-width: 1024px) 640px, 100vw"
        quality={100}
        aria-hidden
        draggable={false}
      />

      <div className="relative z-10 px-6 py-8 sm:px-4 lg:px-8">
        <div
          className="relative mx-auto aspect-[1118/850] w-full max-w-xl sm:w-[92%] sm:max-w-none"
          style={
            clientFacingVideo
              ? undefined
              : { filter: "drop-shadow(0 22px 55px rgba(0,8,49,0.5))" }
          }
        >
          {clientFacingVideo ? (
            <video
              className={cn(
                "absolute top-1/2 left-1/2 -translate-1/2 rounded-xl shadow-[0_30px_65px_rgba(24,24,48,0.18)]",
                clientFacingVideo.displaySize
                  ? "h-auto max-h-full max-w-full object-contain"
                  : "h-[88.7%] w-[91.4%] object-cover"
              )}
              width={clientFacingVideo.displaySize?.width}
              height={clientFacingVideo.displaySize?.height}
              style={
                clientFacingVideo.displaySize
                  ? { width: clientFacingVideo.displaySize.width }
                  : undefined
              }
              poster={clientFacingVideo.poster}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-label={`${channelLabel} client-facing preview`}
            >
              <source src={clientFacingVideo.webm} type="video/webm" />
              <source src={clientFacingVideo.mp4} type="video/mp4" />
            </video>
          ) : (
            <Image
              className="size-full object-contain"
              src={clientFacingImage}
              alt={`${channelLabel} client-facing preview`}
              sizes="(min-width: 1024px) 559px, 87vw"
              quality={100}
              draggable={false}
            />
          )}

          {company ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`About ${company.name}`}
                  className="absolute top-[6%] left-[6%] h-[8%] w-[42%] cursor-help rounded-md focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
                />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="start"
                sideOffset={12}
                avoidCollisions={false}
                className="max-w-[min(22rem,80vw)] px-3.5 py-2.5 before:hidden after:hidden"
              >
                <span className="flex flex-col gap-1.5 text-left">
                  <span className="text-[13px] font-semibold tracking-tight text-foreground">
                    {company.name}
                  </span>
                  <span className="text-[12.5px] leading-snug text-gray-60">
                    {company.about}
                  </span>
                  <span className="mt-1 border-t border-white/10 pt-2 text-[12.5px] leading-snug text-foreground/90">
                    {company.useCase}
                  </span>
                </span>
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Preview
