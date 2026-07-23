"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { Settings } from "react-slick"

import { cn } from "@/lib/utils"

import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"

function ReviewArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      className={cn(
        "h-auto w-full shrink-0 text-gray-6 transition-colors duration-300 group-hover:text-foreground",
        className
      )}
      aria-hidden
    >
      <path
        d="M17.6641 21.332L12.3307 15.9987L17.6641 10.6654"
        stroke="currentColor"
        strokeWidth={1.33333}
        strokeMiterlimit={10}
        strokeLinecap="square"
      />
    </svg>
  )
}

const SlickSlider = dynamic(() => import("react-slick"), { ssr: false })

const MOBILE_BREAKPOINT = 640
const TABLET_BREAKPOINT = 1024

interface ISliderViewportSettings {
  maxWidth: number
  settings: Settings
}

interface ISliderSlidePitch {
  gap: number
  maxCardWidth: number
  viewportOffset: number
}

const NextArrow = (props: { onClick?: () => void }) => {
  const { onClick } = props
  return (
    <button
      className="group absolute inset-y-1/2 right-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-[#333347]/60 to-[#2B2B3B]/40 p-px transition-all duration-300 hover:from-[#272730] hover:via-[#5C638A]/50 hover:to-[#5C638A] md:-right-13 xl:-right-16"
      type="button"
      aria-label="Next testimonial"
      onClick={onClick}
    >
      <span className="flex h-full w-full items-center justify-center rounded-full bg-[#111018] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#111018] group-hover:via-[#302D43] group-hover:to-[#464C6D]">
        <ReviewArrowIcon className="rotate-180" />
      </span>
    </button>
  )
}

const PrevArrow = (props: { onClick?: () => void }) => {
  const { onClick } = props
  return (
    <button
      className="group absolute inset-y-1/2 left-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-[#333347]/60 to-[#2B2B3B]/40 p-px transition-all duration-300 hover:from-[#272730] hover:via-[#5C638A]/50 hover:to-[#5C638A] md:-left-13 xl:-left-16"
      type="button"
      aria-label="Prev testimonial"
      onClick={onClick}
    >
      <span className="flex h-full w-full items-center justify-center rounded-full bg-[#111018] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#111018] group-hover:via-[#302D43] group-hover:to-[#464C6D]">
        <ReviewArrowIcon />
      </span>
    </button>
  )
}

export default function Slider({
  children,
  className,
  slidePitch,
  settings: customSettings,
  viewportSettings,
}: {
  children: React.ReactNode
  className?: string
  slidePitch?: ISliderSlidePitch
  settings?: Settings
  viewportSettings?: ISliderViewportSettings[]
}) {
  const [viewportWidth, setViewportWidth] = useState<number | null>(null)

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth)

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  if (viewportWidth === null) return null

  const isMobile = viewportWidth < MOBILE_BREAKPOINT
  const slidesToShow = isMobile ? 1 : viewportWidth < TABLET_BREAKPOINT ? 2 : 3
  const viewportOverrideSettings = viewportSettings
    ? [...viewportSettings]
        .sort((a, b) => a.maxWidth - b.maxWidth)
        .find(({ maxWidth }) => viewportWidth <= maxWidth)?.settings
    : undefined
  const pitchOverrideSettings = slidePitch
    ? {
        slidesToShow:
          viewportWidth /
          (Math.min(
            slidePitch.maxCardWidth,
            Math.max(0, viewportWidth - slidePitch.viewportOffset)
          ) +
            slidePitch.gap),
      }
    : undefined

  const settings: Settings = {
    dots: isMobile,
    infinite: true,
    slidesToShow,
    slidesToScroll: 1,
    arrows: !isMobile,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    swipe: true,
    swipeToSlide: true,
    touchMove: true,
    draggable: true,
    accessibility: true,
    pauseOnHover: false,
    pauseOnFocus: false,
    ...customSettings,
    ...viewportOverrideSettings,
    ...pitchOverrideSettings,
  }

  return (
    <SlickSlider className={cn("flex w-full", className)} {...settings}>
      {children}
    </SlickSlider>
  )
}
