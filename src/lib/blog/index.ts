import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"

import {
  ICategory,
  ICategoryData,
  IPost,
  IPostData,
  IPostWithTableOfContents,
} from "@/types/blog"
import { sanityFetch } from "@/lib/sanity/client"
import {
  categoriesQuery,
  categoryBySlugQuery,
  featuredPostQuery,
  latestPostsQuery,
  paginatedNonFeaturedPostsByCategoryQuery,
  paginatedNonFeaturedPostsQuery,
  paginatedPostsByCategoryQuery,
  paginatedPostsQuery,
  postBySlugQuery,
  postsByCategoryQuery,
  postsQuery,
  postsWithExcerptQuery,
  totalPostsByCategoryQuery,
  totalPostsQuery,
} from "@/lib/sanity/queries/blog"
import { getTableOfContents } from "@/lib/sanity/utils/get-table-of-contents"

const POSTS_PER_PAGE = config.blog.postsPerPage
const REVALIDATE_BLOG_TAG = "blog"

/**
 * Transforms a category data object from Sanity into the application's category format
 * @param category - The raw category data from Sanity
 *
 * @returns A formatted category object with URL
 */
function transformCategory(category: ICategoryData): ICategory {
  return {
    ...category,
    url: `${ROUTE.blogCategory}/${category.slug.current}`,
  }
}

/**
 * Transforms a post data object from Sanity into the application's post format
 * @param post - The raw post data from Sanity
 *
 * @returns A formatted post object with transformed category
 */
function transformPost(post: IPostData): IPost {
  return {
    ...post,
    url: `${ROUTE.blog}/${post.slug.current}`,
    category: transformCategory(post.category),
  }
}

/**
 * Fetches the featured post from Sanity
 * @param preview - Whether to use preview mode
 *
 * @returns The featured post or null if none exists
 */
export async function getFeaturedPost(
  preview = false
): Promise<IPost[] | null> {
  const featuredPosts = await sanityFetch<IPostData[]>({
    query: featuredPostQuery,
    preview,
    tags: [REVALIDATE_BLOG_TAG],
  })

  if (!featuredPosts || featuredPosts.length === 0) return null

  return featuredPosts.map((post) => transformPost(post))
}

/**
 * Fetches all blog categories from Sanity
 * @param preview - Whether to use preview mode
 *
 * @returns Array of formatted category objects
 */
export async function getCategories(preview = false): Promise<ICategory[]> {
  const categories = await sanityFetch<ICategoryData[]>({
    query: categoriesQuery,
    preview,
    tags: [REVALIDATE_BLOG_TAG],
  })
  return categories.map((category) => transformCategory(category))
}

/**
 * Fetches all blog posts from Sanity
 * @param preview - Whether to use preview mode
 *
 * @returns Array of formatted post objects
 */
export async function getAllPosts(preview = false): Promise<IPost[]> {
  const posts = await sanityFetch<IPostData[]>({
    query: postsQuery,
    preview,
    tags: [REVALIDATE_BLOG_TAG],
  })
  return posts.map((post) => transformPost(post))
}

/**
 * Fetches all blog posts from Sanity
 * @param preview - Whether to use preview mode
 *
 * @returns Array of formatted post objects
 */
export async function getAllPostsWithExcerpt(
  preview = false
): Promise<IPost[]> {
  const posts = await sanityFetch<IPostData[]>({
    query: postsWithExcerptQuery,
    preview,
    tags: [REVALIDATE_BLOG_TAG],
  })
  return posts.map((post) => transformPost(post))
}

/**
 * Fetches latest N posts from Sanity
 * @param limit - Number of posts to fetch
 * @param preview - Whether to use preview mode
 *
 * @returns Array of formatted post objects
 */
export async function getLatestPosts(
  limit: number,
  preview = false
): Promise<IPost[]> {
  const posts = await sanityFetch<IPostData[]>({
    query: latestPostsQuery,
    qParams: { limit },
    preview,
    tags: [REVALIDATE_BLOG_TAG],
  })
  return posts.map((post) => transformPost(post))
}

/**
 * Fetches all posts from a specific category
 * @param slug - The category slug
 * @param preview - Whether to use preview mode
 *
 * @returns Array of formatted post objects in the specified category
 */
export async function getPostsByCategory(
  slug: string,
  preview = false
): Promise<IPost[]> {
  const posts = await sanityFetch<IPostData[]>({
    query: postsByCategoryQuery,
    qParams: { slug },
    preview,
    tags: [REVALIDATE_BLOG_TAG],
  })
  return posts.map((post) => transformPost(post))
}

/**
 * Fetches a single post by its slug
 * @param slug - The post slug
 * @param preview - Whether to use preview mode
 *
 * @returns The post with table of contents or null if not found
 */
