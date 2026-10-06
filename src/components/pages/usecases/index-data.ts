import type { IndexCtaData, IndexGoal, IndexPictureSectionData } from "./types"

export const INDEX_HERO = {
  id: "hero",
  title: "Elevate Engagement with Robust Notifications",
  description:
    "Deliver personalized, multi-channel notifications with ease using Novu’s unified platform—empowering teams to create seamless communication experiences that drive user satisfaction and retention.",
  imageSide: "right",
  action: {
    label: "Learn more",
    href: "https://docs.novu.co",
  },
  image: {
    src: "/images/pages/usecases/index/hero/illustration.jpg",
    alt: "Placeholder image",
    width: 1216,
    height: 791,
  },
} satisfies IndexPictureSectionData

export const INDEX_GOALS = {
  title: "What do you want to achieve?",
  description:
    "Define your goals and explore tailored solutions to help you reach them effectively.",
  cards: [
    {
      title: "Accelerate development",
      description:
        "Novu includes everything you need to deploy rich notifications and sophisticated workflows with any channel.",
      action: {
        label: "Learn more",
        href: "https://docs.novu.co/platform/quickstart/nextjs?utm_campaign=ws_usecases",
      },
    },
    {
      title: "Improve collaboration",
      description:
        "Reduce friction between development and product teams. Eliminate common development interrupts required for simple operations like content updates.",
      action: {
        label: "Learn more",
        href: "https://docs.novu.co/framework/controls?utm_campaign=ws_usecases",
      },
    },
    {
      title: "Enhance engagement",
      description:
        "Timely, personalized, and relevant notifications across preferred channels leads to higher user engagement and satisfaction.",
      action: {
        label: "Learn more",
        href: "https://novu.co/blog/digest-notifications-best-practices-example/?utm_campaign=ws-usecases",
      },
    },
  ] satisfies readonly IndexGoal[],
}

export const INDEX_ECHO_CTA = {
  title: "Get started now",
  description:
    "Create complex workflows, access local data, and reuse existing content templates with Novu Echo.",
  primaryAction: {
    label: "Try Novu",
    href: "https://dashboard.novu.co/auth/sign-up?utm_campaign=ws_usecases",
  },
  secondaryAction: {
    label: "Contact us",
    href: "https://novu.co/contact-us/?utm_campaign=ws_usecases",
  },
} satisfies IndexCtaData

export const INDEX_PICTURE_SECTIONS = [
  {
    id: "multi-channel",
    title: "Multi-channel notifications",
    description:
      "Expand your reach by adding more channels ensuring users receive critical information on time, and through their preferred channel.",
    imageSide: "right",
    action: {
      label: "Check out Channels",
      href: "https://docs.novu.co/workflow/channel-steps#available-channels",
    },
    image: {
      src: "/images/pages/usecases/index/multi-channel/illustration.jpg",
      alt: "Placeholder image",
      width: 1354,
      height: 1205,
    },
  },
  {
    id: "application",
    title: "Add notifications to your application",
    description:
      "Notifications are the best way to keep your users and customers informed through relevant, timely updates, and adding them to your app or website is easier than you think.",
    imageSide: "left",
    action: {
      label: "In-App Overview",
      href: "https://docs.novu.co/inbox/overview",
    },
    image: {
      src: "/images/pages/usecases/index/application/illustration.png",
      alt: "Add notifications to your application",
      width: 1106,
      height: 1007,
    },
  },
  {
    id: "management",
    title: "Unified notification management",
    description:
      "Reduce your app’s complexity by designing, managing, and triggering notifications from a central platform instead of multiple different tools.",
    imageSide: "right",
    action: {
      label: "Learn more",
      href: "https://docs.novu.co/concepts/notifications?utm_campaign=ws_usecases",
    },
    image: {
      src: "/images/pages/usecases/index/management/illustration.jpg",
      alt: "Unified notification management",
      width: 919,
      height: 915,
    },
  },
  {
    id: "content",
    title: "Centrally manage notification content",
    description:
      "Eliminate the content dance between development and product teams. Developers now empower product teams to safely interact with all of your notifications content, no interrupts needed.",
    imageSide: "left",
    action: {
      label: "Learn more",
      href: "https://docs.novu.co/platform/workflow/add-notification-content/channels-template-editors?utm_campaign=ws_usecases",
    },
    image: {
      src: "/images/pages/usecases/index/content/illustration.png",
      alt: "Notification content",
      width: 1343,
      height: 1054,
    },
  },
] satisfies readonly IndexPictureSectionData[]

export const INDEX_REQUIREMENTS_CTA = {
  title: "We’re ready for your requirements...",
  description:
    "Whatever your use case, Novu is ready. Start for free, no credit card required.",
  primaryAction: {
    label: "Try Novu",
    href: "https://dashboard.novu.co/auth/sign-up?utm_campaign=ws_usecases",
  },
  secondaryAction: {
    label: "Contact us",
    href: "https://novu.co/contact-us/?utm_campaign=ws_usecases",
  },
} satisfies IndexCtaData
