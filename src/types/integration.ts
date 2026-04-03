import type { Route } from "next"

export type IntegrationTabType = "channels" | "sources"

export interface IIntegrationRelatedArticle {
  title: string
  href: string | Route<string>
  icon?: string
}

export interface IIntegrationSeo {
  title?: string
  description?: string
  noIndex?: boolean
}

export interface IIntegration {
  slug: string
  title: string
  tab: IntegrationTabType
  category: string
  badge: string
  icon: string
  tagline: string
  description: string
  docsUrl?: string
  order: number
  features?: string[]
  relatedProviders: string[]
  relatedArticles: IIntegrationRelatedArticle[]
  seo?: IIntegrationSeo
  primaryCtaLabel?: string
  primaryCtaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  rawBody: string
  pathname: Route<string>
}

export interface IIntegrationCategoryMeta {
  slug: string
  title: string
  description: string
  order: number
  tab: IntegrationTabType
}
