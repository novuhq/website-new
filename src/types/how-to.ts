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

export interface IHowToPostData {
  _type: "howToPost"
  _createdAt: string
  title: string
  slug: ISlug
  url: Route<string>
  caption: string
  agentName: string
  summary: string
  avatar: ITemplateAvatarData
  category: IHowToCategoryData
  mcpServerList: ITemplateMcpServerData[]
  channels: ITemplateChannelData[]
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
