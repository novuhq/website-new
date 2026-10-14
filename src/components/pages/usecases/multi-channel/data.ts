// Copy for /usecases/multi-channel-notifications/. Inline marks in the copy:
// `backticks` render as <code> and [text](url) renders as a link. The FAQ
// schema gets the same text with both marks reduced to plain text.

const DASHBOARD_LINK = "https://dashboard.novu.co/?utm_campaign=usecase-CTA"
const CONTACT_LINK =
  "https://novu.co/contact-us/?utm_campaign=website-usecase-multiChannel"

const PRIMARY_CTA = { text: "Start building for free", url: DASHBOARD_LINK }
const SECONDARY_CTA = { text: "Talk to us", url: CONTACT_LINK }

export interface TextLinkCopy {
  text: string
  url: string
}

export interface SectionImage {
  src: string
  alt: string
  width: number
  height: number
  /** "side" for tall product renders, "below" for wide dashboard screenshots. */
  placement: "side" | "below"
}

export interface TextSectionCopy {
  title: string
  paragraphs: readonly string[]
  links: readonly TextLinkCopy[]
  image?: SectionImage
}

export const MULTI_CHANNEL_SLUG = "multi-channel-notifications"

// Unchanged from the original page, which ranks first for its keyword.
export const MULTI_CHANNEL_METADATA = {
  title: "Multi-Channel Notifications",
  description:
    "Boost user engagement and streamline notifications with Novu's multi-channel notifications. Effortlessly integrate email, SMS, push, chat, and in-app notifications into your app with centralized content management and extensive provider integrations. Enhance visibility, optimize strategies, and ensure seamless user experiences. Simplify development, reduce costs, and eliminate friction between teams.",
}

export const HERO = {
  title: "Multi-channel notification delivery from one workflow",
  description:
    "Send in-app, email, SMS, push, and chat notifications from a single trigger. Keep your providers, control when each message goes out, and manage notification changes without another app release. When users reply, your AI agent can answer with Novu Connect.",
  links: [PRIMARY_CTA, SECONDARY_CTA],
  supportingLine:
    "Built on an open-source core, available as Novu Cloud or self-hosted.",
}

export const WORKFLOW_DEMO = {
  title: "Follow up when a notification is still unread",
  description:
    "Send a reminder to the in-app Inbox. Wait six hours. Send an email only if the reminder is still unread. Your backend triggers the workflow once. Novu evaluates the configured conditions at each step.",
  steps: [
    { icon: "in-app", step: "In-app", description: "Send the task reminder" },
    { icon: "delay", step: "Delay", description: "Wait six hours" },
    {
      icon: "email",
      step: "Email",
      description: "Follow up if the in-app reminder is unread",
    },
  ],
  codeTitle: "Trigger from your backend",
  code: `import { Novu } from '@novu/api';

const secretKey = process.env.NOVU_SECRET_KEY;
if (!secretKey) throw new Error('NOVU_SECRET_KEY is required');

const novu = new Novu({ secretKey });

await novu.trigger({
  workflowId: 'task-reminder',
  to: [{ subscriberId: 'subscriber-123' }],
  payload: { taskTitle: 'Review the project budget' },
});`,
  link: {
    text: "Build your first workflow",
    url: "https://docs.novu.co/platform/workflow/create-a-workflow",
  },
} as const

export const CHANNELS = {
  title: "Keep your providers as you add channels",
  description:
    "Connect the provider accounts you already use and manage delivery through Novu. Your application calls the workflow instead of maintaining a separate sending integration for each channel.",
  columns: ["Channel", "Example integrations"],
  rows: [
    { channel: "In-app", integrations: "Novu Inbox" },
    {
      channel: "Email",
      integrations: "SendGrid, Amazon SES, Resend, Postmark",
    },
    { channel: "SMS", integrations: "Twilio, Plivo" },
    {
      channel: "Push",
      integrations: "Firebase Cloud Messaging, APNs, Expo, OneSignal",
    },
    {
      channel: "Chat",
      integrations: "Slack, Microsoft Teams, WhatsApp Business, Discord",
    },
    {
      channel: "Tool",
      integrations: "PagerDuty, Grafana, custom webhook destinations",
    },
  ],
  routing: {
    title: "Route email and SMS for each customer",
    description:
      "Connect multiple provider accounts and choose an integration by customer, locale or workflow. Send a customer's messages through their own configured account, with a primary integration for messages that match no rule.",
  },
  links: [
    {
      text: "Browse notification integrations",
      url: "/integrations/channels/",
    },
    {
      text: "See how provider routing works",
      url: "https://docs.novu.co/platform/integrations/integration-conditions",
    },
  ],
}

