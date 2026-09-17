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

export interface IWebChatBuilderCta {
  title: string
  description: string
  command: string
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
  cta: IWebChatBuilderCta
}

type WebChatBuilderKind = "app" | "agent"

function createWebChatBuilderSharedContent({
  heroName,
  kind,
}: {
  heroName: string
  kind: WebChatBuilderKind
}): Pick<IWebChatBuilderPage, "sections" | "faqTitle" | "faq" | "cta"> {
  const isApp = kind === "app"
  const destination = isApp ? `${heroName} app` : "website"
  const destinationPhrase = `your ${destination}`
  const agentLabel = isApp ? "Your agent" : `Your ${heroName} agent`
  const agentLabelLower = isApp ? "your agent" : `your ${heroName} agent`
  const livePreposition = isApp ? "in" : "on"
  const embedPreposition = isApp ? "into" : "on"
  const setupTitle = isApp
    ? `How to add an AI agent to your ${heroName} app in four steps`
    : `How to add your ${heroName} agent to your website in four steps`
  const ctaTitle = isApp
    ? `Give your ${heroName} app an AI agent`
    : `Bring your ${heroName} agent to your website`

  return {
    sections: [
      {
        type: "primary",
        id: "web-chat-builder-features",
        title: `${agentLabel}, live ${livePreposition} ${destinationPhrase}`,
        features: [
          {
            title: "One-snippet embed",
            description: `Paste one script tag ${embedPreposition} ${destinationPhrase}.`,
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
            description: `Customize the chat widget’s appearance to match the look and feel of ${destinationPhrase}.`,
            icon: "theme",
          },
          {
            title: "Two-way",
            description: `${agentLabel} receives visitors’ messages and replies directly in the same chat widget.`,
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
        title: setupTitle,
        description: "No webhooks, no OAuth, about two minutes.",
        steps: [
          {
            description: `Connect ${agentLabelLower} to Novu Web Chat:\nrun `,
            command: "npx novu connect --channel web-chat",
          },
          {
            description:
              "Copy your one-line Web Chat embed,\na single script tag.",
          },
          {
            description: `Paste the embed where you want the widget ${livePreposition} ${destinationPhrase}.`,
          },
          {
            description: `Publish. ${agentLabel} is live in the chat,\nreplying to visitors.`,
          },
        ],
      },
      {
        type: "tertiary",
        id: "web-chat-builder-channels",
        title: "One workflow, every channel",
        description: `${agentLabel}’s logic works across ${destinationPhrase} and every channel. Novu handles delivery through one workflow. Run the command to connect Web Chat.`,
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
        imageAlt: isApp
          ? `Your ${heroName} app is just the beginning!`
          : `Your ${heroName} agent is just the beginning!`,
      },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        question: isApp
          ? `How do I add an AI chatbot to a ${heroName} app?`
          : `How do I add my ${heroName} agent to a website?`,
        answer: `Connect ${agentLabelLower} to Novu Web Chat, then paste the embed ${embedPreposition} ${destinationPhrase}.`,
      },
      {
        question: `Can I style it to match my ${destination}?`,
        answer: `Customize the chat widget’s appearance to match the look and feel of ${destinationPhrase}.`,
      },
      {
        question: "Is this human live chat?",
        answer: `${agentLabel} receives visitors’ messages and replies directly in the same chat widget.`,
      },
      {
        question: "Can the same agent reach users on WhatsApp or email?",
        answer:
          "Reach users across Slack, WhatsApp, email, and other channels through one workflow.",
      },
    ],
    cta: {
      title: ctaTitle,
      description: `Bring the agent you built. Novu puts it ${livePreposition} ${destinationPhrase} and reaches your users on every channel from one workflow.`,
      command: "npx novu connect --channel web-chat",
    },
  }
}

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
  kind: WebChatBuilderKind
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
    ...createWebChatBuilderSharedContent({ heroName, kind }),
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

export type WebChatBuilderSlug = keyof typeof WEB_CHAT_BUILDER_PAGES

export function getAllWebChatBuilderSlugs(): string[] {
  return Object.keys(WEB_CHAT_BUILDER_PAGES)
}

export function getAllWebChatBuilders(): IWebChatBuilderPage[] {
  return Object.values(WEB_CHAT_BUILDER_PAGES)
}

export function getWebChatBuilderPathname(slug: string): string {
  return `/channels/web-chat/${slug}`
}
