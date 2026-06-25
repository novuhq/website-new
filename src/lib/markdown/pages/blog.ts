import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import {
  getAllPosts,
  getCategoryBySlug,
  getPostBySlug,
  getPostsByCategory,
} from "@/lib/blog"

import { pageFromSeo, postListMarkdown } from "../page-utils"
import { portableTextToMarkdown } from "../portable-text-to-markdown"
import type { MarkdownPage, MarkdownResult } from "../types"

export async function getBlogListing(
  pathname: string
): Promise<MarkdownResult | null> {
  if (
    /^\/blog\/page\/\d+$/.test(pathname) ||
    /^\/blog\/category\/[^/]+\/page\/\d+$/.test(pathname)
  ) {
    return { type: "not-found" }
  }

  if (pathname === "/blog") {
    const posts = await getAllPosts(false)

    return {
      type: "page",
      page: pageFromSeo(
        {
          title: `${SEO_DATA.blog.title} | ${config.projectName}`,
          description: SEO_DATA.blog.description,
          pathname: "/blog",
        },
        [`## All posts`, postListMarkdown(posts)].join("\n\n")
      ),
    }
  }

  const categoryMatch = pathname.match(/^\/blog\/category\/([^/]+)$/)
  if (!categoryMatch) return null

  const category = categoryMatch[1]
  const [categoryData, posts] = await Promise.all([
    getCategoryBySlug(category, false),
    getPostsByCategory(category, false),
  ])

  if (!categoryData) {
    return { type: "not-found" }
  }

  return {
    type: "page",
    page: pageFromSeo(
      {
        title: `${SEO_DATA.blog.title}: ${categoryData.title} | ${config.projectName}`,
        description: `${categoryData.title} ${SEO_DATA.blog.description}`,
        pathname: `${ROUTE.blogCategory}/${category}`,
      },
      [`## All posts in ${categoryData.title}`, postListMarkdown(posts)].join(
        "\n\n"
      )
    ),
  }
}

export async function getBlogPost(
  pathname: string
): Promise<MarkdownPage | null> {
  const match = pathname.match(/^\/blog\/([^/]+)$/)
  if (!match) return null

  const post = await getPostBySlug(match[1], false)
  if (!post) return null

  const authors = post.authors?.map((author) => author.name).filter(Boolean)
  const body = [
    post.caption,
    authors?.length ? `Authors: ${authors.join(", ")}` : "",
    post.publishedAt ? `Published: ${post.publishedAt}` : "",
    post.category?.title ? `Category: ${post.category.title}` : "",
    portableTextToMarkdown(post.content),
  ]
    .filter(Boolean)
    .join("\n\n")

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.caption,
    pathname: `/blog/${post.slug.current}`,
    body,
    updatedAt: post.publishedAt,
    noIndex: post.seo?.noIndex,
  }
}
