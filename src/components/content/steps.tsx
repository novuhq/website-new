import { Children, cloneElement, isValidElement, ReactNode } from "react"

import { cn } from "@/lib/utils"

type TStepsVariant = "default" | "v2"

interface StepProps {
  title: string
  children: ReactNode
  number?: number
  variant?: TStepsVariant
}

function Step({
  title,
  number,
  children,
  variant = "default",
  ...props
}: StepProps) {
  const isV2 = variant === "v2"

  return (
    <li className="flex flex-col pl-0" {...props}>
      <div
        className={cn("flex gap-x-5", isV2 ? "items-center" : "items-start")}
      >
        <span
          className={cn(
            "not-prose flex size-9 shrink-0 items-center justify-center rounded-lg border text-sm leading-snug font-medium tracking-tight text-foreground",
            isV2
              ? "border-gray-3 bg-gray-1"
              : "relative top-0.5 border-gray-2 bg-background ring-4 ring-background"
          )}
        >
          {number}
        </span>
        <h3
          className={cn(
            "not-prose text-lg font-medium text-foreground",
            isV2
              ? "leading-tight tracking-tight"
              : "pt-2 leading-snug tracking-tighter"
          )}
        >
          {title}
        </h3>
      </div>
      <div
        className={cn(
          "steps-content pl-14",
          isV2 ? "prose-inside-content mt-4" : "mt-1 pb-5"
        )}
      >
        {children}
      </div>
    </li>
  )
}

interface StepsProps {
  children: ReactNode
  variant?: TStepsVariant
}

function Steps({ children, variant = "default", ...props }: StepsProps) {
  const isV2 = variant === "v2"
  const cardChildren = Children.toArray(children).filter((child) =>
    isValidElement(child)
  )

  const cardsWithAutoNumber = cardChildren.map((child, index) => {
    return cloneElement(child as React.ReactElement<StepProps>, {
      number: index + 1,
      variant,
    })
  })

  return (
    <ol
      className={cn(
        "steps relative my-6 flex flex-col pl-0 md:my-8",
        isV2
          ? "gap-y-8"
          : [
              "gap-3 gap-y-7",
              "before:absolute before:inset-y-0 before:left-[1.125rem] before:w-px before:-translate-x-px before:bg-gray-2",
            ]
      )}
      {...props}
    >
      {cardsWithAutoNumber}
    </ol>
  )
}

export { Steps, Step }
