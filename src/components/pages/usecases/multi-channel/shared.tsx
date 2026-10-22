import { Fragment } from "react"
import NextLink from "next/link"
import type { IMultiChannelAction } from "@/data/pages/usecase-multi-channel"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/** Shared section frame: 768px up to lg, then the 1280px Figma content box. */
export const CONTAINER = "mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-336"

export const HEADING =
  "text-[32px] leading-[1.13] font-normal tracking-plus-tight text-white md:text-[40px] xl:text-5xl"

export const DESCRIPTION =
  "text-base leading-normal tracking-tight text-white/80 md:text-lg md:text-gray-70"

const CLICK_LOCATION_PREFIX = "usecase_multi_channel"

const BREAK_CLASS = {
  md: "max-md:hidden",
  xl: "max-xl:hidden",
} as const

/**
 * Figma breaks this copy by hand. Headings keep the breaks from md; body
 * copy only at xl, where its column has the Figma width.
 */
export function TitleLines({
  lines,
  breakFrom = "md",
}: {
  lines: string[]
  breakFrom?: keyof typeof BREAK_CLASS
}) {
  return lines.map((line, index) => (
    <Fragment key={line}>
      {index > 0 && (
        <>
          {" "}
          <br className={BREAK_CLASS[breakFrom]} />
        </>
      )}
      {line}
    </Fragment>
  ))
}

interface IActionButtonProps {
  action: IMultiChannelAction
  section: string
  variant: "primary" | "secondary"
  className?: string
}

export function ActionButton({
  action,
  section,
  variant,
  className,
}: IActionButtonProps) {
  const isExternal = !action.href.startsWith("/")
  const trackingProps = {
    "data-click-location": `${CLICK_LOCATION_PREFIX}_${section}`,
    "data-click-text": action.clickText,
  }

  return (
    <Button
      asChild
      className={cn(
        "h-11 w-full px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case sm:w-fit",
        variant === "secondary" && "border-gray-30 text-white",
        className
      )}
      size="none"
      variant={variant === "primary" ? "default" : "outline-transparent"}
    >
      {isExternal ? (
        <a href={action.href} rel="noopener noreferrer" {...trackingProps}>
          {action.label}
        </a>
      ) : (
        <NextLink href={action.href} {...trackingProps}>
          {action.label}
        </NextLink>
      )}
    </Button>
  )
}
