import Image from "next/image"
import heroBgMob from "@/svgs/pages/customers/hero/background-mob.svg"
import heroBgTablet from "@/svgs/pages/customers/hero/background-tablet.svg"
import heroBg from "@/svgs/pages/customers/hero/background.svg"

import { TCustomerCard } from "@/types/customers"

import HeroCard from "./hero-card"

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
          <Image
            src={heroBg}
            alt=""
            width={1472}
            height={812}
            priority
            className="pointer-events-none absolute hidden w-[1472px] max-w-none select-none lg:-top-[151px] lg:-left-[208px] lg:flex lg:h-[797px] xl:-top-[170px] xl:-left-[252px] xl:h-[812px]"
            quality={90}
          />
          <Image
            src={heroBgTablet}
            alt=""
            width={1021}
            height={1030}
            priority
            className="pointer-events-none absolute -top-[125px] -left-[172px] hidden h-[1030px] w-[1021px] max-w-none select-none md:flex lg:hidden"
            quality={90}
          />
          <Image
            src={heroBgMob}
            alt=""
            width={517}
            height={1377}
            priority
            className="pointer-events-none absolute -top-30 -left-25 h-[1377px] w-[517px] max-w-none select-none md:hidden"
            quality={90}
          />
          {customers.map(({ customer }, index) => (
            <HeroCard key={customer._id} {...customer} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
