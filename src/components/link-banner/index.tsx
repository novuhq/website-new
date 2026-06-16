import type { AnchorHTMLAttributes, ReactNode } from "react"
import type { Route } from "next"
import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { LinkInlineArrow } from "@/components/ui/link-inline-arrow"

import bgImage from "./images/banner-bg.jpg"

interface LinkBannerProps {
  actionLabel?: ReactNode
  clickLocation?: string
  clickText?: string
  href?: Route<string> | URL
  message?: ReactNode
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"]
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"]
}

function LinkBanner({
  actionLabel = "Try it free",
  clickLocation = "header-link-banner",
  clickText = "read_more",
  href = ROUTE.connect,
  message = (
    <>
      New: Novu Connect is live. Give your AI agent access to every channel in a
      single conversation.
    </>
  ),
  rel,
  target,
}: LinkBannerProps) {
  return (
    <section className="link-banner relative overflow-hidden bg-[#0B0C0F] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:w-full after:bg-white after:mix-blend-overlay">
      <NextLink
        className="group relative z-20 mx-auto flex h-9 w-full max-w-384 items-center justify-center gap-1.5 px-5 text-center transition-colors duration-200 md:px-8"
        href={href}
        rel={rel}
        target={target}
        data-click-location={clickLocation}
        data-click-text={clickText}
      >
        <span className="truncate text-xs font-medium text-foreground transition-colors group-hover:text-lagune-3 sm:text-sm">
          {message}
        </span>
        <span className="hidden text-foreground/50 transition-colors group-hover:text-lagune-3/80 md:inline">
          |
        </span>
        <span className="hidden items-center gap-1 text-xs font-medium text-foreground/85 transition-colors group-hover:text-lagune-3 sm:text-sm md:inline-flex">
          {actionLabel}
          <LinkInlineArrow lineClassName="bg-lagune-3" />
        </span>
      </NextLink>
      <Image
        className="pointer-events-none absolute inset-y-0 left-1/2 z-10 h-9 min-w-[120rem] -translate-x-1/2 object-bottom xs:-translate-x-[45%]"
        src={bgImage}
        alt=""
        width={1920}
        height={36}
        aria-hidden
        priority
      />
    </section>
  )
}

export default LinkBanner
