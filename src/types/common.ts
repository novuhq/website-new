import { ReactNode } from "react"
import { type Route } from "next"
import { PortableTextBlock } from "@portabletext/react"
import { type BundledLanguage } from "shiki/langs"

import { type TSocialIcons } from "@/components/icons"

export interface IMenuItem {
  label: string
  href: Route<string> | URL
  isNew?: boolean
  children?: IMenuItem[]
}

export interface IMenuSocialItem extends IMenuItem {
  icon: TSocialIcons
}

export interface IMenuHeaderCard {
  title: string
  description: string
  image: string
  href: Route<string> | URL
}

export interface IMenuHeaderContent {
  subtitle: string
  type?: "changelog" | "blog" | "link"
  items?: IMenuItem[]
  card?: IMenuHeaderCard
}

export interface IMenuHeaderItem {
  title: string
  href?: Route<string> | URL
  content?: IMenuHeaderContent[]
}

export interface IMenuFooterItem {
  title: string
  items: IMenuItem[]
}

export interface ISlug {
  current: string
}

export interface IBreadcrumbItem {
  title: string
  url?: string
}

export type TTableTheme = "outline" | "filled"

export interface ITableOfContentsItem {
  title: string
  anchor: string
  level: number
}

export interface ICodeBlock {
  code: string
  language: BundledLanguage
  fileName?: string
  highlightedLines?: string
}

export interface IAuthor {
  photo?: string
  name?: string
}

export interface IBlockquote {
  quote: string
  authors?: IAuthor | IAuthor[]
  role?: string
}

export interface IVideo {
  src: string
  alt?: string
  width?: number
  height?: number
  poster?: string
  autoplay?: boolean
  controls?: boolean
  muted?: boolean
  loop?: boolean
}

export interface IAdmonition {
  title?: string
  children: ReactNode
}

export interface IDetailsToggle {
  title: string
  children: ReactNode
}

export interface IYouTubeEmbed {
  youtubeId: string
  cover?: string
}

export interface ISeoFields {
  title: string
  description: string
  socialImage: string
  noIndex: boolean
}

export type TSectionAction =
  | { kind: "primary-button"; label: string; href: Route<string> | URL }
  | { kind: "secondary-button"; label: string; href: Route<string> | URL }
  | { kind: "link"; label: string; href: Route<string> | URL }
  | { kind: "subscription-form"; placeholder: string; buttonText: string }

export interface ICtaSection {
  title: string
  description: string | ReactNode
  actions: TSectionAction[]
}

export interface ITabsBlock {
  label: string
  content: PortableTextBlock
}
