import {
  digestBatchNotifications,
  digestCta,
  digestCtaBackground,
  digestHero,
  digestNotificationFatigue,
  digestStrategies,
  digestUseCases,
} from "./data/digest"
import { DualCta } from "./dual-cta"
import { IconGridSection } from "./icon-grid-section"
import { PictureSection } from "./picture-section"

export function DigestLandingPage() {
  return (
    <div className="-mt-16 overflow-hidden pb-28 lg:pb-32 xl:pb-52">
      <h1 className="sr-only">Digest</h1>

      <PictureSection
        {...digestHero}
        className="mt-14 pt-14 md:mt-26 md:pt-0 lg:mt-36 xl:mt-40"
        mediaClassName="h-96 min-[501px]:h-[655px] md:h-[400px] lg:h-[500px] xl:h-[655px]"
        mediaInnerClassName="top-0 left-1/2 -translate-x-[53%] -translate-y-16 min-[501px]:-translate-y-28 md:top-1/2 md:-translate-y-[46%] lg:-translate-x-1/2 xl:-translate-x-[58%]"
        imageClassName="w-[530px] min-[501px]:w-[670px] md:w-[670px] lg:w-[900px] xl:w-[1064px]"
        fadeEdges
        priority
      />

      <IconGridSection
        {...digestBatchNotifications}
        className="relative z-10 mt-20 md:mt-25 lg:mt-30 xl:mt-44"
      />

      <PictureSection
        {...digestStrategies}
        className="mt-14 md:mt-26 lg:mt-36 xl:mt-40"
        theme="image-right"
        mediaClassName="h-56 min-[501px]:h-72 md:h-80 lg:h-96 xl:h-[657px]"
        mediaInnerClassName="top-0 left-1/2 -translate-x-[49%] -translate-y-12 min-[501px]:-translate-y-24 md:top-1/2 md:-translate-y-[59%] lg:-translate-x-1/2 xl:-translate-x-[42.3%]"
        imageClassName="w-[430px] min-[501px]:w-[620px] md:w-[520px] lg:w-[720px] xl:w-[990px]"
        fadeEdges
      />

      <PictureSection
        {...digestNotificationFatigue}
        className="mt-14 md:mt-26 lg:mt-36 xl:mt-40"
        mediaClassName="h-48 md:h-80 lg:h-[400px] xl:h-96"
        mediaInnerClassName="top-0 left-1/2 -translate-x-[63%] -translate-y-24 min-[501px]:-translate-y-44 md:top-1/2 md:-translate-y-[65%] lg:-translate-x-[62%] xl:-translate-x-[68%] xl:-translate-y-[62%]"
        imageClassName="w-96 min-[501px]:w-[600px] md:w-[480px] lg:w-[620px] xl:w-[902px]"
        fadeEdges
      />

      <IconGridSection
        {...digestUseCases}
        centered
        className="mt-20 text-center min-[501px]:mt-40 md:mt-25 lg:mt-30 xl:mt-52"
        itemTitleClassName="text-[22px] md:text-2xl"
      />

      <DualCta
        {...digestCta}
        backgroundSrc={digestCtaBackground}
        className="relative mt-31 overflow-visible lg:mt-51 xl:mt-[234px]"
        descriptionClassName="mt-4 mb-1 max-w-180"
        titleClassName="px-2.5"
      />
    </div>
  )
}
