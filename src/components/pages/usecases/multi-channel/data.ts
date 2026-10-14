// Copy for /usecases/multi-channel-notifications/. A [text](url) mark in the
// copy renders as a link; the FAQ schema gets the same text without the mark.

const DASHBOARD_LINK = "https://dashboard.novu.co/?utm_campaign=usecase-CTA"
const CONTACT_LINK =
  "https://novu.co/contact-us/?utm_campaign=website-usecase-multiChannel"

const PRIMARY_CTA = { text: "Start building for free", url: DASHBOARD_LINK }
const SECONDARY_CTA = { text: "Talk to us", url: CONTACT_LINK }

export const MULTI_CHANNEL_SLUG = "multi-channel-notifications"

export const MULTI_CHANNEL_METADATA = {
  title: "Multi-channel notification delivery | Novu",
  socialTitle: "Multi-channel notifications from one workflow",
  description:
    "Send in-app, email, SMS, push, and chat notifications from one workflow. Keep your providers, let your team edit messages without a deploy, and see what happened to every send.",
}

export const HERO = {
  title: "Multi-channel notification delivery from one workflow",
  description:
    "Reach users in-app, by email, SMS, push, and chat from a single trigger. We handle the providers, the timing, and each user's preferences, so your team stops rebuilding notification plumbing for every channel.",
  links: [PRIMARY_CTA, SECONDARY_CTA],
  supportingLine:
    "Open source. Use Novu Cloud or host it yourself. Build workflows in the dashboard or in code.",
}

export const WHY = {
  title: "Stop building a new integration for every channel",
  description:
    "Each channel you add usually brings its own provider SDK, its own template format, and one more place to look when a message goes missing. With Novu, you set that up once.",
  cards: [
    {
      title: "Integrate once",
      description:
        "Your backend sends one event. Novu delivers it to every channel in the workflow, through the providers you've connected.",
    },
    {
      title: "Change messages without a deploy",
      description:
        "Product and content teams edit copy, channels, and timing in the dashboard. Test changes in a development environment, then publish to production.",
    },
    {
      title: "Reach users where they act",
      description:
        "Show a message in the app first, follow up by email or push only if it's missed, and respect what each user has opted into.",
    },
  ],
}

export const CHANNELS = {
  title: "Use the channels and providers you already have",
  description:
    "Connect the provider accounts you already pay for, run more than one per channel, and switch providers without changing your code. Add the Novu Inbox to show notifications inside your app.",
  columns: ["Channel", "Example integrations"],
  rows: [
    {
      channel: "In-app",
      integrations: "Novu Inbox, ready to drop in or fully restyled to your UI",
    },
    {
      channel: "Email",
      integrations: "SendGrid, Amazon SES, Resend, Postmark",
    },
    { channel: "SMS", integrations: "Twilio, Infobip, Sinch, Plivo" },
    {
      channel: "Push",
      integrations: "Firebase Cloud Messaging, APNS, Expo, OneSignal",
    },
    {
      channel: "Chat",
      integrations:
        "Slack, Microsoft Teams, WhatsApp Business, Telegram, Discord",
    },
  ],
  link: {
    text: "Browse notification integrations",
    url: "/integrations/channels/",
  },
}

export const WORKFLOW_DEMO = {
  title: "Follow up when a message still needs attention",
  description:
    "Send a task reminder in the app. Wait six hours. Send an email only if the reminder is still unread. One workflow, triggered by one call from your backend.",
  steps: [
    { icon: "in-app", title: "In-app:", description: "Send the reminder." },
    { icon: "delay", title: "Delay:", description: "Wait six hours." },
    {
      icon: "email",
      title: "Email:",
      description: "Send only if the in-app reminder is unread.",
    },
  ],
  codeLabel: "Trigger from your backend",
  code: `import { Novu } from '@novu/api';

const secretKey = process.env.NOVU_SECRET_KEY;
if (!secretKey) throw new Error('NOVU_SECRET_KEY is required');

const novu = new Novu({ secretKey });

await novu.trigger({
  workflowId: 'task-reminder',
  to: [{ subscriberId: 'subscriber-123' }],
  payload: { taskTitle: 'Review Q4 budget' },
});`,
  link: {
    text: "Build your first workflow",
    url: "https://docs.novu.co/platform/workflow/create-a-workflow",
  },
} as const

