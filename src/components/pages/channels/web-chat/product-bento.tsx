import {
  PRODUCT_BENTO_BUBBLE_ACTIVITY,
  PRODUCT_BENTO_BUBBLE_SUBSCRIBER,
  PRODUCT_BENTO_CARDS,
  PRODUCT_BENTO_DESCRIPTION,
  PRODUCT_BENTO_HEADING,
} from "@/data/pages/web-chat-product-bento"
import productBentoActions from "@/images/pages/channels/web-chat/product-bento-actions.webp"
import productBentoActivity from "@/images/pages/channels/web-chat/product-bento-activity.webp"
import productBentoOrder from "@/images/pages/channels/web-chat/product-bento-order.webp"
import productBentoRender from "@/images/pages/channels/web-chat/product-bento-render.webp"
import productBentoSubscriber from "@/images/pages/channels/web-chat/product-bento-subscriber.webp"

import {
  ActionsStepBullet,
  AgentActionsConfirmPanel,
  MessageBubble,
  ViewOrderButton,
} from "@/components/pages/channels/web-chat/product-bento-accents"
import { ProductBentoCard } from "@/components/pages/channels/web-chat/product-bento-card"

const ROW_ONE_SIZES = "(min-width: 1408px) 660px, (min-width: 768px) 47vw, 92vw"
const ROW_TWO_SIZES = "(min-width: 1408px) 432px, (min-width: 768px) 31vw, 92vw"

const [subscriberCopy, activityCopy, orderCopy, actionsCopy, renderCopy] =
  PRODUCT_BENTO_CARDS

/**
 * §3 "Not a chat box on your site. An agent inside your app" (Task 10): a
 * five-card bento, two cards on row one and three on row two, matching
 * Figma's `section` node (`45487-79958`) `bento` group exactly — desktop
 * cards are 660×496 (row one) and 432×496 (row two) with a 24px gap both
 * ways, which a `grid-cols-2`/`grid-cols-3` `gap-6` pair reproduces exactly
 * at the section's 1344px content width (`(1344 - 24) / 2 = 660`,
 * `(1344 - 48) / 3 = 432`).
 *
 * This section is personalized (all five cards recolour) — see
 * `ProductBentoCard` for the `HueLayer` illustration recolour and
 * `product-bento-accents.tsx` for the discrete accent elements rebuilt as
 * real DOM on top of each illustration.
 *
 * Mobile: Figma's mobile page (`45487-98982`) has no authored frame for this
 * section — it jumps directly from §2 "compare bento" (`45496-139032`,
 * ends ~y2400) to the "Full screen tab" section (`45497-139684`, y3810),
 * confirmed via three separate fetches (page depth 1, depth 2, and the
 * canvas root) — see the task report. Each card keeps its own desktop aspect
 * ratio (`660/496` or `432/496`) at full width instead, which is exact at
 * the real 1344px desktop content width and a reasoned, flagged
 * extrapolation everywhere narrower — not a guess at unrelated numbers.
 */
export function ProductBento() {
  return (
    <section className="mt-24 md:mt-32">
      <div className="container mx-auto max-w-[1408px] px-5 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
          <h2 className="max-w-[480px] text-[32px] leading-[1.25] tracking-[-0.04em] text-white md:max-w-[560px] md:text-[48px] md:leading-[1.04]">
            {PRODUCT_BENTO_HEADING}
          </h2>
          <p className="max-w-[480px] text-base leading-[1.5] tracking-[-0.025em] text-white/80 md:max-w-[420px] md:pt-3 md:text-lg md:text-[#A3A6B2]">
            {PRODUCT_BENTO_DESCRIPTION}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-5 md:mt-14 md:gap-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <ProductBentoCard
              aspectRatio="660/496"
              mobileAspectRatio="360/496"
              illustration={productBentoSubscriber}
              sizes={ROW_ONE_SIZES}
              title={subscriberCopy.title}
              body={subscriberCopy.body}
            >
              <MessageBubble
                text={PRODUCT_BENTO_BUBBLE_SUBSCRIBER}
                leftPct={6.67}
                topPct={9.68}
                widthPct={45}
              />
            </ProductBentoCard>

            <ProductBentoCard
              aspectRatio="660/496"
              mobileAspectRatio="360/496"
              illustration={productBentoActivity}
              sizes={ROW_ONE_SIZES}
              title={activityCopy.title}
              body={activityCopy.body}
            >
              <MessageBubble
                text={PRODUCT_BENTO_BUBBLE_ACTIVITY}
                leftPct={40.45}
                topPct={34.48}
                widthPct={43.79}
              />
            </ProductBentoCard>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            <ProductBentoCard
              aspectRatio="432/496"
              illustration={productBentoOrder}
              sizes={ROW_TWO_SIZES}
              title={orderCopy.title}
              body={orderCopy.body}
            />

            <ProductBentoCard
              aspectRatio="432/496"
              illustration={productBentoActions}
              sizes={ROW_TWO_SIZES}
              title={actionsCopy.title}
              body={actionsCopy.body}
            >
              <ActionsStepBullet />
              <AgentActionsConfirmPanel />
            </ProductBentoCard>

            <ProductBentoCard
              aspectRatio="432/496"
              illustration={productBentoRender}
              sizes={ROW_TWO_SIZES}
              title={renderCopy.title}
              body={renderCopy.body}
            >
              <ViewOrderButton />
            </ProductBentoCard>
          </div>
        </div>
      </div>
    </section>
  )
}
