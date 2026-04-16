import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { LinkInlineArrow } from "@/components/ui/link-inline-arrow"

import bgImage from "./images/banner-bg.jpg"

function LinkBanner() {
  return (
    <section className="link-banner relative overflow-hidden bg-[#0B0C0F] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:w-full after:bg-white after:mix-blend-overlay">
      <NextLink
        className="group relative z-20 mx-auto flex h-9 w-full max-w-384 items-center justify-center gap-1.5 px-5 text-center transition-colors duration-200 md:px-8"
        href={ROUTE.mcp}
        data-click-location="header-link-banner"
        data-click-text="read_more"
      >
        <span className="truncate text-xs font-medium text-foreground transition-colors group-hover:text-lagune-3 sm:text-sm">
          Novu MCP is live - connect your AI agents in minutes
        </span>
        <span className="hidden text-foreground/50 transition-colors group-hover:text-lagune-3/80 md:inline">
          |
        </span>
        <span className="hidden items-center gap-1 text-xs font-medium text-foreground/85 transition-colors group-hover:text-lagune-3 sm:text-sm md:inline-flex">
          Read more
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
