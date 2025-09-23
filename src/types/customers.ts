import { type PortableTextBlock } from "next-sanity"

import { type ISeoFields, type ISlug } from "@/types/common"

export interface ISanityImage {
  url: string
  width: number
  height: number
}

export interface ICustomerCardData {
  _id: string
  name: string
  slug: ISlug
  logo: ISanityImage
  quoteText: string
  quoteAuthorName: string
  quoteAuthorPosition: string
}

export interface ICustomersGridData {
  _id: string
  name: string
  slug?: ISlug
  url?: string
  logo: ISanityImage
  title: string
  isFeatured: boolean
  category: {
    _id: string
    name: string
  }
  channelsList: string[]
  about?: string
}

export interface ICustomerData {
  _id: string
  _type: "customer"
  name: string
  type: "external" | "story"
  url?: string
  slug?: ISlug
  pathname?: string
  logo: ISanityImage
  title: string
  category?: {
    _id: string
    name: string
  }
  isFeatured?: boolean
  channelsList?: string[]
  storyPhoto?: string
  about?: string
  industry?: string
  quote?: {
    text?: string
    photo?: ISanityImage
    authorName?: string
    authorPosition?: string
  }
  challengesSolution?: {
    challenges: string[]
    solution: string[]
  }
  body?: PortableTextBlock[]
  related?: ICustomerData[]
  seo?: ISeoFields
}

export interface ICustomerTweetData {
  text: string
  logo?: ISanityImage
  name: string
  tag: string
  tweetLink: string
}

export interface ICustomersPageData {
  _id: string
  _type: "customers"
  cards: ICustomerCardData[]
  customersGrid: ICustomersGridData[]
  tweets: ICustomerTweetData[]
}
