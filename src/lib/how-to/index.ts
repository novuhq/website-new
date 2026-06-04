import { ROUTE } from "@/constants/routes"

import {
  type IHowToCategory,
  type IHowToCategoryData,
  type IHowToIndexData,
  type IHowToPost,
  type IHowToPostData,
  type IHowToPostWithTableOfContents,
} from "@/types/how-to"
import { type ITemplateMcpServerData } from "@/types/templates"
import { getHowToCoverPath, getHowToCoverText } from "@/lib/how-to/cover"
import { sanityFetch } from "@/lib/sanity/client"
import {
  howToIndexQuery,
  howToPostBySlugQuery,
  howToPostsQuery,
  howToRelatedPostsByCategoryQuery,
} from "@/lib/sanity/queries/how-to"
import { getTableOfContents } from "@/lib/sanity/utils/get-table-of-contents"

export const REVALIDATE_HOW_TO_TAG = "howTo"

function transformCategory(category: IHowToCategoryData): IHowToCategory {
  return {
    ...category,
    url: `${ROUTE.connectHowTo}#${category.id}`,
  }
}

function getAbsoluteUrl(path: string, siteUrl: string) {
  return path.startsWith("http") ? path : `${siteUrl}${path}`
}

function resolvePostCover(post: IHowToPostData) {
  const hasCoverFields =
    post.coverMode || post.coverTemplate || post.coverText || post.customCover

  if (!hasCoverFields) {
    return post.cover
  }

  const coverMode =
    post.coverMode ?? (post.customCover ? "custom" : "generated")

  if (coverMode === "none") {
    return undefined
  }

  if (coverMode === "custom" && post.customCover) {
    return post.customCover
  }

  return getHowToCoverPath({
    template: post.coverTemplate,
    title: getHowToCoverText({
      coverText: post.coverText,
      title: post.title,
    }),
  })
}

function transformPost(post: IHowToPostData): IHowToPost {
  const cover = resolvePostCover(post)

  return {
    ...post,
    ...(cover ? { cover } : {}),
    url: `${ROUTE.connectHowTo}/${post.slug.current}`,
    category: transformCategory(post.category),
  }
}

export async function getHowToIndexData(
  preview = false
): Promise<IHowToIndexData> {
  const data = await sanityFetch<{
    categories: IHowToCategoryData[]
    connectors: ITemplateMcpServerData[]
    posts: IHowToPostData[]
  }>({
    query: howToIndexQuery,
    preview,
    tags: [REVALIDATE_HOW_TO_TAG],
  })

  return {
    categories: (data.categories ?? []).map(transformCategory),
    connectors: data.connectors ?? [],
    posts: (data.posts ?? []).map(transformPost),
  }
}

export async function getAllHowToPosts(preview = false): Promise<IHowToPost[]> {
  const posts = await sanityFetch<IHowToPostData[]>({
    query: howToPostsQuery,
    preview,
    tags: [REVALIDATE_HOW_TO_TAG],
  })

  return (posts ?? []).map(transformPost)
}

export async function getHowToPostBySlug(
  slug: string,
  preview = false
): Promise<IHowToPostWithTableOfContents | null> {
  const siteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || ""
  const post = await sanityFetch<IHowToPostData | null>({
    query: howToPostBySlugQuery,
    qParams: { slug },
    preview,
    tags: [REVALIDATE_HOW_TO_TAG],
  })

  if (!post) {
    return null
  }

  const transformedPost = transformPost(post)
  const fallbackSocialImage = transformedPost.cover
    ? getAbsoluteUrl(transformedPost.cover, siteUrl)
    : getAbsoluteUrl(
        getHowToCoverPath({
          template: post.coverTemplate,
          title: getHowToCoverText({
            coverText: post.coverText,
            title: post.title,
          }),
        }),
        siteUrl
      )

  return {
    ...transformedPost,
    tableOfContents: getTableOfContents(post.content),
    seo: {
      ...post.seo,
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.caption,
      socialImage: post.seo?.socialImage ?? fallbackSocialImage,
      noIndex: post.seo?.noIndex || false,
    },
  }
}

export async function getRelatedHowToPosts(
  slug: string,
  categorySlug: string,
  limit = 6,
  preview = false
): Promise<IHowToPost[]> {
  const posts = await sanityFetch<IHowToPostData[]>({
    query: howToRelatedPostsByCategoryQuery,
    qParams: { slug, categorySlug, limit },
    preview,
    tags: [REVALIDATE_HOW_TO_TAG],
  })

  return (posts ?? []).map(transformPost)
}
