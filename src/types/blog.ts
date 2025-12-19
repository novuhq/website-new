import { type Route } from "next"
import { type PortableTextBlock } from "next-sanity"

import {
  type IAuthor,
  type ISeoFields,
  type ISlug,
  type ITableOfContentsItem,
} from "@/types/common"

export interface IAuthorData extends Omit<IAuthor, "photo" | "name"> {
  photo: string
  name: string
  description?: string
  position?: string
}

export interface ICategoryData {
  title: string
  slug: ISlug
}

export interface ICategory extends ICategoryData {
  url: Route<string>
}

export interface IPostData {
  _type: "blogPost"
  title: string
  slug: ISlug
  url: Route<string>
  authors: IAuthorData[]
  cover: string
  category: ICategoryData
  isFeatured: boolean
  publishedAt: string
  caption: string
  content: PortableTextBlock[]
  seo: ISeoFields
}

export interface IPost extends IPostData {
  category: ICategory
}

export interface IPostWithTableOfContents extends IPost {
  tableOfContents: ITableOfContentsItem[]
}
