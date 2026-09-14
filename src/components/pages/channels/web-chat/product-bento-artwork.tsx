"use client"

import type { ProductBentoCardCopy } from "@/data/pages/web-chat-product-bento"
import actionsLaptopBase from "@/images/pages/channels/web-chat/bento-layers/actions-laptop-base.jpg"
import actionsLaptopUI from "@/images/pages/channels/web-chat/bento-layers/actions-laptop.inline.svg"
import actionsTabletBase from "@/images/pages/channels/web-chat/bento-layers/actions-tablet-base.jpg"
import actionsTabletUI from "@/images/pages/channels/web-chat/bento-layers/actions-tablet.inline.svg"
import ActionsUI from "@/images/pages/channels/web-chat/bento-layers/actions.inline.svg"
import actionsBackground from "@/images/pages/channels/web-chat/bento-layers/actions.jpg"
import activityLaptopBase from "@/images/pages/channels/web-chat/bento-layers/activity-laptop-base.jpg"
import activityLaptopUI from "@/images/pages/channels/web-chat/bento-layers/activity-laptop.inline.svg"
import ActivityMobileUI from "@/images/pages/channels/web-chat/bento-layers/activity-mobile.inline.svg"
import activityMobileBackground from "@/images/pages/channels/web-chat/bento-layers/activity-mobile.jpg"
import activityTabletBase from "@/images/pages/channels/web-chat/bento-layers/activity-tablet-base.jpg"
import activityTabletUI from "@/images/pages/channels/web-chat/bento-layers/activity-tablet.inline.svg"
import ActivityUI from "@/images/pages/channels/web-chat/bento-layers/activity.inline.svg"
import activityBackground from "@/images/pages/channels/web-chat/bento-layers/activity.jpg"
import orderLaptopBase from "@/images/pages/channels/web-chat/bento-layers/order-laptop-base.jpg"
import orderLaptopUI from "@/images/pages/channels/web-chat/bento-layers/order-laptop.inline.svg"
import orderTabletBase from "@/images/pages/channels/web-chat/bento-layers/order-tablet-base.jpg"
import orderTabletUI from "@/images/pages/channels/web-chat/bento-layers/order-tablet.inline.svg"
import OrderUI from "@/images/pages/channels/web-chat/bento-layers/order.inline.svg"
import orderBackground from "@/images/pages/channels/web-chat/bento-layers/order.jpg"
import renderLaptopBase from "@/images/pages/channels/web-chat/bento-layers/render-laptop-base.jpg"
import renderLaptopUI from "@/images/pages/channels/web-chat/bento-layers/render-laptop.inline.svg"
import renderTabletBase from "@/images/pages/channels/web-chat/bento-layers/render-tablet-base.jpg"
import renderTabletUI from "@/images/pages/channels/web-chat/bento-layers/render-tablet.inline.svg"
import RenderUI from "@/images/pages/channels/web-chat/bento-layers/render.inline.svg"
import renderBackground from "@/images/pages/channels/web-chat/bento-layers/render.jpg"
import subscriberLaptopBase from "@/images/pages/channels/web-chat/bento-layers/subscriber-laptop-base.jpg"
import subscriberLaptopUI from "@/images/pages/channels/web-chat/bento-layers/subscriber-laptop.inline.svg"
import SubscriberMobileUI from "@/images/pages/channels/web-chat/bento-layers/subscriber-mobile.inline.svg"
import subscriberMobileBackground from "@/images/pages/channels/web-chat/bento-layers/subscriber-mobile.jpg"
import subscriberTabletBase from "@/images/pages/channels/web-chat/bento-layers/subscriber-tablet-base.jpg"
import subscriberTabletUI from "@/images/pages/channels/web-chat/bento-layers/subscriber-tablet.inline.svg"
import SubscriberUI from "@/images/pages/channels/web-chat/bento-layers/subscriber.inline.svg"
import subscriberBackground from "@/images/pages/channels/web-chat/bento-layers/subscriber.jpg"

import { cn } from "@/lib/utils"
import { BrandArtwork } from "@/components/pages/channels/web-chat/brand-artwork"

const ARTWORK = {
  subscriber: {
    background: subscriberBackground,
    UI: SubscriberUI,
    mobileBackground: subscriberMobileBackground,
    MobileUI: SubscriberMobileUI,
  },
  activity: {
    background: activityBackground,
    UI: ActivityUI,
    mobileBackground: activityMobileBackground,
    MobileUI: ActivityMobileUI,
  },
  order: { background: orderBackground, UI: OrderUI },
  actions: { background: actionsBackground, UI: ActionsUI },
  render: { background: renderBackground, UI: RenderUI },
}

const PRODUCT_TABLET_ARTWORK = {
  subscriber: [
    {
      id: "subscriber-tablet",
      background: subscriberTabletBase,
      UI: subscriberTabletUI,
      className: "md:block lg:hidden",
    },
    {
      id: "subscriber-laptop",
      background: subscriberLaptopBase,
      UI: subscriberLaptopUI,
      className: "lg:block xl:hidden",
    },
  ],
  activity: [
    {
      id: "activity-tablet",
      background: activityTabletBase,
      UI: activityTabletUI,
      className: "md:block lg:hidden",
    },
    {
      id: "activity-laptop",
      background: activityLaptopBase,
      UI: activityLaptopUI,
      className: "lg:block xl:hidden",
    },
  ],
  order: [
    {
      id: "order-tablet",
      background: orderTabletBase,
      UI: orderTabletUI,
      className: "md:block lg:hidden",
    },
    {
      id: "order-laptop",
      background: orderLaptopBase,
      UI: orderLaptopUI,
      className: "lg:block xl:hidden",
    },
  ],
  actions: [
    {
      id: "actions-tablet",
      background: actionsTabletBase,
      UI: actionsTabletUI,
      className: "md:block lg:hidden",
    },
    {
      id: "actions-laptop",
      background: actionsLaptopBase,
      UI: actionsLaptopUI,
      className: "lg:block xl:hidden",
    },
  ],
  render: [
    {
      id: "render-tablet",
      background: renderTabletBase,
      UI: renderTabletUI,
      className: "md:block lg:hidden",
    },
    {
      id: "render-laptop",
      background: renderLaptopBase,
      UI: renderLaptopUI,
      className: "lg:block xl:hidden",
    },
  ],
} as const

export function ProductBentoArtwork({
  id,
  sizes,
}: {
  id: ProductBentoCardCopy["id"]
  sizes: string
}) {
  return (
    <>
      <div className="contents md:hidden xl:contents">
        <BrandArtwork id={id} sizes={sizes} {...ARTWORK[id]} />
      </div>
      {PRODUCT_TABLET_ARTWORK[id].map(
        ({ id: variantId, background, UI, className }) => (
          <div
            key={variantId}
            className={cn("absolute inset-0 hidden", className)}
          >
            <BrandArtwork
              id={variantId}
              sizes={sizes}
              background={background}
              UI={UI}
              cover
            />
          </div>
        )
      )}
    </>
  )
}
