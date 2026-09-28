import type { ReactNode } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link, type LinkProps } from "@/components/ui/link"

type GetStartedTheme = "pink" | "blue"

export interface GetStartedCard {
  title: ReactNode
  description: ReactNode
  buttonText: ReactNode
  buttonHref: LinkProps["href"]
  clickLocation: string
  clickText: string
}

export interface GetStartedProps {
  className?: string
  title?: ReactNode
  leftCard?: GetStartedCard
  rightCard?: GetStartedCard
  theme?: GetStartedTheme
}

const DEFAULT_LEFT_CARD = {
  title: "Read the Docs",
  description: "Feature descriptions, how-to guides, and more",
  buttonText: "Read Docs",
  buttonHref: "https://docs.novu.co/?utm_campaign=website",
  clickLocation: "get_started",
  clickText: "read_docs",
} satisfies GetStartedCard

const DEFAULT_RIGHT_CARD = {
  title: "Discovery Session",
  description: "Schedule a session with our experts",
  buttonText: "Discovery Session",
  buttonHref: "https://novu.co/contact-us/?utm_campaign=website-cta-bottom",
  clickLocation: "get_started",
  clickText: "book_a_call",
} satisfies GetStartedCard

const themeClassNames: Record<GetStartedTheme, string> = {
  pink: "bg-[linear-gradient(180deg,rgba(0,0,0,0)_54.67%,rgba(0,0,0,0.3)_100%),linear-gradient(257.22deg,#ffbb33_21.09%,#e300bd_55.18%,#ff006a_92.64%)]",
  blue: "bg-[linear-gradient(180deg,rgba(0,0,0,0)_54.67%,rgba(0,0,0,0.3)_100%),linear-gradient(257.22deg,#64e3ff_21.09%,#9092ff_92.64%)]",
}

const cardClassName =
  "flex flex-col items-center rounded-2xl p-5 md:p-8 md:pb-10 xl:rounded-[20px]"

function GetStarted({
  className,
  title = "Want to learn more?",
  leftCard = DEFAULT_LEFT_CARD,
  rightCard = DEFAULT_RIGHT_CARD,
  theme = "pink",
}: GetStartedProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-black py-11 md:py-16 lg:py-28 xl:py-40",
        className
      )}
      aria-labelledby="get-started-heading"
    >
      <div className="relative z-10 mx-auto w-full px-4 md:px-7 lg:px-10 2xl:px-0">
        <h2
          id="get-started-heading"
          className="text-center text-[28px] leading-tight font-normal text-white lg:text-4xl"
        >
          {title}
        </h2>

        <div className="mx-auto mt-8 grid max-w-242 grid-cols-1 gap-y-7 md:mt-12 md:grid-cols-2 md:gap-5 lg:mt-16 lg:gap-7 xl:gap-10">
          <article
            className={cn(
              cardClassName,
              "order-2 bg-linear-to-b from-gray-2 to-gray-2/70 md:order-none"
            )}
          >
            <h3 className="text-center text-2xl leading-snug font-medium text-white md:text-[28px]">
              {leftCard.title}
            </h3>
            <p className="mt-3 mb-5 text-center text-base leading-snug font-book text-gray-9 md:mb-7">
              {leftCard.description}
            </p>
            <Button
              className="mt-auto !h-10 !px-6 !text-xs uppercase md:!h-12 md:!text-sm"
              variant="outline"
              size="none"
              asChild
            >
              <Link
                href={leftCard.buttonHref}
                variant="clean"
                size="none"
                data-click-location={leftCard.clickLocation}
                data-click-text={leftCard.clickText}
              >
                {leftCard.buttonText}
              </Link>
            </Button>
          </article>

          <article
            className={cn(
              cardClassName,
              "order-1 md:order-none",
              themeClassNames[theme]
            )}
          >
            <h3 className="text-center text-2xl leading-snug font-medium text-black md:text-[28px]">
              {rightCard.title}
            </h3>
            <p className="mt-3 mb-5 text-center text-base leading-snug font-normal text-black md:mb-7">
              {rightCard.description}
            </p>
            <Button
              className="mt-auto !h-10 rounded-md bg-black !px-6 !text-xs text-white uppercase transition-colors duration-200 hover:bg-black/80 md:!h-12 md:!text-sm"
              variant="none"
              size="none"
              asChild
            >
              <Link
                href={rightCard.buttonHref}
                variant="clean"
                size="none"
                data-click-location={rightCard.clickLocation}
                data-click-text={rightCard.clickText}
              >
                {rightCard.buttonText}
              </Link>
            </Button>
          </article>
        </div>
      </div>

      <Image
        className="pointer-events-none absolute top-1/2 left-1/2 h-auto max-w-none min-w-[1920px] -translate-x-1/2 -translate-y-1/2 select-none"
        src="/images/shared/get-started/background.svg"
        width={1920}
        height={649}
        sizes="1920px"
        alt=""
        aria-hidden
      />
    </section>
  )
}

export default GetStarted
