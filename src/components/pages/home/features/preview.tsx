"use client"

import { useEffect, useRef } from "react"
import Image, { type StaticImageData } from "next/image"

import { cn } from "@/lib/utils"

import CompanyTooltip, { type IFeatureCompany } from "./company-tooltip"

export interface IPreviewData {
  backgroundImage: StaticImageData | string
  clientFacingImage?: StaticImageData | string
  clientFacingImageClassName?: string
  clientFacingImageSizes?: string
  clientFacingLabel?: string
  clientFacingUnderlayVideo?: {
    webm: string
    mp4: string
    poster: string
    className?: string
  }
  clientFacingVideo?: {
    webm: string
    mp4: string
    poster: string
    displaySize?: {
      width: number
      height: number
    }
  }
  company?: IFeatureCompany
}

interface IPreviewProps extends IPreviewData {
  channelLabel: string
  isActive: boolean
}

function Preview({
  backgroundImage,
  clientFacingImage,
  clientFacingImageClassName,
  clientFacingImageSizes,
  clientFacingLabel,
  clientFacingUnderlayVideo,
  clientFacingVideo,
  company,
  channelLabel,
  isActive,
}: IPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!isActive) {
      video.pause()
      return
    }

    void video.play().catch(() => undefined)

    return () => {
      video.pause()
    }
  }, [isActive])

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

      {clientFacingImageClassName && clientFacingImage && !clientFacingVideo ? (
        <div className={cn("absolute z-10", clientFacingImageClassName)}>
          {clientFacingUnderlayVideo ? (
            <video
              ref={videoRef}
              className={cn(
                "absolute z-0 block object-cover",
                clientFacingUnderlayVideo.className
              )}
              poster={clientFacingUnderlayVideo.poster}
              autoPlay={isActive}
              loop
              muted
              playsInline
              preload={isActive ? "auto" : "metadata"}
              aria-hidden
            >
              <source src={clientFacingUnderlayVideo.mp4} type="video/mp4" />
              <source src={clientFacingUnderlayVideo.webm} type="video/webm" />
            </video>
          ) : null}
          <Image
            className="relative z-10 block h-auto w-full object-contain"
            src={clientFacingImage}
            alt={`${channelLabel} client-facing preview`}
            sizes={clientFacingImageSizes}
            quality={90}
            loading="eager"
            fetchPriority={isActive ? "high" : "low"}
            draggable={false}
          />
        </div>
      ) : (
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
              <div
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-1/2 overflow-hidden rounded-xl shadow-[0_30px_65px_rgba(24,24,48,0.18)]",
                  clientFacingVideo.displaySize
                    ? "max-w-full"
                    : "h-[88.7%] w-[91.4%]"
                )}
                style={
                  clientFacingVideo.displaySize
                    ? {
                        width: clientFacingVideo.displaySize.width,
                        aspectRatio: `${clientFacingVideo.displaySize.width} / ${clientFacingVideo.displaySize.height}`,
                      }
                    : undefined
                }
              >
                <video
                  ref={videoRef}
                  className={cn(
                    "block size-full",
                    clientFacingVideo.displaySize
                      ? "object-contain"
                      : "object-cover"
                  )}
                  width={clientFacingVideo.displaySize?.width}
                  height={clientFacingVideo.displaySize?.height}
                  poster={clientFacingVideo.poster}
                  autoPlay={isActive}
                  loop
                  muted
                  playsInline
                  preload={isActive ? "auto" : "metadata"}
                  aria-label={`${channelLabel} client-facing preview`}
                >
                  <source src={clientFacingVideo.mp4} type="video/mp4" />
                  <source src={clientFacingVideo.webm} type="video/webm" />
                </video>
              </div>
            ) : clientFacingImage ? (
              <Image
                className="size-full object-contain"
                src={clientFacingImage}
                alt={`${channelLabel} client-facing preview`}
                sizes="(min-width: 1024px) 559px, 87vw"
                quality={100}
                draggable={false}
              />
            ) : null}
          </div>
        </div>
      )}

      {company && (!clientFacingImageClassName || clientFacingVideo) ? (
        <CompanyTooltip company={company} />
      ) : null}

      {clientFacingLabel ? (
        <span className="absolute top-[5.05%] left-1/2 z-20 flex h-9 w-29 -translate-x-1/2 items-center justify-center rounded-full bg-black/80 px-4 text-sm leading-none font-medium tracking-[-0.04em] whitespace-nowrap text-white backdrop-blur-[6px]">
          <span
            className="pointer-events-none absolute inset-0 rounded-full border border-white mix-blend-overlay"
            aria-hidden
          />
          <span className="relative">{clientFacingLabel}</span>
        </span>
      ) : null}
    </div>
  )
}

export default Preview
