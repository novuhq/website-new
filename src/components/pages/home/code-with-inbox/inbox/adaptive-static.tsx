"use client"

import Image, { type StaticImageData } from "next/image"
import linearDarkImg from "@/images/pages/home/inbox/linear-dark.png"
import linearLightImg from "@/images/pages/home/inbox/linear-light.png"
import notionDarkImg from "@/images/pages/home/inbox/notion-dark.png"
import notionLightImg from "@/images/pages/home/inbox/notion-light.png"
import novuDarkImg from "@/images/pages/home/inbox/novu-dark.png"
import novuLightImg from "@/images/pages/home/inbox/novu-light.png"
import * as m from "motion/react-m"

import { cn } from "@/lib/utils"

import type { InboxTheme } from "./types"

const THEME_IMAGES: Record<InboxTheme, StaticImageData> = {
  novuDark: novuDarkImg,
  novuLight: novuLightImg,
  notionDark: notionDarkImg,
  notionLight: notionLightImg,
  linearDark: linearDarkImg,
  linearLight: linearLightImg,
}

interface IAdaptiveStaticProps {
  theme: InboxTheme
  className?: string
}

function AdaptiveStatic({ theme, className }: IAdaptiveStaticProps) {
  const image = THEME_IMAGES[theme]

  return (
    <m.div
      className={cn(className, "absolute top-0 left-0 h-full w-full shrink-0")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.3 } }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        className="relative z-10 w-full"
        src={image}
        alt=""
        width={512}
        height={521}
      />
      <div
        className="pointer-events-none absolute top-[-23.3687%] left-[13.3757%] z-0 h-[68.2852%] w-[39.8089%] rotate-90 bg-[radial-gradient(50%_50%_at_50%_50%,#314479_0%,rgba(49,68,121,0)_100%)] blur-[22px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-[-23.3687%] left-[4.5523%] z-0 h-[91.9575%] w-[76.1146%] -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,#1C2D5E_0%,rgba(18,28,59,0)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-[-44.006%] left-[-17.5159%] z-0 h-[154.7799%] w-[131.8471%] -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,#121C3B_16.51%,rgba(18,28,59,0)_100%)]"
        aria-hidden
      />
    </m.div>
  )
}

export default AdaptiveStatic
