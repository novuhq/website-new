import type { StaticImageData } from "next/image"
import { ROUTE } from "@/constants/routes"
import activityFeedIllustration from "@/images/pages/usecases/multi-channel/activity-feed-illustration.jpg"
import agentRepliesIllustrationDesktop from "@/images/pages/usecases/multi-channel/agent-replies-illustration-desktop.jpg"
import agentRepliesIllustrationMobile from "@/images/pages/usecases/multi-channel/agent-replies-illustration-mobile.jpg"
import heroIllustrationDesktop from "@/images/pages/usecases/multi-channel/hero-illustration-desktop.jpg"
import heroIllustrationMobile from "@/images/pages/usecases/multi-channel/hero-illustration-mobile.jpg"
import workflowDemoIllustrationDesktop from "@/images/pages/usecases/multi-channel/workflow-demo-illustration-desktop.jpg"
import workflowDemoIllustrationMobile from "@/images/pages/usecases/multi-channel/workflow-demo-illustration-mobile.jpg"
import channelChatIcon from "@/svgs/pages/usecases/multi-channel/channel-chat.svg"
import channelEmailIcon from "@/svgs/pages/usecases/multi-channel/channel-email.svg"
import channelInAppIcon from "@/svgs/pages/usecases/multi-channel/channel-in-app.svg"
import channelPushIcon from "@/svgs/pages/usecases/multi-channel/channel-push.svg"
import channelSmsIcon from "@/svgs/pages/usecases/multi-channel/channel-sms.svg"
import deliveryCutNoiseIcon from "@/svgs/pages/usecases/multi-channel/delivery-cut-noise.svg"
import deliveryPersonalizeIcon from "@/svgs/pages/usecases/multi-channel/delivery-personalize.svg"
import deliveryStepConditionsIcon from "@/svgs/pages/usecases/multi-channel/delivery-step-conditions.svg"
import deliveryUserControlIcon from "@/svgs/pages/usecases/multi-channel/delivery-user-control.svg"
import routingNativeFormatsIcon from "@/svgs/pages/usecases/multi-channel/routing-native-formats.svg"
import routingProviderPerCustomerIcon from "@/svgs/pages/usecases/multi-channel/routing-provider-per-customer.svg"
import routingRulesIcon from "@/svgs/pages/usecases/multi-channel/routing-rules.svg"
import whyEditWithoutDeployIcon from "@/svgs/pages/usecases/multi-channel/why-edit-without-deploy.svg"
import whyIntegrateOnceIcon from "@/svgs/pages/usecases/multi-channel/why-integrate-once.svg"
import whyReachUsersIcon from "@/svgs/pages/usecases/multi-channel/why-reach-users.svg"

/**
 * /usecases/multi-channel-notifications/. Figma page `45950-647` (desktop
 * 1920 frame `45929-5232`). Figma has no mobile frames for this page; the
 * mobile illustrations are recomposed from the desktop layers, following the
 * Web Chat "Deploy the ACI" pattern.
 *
 * A `[text](url)` mark in FAQ copy renders as a link; the FAQ structured data
 * gets the same text without the mark.
 */

export const MULTI_CHANNEL_SLUG = "multi-channel-notifications"

export const MULTI_CHANNEL_METADATA = {
  title: "Multi-channel notification delivery | Novu",
  socialTitle: "Multi-channel notifications from one workflow",
  description:
    "Send in-app, email, SMS, push, and chat notifications from one workflow. Keep your providers, let your team edit messages without a deploy, and see what happened to every send.",
  // Figma `45950-4123`.
  imagePath: "/og-images/og-image-multi-channel-notifications.jpg",
  imageAlt:
    "Novu multi-channel notification delivery: your app triggers one Novu workflow that reaches email, SMS, push, and chat.",
}

export interface IMultiChannelAction {
  label: string
  href: string
  clickText: string
}

export interface IMultiChannelCard {
  icon: StaticImageData
  title: string
  description: string
}

export interface IMultiChannelListItem {
  icon: StaticImageData
  title: string
  /** Lines as Figma breaks them on desktop. */
  descriptionLines: string[]
}

