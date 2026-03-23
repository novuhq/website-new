import Image from "next/image"
import NextLink from "next/link"
import CheckboxIcon from "@/svgs/icons/checkbox-yellow.svg"
import backgroundImage from "@/svgs/pages/comparison/intro/background.svg"

import type { IComparisonIntro } from "@/types/comparison"
import { Button } from "@/components/ui/button"

function Intro({ intro }: { intro: IComparisonIntro }) {
  return (
    <section className="relative pt-16 md:pt-24 lg:pt-36 xl:pt-50">
      <div className="relative mx-auto max-w-5xl px-5 md:px-8">
        <div className="relative z-10 flex flex-col gap-8 lg:gap-12">
          <div className="flex flex-col gap-5">
            <h2 className="text-[28px] leading-[1.25] font-medium tracking-tighter text-white md:text-[32px] lg:text-[36px]">
              {intro.title}
            </h2>
            <p className="max-w-185 text-lg/normal font-book tracking-plus-tight text-pretty text-gray-8 lg:text-xl/normal">
              {intro.description}
            </p>
          </div>

          <div className="flex flex-col gap-7">
            <p className="text-lg/dense font-[350] tracking-tighter text-gray-10 [&_span]:font-medium [&_span]:text-white">
              {intro.switchLabel}
            </p>
            <ul className="flex flex-col gap-3 md:flex-row md:gap-11">
              {intro.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 md:items-start">
                  <Image
                    src={CheckboxIcon}
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden
                    unoptimized
                  />
                  <span className="text-base/snug tracking-tighter text-white">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button size="lg" variant="outline" className="w-full max-sm:h-10 max-sm:px-5 max-sm:text-xs sm:w-fit" asChild>
            <NextLink href={intro.cta.href}>{intro.cta.label}</NextLink>
          </Button>
        </div>
        <Image
          className="pointer-events-none absolute -top-95 -right-40 hidden select-none lg:block"
          src={backgroundImage}
          alt=""
          width={739}
          height={998}
          aria-hidden
          unoptimized
        />
      </div>
    </section>
  )
}

export default Intro
