import { Route } from "next"
import {
  SanityAsset,
  SanityImageObject,
} from "@sanity/image-url/lib/types/types"
import { PortableTextBlock } from "sanity"

export type CustomerPage = {
  _id: string
  title: string
  subtitle: string
  featuredCustomers: {
    customer: Customer
    quote: string
    author: string
  }[]
  listTitle: string
}

export interface Customer {
  _id: string
  name: string
  slug: {
    current: string
  }
  logo: {
    asset: {
      url: string
      metadata: {
        dimensions: {
          width: number
          height: number
        }
      }
    }
  }
  logomark: {
    asset: {
      url: string
      metadata: {
        dimensions: {
          width: number
          height: number
        }
      }
    }
  }
  summary: string
  website: string
  founded: number
  location: string
  title: string
  lead: string
  bodyRaw: PortableTextBlock[]
  related?: Customer[]
  metaTitle?: string
  metaDescription?: string
  socialImage?: Omit<SanityImageObject, "asset"> & { asset: SanityAsset }
}
