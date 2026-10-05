import { cache } from "react"
import type { MDXModule } from "mdx/types"

import { getDirectoryImageAsset } from "./assets"
import { directoryFrontmatterSchema } from "./schema"
import {
  DIRECTORY_SLUGS,
  type DirectoryImageAsset,
  type DirectoryPost,
  type DirectorySlug,
} from "./types"

type DirectoryMdxModule = MDXModule & {
  metadata?: unknown
}

const directoryModuleLoaders = {
  healthcare: () => import("@/content/directory/healthcare.mdx"),
  "linear-inbox": () => import("@/content/directory/linear-inbox.mdx"),
} satisfies Record<DirectorySlug, () => Promise<MDXModule>>

function isDirectorySlug(slug: string): slug is DirectorySlug {
  return DIRECTORY_SLUGS.some((directorySlug) => directorySlug === slug)
}

function resolveImage(src: string, slug: DirectorySlug): DirectoryImageAsset {
  const asset = getDirectoryImageAsset(src)

  if (!asset) {
    throw new Error(`[directory] Unknown image in ${slug}: ${src}`)
  }

  return asset
}

export const getDirectoryPost = cache(
  async (slug: string): Promise<DirectoryPost | null> => {
    if (!isDirectorySlug(slug)) {
      return null
    }

    const module = (await directoryModuleLoaders[slug]()) as DirectoryMdxModule
    const parsed = directoryFrontmatterSchema.safeParse(module.metadata)

    if (!parsed.success) {
      throw new Error(
        `[directory] Invalid frontmatter for ${slug}: ${parsed.error.message}`
      )
    }

    const metadata = parsed.data

    return {
      Content: module.default,
      authors: metadata.authors.map(({ name, avatar }) => ({
        name,
        avatar: resolveImage(avatar, slug),
      })),
      demoLink: metadata.demoLink,
      description: metadata.description,
      ghSourceLink: metadata.ghSourceLink,
      images: metadata.images.map((image) => resolveImage(image, slug)),
      license: metadata.license,
      pathname: `/directory/${slug}`,
      slug,
      title: metadata.title,
      updatedAt: metadata.updatedAt,
    }
  }
)

export const getDirectoryPosts = cache(async (): Promise<DirectoryPost[]> => {
  const posts = await Promise.all(
    DIRECTORY_SLUGS.map((slug) => getDirectoryPost(slug))
  )

  return posts.filter((post): post is DirectoryPost => post !== null)
})
