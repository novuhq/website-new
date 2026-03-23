import Image from "next/image"
import NextLink from "next/link"

import type { IComparisonHero } from "@/types/comparison"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function Hero({ hero }: { hero: IComparisonHero }) {
  return (
    <section className="relative pt-10.5 pb-10 md:pt-12.5 md:pb-16 lg:pt-16.5 xl:pt-45">
      <div className="relative mx-auto flex max-w-400 flex-col items-center gap-20 px-5 md:px-8 lg:flex-row lg:gap-16 2xl:gap-32">
        <div className="relative z-10 flex flex-col 2xl:mt-2.5 2xl:ml-24">
          <h1 className="text-[1.75rem] leading-dense font-medium tracking-tighter text-pretty md:text-[2rem] lg:text-[2.75rem] xl:text-[3.25rem]">
            <span className="bg-[linear-gradient(238deg,#FFBA33_32%,#FF006A_71%,#FF4CE1_103%)] bg-clip-text font-bold text-transparent">
              {hero.heading.prefix}
            </span>{" "}
            {hero.heading.highlight}
          </h1>
          <p className="mt-4 text-base font-book tracking-tighter text-gray-8">
            {hero.subheading}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 md:gap-7 xl:mt-8">
            <Button size="lg" variant="default" asChild>
              <NextLink href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </NextLink>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <NextLink href={hero.secondaryCta.href}>
                {hero.secondaryCta.label}
              </NextLink>
            </Button>
          </div>
          <p className="mt-4 text-[0.9375rem] font-book tracking-tighter text-gray-8 [&_span]:font-normal [&_span]:text-foreground">
            {hero.note}
          </p>
        </div>

        <div
          className={cn(
            "relative z-0 shrink-0",
            hero.illustration.wrapperClassName
          )}
        >
          <Image
            className={cn(
              "pointer-events-none max-w-none select-none",
              hero.illustration.className
            )}
            src={hero.illustration.src}
            alt=""
            width={hero.illustration.width}
            height={hero.illustration.height}
            sizes={`(max-width: 768px) 100vw, ${hero.illustration.width * 2}px`}
            quality={100}
            priority
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