export interface IMultiChannelIllustration {
  desktop: StaticImageData
  mobile: StaticImageData
  alt: string
}

// Hero `45929-6811`. The artwork plate (`image-bg`, `right`, `accent`,
// `badge&shine`) is flattened into one export per breakpoint.
export const HERO = {
  titleLines: ["Multi-channel notification", "delivery from one workflow"],
  descriptionLines: [
    "Reach users in-app, by email, SMS, push, and chat from a single trigger.",
    "We handle providers, timing, and each user’s preferences.",
  ],
  primaryAction: {
    label: "Create free account",
    href: String(ROUTE.dashboardV2SignUp),
    clickText: "create_free_account",
  },
  secondaryAction: {
    label: "Book meeting",
    href: String(ROUTE.bookADemo),
    clickText: "book_meeting",
  },
  illustration: {
    desktop: heroIllustrationDesktop,
    mobile: heroIllustrationMobile,
    alt: "Your app calls trigger('task-reminder'), and one Novu workflow delivers it to email, SMS, push, and chat providers.",
  },
} satisfies {
  titleLines: string[]
  descriptionLines: string[]
  primaryAction: IMultiChannelAction
  secondaryAction: IMultiChannelAction
  illustration: IMultiChannelIllustration
}

// "Stop building a new integration" `45929-8060`.
export const WHY = {
  title: "Stop building a new integration for every channel",
  descriptionLines: [
    "Each new channel brings its own SDK, template",
    "format, and one more place to debug. With Novu,",
    "you set it up once.",
  ],
  cards: [
    {
      icon: whyIntegrateOnceIcon,
      title: "Integrate once",
      description:
        "Your backend sends one event. Novu delivers it to every channel through your providers.",
    },
    {
      icon: whyEditWithoutDeployIcon,
      title: "Change messages without a deploy",
      description:
        "Product teams edit copy, channels, and timing in the dashboard. Test in dev, then publish.",
    },
    {
      icon: whyReachUsersIcon,
      title: "Reach users where they act",
      description:
        "Show it in-app first, follow up by email or push if it’s missed, and respect user preferences.",
    },
  ],
} satisfies {
  title: string
  descriptionLines: string[]
  cards: IMultiChannelCard[]
}

// "Use the providers you already have" `45929-10302`.
export const CHANNELS = {
  titleLines: ["Use the providers", "you already have,", "on every channel"],
  description:
    "Connect the accounts you already pay for, run several per channel, and switch providers without touching code.",
  action: {
    label: "Browse notification integrations",
    href: String(ROUTE.integrationsChannels),
    clickText: "browse_notification_integrations",
  },
  items: [
    {
      icon: channelInAppIcon,
      title: "In-app.",
      descriptionLines: [
        "Novu Inbox, ready to drop",
        "in or fully restyled to your UI",
      ],
    },
    {
      icon: channelEmailIcon,
      title: "Email.",
      descriptionLines: ["SendGrid, Amazon SES,", "Resend, Postmark"],
    },
    {
      icon: channelSmsIcon,
      title: "SMS.",
      descriptionLines: ["Twilio, Infobip, Sinch, Plivo"],
    },
    {
      icon: channelPushIcon,
      title: "Push.",
      descriptionLines: ["Firebase Cloud Messaging,", "APNS, Expo, OneSignal"],
    },
    {
      icon: channelChatIcon,
      title: "Chat.",
      descriptionLines: [
        "Slack, Microsoft Teams, WhatsApp Business, Telegram, Discord",
      ],
    },
  ],
} satisfies {
  titleLines: string[]
  description: string
  action: IMultiChannelAction
  items: IMultiChannelListItem[]
}

// "Nudge users who missed the message" `45929-10712`. The steps and the code
// card are one flattened panel per breakpoint.
export const WORKFLOW_DEMO = {
  titleLines: ["Nudge users who", "missed the message"],
  descriptionLines: [
    "Send a task reminder in the app. Wait six hours.",
    "Send an email only if the reminder is still unread. One workflow, triggered by one call from your backend.",
  ],
  illustration: {
    desktop: workflowDemoIllustrationDesktop,
    mobile: workflowDemoIllustrationMobile,
    alt: "A task-reminder workflow: send the reminder in-app, wait six hours, then send an email only if the in-app reminder is unread. It is triggered from the backend with novu.trigger.",
  },
} satisfies {
  titleLines: string[]
  descriptionLines: string[]
  illustration: IMultiChannelIllustration
}

