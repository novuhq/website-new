import { Children, cloneElement, isValidElement, ReactNode } from "react"

import { cn } from "@/lib/utils"

interface StepProps {
  title: string
  children: ReactNode
  number?: number
}

function Step({ title, number, children, ...props }: StepProps) {
  return (
    <li className="flex flex-col pl-0" {...props}>
      <div className="flex items-center gap-x-5">
        <span className="not-prose flex size-9 shrink-0 items-center justify-center rounded-lg border border-gray-3 bg-gray-1 text-sm leading-snug font-medium tracking-tight text-foreground">
          {number}
        </span>
        <h3 className="not-prose text-lg leading-tight font-medium tracking-tight text-foreground">
          {title}
        </h3>
      </div>
      <div className="steps-content prose-inside-content mt-4 pl-14">
        {children}
      </div>
    </li>
  )
}

interface StepsProps {
  children: ReactNode
}

function Steps({ children, ...props }: StepsProps) {
  const cardChildren = Children.toArray(children).filter((child) =>
    isValidElement(child)
  )

  const cardsWithAutoNumber = cardChildren.map((child, index) => {
    return cloneElement(child as React.ReactElement<StepProps>, {
      number: index + 1,
    })
  })

  return (
    <ol
      className={cn("steps relative my-6 flex flex-col gap-y-8 pl-0 md:my-8")}
      {...props}
    >
      {cardsWithAutoNumber}
    </ol>
  )
}

export { Steps, Step }
