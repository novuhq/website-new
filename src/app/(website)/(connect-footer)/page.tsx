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
  HOME_FEATURED_CUSTOMERS,
  HOME_HERO,
  HOME_LIVE_CHANNEL_KEYS,
  HOME_NOVU_CONNECT_INTRO,
  HOME_NOVU_CONNECT_ITEMS,
  HOME_NOVU_NOTIFY_INTRO,
  HOME_NOVU_NOTIFY_ITEMS,
} from "@/data/pages/home"
import notifyFeaturedBackground from "@/images/pages/home/bento-notify-featured-bg.png"
import featuresBackground from "@/images/pages/home/features/bg.jpg"
import chatPreview from "@/images/pages/home/features/chat-preview.jpg"
import clientFacingPreview from "@/images/pages/home/features/client-facing.png"
import discordPreview from "@/images/pages/home/features/discord-preview.jpg"
import githubPreview from "@/images/pages/home/features/github-preview.jpg"
import googleChatPreview from "@/images/pages/home/features/google-chat-preview.jpg"
import linearPreview from "@/images/pages/home/features/linear-preview.jpg"
import messengerPreview from "@/images/pages/home/features/messenger-preview.jpg"
import pushPreview from "@/images/pages/home/features/push-preview.png"
import smsPreview from "@/images/pages/home/features/sms-preview.jpg"
import zoomPreview from "@/images/pages/home/features/zoom-preview.jpg"
import customerFacingGraphic from "@/images/pages/home/novu-connect/customer-facing.jpg"
import fullContextGraphic from "@/images/pages/home/novu-connect/full-context.jpg"
import humanApprovalGraphic from "@/images/pages/home/novu-connect/human-approval.jpg"
import oneConversationGraphic from "@/images/pages/home/novu-connect/one-conversation.jpg"
import notifyDigestGraphic from "@/images/pages/home/novu-notify/digest.jpg"
import notifyPreferencesGraphic from "@/images/pages/home/novu-notify/preferences.jpg"
import notifyWorkflowGraphic from "@/images/pages/home/novu-notify/workflow.jpg"
import nextjsIcon from "@/svgs/pages/home/inbox/nextjs.svg"
import reactIcon from "@/svgs/pages/home/inbox/react.svg"
import remixIcon from "@/svgs/pages/home/inbox/remix.svg"

