import { IPricingHero } from "@/types/pricing"

import Card from "./card"

const PricingPlanCards = ({ title, plans, onContactUsClick }: IPricingHero) => {
  return (
    <section className="overflow-hidden pt-10.5 md:pt-12.5 lg:pt-14.5 xl:pt-16.5">
      <h1 className="relative z-10 mx-auto max-w-none text-center text-[32px] leading-dense font-medium tracking-tighter text-balance text-foreground md:max-w-176 md:text-[40px] lg:max-w-240 lg:text-[48px] xl:max-w-242 xl:text-[52px]">
        {title}
      </h1>
      <div className="relative mx-auto max-w-[460px] md:max-w-[760px] lg:max-w-[890px] xl:max-w-[1360px]">
        <ul className="relative z-10 mt-9.5 grid auto-rows-max grid-cols-1 items-stretch justify-between gap-4 px-5 md:mt-11.5 md:grid-cols-2 md:px-7 lg:mt-13.5 xl:mt-16 xl:grid-cols-4 xl:px-10">
          {plans.map((plan, index) => (
            <Card key={index} plan={plan} onContactUsClick={onContactUsClick} />
          ))}
        </ul>
        <div
          className="pointer-events-none absolute -top-11.5 right-55.5 z-0 h-69 w-98 bg-[radial-gradient(65.61%_130.08%_at_74.29%_61.64%,#B7C9FF_27.2%,#96B0FF_80.5%,#4775FF_100%)] opacity-[0.08] blur-3xl"
          aria-hidden
        />
      </div>
    </section>
  )
}

export default PricingPlanCards
