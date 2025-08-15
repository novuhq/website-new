"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

import { Link } from "@/components/ui/link"
import DynamicIcon from "@/components/dynamic-icon"

import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"

const SlickSlider = dynamic(() => import("react-slick"), { ssr: false })

const NextArrow = (props: any) => {
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

const PrevArrow = (props: any) => {
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

const ReviewCard = ({ name, text, tweet_link: tweetLink, logo, tag }: any) => {
  return (
    <div className="relative h-full w-full md:max-w-[384px]">
      <Link
        className="relative z-10 flex h-full flex-col items-start rounded-xl border border-[rgba(51,51,71,0.60)] bg-[#111018] px-5 py-[18px] text-start transition-colors duration-300 hover:bg-[#15141D] md:px-6 md:py-5"
        href={tweetLink}
        variant="white"
      >
        <p
          className="[&>span]:text-primary-1 mb-5 line-clamp-5 text-[15px] leading-snug font-[350] xl:text-base"
          dangerouslySetInnerHTML={{ __html: text }}
        />
        <div className="mt-auto flex w-full gap-x-3 border-t border-t-[#333347] pt-5 text-start">
          <img
            className="h-9 w-9 rounded-full"
            src={logo.asset.url}
            alt={name}
            width={36}
            height={36}
            loading="lazy"
          />
          <div>
            <span className="block text-base leading-none text-gray-9 md:text-[15px]">
              {name}
            </span>
            <span className="mt-[6px] block text-sm leading-none text-gray-8 md:text-sm">
              {tag}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function Slider({ reviews }: { reviews: any[] }) {
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
  }

  return (
    <SlickSlider className="flex w-full" {...settings}>
      {reviews.map((review, index) => (
        <ReviewCard key={index} {...review} />
      ))}
    </SlickSlider>
  )
}
