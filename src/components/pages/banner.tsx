import Image from "next/image"
import NextLink from "next/link"
import bgIllustration from "@/images/shared/banner/background.jpg"
import shine from "@/svgs/pages/customers/cta/shine.svg"

import type { IBanner } from "@/types/common"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function Banner({ title, description, className, cta }: IBanner) {
  return (
    <section className={cn("banner relative", className)}>
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="relative flex flex-col gap-6 rounded-xl p-6 md:flex-row md:items-center md:justify-between md:gap-x-8 md:p-10">
          <div className="relative z-20 max-w-lg">
            <h2 className="text-xl/tight font-medium tracking-tighter lg:text-2xl/tight">
              {title}
            </h2>
            <p className="mt-2.5 leading-snug tracking-tighter text-gray-9">
              {description}
            </p>
          </div>
          <Button
            className="relative z-20 w-full shrink-0 md:w-auto"
            size="default"
            asChild
          >
            <NextLink
              href={cta.href}
              data-click-location={cta.clickLocation}
              data-click-text={cta.clickText}
            >
              {cta.label}
            </NextLink>
          </Button>

          <div className="absolute inset-0 z-10 overflow-hidden rounded-[inherit]">
            <Image
              className="pointer-events-none absolute inset-0 min-h-full max-w-none min-w-full object-cover object-top-right"
              src={bgIllustration}
              width={960}
              height={186}
              quality={100}
              sizes="(max-width: 768px) 100vw, 1920px"
              alt=""
              aria-hidden
            />
          </div>
          <span
            className="absolute inset-0 z-[11] rounded-[inherit] border-gradient bg-[radial-gradient(circle_at_top_right,rgba(236,209,250,0.3)_11%,rgba(95,82,122,0.3)_50%,rgba(168,148,209,0.1)_100%)]"
            aria-hidden
          />
          <Image
            className="pointer-events-none absolute -top-[9px] -right-[11px] z-[12]"
            src={shine}
            width={276}
            height={87}
            alt=""
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}

export default Banner
