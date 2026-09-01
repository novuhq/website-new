import { ROUTE } from "@/constants/routes"

import type { IFaqSection } from "@/types/common"

// Single source of truth for the /notify landing page copy. The page
// (app/(website)/(connect-footer)/notify/page.tsx) and its JSON-LD read from
// here so the two surfaces cannot drift.

export const NOTIFY_COMMAND = "npm i @novu/react"

export const NOTIFY_PROMPT =
  "Add Novu Notify to my application. Configure an in-app notification inbox, multi-channel delivery, and user-controlled notification preferences. Follow the instructions on https://novu.co/llms.txt"

export const NOTIFY_INBOX_PROMPT =
  "Add the Novu Inbox component to my app for real-time in-app notifications with user preferences. Follow the instructions on https://novu.co/llms.txt"

export const NOTIFY_HERO = {
  label: "Novu Notify",
  title: "The notification infrastructure 40,000 developers trust",
  description:
    "Add an <Inbox /> to your product by end of day. Start sending notifications across every channel with one API tomorrow. Simple.",
}

export const NOTIFY_INBOX_SECTION = {
  title: "The Inbox your users already know how to use",
  description:
    "Drop the prebuilt Inbox component into your app: real-time notifications, read states, and preferences that match your existing UI. Delivered by Novu directly, no provider to configure.",
  featured: {
    title: "Fits perfectly into your app",
    description:
      "Deliver a rich in-app notification experience that mirrors your existing UX, not an afterthought or a bolt-on.",
  },
  capabilities: [
    {
      title: "Prebuilt and composable",
      description:
        "Ship the full Inbox in minutes or compose your own from primitives.",
      href: String(ROUTE.docsInboxSetup),
      linkLabel: "Set up the Inbox",
    },
    {
      title: "Real-time, with unread counts",
      description:
        "New notifications appear instantly and badges stay accurate.",
      href: String(ROUTE.docsNotifications),
      linkLabel: "React SDK docs",
    },
    {
      title: "Tabs, filters, and layouts",
      description: "Organize notifications by project, severity, or team.",
      href: String(ROUTE.docsInboxTabs),
      linkLabel: "Configure tabs",
    },
    {
      title: "Read states, archiving, snoozing",
      description: "State syncs across every open tab and device.",
      href: String(ROUTE.docsInboxSnooze),
      linkLabel: "Snooze docs",
    },
    {
      title: "Custom styling and localization",
      description:
        "Match your design system and ship in your users' languages.",
      href: String(ROUTE.docsInboxStyling),
      linkLabel: "Styling docs",
    },
    {
      title: "Preferences built in",
      description: "Per-channel controls users manage right inside the Inbox.",
      href: String(ROUTE.docsInboxPreferences),
      linkLabel: "Preferences docs",
    },
  ],
}

export const NOTIFY_FEATURE_SECTIONS = [
  {
    key: "digest",
    label: "Digest",
    title: "Five events. One notification.",
    description:
      "A digest collects events over a window, groups them per subscriber, and sends one summary instead of a burst of pings. Your workflow continues once per window, with every collected event available to the message content.",
    bullets: [
      "Timed, scheduled, or custom digest windows",
      "Group events with a digest key: per user, per project, per account",
      "Aggregated events available as variables in your templates",
      "Rate limits cap how often anyone gets pinged",
    ],
    links: [
      {
        label: "Explore Digest",
        href: String(ROUTE.digest),
      },
      {
        label: "Read the digest docs",
        href: String(ROUTE.docsDigest),
        external: true,
      },
    ],
  },
  {
    key: "preferences",
    label: "Preferences",
    title: "Users choose what reaches them",
    description:
      "Let people choose what they receive, when, and where, with quiet hours and snooze built in. Preferences apply across every channel automatically, so respecting them takes zero extra code.",
    bullets: [
      "Per-workflow and per-channel opt-in and opt-out",
      "Quiet hours and snooze built in",
      "A ready preferences UI inside the Inbox component",
      "Defaults you control, overrides your users control",
    ],
    links: [
      {
        label: "Read the preferences docs",
        href: String(ROUTE.docsInboxPreferences),
        external: true,
      },
      {
        // Reads as a destination rather than a bare identifier, matching the
        // "React SDK docs" capability card.
        label: "usePreferences hook docs",
        href: String(ROUTE.docsUserPreferences),
        external: true,
      },
    ],
  },
  {
    key: "workflows",
    label: "Workflows",
    title: "Trigger once. Reach every channel.",
    description:
      "Define a workflow once and Novu handles routing, conditions, delays, and fallbacks across in-app, email, SMS, push, and chat. Connect your existing providers through the Integration Store and keep one API in your code.",
    bullets: [
      "In-app Inbox, email, SMS, push, and chat from one trigger",
      "Conditions, delays, and fallback steps without extra code",
      "Works with your existing providers through the Integration Store",
      "Update workflow content without redeploying your app",
    ],
    links: [
      {
        label: "Explore Novu Framework",
        href: String(ROUTE.framework),
      },
      {
        label: "Read the workflow docs",
        href: String(ROUTE.docsWorkflow),
        external: true,
      },
    ],
  },
]

