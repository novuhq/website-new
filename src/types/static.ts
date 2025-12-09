import { type PortableTextBlock } from "next-sanity"

import {
  type ISeoFields,
  type ISlug,
  type ITableOfContentsItem,
} from "@/types/common"

export interface IStaticPage {
  _type: "staticPage"
  title: string
  slug: ISlug
  publishedAt: string
  content: PortableTextBlock[]
  seo: ISeoFields
}

export interface IStaticPageWithTableOfContents extends IStaticPage {
  tableOfContents: ITableOfContentsItem[]
}
