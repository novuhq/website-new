import {
  PRODUCT_BENTO_CARDS,
  PRODUCT_BENTO_DESCRIPTION,
  PRODUCT_BENTO_HEADING,
} from "@/data/pages/web-chat-product-bento"
import productBentoActions from "@/images/pages/channels/web-chat/product-bento-actions.jpg"
import productBentoActivityMobile from "@/images/pages/channels/web-chat/product-bento-activity-mobile.jpg"
import productBentoActivity from "@/images/pages/channels/web-chat/product-bento-activity.jpg"
import productBentoOrder from "@/images/pages/channels/web-chat/product-bento-order.jpg"
import productBentoRender from "@/images/pages/channels/web-chat/product-bento-render.jpg"
import productBentoSubscriberMobile from "@/images/pages/channels/web-chat/product-bento-subscriber-mobile.jpg"
import productBentoSubscriber from "@/images/pages/channels/web-chat/product-bento-subscriber.jpg"

import { ProductBentoCard } from "@/components/pages/channels/web-chat/product-bento-card"

const ROW_ONE_SIZES =
  "(min-width: 1344px) 628px, (min-width: 1024px) 47vw, (min-width: 768px) 704px, 92vw"
const ROW_TWO_SIZES =
  "(min-width: 1344px) 411px, (min-width: 1024px) 31vw, (min-width: 768px) 704px, 92vw"

const [subscriberCopy, activityCopy, orderCopy, actionsCopy, renderCopy] =
  PRODUCT_BENTO_CARDS
const [headingIntro, headingConclusion] = PRODUCT_BENTO_HEADING.split(". ")

/**
 * Original default artwork plus independently personalized background and UI
 * layers from 45839:21901. The first two cards retain the mobile compositions
 * from 45789:25089 above captions in normal flow.
 */
export function ProductBento() {
  return (
    <section>
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-336">
        <div className="flex flex-col gap-6 md:min-h-37.5 lg:min-h-21 lg:flex-row lg:items-start lg:justify-between lg:gap-13 xl:min-h-0 xl:gap-9">
          <h2 className="max-w-[480px] text-[32px] leading-[1.25] tracking-[-0.04em] text-white md:max-w-112 md:text-4xl md:leading-[1.04] lg:w-[492px] lg:max-w-[492px] lg:shrink-0 lg:text-[40px] xl:w-160 xl:max-w-160 xl:shrink-0 xl:text-[48px]">
            {headingIntro}.<br className="hidden lg:block" />{" "}
            {headingConclusion}
          </h2>
          <p className="max-w-[480px] text-base leading-[1.5] tracking-[-0.025em] text-white/80 md:max-w-112 md:text-gray-70 lg:max-w-104 lg:pt-9 xl:max-w-151 xl:pt-11.25 xl:text-lg">
            {PRODUCT_BENTO_DESCRIPTION}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-5 md:mt-10 lg:mt-12 lg:gap-6 xl:-mx-8 xl:mt-14">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
            <ProductBentoCard
              id="subscriber"
              aspectRatio="660/496"
              mobileArtworkAspectRatio="320/302"
              illustration={productBentoSubscriber}
              mobileIllustration={productBentoSubscriberMobile}
              sizes={ROW_ONE_SIZES}
              title={subscriberCopy.title}
              body={subscriberCopy.body}
            />

            <ProductBentoCard
              id="activity"
              aspectRatio="660/496"
              mobileArtworkAspectRatio="320/323"
              illustration={productBentoActivity}
              mobileIllustration={productBentoActivityMobile}
              sizes={ROW_ONE_SIZES}
              title={activityCopy.title}
              body={activityCopy.body}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <ProductBentoCard
              id="order"
              aspectRatio="432/496"
              illustration={productBentoOrder}
              sizes={ROW_TWO_SIZES}
              title={orderCopy.title}
              body={orderCopy.body}
            />

            <ProductBentoCard
              id="actions"
              aspectRatio="432/496"
              illustration={productBentoActions}
              sizes={ROW_TWO_SIZES}
              title={actionsCopy.title}
              body={actionsCopy.body}
            />

            <ProductBentoCard
              id="render"
              aspectRatio="432/496"
              illustration={productBentoRender}
              sizes={ROW_TWO_SIZES}
              title={renderCopy.title}
              body={renderCopy.body}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