export const INBOX = {
  title: "Give your product a notification Inbox that fits",
  paragraphs: [
    "Add a notification center with a bell, unread counts and notification preferences. Users can read and archive updates in your app, alongside the work those updates relate to.",
    "Use the prebuilt Inbox, customize its components, or build your own interface with headless hooks. You control the experience without building the feed infrastructure yourself.",
  ],
  links: [
    { text: "Explore Novu Inbox", url: "https://docs.novu.co/platform/inbox" },
  ],
  image: {
    src: "/images/pages/inbox/dark-novu-inbox.png",
    alt: "Novu Inbox showing unread notifications with action buttons, grouped into tabs",
    width: 1238,
    height: 1295,
    placement: "side",
  },
} satisfies TextSectionCopy

export const DELIVERY_CONTROLS = {
  title: "Decide when to notify, and when to hold back",
  description:
    "Configure delivery rules in the workflow so each event reaches the intended users through the appropriate channels.",
  cards: [
    {
      title: "Follow up based on notification state",
      description:
        "Run or skip steps using event data, subscriber attributes and supported results from earlier steps. Add a delay before a follow-up.",
    },
    {
      title: "Respect user preferences",
      description:
        "Let users choose channels globally or for specific workflows. Manage preferences through the Inbox or your own settings interface.",
    },
    {
      title: "Send fewer, more useful updates",
      description:
        "Combine related events into a digest. Use throttling to limit how often a workflow sends to a subscriber.",
    },
    {
      title: "Make content relevant to each user",
      description:
        "Personalize channel templates with your event data. Manage translated content for the locales your product supports.",
    },
  ],
}

export const TEAM_COLLABORATION = {
  title: "Change notification content without another app release",
  paragraphs: [
    "Give product and content teams a place to edit messages and preview the result. For dashboard-built workflows, they can also change channels, conditions and timing.",
    "Test changes in Development before publishing to Production. Developers keep the application trigger, while the team manages the notification experience in Novu.",
  ],
  links: [
    {
      text: "Explore workflows",
      url: "https://docs.novu.co/platform/workflow",
    },
  ],
  image: {
    src: "/images/pages/usecases/multi-channel-notifications/workflow-editor.png",
    alt: "Novu workflow editor with trigger, email, delay and in-app steps, and workflow settings for preferences and translations",
    width: 2400,
    height: 1558,
    placement: "below",
  },
} satisfies TextSectionCopy

export const OBSERVABILITY = {
  title: "See why a notification was sent, skipped or failed",
  paragraphs: [
    "Inspect each workflow run in the Activity Feed. Review step execution and failure details to see where delivery stopped or why a message was skipped.",
    "Subscribe to failure webhooks to send those events to your own system and decide how to respond.",
  ],
  links: [
    {
      text: "Monitor and debug a workflow",
      url: "https://docs.novu.co/platform/workflow/monitor-and-debug-workflow",
    },
  ],
  image: {
    src: "/images/pages/usecases/multi-channel-notifications/activity-feed.png",
    alt: "Novu Activity Feed listing workflow trigger requests with status codes, and the step-by-step execution of one workflow run",
    width: 2400,
    height: 1626,
    placement: "below",
  },
} satisfies TextSectionCopy

