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
  title: string
  author: string
  authorPosition: string
  cardType?: "big" | "small"
  link: {
    type: "external" | "story"
    url?: string
  }

  // About
  storyPhoto?: string
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
    authorLogo: {
      url: string
    }
    authorName: string
    authorPosition: string
  }

  // Challenges & Solution
  challengesSolution?: {
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
  tweetLink: string
}

export type TCustomerCard = Pick<
  ICustomerData,
  | "_id"
  | "name"
  | "logo"
  | "link"
  | "author"
  | "authorPosition"
  | "cardType"
  | "slug"
  | "title"
>

export interface ICustomersPageData {
  _id: string
  _type: "customers"
  cards: ICustomerData[]
  gridCustomers: {
    customer: TCustomerCard
  }[]
  tweets: ICustomerTweetData[]
}
