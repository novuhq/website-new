"use client"

import Image from "next/image"
import {
  COMPARE_WEB_CHAT_BODY,
  COMPARE_WEB_CHAT_TITLE,
} from "@/data/pages/web-chat-compare"
import illustrationMobile from "@/images/pages/channels/web-chat/compare-web-chat-illustration-mobile.jpg"
import illustrationDesktop from "@/images/pages/channels/web-chat/compare-web-chat-illustration.jpg"

import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

const GLOW_CLASSES =
  "pointer-events-none absolute inset-0 opacity-0 blur-[90px] transition-opacity duration-500 group-data-[wc-state=loading]:opacity-60 group-data-[wc-state=personalized]:opacity-60"

/**
 * Comparison artwork from Figma 45487:79841 / 45510:177623, exported at 2×.
 * The mobile image is cropped above its caption; title/body stay live below it.
 * Baked bubbles and the selected table row render once, without extra overlays.
 */
export function WebChatCard() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[18.69px] border-[0.78px] border-[#2A2B33] bg-[#101114] md:h-[480px] md:w-[909px] md:rounded-[24px] md:border">
      {/* Desktop illustration. `sizes` matches the card's actual rendered
          width — since Fix 3 (final review) this box is no longer a fixed
          909px: it's the flex-row's second child, and its `md:w-[909px]`
          basis now shrinks (default `flex-shrink: 1`, no `shrink-0`) to fit
          alongside `OldWidgetCard` inside the container's real content
          width, landing at ~865px once the container hits its
          `max-w-[1344px]` cap and scaling down further below that (see
          `compare-bento.tsx`'s file header for the full arithmetic). */}
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
        <div
          aria-hidden
          className={GLOW_CLASSES}
          style={{ background: "var(--wc-hue)" }}
        />
        <HueLayer />
      </div>
      {/* Mobile illustration */}
      <div
        className="relative isolate w-full shrink-0 overflow-hidden md:hidden"
        style={{ aspectRatio: "640/645" }}
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
        <div
          aria-hidden
          className={GLOW_CLASSES}
          style={{ background: "var(--wc-hue)" }}
        />
        <HueLayer />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-2.5 px-4 md:hidden">
        <h3 className="text-[16px] leading-[1.25] tracking-[-0.02em] text-white">
          {COMPARE_WEB_CHAT_TITLE}
        </h3>
        <p className="text-[14px] leading-[1.5] tracking-[-0.02em] text-white/70">
          {COMPARE_WEB_CHAT_BODY}
        </p>
      </div>
      <div className="hidden md:absolute md:top-[369px] md:left-7 md:flex md:w-[555px] md:flex-col md:gap-2.5">
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
