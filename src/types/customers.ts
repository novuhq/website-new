import { type PortableTextBlock } from "next-sanity"

import { type ISeoFields, type ISlug } from "@/types/common"

export interface ISanityImageAsset {
  url: string
  metadata?: {
    dimensions?: {
      width: number
      height: number
    }
    lqip?: string
  }
}

export interface ISanityImage {
  url: string
  asset: ISanityImageAsset
}

export interface ICustomerData {
  _id: string
  _type: "customer"
  name: string
  slug: ISlug
  pathname: string;
  logo: ISanityImage
  logomark: ISanityImage
  title: string
  author: string
  author_position: string
  card_type: "big" | "small"
  link_type: "external" | "story"
  external_link?: string

  // Story-specific fields
  story_photo?: ISanityImage
  about?: string
  industry?: string

  // Channels
  email_channels?: string
  inbox_channels?: string
  sms_channels?: string

  // Quote
  quote_title?: string
  quote_author_logo?: {
    url: string
  }
  quote_author_name?: string
  quote_author_position?: string

  // Challenges & Solution
  key_challenges?: string[]
  novu_solution?: string[]

  // Content
  body: PortableTextBlock[]
  related?: ICustomerData[]

  // SEO (only for stories)
  seo?: ISeoFields
}

export interface ICustomerTweetData {
  text: string
  logo: ISanityImage
  name: string
  tag: string
  tweet_link: string
}

export interface ICustomersPageData {
  _id: string
  _type: "customers"
  small_cards: {
    customer: ICustomerData
  }[]
  big_cards: {
    customer: ICustomerData
  }[]
  grid_customers: {
    customer: ICustomerData
  }[]
  tweets: ICustomerTweetData[]
}

export interface ICustomerWithNeighbors {
  customer: ICustomerData
}
