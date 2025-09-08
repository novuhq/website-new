"use client"

import { ReactNode } from "react"
import Zoom from "react-medium-image-zoom"

import "@/styles/zoom.css"

interface IZoomIllustrationProps {
  children: ReactNode
  src: string
}

function ZoomIllustration({ children, src }: IZoomIllustrationProps) {
  return (
    <Zoom zoomImg={{ src }} zoomMargin={32}>
      {children}
    </Zoom>
  )
}

export default ZoomIllustration
