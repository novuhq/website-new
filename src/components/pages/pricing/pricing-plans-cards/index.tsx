import { IPricingHero } from "@/types/pricing"

import Card from "./card"

const PricingPlanCards = ({ title, plans, onContactUsClick }: IPricingHero) => {
  return (
    <section className="overflow-hidden pt-10.5 md:pt-12.5 lg:pt-14.5 xl:pt-16.5">
      <h1 className="relative z-10 mx-auto max-w-none text-center text-[32px] leading-1.125 font-medium tracking-tighter text-balance text-foreground md:max-w-176 md:text-[40px] lg:max-w-240 lg:text-[48px] xl:max-w-242 xl:text-[52px]">
        {title}
      </h1>
      <ul className="mx-auto mt-9.5 grid max-w-[460px] auto-rows-max grid-cols-1 items-stretch justify-between gap-4 px-5 md:mt-11.5 md:max-w-[760px] md:grid-cols-2 md:px-7 lg:mt-13.5 lg:max-w-[890px] xl:mt-16 xl:max-w-[1360px] xl:grid-cols-4 xl:px-10">
        {plans.map((plan, index) => (
          <Card key={index} plan={plan} onContactUsClick={onContactUsClick} />
        ))}
      </ul>
    </section>
  )
}

export default PricingPlanCards
