"use client"

import Link from "next/link"
import { pricingPageData } from "@/data/pages/pricing"

import { cn } from "@/lib/utils"
import Logos from "@/components/pages/integrations/logos"

function IntegrationsHeroTrustedBy() {
  const { logos } = pricingPageData
  const heroLogoTitles = [
    "MongoDB",
    "Unity",
    "Sinch",
    "Hemnet",
    "Bitmex",
  ] as const
  const heroLogos = heroLogoTitles
    .map((title) =>
      logos.items.find(
        (item) => item.title.toLowerCase() === title.toLowerCase()
      )
    )
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({
      src: typeof item.image === "string" ? item.image : item.image.src,
      alt: item.title,
      width: typeof item.image === "string" ? 121 : item.image.width,
      height: typeof item.image === "string" ? 28 : item.image.height,
      wrapperClassName: "h-7 w-auto",
      imageClassName: "h-auto w-auto max-h-7 object-contain object-left",
    }))

  if (heroLogos.length === 0) {
    return null
  }

  return (
    <div className="flex w-full flex-col items-start gap-6">
      <p
        className={cn(
          "text-left text-sm leading-normal font-normal tracking-tight text-gray-7"
        )}
      >
        Trusted by top industry leaders
      </p>
      <Link href="/customers" tabIndex={-1} className="w-full cursor-pointer">
        <div
          className={cn(
            "overflow-hidden",
            "[-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
            "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          )}
        >
          <Logos
            logos={heroLogos}
            className="mx-0 p-0"
            trackClassName="w-max lg:w-max lg:animate-[logos_15s_linear_infinite] lg:will-change-transform"
            listClassName="gap-12 pr-12 lg:w-max lg:justify-start lg:gap-12 lg:pr-12"
            duplicateListClassName="gap-12 pr-12 lg:flex lg:gap-12 lg:pr-12"
          />
        </div>
      </Link>
    </div>
  )
}

export default IntegrationsHeroTrustedBy
