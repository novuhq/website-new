import type { MDXContent } from "mdx/types"

export const DIRECTORY_SLUGS = ["healthcare", "linear-inbox"] as const

export type DirectorySlug = (typeof DIRECTORY_SLUGS)[number]

export interface DirectoryImageAsset {
  alt: string
  height: number
  src: string
  width: number
}

export interface DirectoryAuthor {
  avatar: DirectoryImageAsset
  name: string
}

export interface DirectoryPost {
  Content: MDXContent
  authors: DirectoryAuthor[]
  demoLink: string
  description: string
  ghSourceLink: string
  images: DirectoryImageAsset[]
  license: string
  pathname: `/directory/${DirectorySlug}`
  slug: DirectorySlug
  title: string
  updatedAt: string
}
