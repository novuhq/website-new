import type { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"
import {
  HOME_CHANNELS,
  HOME_CLI_SLUGS,
  HOME_COMPLIANCE,
  HOME_CONNECT_STACK,
  HOME_CTA,
  HOME_FAQ,
  HOME_HERO,
  HOME_LIVE_CHANNEL_KEYS,
  HOME_NOVU_CONNECT_INTRO,
  HOME_NOVU_CONNECT_ITEMS,
  HOME_NOVU_NOTIFY_INTRO,
  HOME_NOVU_NOTIFY_ITEMS,
} from "@/data/pages/home"
import notifyFeaturedBackground from "@/images/pages/home/bento-notify-featured-bg.png"
import featuresBackground from "@/images/pages/home/features/bg.jpg"
import clientFacingPreview from "@/images/pages/home/features/client-facing.png"
import discordPreview from "@/images/pages/home/features/discord-preview.png"
import githubPreview from "@/images/pages/home/features/github-preview.png"
import googleChatPreview from "@/images/pages/home/features/google-chat-preview.png"
import linearPreview from "@/images/pages/home/features/linear-preview.png"
import messengerPreview from "@/images/pages/home/features/messenger-preview.png"
import zoomPreview from "@/images/pages/home/features/zoom-preview.png"
import customerFacingGraphic from "@/images/pages/home/novu-connect/customer-facing.jpg"
import fullContextGraphic from "@/images/pages/home/novu-connect/full-context.jpg"
import humanApprovalGraphic from "@/images/pages/home/novu-connect/human-approval.jpg"
import oneConversationGraphic from "@/images/pages/home/novu-connect/one-conversation.jpg"
import notifyDigestGraphic from "@/images/pages/home/novu-notify/digest.jpg"
import notifyInboxGraphic from "@/images/pages/home/novu-notify/inbox.png"
import notifyPreferencesGraphic from "@/images/pages/home/novu-notify/preferences.jpg"
import notifyWorkflowGraphic from "@/images/pages/home/novu-notify/workflow.jpg"
import nextjsIcon from "@/svgs/pages/home/inbox/nextjs.svg"
import reactIcon from "@/svgs/pages/home/inbox/react.svg"
import remixIcon from "@/svgs/pages/home/inbox/remix.svg"

import { getMetadata } from "@/lib/get-metadata"
import { safeJsonLdStringify } from "@/lib/json-ld"
import { highlightEchoCode } from "@/lib/shiki"
import FAQ from "@/components/pages/faq"
import CommunicationLifecycle from "@/components/pages/home/communication-lifecycle"
import Compliance from "@/components/pages/home/compliance"
import ConnectStack from "@/components/pages/home/connect-stack"
import Cta from "@/components/pages/home/cta"
import Features from "@/components/pages/home/features"
import TimeOfDay from "@/components/pages/home/features/time-of-day"
import Hero from "@/components/pages/home/hero"
import NovuConnect from "@/components/pages/home/novu-connect"
import NovuNotify from "@/components/pages/home/novu-notify"

const contentData = {
  hero: HOME_HERO,
  features: {
    title: (
      <>
        Integrate a world-class conversation experience <TimeOfDay />
      </>
    ),
    defaultKey: "slack",
    items: HOME_CHANNELS,
  },
  "connect-stack": HOME_CONNECT_STACK,
  "communication-lifecycle": {
    title: "One platform. Two ways to communicate.",
    actions: [
      {
        title: "Novu Connect",
        label: "Conversation",
        labelType: "connect" as const,
        description:
          "Two-way AI communication across WhatsApp, Slack, and more.",
        linkText: "Explore Connect",
        linkUrl: String(ROUTE.connect),
      },
      {
        title: "Novu Notify",
        label: "Notification",
        labelType: "notify" as const,
        description:
          "In-app, email, and push notifications for critical updates.",
        linkText: "Explore Inbox",
        linkUrl: String(ROUTE.inbox),
      },
    ],
    items: [
      {
        label: "Novu Notify",
        labelType: "notify" as const,
        title: "Event",
        description:
          "Something happened in your application that requires user attention.",
        key: "event",
      },
      {
        label: "Novu Notify",
        labelType: "notify" as const,
        title: "Notify",
        description:
          "The app notify users or agents when something happens through push, email, or in-app notifications.",
        key: "notify",
      },
      {
        label: "Novu Connect",
        labelType: "connect" as const,
        title: "Engage",
        description:
          "The user opens the notification and starts a conversation with the agent in their preferred channel.",
        key: "engage",
      },
      {
        label: "Novu Connect",
        labelType: "connect" as const,
        title: "Resolve",
        description:
          "The agent resolves the issue through a two-way conversation across WhatsApp, Slack, SMS, and more.",
        key: "resolve",
      },
    ],
  },
  "novu-connect": {
    ...HOME_NOVU_CONNECT_INTRO,
    items: [
      {
        ...HOME_NOVU_CONNECT_ITEMS[0],
        channelRing: true,
        image: customerFacingGraphic,
        imageClassName:
          "bottom-0 left-1/2 w-[min(150%,45rem)] max-w-none -translate-x-1/2 md:w-[105%] lg:-bottom-1 lg:left-[43%] 2xl:w-[61.25rem]",
        imageSizes: "980px",
      },
      {
        ...HOME_NOVU_CONNECT_ITEMS[1],
        image: fullContextGraphic,
        imageClassName:
          "-bottom-6 left-1/2 z-[1] w-[min(90%,30rem)] max-w-none -translate-x-1/2 md:-bottom-8 lg:-bottom-4 xl:bottom-0 xl:w-[28rem]",
        imageSizes: "448px",
      },
      {
        ...HOME_NOVU_CONNECT_ITEMS[2],
        image: humanApprovalGraphic,
        imageClassName:
          "bottom-0 left-1/2 z-[1] w-[min(158%,40.625rem)] max-w-none -translate-x-1/2 md:w-[min(130%,44rem)] lg:w-[150%] xl:w-[40rem] 2xl:w-[48rem]",
        imageSizes: "768px",
      },
      {
        ...HOME_NOVU_CONNECT_ITEMS[3],
        image: oneConversationGraphic,
        imageClassName:
          "bottom-0 left-1/2 z-[1] w-[min(150%,46rem)] max-w-none -translate-x-1/2 md:w-[105%] 2xl:w-[61.0625rem]",
        imageSizes: "977px",
      },
    ],
  },
  "novu-notify": {
    ...HOME_NOVU_NOTIFY_INTRO,
    items: [
      {
        ...HOME_NOVU_NOTIFY_ITEMS[0],
        backgroundImage: notifyFeaturedBackground,
        image: notifyInboxGraphic,
        imageClassName:
          "left-105 z-20 w-140 bottom-0 lg:w-[41.875rem] lg:left-120 xl:left-130",
        imageSizes: "(min-width: 768px) 670px, 1px",
      },
      {
        ...HOME_NOVU_NOTIFY_ITEMS[1],
        image: notifyPreferencesGraphic,
        imageClassName:
          "top-0 left-1/2 z-[1] w-[51.375rem] -translate-x-1/2 lg:w-[34rem] min-[1281px]:!w-[51.375rem]",
        imageSizes: "822px",
      },
      {
        ...HOME_NOVU_NOTIFY_ITEMS[2],
        image: notifyDigestGraphic,
        imageClassName:
          "top-0 left-1/2 z-[1] w-[51.375rem] -translate-x-1/2 lg:w-[34rem] min-[1281px]:!w-[51.375rem]",
        imageSizes: "822px",
      },
      {
        ...HOME_NOVU_NOTIFY_ITEMS[3],
        image: notifyWorkflowGraphic,
        imageClassName:
          "top-0 left-1/2 z-[1] w-[51.375rem] -translate-x-1/2 lg:w-[34rem] min-[1281px]:!w-[51.375rem]",
        imageSizes: "822px",
      },
    ],
  },
  compliance: HOME_COMPLIANCE,
  faq: HOME_FAQ,
  cta: HOME_CTA,
}

const notifyCodeTabs = [
  {
    title: "Next.js",
    code: `import React from 'react';
import { Inbox } from '@novu/nextjs';

export function NotificationInbox() {
  return (
    <Inbox />
  );
}`,
    icon: nextjsIcon,
  },
  {
    title: "Remix",
    code: `import React from 'react';
import { Inbox } from '@novu/react';

export function NotificationInbox() {
  return (
    <Inbox />
  );
}`,
    icon: remixIcon,
  },
  {
    title: "React",
    code: `import React from 'react';
import { Inbox } from '@novu/react';

export function NotificationInbox() {
  return (
    <Inbox />
  );
}`,
    icon: reactIcon,
  },
]

const featureImplementationCode = `import React from 'react';
import { Notify } from '@novu/react';

export function NotificationNotify() {
  return (
    <Notify />
  );
}`

export const metadata: Metadata = getMetadata({
  ...SEO_DATA.index,
  markdownPathname: true,
})

const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || "https://novu.co"

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQ.accordion.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
}

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Novu",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description: SEO_DATA.index.description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  sameAs: ["https://github.com/novuhq/novu"],
}

