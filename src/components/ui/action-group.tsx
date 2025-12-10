import NextLink from "next/link"
import { ChevronRight } from "lucide-react"
import { div } from "motion/react-m"

import { type TSectionAction } from "@/types/common"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import SubscriptionForm from "@/components/pages/blog/subscription-form"

interface IActionGroupProps {
  className?: string
  actions: TSectionAction[]
}

interface IActionProps {
  action: TSectionAction
  isSingleAction?: boolean
  className?: string
}

function Action({ action, isSingleAction = false, className }: IActionProps) {
  switch (action.kind) {
    case "primary-button":
    case "secondary-button":
      return (
        <Button
          className={cn(className)}
          variant={action.kind === "secondary-button" ? "outline" : "default"}
          size="lg"
          asChild
        >
          <NextLink href={action.href}>{action.label}</NextLink>
        </Button>
      )
    case "link":
      return (
        <Link
          className={cn(
            "w-fit gap-x-1 leading-none lg:leading-none",
            className
          )}
          href={action.href}
          size={isSingleAction ? "lg" : "default"}
          variant="foreground"
          animation="arrow-right"
        >
          {action.label}
          <ChevronRight size={isSingleAction ? 18 : 16} />
        </Link>
      )
    case "subscription-form":
      return (
        <div className="relative mt-9.5 max-w-98 p-px">
          <SubscriptionForm className="relative z-20" variant="cta" />
          <span
            className="pointer-events-none absolute top-0 right-20 z-30 h-0.5 w-22 bg-[linear-gradient(91.15deg,rgba(255,204,255,0)_2.67%,rgba(255,230,255,0.76156)_21.19%,#FFE5FF_60.95%,rgba(255,204,255,0)_93.27%)] opacity-40 mix-blend-plus-lighter blur-[2px]"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-0 z-10 rounded-[0.375rem] bg-[linear-gradient(0deg,rgba(255,255,255,0.5),rgba(255,255,255,0.5)),radial-gradient(30.74%_144.53%_at_59.44%_100%,#FFFFFF_2.5%,#A7BBFF_21.5%,rgba(198,186,247,0.8)_100%)]"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-0 z-0 rounded-[0.375rem] bg-[radial-gradient(30.74%_144.53%_at_59.44%_100%,#FFFFFF_2.5%,#CCD7FF_21.5%,#C2B3FF_100%)] blur-[2px]"
            aria-hidden
          />
        </div>
      )
  }
}

function ActionGroup({ actions, className }: IActionGroupProps) {
  const renderedActions: TSectionAction[] = actions.slice(0, 2)

  if (!renderedActions || renderedActions.length === 0) {
    return null
  }

  if (renderedActions.length === 1) {
    return (
      <Action
        className={className}
        action={renderedActions[0]}
        isSingleAction
      />
    )
  }

  const isSecondButton = ["primary-button", "secondary-button"].includes(
    renderedActions[1].kind
  )

  return (
    <div
      className={cn(
        "flex items-center gap-x-3 gap-y-4 md:gap-x-7",
        isSecondButton && "max-2xs:flex-col",
        className
      )}
    >
      <Action
        className={cn(isSecondButton && "max-2xs:w-full md:min-w-39.5")}
        action={renderedActions[0]}
      />
      <Action
        className={cn(isSecondButton && "max-2xs:w-full md:min-w-39.5")}
        action={renderedActions[1]}
      />
    </div>
  )
}

export default ActionGroup
