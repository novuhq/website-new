"use client"

import Image from "next/image"
import {
  COMPARE_WEB_CHAT_BODY,
  COMPARE_WEB_CHAT_TITLE,
} from "@/data/pages/web-chat-compare"
import MobileUI from "@/images/pages/channels/web-chat/compare-layers/compare-web-mobile.inline.svg"
import mobileBackground from "@/images/pages/channels/web-chat/compare-layers/compare-web-mobile.jpg"
import DesktopUI from "@/images/pages/channels/web-chat/compare-layers/compare-web.inline.svg"
import desktopBackground from "@/images/pages/channels/web-chat/compare-layers/compare-web.jpg"
import illustrationMobile from "@/images/pages/channels/web-chat/compare-web-chat-illustration-mobile.jpg"
import illustrationDesktop from "@/images/pages/channels/web-chat/compare-web-chat-illustration.jpg"

import { BrandArtwork } from "@/components/pages/channels/web-chat/brand-artwork"

import { CompareTabletArtwork } from "./compare-tablet-artwork"

/** Keep the original artwork for idle/fallback; personalized bubbles sit above the hue-tinted base. */
export function WebChatCard() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[18.69px] border-[0.78px] border-[#2A2B33] bg-[#101114] md:h-[480px] md:rounded-[24px] md:border lg:flex-1 xl:w-[909px] xl:flex-none">
      <CompareTabletArtwork kind="web" />
      <div className="hidden xl:absolute xl:inset-0 xl:isolate xl:block">
        <Image
          alt=""
          aria-hidden
          className="object-cover"
          fill
          unoptimized
          sizes="(min-width: 1344px) 865px, 63vw"
          src={illustrationDesktop}
        />
        <BrandArtwork
          id="compare-web"
          background={desktopBackground}
          UI={DesktopUI}
          cover
          sizes="63vw"
        />
      </div>
      {/* Keep Figma's full portrait composition and its original caption backdrop. */}
      <div
        className="relative isolate w-full overflow-hidden md:hidden"
        style={{ aspectRatio: "320/457" }}
      >
        <Image
          alt=""
          aria-hidden
          className="object-cover object-top"
          fill
          unoptimized
          sizes="92vw"
          src={illustrationMobile}
        />
        <BrandArtwork
          id="compare-web-mobile"
          background={mobileBackground}
          UI={MobileUI}
          cover
          sizes="92vw"
        />
        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
          <h3 className="text-[16px] leading-[1.25] tracking-[-0.02em] text-white">
            {COMPARE_WEB_CHAT_TITLE}
          </h3>
          <p className="text-[14px] leading-[1.5] tracking-[-0.02em] text-white/70">
            {COMPARE_WEB_CHAT_BODY}
          </p>
        </div>
      </div>
      <div className="hidden md:absolute md:inset-x-4 md:bottom-4 md:flex md:flex-col md:gap-2.5 xl:inset-x-7 xl:bottom-7 xl:max-w-[555px]">
        <h3 className="text-[20px] leading-[1.25] tracking-[-0.02em] text-white">
          {COMPARE_WEB_CHAT_TITLE}
        </h3>
        <p className="text-[16px] leading-[1.5] tracking-[-0.02em] text-white/70">
          {COMPARE_WEB_CHAT_BODY}
        </p>
      </div>
    </div>
  )
}
