import NextLink from "next/link"
import { ChevronRight } from "lucide-react"

import { type TSectionAction } from "@/types/common"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

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
  }
}

function ActionGroup({ actions, className }: IActionGroupProps) {
  let renderedActions: TSectionAction[] = actions.slice(0, 2)

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
