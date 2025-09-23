"use client"

import { ArrowUpCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const HEADER_HEIGHT = 64

export default function ScrollToTop({
  buttonClassName,
  iconClassName,
  iconSize = 20,
}: {
  buttonClassName?: string
  iconClassName?: string
  iconSize?: number
}) {
  const scrollToTop = () => {
    window.scrollTo({
      top: HEADER_HEIGHT,
      behavior: "smooth",
    })
  }

  return (
    <Button
      variant="none"
      size="none"
      onClick={scrollToTop}
      className={cn(
        "group flex items-center leading-snug font-normal tracking-tight",
        buttonClassName
      )}
      textClassName="gap-x-2"
      aria-label="scroll to top"
    >
      <ArrowUpCircle
        size={iconSize}
        strokeWidth={1.5}
        className={cn(
          "text-gray-8 transition-colors duration-200 group-hover:text-white",
          iconClassName
        )}
      />
      <span className="text-sm text-gray-8 transition-colors duration-200 group-hover:text-white">
        Back to top
      </span>
    </Button>
  )
}
