"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react"

import { cn } from "@/lib/utils"
import inboxData from "./data"
import InboxContainer from "./inbox-container"
import AdaptiveStatic from "./adaptive-static"

import defaultThemeIcon from "@/svgs/pages/home/inbox/default-theme.svg"
import notionThemeIcon from "@/svgs/pages/home/inbox/notion-theme.svg"
import linearThemeIcon from "@/svgs/pages/home/inbox/linear-theme.svg"

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const SlickSlider = dynamic(() => import("react-slick"), { ssr: false })

function getThemeIcon(theme: string) {
  if (theme === "novuDark" || theme === "novuLight") return defaultThemeIcon
  if (theme === "notionDark" || theme === "notionLight")
    return notionThemeIcon
  return linearThemeIcon
}

function InboxComponent({ className }: { className?: string }) {
  const [activeTheme, setActiveTheme] = useState(0)
  const [isSliderInitialized, setIsSliderInitialized] = useState(false)

  const settings = {
    arrows: true,
    dots: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    centerMode: true,
    focusOnSelect: true,
    beforeChange: (_: number, next: number) => {
      setActiveTheme(next)
    },
    onInit: () => {
      setIsSliderInitialized(true)
    },
  }

  return (
    <div
      className={cn(
        "inbox-component relative order-last aspect-[380/387] h-auto w-full max-w-[398px] shrink-0 md:order-none md:aspect-auto md:h-[529px] md:w-[512px] md:max-w-none lg:h-[546px] lg:w-[531px] xl:h-[619px] xl:w-[608px]",
        className
      )}
    >
      <LazyMotion features={domAnimation}>
        {inboxData.map((data, index) => (
          <AnimatePresence mode="wait" key={data.theme}>
            {index === activeTheme && (
              <>
                <InboxContainer
                  theme={data.theme}
                  categories={data.categories}
                  messages={data.messages}
                />
                <AdaptiveStatic
                  className="block lg:hidden"
                  theme={data.theme}
                />
              </>
            )}
          </AnimatePresence>
        ))}
      </LazyMotion>
      <div className="absolute top-[calc(100%+30px)] flex items-center justify-center md:top-[calc(100%+22px)] lg:top-[calc(100%+26px)] xl:top-[calc(100%+30px)]">
        <SlickSlider
          className={cn(
            "mx-auto flex max-w-[398px] self-center transition-opacity duration-300 md:max-w-[512px] lg:max-w-[531px] xl:max-w-[608px]",
            !isSliderInitialized && "opacity-0"
          )}
          {...settings}
        >
          {inboxData.map((data, index) => (
            <div
              key={index}
              className="!flex items-center gap-x-1.5 text-[14px] uppercase text-gray-9 transition-colors duration-200 hover:text-gray-10"
            >
              <Image
                src={getThemeIcon(data.theme)}
                alt=""
                width={16}
                height={16}
              />
              {data.title}
            </div>
          ))}
        </SlickSlider>
      </div>
    </div>
  )
}

export default InboxComponent
