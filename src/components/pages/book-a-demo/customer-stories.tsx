"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { ROUTE } from "@/constants/routes"
import type { Settings } from "react-slick"

import type { ICustomerCardData } from "@/types/customers"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"

import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"

const SlickSlider = dynamic(() => import("react-slick"), { ssr: false })
const DOTS_BREAKPOINT = 768

function SliderArrowIcon({ className }: { className?: string }) {
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

function LinkArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={6}
      height={16}
      viewBox="0 0 6 16"
      fill="none"
      aria-hidden
      className="h-4 w-1.5"
    >
      <path
        d="M1 5.5L3.5 8L1 10.5"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="square"
      />
    </svg>
  )
}

function SliderArrow({
  direction,
  onClick,
}: {
  direction: "previous" | "next"
  onClick?: () => void
}) {
  return (
    <button
      className={cn(
        "group absolute z-20 flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#333347]/60 to-[#2B2B3B]/40 p-px transition-all duration-300 hover:from-[#272730] hover:via-[#5C638A]/50 hover:to-[#5C638A] md:top-[calc(50%+3.25rem)] md:-translate-y-1/2 xl:top-[calc(50%+4.5rem)]",
        direction === "previous"
          ? "-bottom-12 left-[calc(50%-2.5rem)] md:bottom-auto md:left-0"
          : "right-[calc(50%-2.5rem)] -bottom-12 md:right-0 md:bottom-auto"
      )}
      type="button"
      aria-label={
        direction === "previous"
          ? "Previous customer story"
          : "Next customer story"
      }
      onClick={onClick}
    >
      <span className="flex size-full items-center justify-center rounded-full bg-[#111018] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#111018] group-hover:via-[#302D43] group-hover:to-[#464C6D]">
        <SliderArrowIcon
          className={direction === "next" ? "rotate-180" : undefined}
        />
      </span>
    </button>
  )
}

function CustomerStorySlide({
  name,
  slug,
  logo,
  quoteText,
  quoteAuthorPhoto,
  quoteAuthorName,
  quoteAuthorPosition,
}: ICustomerCardData) {
  const logoHeight = 32
  const logoWidth = Math.round(
    ((logo.width || 120) / (logo.height || logoHeight)) * logoHeight
  )

  return (
    <article className="mx-auto mt-38 flex w-full max-w-240 flex-col items-center text-center">
      <Image
        className="object-contain"
        src={logo.url}
        alt={logo.alt || `${name} logo`}
        width={logoWidth}
        height={logoHeight}
        loading="lazy"
        sizes={`${logoWidth}px`}
      />

      <blockquote className="mt-9 flex w-full flex-col items-center">
        <p className="w-full max-w-207 bg-[linear-gradient(146deg,rgba(255,255,255,0.85)_9.63%,rgba(255,255,255,0.60)_113.79%)] bg-clip-text text-xl leading-normal font-book tracking-normal text-balance text-transparent md:max-w-[72%] md:text-[1.75rem] lg:max-w-[78%] xl:max-w-none">
          {quoteText}
        </p>

        <footer className="mt-4 flex min-h-8 items-center justify-center gap-3">
          {quoteAuthorPhoto?.url && (
            <Image
              className="size-8 rounded-full object-cover"
              src={quoteAuthorPhoto.url}
              alt={quoteAuthorPhoto.alt || quoteAuthorName}
              width={quoteAuthorPhoto.width || 32}
              height={quoteAuthorPhoto.height || 32}
              loading="lazy"
              sizes="32px"
            />
          )}
          <cite className="text-sm leading-snug font-normal tracking-normal text-foreground not-italic">
            {quoteAuthorName}
            {quoteAuthorPosition && (
              <span className="font-light text-gray-8">
                {" - "}
                {quoteAuthorPosition}
              </span>
            )}
          </cite>
        </footer>
      </blockquote>

      <Link
        className="mt-9 text-base leading-snug font-book tracking-normal text-lagune-3 hover:text-lagune-2"
        href={`${ROUTE.customers}/${slug.current}`}
        data-click-location="book_a_demo_customer_stories"
        data-click-text="read_story"
      >
        Read Story
        <LinkArrowIcon />
      </Link>
    </article>
  )
}

function BookADemoCustomerStories({
  customers,
}: {
  customers: ICustomerCardData[]
}) {
  const [isDotsMode, setIsDotsMode] = useState(false)

  useEffect(() => {
    const updateIsDotsMode = () =>
      setIsDotsMode(window.innerWidth <= DOTS_BREAKPOINT)

    updateIsDotsMode()
    window.addEventListener("resize", updateIsDotsMode)
    return () => window.removeEventListener("resize", updateIsDotsMode)
  }, [])

  if (customers.length === 0) {
    return null
  }

  const hasMultipleSlides = customers.length > 1

  const settings: Settings = {
    dots: hasMultipleSlides && isDotsMode,
    infinite: hasMultipleSlides,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: hasMultipleSlides && !isDotsMode,
    nextArrow: <SliderArrow direction="next" />,
    prevArrow: <SliderArrow direction="previous" />,
    swipe: hasMultipleSlides,
    swipeToSlide: hasMultipleSlides,
    touchMove: hasMultipleSlides,
    draggable: hasMultipleSlides,
    accessibility: true,
    pauseOnHover: false,
    pauseOnFocus: false,
  }

  return (
    <section className="relative overflow-hidden bg-background py-0 md:min-h-64.5">
      <div className="relative mx-auto flex w-full max-w-256 items-center px-5 pb-16 md:min-h-64.5 md:px-8 md:pb-0 xl:px-0">
        <SlickSlider
          key={isDotsMode ? "dots" : "arrows"}
          className={cn(
            "book-demo-customer-stories-slider [&_.slick-slide]:outline-hidden",
            isDotsMode
              ? "relative left-1/2 w-screen -translate-x-1/2 [&_.slick-slide>div]:px-5 md:[&_.slick-slide>div]:px-8"
              : "book-demo-customer-stories-slider--masked w-full [&_.slick-slide>div]:px-0"
          )}
          {...settings}
        >
          {customers.map((customer) => (
            <div key={customer._id} className="outline-hidden">
              <CustomerStorySlide {...customer} />
            </div>
          ))}
        </SlickSlider>
      </div>
    </section>
  )
}

export default BookADemoCustomerStories
