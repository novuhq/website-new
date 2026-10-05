import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import type { LandingAction } from "./types"

interface LandingButtonLinkProps {
  action: LandingAction
  className?: string
  secondary?: boolean
}

export function LandingButtonLink({
  action,
  className,
  secondary = false,
}: LandingButtonLinkProps) {
  return (
    <Button
      className={cn("min-w-0 px-5", className)}
      variant={secondary ? "outline" : "default"}
      size="lg"
      asChild
    >
      <a
        href={action.href}
        target={action.newTab ? "_blank" : undefined}
        rel={action.newTab ? "noopener noreferrer" : undefined}
      >
        {action.label}
        {action.hiddenLabel ? (
          <span className="sr-only"> {action.hiddenLabel}</span>
        ) : null}
      </a>
    </Button>
  )
}

interface LandingTextLinkProps {
  action: LandingAction
  className?: string
  prefix?: string
}

export function LandingTextLink({
  action,
  className,
  prefix,
}: LandingTextLinkProps) {
  return (
    <a
      className={cn(
        "group inline-flex w-fit items-center gap-1.5 rounded text-[15px] leading-snug font-book text-primary transition-colors duration-200 hover:text-primary-muted focus-visible:outline-2 focus-visible:outline-offset-4",
        className
      )}
      href={action.href}
      target={action.newTab ? "_blank" : undefined}
      rel={action.newTab ? "noopener noreferrer" : undefined}
    >
      {prefix ? <span className="sr-only">{prefix} - </span> : null}
      {action.label}
      <ChevronRight
        className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
        aria-hidden
      />
    </a>
  )
}
