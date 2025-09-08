"use client"

import { ReactNode } from "react"
import Zoom from "react-medium-image-zoom"

interface IZoomIllustrationProps {
  children: ReactNode
  src: string
}

function ZoomIllustration({ children, src }: IZoomIllustrationProps) {
  const isGif = src.includes(".gif")
  const cleanSrc = isGif ? `${src.split(".gif")[0]}.gif` : src

  return (
    <Zoom zoomImg={{ src: cleanSrc }} zoomMargin={32}>
      {children}
    </Zoom>
  )
}

export default ZoomIllustration
