import { type Route } from "next"
import { type PortableTextBlock } from "next-sanity"

import {
  type ISeoFields,
  type ISlug,
  type ITableOfContentsItem,
} from "@/types/common"
import {
  type ITemplateAvatarData,
  type ITemplateChannelData,
  type ITemplateMcpServerData,
} from "@/types/templates"

export interface IHowToCategoryData {
  id: string
  title: string
  description?: string
  slug: ISlug
}

export interface IHowToCategory extends IHowToCategoryData {
  url: Route<string>
}

export interface IHowToCompanyData {
  id: string
  name: string
}

export interface IHowToAuthorData {
  name: string
  company?: IHowToCompanyData | null
  avatar?: ITemplateAvatarData | null
}

export type THowToCoverMode = "generated" | "custom" | "none"
export type THowToCoverTemplate = "default" | "template-1" | "template-2"

export interface IHowToPostData {
  _type: "howToPost"
  _createdAt: string
  title: string
  slug: ISlug
  url: Route<string>
  caption: string
  author: IHowToAuthorData
  summary: string
  category: IHowToCategoryData
  mcpServerList: ITemplateMcpServerData[]
  channels: ITemplateChannelData[]
  useTemplateUrl?: string
  readDocsUrl?: string
  coverMode?: THowToCoverMode
  coverTemplate?: THowToCoverTemplate
  coverText?: string
  customCover?: string
  cover?: string
  coverAlt?: string
  publishedAt: string
  content: PortableTextBlock[]
  seo: ISeoFields
}

export interface IHowToPost extends IHowToPostData {
  category: IHowToCategory
}

export interface IHowToPostWithTableOfContents extends IHowToPost {
  tableOfContents: ITableOfContentsItem[]
}

export interface IHowToIndexData {
  categories: IHowToCategory[]
  connectors: ITemplateMcpServerData[]
  posts: IHowToPost[]
}
