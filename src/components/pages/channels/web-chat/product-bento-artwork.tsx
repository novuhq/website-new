"use client"

import dynamic from "next/dynamic"
import type { ProductBentoCardCopy } from "@/data/pages/web-chat-product-bento"
import actionsLaptopBase from "@/images/pages/channels/web-chat/bento-layers/actions-laptop-base.jpg"
import actionsTabletBase from "@/images/pages/channels/web-chat/bento-layers/actions-tablet-base.jpg"
import actionsBackground from "@/images/pages/channels/web-chat/bento-layers/actions.jpg"
import activityLaptopBase from "@/images/pages/channels/web-chat/bento-layers/activity-laptop-base.jpg"
import activityMobileBackground from "@/images/pages/channels/web-chat/bento-layers/activity-mobile.jpg"
import activityTabletBase from "@/images/pages/channels/web-chat/bento-layers/activity-tablet-base.jpg"
import activityBackground from "@/images/pages/channels/web-chat/bento-layers/activity.jpg"
import orderLaptopBase from "@/images/pages/channels/web-chat/bento-layers/order-laptop-base.jpg"
import orderTabletBase from "@/images/pages/channels/web-chat/bento-layers/order-tablet-base.jpg"
import orderBackground from "@/images/pages/channels/web-chat/bento-layers/order.jpg"
import renderLaptopBase from "@/images/pages/channels/web-chat/bento-layers/render-laptop-base.jpg"
import renderTabletBase from "@/images/pages/channels/web-chat/bento-layers/render-tablet-base.jpg"
import renderBackground from "@/images/pages/channels/web-chat/bento-layers/render.jpg"
import subscriberLaptopBase from "@/images/pages/channels/web-chat/bento-layers/subscriber-laptop-base.jpg"
import subscriberMobileBackground from "@/images/pages/channels/web-chat/bento-layers/subscriber-mobile.jpg"
import subscriberTabletBase from "@/images/pages/channels/web-chat/bento-layers/subscriber-tablet-base.jpg"
import subscriberBackground from "@/images/pages/channels/web-chat/bento-layers/subscriber.jpg"

import { cn } from "@/lib/utils"
import { BrandArtwork } from "@/components/pages/channels/web-chat/brand-artwork"

// The editable UI layers render only once a visitor personalizes, so load
// them on demand instead of shipping ~190 KB of SVG in the page bundle.
const actionsLaptopUI = dynamic(
  () =>
    import(
      "@/images/pages/channels/web-chat/bento-layers/actions-laptop.inline.svg"
    ),
  { ssr: false }
)
const actionsTabletUI = dynamic(
  () =>
    import(
      "@/images/pages/channels/web-chat/bento-layers/actions-tablet.inline.svg"
    ),
  { ssr: false }
)
const ActionsUI = dynamic(
  () =>
    import("@/images/pages/channels/web-chat/bento-layers/actions.inline.svg"),
  { ssr: false }
)
const activityLaptopUI = dynamic(
  () =>
    import(
      "@/images/pages/channels/web-chat/bento-layers/activity-laptop.inline.svg"
    ),
  { ssr: false }
)
const ActivityMobileUI = dynamic(
  () =>
    import(
      "@/images/pages/channels/web-chat/bento-layers/activity-mobile.inline.svg"
    ),
  { ssr: false }
)
const activityTabletUI = dynamic(
  () =>
    import(
      "@/images/pages/channels/web-chat/bento-layers/activity-tablet.inline.svg"
    ),
  { ssr: false }
)
const ActivityUI = dynamic(
  () =>
    import("@/images/pages/channels/web-chat/bento-layers/activity.inline.svg"),
  { ssr: false }
)
const orderLaptopUI = dynamic(
  () =>
    import(
      "@/images/pages/channels/web-chat/bento-layers/order-laptop.inline.svg"
    ),
  { ssr: false }
)
const orderTabletUI = dynamic(
  () =>
    import(
      "@/images/pages/channels/web-chat/bento-layers/order-tablet.inline.svg"
    ),
  { ssr: false }
)
const OrderUI = dynamic(
  () =>
    import("@/images/pages/channels/web-chat/bento-layers/order.inline.svg"),
  { ssr: false }
)
const renderLaptopUI = dynamic(
  () =>
    import(
      "@/images/pages/channels/web-chat/bento-layers/render-laptop.inline.svg"
    ),
  { ssr: false }
)
const renderTabletUI = dynamic(
  () =>
    import(
      "@/images/pages/channels/web-chat/bento-layers/render-tablet.inline.svg"
    ),
  { ssr: false }
)
const RenderUI = dynamic(
  () =>
    import("@/images/pages/channels/web-chat/bento-layers/render.inline.svg"),
  { ssr: false }
)
const subscriberLaptopUI = dynamic(
  () =>
    import(
      "@/images/pages/channels/web-chat/bento-layers/subscriber-laptop.inline.svg"
    ),
  { ssr: false }
)
const SubscriberMobileUI = dynamic(
  () =>
    import(
      "@/images/pages/channels/web-chat/bento-layers/subscriber-mobile.inline.svg"
    ),
  { ssr: false }
)
const subscriberTabletUI = dynamic(
  () =>
    import(
      "@/images/pages/channels/web-chat/bento-layers/subscriber-tablet.inline.svg"
    ),
  { ssr: false }
)
const SubscriberUI = dynamic(
  () =>
    import(
      "@/images/pages/channels/web-chat/bento-layers/subscriber.inline.svg"
    ),
  { ssr: false }
)

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
      <BrandArtwork
        id={id}
        sizes={sizes}
        className="md:hidden xl:block"
        {...ARTWORK[id]}
      />
      {PRODUCT_TABLET_ARTWORK[id].map(
        ({ id: variantId, background, UI, className }) => (
          <BrandArtwork
            key={variantId}
            id={variantId}
            sizes={sizes}
            background={background}
            UI={UI}
            className={cn("hidden", className)}
            cover
          />
        )
      )}
    </>
  )
}
