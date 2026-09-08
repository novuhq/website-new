"use client"

import type { CSSProperties } from "react"
import Image from "next/image"
import {
  COMPARE_WEB_CHAT_BODY,
  COMPARE_WEB_CHAT_BUBBLE,
  COMPARE_WEB_CHAT_TITLE,
} from "@/data/pages/web-chat-compare"
import illustrationMobile from "@/images/pages/channels/web-chat/compare-web-chat-illustration-mobile.webp"
import illustrationDesktop from "@/images/pages/channels/web-chat/compare-web-chat-illustration.webp"

import { IllustrationBubble } from "@/components/pages/channels/web-chat/compare-illustration-bubble"
import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

const GLOW_CLASSES =
  "pointer-events-none absolute inset-0 opacity-0 blur-[90px] transition-opacity duration-500 group-data-[wc-state=loading]:opacity-60 group-data-[wc-state=personalized]:opacity-60"

/**
 * The one other discrete accent element the brief calls for: the highlighted
 * "AI Odyssey" row in the floating agent-response table. The baked
 * illustration already shows this row lightly highlighted
 * (`rgba(255,255,255,0.1)`, identical across both brand personas checked —
 * `45487:79906` vs `45503:149685` — confirming that particular wash is fixed,
 * not accent-driven); this translucent `var(--wc-accent-soft)` layer sits on
 * top of it so the row reads as accent-tinted, same technique as the hero's
 * `DataTable` selected row. Percentages of the illustration's own box, same
 * convention as `IllustrationBubble` (fix round 1, Important 2) — the mobile
 * `widthPct` intentionally exceeds 100 so the row keeps overflowing past the
 * box's right edge exactly like Figma's own crop there.
 */
function SelectedRow({
  leftPct,
  topPct,
  widthPct,
  heightPct,
}: {
  leftPct: number
  topPct: number
  widthPct: number
  heightPct: number
}) {
  return (
    <div
      aria-hidden
      className="absolute"
      style={
        {
          left: `${leftPct}%`,
          top: `${topPct}%`,
          width: `${widthPct}%`,
          height: `${heightPct}%`,
          backgroundColor: "var(--wc-accent-soft)",
        } as CSSProperties
      }
    />
  )
}

/**
 * Card 2, "Web Chat". Figma desktop `45487:79840` (909×480); mobile
 * `45510:177623` (fill×457, border ~0.78px, radius ~18.69px). Personalized
 * reference `45503:149616`.
 *
 * Mobile is its own composition, not a scaled desktop: the mobile frame's
 * "ui" (chat + floating table) group is a *sibling* of its background frame
 * rather than nested inside it, and Figma renders it wider than the 320px
 * card — the floating table's "Price" column and the "DevTools Weekly" row
 * really do run past the right/bottom edge and get cropped there, per the
 * brief. The exported illustration here is that full composition (from
 * `45510:177623`) with the baked "Web Chat" title/body cropped back off the
 * bottom (that text is coded separately below, from the data module, not
 * baked into the image) — everything above the crop line renders exactly as
 * designed, edge-crop included. The mobile illustration wrapper is
 * aspect-ratio locked (`640/645`, the exported PNG's own ratio) so the
 * bubble/row percentages track it at any phone width (fix round 1,
 * Important 2).
 *
 * `<Image>` renders *before* the glow/`HueLayer` pair in both breakpoints'
 * `isolate` hosts — fix round 1's Critical: a `fill` image paints over
 * anything earlier in the DOM, so glow/HueLayer must come after it, not
 * before, to be visible at all. Same order §3's `product-bento-card.tsx`
 * uses.
 */
export function WebChatCard() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[18.69px] border-[0.78px] border-[#2A2B33] bg-[#101114] md:h-[480px] md:w-[909px] md:rounded-[24px] md:border">
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
        <SelectedRow
          heightPct={9.17}
          leftPct={44.0}
          topPct={40.21}
          widthPct={51.16}
        />
        <IllustrationBubble
          leftPct={15.4}
          text={COMPARE_WEB_CHAT_BUBBLE}
          topPct={6.67}
          widthPct={31.79}
        />
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
          src={illustrationMobile}
        />
        <div
          aria-hidden
          className={GLOW_CLASSES}
          style={{ background: "var(--wc-hue)" }}
        />
        <HueLayer />
        <SelectedRow
          heightPct={9.3}
          leftPct={14.38}
          topPct={61.4}
          widthPct={125}
        />
        <IllustrationBubble
          compact
          leftPct={28.13}
          text={COMPARE_WEB_CHAT_BUBBLE}
          topPct={4.96}
          widthPct={61.25}
        />
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
