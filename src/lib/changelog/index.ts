import {
  IChangelogPostData,
  IChangelogPostWithNeighbors,
} from "@/types/changelog"
import { sanityFetch } from "@/lib/sanity/client"
import {
  changelogPostBySlugQuery,
  changelogPostsByCategoryQuery,
  changelogPostsQuery,
} from "@/lib/sanity/queries/changelog"

const REVALIDATE_CHANGELOG_TAG = ["changelog"]

/**
 * Fetches all blog posts from Sanity
 * @param preview - Whether to use preview mode
 *
 * @returns Array of formatted post objects
 */
export async function getChangelogPosts(
  preview = false
): Promise<IChangelogPostData[]> {
  const posts = await sanityFetch<IChangelogPostData[]>({
    query: changelogPostsQuery,
    preview,
    tags: REVALIDATE_CHANGELOG_TAG,
  })

  return posts
}

/**
 * Fetches a single post by its slug
 * @param slug - The post slug
 * @param preview - Whether to use preview mode
 *
 * @returns The post with table of contents or null if not found
 */
export async function getChangelogPostBySlug(
  slug: string,
  preview = false
): Promise<IChangelogPostWithNeighbors | null> {
  const post = await sanityFetch<IChangelogPostData>({
    query: changelogPostBySlugQuery,
    qParams: { slug },
    preview,
    tags: REVALIDATE_CHANGELOG_TAG,
  })

  if (!post) {
    return null
  }

  // Fetch all posts to determine prev/next slugs
  const posts = await getChangelogPosts(preview)
  const index = posts.findIndex((p) => p.slug.current === slug)

  const nextChangelog =
    index > 0
      ? { slug: posts[index - 1].slug.current, title: posts[index - 1].title }
      : { slug: null, title: null }
  const previousChangelog =
    index < posts.length - 1
      ? { slug: posts[index + 1].slug.current, title: posts[index + 1].title }
      : { slug: null, title: null }

  const postWithSeo = {
    ...post,
    seo: {
      ...post.seo,
      socialImage:
        post.seo.socialImage ??
        `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/api/og?template=changelog&title=${post.seo.title}`,
    },
  }

  return {
    post: postWithSeo,
    previousChangelog,
    nextChangelog,
  }
}

/**
 * Fetches all changelog posts for a given category slug
 * @param slug - The category slug
 * @param preview - Whether to use preview mode
 *
 * @returns Array of posts in the category or null if not found
 */
export async function getChangelogPostsByCategory(
  slug: string,
  preview = false
): Promise<IChangelogPostData[] | null> {
  const posts = await sanityFetch<IChangelogPostData[]>({
    query: changelogPostsByCategoryQuery,
    qParams: { slug },
    preview,
  })

  if (!posts || posts.length === 0) {
    return null
  }

  return posts
}
