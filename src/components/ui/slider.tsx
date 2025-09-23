"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

import { cn } from "@/lib/utils"
import DynamicIcon from "@/components/dynamic-icon"

import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"

const SlickSlider = dynamic(() => import("react-slick"), { ssr: false })

const NextArrow = (props: { onClick?: () => void }) => {
  const { onClick } = props
  return (
    <button
      className="group absolute inset-y-1/2 -right-9 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-[#333347]/60 to-[#2B2B3B]/40 p-[1px] transition-all duration-300 hover:from-[#272730] hover:via-[#5C638A]/50 hover:to-[#5C638A] md:-right-[52px] xl:-right-16"
      type="button"
      aria-label="Next testimonial"
      onClick={onClick}
    >
      <span className="flex h-full w-full items-center justify-center rounded-full bg-[#111018] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#111018] group-hover:via-[#302D43] group-hover:to-[#464C6D]">
        <DynamicIcon icon="chevron-right" color="#C7C9D1" />
      </span>
    </button>
  )
}

const PrevArrow = (props: { onClick?: () => void }) => {
  const { onClick } = props
  return (
    <button
      className="group absolute inset-y-1/2 -left-9 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-[#333347]/60 to-[#2B2B3B]/40 p-[1px] transition-all duration-300 hover:from-[#272730] hover:via-[#5C638A]/50 hover:to-[#5C638A] md:-left-[52px] xl:-left-16"
      type="button"
      aria-label="Prev testimonial"
      onClick={onClick}
    >
      <span className="flex h-full w-full items-center justify-center rounded-full bg-[#111018] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#111018] group-hover:via-[#302D43] group-hover:to-[#464C6D]">
        <DynamicIcon icon="chevron-left" color="#C7C9D1" />
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
  const [slidesToShow, setSlidesToShow] = useState<number | null>(null)

  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth
      if (width < 524) setSlidesToShow(1)
      else if (width < 1024) setSlidesToShow(2)
      else setSlidesToShow(3)
    }

    updateSlides()
    window.addEventListener("resize", updateSlides)
    return () => window.removeEventListener("resize", updateSlides)
  }, [])

  if (slidesToShow === null) return null

  const settings = {
    dots: window.innerWidth < 768,
    infinite: true,
    slidesToShow,
    slidesToScroll: 1,
    arrows: window.innerWidth >= 768,
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
