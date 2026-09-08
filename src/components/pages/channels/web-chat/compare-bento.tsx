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
 * The container uses `max-w-[1344px]` (final-review Fix 3: normalised to
 * match §4/§6's canonical content width so every section's heading shares
 * one left edge — this section previously used a bespoke 1408 tuned to fit
 * the card row's literal pixel widths exactly). At the new 1280px content
 * width the two fixed-width cards (`411px` + `24px` gap + `909px` = 1344)
 * no longer fit without shrinking; there is no `shrink-0` on either card, so
 * the flex row's default `flex-shrink: 1` narrows both proportionally
 * (~391px / ~865px) rather than overflowing — verified in-browser. Their
 * `object-cover` illustrations crop very slightly tighter as a result; all
 * percentage-based overlays (`IllustrationBubble`, `SelectedRow`) track the
 * shrunk box exactly since they're sized in box-relative percentages, and
 * the fixed-px caption overlays (`w-[355px]`/`w-[555px]` at `left-7`) keep
 * comfortable clearance from the new right edges. This section IS
 * personalized (both cards recolour via
 * `HueLayer` + `--wc-accent*`, per `OldWidgetCard`/`WebChatCard`); it must
 * render inside `WebChatBrandProvider` for that and for the two cards'
 * `group-data-[wc-state]` glow toggle to resolve — the integration pass
 * mounts it there, not this file.
 */
export function CompareBento() {
  return (
    <section>
      <div className="container mx-auto max-w-[1344px] px-5 md:px-8">
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
