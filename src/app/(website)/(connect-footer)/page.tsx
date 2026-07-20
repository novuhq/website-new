import type { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"
import notifyDigestBackground from "@/images/pages/home/bento-notify-digest-bg.png"
import notifyFeaturedBackground from "@/images/pages/home/bento-notify-featured-bg.png"
import notifyPreferencesBackground from "@/images/pages/home/bento-notify-preferences-bg.png"
import notifyWorkflowBackground from "@/images/pages/home/bento-notify-workflow-bg.png"
import channelDemoImage from "@/images/pages/home/features/channel-demo.jpg"
import customerFacingGraphic from "@/images/pages/home/novu-connect/customer-facing.jpg"
import fullContextGraphic from "@/images/pages/home/novu-connect/full-context.jpg"
import humanApprovalGraphic from "@/images/pages/home/novu-connect/human-approval.jpg"
import oneConversationGraphic from "@/images/pages/home/novu-connect/one-conversation.jpg"
import notifyDigestGraphic from "@/images/pages/home/novu-notify/digest.png"
import notifyInboxGraphic from "@/images/pages/home/novu-notify/inbox.png"
import notifyPreferencesGraphic from "@/images/pages/home/novu-notify/preferences.png"
import notifyWorkflowGraphic from "@/images/pages/home/novu-notify/workflow.png"
import nextjsIcon from "@/svgs/pages/home/inbox/nextjs.svg"
import reactIcon from "@/svgs/pages/home/inbox/react.svg"
import remixIcon from "@/svgs/pages/home/inbox/remix.svg"

import { getMetadata } from "@/lib/get-metadata"
import { highlightEchoCode } from "@/lib/shiki"
import FAQ from "@/components/pages/faq"
import CommunicationLifecycle from "@/components/pages/home/communication-lifecycle"
import Compliance from "@/components/pages/home/compliance"
import ConnectStack from "@/components/pages/home/connect-stack"
import Cta from "@/components/pages/home/cta"
import Features from "@/components/pages/home/features"
import Hero from "@/components/pages/home/hero"
import NovuConnect from "@/components/pages/home/novu-connect"
import NovuNotify from "@/components/pages/home/novu-notify"

const contentData = {
  hero: {
    command: "npx novu connect",
    description:
      "Novu is the open-source infrastructure to send notifications and connect agents to anyone — in-app, email, SMS, push, WhatsApp, Slack, voice, and more.",
    title: "Connect your AI agents and products to customers",
  },
  features: {
    title: "Integrate a world-class conversation experience this afternoon",
    description:
      "Start with a component, scale with a platform. Everything you need to build a world-class notification system.",
    defaultKey: "email",
    items: [
      {
        key: "slack",
        badges: ["connect"] as const,
        image: channelDemoImage,
        label: "Slack",
        title: "Connect your AI agent to Slack",
        description:
          "Reach teams where work happens with rich, actionable messages, threads, and reliable delivery routing.",
        prompt:
          "Connect my AI agent to Slack with Novu, including threaded replies and delivery status handling.",
        features: [
          "Two-way threaded conversations",
          "Team and user identity mapping",
          "Reliable delivery with retries",
        ],
      },
      {
        key: "whatsapp",
        badges: ["connect"] as const,
        image: channelDemoImage,
        label: "WhatsApp",
        title: "Connect your AI agent to WhatsApp",
        description:
          "Start secure two-way customer conversations with templates, attachments, and delivery receipts.",
        prompt:
          "Connect my AI agent to WhatsApp with Novu and configure approved templates plus two-way replies.",
        features: [
          "Secure two-way conversations",
          "Approved message templates",
          "Attachments and delivery receipts",
        ],
      },
      {
        key: "telegram",
        badges: ["connect"] as const,
        image: channelDemoImage,
        label: "Telegram",
        title: "Connect your AI agent to Telegram",
        description:
          "Reach users with fast, conversational updates, rich media, and replies inside Telegram.",
        prompt:
          "Connect my AI agent to Telegram with Novu and configure rich messages, user identity, and two-way replies.",
        features: [
          "Fast conversational delivery",
          "Rich messages and media",
          "Replies routed to the right context",
        ],
      },
      {
        key: "teams",
        badges: ["connect", "notify"] as const,
        image: channelDemoImage,
        label: "MS Teams",
        title: "Connect your AI agent to Microsoft Teams",
        description:
          "Bring agent updates and human handoffs into the channels your organization already uses.",
        prompt:
          "Connect my AI agent to Microsoft Teams with Novu and include a human handoff workflow.",
        features: [
          "Channel and thread awareness",
          "Human handoff workflows",
          "Reliable team notifications",
        ],
      },
      {
        key: "github",
        badges: ["notify"] as const,
        image: channelDemoImage,
        label: "GitHub",
        title: "Connect your AI agent to GitHub workflows",
        description:
          "Notify maintainers about releases, incidents, and reviews with the right context attached.",
        prompt:
          "Connect my AI agent to GitHub events with Novu for pull request and release notifications.",
        features: [
          "Pull request notifications",
          "Release and incident updates",
          "Repository context included",
        ],
      },
      {
        key: "email",
        badges: ["notify", "connect"] as const,
        image: channelDemoImage,
        label: "Email",
        title: "Connect your AI agent to Email",
        description:
          "Reach users directly in their inbox with rich, actionable notifications. Support for templates, attachments, and high-deliverability routing.",
        prompt:
          "Connect my AI agent to Email with Novu using a responsive template, attachments, and delivery tracking.",
        features: [
          "Responsive message templates",
          "Attachments and rich content",
          "High-deliverability routing",
        ],
      },
      {
        key: "imessage",
        badges: ["connect"] as const,
        image: channelDemoImage,
        label: "iMessage",
        title: "Connect your AI agent to iMessage",
        description:
          "Bring agent conversations and timely updates into the native messaging experience customers already use.",
        prompt:
          "Connect my AI agent to iMessage with Novu and configure secure two-way conversations plus delivery tracking.",
        features: [
          "Native messaging experience",
          "Secure two-way conversations",
          "Delivery status tracking",
        ],
      },
      {
        key: "zoom",
        badges: ["notify"] as const,
        image: channelDemoImage,
        label: "Zoom",
        title: "Connect your AI agent to Zoom",
        description:
          "Coordinate meeting updates, reminders, and follow-ups while keeping every participant informed.",
        prompt:
          "Connect my AI agent to Zoom with Novu for meeting reminders, participant updates, and follow-up messages.",
        features: [
          "Meeting reminders",
          "Participant status updates",
          "Automated follow-up messages",
        ],
      },
      {
        key: "linear",
        badges: ["notify"] as const,
        image: channelDemoImage,
        label: "Linear",
        title: "Connect your AI agent to Linear",
        description:
          "Turn issue activity into focused notifications and route agent follow-ups to the right teammates.",
        prompt:
          "Connect my AI agent to Linear with Novu for issue updates, assignments, and contextual follow-ups.",
        features: [
          "Issue activity notifications",
          "Assignment and status updates",
          "Contextual agent follow-ups",
        ],
      },
      {
        key: "discord",
        badges: ["connect"] as const,
        image: channelDemoImage,
        label: "Discord",
        title: "Connect your AI agent to Discord",
        description:
          "Send community updates and let users continue the conversation without leaving Discord.",
        prompt:
          "Connect my AI agent to Discord with Novu and enable replies in the originating channel.",
        features: [
          "Two-way community conversations",
          "Channel-aware reply routing",
          "Rich messages and attachments",
        ],
      },
      {
        key: "messenger",
        badges: ["connect"] as const,
        image: channelDemoImage,
        label: "FB Messenger",
        title: "Connect your AI agent to Facebook Messenger",
        description:
          "Bring automated support and timely updates into the Messenger conversations customers already use.",
        prompt:
          "Connect my AI agent to Facebook Messenger with Novu and enable secure two-way customer conversations.",
        features: [
          "Secure customer conversations",
          "Automated support handoffs",
          "Reliable message delivery",
        ],
      },
      {
        key: "google-chat",
        badges: ["connect", "notify"] as const,
        image: channelDemoImage,
        label: "Google Chat",
        title: "Connect your AI agent to Google Chat",
        description:
          "Deliver agent updates and team handoffs in Google Chat spaces without adding new workflow friction.",
        prompt:
          "Connect my AI agent to Google Chat with Novu and route updates and replies to the correct space.",
        features: [
          "Space-aware notifications",
          "Team handoff workflows",
          "Replies routed to the right space",
        ],
      },
    ],
  },
  "connect-stack": {
    title: "Opinionated about communication. Unopinionated about intelligence.",
    description:
      "We solve the communication problem so you can own the agent intelligence, where your customers actually work.",
  },
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
    label: "Novu Connect",
    title: "The Agent Communication Infrastructure",
    description:
      "Converse with humans on any channel without building the plumbing. ",
    items: [
      {
        title: "Customer-facing agents, connected across every channel",
        description:
          "Novu routes and normalizes every conversation through one reliable layer, ensuring consistent responses, automatic retries, and a single integration for Slack, WhatsApp, Teams, and more.",
        image: customerFacingGraphic,
        imageClassName:
          "bottom-0 left-1/2 z-[1] w-[min(150%,45rem)] max-w-none -translate-x-1/2 md:w-[105%] lg:left-[43%] lg:-bottom-1 2xl:w-[61.25rem]",
        imageSizes: "980px",
      },
      {
        title: "Full context, every message",
        description:
          "Every message includes the full conversation history and state, so your agent keeps context without rebuilding memory or managing its own session store.",
        image: fullContextGraphic,
        imageClassName:
          "-bottom-6 left-1/2 z-[1] w-[min(90%,30rem)] max-w-none -translate-x-1/2 md:-bottom-8 lg:-bottom-4 xl:bottom-0 xl:w-[28rem]",
        imageSizes: "448px",
      },
      {
        title: "Human approval, before it acts",
        description:
          "When an agent needs to refund, provision, deploy, or trigger an MCP tool, Novu brings approval into the same conversation before it acts.",
        image: humanApprovalGraphic,
        imageClassName:
          "bottom-0 left-1/2 z-[1] w-[min(158%,40.625rem)] max-w-none -translate-x-1/2 md:w-[min(130%,44rem)] lg:w-[150%] xl:w-[40rem] 2xl:w-[48rem]",
        imageSizes: "768px",
      },
      {
        title: "Open source, ready in one command",
        description:
          "Novu Connect is built in the open — inspect the code, contribute integrations, or adapt it for your team’s workflow.",
        image: oneConversationGraphic,
        imageClassName:
          "bottom-0 left-1/2 z-[1] w-[min(150%,46rem)] max-w-none -translate-x-1/2 md:w-[105%] 2xl:w-[61.0625rem]",
        imageSizes: "977px",
      },
    ],
  },
  "novu-notify": {
    label: "Novu Notify",
    title: "Novu Notify overview",
    description:
      "Stop building notification centers. Drop in our React/Vue components and start delivering across every channel with a single API call.",
    items: [
      {
        title: "Fits perfectly into your app",
        description:
          "Deliver a rich in-app notification experience that completely mirrors your existing UX, not an afterthought or a bolt-on.",
        backgroundImage: notifyFeaturedBackground,
        image: notifyInboxGraphic,
        imageClassName:
          "left-105 z-20 w-140 bottom-0 lg:w-[41.875rem] lg:left-120 xl:left-130",
        imageSizes: "(min-width: 768px) 670px, 1px",
      },
      {
        title: "User-controlled preferences",
        description:
          "Let people choose what they receive, when, and where—with quiet hours and snooze built in.",
        backgroundImage: notifyPreferencesBackground,
        image: notifyPreferencesGraphic,
        imageClassName:
          "top-3 left-1/2 z-[1] w-[min(100%,23.75rem)] -translate-x-1/2 lg:w-[78%] xl:w-[23.75rem]",
        imageSizes: "380px",
      },
      {
        title: "Digests & rate limits",
        description:
          "Bundle multiple notifications into one instead of five, and cap how often anyone gets pinged — no noisy inbox, no spam.",
        backgroundImage: notifyDigestBackground,
        image: notifyDigestGraphic,
        imageClassName:
          "top-0 left-1/2 z-[1] w-[min(100%,24.5rem)] -translate-x-1/2 lg:w-[76%] xl:w-[24.5rem]",
        imageSizes: "392px",
      },
      {
        title: "One workflow, every channel",
        description:
          "Trigger once. Novu handles routing, conditions, delays, and fallbacks across every channel — all from a single workflow.",
        backgroundImage: notifyWorkflowBackground,
        image: notifyWorkflowGraphic,
        imageClassName:
          "top-0 left-1/2 z-[1] w-[min(100%,24.4375rem)] -translate-x-1/2 lg:w-[80%] xl:w-[24.4375rem]",
        imageSizes: "391px",
      },
    ],
  },
  compliance: {
    title: "Built for enterprise environments",
    description:
      "Open source, self-hosted, or fully managed. Choose the deployment model that fits your security, compliance, and operational requirements.",
    items: [
      {
        question: "Compliance",
        answer:
          "Meet enterprise requirements with security and governance designed for regulated environments.",
      },
      {
        question: "Self-hosted",
        answer:
          "Deploy in your own infrastructure or private cloud while keeping full control over your data.",
      },
      {
        question: "Open source",
        answer:
          "Build on a transparent, extensible foundation backed by an active open-source community.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    accordion: {
      items: [
        {
          question: "What are Claude Managed Agents?",
          answer:
            "Claude Managed Agents are Anthropic’s fully managed infrastructure for building and running autonomous AI agents. You define what the agent should do, the tools it can use, and the guardrails it should follow, while Anthropic handles the managed runtime behind it. Novu Connect then brings that agent into the channels where people already work, such as Slack, WhatsApp, email, Telegram, and Discord.",
        },
        {
          question: "Does Novu manage or host my Claude agent?",
          answer:
            "No. Your Claude agent remains in your own Anthropic environment. Novu provides the communication layer that connects it to users across supported channels.",
        },
        {
          question: "Can I use a Claude agent I've already built?",
          answer:
            "Yes. Connect an existing agent without rebuilding its prompts, tools, or business logic. Novu handles the channel integration around it.",
        },
        {
          question: "Can I share my agent with my team?",
          answer:
            "Yes. You can expose the same agent in shared team channels and keep conversations available where your team already collaborates.",
        },
        {
          question: "How many channels can I connect to a single agent?",
          answer:
            "A single agent can be connected to multiple supported channels, so users can reach it from the channel that fits their workflow.",
        },
        {
          question: "Novu Connect vs Novu Platform",
          answer:
            "Novu Connect focuses on two-way conversations between agents and people. The Novu Platform also includes notification workflows, in-app inboxes, email, push, and user preferences.",
        },
      ],
    },
  },
  cta: {
    title: "One engine underneath",
    description:
      "Whether you're building a modern app or a cutting-edge AI agent, Novu is the delivery layer that connects you to the world.",
  },
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

export const metadata: Metadata = getMetadata(SEO_DATA.index)

export default async function HomePage() {
  const highlightedNotifyCodeTabs = await Promise.all(
    notifyCodeTabs.map(async (tab) => ({
      ...tab,
      highlightedHtml: await highlightEchoCode(tab.code),
    }))
  )

  return (
    <div>
      <Hero {...contentData["hero"]} />
      <Features {...contentData["features"]} />
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
    </div>
  )
}
