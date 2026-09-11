"use client"

import Image from "next/image"
import {
  COMPARE_WEB_CHAT_BODY,
  COMPARE_WEB_CHAT_TITLE,
} from "@/data/pages/web-chat-compare"
import illustrationMobile from "@/images/pages/channels/web-chat/compare-web-chat-illustration-mobile.jpg"
import illustrationDesktop from "@/images/pages/channels/web-chat/compare-web-chat-illustration.jpg"

import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

/**
 * Comparison artwork from Figma 45487:79841 / 45496:138745, exported at 2×.
 * The complete mobile frame includes the fade behind its live caption.
 * Baked bubbles and the selected table row render once, without extra overlays.
 * The artwork includes its glow; only shift its hue to preserve text contrast.
 */
export function WebChatCard() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[18.69px] border-[0.78px] border-[#2A2B33] bg-[#101114] md:h-[480px] md:rounded-[24px] md:border xl:w-[909px]">
      {/* Tablet cards stack; the wide comparison row starts at xl. */}
      <div className="hidden md:absolute md:inset-0 md:isolate md:block">
        <Image
          alt=""
          aria-hidden
          className="object-cover"
          fill
          unoptimized
          sizes="(min-width: 1344px) 865px, 63vw"
          src={illustrationDesktop}
        />
        <HueLayer />
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
        <HueLayer />
        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
          <h3 className="text-[16px] leading-[1.25] tracking-[-0.02em] text-white">
            {COMPARE_WEB_CHAT_TITLE}
          </h3>
          <p className="text-[14px] leading-[1.5] tracking-[-0.02em] text-white/70">
            {COMPARE_WEB_CHAT_BODY}
          </p>
        </div>
      </div>
      <div className="hidden md:absolute md:inset-x-7 md:bottom-7 md:flex md:max-w-[555px] md:flex-col md:gap-2.5">
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
