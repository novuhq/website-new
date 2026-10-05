import Image from "next/image"

import { cn } from "@/lib/utils"

import { LandingButtonLink } from "./action-link"
import type { DualCtaData } from "./types"

interface DualCtaProps extends DualCtaData {
  backgroundSrc: string
  className?: string
  descriptionClassName?: string
  titleClassName?: string
}

export function DualCta({
  backgroundSrc,
  className,
  description,
  descriptionClassName,
  primary,
  secondary,
  title,
  titleClassName,
}: DualCtaProps) {
  return (
    <section
      className={
        className ?? "relative mt-31 overflow-visible lg:mt-51 xl:mt-60"
      }
    >
      <div className="relative mx-auto w-full max-w-200 px-5 md:px-8">
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2
            className={cn(
              "max-w-4xl text-[32px] leading-dense font-medium tracking-tighter text-balance text-white lg:text-4xl xl:text-[44px]",
              titleClassName
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "mt-3 max-w-116 text-base leading-normal font-book tracking-tighter text-pretty whitespace-pre-line text-gray-8 lg:text-lg",
              descriptionClassName
            )}
          >
            {description}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-5 lg:mt-8 lg:gap-7">
            <LandingButtonLink action={primary} />
            <LandingButtonLink action={secondary} secondary />
          </div>
        </div>
        <Image
          className="pointer-events-none absolute bottom-[-607px] left-1/2 z-0 h-auto w-[1722px] max-w-none -translate-x-1/2 select-none lg:left-[-561px] lg:translate-x-0"
          src={backgroundSrc}
          alt=""
          width={1722}
          height={1193}
          aria-hidden
          unoptimized
        />
      </div>
    </section>
  )
}
