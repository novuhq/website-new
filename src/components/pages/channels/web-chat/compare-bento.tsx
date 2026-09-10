import {
  COMPARE_DESCRIPTION,
  COMPARE_HEADING,
} from "@/data/pages/web-chat-compare"

import { OldWidgetCard } from "@/components/pages/channels/web-chat/compare-card-old-widget"
import { WebChatCard } from "@/components/pages/channels/web-chat/compare-card-web-chat"

/**
 * Comparison section: desktop 45487:79779, default mobile 45496:139032.
 * Purple mobile artwork comes from the default design, not its orange
 * personalized storyboard. Both cards still recolor through HueLayer inside
 * WebChatBrandProvider. The wide row starts at xl; narrower screens stack.
 */
export function CompareBento() {
  return (
    <section>
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-336">
        <div className="flex flex-col gap-5 md:gap-7 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <h2 className="text-[32px] leading-[1.25] tracking-[-0.04em] text-white md:max-w-[564px] md:text-[48px] md:leading-[1.04em]">
            {COMPARE_HEADING}
          </h2>
          <p className="text-[16px] leading-[1.5] tracking-[-0.025em] text-white/80 md:text-[18px] md:text-[#A3A6B2] lg:max-w-[604px] lg:pt-2 xl:pt-9.5">
            {COMPARE_DESCRIPTION}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-5 md:mt-14 md:gap-10 xl:-mx-8 xl:flex-row xl:items-center xl:gap-6">
          <OldWidgetCard />
          <WebChatCard />
        </div>
      </div>
    </section>
  )
}

export default CompareBento
