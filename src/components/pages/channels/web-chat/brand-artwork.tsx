"use client"

import type { ComponentType, SVGProps } from "react"
import { Geist_Mono } from "next/font/google"
import Image, { type StaticImageData } from "next/image"

import { cn } from "@/lib/utils"
import { useWebChatBrand } from "@/components/pages/channels/web-chat/brand-provider"
import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-web-chat-mono",
})

/** Decorative Figma imagery tints separately from SVG controls and portraits. */
export function BrandArtwork({
  id,
  sizes,
  background,
  UI,
  mobileBackground,
  MobileUI,
  cover = false,
}: {
  id: string
  sizes: string
  background: StaticImageData
  UI: ComponentType<SVGProps<SVGSVGElement>>
  mobileBackground?: StaticImageData
  MobileUI?: ComponentType<SVGProps<SVGSVGElement>>
  cover?: boolean
}) {
  const { status, hasAccent } = useWebChatBrand()
  const active =
    hasAccent && (status === "personalized" || status === "loading")
  const loadLayers = status === "personalized" || status === "loading"

  return (
    <div
      aria-hidden="true"
      data-brand-artwork={id}
      className={cn(
        "pointer-events-none absolute inset-0 bg-inherit transition-opacity duration-500 motion-reduce:transition-none",
        geistMono.variable
      )}
      style={{ opacity: Number(active) }}
    >
      <div className="absolute inset-0 isolate bg-inherit">
        {loadLayers && (
          <picture className="absolute inset-0">
            {mobileBackground && (
              <source
                media="(max-width: 639px)"
                srcSet={mobileBackground.src}
              />
            )}
            <Image
              src={background}
              alt=""
              fill
              unoptimized
              sizes={sizes}
              className={cn(
                cover ? "object-cover" : "object-top sm:object-contain",
                !cover && (mobileBackground ? "object-cover" : "object-contain")
              )}
            />
          </picture>
        )}
        <HueLayer />
      </div>
      {loadLayers && (
        <>
          <UI
            data-brand-ui={id}
            className={cn(
              "absolute inset-0 size-full",
              MobileUI && "hidden sm:block"
            )}
            preserveAspectRatio={cover ? "xMidYMid slice" : "xMidYMin meet"}
          />
          {MobileUI && (
            <MobileUI
              data-brand-ui={id}
              className="absolute inset-0 size-full sm:hidden"
              preserveAspectRatio="xMidYMin slice"
            />
          )}
        </>
      )}
    </div>
  )
}
