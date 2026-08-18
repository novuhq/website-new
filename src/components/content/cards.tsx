import { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface ICardProps {
  title: string
  children: ReactNode
  className?: string
}

function Card({ title, children, className }: ICardProps) {
  return (
    <article
      className={cn(
        "not-prose flex flex-col rounded-xl bg-white/8 px-5 py-4",
        className
      )}
    >
      <h4 className="not-prose text-lg leading-normal font-medium tracking-tight text-foreground">
        {title}
      </h4>
      <div className="prose-inside-content prose mt-2.5 max-w-none [&_p]:text-gray-9">
        {children}
      </div>
    </article>
  )
}

interface ICardsProps {
  children: ReactNode
  className?: string
}

function Cards({ children, className }: ICardsProps) {
  return (
    <div className={cn("not-prose my-6 flex flex-col gap-4", className)}>
      {children}
    </div>
  )
}

export { Cards, Card }
