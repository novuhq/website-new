"use client"

import { ReactNode } from "react"
import { type SanityImageSource } from "@sanity/image-url/lib/types/types"
import Zoom from "react-medium-image-zoom"

import { getProcessedImageUrl } from "@/lib/sanity/utils/get-url-for-image"

interface IZoomIllustrationProps {
  children: ReactNode
  src: string
  originalAsset?: SanityImageSource
}

function ZoomIllustration({
  children,
  src,
  originalAsset,
}: IZoomIllustrationProps) {
  const isGif = src.includes(".gif")

  const cleanSrc = isGif
    ? `${src.split(".gif")[0]}.gif`
    : originalAsset
      ? getProcessedImageUrl(originalAsset, { original: true }) || src
      : src

  return (
    <Zoom zoomImg={{ src: cleanSrc }} zoomMargin={32}>
      {children}
    </Zoom>
  )
}

export default ZoomIllustration
