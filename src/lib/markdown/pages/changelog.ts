import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import {
  getChangelogPostBySlug,
  getChangelogPosts,
  getChangelogPostsByCategory,
} from "@/lib/changelog"

import { pageFromSeo, postListMarkdown } from "../page-utils"
import { portableTextToMarkdown } from "../portable-text-to-markdown"
import type { MarkdownPage } from "../types"

export async function getChangelog(
  pathname: string
): Promise<MarkdownPage | null> {
  if (pathname === "/changelog") {
    const posts = await getChangelogPosts(false)

    return pageFromSeo(
      SEO_DATA.changelog,
      [`## Product updates`, postListMarkdown(posts)].join("\n\n")
    )
  }

  const categoryMatch = pathname.match(/^\/changelog\/category\/([^/]+)$/)
  if (categoryMatch) {
    const posts = await getChangelogPostsByCategory(categoryMatch[1], false)
    if (!posts) return null

    const categoryTitle =
      posts[0]?.categories?.find(
        (category) => category.slug.current === categoryMatch[1]
      )?.title || categoryMatch[1]

    return pageFromSeo(
      {
        title: `${categoryTitle} | Changelog | Novu`,
        description: `Latest updates and improvements in the ${categoryTitle.toLowerCase()} category.`,
        pathname: `${ROUTE.changelog}/category/${categoryMatch[1]}`,
      },
      [`## ${categoryTitle} updates`, postListMarkdown(posts)].join("\n\n")
    )
  }

  const postMatch = pathname.match(/^\/changelog\/([^/]+)$/)
  if (!postMatch) return null

  const entry = await getChangelogPostBySlug(postMatch[1], false)
  if (!entry) return null

  const { post } = entry
  const body = [
    post.caption,
    post.publishedAt ? `Published: ${post.publishedAt}` : "",
    post.categories?.length
      ? `Categories: ${post.categories.map((category) => category.title).join(", ")}`
      : "",
    portableTextToMarkdown(post.content),
  ]
    .filter(Boolean)
    .join("\n\n")

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.caption,
    pathname: `/changelog/${post.slug.current}`,
    body,
    updatedAt: post.publishedAt || post._createdAt,
    noIndex: post.seo?.noIndex,
  }
}
