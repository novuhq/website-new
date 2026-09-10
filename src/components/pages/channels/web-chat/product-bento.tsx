import {
  PRODUCT_BENTO_CARDS,
  PRODUCT_BENTO_DESCRIPTION,
  PRODUCT_BENTO_HEADING,
} from "@/data/pages/web-chat-product-bento"
import productBentoActions from "@/images/pages/channels/web-chat/product-bento-actions.jpg"
import productBentoActivity from "@/images/pages/channels/web-chat/product-bento-activity.jpg"
import productBentoOrder from "@/images/pages/channels/web-chat/product-bento-order.jpg"
import productBentoRender from "@/images/pages/channels/web-chat/product-bento-render.jpg"
import productBentoSubscriber from "@/images/pages/channels/web-chat/product-bento-subscriber.jpg"

import { ProductBentoCard } from "@/components/pages/channels/web-chat/product-bento-card"

const ROW_ONE_SIZES =
  "(min-width: 1344px) 628px, (min-width: 1024px) 47vw, (min-width: 768px) 704px, 92vw"
const ROW_TWO_SIZES =
  "(min-width: 1344px) 411px, (min-width: 1024px) 31vw, (min-width: 768px) 704px, 92vw"

const [subscriberCopy, activityCopy, orderCopy, actionsCopy, renderCopy] =
  PRODUCT_BENTO_CARDS

/**
 * Five static Figma illustrations, exported at 2× from section 45487:79958.
 * The artwork includes its own chat bubbles and action controls; captions
 * remain live text. The two wide cards stack cropped artwork above their captions on mobile.
 */
export function ProductBento() {
  return (
    <section>
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-336">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <h2 className="max-w-[480px] text-[32px] leading-[1.25] tracking-[-0.04em] text-white md:max-w-[560px] md:text-[48px] md:leading-[1.04]">
            {PRODUCT_BENTO_HEADING}
          </h2>
          <p className="max-w-[480px] text-base leading-[1.5] tracking-[-0.025em] text-white/80 md:text-lg md:text-[#A3A6B2] lg:max-w-[420px] lg:pt-3">
            {PRODUCT_BENTO_DESCRIPTION}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-5 md:mt-14 md:gap-6">
          <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-2">
            <ProductBentoCard
              aspectRatio="660/496"
              mobileArtworkAspectRatio="660/360"
              illustration={productBentoSubscriber}
              sizes={ROW_ONE_SIZES}
              title={subscriberCopy.title}
              body={subscriberCopy.body}
            />

            <ProductBentoCard
              aspectRatio="660/496"
              mobileArtworkAspectRatio="660/360"
              illustration={productBentoActivity}
              sizes={ROW_ONE_SIZES}
              title={activityCopy.title}
              body={activityCopy.body}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-3">
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
            />

            <ProductBentoCard
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
