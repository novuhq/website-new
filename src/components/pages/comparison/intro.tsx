import Image from "next/image"
import NextLink from "next/link"
import CheckboxIcon from "@/svgs/icons/checkbox-yellow.svg"
import backgroundImage from "@/svgs/pages/comparison/intro/background.svg"

import type { IComparisonIntro } from "@/types/comparison"
import { Button } from "@/components/ui/button"

function Intro({ intro }: { intro: IComparisonIntro }) {
  return (
    <section className="relative pt-16 md:pt-24 lg:pt-36 xl:pt-56 xl:pb-6">
      <div className="relative mx-auto max-w-5xl px-5 md:px-8">
        <div className="relative z-10 flex flex-col gap-10 lg:gap-16">
          <div className="flex flex-col gap-5 lg:gap-6">
            <h2 className="text-[28px] leading-[1.25] font-medium tracking-tighter text-white md:text-[32px] lg:text-[40px]">
              {intro.title}
            </h2>
            <p className="max-w-206 text-lg/normal font-normal tracking-tighter text-pretty text-gray-8 lg:text-2xl/snug">
              {intro.description}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
            <h3 className="text-2xl/tight font-medium tracking-tighter text-white md:text-[32px]">
              {intro.switchLabel}
            </h3>
            <Button
              size="lg"
              variant="outline"
              className="order-last w-full max-sm:h-10 max-sm:px-5 max-sm:text-xs sm:order-none sm:h-11 sm:w-fit"
              asChild
            >
              <NextLink
                href={intro.cta.href}
                data-click-location={intro.cta.clickLocation}
                data-click-text={intro.cta.clickText}
              >
                {intro.cta.label}
              </NextLink>
            </Button>
            <ul className="flex flex-col gap-4 border-t border-gray-4 pt-7 sm:col-span-2 md:flex-row md:gap-11">
              {intro.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 md:flex-1 md:flex-col md:items-start"
                >
                  <Image
                    className="size-6 shrink-0 md:size-7"
                    src={CheckboxIcon}
                    alt=""
                    width={28}
                    height={28}
                    aria-hidden
                    unoptimized
                  />
                  <span className="font-inter text-base/snug tracking-tighter text-white/70 lg:text-xl/snug">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
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
