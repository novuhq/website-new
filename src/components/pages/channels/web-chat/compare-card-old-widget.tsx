"use client"

import Image from "next/image"
import {
  COMPARE_OLD_WIDGET_BODY,
  COMPARE_OLD_WIDGET_TITLE,
} from "@/data/pages/web-chat-compare"
import MobileUI from "@/images/pages/channels/web-chat/compare-layers/compare-old-mobile.inline.svg"
import mobileBackground from "@/images/pages/channels/web-chat/compare-layers/compare-old-mobile.jpg"
import DesktopUI from "@/images/pages/channels/web-chat/compare-layers/compare-old.inline.svg"
import desktopBackground from "@/images/pages/channels/web-chat/compare-layers/compare-old.jpg"
import illustrationMobile from "@/images/pages/channels/web-chat/compare-old-widget-illustration-mobile.jpg"
import illustrationDesktop from "@/images/pages/channels/web-chat/compare-old-widget-illustration.jpg"

import { BrandArtwork } from "@/components/pages/channels/web-chat/brand-artwork"

import { CompareTabletArtwork } from "./compare-tablet-artwork"

/** Keep the original artwork for idle/fallback; personalized bubbles sit above the hue-tinted base. */
export function OldWidgetCard() {
  return (
    <div className="relative mx-auto flex w-full flex-col overflow-hidden rounded-[18.69px] border-[0.78px] border-[#2A2B33] bg-[#101114] md:h-[480px] md:rounded-[24px] md:border lg:flex-1 xl:w-[411px] xl:flex-none">
      <CompareTabletArtwork kind="old" />
      <div className="hidden xl:absolute xl:inset-0 xl:isolate xl:block">
        <Image
          alt=""
          aria-hidden
          className="object-cover"
          fill
          unoptimized
          sizes="(min-width: 1344px) 391px, 29vw"
          src={illustrationDesktop}
        />
        <BrandArtwork
          id="compare-old"
          background={desktopBackground}
          UI={DesktopUI}
          cover
          sizes="63vw"
        />
      </div>
      <div className="hidden md:absolute md:inset-x-4 md:bottom-4 md:flex md:max-w-109 md:flex-col md:gap-2.5 xl:inset-x-7 xl:bottom-7 xl:max-w-none">
        <h3 className="text-[20px] leading-[1.25] tracking-[-0.02em] text-white">
          {COMPARE_OLD_WIDGET_TITLE}
        </h3>
        <p className="text-[16px] leading-[1.5] tracking-[-0.02em] text-white/70">
          {COMPARE_OLD_WIDGET_BODY}
        </p>
      </div>

      {/* Mobile artwork retains Figma's 320×374 frame; captions keep 16px insets. */}
      <div
        className="relative isolate w-full overflow-hidden md:hidden"
        style={{ aspectRatio: "320/374" }}
      >
        <Image
          alt=""
          aria-hidden
          className="object-cover"
          fill
          unoptimized
          sizes="92vw"
          src={illustrationMobile}
        />
        <BrandArtwork
          id="compare-old-mobile"
          background={mobileBackground}
          UI={MobileUI}
          cover
          sizes="92vw"
        />
        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
          <h3 className="text-[16px] leading-[1.25] tracking-[-0.02em] text-white">
            {COMPARE_OLD_WIDGET_TITLE}
          </h3>
          <p className="text-[14px] leading-[1.5] tracking-[-0.02em] text-white/70">
            {COMPARE_OLD_WIDGET_BODY}
          </p>
        </div>
      </div>
    </div>
  )
}
