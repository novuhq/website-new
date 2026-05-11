import type { IntegrationTabType } from "@/types/integration"

export interface IChannelCategoryTaxonomy {
  slug: string
  title: string
  description: string
  order: number
  tab: IntegrationTabType
  defaultBadge: string
}

export const CHANNEL_CATEGORY_TAXONOMY: IChannelCategoryTaxonomy[] = [
  {
    slug: "in-app",
    title: "In-app",
    description:
      "Power your in-app notification center with Novu's built-in Inbox component.",
    order: 0,
    tab: "channels",
    defaultBadge: "In-app",
  },
  {
    slug: "email",
    title: "Email",
    description:
      "Send transactional and marketing emails through your preferred provider.",
    order: 1,
    tab: "channels",
    defaultBadge: "Email",
  },
  {
    slug: "sms",
    title: "SMS",
    description:
      "Deliver text messages and OTP codes globally via SMS providers.",
    order: 2,
    tab: "channels",
    defaultBadge: "SMS",
  },
  {
    slug: "push",
    title: "Push",
    description:
      "Send push notifications to mobile and web apps through supported push services.",
    order: 3,
    tab: "channels",
    defaultBadge: "Push",
  },

  {
    slug: "chat",
    title: "Chat",
    description:
      "Send notifications to chat and messaging platforms through Novu.",
    order: 4,
    tab: "channels",
    defaultBadge: "Chat",
  },
]