export async function getPostBySlug(
  slug: string,
  preview = false
): Promise<IPostWithTableOfContents | null> {
  const post = await sanityFetch<IPostData>({
    query: postBySlugQuery,
    qParams: { slug },
    preview,
    tags: [REVALIDATE_BLOG_TAG],
  })

  if (!post) return null

  return {
    ...transformPost(post),
    tableOfContents: getTableOfContents(post.content),
    seo: {
      ...post.seo,
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.caption,
      socialImage:
        post.seo?.socialImage ??
        `/api/cover?template=gradient-bottom&title=${encodeURIComponent(
          post.seo?.title || post.title
        )}`,
      noIndex: post.seo?.noIndex || false,
    },
  }
}

export async function getCategoryBySlug(
  slug: string,
  preview = false
): Promise<ICategory | null> {
  const category = await sanityFetch<ICategoryData>({
    query: categoryBySlugQuery,
    qParams: { slug },
    preview,
    tags: [REVALIDATE_BLOG_TAG],
  })

  if (!category) return null

  return transformCategory(category)
}

/**
 * Get post counts with both total and non-featured counts in a single query
 * @param preview Preview mode flag
 *
 * @returns Object with total and nonFeatured counts
 */
export async function getPostCounts(preview = false): Promise<{
  total: number
  nonFeatured: number
}> {
  return await sanityFetch({
    query: totalPostsQuery,
    preview,
    tags: [REVALIDATE_BLOG_TAG],
  })
}

/**
 * Get post counts by category with both total and non-featured counts in a single query
 * @param slug Category slug
 * @param preview Preview mode flag
 *
 * @returns Object with total and nonFeatured counts
 */
export async function getPostCountsByCategory(
  slug: string,
  preview = false
): Promise<{
  total: number
  nonFeatured: number
}> {
  return await sanityFetch({
    query: totalPostsByCategoryQuery,
    qParams: { slug },
    preview,
    tags: [REVALIDATE_BLOG_TAG],
  })
}

/**
 * Get total number of pages for blog pagination
 * @param preview Preview mode flag
 *
 * @returns Total number of pages
 */
export async function getTotalPages(preview = false): Promise<number> {
  const { total, nonFeatured } = await getPostCounts(preview)

  if (!total || total === 0) return 0

  if (total === 1) return 1

  return Math.ceil(nonFeatured / POSTS_PER_PAGE)
}

/**
 * Get page counts by category with both total and non-featured counts
 * @param slug Category slug
 * @param preview Preview mode flag
 *
 * @returns Object with total and nonFeatured page counts
 */
export async function getTotalPagesByCategory(
  slug: string,
  preview = false
): Promise<number> {
  const { total } = await getPostCountsByCategory(slug, preview)

  if (!total || total === 0) return 0

  if (total === 1) return 1

  return Math.ceil(total / POSTS_PER_PAGE)
}

/**
 * Fetches paginated posts
 * @param page - The page number to fetch (1-based)
 * @param preview - Whether to use preview mode
 * @param options - Additional options for filtering posts
 * @param options.nonFeaturedOnly - Whether to exclude featured posts
 *
 * @returns Array of formatted post objects for the requested page
 */
export async function getPaginatedPosts(
  page = 1,
  preview = false,
  options?: {
    nonFeaturedOnly?: boolean
  }
): Promise<IPost[]> {
  const start = (page - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const query = options?.nonFeaturedOnly
    ? paginatedNonFeaturedPostsQuery
    : paginatedPostsQuery

  const posts = await sanityFetch<IPostData[]>({
    query,
    qParams: { start, end },
    preview,
    tags: [REVALIDATE_BLOG_TAG],
  })
  return posts.map((post) => transformPost(post))
}

/**
 * Fetches paginated posts from a specific category
 * @param slug - The category slug
 * @param page - The page number to fetch (1-based)
 * @param preview - Whether to use preview mode
 * @param options - Additional options for filtering posts
 * @param options.nonFeaturedOnly - Whether to exclude featured posts
 *
 * @returns Array of formatted post objects for the requested page and category
 */
export async function getPaginatedPostsByCategory(
  slug: string,
  page = 1,
  preview = false,
  options?: {
    nonFeaturedOnly?: boolean
  }
): Promise<IPost[]> {
  const start = (page - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const query = options?.nonFeaturedOnly
    ? paginatedNonFeaturedPostsByCategoryQuery
    : paginatedPostsByCategoryQuery

  const posts = await sanityFetch<IPostData[]>({
    query,
    qParams: { slug, start, end },
    preview,
    tags: [REVALIDATE_BLOG_TAG],
  })
  return posts.map((post) => transformPost(post))
}
