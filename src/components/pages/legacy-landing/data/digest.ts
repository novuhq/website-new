import type { DualCtaData, IconGridData, PictureSectionData } from "../types"

const ASSET_ROOT = "/images/pages/digest"

export const digestHero = {
  title: "Digest notifications and stop over-notifying",
  description:
    "Consolidate multiple events into a single message, reducing notification overload while keeping users informed. Optimize workflows with custom grouping, time intervals, and strategies tailored to your communication needs.",
  image: {
    src: `${ASSET_ROOT}/notifications-workflow.jpg`,
    alt: "",
    width: 1198,
    height: 1195,
  },
} satisfies PictureSectionData

export const digestBatchNotifications = {
  title: "Everything you need to quickly batch notifications",
  action: {
    label: "Learn more",
    href: "https://docs.novu.co/workflow/digest",
  },
  items: [
    {
      icon: `${ASSET_ROOT}/consolidation.svg`,
      title: "Event consolidation",
      description: "Combine multiple events into a single notification.",
    },
    {
      icon: `${ASSET_ROOT}/customization.svg`,
      title: "Custom grouping",
      description: "Customize event grouping by type or frequency.",
    },
    {
      icon: `${ASSET_ROOT}/interval.svg`,
      title: "Interval scheduling",
      description: "Set specific times for digest delivery.",
    },
    {
      icon: `${ASSET_ROOT}/flexibility.svg`,
      title: "Flexible strategy",
      description: "Choose between time-based and event-based aggregation.",
    },
    {
      icon: `${ASSET_ROOT}/context.svg`,
      title: "Context preservation",
      description:
        "Ensure relevant context accompanies digested notifications.",
    },
    {
      icon: `${ASSET_ROOT}/settings.svg`,
      title: "User control",
      description: "Reduce fatigue while ensuring key updates reach users.",
    },
  ],
} satisfies IconGridData

export const digestStrategies = {
  title: "Multiple digest strategies that work",
  description:
    "Batch notifications in a set window, or look back to the last received notification and make a game time decision. It's all configurable for set-it and forget-it notification digests.",
  action: {
    label: "Learn more",
    hiddenLabel: "about multiple digest strategies",
    href: "https://docs.novu.co/workflow/digest",
  },
  image: {
    src: `${ASSET_ROOT}/strategies.jpg`,
    alt: "",
    width: 729,
    height: 521,
  },
} satisfies PictureSectionData

export const digestNotificationFatigue = {
  title: "Eliminate notification fatigue",
  description:
    "Novu makes it easy to insert digest steps into your notifications workflows, and delivers complete flexibility to adjust notification frequency and content.",
  action: {
    label: "Learn more",
    hiddenLabel: "how to eliminate notification fatigue",
    href: "https://docs.novu.co/workflow/digest",
  },
  image: {
    src: `${ASSET_ROOT}/fatigue.jpg`,
    alt: "",
    width: 902,
    height: 789,
  },
} satisfies PictureSectionData

export const digestUseCases = {
  title: "Digest use case examples",
  action: {
    label: "Create Your First workflow",
    href: "https://go.novu.co/dashboard",
  },
  items: [
    {
      icon: `${ASSET_ROOT}/digest.svg`,
      title: "Workflow digest",
      description: "Summary workflow for digesting multiple notifications",
    },
    {
      icon: `${ASSET_ROOT}/calendar.svg`,
      title: "Define digest step",
      description: "Add a simple timed digest step to your workflow.",
    },
    {
      icon: `${ASSET_ROOT}/selection.svg`,
      title: "Select a digest strategy",
      description:
        "Learn about the regular, look-back, and scheduled digest steps.",
    },
  ],
} satisfies IconGridData

export const digestCta = {
  title: "You're five minutes away from your first Novu-backed notification",
  description:
    "Create a free account, send your first notification, all before your coffee gets cold... no credit card required.",
  primary: {
    label: "Get started",
    href: "https://go.novu.co/dashboard",
  },
  secondary: {
    label: "Contact us",
    href: "https://novu.co/contact-us",
  },
} satisfies DualCtaData

export const digestCtaBackground = `${ASSET_ROOT}/cta-background.svg`
