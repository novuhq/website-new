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
 * radius ~18.7px — the mobile section scales every stroke/radius by
 * ~0.7786x, not a separate design). Personalized reference `45503:149556`.
 *
 * Per the brief's hybrid decision, the whole illustration (dark card mockup,
 * support-service reply, form fields) is one exported PNG per breakpoint
 * (`45487:79782` neutral default desktop, `45510:177565` mobile — the mobile
 * frame only exists inside the recent.dev-personalized storyboard, so its
 * bubble is baked orange; that's fine, since `IllustrationBubble` fully
 * occludes it with the current visitor's own accent). The only coded accent
 * element is that bubble; the "Support service" icon/label, form fields and
 * (per the second-persona check against `45503:149556` `todesktop.com`
 * equivalent research) the label glyphs never change with brand, so they
 * stay baked into the image.
 */
export function OldWidgetCard() {
  return (
    <div className="relative isolate h-[374px] w-full overflow-hidden rounded-[24px] border border-[#2A2B33] bg-[#101114] md:h-[480px] md:w-[411px]">
      <div
        aria-hidden
        className={GLOW_CLASSES}
        style={{ background: "var(--wc-hue)" }}
      />
      <HueLayer />

      <Image
        alt=""
        aria-hidden
        className="hidden object-cover md:block"
        fill
        src={illustrationDesktop}
      />
      <Image
        alt=""
        aria-hidden
        className="object-cover md:hidden"
        fill
        src={illustrationMobile}
      />

      <div className="hidden md:block">
        <IllustrationBubble
          left={140}
          text={COMPARE_OLD_WIDGET_BUBBLE}
          top={28}
          width={227}
        />
      </div>
      <div className="md:hidden">
        <IllustrationBubble
          compact
          left={109}
          text={COMPARE_OLD_WIDGET_BUBBLE}
          top={22}
          width={177}
        />
      </div>

      <div className="absolute top-[267px] left-4 flex w-[288px] flex-col gap-2.5 md:top-[369px] md:left-7 md:w-[355px]">
        <h3 className="text-[16px] leading-[1.25] tracking-[-0.02em] text-white md:text-[20px]">
          {COMPARE_OLD_WIDGET_TITLE}
        </h3>
        <p className="text-[14px] leading-[1.5] tracking-[-0.02em] text-white/70 md:text-[16px]">
          {COMPARE_OLD_WIDGET_BODY}
        </p>
      </div>
    </div>
  )
}
