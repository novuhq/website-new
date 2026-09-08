"use client"

import Image from "next/image"
import {
  COMPARE_OLD_WIDGET_BODY,
  COMPARE_OLD_WIDGET_BUBBLE,
  COMPARE_OLD_WIDGET_TITLE,
} from "@/data/pages/web-chat-compare"
import illustrationMobile from "@/images/pages/channels/web-chat/compare-old-widget-illustration-mobile.png"
import illustrationDesktop from "@/images/pages/channels/web-chat/compare-old-widget-illustration.png"

import { IllustrationBubble } from "@/components/pages/channels/web-chat/compare-illustration-bubble"
import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

const GLOW_CLASSES =
  "pointer-events-none absolute inset-0 opacity-0 blur-[90px] transition-opacity duration-500 group-data-[wc-state=loading]:opacity-60 group-data-[wc-state=personalized]:opacity-60"

/**
 * Card 1, "The old chat widget". Figma desktop `45487:79781` (411×480,
 * border `#2A2B33` 1px, radius 24px); mobile `45510:177564` (fill×374,
 * border ~0.78px, radius ~18.69px — the mobile section scales every
 * stroke/radius by ~0.7786x, not a separate design). Personalized reference
 * `45503:149556`.
 *
 * Per the brief's hybrid decision, the whole illustration (dark card mockup,
 * support-service reply, form fields) is one exported PNG per breakpoint
 * (`45487:79782` neutral default desktop, `45510:177565` mobile — the mobile
 * frame only exists inside the recent.dev-personalized storyboard, so its
 * bubble is baked orange; that's fine, since `IllustrationBubble` fully
 * occludes it with the current visitor's own accent). The only coded accent
 * element is that bubble; the "Support service" icon/label and form fields
 * never change with brand (checked at runtime: overriding `--wc-accent`
 * only ever recolours the bubble, never those), so they stay baked into the
 * image.
 *
 * `<Image>` must render *before* the glow/`HueLayer` pair inside their
 * shared `isolate` host — fix round 1's Critical: a `fill` image is an
 * opaque `position:absolute;inset:0` box, so a DOM-earlier glow/HueLayer
 * gets fully painted over and never shows. Same order §3's
 * `product-bento-card.tsx` uses.
 */
export function OldWidgetCard() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[18.69px] border-[0.78px] border-[#2A2B33] bg-[#101114] md:h-[480px] md:w-[411px] md:rounded-[24px] md:border">
      {/* Desktop illustration */}
      <div className="hidden md:absolute md:inset-0 md:isolate md:block">
        <Image
          alt=""
          aria-hidden
          className="object-cover"
          fill
          src={illustrationDesktop}
        />
        <div
          aria-hidden
          className={GLOW_CLASSES}
          style={{ background: "var(--wc-hue)" }}
        />
        <HueLayer />
      </div>
      <div className="hidden md:block">
        <IllustrationBubble
          leftPct={34.06}
          text={COMPARE_OLD_WIDGET_BUBBLE}
          topPct={5.83}
          widthPct={55.23}
        />
      </div>

      {/* Mobile illustration — aspect-ratio locked so the bubble's percentage
          position tracks the image at any phone width, not just Figma's
          authored 320px (fix round 1, Important 2). */}
      <div
        className="relative isolate w-full shrink-0 overflow-hidden md:hidden"
        style={{ aspectRatio: "320/374" }}
      >
        <Image
          alt=""
          aria-hidden
          className="object-cover"
          fill
          src={illustrationMobile}
        />
        <div
          aria-hidden
          className={GLOW_CLASSES}
          style={{ background: "var(--wc-hue)" }}
        />
        <HueLayer />
        <IllustrationBubble
          compact
          leftPct={34.06}
          text={COMPARE_OLD_WIDGET_BUBBLE}
          topPct={5.88}
          widthPct={55.31}
        />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-2.5 px-4 md:hidden">
        <h3 className="text-[16px] leading-[1.25] tracking-[-0.02em] text-white">
          {COMPARE_OLD_WIDGET_TITLE}
        </h3>
        <p className="text-[14px] leading-[1.5] tracking-[-0.02em] text-white/70">
          {COMPARE_OLD_WIDGET_BODY}
        </p>
      </div>
      <div className="hidden md:absolute md:top-[369px] md:left-7 md:flex md:w-[355px] md:flex-col md:gap-2.5">
        <h3 className="text-[20px] leading-[1.25] tracking-[-0.02em] text-white">
          {COMPARE_OLD_WIDGET_TITLE}
        </h3>
        <p className="text-[16px] leading-[1.5] tracking-[-0.02em] text-white/70">
          {COMPARE_OLD_WIDGET_BODY}
        </p>
      </div>
    </div>
  )
}
