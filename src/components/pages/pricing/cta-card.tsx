import Image from "next/image"
import NextLink from "next/link"
import dotSurface from "@/images/pages/pricing/cta-card/dot-surface.png"
import pinkShine from "@/images/pages/pricing/cta-card/pink-shine.png"
import shine from "@/svgs/pages/customers/cta/shine.svg"

import { ICtaCard } from "@/types/pricing"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function CtaCard({ text, description, buttonText, buttonUrl }: ICtaCard) {
  return (
    <section className="mx-auto mt-22 w-full max-w-4xl px-5 md:mt-27.5 md:px-8 lg:mt-32 xl:mt-33.5">
      <div className="relative flex flex-col items-center justify-between gap-x-4 gap-y-6 rounded-xl bg-[linear-gradient(152.16deg,#1C0F1F_0.45%,#141221_98.47%)] p-5 md:flex-row md:px-8 md:py-6">
        <div
          className="absolute inset-0 overflow-hidden rounded-[inherit]"
          aria-hidden
        >
          <div className="absolute top-0 right-4 h-[171px] w-[479px] -translate-y-1/2 rounded-[50%] bg-[#de8db6] mix-blend-overlay blur-[50px]" />
          <div className="absolute top-1/2 left-1/2 h-[343px] w-[794px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[#cb8ab5] mix-blend-overlay blur-3xl" />
          <Image
            src={pinkShine}
            alt=""
            className="absolute top-0 right-0 h-full"
          />
          <Image
            src={dotSurface}
            alt=""
            className="absolute top-0 right-0 max-w-[832px] object-contain"
          />
        </div>
        <div
          className={cn(
            "relative z-20 flex flex-col items-center text-center md:items-start md:text-left"
          )}
        >
          <h2
            className={cn(
              "max-w-49 text-[20px] leading-tight font-medium tracking-tighter md:max-w-none md:text-[22px]"
            )}
          >
            {text}
          </h2>
          {description && (
            <p className="mt-2 text-[14px] leading-tight font-light tracking-tighter text-gray-9 md:mt-1.5">
              {description}
            </p>
          )}
        </div>
        <Button
          className={cn("relative z-20 h-9 w-full rounded md:w-auto")}
          asChild
        >
          <NextLink href={buttonUrl}>{buttonText}</NextLink>
        </Button>
        <span
          className="absolute inset-0 z-11 rounded-[inherit] border-gradient bg-[radial-gradient(circle_at_top_right,rgba(236,209,250,0.3)_11%,rgba(95,82,122,0.3)_50%,rgba(168,148,209,0.1)_100%)]"
          aria-hidden
        />
        <Image
          className="pointer-events-none absolute -top-[9px] -right-[11px] z-12"
          src={shine}
          width={276}
          height={87}
          alt=""
        />
      </div>
    </section>
  )
}

export default CtaCard
