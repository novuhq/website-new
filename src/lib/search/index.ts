import { ROUTE } from "@/constants/routes"

import { portableToPlain } from "@/lib/sanity/utils/portable-to-plain"

import { getAllPostsWithExcerpt, getLatestPostsWithExcerpt } from "../blog"

export interface BlogSearchResult {
  id: string
  title: string
  description?: string
  icon: string
  url: string
  publishedAt: string
  categoryTitle: string
  categorySlug: string
  excerpt?: string
}

/**
 * Search through blog posts
 * @param query - The search query
 * @param limit - Maximum number of results to return
 * @returns Array of search results
 */
export async function searchBlogPosts(
  query: string,
  limit: number = 10
): Promise<BlogSearchResult[]> {
  if (!query.trim()) {
    return []
  }

  const posts = await getAllPostsWithExcerpt(false)
  const searchTerm = query.toLowerCase()

  const results = posts
    .filter((post) => {
      // Search in title
      if (post.title.toLowerCase().includes(searchTerm)) {
        return true
      }

      // Search in caption/description
      if (post.caption?.toLowerCase().includes(searchTerm)) {
        return true
      }

      // Search in content (first 500 characters for performance)
      if (portableToPlain(post.content).toLowerCase().includes(searchTerm)) {
        return true
      }

      // Search in category
      if (post.category.title.toLowerCase().includes(searchTerm)) {
        return true
      }

      return false
    })
    .map((post) => ({
      id: post.slug.current,
      title: post.title,
      description: post.caption,
      icon: "file-text",
      url: `${ROUTE.blog}/${post.slug.current}`,
      publishedAt: post.publishedAt,
      categoryTitle: post.category.title,
      categorySlug: post.category.slug.current,
      excerpt: getExcerpt(portableToPlain(post.content), searchTerm),
    }))
    .sort((a, b) => {
      // Prioritize title matches
      const aTitleMatch = a.title.toLowerCase().includes(searchTerm)
      const bTitleMatch = b.title.toLowerCase().includes(searchTerm)

      if (aTitleMatch && !bTitleMatch) return -1
      if (!aTitleMatch && bTitleMatch) return 1

      // Then sort by publication date (newest first)
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    })
    .slice(0, limit)

  return results
}

/**
 * Get a relevant excerpt from the content around the search term
 * @param content - The post content
 * @param searchTerm - The search term to highlight
 * @returns Excerpt with search term context
 */
function getExcerpt(content: string, searchTerm: string): string | undefined {
  if (!content) return undefined

  const index = content.toLowerCase().indexOf(searchTerm)
  if (index === -1) return undefined

  const start = Math.max(0, index - 100)
  const end = Math.min(content.length, index + searchTerm.length + 100)

  let excerpt = content.slice(start, end)

  // Add ellipsis if we're not at the beginning/end
  if (start > 0) excerpt = "..." + excerpt
  if (end < content.length) excerpt = excerpt + "..."

  return excerpt
}

/**
 * Get recent blog posts for search suggestions
 * @param limit - Maximum number of posts to return
 * @returns Array of recent posts formatted for search
 */
export async function getRecentBlogPosts(
  limit: number = 5
): Promise<BlogSearchResult[]> {
  const posts = await getLatestPostsWithExcerpt(limit, false)

  return posts.map((post) => ({
    id: post.slug.current,
    title: post.title,
    description: post.caption,
    icon: "file-text",
    url: `${ROUTE.blog}/${post.slug.current}`,
    publishedAt: post.publishedAt,
    categoryTitle: post.category.title,
    categorySlug: post.category.slug.current,
  }))
}
