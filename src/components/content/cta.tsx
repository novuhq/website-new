import type { CSSProperties } from "react"
import Image from "next/image"
import NextLink from "next/link"
import ctaBgMobile from "@/images/content/cta/bg-mobile.jpg"
import ctaBg from "@/images/content/cta/bg.jpg"
import bgIllustration from "@/images/pages/customers/cta/bg-illustration.png"
import shine from "@/svgs/pages/customers/cta/shine.svg"

import { IContentCtaBlock } from "@/types/content"
import { normalizeDashboardUrl } from "@/lib/normalize-dashboard-url"
import { getProcessedImageUrl } from "@/lib/sanity/utils/get-url-for-image"
import { Button } from "@/components/ui/button"

type TCtaVariant = "default" | "v2"

interface ICtaProps extends IContentCtaBlock {
  variant?: TCtaVariant
}

function Cta({
  text,
  description,
  cover,
  mobileCover,
  buttonText,
  buttonUrl,
  clickLocation,
  clickText,
  variant = "default",
}: ICtaProps) {
  const normalizedButtonUrl = normalizeDashboardUrl(buttonUrl)

  if (variant === "v2") {
    const desktopCoverUrl = cover?.asset?._ref
      ? getProcessedImageUrl(cover, {
          width: 704,
          height: 336,
          quality: 95,
        })
      : null
    const mobileCoverUrl = mobileCover?.asset?._ref
      ? getProcessedImageUrl(mobileCover, {
          width: 320,
          height: 496,
          quality: 95,
        })
      : null

    return (
      <div className="not-prose relative my-8 h-124 overflow-hidden rounded-[20px] border border-[#191a1f] sm:aspect-[704/336] sm:h-auto">
        <div className="absolute inset-0 sm:hidden" aria-hidden>
          <div className="absolute inset-y-0 right-1/2 left-0 bg-[linear-gradient(to_bottom,#111216_0%,#121317_10%,#13131d_20%,#131426_30%,#161a37_40%,#1c2149_50%,#21275b_60%,#272e66_70%,#2a306a_80%,#2a3067_90%,#272b59_100%)]" />
          <div className="absolute inset-y-0 right-0 left-1/2 bg-[linear-gradient(to_bottom,#111216_0%,#111119_10%,#12111f_20%,#191632_30%,#29204e_40%,#412f6c_50%,#5e4089_60%,#744e9e_70%,#7f57aa_80%,#7a51a0_90%,#5d4183_100%)]" />
          <Image
            className="pointer-events-none absolute inset-y-0 left-1/2 h-full w-80 max-w-none -translate-x-1/2 [mask-image:var(--cta-edge-fade)] [-webkit-mask-image:var(--cta-edge-fade)]"
            style={
              {
                "--cta-edge-fade":
                  "linear-gradient(to right, transparent 0, rgba(0,0,0,0.55) 7px, rgba(0,0,0,0.92) 14px, #000 26px, #000 calc(100% - 26px), rgba(0,0,0,0.92) calc(100% - 14px), rgba(0,0,0,0.55) calc(100% - 7px), transparent 100%)",
              } as CSSProperties
            }
            src={mobileCoverUrl ?? ctaBgMobile}
            width={320}
            height={496}
            quality={100}
            sizes="320px"
            alt=""
          />
        </div>
        <Image
          className="pointer-events-none absolute inset-0 hidden size-full object-cover sm:block"
          src={desktopCoverUrl ?? ctaBg}
          width={704}
          height={336}
          quality={100}
          sizes="702px"
          alt=""
        />
        <div className="relative flex size-full flex-col items-start gap-5 p-5 font-inter sm:justify-center sm:gap-7 sm:px-8 sm:py-0">
          <div className="flex max-w-70 flex-col gap-2.5 sm:max-w-[357px] sm:gap-3.5">
            <h2 className="text-2xl leading-[1.2] tracking-[-0.02em] whitespace-pre-line text-white sm:text-[2rem]">
              {text}
            </h2>
            {description && (
              <p className="text-base leading-normal tracking-[-0.02em] whitespace-pre-line text-[#a3a6b2]">
                {description}
              </p>
            )}
          </div>
          <Button
            className="h-11 px-5 text-base tracking-tight"
            size="none"
            asChild
          >
            <NextLink
              href={normalizedButtonUrl}
              data-click-location={clickLocation}
              data-click-text={clickText}
            >
              {buttonText}
            </NextLink>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="not-prose relative my-6 flex items-center justify-between gap-x-4 rounded-xl px-4 py-6 md:px-5">
      <h2 className="relative z-20 text-[20px] leading-tight font-medium md:text-[22px]">
        {text}
      </h2>
      <Button className="relative z-20 h-9" asChild>
        <NextLink
          href={normalizedButtonUrl}
          data-click-location={clickLocation}
          data-click-text={clickText}
        >
          {buttonText}
        </NextLink>
      </Button>

      <div className="absolute inset-0 z-10 overflow-hidden rounded-[inherit]">
        <Image
          className="pointer-events-none absolute inset-0 min-h-full w-[704px] max-w-none sm:w-auto sm:min-w-full"
          src={bgIllustration}
          width={704}
          height={84}
          quality={100}
          sizes="(max-width: 768px) 100vw, 704px"
          alt=""
          aria-hidden
        />
        <div
          className="absolute top-0 right-[0px] z-12 h-1 w-45 -translate-y-1/2 rounded-[100%] bg-white blur-[1px]"
          aria-hidden
        />
      </div>
      <span
        className="absolute inset-0 z-11 rounded-[inherit] border-gradient bg-[radial-gradient(163.16%_186.97%_at_101.28%_-17.91%,#ECD1FA_10.74%,rgba(95,82,122,0.3)_49.79%,rgba(168,148,209,0.1)_100%)]"
        aria-hidden
      />
      <Image
        className="pointer-events-none absolute -top-[9px] -right-[11px] z-12"
        src={shine}
        width={276}
        height={87}
        alt=""
        aria-hidden
      />
    </div>
  )
}

export default Cta
