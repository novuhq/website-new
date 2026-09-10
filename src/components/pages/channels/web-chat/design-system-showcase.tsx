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
import amberPanel from "@/images/pages/channels/web-chat/design-system-amber.png"
import bluePanel from "@/images/pages/channels/web-chat/design-system-blue.png"
import purplePanel from "@/images/pages/channels/web-chat/design-system-purple.png"
import illustration from "@/images/pages/channels/web-chat/design-system-showcase.jpg"

import { Button } from "@/components/ui/button"

/** Figma section 45487:82563, with its existing mobile panel arrangement. */
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
    <div className="flex shrink-0 flex-col-reverse gap-4 sm:flex-row sm:items-center xl:pb-1.5">
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

function DesignSystemTrio() {
  return (
    <div className="relative mx-auto mt-8 flex w-full max-w-97 flex-col gap-6 pb-2">
      <Image
        src={purplePanel}
        alt={DESIGN_SYSTEM_IMAGE_ALT.purple}
        unoptimized
        className="h-auto w-full"
      />
      <div className="grid grid-cols-2 items-start gap-4">
        <Image
          src={amberPanel}
          alt={DESIGN_SYSTEM_IMAGE_ALT.amber}
          unoptimized
          className="h-auto w-full"
        />
        <Image
          src={bluePanel}
          alt={DESIGN_SYSTEM_IMAGE_ALT.blue}
          unoptimized
          className="h-auto w-full"
        />
      </div>
    </div>
  )
}

function DesignSystemCard() {
  return (
    <div className="relative isolate mt-14 overflow-hidden rounded-3xl border border-[#191A1F] bg-[#0B0C0E] px-4 pt-8 pb-4 md:hidden">
      {/* The mobile adaptation keeps its backdrop behind the transparent panels. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/2 left-1/2 aspect-square w-[140%] -translate-x-1/2 opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(45% 45% at 30% 55%, rgba(244,201,247,0.85) 0%, rgba(179,124,231,0.55) 32%, rgba(75,115,236,0.35) 60%, rgba(11,12,14,0) 78%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 wc-noise-overlay opacity-30"
      />

      <DesignSystemTrio />
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
        <DesignSystemCard />
      </div>
    </section>
  )
}
