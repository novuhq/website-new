"use client"

import { useState } from "react"
import Image, { type StaticImageData } from "next/image"
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "@/lib/utils"

interface ITab {
  title: string
  icon: StaticImageData
  highlightedHtml: string
}

interface ICodeTabsProps {
  tabs: ITab[]
}

function CodeTabs({ tabs }: ICodeTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="h-auto w-full rounded-xl bg-[linear-gradient(145.25deg,#5F6EAA_1.1%,#1A1E2E_56.43%)] p-px md:h-auto lg:h-[344px] xl:h-[335px]">
      <div className="relative z-10 h-full w-full overflow-hidden rounded-xl bg-[radial-gradient(88.88%_86.43%_at_0%_0.03%,#28356C_0%,rgba(35,45,89,0)_100%),radial-gradient(51.34%_49.92%_at_0%_0.03%,#2F3E7F_0%,rgba(35,45,89,0)_100%),linear-gradient(168.3deg,#1D233A_6.29%,#131725_91.42%)] px-4 pb-4 pt-0 [-webkit-mask-image:-webkit-radial-gradient(white,black)] md:px-[22px] md:pb-5">
        <div className="-ml-3 flex gap-5 lg:ml-0 lg:gap-4">
          {tabs.map((tab, index) => (
            <button
              className={cn(
                "relative flex items-center gap-1 p-2.5 text-[12px] leading-none text-[#C3CEF1] hover:opacity-80 md:text-[14px]",
                activeIndex === index &&
                  "pointer-events-none text-[#DEE5F7]"
              )}
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={tab.icon}
                alt=""
                className="size-[14px] md:size-4"
                width={16}
                height={16}
              />
              {tab.title}
              {activeIndex === index && (
                <m.div
                  layoutId="code-sliding-bar"
                  className="absolute inset-x-0 -bottom-px z-10 h-px bg-[#BDC6E0]"
                  transition={{ duration: 0.3, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="absolute inset-x-0 -z-10 h-[1px] bg-[linear-gradient(90deg,#3F4E8B_0%,rgba(57,69,119,0.8)_57.07%)]" />
        <LazyMotion features={domAnimation}>
          <AnimatePresence mode="wait">
            <m.div
              className="echo-code numbered-lines mt-4 h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={activeIndex}
            >
              <div
                className="scrollbar-hidden relative z-10 overflow-y-scroll text-[10px] font-normal md:text-xs xl:text-[13px]"
                dangerouslySetInnerHTML={{
                  __html: tabs[activeIndex].highlightedHtml,
                }}
              />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </div>
    </div>
  )
}

export default CodeTabs
