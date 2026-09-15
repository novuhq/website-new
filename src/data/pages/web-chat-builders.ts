export interface IWebChatBuilderSeo {
  title: string
  description: string
}

export interface IWebChatBuilderHero {
  eyebrow: string
  title: string
  description: string
  command: string
}

export interface IWebChatBuilderSection {
  type: string
  [key: string]: unknown
}

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
  },
  sections: [],
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
