import { type PortableTextBlock } from "next-sanity"

import { type ISeoFields, type ISlug } from "@/types/common"

export interface ISanityImageAsset {
  url: string
  metadata: {
    dimensions: {
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
  pathname: string
  logo: ISanityImage
  logomark?: ISanityImage
  title: string
  author: string
  author_position: string
  card_type?: "big" | "small"
  link: {
    type: "external" | "story"
    url?: string
  }

  // About
  story_photo?: string
  about: string
  industry: string
  channels: {
    email?: string
    inbox?: string
    sms?: string
  }

  socials: {
    x?: string
    linkedin?: string
    website?: string
  }

  // Quote
  quote?: {
    title: string
    author_logo: {
      url: string
    }
    author_name: string
    author_position: string
  }

  // Challenges & Solution
  challenges_solution?: {
    challenges: string[]
    solution: string[]
  }

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

export type TCustomerCard = {
  customer: Pick<
    ICustomerData,
    | "_id"
    | "name"
    | "logo"
    | "link"
    | "author"
    | "author_position"
    | "card_type"
    | "slug"
    | "title"
  >
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
    customer: TCustomerCard
  }[]
  tweets: ICustomerTweetData[]
}
