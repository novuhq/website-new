import type {
  CodeSectionData,
  DualCtaData,
  IconGridData,
  ImageCardData,
} from "../types"

const ASSET_ROOT = "/images/pages/inbox"

export const inboxHero = {
  title: "Add In-App Notifications with the most customizable <Inbox/>",
  description:
    "Enable in-app notifications in your app or website with a pre-built and customizable components, available in popular frameworks.",
  action: {
    label: "See it live",
    href: "https://inbox.novu.co?utm_source=website_inbox_page",
  },
  image: {
    src: `${ASSET_ROOT}/dark-novu-inbox.png`,
    alt: "Novu Inbox component preview",
    width: 619,
    height: 648,
  },
} as const

export const inboxFeatures = {
  title: "The fastest way to create rich, customized application notifications",
  items: [
    {
      icon: `${ASSET_ROOT}/cube.svg`,
      title: "Versatile components",
      description:
        "<Inbox/>, <Bell/>, <Notification/>, and user <Preferences/> provide the ultimate experience.",
      link: {
        label: "Learn more",
        href: "https://docs.novu.co/inbox/react/components/overview",
        newTab: true,
      },
    },
    {
      icon: `${ASSET_ROOT}/change.svg`,
      title: "Built-in preferences",
      description: "Your app users access and set their Preferences with ease.",
      link: {
        label: "Learn more",
        href: "https://docs.novu.co/platform/sdks/react/hooks/use-preferences",
        newTab: true,
      },
    },
    {
      icon: `${ASSET_ROOT}/user.svg`,
      title: "Popular frameworks",
      description:
        "React, React-native, vanilla JavaScript, headless, and more.",
      link: {
        label: "Learn more",
        href: "https://docs.novu.co/inbox/overview",
        newTab: true,
      },
    },
    {
      icon: `${ASSET_ROOT}/preferences.svg`,
      title: "HMAC encryption",
      description:
        "Component to Novu service communication and user identifiers are fully secured.",
      link: {
        label: "Learn more",
        href: "https://docs.novu.co/platform/sdks/react",
        newTab: true,
      },
    },
    {
      icon: `${ASSET_ROOT}/guard.svg`,
      title: "Customizable",
      description:
        "Seamlessly match your existing brand, styling, and customer-specified language.",
      link: {
        label: "Learn more",
        href: "https://docs.novu.co/inbox/react/styling",
        newTab: true,
      },
    },
    {
      icon: `${ASSET_ROOT}/rhomb-grid.svg`,
      title: "Unified",
      description:
        "Add channels like email, SMS, and WhatsApp, mirroring Inbox across touchpoints.",
      link: {
        label: "Learn more",
        href: "https://docs.novu.co/platform/quickstart/nextjs",
        newTab: true,
      },
    },
  ],
} satisfies IconGridData

export const inboxExample = {
  title: "Fits perfectly into your app",
  description:
    "Deliver a rich in-app notification experience that completely mirrors your existing UX, not an afterthought or a bolt-on.",
  action: {
    label: "Get started",
    href: "https://go.novu.co/dashboard",
    newTab: true,
  },
} as const

export const inboxCode = {
  title: "Fast, composable, and simple to implement",
  description:
    "Built for developers, with drop-in integration that can be infinitely customized, no matter your application, or use case.",
  action: {
    label: "Learn more",
    href: "https://docs.novu.co/inbox/react/components/overview",
  },
  code: `import { Inbox } from "@novu/react";

const tabs = [
  {
    label: "All",
    value: [],
  },
  {
    label: "What's New",
    value: [ 'new' ],
  },
  {
    label: "Alerts",
    value: [ 'alerts' ],
  }
];

function Novu() {
  return (
    <Inbox
      tabs={tabs}
    />
  );
}`,
} satisfies CodeSectionData

export const inboxComponents = {
  title: "Multiple components for any InApp requirement",
  description:
    "Configure layouts like bell-triggered popovers, side menus, full-page displays, or any other layout imaginable, with customizable styles and UI elements.",
  action: {
    label: "Learn more",
    href: "https://docs.novu.co/inbox/react/components/overview",
  },
  cards: [
    {
      title: "Actions",
      description:
        "Streamline inbox management with bulk actions like marking as read or archiving all.",
      image: {
        src: `${ASSET_ROOT}/actions.jpg`,
        alt: "",
        width: 402,
        height: 384,
      },
    },
    {
      title: "Bell",
      description:
        "A recognizable notification indicator, alerting users to new messages or updates in real time with visual cues.",
      image: {
        src: `${ASSET_ROOT}/bell.jpg`,
        alt: "",
        width: 484,
        height: 384,
      },
    },
    {
      title: "Easy to embed",
      description: "Switch easily between the Inbox and platform sections.",
      image: {
        src: `${ASSET_ROOT}/embed.jpg`,
        alt: "",
        width: 270,
        height: 384,
      },
    },
    {
      title: "Preferences",
      description:
        "Allows users to customize how and when they receive notifications, ensuring a tailored experience.",
      image: {
        src: `${ASSET_ROOT}/preferences.jpg`,
        alt: "",
        width: 546,
        height: 434,
      },
    },
    {
      title: "Notification",
      description:
        "Notifications deliver updates or messages to users in the Inbox. They can be customized with text, buttons, and links to suit different needs.",
      image: {
        src: `${ASSET_ROOT}/notification.jpg`,
        alt: "",
        width: 640,
        height: 434,
      },
    },
  ] satisfies readonly ImageCardData[],
}

export const inboxReadySetGo = {
  title: "For the best Inbox, Ready. Set. Go.",
  action: {
    label: "Create account",
    href: "https://go.novu.co/dashboard",
  },
  items: [
    {
      icon: `${ASSET_ROOT}/double-plus.svg`,
      title: "Ready",
      description: "Create a Novu account, and pick your framework of choice.",
    },
    {
      icon: `${ASSET_ROOT}/speed.svg`,
      title: "Set",
      description: "Add the Novu Inbox import to your code.",
    },
    {
      icon: `${ASSET_ROOT}/flash.svg`,
      title: "Go",
      description: "Trigger and deliver notification to the end user.",
    },
  ],
} satisfies IconGridData

export const inboxCta = {
  title: "We're ready for your requirements...",
  description:
    "Whatever your use case, Novu is ready. Start for free, no credit card required.",
  primary: {
    label: "Get started",
    href: "https://dashboard.novu.co/?utm_campaign=gs-website-inbox",
  },
  secondary: {
    label: "Contact us",
    href: "https://novu.co/contact-us/?utm_campaign=contact-inbox",
  },
} satisfies DualCtaData

export const inboxCodeDots = `${ASSET_ROOT}/code-dots.png`
export const inboxCtaBackground = `${ASSET_ROOT}/cta-background.svg`
