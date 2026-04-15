import Image from "next/image"
import NextLink from "next/link"
import { ChevronRight } from "lucide-react"
import { ROUTE } from "@/constants/routes"
import bgImage from "./images/banner-bg.jpg"

function LinkBanner() {
  return (
    <section className="link-banner relative overflow-hidden bg-[#0B0C0F] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:w-full after:bg-white after:mix-blend-overlay">
      <NextLink
        className="group relative z-20 mx-auto flex h-9 w-full max-w-384 items-center justify-center gap-1.5 px-5 text-center md:px-8"
        href={ROUTE.mcp}
        data-click-location="header-link-banner"
        data-click-text="read_more"
      >
        <span className="truncate text-xs font-medium text-foreground sm:text-sm">
          Novu MCP is live - connect your AI agents in minutes
        </span>
        <span className="hidden text-foreground/50 md:inline">|</span>
        <span className="hidden text-xs font-medium text-foreground/85 transition-colors group-hover:text-foreground md:inline sm:text-sm">
          Read more
        </span>
        <ChevronRight className="hidden size-4 text-foreground/80 transition-transform group-hover:translate-x-0.5 md:block" />
      </NextLink>
      <Image
        src={bgImage}
        alt=""
        className="pointer-events-none absolute inset-y-0 left-1/2 z-10 h-9 min-w-[1920px] -translate-x-1/2 object-bottom xs:-translate-x-[45%] sm-xs:-translate-x-[40%]"
        width={1920}
        height={36}
        aria-hidden
        priority
      />
    </section>
  )
}

export default LinkBanner
