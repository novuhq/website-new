"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import reviewArrowIcon from "@/images/pages/mcp/icons/review-arrow.svg"

import { cn } from "@/lib/utils"

import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"

const SlickSlider = dynamic(() => import("react-slick"), { ssr: false })

const MOBILE_BREAKPOINT = 640
const TABLET_BREAKPOINT = 1024

const NextArrow = (props: { onClick?: () => void }) => {
  const { onClick } = props
  return (
    <button
      className="group absolute inset-y-1/2 right-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-[#333347]/60 to-[#2B2B3B]/40 p-[1px] transition-all duration-300 hover:from-[#272730] hover:via-[#5C638A]/50 hover:to-[#5C638A] md:-right-[3.25rem] xl:-right-16"
      type="button"
      aria-label="Next testimonial"
      onClick={onClick}
    >
      <span className="flex h-full w-full items-center justify-center rounded-full bg-[#111018] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#111018] group-hover:via-[#302D43] group-hover:to-[#464C6D]">
        <Image
          src={reviewArrowIcon}
          alt=""
          width={32}
          height={32}
          className="h-auto w-full rotate-180"
          aria-hidden
        />
      </span>
    </button>
  )
}

const PrevArrow = (props: { onClick?: () => void }) => {
  const { onClick } = props
  return (
    <button
      className="group absolute inset-y-1/2 left-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-[#333347]/60 to-[#2B2B3B]/40 p-[1px] transition-all duration-300 hover:from-[#272730] hover:via-[#5C638A]/50 hover:to-[#5C638A] md:-left-[3.25rem] xl:-left-16"
      type="button"
      aria-label="Prev testimonial"
      onClick={onClick}
    >
      <span className="flex h-full w-full items-center justify-center rounded-full bg-[#111018] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#111018] group-hover:via-[#302D43] group-hover:to-[#464C6D]">
        <Image
          src={reviewArrowIcon}
          alt=""
          width={32}
          height={32}
          className="h-auto w-full"
          aria-hidden
        />
      </span>
    </button>
  )
}

export default function Slider({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
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

  const settings = {
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
  }

  return (
    <SlickSlider className={cn("flex w-full", className)} {...settings}>
      {children}
    </SlickSlider>
  )
}
