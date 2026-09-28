import type { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  DIRECTORY_SLUGS,
  getDirectoryPost,
  getDirectoryPosts,
} from "@/lib/directory"
import { getMetadata } from "@/lib/get-metadata"
import DirectoryPost from "@/components/pages/directory/directory-post"

interface DirectoryPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return DIRECTORY_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: DirectoryPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getDirectoryPost(slug)

  if (!post) {
    return {}
  }

  const cover = post.images[0]

  return getMetadata({
    title: post.title,
    description: post.description,
    pathname: post.pathname,
    imagePath: cover.src,
    imageAlt: cover.alt,
  })
}

export default async function DirectoryPostPage({
  params,
}: DirectoryPostPageProps) {
  const { slug } = await params
  const post = await getDirectoryPost(slug)

  if (!post) {
    notFound()
  }

  const posts = await getDirectoryPosts()
  const relatedPosts = posts.filter(({ slug: postSlug }) => postSlug !== slug)

  return <DirectoryPost post={post} relatedPosts={relatedPosts} />
}