export const AGENT_REPLIES = {
  title: "Let users ask a question about the notification they received",
  paragraphs: [
    "A payment alert often leads to a question. With Novu Connect, assign your agent to a workflow so replies to supported email and chat notifications continue as a conversation with the original message and trigger payload in context.",
    "Your agent uses the model and tools you choose. Novu handles the communication, and configured tool calls can require user approval.",
  ],
  example: [
    {
      icon: "notification",
      label: "Notification",
      text: "“Payment failed for invoice #1042.”",
    },
    {
      icon: "user",
      label: "User reply",
      text: "“Which project is this for?”",
    },
    {
      icon: "agent",
      label: "Agent",
      text: "Uses the invoice context and its connected tools to answer in the same thread",
    },
  ],
  supportingLine:
    "Use Novu Web Chat when you also want agent conversations inside your app.",
  cta: { text: "Explore Novu Connect", url: "/connect/" },
  link: {
    text: "Connect a workflow to an agent",
    url: "https://docs.novu.co/agents/workflow-agents",
  },
} as const

export const DEPLOYMENT = {
  title: "Choose how you run your notification infrastructure",
  paragraphs: [
    "Use Novu Cloud to let us manage the infrastructure, or deploy the open-source core on your own servers. Inspect the source and extend it for your requirements.",
    "Community self-hosting and Novu Cloud have different feature sets. Compare the options before choosing your deployment.",
  ],
  links: [
    {
      text: "Compare Cloud and self-hosted Novu",
      url: "https://docs.novu.co/community/self-hosted-and-novu-cloud",
    },
  ],
} satisfies TextSectionCopy

export const FAQ_SECTION = {
  title: "Frequently asked questions",
  description:
    "Find answers to common questions about channels, delivery behavior and integration.",
  items: [
    {
      question: "What is multi-channel notification delivery?",
      answer:
        "Multi-channel notification delivery means sending notifications through more than one channel, such as in-app, email, SMS, push or chat. In Novu, a workflow defines which channels to use, when each step runs and what message to send.",
    },
    {
      question: "Can I keep my existing notification providers?",
      answer:
        "Yes. Connect supported provider accounts to Novu and use them in your workflows. You can configure multiple integrations and route email or SMS by customer, locale or workflow. Changing providers may require updating credentials, sender settings and provider-specific content.",
    },
    {
      question:
        "Can my team change notifications without deploying application code?",
      answer:
        "Yes. Product and content teams can edit messages and manage dashboard-built workflows in Novu. Test changes in Development before publishing to Production. For code-defined workflows, dashboard editing depends on the controls exposed by your implementation.",
    },
    {
      question: "Can users choose how they receive notifications?",
      answer:
        "Yes. Users can enable or disable channels globally or for specific workflows. Offer preferences through Novu Inbox or build your own settings interface using the APIs.",
    },
    {
      question:
        "Does Novu automatically retry or switch providers when a send fails?",
      answer:
        "Novu records ordinary provider-send failures in the Activity Feed and emits failure events. It does not automatically retry those sends or switch to another provider. Retry behavior differs for other delivery layers. See the [delivery retry policy](https://docs.novu.co/platform/developer/delivery-retries).",
    },
    {
      question: "Can users reply to a notification and talk to an agent?",
      answer:
        "Yes, with Novu Connect. Assign an agent to a workflow and configure its supported channels. Replies to supported email and chat notifications can continue with that agent, carrying the original notification context. Channel behavior varies. See [workflow-assigned agents](https://docs.novu.co/agents/workflow-agents).",
    },
    {
      question: "Can I self-host Novu?",
      answer:
        "Yes. You can deploy Novu's open-source core on your own infrastructure or use Novu Cloud. Community self-hosting does not include every Cloud feature. See the [deployment comparison](https://docs.novu.co/community/self-hosted-and-novu-cloud).",
    },
  ],
}

export const CLOSING = {
  title: "Build your first multi-channel workflow",
  description:
    "Connect a provider, add your channel steps, and send a test notification. Start with the channels your product needs today.",
  links: [PRIMARY_CTA, SECONDARY_CTA],
  supportingLink: {
    text: "Read the workflow docs",
    url: "https://docs.novu.co/platform/workflow",
  },
}

/** Reduces the inline marks to plain text, for structured data. */
export const toPlainText = (text: string) =>
  text.replaceAll("`", "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