// "Control delivery from one place" `45929-10729`.
export const DELIVERY_CONTROLS = {
  titleLines: ["Control delivery", "from one place"],
  description:
    "Rules, timing, and content live in one workflow, so changing how a message reaches users doesn't mean touching code in five places.",
  cards: [
    {
      icon: deliveryStepConditionsIcon,
      title: "Set when steps run",
      description:
        "Run or skip a step based on who the user is, what happened, or whether they acted earlier. Add delays for follow-ups.",
    },
    {
      icon: deliveryUserControlIcon,
      title: "Give users control",
      description:
        "Users pick their channels, globally or per notification. Critical messages, like password resets, always get through.",
    },
    {
      icon: deliveryPersonalizeIcon,
      title: "Personalize messages",
      description:
        "Write content for each channel with live previews and real user data. Send it in their language with built-in translations.",
    },
    {
      icon: deliveryCutNoiseIcon,
      title: "Cut the noise",
      description:
        "Group a burst of events into one summary and limit how often the same notification reaches each user.",
    },
  ],
} satisfies {
  titleLines: string[]
  description: string
  cards: IMultiChannelCard[]
}

// "Keep your providers. Centralize routing" `45942-10937`.
export const ROUTING = {
  titleLines: ["Keep your providers.", "Centralize routing"],
  description:
    "Connect several provider accounts and decide which one handles each message. Your app keeps sending the same event while Novu picks the right provider.",
  action: {
    label: "How routing works",
    href: "https://docs.novu.co/platform/integrations/integration-conditions",
    clickText: "how_routing_works",
  },
  items: [
    {
      icon: routingProviderPerCustomerIcon,
      title: "A provider per customer.",
      descriptionLines: [
        "Send a customer's email or SMS through their own provider account, so messages come from their domain and their sender.",
      ],
    },
    {
      icon: routingRulesIcon,
      // Figma reads "Rules instead of cod." — a typo.
      title: "Rules instead of code.",
      descriptionLines: [
        "Pick an email or SMS provider by customer, language, or workflow. Messages that match no rule use your default provider.",
      ],
    },
    {
      icon: routingNativeFormatsIcon,
      title: "Native channel formats.",
      descriptionLines: [
        "Write content for each channel and use native formats where supported, such as Slack Block Kit or WhatsApp templates.",
      ],
    },
  ],
} satisfies {
  titleLines: string[]
  description: string
  action: IMultiChannelAction
  items: IMultiChannelListItem[]
}

// "Your agent stays yours" statement and the "Let users reply" card
// `45942-11455`. The dialog, invoice chip, and cursor are one flattened plate
// per breakpoint; the heading and copy stay live text over it.
export const AGENT_REPLIES = {
  statementLead: "Your agent stays yours.",
  statement:
    "Novu carries the messages and keeps track of each conversation across channels, while your model and tools stay on your side.",
  titleLines: ["Let users reply.", "Let agents answer"],
  description:
    "A failed payment usually sparks a question. With Novu Connect, users reply to the email or chat, and your agent answers in context.",
  illustration: {
    desktop: agentRepliesIllustrationDesktop,
    mobile: agentRepliesIllustrationMobile,
    alt: "A conversation thread: the notification “Your invoice payment failed,” the user reply “Which invoice was this?”, and the agent finding invoice INV-4471 for $120 in the original notification.",
  },
  ctaTextLines: [
    "Bring your agent to Slack, Teams, WhatsApp,",
    "Telegram, and email, or into your app.",
  ],
  primaryAction: {
    label: "Explore Novu Connect",
    href: String(ROUTE.connect),
    clickText: "explore_novu_connect",
  },
  secondaryAction: {
    label: "Connect an agent",
    href: "https://docs.novu.co/agents/workflow-agents",
    clickText: "connect_an_agent",
  },
} satisfies {
  statementLead: string
  statement: string
  titleLines: string[]
  description: string
  illustration: IMultiChannelIllustration
  ctaTextLines: string[]
  primaryAction: IMultiChannelAction
  secondaryAction: IMultiChannelAction
}

