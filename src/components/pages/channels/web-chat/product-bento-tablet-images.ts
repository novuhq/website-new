import actionsLaptopDefault from "@/images/pages/channels/web-chat/bento-layers/actions-laptop-full.jpg"
import actionsTabletDefault from "@/images/pages/channels/web-chat/bento-layers/actions-tablet-full.jpg"
import activityLaptopDefault from "@/images/pages/channels/web-chat/bento-layers/activity-laptop-full.jpg"
import activityTabletDefault from "@/images/pages/channels/web-chat/bento-layers/activity-tablet-full.jpg"
import orderLaptopDefault from "@/images/pages/channels/web-chat/bento-layers/order-laptop-full.jpg"
import orderTabletDefault from "@/images/pages/channels/web-chat/bento-layers/order-tablet-full.jpg"
import renderLaptopDefault from "@/images/pages/channels/web-chat/bento-layers/render-laptop-full.jpg"
import renderTabletDefault from "@/images/pages/channels/web-chat/bento-layers/render-tablet-full.jpg"
import subscriberLaptopDefault from "@/images/pages/channels/web-chat/bento-layers/subscriber-laptop-full.jpg"
import subscriberTabletDefault from "@/images/pages/channels/web-chat/bento-layers/subscriber-tablet-full.jpg"

export const PRODUCT_TABLET_IMAGES = {
  subscriber: [
    {
      id: "subscriber-tablet",
      image: subscriberTabletDefault,
      media: "(min-width: 768px) and (max-width: 1023px)",
    },
    {
      id: "subscriber-laptop",
      image: subscriberLaptopDefault,
      media: "(min-width: 1024px) and (max-width: 1279px)",
    },
  ],
  activity: [
    {
      id: "activity-tablet",
      image: activityTabletDefault,
      media: "(min-width: 768px) and (max-width: 1023px)",
    },
    {
      id: "activity-laptop",
      image: activityLaptopDefault,
      media: "(min-width: 1024px) and (max-width: 1279px)",
    },
  ],
  order: [
    {
      id: "order-tablet",
      image: orderTabletDefault,
      media: "(min-width: 768px) and (max-width: 1023px)",
    },
    {
      id: "order-laptop",
      image: orderLaptopDefault,
      media: "(min-width: 1024px) and (max-width: 1279px)",
    },
  ],
  actions: [
    {
      id: "actions-tablet",
      image: actionsTabletDefault,
      media: "(min-width: 768px) and (max-width: 1023px)",
    },
    {
      id: "actions-laptop",
      image: actionsLaptopDefault,
      media: "(min-width: 1024px) and (max-width: 1279px)",
    },
  ],
  render: [
    {
      id: "render-tablet",
      image: renderTabletDefault,
      media: "(min-width: 768px) and (max-width: 1023px)",
    },
    {
      id: "render-laptop",
      image: renderLaptopDefault,
      media: "(min-width: 1024px) and (max-width: 1279px)",
    },
  ],
} as const
