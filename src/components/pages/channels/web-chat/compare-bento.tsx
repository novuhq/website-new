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
 * WebChatBrandProvider. Equal columns begin at lg; tablets stack the two landscape cards.
 */
export function CompareBento() {
  return (
    <section>
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-336">
        <div className="flex flex-col gap-5 md:min-h-43.5 md:gap-6 lg:min-h-21 lg:flex-row lg:items-start lg:justify-between lg:gap-13 xl:min-h-0">
          <h2 className="text-[32px] leading-[1.25] tracking-[-0.04em] text-white md:max-w-[417px] md:text-4xl md:leading-[1.04em] lg:max-w-[492px] lg:text-[40px] xl:max-w-[564px] xl:text-[48px]">
            {COMPARE_HEADING}
          </h2>
          <p className="text-[16px] leading-[1.5] tracking-[-0.025em] text-white/80 md:max-w-[417px] md:text-gray-70 lg:max-w-104 lg:pt-3 xl:max-w-[604px] xl:pt-9.5 xl:text-[18px]">
            {COMPARE_DESCRIPTION}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-5 md:mt-10 lg:mt-12 lg:flex-row lg:items-center lg:gap-6 xl:-mx-8 xl:mt-14">
          <OldWidgetCard />
          <WebChatCard />
        </div>
      </div>
    </section>
  )
}

export default CompareBento