import { getMetadata } from "@/lib/get-metadata"
import { safeJsonLdStringify } from "@/lib/json-ld"
import { highlightEchoCode } from "@/lib/shiki"
import { absoluteUrl } from "@/lib/site-url"
import FAQ from "@/components/pages/faq"
import CommunicationLifecycle from "@/components/pages/home/communication-lifecycle"
import Compliance from "@/components/pages/home/compliance"
import ConnectStack from "@/components/pages/home/connect-stack"
import Cta from "@/components/pages/home/cta"
import FeaturedCustomers from "@/components/pages/home/featured-customers"
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
          "bottom-0 left-1/2 w-[min(150%,45rem)] max-w-none -translate-x-1/2 md:w-[105%] lg:-bottom-1 lg:left-[45%] 2xl:w-[61.25rem]",
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
        mascotEyes: true,
      },
    ],
  },
  "novu-notify": {
    ...HOME_NOVU_NOTIFY_INTRO,
    items: [
      {
        ...HOME_NOVU_NOTIFY_ITEMS[0],
        backgroundImage: notifyFeaturedBackground,
        liveInbox: true,
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

const SITE_URL = absoluteUrl("/")
const ORGANIZATION_ID = `${SITE_URL}#organization`
const WEBSITE_ID = `${SITE_URL}#website`
const FAQ_ID = `${SITE_URL}#faq`
const SOFTWARE_APPLICATION_ID = `${SITE_URL}#software`
const FEATURED_CUSTOMERS_ID = `${SITE_URL}#featured-customers`

const faqJsonLd = {
  "@type": "FAQPage",
  "@id": FAQ_ID,
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
  "@type": "SoftwareApplication",
  "@id": SOFTWARE_APPLICATION_ID,
  name: "Novu",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description: SEO_DATA.index.description,
  publisher: {
    "@id": ORGANIZATION_ID,
  },
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

  const featuredCustomersJsonLd = {
    "@type": "ItemList",
    "@id": FEATURED_CUSTOMERS_ID,
    name: HOME_FEATURED_CUSTOMERS.title,
    itemListElement: HOME_FEATURED_CUSTOMERS.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Review",
        reviewBody: item.quote,
        author: {
          "@type": "Person",
          name: item.authorName,
          jobTitle: item.authorPosition,
        },
        itemReviewed: {
          "@type": "Organization",
          name: item.company,
        },
      },
    })),
  }

  const LIVE_CHANNELS = new Set<string>(HOME_LIVE_CHANNEL_KEYS)
  const cliSlugs = HOME_CLI_SLUGS

  const clientFacingVideos: Record<
    string,
    {
      webm: string
      mp4: string
      poster: string
      displaySize?: { width: number; height: number }
    }
  > = {
    slack: {
      webm: "/videos/pages/home/features/slack-client-facing.webm",
      mp4: "/videos/pages/home/features/slack-client-facing.mp4",
      poster: "/videos/pages/home/features/slack-client-facing-poster.webp",
      displaySize: { width: 504, height: 348 },
    },
    whatsapp: {
      webm: "/videos/pages/home/features/whatsapp-client-facing.webm",
      mp4: "/videos/pages/home/features/whatsapp-client-facing.mp4",
      poster: "/videos/pages/home/features/whatsapp-client-facing-poster.webp",
      displaySize: { width: 504, height: 348 },
    },
    telegram: {
      webm: "/videos/pages/home/features/telegram-client-facing.webm",
      mp4: "/videos/pages/home/features/telegram-client-facing.mp4",
      poster: "/videos/pages/home/features/telegram-client-facing-poster.webp",
      displaySize: { width: 504, height: 436 },
    },
    email: {
      webm: "/videos/pages/home/features/email-client-facing.webm",
      mp4: "/videos/pages/home/features/email-client-facing.mp4",
      poster: "/videos/pages/home/features/email-client-facing-poster.webp",
      displaySize: { width: 504, height: 414 },
    },
    teams: {
      webm: "/videos/pages/home/features/teams-client-facing.webm",
      mp4: "/videos/pages/home/features/teams-client-facing.mp4",
      poster: "/videos/pages/home/features/teams-client-facing-poster.webp",
      displaySize: { width: 504, height: 332 },
    },
    imessage: {
      webm: "/videos/pages/home/features/imessage-client-facing.webm",
      mp4: "/videos/pages/home/features/imessage-client-facing.mp4",
      poster: "/videos/pages/home/features/imessage-client-facing-poster.webp",
      displaySize: { width: 504, height: 332 },
    },
    inbox: {
      webm: "/videos/pages/home/features/inbox-client-facing.webm",
      mp4: "/videos/pages/home/features/inbox-client-facing.mp4",
      poster: "/videos/pages/home/features/inbox-client-facing-poster.webp",
      displaySize: { width: 425, height: 373 },
    },
  }

  // Per-channel static preview image; falls back to the shared placeholder
  // until a channel-specific still is added.
  const clientFacingImages: Record<string, typeof clientFacingPreview> = {
    push: pushPreview,
    chat: chatPreview,
    sms: smsPreview,
    github: githubPreview,
    zoom: zoomPreview,
    linear: linearPreview,
    discord: discordPreview,
    messenger: messengerPreview,
    "google-chat": googleChatPreview,
  }

  const clientFacingImagePresentation: Record<
    string,
    { className: string; sizes: string }
  > = {
    push: {
      className:
        "top-[10.84%] left-1/2 w-[53.594%] max-w-[343px] -translate-x-1/2",
      sizes: "(min-width: 1024px) 343px, 54vw",
    },
    chat: {
      className:
        "top-1/2 left-1/2 w-[78.75%] max-w-[504px] -translate-1/2 overflow-hidden rounded-[10px] shadow-[0_16.105px_39.368px_rgba(0,0,0,0.6)]",
      sizes: "(min-width: 1024px) 504px, 79vw",
    },
    sms: {
      className:
        "top-1/2 left-1/2 w-[68.75%] max-w-[440px] -translate-1/2 overflow-hidden rounded-[10px] shadow-[0_16.105px_39.368px_rgba(0,0,0,0.6)]",
      sizes: "(min-width: 1024px) 440px, 69vw",
    },
    github: {
      className:
        "top-[9.35%] left-1/2 w-[78.75%] max-w-[504px] -translate-x-1/2 overflow-hidden rounded-[10px] shadow-[0_16.105px_39.368px_rgba(0,0,0,0.6)]",
      sizes: "(min-width: 1024px) 504px, 79vw",
    },
    discord: {
      className:
        "top-[9.35%] left-1/2 w-[71.5625%] max-w-[458px] -translate-x-1/2 overflow-hidden rounded-[10px] shadow-[0_16.105px_39.368px_rgba(0,0,0,0.6)]",
      sizes: "(min-width: 1024px) 458px, 72vw",
    },
    linear: {
      className:
        "top-[9.35%] left-1/2 w-[78.75%] max-w-[504px] -translate-x-1/2 overflow-hidden rounded-[10px] shadow-[0_16.105px_39.368px_rgba(0,0,0,0.6)]",
      sizes: "(min-width: 1024px) 504px, 79vw",
    },
    zoom: {
      className:
        "top-[9.35%] left-1/2 w-[71.5625%] max-w-[458px] -translate-x-1/2 overflow-hidden rounded-[10px] shadow-[0_16.105px_39.368px_rgba(0,0,0,0.6)]",
      sizes: "(min-width: 1024px) 458px, 72vw",
    },
    messenger: {
      className:
        "top-[9.35%] left-1/2 w-[78.75%] max-w-[504px] -translate-x-1/2 overflow-hidden rounded-[10px] shadow-[0_16.105px_39.368px_rgba(0,0,0,0.6)]",
      sizes: "(min-width: 1024px) 504px, 79vw",
    },
    "google-chat": {
      className:
        "top-[9.35%] left-1/2 w-[78.75%] max-w-[504px] -translate-x-1/2 overflow-hidden rounded-[10px] shadow-[0_16.105px_39.368px_rgba(0,0,0,0.6)]",
      sizes: "(min-width: 1024px) 504px, 79vw",
    },
  }

  const clientFacingUnderlayVideos = {
    push: {
      webm: "/videos/pages/home/features/push-client-facing.webm",
      mp4: "/videos/pages/home/features/push-client-facing.mp4",
      poster: "/videos/pages/home/features/push-client-facing-poster.webp",
      className:
        "top-[2.5825%] left-[4.3732%] h-[95.9828%] w-[92.1283%] object-top [border-radius:13.2911%_/_6.278%]",
    },
  }

  const clientFacingLabels: Record<string, string> = {
    github: "Coming Soon",
    discord: "Coming Soon",
    linear: "Coming Soon",
    zoom: "Coming Soon",
    messenger: "Coming Soon",
    "google-chat": "Coming Soon",
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
    const imagePresentation = clientFacingImagePresentation[item.key]

    return {
      ...item,
      company: companyInfo[item.key],
      availability: LIVE_CHANNELS.has(item.key)
        ? ("live" as const)
        : ("upcoming" as const),
      cliCommand: slug ? `npx novu connect --channel ${slug}` : undefined,
      backgroundImage: featuresBackground,
      clientFacingImage: clientFacingImages[item.key] ?? clientFacingPreview,
      clientFacingImageClassName: imagePresentation?.className,
      clientFacingImageSizes: imagePresentation?.sizes,
      clientFacingLabel: clientFacingLabels[item.key],
      clientFacingUnderlayVideo:
        clientFacingUnderlayVideos[
          item.key as keyof typeof clientFacingUnderlayVideos
        ],
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
      <FeaturedCustomers {...HOME_FEATURED_CUSTOMERS} />
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
          __html: safeJsonLdStringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": `${SITE_URL}#webpage`,
                url: SITE_URL,
                name: SEO_DATA.index.title,
                description: SEO_DATA.index.description,
                isPartOf: {
                  "@id": WEBSITE_ID,
                },
                publisher: {
                  "@id": ORGANIZATION_ID,
                },
                mainEntity: [
                  { "@id": FAQ_ID },
                  { "@id": SOFTWARE_APPLICATION_ID },
                ],
                hasPart: { "@id": FEATURED_CUSTOMERS_ID },
              },
              faqJsonLd,
              softwareApplicationJsonLd,
              featuredCustomersJsonLd,
            ],
          }),
        }}
      />
    </div>
  )
}
