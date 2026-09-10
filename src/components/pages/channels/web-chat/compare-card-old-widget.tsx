"use client"

import Image from "next/image"
import {
  COMPARE_OLD_WIDGET_BODY,
  COMPARE_OLD_WIDGET_TITLE,
} from "@/data/pages/web-chat-compare"
import illustrationMobile from "@/images/pages/channels/web-chat/compare-old-widget-illustration-mobile.jpg"
import illustrationDesktop from "@/images/pages/channels/web-chat/compare-old-widget-illustration.jpg"

import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

/**
 * Comparison artwork from Figma 45487:79782 / 45496:138552, exported at 2×.
 * Bubbles are part of the artwork; live title/body copy remains separate.
 * The artwork includes its glow; only shift its hue to preserve text contrast.
 * Serve the quality-95 JPG directly to avoid a second lossy conversion.
 */
export function OldWidgetCard() {
  return (
    <div className="relative mx-auto flex w-full flex-col overflow-hidden rounded-[18.69px] border-[0.78px] border-[#2A2B33] bg-[#101114] md:h-[480px] md:max-w-104 md:rounded-[24px] md:border xl:w-[411px]">
      {/* Tablet cards stack; the wide comparison row starts at xl. */}
      <div className="hidden md:absolute md:inset-0 md:isolate md:block">
        <Image
          alt=""
          aria-hidden
          className="object-cover"
          fill
          unoptimized
          sizes="(min-width: 1344px) 391px, 29vw"
          src={illustrationDesktop}
        />
        <HueLayer />
      </div>
      <div className="hidden md:absolute md:inset-x-7 md:bottom-7 md:flex md:flex-col md:gap-2.5">
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
        <HueLayer />
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
