import assert from "node:assert/strict"
import { describe, it } from "node:test"

import type { IPostData } from "@/types/blog"
import { transformPost, transformPosts } from "@/lib/blog/transform"
import { latestPostsQuery } from "@/lib/sanity/queries/blog"

const completePost = {
  _type: "blogPost",
  _createdAt: "2026-08-12T00:00:00Z",
  title: "Complete post",
  slug: { current: "complete-post" },
  url: "/blog/complete-post",
  authors: [{ name: "Author", photo: "" }],
  cover: "/cover.png",
  category: {
    title: "How to",
    slug: { current: "how-to" },
  },
  isFeatured: false,
  publishedAt: "2026-08-12T00:00:00Z",
  caption: "Complete caption",
  content: [],
  seo: {
    title: "Complete post",
    description: "Complete caption",
    socialImage: "",
    noIndex: false,
  },
} as IPostData

describe("blog data readiness", () => {
  it("filters incomplete draft cards before ordering and slicing", () => {
    const categoryFilterIndex = latestPostsQuery.indexOf(
      "defined(category._ref)"
    )
    const orderIndex = latestPostsQuery.indexOf("| order")

    assert.ok(categoryFilterIndex >= 0)
    assert.ok(categoryFilterIndex < orderIndex)
    assert.match(latestPostsQuery, /defined\(publishedAt\)/)
  })

  it("skips incomplete runtime data instead of throwing", () => {
    const incompletePost = {
      ...completePost,
      category: null,
      publishedAt: null,
    } as unknown as IPostData

    assert.equal(transformPost(incompletePost), null)
    assert.deepEqual(
      transformPosts([incompletePost, completePost]).map(
        (post) => post.slug.current
      ),
      ["complete-post"]
    )
  })
})
