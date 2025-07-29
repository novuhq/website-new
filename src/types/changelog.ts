import { type PortableTextBlock } from "next-sanity"

import { type IAuthor, type ISeoFields, type ISlug } from "@/types/common"

export interface IAuthorData extends Omit<IAuthor, "photo" | "name"> {
  photo: string
  name: string
  description?: string
  position?: string
}

export interface IChangelogCategoryData {
  id: string
  title: string
  slug: ISlug
}

export interface IChangelogPostData {
  _type: "changelogPost"
  title: string
  slug: ISlug
  pathname: string
  authors: IAuthorData[]
  cover?: string
  categories?: IChangelogCategoryData[]
  isFeatured: boolean
  publishedAt: string
  caption?: string
  content: PortableTextBlock[]
  seo: ISeoFields
}

export interface IChangelogPostWithNeighbors {
  post: IChangelogPostData
  previousChangelog: {
    title: string | null
    slug: string | null
  }
  nextChangelog: {
    title: string | null
    slug: string | null
  }
}
