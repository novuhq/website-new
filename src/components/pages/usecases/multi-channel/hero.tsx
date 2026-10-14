import Image from "next/image"
import { HERO } from "@/data/pages/usecase-multi-channel"

import CustomerLogos from "@/components/customer-logos"

import { ActionButton, TitleLines } from "./shared"

/**
 * Hero `45929-6811`. The desktop plate is the 1920px frame from y 300 to the
 * logo strip (y 793). It overlaps the copy by 120px, which is empty glow.
 *
 * Below 1440px the plate keeps 1920/1440 of the viewport width, so the
 * channel grid and the app card stay on screen while the edges crop. Phones
 * get a vertical recomposition of the same layers.
 */
export function MultiChannelHero() {
  const { illustration } = HERO

  return (
    <section
      aria-labelledby="multi-channel-hero-title"
      className="pt-12 md:pt-16 lg:pt-19"
    >
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 text-center md:px-8 lg:max-w-240">
        <h1
          id="multi-channel-hero-title"
          className="text-4xl leading-[1.14] font-normal tracking-plus-tight text-white md:text-5xl xl:text-[3.5rem]"
        >
          <TitleLines lines={HERO.titleLines} />
        </h1>
        <p className="mt-4.5 text-base leading-normal tracking-tight text-white/80 md:text-lg md:text-gray-70">
          <TitleLines lines={HERO.descriptionLines} />
        </p>
        <div className="mt-9 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <ActionButton
            action={HERO.primaryAction}
            section="hero"
            variant="primary"
          />
          <ActionButton
            action={HERO.secondaryAction}
            section="hero"
            variant="secondary"
          />
        </div>
      </div>

      <div className="relative left-1/2 mt-6 aspect-[780/1300] w-full max-w-120 -translate-x-1/2 md:-mt-[min(120px,8.333vw)] md:aspect-[1920/493] md:w-[min(1920px,133.333vw)] md:max-w-none">
        <picture className="absolute inset-0 block size-full">
          <source
            media="(width < 48rem)"
            srcSet={illustration.mobile.src}
            width={illustration.mobile.width}
            height={illustration.mobile.height}
          />
          <Image
            alt={illustration.alt}
            className="object-cover"
            fill
            loading="eager"
            unoptimized
            src={illustration.desktop}
          />
        </picture>
      </div>

      <CustomerLogos className="border-transparent" />
    </section>
  )
}