export default async function HomePage() {
  const [highlightedNotifyCodeTabs, featureImplementationHighlightedHtml] =
    await Promise.all([
      Promise.all(
        notifyCodeTabs.map(async (tab) => ({
          ...tab,
          highlightedHtml: await highlightEchoCode(tab.code),
        }))
      ),
      highlightEchoCode(featureImplementationCode),
    ])

  const LIVE_CHANNELS = new Set<string>(HOME_LIVE_CHANNEL_KEYS)
  const cliSlugs = HOME_CLI_SLUGS

  const clientFacingVideos: Record<
    string,
    { webm: string; mp4: string; poster: string }
  > = {
    slack: {
      webm: "/videos/channels/slack-client-facing.webm",
      mp4: "/videos/channels/slack-client-facing.hevc.mp4",
      poster: "/videos/channels/slack-client-facing-poster.png",
    },
    whatsapp: {
      webm: "/videos/channels/whatsapp-client-facing.webm",
      mp4: "/videos/channels/whatsapp-client-facing.hevc.mp4",
      poster: "/videos/channels/whatsapp-client-facing-poster.png",
    },
    telegram: {
      webm: "/videos/channels/telegram-client-facing.webm",
      mp4: "/videos/channels/telegram-client-facing.hevc.mp4",
      poster: "/videos/channels/telegram-client-facing-poster.png",
    },
    email: {
      webm: "/videos/channels/email-client-facing.webm",
      mp4: "/videos/channels/email-client-facing.hevc.mp4",
      poster: "/videos/channels/email-client-facing-poster.png",
    },
    teams: {
      webm: "/videos/channels/teams-client-facing.webm",
      mp4: "/videos/channels/teams-client-facing.hevc.mp4",
      poster: "/videos/channels/teams-client-facing-poster.png",
    },
    imessage: {
      webm: "/videos/channels/imessage-client-facing.webm",
      mp4: "/videos/channels/imessage-client-facing.hevc.mp4",
      poster: "/videos/channels/imessage-client-facing-poster.png",
    },
  }

  // Per-channel static preview image for coming-soon channels; falls back to the
  // shared placeholder until a channel-specific still is added.
  const clientFacingImages: Record<string, typeof clientFacingPreview> = {
    github: githubPreview,
    zoom: zoomPreview,
    linear: linearPreview,
    discord: discordPreview,
    messenger: messengerPreview,
    "google-chat": googleChatPreview,
  }

  // 2-sentence company + use-case blurb, shown on hover over the company in each demo.
  // Shown on hover over the company in each demo: the name once, then a short
  // "what the company is" line and a separate "what the agent does" line.
  const companyInfo: Record<
    string,
    { name: string; about: string; useCase: string }
  > = {
    slack: {
      name: "Helix",
      about:
        "A data-pipeline platform that keeps its customers' analytics flowing.",
      useCase:
        "Its support agent works in shared Slack Connect channels, diagnosing sync failures and fixing them once the customer approves.",
    },
    whatsapp: {
      name: "Fernweh",
      about: "A direct-to-consumer travel-gear brand.",
      useCase:
        "Its agent handles orders and delivery changes over WhatsApp, so a shopper can reroute a package in a few taps.",
    },
    telegram: {
      name: "Lumen",
      about: "A developer API platform.",
      useCase:
        "Its agent answers usage and billing questions in Telegram, showing real limits and upgrading a plan on request.",
    },
    teams: {
      name: "Vesta",
      about: "An enterprise security and compliance vendor.",
      useCase:
        "Its agent works with client IT admins in Microsoft Teams, provisioning access with the approvals enterprises require.",
    },
    email: {
      name: "Brightledger",
      about: "A billing and finance platform.",
      useCase:
        "Its agent resolves invoice questions over email, explaining charges and issuing credits through secure action links.",
    },
    imessage: {
      name: "Cedar House",
      about: "A restaurant group.",
      useCase:
        "Its agent manages reservations over iMessage, moving bookings and confirming details in the customer's Messages app.",
    },
    github: {
      name: "Corewave",
      about: "An open-source developer tool.",
      useCase:
        "Its agent triages bug reports inside GitHub issues, references the fix, and closes the thread when it ships.",
    },
    zoom: {
      name: "Loopwork",
      about: "A coaching and enablement platform.",
      useCase:
        "Its agent follows up after sessions in Zoom Team Chat, sharing recaps and booking the next meeting.",
    },
    linear: {
      name: "Tideline",
      about: "A product company.",
      useCase:
        "Its agent turns customer feature requests into triaged Linear issues, setting status and sharing a roadmap ETA.",
    },
    discord: {
      name: "Pixelforge",
      about: "A game studio.",
      useCase:
        "Its agent supports players in the community Discord, checking access and granting roles without leaving the channel.",
    },
    messenger: {
      name: "Lark & Loom",
      about: "A home-goods brand.",
      useCase:
        "Its agent helps shoppers reorder over Facebook Messenger, surfacing past orders as product cards.",
    },
    "google-chat": {
      name: "Kepler",
      about: "A design and build agency.",
      useCase:
        "Its agent answers client project questions in Google Chat spaces, sharing status cards and staging links.",
    },
  }

  const featureItems = contentData.features.items.map((item) => {
    const slug = cliSlugs[item.key]

    return {
      ...item,
      company: companyInfo[item.key],
      availability: LIVE_CHANNELS.has(item.key)
        ? ("live" as const)
        : ("upcoming" as const),
      cliCommand: slug ? `npx novu connect --channel ${slug}` : undefined,
      backgroundImage: featuresBackground,
      clientFacingImage: clientFacingImages[item.key] ?? clientFacingPreview,
      clientFacingVideo: clientFacingVideos[item.key],
      implementationCode: featureImplementationCode,
      implementationHighlightedHtml: featureImplementationHighlightedHtml,
    }
  })

  return (
    <div>
      <Hero {...contentData["hero"]} />
      <Features {...contentData["features"]} items={featureItems} />
      <ConnectStack {...contentData["connect-stack"]} />
      <CommunicationLifecycle {...contentData["communication-lifecycle"]} />
      <NovuConnect {...contentData["novu-connect"]} />
      <NovuNotify
        {...contentData["novu-notify"]}
        codeTabs={highlightedNotifyCodeTabs}
      />
      <Compliance {...contentData["compliance"]} />
      <FAQ
        {...contentData["faq"]}
        className="md py-20 font-inter md:py-28 lg:py-36 xl:pt-50 xl:pb-10"
        titleClassName="tracking-plus-tight font-normal lg:text-[44px]"
        containerClassName="max-w-3xl lg:max-w-288 gap-y-5"
        variant="minimal"
        defaultOpenFirst
      />
      <Cta {...contentData["cta"]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify([faqJsonLd, softwareApplicationJsonLd]),
        }}
      />
    </div>
  )
}
