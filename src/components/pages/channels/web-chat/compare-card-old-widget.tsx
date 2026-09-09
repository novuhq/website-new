"use client"

import Image from "next/image"
import {
  COMPARE_OLD_WIDGET_BODY,
  COMPARE_OLD_WIDGET_TITLE,
} from "@/data/pages/web-chat-compare"
import illustrationMobile from "@/images/pages/channels/web-chat/compare-old-widget-illustration-mobile.jpg"
import illustrationDesktop from "@/images/pages/channels/web-chat/compare-old-widget-illustration.jpg"

import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

const GLOW_CLASSES =
  "pointer-events-none absolute inset-0 opacity-0 blur-[90px] transition-opacity duration-500 group-data-[wc-state=loading]:opacity-60 group-data-[wc-state=personalized]:opacity-60"

/**
 * Comparison artwork from Figma 45487:79782 / 45510:177565, exported at 2×.
 * Bubbles are part of the artwork; live title/body copy remains separate.
 * Serve the quality-95 JPG directly to avoid a second lossy conversion.
 */
export function OldWidgetCard() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[18.69px] border-[0.78px] border-[#2A2B33] bg-[#101114] md:h-[480px] md:w-[411px] md:rounded-[24px] md:border">
      {/* Desktop illustration. `sizes` matches the card's actual rendered
          width — since Fix 3 (final review) this box is no longer a fixed
          411px: it's the flex-row's first child, and its `md:w-[411px]`
          basis now shrinks (default `flex-shrink: 1`, no `shrink-0`) to fit
          alongside `WebChatCard` inside the container's real content width,
          landing at ~391px once the container hits its `max-w-[1344px]`
          cap and scaling down further below that (see `compare-bento.tsx`'s
          file header for the full arithmetic). */}
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
        <div
          aria-hidden
          className={GLOW_CLASSES}
          style={{ background: "var(--wc-hue)" }}
        />
        <HueLayer />
      </div>
      <div className="hidden md:absolute md:top-[369px] md:left-7 md:flex md:w-[355px] md:flex-col md:gap-2.5">
        <h3 className="text-[20px] leading-[1.25] tracking-[-0.02em] text-white">
          {COMPARE_OLD_WIDGET_TITLE}
        </h3>
        <p className="text-[16px] leading-[1.5] tracking-[-0.02em] text-white/70">
          {COMPARE_OLD_WIDGET_BODY}
        </p>
      </div>

      {/* Mobile illustration — aspect-ratio locked so the bubble's and
          text's percentage positions track the image at any phone width,
          not just Figma's authored 320px (fix round 1, Important 2). */}
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
        <div
          aria-hidden
          className={GLOW_CLASSES}
          style={{ background: "var(--wc-hue)" }}
        />
        <HueLayer />
        <div
          className="absolute flex flex-col gap-2.5"
          style={{ left: "5%", top: "71.39%", width: "90%" }}
        >
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
