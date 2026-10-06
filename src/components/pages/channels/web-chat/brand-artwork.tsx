"use client"

import type { ComponentType, SVGProps } from "react"
import Image, { type StaticImageData } from "next/image"

import { cn } from "@/lib/utils"
import { useWebChatBrand } from "@/components/pages/channels/web-chat/brand-provider"
import { webChatMono } from "@/components/pages/channels/web-chat/fonts"
import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

/** Decorative Figma imagery tints separately from SVG controls and portraits. */
export function BrandArtwork({
  id,
  sizes,
  background,
  UI,
  mobileBackground,
  MobileUI,
  cover = false,
  className,
}: {
  id: string
  sizes: string
  background: StaticImageData
  UI: ComponentType<SVGProps<SVGSVGElement>>
  mobileBackground?: StaticImageData
  MobileUI?: ComponentType<SVGProps<SVGSVGElement>>
  cover?: boolean
  className?: string
}) {
  const { status, hasAccent } = useWebChatBrand()
  const active =
    hasAccent && (status === "personalized" || status === "loading")
  // Fetch the layers as soon as a preview starts loading, but drop them once
  // it settles without an accent: they would only sit there invisible.
  const loadLayers =
    status === "loading" || (status === "personalized" && hasAccent)

  return (
    <div
      aria-hidden="true"
      data-brand-artwork={id}
      className={cn(
        "pointer-events-none absolute inset-0 bg-inherit transition-opacity duration-500 motion-reduce:transition-none",
        webChatMono.variable,
        className
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
