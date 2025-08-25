import Image from "next/image"
import heroBgMob from "@/svgs/pages/customers/hero/background-mob.svg"
import heroBgTablet from "@/svgs/pages/customers/hero/background-tablet.svg"
import heroBg from "@/svgs/pages/customers/hero/background.svg"

import { TCustomerCard } from "@/types/customers"
import { cn } from "@/lib/utils"

import HeroCard from "./hero-card"

const BACKGROUND_BREAKPOINTS = [
  {
    width: 1472,
    height: 812,
    src: heroBg,
    className:
      "w-[1472px] lg:-top-[151px] lg:-left-[208px] lg:flex lg:h-[797px] xl:-top-[170px] xl:-left-[252px] xl:h-[812px]",
  },
  {
    width: 1021,
    height: 1030,
    src: heroBgTablet,
    className:
      "-top-[125px] -left-[172px] hidden h-[1030px] w-[1021px] md:flex lg:hidden",
  },
  {
    width: 517,
    height: 1377,
    src: heroBgMob,
    className: "-top-30 -left-25 h-[1377px] w-[517px] md:hidden",
  },
]

function Hero({ customers }: { customers: { customer: TCustomerCard }[] }) {
  return (
    <section className="hero relative [overflow-x:clip] pt-12.5 md:pt-16 lg:pt-18.5 xl:pt-22.5 2xl:overflow-x-visible">
      <div className="relative mx-auto flex w-full flex-col items-center px-5 md:max-w-[704px] md:px-0 lg:max-w-[960px] xl:max-w-[969px] xl:px-0">
        <div className="flex flex-col items-center gap-y-4 xl:px-[130px]">
          <h1 className="gap-y-4 text-center text-[32px] leading-[1.125] font-medium tracking-tighter text-balance text-foreground md:text-[44px] lg:text-5xl xl:text-[52px]">
            The notification infrastructure behind the fastest teams
          </h1>
          <p className="text-center text-base leading-normal font-[350] tracking-tighter text-pretty text-muted-foreground md:text-lg lg:max-w-[640px]">
            Discover how engineering teams use Novu to ship faster and simplify
            their communication workflows.
          </p>
        </div>

        <div className="relative mt-10 flex w-full flex-row flex-wrap gap-4 md:mt-12 md:gap-7 lg:mt-14 lg:gap-8 xl:mt-16">
          {BACKGROUND_BREAKPOINTS.map(
            ({ width, height, src, className }, index) => (
              <Image
                key={index}
                className={cn(
                  "pointer-events-none absolute max-w-none select-none",
                  className
                )}
                src={src}
                alt=""
                width={width}
                height={height}
                priority
                quality={90}
                aria-hidden
              />
            )
          )}
          {customers.map(({ customer }, index) => (
            <HeroCard key={customer._id} {...customer} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