export const DELIVERY_CONTROLS = {
  title: "Control delivery without scattering logic across your app",
  description:
    "Rules, timing, and content live in one workflow, so changing how a message reaches users doesn't mean touching code in five places.",
  cards: [
    {
      title: "Choose when each step runs",
      description:
        "Run or skip a step based on who the user is, what happened, or whether they acted on an earlier message. Add delays when a follow-up should wait.",
    },
    {
      title: "Give users control",
      description:
        "Users choose which channels they want, for everything or for specific notifications. Mark must-send messages, like password resets, as critical so those choices don't block them.",
    },
    {
      title: "Personalize every message",
      description:
        "Write content for each channel with live previews and each user's own data. Send it in their language with built-in translations.",
    },
    {
      title: "Cut the noise",
      description:
        "Group a burst of events into one summary and limit how often the same notification reaches a user.",
    },
  ],
}

export const ROUTING = {
  title: "Keep your providers. Centralize routing.",
  description:
    "Connect several provider accounts and decide which one handles each message. Your app keeps sending the same event while Novu picks the right provider.",
  cards: [
    {
      title: "A provider per customer",
      description:
        "Send a customer's email or SMS through their own provider account, so messages come from their domain and their sender.",
    },
    {
      title: "Rules instead of code",
      description:
        "For email and SMS, pick a provider by customer, language, or workflow. Anything that matches no rule goes through your default provider.",
    },
    {
      title: "Native formats when you need them",
      description:
        "Write content for each channel, and use a platform's own format where it's supported, such as Slack Block Kit or WhatsApp templates.",
    },
  ],
  link: {
    text: "See how provider routing works",
    url: "https://docs.novu.co/platform/integrations/integration-conditions",
  },
}

export const AGENT_REPLIES = {
  title: "Let users reply, and have an agent answer",
  paragraphs: [
    "A failed-payment email usually leads to a question. With Novu Connect, users can reply to supported email and chat notifications, and your AI agent picks up the conversation already knowing which notification they're replying to.",
    "Your agent keeps its own model and tools. We carry the messages and keep track of the conversation. Sensitive actions can wait for the user's approval.",
  ],
  exampleLabel: "Example interaction:",
  example: [
    {
      icon: "notification",
      title: "Notification:",
      description: "“Your invoice payment failed.”",
    },
    {
      icon: "user",
      title: "User reply:",
      description: "“Which invoice was this?”",
    },
    {
      icon: "agent",
      title: "Agent response:",
      description:
        "The agent looks up the invoice from the original notification and answers in the same thread.",
    },
  ],
  supportingLine:
    "Bring your agent to Slack, Microsoft Teams, WhatsApp, Telegram, and email. Use Web Chat for conversations inside your app.",
  cta: { text: "Explore Novu Connect", url: "/connect/" },
  link: {
    text: "Connect workflow notifications to an agent",
    url: "https://docs.novu.co/agents/workflow-agents",
  },
} as const

export const OBSERVABILITY = {
  title: "Know what happened to every notification",
  paragraphs: [
    "The Activity Feed shows each workflow run step by step: what was sent, what was skipped, and what the provider said when a send failed. Failed messages can be reported to your own system as they happen, so your team can follow up before a customer notices.",
    "When a notification turns into a conversation with an agent, you can review that conversation too.",
  ],
  link: {
    text: "Monitor and debug a workflow",
    url: "https://docs.novu.co/platform/workflow/monitor-and-debug-workflow",
  },
}

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

export const CLOSING = {
  title: "Build your first multi-channel workflow",
  description:
    "Connect a provider, add your steps, and send a test notification. Add channels as your users need them.",
  links: [PRIMARY_CTA, SECONDARY_CTA],
  supportingLink: {
    text: "Read the workflow docs",
    url: "https://docs.novu.co/platform/workflow",
  },
}

/** Reduces [text](url) marks to their text, for structured data. */
export const toPlainText = (text: string) =>
  text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
