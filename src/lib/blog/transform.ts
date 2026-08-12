import { ROUTE } from "@/constants/routes"

import type { ICategory, ICategoryData, IPost, IPostData } from "@/types/blog"

function hasRequiredPostCardFields(post: IPostData) {
  return Boolean(
    post.title &&
      post.slug?.current &&
      post.caption &&
      post.publishedAt &&
      post.cover &&
      post.category?.title &&
      post.category.slug?.current &&
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
  if (!hasRequiredPostCardFields(post)) return null

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
