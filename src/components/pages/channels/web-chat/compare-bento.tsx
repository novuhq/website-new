import {
  COMPARE_DESCRIPTION,
  COMPARE_HEADING,
} from "@/data/pages/web-chat-compare"

import { OldWidgetCard } from "@/components/pages/channels/web-chat/compare-card-old-widget"
import { WebChatCard } from "@/components/pages/channels/web-chat/compare-card-web-chat"

/**
 * §2 "You know the old chat widget. This is Web Chat" (Task 9). Figma
 * desktop `45487-79779`, personalized reference `45503-149553`, mobile
 * `45510-177550` (inside the mobile hero storyboard frame `45487-112573`,
 * not the plain mobile page).
 *
 * The container matches the hero's own convention (`hero.tsx`): 1408 =
 * 1344 (the desktop card row: 411 + 24 gap + 909) + 2*32 (`px-8`), so at
 * desktop this container reproduces the Figma section's own left/right
 * edges exactly. This section IS personalized (both cards recolour via
 * `HueLayer` + `--wc-accent*`, per `OldWidgetCard`/`WebChatCard`); it must
 * render inside `WebChatBrandProvider` for that and for the two cards'
 * `group-data-[wc-state]` glow toggle to resolve — the integration pass
 * mounts it there, not this file.
 */
export function CompareBento() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-[1408px] px-5 md:px-8">
        <div className="flex flex-col gap-7 md:flex-row md:items-start md:justify-between md:gap-16">
          <h2 className="text-[32px] leading-[1.25] tracking-[-0.04em] text-white md:max-w-[564px] md:text-[48px] md:leading-[1.04em]">
            {COMPARE_HEADING}
          </h2>
          <p className="text-[16px] leading-[1.5] tracking-[-0.025em] text-white/80 md:max-w-[604px] md:pt-2 md:text-[18px] md:text-[#A3A6B2]">
            {COMPARE_DESCRIPTION}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-10 md:mt-14 md:flex-row md:items-center md:gap-6">
          <OldWidgetCard />
          <WebChatCard />
        </div>
      </div>
    </section>
  )
}

export default CompareBento