// "Know what happened to every notification" `45950-646`. The Activity Feed
// card and its glow are one export; it bleeds past the section box.
export const OBSERVABILITY = {
  titleLines: ["Know what happened", "to every notification"],
  descriptionLines: [
    "See every workflow run step by step: what",
    "was sent, skipped, or failed, and why. Agent conversations are logged too.",
  ],
  illustration: activityFeedIllustration,
  illustrationAlt:
    "Activity Feed for the email step: 1,100 sent, 2,840 skipped because the reminder was read in-app, and 60 failed, with recent events including a SendGrid “550 Mailbox does not exist” failure.",
}

// FAQ `45944-11671`.
export const FAQ_SECTION = {
  title: "Frequently asked questions",
  items: [
    {
      question: "What is multi-channel notification delivery?",
      answer:
        "Multi-channel notification delivery means reaching users through more than one channel, such as in-app, email, SMS, push, and chat, from a single integration. A workflow decides which channels to use for each event, in what order, and under which conditions.",
    },
    {
      question: "Can I keep my existing notification providers?",
      answer:
        "Yes. Connect the provider accounts you already use, such as SendGrid, Twilio, or Firebase Cloud Messaging, and use them in your workflows. You can connect more than one provider per channel, and switching providers is a configuration change, not a code change. For email and SMS, you can also choose a provider per customer or language.",
    },
    {
      question: "Can my product team change notifications without developers?",
      answer:
        "Yes. Content, channels, and timing are edited in the Novu dashboard. Changes are tested in a development environment and then published to production, so developers don't need to ship code for a copy change.",
    },
    {
      question: "Can users choose how they receive notifications?",
      answer:
        "Yes. Users can turn channels on or off for all notifications or for specific workflows, from the in-app Inbox or from your own settings page. Messages marked as critical, such as password resets, ignore those settings.",
    },
    {
      question: "What happens when a provider rejects a message?",
      answer:
        "Novu records the failure in the Activity Feed with the provider's response and can report it to your system as it happens. Most sends are attempted once, because rejections like an invalid phone number would fail again, and Novu doesn't switch providers automatically. See the [delivery retry policy](https://docs.novu.co/platform/developer/delivery-retries) for the full behavior.",
    },
    {
      question: "Can users reply to notifications?",
      answer:
        "Yes, with Novu Connect. Assign an AI agent to a workflow, and replies to its supported email and chat notifications continue as a conversation with that agent, with the original notification as context. SMS is outbound only.",
    },
    {
      question: "Is Novu open source?",
      answer:
        "Yes. Novu is open source. You can use Novu Cloud or host Novu on your own infrastructure. Some features are available only on Novu Cloud.",
    },
  ],
}

// Final CTA, `title&button` in `45929-6085`.
export const CTA = {
  // A non-breaking hyphen keeps "multi‑channel" whole, so the balanced title
  // breaks where Figma does: "Build your first / multi‑channel workflow".
  title: "Build your first multi‑channel workflow",
  // The page shows the newline from lg (`whitespace-pre-line`), as Figma does.
  description:
    "Connect a provider, add your steps, and send a test notification.\nAdd channels as your users need them.",
  primaryAction: {
    label: "Start building for free",
    href: String(ROUTE.dashboardV2SignUp),
    clickText: "start_building_for_free",
  },
  secondaryAction: {
    label: "Read the workflow docs",
    href: "https://docs.novu.co/platform/workflow",
    clickText: "read_the_workflow_docs",
  },
} satisfies {
  title: string
  description: string
  primaryAction: IMultiChannelAction
  secondaryAction: IMultiChannelAction
}

/** Reduces [text](url) marks to their text, for structured data. */
export const toPlainText = (text: string) =>
  text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
