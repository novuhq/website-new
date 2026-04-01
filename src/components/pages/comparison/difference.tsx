import Image from "next/image"
import NextLink from "next/link"

import type { IComparisonDifference } from "@/types/comparison"
import { Button } from "@/components/ui/button"

function Difference({ difference }: { difference: IComparisonDifference }) {
  return (
    <section className="difference relative z-10 pt-16 md:pt-24 lg:pt-36 xl:pt-50">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-[28px] leading-[1.25] font-medium tracking-tighter text-white md:text-[32px] lg:text-[40px]">
            {difference.title}
          </h2>
          <p className="max-w-120 font-book tracking-tighter text-gray-8">
            {difference.subtitle}
          </p>
        </div>

        <ul className="mx-auto mt-14 grid max-w-96 gap-4 md:max-w-198 md:grid-cols-2 md:gap-6 lg:max-w-200 lg:gap-8 xl:max-w-none xl:grid-cols-3">
          {difference.cards.map((card) => (
            <li
              key={card.title}
              className="relative flex flex-col overflow-hidden rounded-[0.75rem]"
            >
              <Image
                src={card.image}
                alt=""
                width={384}
                height={384}
                aria-hidden
                quality={100}
              />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 xl:p-7">
                <div className="flex items-center gap-2.5">
                  <Image
                    src={card.icon}
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden
                    quality={100}
                  />
                  <h3 className="text-[0.9375rem]/dense font-medium tracking-tighter text-white lg:text-base/dense">
                    {card.title}
                  </h3>
                </div>
                <p className="mt-2.5 text-[0.9375rem] font-book tracking-tighter text-gray-8">
                  {card.description}
                </p>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white mix-blend-overlay" />
            </li>
          ))}
        </ul>

        <div className="mt-14 flex justify-center">
          <Button size="lg" variant="outline" className="max-sm:h-10 max-sm:px-5 max-sm:text-xs max-2xs:w-full" asChild>
            <NextLink href={difference.cta.href} data-click-location={difference.cta.clickLocation} data-click-text={difference.cta.clickText}>
              {difference.cta.label}
            </NextLink>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Difference
