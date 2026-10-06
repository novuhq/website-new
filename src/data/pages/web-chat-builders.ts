import {
  getWebChatBuilderPathname,
  WEB_CHAT_BUILDER_LIST,
  type WebChatBuilderSlug,
} from "@/data/pages/web-chat-builder-list"

// The one command every builder page tells visitors to run.
const CONNECT_COMMAND = "npx novu connect --channel web-chat"

interface IWebChatBuilderSeo {
  title: string
  description: string
}

interface IWebChatBuilderHeroBadge {
  label: string
  logo: string
}

export interface IWebChatBuilderHero {
  eyebrow: string
  title: string
  description: string
  command: string
  prompt: string
  promptLabel: string
  badge: IWebChatBuilderHeroBadge
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

type IWebChatBuilderSection =
  | IWebChatBuilderPrimarySection
  | IWebChatBuilderSecondarySection
  | IWebChatBuilderTertiarySection

interface IWebChatBuilderFaqItem {
  question: string
  answer: string
}

interface IWebChatBuilderCta {
  title: string
  description: string
  command: string
}

export interface IWebChatBuilderPage {
  slug: string
  builderName: string
  seo: IWebChatBuilderSeo
  hero: IWebChatBuilderHero
  sections: IWebChatBuilderSection[]
  faqTitle: string
  faq: IWebChatBuilderFaqItem[]
  cta: IWebChatBuilderCta
}

function createWebChatBuilderSharedContent({
  builderName,
}: {
  builderName: string
}): Pick<IWebChatBuilderPage, "sections" | "faqTitle" | "faq" | "cta"> {
  const destination = `${builderName} app`
  const destinationPhrase = `your ${destination}`

  return {
    sections: [
      {
        type: "primary",
        id: "web-chat-builder-features",
        title: `Your agent, live in ${destinationPhrase}`,
        features: [
          {
            title: "One-snippet embed",
            description: `Paste one script tag into ${destinationPhrase}.`,
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
        title: `How to add an AI agent to ${destinationPhrase} in five steps`,
        description: "No webhooks, no OAuth, a few minutes.",
        steps: [
          {
            description: "Connect your agent to Novu Web Chat:\nrun ",
            command: CONNECT_COMMAND,
          },
          {
            description:
              "Give your agent its instructions\nin the Novu dashboard, so it has something to say.",
          },
          {
            description:
              "Copy your one-line Web Chat embed,\na single script tag.",
          },
          {
            description: `Paste the embed where you want the widget in ${destinationPhrase}.`,
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
        description: `Your agent’s logic works across ${destinationPhrase} and every channel. Novu handles delivery through one workflow. Run the command to connect Web Chat.`,
        command: CONNECT_COMMAND,
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
        imageAlt: `Your ${destination} is just the beginning!`,
      },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        question: `How do I add an AI chatbot to a ${destination}?`,
        answer: `Connect your agent to Novu Web Chat, give it instructions in the Novu dashboard, then paste the embed into ${destinationPhrase}.`,
      },
      {
        question: `Can I style it to match my ${destination}?`,
        answer: `Customize the chat widget’s appearance to match the look and feel of ${destinationPhrase}.`,
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
    cta: {
      title: `Give ${destinationPhrase} an AI agent`,
      description: `Bring the agent you built. Novu puts it in ${destinationPhrase} and reaches your users on every channel from one workflow.`,
      command: CONNECT_COMMAND,
    },
  }
}

function createWebChatBuilderPage({
  slug,
  builderName,
}: {
  slug: string
  builderName: string
}): IWebChatBuilderPage {
  const title = `Add an AI agent to your ${builderName} app`
  const description = `Bring your AI agent to ${builderName} with one embed. Chat with users and reach them across messaging channels and email through one workflow. Your agent’s channel, not a generic widget.`
  const prompt = `Add Novu Web Chat to my ${builderName} app. Run npx novu connect --channel web-chat, then help me embed the chat in my app and connect it to my AI agent.`

  return {
    ...createWebChatBuilderSharedContent({ builderName }),
    slug,
    builderName,
    seo: {
      title: `${title} | Novu Web Chat`,
      description,
    },
    hero: {
      eyebrow: `Web Chat for ${builderName}`,
      title,
      description,
      command: CONNECT_COMMAND,
      prompt,
      promptLabel: "Copy Prompt",
      // The hero artwork is shared, so the builder is named on an overlay
      // instead of being baked into one near-identical export per builder.
      badge: {
        label: `Built with ${builderName}`,
        logo: slug,
      },
    },
  }
}

const WEB_CHAT_BUILDER_PAGES: Readonly<
  Record<WebChatBuilderSlug, IWebChatBuilderPage>
> = Object.freeze(
  Object.fromEntries(
    WEB_CHAT_BUILDER_LIST.map(({ slug, builderName }) => [
      slug,
      createWebChatBuilderPage({ slug, builderName }),
    ])
  ) as Record<WebChatBuilderSlug, IWebChatBuilderPage>
)

export function getWebChatBuilderBySlug(
  slug: string
): IWebChatBuilderPage | undefined {
  if (!Object.hasOwn(WEB_CHAT_BUILDER_PAGES, slug)) return undefined

  return WEB_CHAT_BUILDER_PAGES[slug as WebChatBuilderSlug]
}

export function getAllWebChatBuilderSlugs(): string[] {
  return Object.keys(WEB_CHAT_BUILDER_PAGES)
}

export function getAllWebChatBuilders(): IWebChatBuilderPage[] {
  return Object.values(WEB_CHAT_BUILDER_PAGES)
}

export { getWebChatBuilderPathname, type WebChatBuilderSlug }