export const NOTIFY_EXPLORE = {
  title: "Go deeper on every piece",
  description:
    "Each part of the notification stack has its own page. Pick the one you need next.",
  items: [
    {
      title: "Inbox Component",
      description:
        "The prebuilt in-app notification center: theming, tabs, preferences, and framework guides.",
      href: String(ROUTE.inbox),
      linkLabel: "Explore Inbox",
    },
    {
      title: "Digest",
      description:
        "How digests batch many events into one notification, with strategies and configuration examples.",
      href: String(ROUTE.digest),
      linkLabel: "Explore Digest",
    },
    {
      title: "Framework",
      description:
        "Define workflows in code with type-safe steps, local development, and version control.",
      href: String(ROUTE.framework),
      linkLabel: "Explore Framework",
    },
    {
      title: "Integrations",
      description:
        "Every email, SMS, push, and chat provider Novu connects to through the Integration Store.",
      href: String(ROUTE.integrations),
      linkLabel: "Browse integrations",
    },
    {
      title: "Pricing",
      description:
        "Start free on the open-source core or Novu Cloud, and pay as your volume grows.",
      href: String(ROUTE.pricing),
      linkLabel: "See pricing",
    },
    {
      title: "Novu Connect",
      description:
        "The other half of Novu: two-way conversations between your AI agents and your users.",
      href: String(ROUTE.connect),
      linkLabel: "Explore Connect",
    },
  ],
  docsTitle: "Developer docs",
  docsItems: [
    {
      title: "Quickstart",
      href: String(ROUTE.docsQuickStart),
    },
    {
      title: "API reference",
      href: String(ROUTE.docsApis),
    },
    {
      title: "SDKs",
      href: String(ROUTE.docsSdks),
    },
    {
      title: "Content editors",
      href: String(ROUTE.docsContentManagement),
    },
    {
      title: "Novu Framework",
      href: String(ROUTE.docsFramework),
    },
    {
      title: "Self-hosting",
      href: String(ROUTE.docsSelfHosting),
    },
  ],
}

export const NOTIFY_PROVIDERS_SECTION = {
  title: "Your providers, one workflow layer",
  description:
    "Novu orchestrates, your providers deliver. Connect the email, SMS, push, and chat providers you already pay for through the Integration Store, and swap them without changing your code.",
  categoryLabels: {
    email: "Email",
    sms: "SMS",
    push: "Push",
    chat: "Chat",
  } as Record<string, string>,
}

export const NOTIFY_FAQ = {
  title: "Frequently asked questions",
  accordion: {
    items: [
      {
        question: "What is Novu Notify?",
        answer:
          "Novu Notify is open-source notification infrastructure for your product. It gives you a prebuilt in-app Inbox component, a workflow engine with digests, delays, and fallbacks, user-controlled preferences, and delivery across email, SMS, push, and chat through one API.",
      },
      {
        question:
          "What is the difference between Novu Notify and Novu Connect?",
        answer:
          "Novu Notify handles workflow-driven notifications from your product to your users. Novu Connect handles two-way conversations between AI agents and people. Both use Novu's channel, identity, and delivery infrastructure.",
      },
      {
        question: "Do I need to replace my email, SMS, or push provider?",
        answer:
          "No. Connect your provider accounts through the Novu Integration Store. Novu gives your application one workflow and API layer while the configured provider handles delivery. You can also configure multiple integrations and use provider-specific settings where required.",
      },
      {
        question: "How does the digest work?",
        answer:
          "A digest step collects trigger events over a window you define, groups them per subscriber (and optionally by a digest key such as a project or account), then continues the workflow once per window. Every collected event is available to your message content, so you can send one summary instead of many notifications.",
      },
      {
        question: "Can users control what notifications they receive?",
        answer:
          "Yes. Subscribers get per-workflow and per-channel preferences, with quiet hours and snooze built in. The Inbox component ships with a ready preferences UI, and preferences are enforced by Novu automatically across every channel.",
      },
      {
        question: "Which frameworks does the Inbox component support?",
        answer:
          "Novu ships prebuilt Inbox components for React, Next.js, and Remix, with full control over styling and behavior. For everything else, the API and SDKs let you build a custom notification center on the same infrastructure.",
      },
      {
        question: "Can I self-host Novu Notify?",
        answer:
          "Novu Community Edition can be self-hosted for core notification infrastructure, including Inbox, email, SMS, push, and chat. Novu Cloud adds managed and enterprise capabilities.",
      },
    ],
  },
} satisfies IFaqSection

export const NOTIFY_CTA = {
  title: "Start sending notifications today",
  description:
    "Create a free account, add the Inbox, and trigger your first workflow today. Open source at the core, one API across every channel.",
}
