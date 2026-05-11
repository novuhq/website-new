import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NotFoundContentProps {
  className?: string
}

export default function NotFoundContent({ className }: NotFoundContentProps) {
  return (
    <section
      className={cn(
        "not-found flex grow items-center justify-center px-5 py-20 md:px-8",
        className
      )}
    >
      <div className="flex max-w-md flex-col items-center justify-center md:max-w-lg">
        <h1 className="text-8xl leading-none font-semibold tracking-tighter text-foreground md:text-9xl md:leading-none">
          <span className="sr-only">Error</span>404
          <span className="sr-only">: Page Not Found</span>
        </h1>
        <p className="mt-2.5 text-center text-base leading-normal tracking-tight text-foreground md:text-lg md:leading-normal">
          We know this isn&apos;t where you intended to land, but we hope you
          have some fun while you&apos;re here.
        </p>
        <Button className="mt-6 xl:mt-8" variant="outline" asChild>
          <NextLink href={ROUTE.index}>Go back home</NextLink>
        </Button>
      </div>
    </section>
  )
}
