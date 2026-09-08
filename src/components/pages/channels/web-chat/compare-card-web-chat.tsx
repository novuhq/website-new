"use client"

import type { CSSProperties } from "react"
import Image from "next/image"
import {
  COMPARE_WEB_CHAT_BODY,
  COMPARE_WEB_CHAT_BUBBLE,
  COMPARE_WEB_CHAT_TITLE,
} from "@/data/pages/web-chat-compare"
import illustrationMobile from "@/images/pages/channels/web-chat/compare-web-chat-illustration-mobile.png"
import illustrationDesktop from "@/images/pages/channels/web-chat/compare-web-chat-illustration.png"

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
 * `DataTable` selected row.
 */
function SelectedRow({
  left,
  top,
  width,
  height,
}: {
  left: number
  top: number
  width: number
  height: number
}) {
  return (
    <div
      aria-hidden
      className="absolute"
      style={
        {
          left,
          top,
          width,
          height,
          backgroundColor: "var(--wc-accent-soft)",
        } as CSSProperties
      }
    />
  )
}

/**
 * Card 2, "Web Chat". Figma desktop `45487:79840` (909×480); mobile
 * `45510:177623` (fill×457). Personalized reference `45503:149616`.
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
 * designed, edge-crop included.
 */
export function WebChatCard() {
  return (
    <div className="relative isolate flex h-[457px] w-full flex-col overflow-hidden rounded-[24px] border border-[#2A2B33] bg-[#101114] md:h-[480px] md:w-[909px]">
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
      <div className="relative h-[322px] w-full shrink-0 md:hidden">
        <Image
          alt=""
          aria-hidden
          className="object-cover object-top"
          fill
          src={illustrationMobile}
        />
        <SelectedRow height={30} left={46} top={198} width={400} />
        <IllustrationBubble
          left={90}
          text={COMPARE_WEB_CHAT_BUBBLE}
          top={16}
          width={196}
          compact
        />
      </div>

      <div className="hidden md:block">
        <SelectedRow height={44} left={400} top={193} width={465} />
        <IllustrationBubble
          left={140}
          text={COMPARE_WEB_CHAT_BUBBLE}
          top={32}
          width={289}
        />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-2.5 px-4 md:absolute md:top-[369px] md:left-7 md:block md:w-[555px] md:px-0">
        <h3 className="text-[16px] leading-[1.25] tracking-[-0.02em] text-white md:text-[20px]">
          {COMPARE_WEB_CHAT_TITLE}
        </h3>
        <p className="text-[14px] leading-[1.5] tracking-[-0.02em] text-white/70 md:text-[16px]">
          {COMPARE_WEB_CHAT_BODY}
        </p>
      </div>
    </div>
  )
}
