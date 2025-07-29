import React from "react"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface HeroProps {
  className?: string
  title: string
  description: string
  pageNumber?: number
}

function Hero({ title, description, className, pageNumber }: HeroProps) {
  return (
    <section
      className={cn(
        "hero pt-12.5 pb-10 md:pt-16 lg:pt-18.5 lg:pb-11 xl:pt-22.5",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 text-center md:px-8">
        <h1 className="max-w-lg text-4xl font-medium tracking-tight text-balance text-foreground md:text-[40px] md:leading-tight lg:text-5xl lg:leading-[1.125] xl:text-[56px]">
          {title}
          {pageNumber && <span className="sr-only">Page {pageNumber}</span>}
        </h1>
        <p className="mt-3 max-w-lg text-base leading-normal tracking-tighter text-pretty text-muted-foreground md:mt-2 lg:mt-4 lg:text-lg">
          {description}
        </p>
        <Button className="mt-5 min-w-40 lg:mt-5.5" variant="outline" asChild>
          <NextLink
            href={ROUTE.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow us on X
          </NextLink>
        </Button>
      </div>
    </section>
  )
}

export default Hero
