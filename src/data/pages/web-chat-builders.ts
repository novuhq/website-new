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

export type WebChatBuilderMediaKey =
  | "blink-new-hero"
  | "lovable-hero"
  | "replit-hero"
  | "bolt-new-hero"
  | "sim-studio-hero"
  | "vellum-hero"
  | "flowise-hero"
  | "wordware-hero"
  | "crew-ai-hero"
  | "langgraph-hero"
  | "lindy-hero"
  | "stack-ai-hero"
  | "relevance-ai-hero"
  | "webflow-channels"

export interface IWebChatBuilderMedia {
  hero: WebChatBuilderMediaKey
  channels: WebChatBuilderMediaKey
}

export function resolveWebChatBuilderMedia<T>(
  media: IWebChatBuilderMedia,
  assets: Readonly<Record<WebChatBuilderMediaKey, T>>
): { hero: T; channels: T } {
  return {
    hero: assets[media.hero],
    channels: assets[media.channels],
  }
}

export interface IWebChatBuilderPage {
  slug: string
  builderName: string
  seo: IWebChatBuilderSeo
  hero: IWebChatBuilderHero
  media: IWebChatBuilderMedia
  sections: IWebChatBuilderSection[]
  faqTitle: string
  faq: IWebChatBuilderFaqItem[]
}

const WEB_CHAT_BUILDER_SHARED_CONTENT = {
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
  faqTitle: "Frequently asked questions",
  faq: [
    {
      question: "How do I add an AI chatbot to a Webflow site?",
      answer:
        "Connect your agent to Novu Web Chat, then paste the embed into a Webflow Embed element or site-wide custom code.",
    },
    {
      question: "Can I style it to match my Webflow design?",
      answer:
        "Customize the chat widget’s appearance to match the look and feel of your Webflow site.",
    },
    {
      question: "Is this human live chat?",
      answer:
        "Your agent receives visitors’ messages and replies directly in the same chat widget.",
    },
    {
      question: "Can the same agent reach users on WhatsApp or email?",
      answer:
        "Reach users across Slack, WhatsApp, email, and other channels through one workflow.",
    },
  ],
} satisfies Pick<IWebChatBuilderPage, "sections" | "faqTitle" | "faq">

type WebChatBuilderHeroMediaKey = Exclude<
  WebChatBuilderMediaKey,
  "webflow-channels"
>

function createWebChatBuilderPage({
  slug,
  builderName,
  heroName = builderName,
  heroMedia,
  kind,
}: {
  slug: string
  builderName: string
  heroName?: string
  heroMedia: WebChatBuilderHeroMediaKey
  kind: "app" | "agent"
}): IWebChatBuilderPage {
  const title =
    kind === "app"
      ? `Add an AI agent to your ${heroName} app`
      : `Add your ${heroName} agent to your website`
  const description =
    kind === "app"
      ? `Bring your AI agent to ${heroName} with one embed. Chat with users and reach them across messaging channels and email through one workflow. Your agent’s channel, not a generic widget.`
      : `Bring your ${heroName} agent to your website with one embed. Chat with visitors and reach them across messaging channels and email through one workflow. Your agent’s channel, not a generic widget.`
  const prompt =
    kind === "app"
      ? `Add Novu Web Chat to my ${heroName} app. Run npx novu connect --channel web-chat, then help me embed the chat in my app and connect it to my AI agent.`
      : `Add Novu Web Chat to my ${heroName} agent. Run npx novu connect --channel web-chat, then help me embed the chat on my website and connect it to the agent.`

  return {
    ...WEB_CHAT_BUILDER_SHARED_CONTENT,
    slug,
    builderName,
    media: { hero: heroMedia, channels: "webflow-channels" },
    seo: {
      title: `${title} | Novu Web Chat`,
      description,
    },
    hero: {
      eyebrow: `Web Chat for ${heroName}`,
      title,
      description,
      command: "npx novu connect --channel web-chat",
      prompt,
      promptLabel: "Copy Prompt",
    },
  }
}

const WEB_CHAT_BUILDER_PAGES = Object.freeze({
  "blink-new": createWebChatBuilderPage({
    slug: "blink-new",
    builderName: "Blink.new",
    heroMedia: "blink-new-hero",
    kind: "app",
  }),
  lovable: createWebChatBuilderPage({
    slug: "lovable",
    builderName: "Lovable",
    heroMedia: "lovable-hero",
    kind: "app",
  }),
  replit: createWebChatBuilderPage({
    slug: "replit",
    builderName: "Replit",
    heroMedia: "replit-hero",
    kind: "app",
  }),
  "bolt-new": createWebChatBuilderPage({
    slug: "bolt-new",
    builderName: "Bolt.new",
    heroMedia: "bolt-new-hero",
    kind: "app",
  }),
  "sim-studio": createWebChatBuilderPage({
    slug: "sim-studio",
    builderName: "Sim Studio",
    heroName: "Sim",
    heroMedia: "sim-studio-hero",
    kind: "agent",
  }),
  vellum: createWebChatBuilderPage({
    slug: "vellum",
    builderName: "Vellum",
    heroMedia: "vellum-hero",
    kind: "agent",
  }),
  flowise: createWebChatBuilderPage({
    slug: "flowise",
    builderName: "Flowise",
    heroMedia: "flowise-hero",
    kind: "agent",
  }),
  wordware: createWebChatBuilderPage({
    slug: "wordware",
    builderName: "Wordware",
    heroMedia: "wordware-hero",
    kind: "agent",
  }),
  "crew-ai": createWebChatBuilderPage({
    slug: "crew-ai",
    builderName: "CrewAI",
    heroMedia: "crew-ai-hero",
    kind: "agent",
  }),
  langgraph: createWebChatBuilderPage({
    slug: "langgraph",
    builderName: "LangGraph",
    heroMedia: "langgraph-hero",
    kind: "agent",
  }),
  lindy: createWebChatBuilderPage({
    slug: "lindy",
    builderName: "Lindy",
    heroMedia: "lindy-hero",
    kind: "agent",
  }),
  "stack-ai": createWebChatBuilderPage({
    slug: "stack-ai",
    builderName: "Stack AI",
    heroMedia: "stack-ai-hero",
    kind: "agent",
  }),
  "relevance-ai": createWebChatBuilderPage({
    slug: "relevance-ai",
    builderName: "Relevance AI",
    heroMedia: "relevance-ai-hero",
    kind: "agent",
  }),
})

export function getWebChatBuilderBySlug(
  slug: string
): IWebChatBuilderPage | undefined {
  if (!Object.hasOwn(WEB_CHAT_BUILDER_PAGES, slug)) return undefined

  return WEB_CHAT_BUILDER_PAGES[slug as keyof typeof WEB_CHAT_BUILDER_PAGES]
}

export function getAllWebChatBuilderSlugs(): string[] {
  return Object.keys(WEB_CHAT_BUILDER_PAGES)
}

export function getWebChatBuilderPathname(slug: string): string {
  return `/channels/web-chat/${slug}`
}
