import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import {
  DESIGN_SYSTEM_CENTER_SURFACE,
  DESIGN_SYSTEM_DESCRIPTION,
  DESIGN_SYSTEM_HEADING,
  DESIGN_SYSTEM_LEFT_SURFACE,
  DESIGN_SYSTEM_PRIMARY_CTA_LABEL,
  DESIGN_SYSTEM_RIGHT_SURFACE,
  DESIGN_SYSTEM_SECONDARY_CTA_HREF,
  DESIGN_SYSTEM_SECONDARY_CTA_LABEL,
} from "@/data/pages/web-chat-design-system"

import { Button } from "@/components/ui/button"
import { ChatSurface } from "@/components/pages/channels/web-chat/chat-surface"

/**
 * §7 "Works with your design system. Ship to production" (Task 14).
 * Figma desktop `45487-82563`: a dark card containing three themed chat
 * surfaces (amber, purple, blue), the centre one prominent and overlapping
 * the two behind it, below a heading/description/CTA row.
 *
 * NOT personalized — no `HueLayer`, no `var(--wc-accent*)`. The three
 * surfaces have fixed themes; that contrast (three different design
 * systems, one hook) is the section's entire point.
 *
 * Mobile: no dedicated frame exists for this section in the full mobile
 * page (`45487-98982`). Its direct children stop after the ACI/frameworks
 * section (ends ~y6992) with nothing before the page's declared height —
 * confirmed via three separate fetches (page depth 1, depth 2, and the
 * canvas root listing), the same gap Task 10 already found and documented
 * for §3. Below `md` this renders a vertically stacked adaptation (centre
 * surface prominent and full width, the other two peeking behind it) that
 * keeps the same copy, theme colours and "overlapping" motif from the
 * desktop frame rather than inventing new mobile-specific content.
 */

function DesignSystemHeading() {
  return (
    <div className="flex flex-col gap-5 md:max-w-157 md:gap-4">
      <h2 className="text-[32px] leading-[1.25] font-normal tracking-[-0.04em] text-white md:text-[48px] md:leading-[1.04]">
        {DESIGN_SYSTEM_HEADING}
      </h2>
      <p className="text-base leading-[1.5] tracking-[-0.025em] text-white/80 md:text-[#A3A6B2]">
        {DESIGN_SYSTEM_DESCRIPTION}
      </p>
    </div>
  )
}

function DesignSystemActions() {
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:gap-4">
      <Button
        asChild
        className="w-full px-5 py-3.5 text-base leading-none font-medium tracking-[-0.025em] normal-case md:w-fit"
        size="none"
        variant="default"
      >
        <NextLink href={ROUTE.connect}>
          {DESIGN_SYSTEM_PRIMARY_CTA_LABEL}
        </NextLink>
      </Button>

      <Button
        asChild
        className="w-full px-5 py-3.5 text-base leading-none font-medium tracking-[-0.025em] text-white normal-case md:w-fit"
        size="none"
        variant="outline"
      >
        <a
          href={DESIGN_SYSTEM_SECONDARY_CTA_HREF}
          rel="noreferrer"
          target="_blank"
        >
          {DESIGN_SYSTEM_SECONDARY_CTA_LABEL}
        </a>
      </Button>
    </div>
  )
}

/**
 * The three-surface composition (`45487:82586` "chats-ui" group). Desktop
 * offsets are read directly off the frame: within a 1065×514 area the left
 * (amber) and right (blue) surfaces are 387×445 flush to each edge at
 * `top: 69px`, and the centre (purple) surface is 387×481 horizontally
 * centred at `top: 0` — so it starts higher and is taller, which combined
 * with being the last-painted DOM sibling is what makes it read as
 * overlapping and in front of the other two.
 *
 * The composition sits inside the card starting at `top: 73px` and is
 * taller than the 520px-tall card, so its bottom ~67px is clipped by the
 * card's own `overflow-hidden` + rounded corners — reproduced with `mt-*`
 * and a shorter card `max-h` instead of matching those two numbers exactly.
 */
function DesignSystemTrio() {
  return (
    <div className="relative mx-auto mt-8 flex w-full max-w-97 flex-col gap-6 pb-2 md:mt-[73px] md:h-129 md:max-w-266 md:gap-0 md:pb-0">
      <ChatSurface
        className="w-full md:absolute md:top-0 md:left-1/2 md:z-10 md:h-121 md:w-97 md:-translate-x-1/2"
        prominent
        surface={DESIGN_SYSTEM_CENTER_SURFACE}
      />
      <div className="flex gap-4 md:contents">
        <ChatSurface
          className="min-w-0 flex-1 md:absolute md:top-17 md:left-0 md:h-111 md:w-97 md:flex-none"
          surface={DESIGN_SYSTEM_LEFT_SURFACE}
        />
        <ChatSurface
          className="min-w-0 flex-1 md:absolute md:top-17 md:right-0 md:h-111 md:w-97 md:flex-none"
          surface={DESIGN_SYSTEM_RIGHT_SURFACE}
        />
      </div>
    </div>
  )
}

function DesignSystemCard() {
  return (
    <div className="relative mt-14 overflow-hidden rounded-3xl border border-[#191A1F] bg-[#0B0C0E] px-4 pt-8 pb-4 md:mt-13 md:max-h-130 md:px-0 md:pt-0">
      {/* Decorative ambient glow (`45487:82565`, a large blurred multi-colour
          blob) approximated as layered CSS gradients rather than shipping a
          6390×5250 raster export for a low-opacity backdrop — same call the
          hero fidelity pass made for its own noise/glow layers. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/2 left-1/2 aspect-square w-[140%] -translate-x-1/2 opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(45% 45% at 30% 55%, rgba(244,201,247,0.85) 0%, rgba(179,124,231,0.55) 32%, rgba(75,115,236,0.35) 60%, rgba(11,12,14,0) 78%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 wc-noise-overlay opacity-30"
      />

      <DesignSystemTrio />
    </div>
  )
}

export function DesignSystemShowcase() {
  return (
    <section>
      <div className="mx-auto max-w-[1344px] px-5 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <DesignSystemHeading />
          <DesignSystemActions />
        </div>

        <DesignSystemCard />
      </div>
    </section>
  )
}
