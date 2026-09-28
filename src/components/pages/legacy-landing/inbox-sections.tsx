import Image from "next/image"

import InboxComponent from "@/components/pages/home/code-with-inbox/inbox/inbox-component"

import { LandingButtonLink } from "./action-link"
import type { LandingAction, LandingPicture } from "./types"

interface InboxHeroProps {
  action: LandingAction
  description: string
  image: LandingPicture
  title: string
}

export function InboxHero({
  action,
  description,
  image,
  title,
}: InboxHeroProps) {
  return (
    <section className="mt-14 pb-3.5 text-white md:mt-15 lg:mt-36 xl:mt-35">
      <div className="mx-auto flex w-full max-w-304 flex-col items-center gap-y-6 px-5 md:flex-row md:gap-x-8 md:px-8 lg:gap-x-16 xl:gap-x-20 2xl:gap-x-21.25">
        <div className="order-last flex w-full items-center justify-center md:order-first md:max-w-95 lg:w-132.75 lg:max-w-none lg:pl-6 xl:w-full xl:max-w-157">
          <Image
            className="h-auto w-full max-w-110 select-none md:max-w-95 lg:max-w-132.75 xl:max-w-154.75"
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            quality={100}
            priority
            sizes="(max-width: 767px) 100vw, 619px"
          />
        </div>
        <div className="relative z-10 w-full max-w-lg text-center md:max-w-120 md:text-left">
          <h1 className="text-[28px] leading-dense font-medium tracking-tighter text-balance text-white md:text-[32px] lg:text-[40px] xl:text-[48px]">
            {title}
          </h1>
          <p className="mt-5 text-sm leading-normal tracking-tighter text-pretty text-gray-8 lg:text-lg">
            {description}
          </p>
          <LandingButtonLink className="mt-8" action={action} secondary />
        </div>
      </div>
    </section>
  )
}

interface InboxShowcaseProps {
  action: LandingAction
  description: string
  title: string
}

export function InboxShowcase({
  action,
  description,
  title,
}: InboxShowcaseProps) {
  return (
    <section className="mt-14 pb-13 text-white md:mt-26 lg:mt-36 xl:mt-71.5">
      <div className="mx-auto w-full max-w-xl px-5 md:px-8 lg:max-w-304">
        <div className="flex flex-col items-center gap-y-12 lg:flex-row-reverse lg:justify-end lg:gap-x-16 xl:gap-x-20 2xl:gap-x-24">
          <InboxComponent className="shrink-0" />
          <div className="relative z-10 -order-1 max-w-95 text-center lg:order-none lg:max-w-120 lg:text-left">
            <h2 className="text-[28px] leading-dense font-medium tracking-tighter text-balance text-white md:text-[32px] lg:text-[40px] xl:text-[48px]">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-normal font-book tracking-tighter text-pretty text-gray-8 lg:text-lg">
              {description}
            </p>
            <LandingButtonLink className="mt-8" action={action} secondary />
          </div>
        </div>
      </div>
    </section>
  )
}
