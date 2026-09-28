import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import {
  DESIGN_SYSTEM_DESCRIPTION,
  DESIGN_SYSTEM_HEADING,
  DESIGN_SYSTEM_IMAGE_ALT,
  DESIGN_SYSTEM_PRIMARY_CTA_LABEL,
  DESIGN_SYSTEM_SECONDARY_CTA_HREF,
  DESIGN_SYSTEM_SECONDARY_CTA_LABEL,
} from "@/data/pages/web-chat-design-system"
import illustrationMobile from "@/images/pages/channels/web-chat/design-system-showcase-mobile.jpg"
import illustration from "@/images/pages/channels/web-chat/design-system-showcase.jpg"

import { Button } from "@/components/ui/button"

/** Figma desktop 45487:82563 and authored mobile section 45789:26399. */
function DesignSystemHeading() {
  return (
    <div className="flex flex-col gap-5 md:max-w-157 md:gap-6">
      <h2 className="text-[32px] leading-[1.25] font-normal tracking-[-0.04em] text-white md:text-[48px] md:leading-[1.04]">
        {DESIGN_SYSTEM_HEADING}
      </h2>
      <p className="text-base leading-[1.5] tracking-[-0.025em] text-white/80 md:text-[#A3A6B2]">
        {DESIGN_SYSTEM_DESCRIPTION}
      </p>
    </div>
  )
}

function DesignSystemActions() {
  return (
    <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center xl:pb-1.5">
      <Button
        asChild
        className="w-full px-5 py-3.5 text-base leading-none font-medium tracking-[-0.025em] normal-case sm:w-fit"
        size="none"
        variant="default"
      >
        <NextLink href={ROUTE.connect}>
          {DESIGN_SYSTEM_PRIMARY_CTA_LABEL}
        </NextLink>
      </Button>

      <Button
        asChild
        className="w-full px-5 py-3.5 text-base leading-none font-medium tracking-[-0.025em] text-white normal-case sm:w-fit"
        size="none"
        variant="outline"
      >
        <a
          href={DESIGN_SYSTEM_SECONDARY_CTA_HREF}
          rel="noreferrer"
          target="_blank"
        >
          {DESIGN_SYSTEM_SECONDARY_CTA_LABEL}
        </a>
      </Button>
    </div>
  )
}

export function DesignSystemShowcase() {
  return (
    <section>
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-336">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between xl:px-8">
          <DesignSystemHeading />
          <DesignSystemActions />
        </div>

        <Image
          src={illustration}
          alt={DESIGN_SYSTEM_IMAGE_ALT.desktop}
          unoptimized
          className="mt-14 hidden h-auto w-full rounded-3xl md:block"
        />
        <Image
          src={illustrationMobile}
          alt={DESIGN_SYSTEM_IMAGE_ALT.mobile}
          unoptimized
          className="mt-12 block h-auto w-full md:hidden"
        />
      </div>
    </section>
  )
}
