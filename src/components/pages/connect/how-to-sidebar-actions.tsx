"use client"

import { useEffect, useState } from "react"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import { CircleArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"

function HowToSidebarActions({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className={cn("min-h-[7.6875rem]", className)}>
      <div
        className={cn(
          "flex flex-col gap-6 transition-opacity duration-200 ease-out",
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!visible}
      >
        <span className="h-px w-full bg-gray-3" role="none" />

        <button
          className="flex w-fit items-center gap-2 rounded text-sm leading-snug tracking-tight text-gray-8 transition-colors duration-300 hover:text-white focus-visible:ring-2 focus-visible:ring-lagune-3/40"
          onClick={handleBackToTop}
          type="button"
          tabIndex={visible ? 0 : -1}
        >
          <CircleArrowUp size={20} aria-hidden />
          Back to top
        </button>

        <NextLink
          href={ROUTE.dashboardV2SignUp}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className="flex h-13.5 w-full items-center justify-center rounded-md bg-white px-5 text-sm leading-none font-medium tracking-normal text-black uppercase transition-colors duration-300 hover:bg-secondary-foreground focus-visible:ring-2 focus-visible:ring-lagune-3/40"
          data-click-location="connect_how_to_post_sidebar"
          data-click-text="use_this_template"
        >
          Use this template
        </NextLink>
      </div>
    </div>
  )
}

export default HowToSidebarActions
