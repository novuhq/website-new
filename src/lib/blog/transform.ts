import { ROUTE } from "@/constants/routes"

import type { ICategory, ICategoryData, IPost, IPostData } from "@/types/blog"

/**
 * Fields `transformPost` itself dereferences to build the post and category
 * URLs. Kept deliberately narrow: editorial completeness is enforced by
 * `postCardReadyFilter` in the queries, and projections that omit card fields
 * on purpose (see `postExcerptFields`) still have to survive the transform.
 */
function hasLinkableFields(post: IPostData) {
  return Boolean(post.slug?.current && post.category?.slug?.current)
}

/**
 * Whether a post carries everything the post page renders. Drafts can be saved
 * incomplete, so documents fetched without `postCardReadyFilter` — currently
 * `postBySlugQuery` — have to be checked here instead.
 */
export function isCompletePost(post: IPostData) {
  return Boolean(
    hasLinkableFields(post) &&
      post.title &&
      post.caption &&
      post.publishedAt &&
      post.cover &&
      post.category?.title &&
      Array.isArray(post.authors) &&
      post.authors.length > 0
  )
}

export function transformCategory(category: ICategoryData): ICategory {
  return {
    ...category,
    url: `${ROUTE.blogCategory}/${category.slug.current}`,
  }
}

export function transformPost(post: IPostData): IPost | null {
  if (!hasLinkableFields(post)) return null

  return {
    ...post,
    url: `${ROUTE.blog}/${post.slug.current}`,
    category: transformCategory(post.category),
  }
}

export function transformPosts(posts: IPostData[]): IPost[] {
  return posts.reduce<IPost[]>((readyPosts, post) => {
    const transformedPost = transformPost(post)
    if (transformedPost) readyPosts.push(transformedPost)

    return readyPosts
  }, [])
}
