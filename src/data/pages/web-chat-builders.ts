export interface IWebChatBuilderSeo {
  title: string
  description: string
}

export interface IWebChatBuilderHero {
  eyebrow: string
  title: string
  description: string
  command: string
  prompt: string
  promptLabel: string
}

export type WebChatBuilderFeatureIcon =
  | "embed"
  | "backend"
  | "theme"
  | "two-way"
  | "workflow"
  | "public-link"

export interface IWebChatBuilderPrimarySection {
  type: "primary"
  id: string
  title: string
  features: {
    title: string
    description: string
    icon: WebChatBuilderFeatureIcon
  }[]
}

export interface IWebChatBuilderSecondarySection {
  type: "secondary"
  id: string
  title: string
  description: string
  steps: {
    description: string
    command?: string
  }[]
}

export type WebChatBuilderChannel =
  | "telegram"
  | "teams"
  | "email"
  | "web-chat"
  | "whatsapp"
  | "slack"
  | "imessage"

export interface IWebChatBuilderTertiarySection {
  type: "tertiary"
  id: string
  title: string
  description: string
  command: string
  channels: { name: string; icon: WebChatBuilderChannel }[]
  moreChannelsLabel: string
  moreChannelsHint: string
  imageAlt: string
}

export type IWebChatBuilderSection =
  | IWebChatBuilderPrimarySection
  | IWebChatBuilderSecondarySection
  | IWebChatBuilderTertiarySection

export interface IWebChatBuilderFaqItem {
  question: string
  answer: string
}

export interface IWebChatBuilderFinalCta {
  title: string
  description: string
  label: string
  href: string
}

export interface IWebChatBuilderPage {
  slug: string
  builderName: string
  seo: IWebChatBuilderSeo
  hero: IWebChatBuilderHero
  sections: IWebChatBuilderSection[]
  faq: IWebChatBuilderFaqItem[]
  finalCta: IWebChatBuilderFinalCta | null
}

const WEBFLOW_PAGE = {
  slug: "webflow",
  builderName: "Webflow",
  seo: {
    title: "Add an AI agent to your Webflow site | Novu Web Chat",
    description:
      "Bring your AI agent to Webflow with one embed. Chat with visitors and reach them across messaging channels and email through one workflow.",
  },
  hero: {
    eyebrow: "Web Chat for Webflow",
    title: "Add an AI agent to your Webflow site",
    description:
      "Bring your AI agent to Webflow with one embed. Chat with visitors and reach them across messaging channels and email through one workflow. Your agent’s channel, not a generic widget.",
    command: "npx novu connect --channel web-chat",
    prompt:
      "Add Novu Web Chat to my Webflow site. Run npx novu connect --channel web-chat, then help me embed the chat on my site and connect it to my AI agent.",
    promptLabel: "Copy Prompt",
  },
  sections: [
    {
      type: "primary",
      id: "web-chat-builder-features",
      title: "Your agent, live on your Webflow site",
      features: [
        {
          title: "One-snippet embed",
          description:
            "Paste one script tag into Webflow’s Embed element or site-wide custom code.",
          icon: "embed",
        },
        {
          title: "No backend to host",
          description:
            "Novu delivers your messages. No messaging backend to host or maintain.",
          icon: "backend",
        },
        {
          title: "Themeable",
          description:
            "Customize the chat widget’s appearance to match the look and feel of your Webflow site.",
          icon: "theme",
        },
        {
          title: "Two-way",
          description:
            "Your agent receives visitors’ messages and replies directly in the same chat widget.",
          icon: "two-way",
        },
        {
          title: "Every channel, one workflow",
          description:
            "Reach users across Slack, WhatsApp, email, and other channels through one workflow.",
          icon: "workflow",
        },
        {
          title: "Shareable public link",
          description:
            "Every agent gets a public link you can share with your visitors, even without a paid plan.",
          icon: "public-link",
        },
      ],
    },
    {
      type: "secondary",
      id: "web-chat-builder-setup",
      title: "How to add an AI agent to your Webflow site in four steps",
      description: "No webhooks, no OAuth, about two minutes.",
      steps: [
        {
          description: "Connect your agent to Novu Web Chat:\nrun ",
          command: "npx novu connect --channel web-chat",
        },
        {
          description:
            "Copy your one-line Web Chat embed,\na single script tag.",
        },
        {
          description:
            "In the Webflow Designer, add an Embed element where you want the widget, or paste it into Project Settings → Custom Code for the whole site.",
        },
        {
          description:
            "Publish. Your agent is live in the chat,\nreplying to visitors.",
        },
      ],
    },
    {
      type: "tertiary",
      id: "web-chat-builder-channels",
      title: "One workflow, every channel",
      description:
        "Your agent’s logic works across Webflow chat and every channel. Novu handles delivery through one workflow. Run the command to connect Web Chat.",
      command: "npx novu connect --channel web-chat",
      channels: [
        { name: "Telegram", icon: "telegram" },
        { name: "MS Teams", icon: "teams" },
        { name: "Email", icon: "email" },
        { name: "Web Chat", icon: "web-chat" },
        { name: "WhatsApp", icon: "whatsapp" },
        { name: "Slack", icon: "slack" },
        { name: "iMessage", icon: "imessage" },
      ],
      moreChannelsLabel: "More channels",
      moreChannelsHint: "More channels coming soon",
      imageAlt: "Your Webflow site is just the beginning!",
    },
  ],
  faq: [],
  finalCta: null,
} satisfies IWebChatBuilderPage

const WEB_CHAT_BUILDER_PAGES = Object.freeze({
  webflow: WEBFLOW_PAGE,
})

export function getWebChatBuilderBySlug(
  slug: string
): IWebChatBuilderPage | undefined {
  return WEB_CHAT_BUILDER_PAGES[slug as keyof typeof WEB_CHAT_BUILDER_PAGES]
}

export function getAllWebChatBuilderSlugs(): string[] {
  return Object.keys(WEB_CHAT_BUILDER_PAGES)
}

export function getWebChatBuilderPathname(slug: string): string {
  return `/channels/web-chat/${slug}`
}
