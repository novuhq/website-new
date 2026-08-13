import { ReactNode } from "react"
import Image from "next/image"
import NextLink from "next/link"
import bannerBg from "@/images/content/novu-callout/banner-bg.png"
import githubIcon from "@/svgs/content/novu-callout/github.svg"
import starIcon from "@/svgs/content/novu-callout/star.svg"

import { cn } from "@/lib/utils"
import config from "@/configs/website-config"

const GITHUB_URL = "https://github.com/novuhq/novu"

interface INovuCalloutProps {
  children: ReactNode
  className?: string
}

function NovuCallout({ children, className }: INovuCalloutProps) {
  return (
    <figure
      className={cn(
        "not-prose my-6 flex flex-col overflow-hidden rounded-2xl bg-[#191A1F]",
        className
      )}
    >
      <div className="relative flex h-16 shrink-0 items-center justify-between overflow-hidden bg-black px-6">
        <Image
          className="absolute inset-0 size-full object-cover"
          src={bannerBg}
          alt=""
          quality={100}
          aria-hidden
        />
        <Image
          className="relative z-10 h-8 w-auto"
          src={config.logo}
          alt="Novu logo"
          width={102}
          height={32}
        />
        <NextLink
          className="relative z-10 -mr-3.5 flex h-11 items-center rounded-lg border border-white/60 bg-[radial-gradient(120%_180%_at_47%_0%,rgba(238,227,243,0.55)_0%,rgba(238,227,243,0.2)_100%)] pr-3 pl-[5px] shadow-[0px_8px_9px_rgba(0,0,0,0.7)] backdrop-blur-lg transition-opacity duration-300 hover:opacity-85"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="size-[34px] shrink-0 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            src={githubIcon}
            alt=""
            width={31}
            height={30}
            aria-hidden
          />
          <span
            className="mx-2 h-[42px] w-px bg-white/40 mix-blend-overlay"
            aria-hidden
          />
          <span className="text-[17px] leading-none font-medium tracking-tight text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]">
            40k stars
          </span>
          <Image
            className="ml-2.5 size-[23px] shrink-0 pointer-events-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
            src={starIcon}
            alt=""
            width={21}
            height={20}
            aria-hidden
          />
          <span className="sr-only">Novu on GitHub</span>
        </NextLink>
      </div>
      <div
        className={cn(
          "prose-inside-content prose max-w-none px-6 pt-5 pb-6",
          "[&_.prose>p:first-child]:!text-xl [&_.prose>p:first-child]:!leading-[1.375] [&_.prose>p:first-child]:tracking-tight [&_.prose>p:first-child]:text-foreground",
          "[&_.prose>p+p]:!mt-6"
        )}
      >
        {children}
      </div>
    </figure>
  )
}

export default NovuCallout
