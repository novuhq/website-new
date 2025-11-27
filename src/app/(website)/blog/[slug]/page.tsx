import { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"

import { getAllPosts, getPostBySlug } from "@/lib/blog"
import { getMetadata } from "@/lib/get-metadata"
import { portableToPlain } from "@/lib/sanity/utils/portable-to-plain"
import { getExcerpt } from "@/lib/utils"
import Post from "@/components/pages/blog/post/post"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { isEnabled: isDraftMode } = await draftMode()
  const { slug } = await params
  const post = await getPostBySlug(slug, isDraftMode)

  if (!post) {
    notFound()
  }

  // Google Structured Data for Blog Post @see {@link https://developers.google.com/search/docs/appearance/structured-data/article#json-ld}
  // Next.js JSON-LD @see {@link https://nextjs.org/docs/app/guides/json-ld}
  const siteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || ""
  const postUrl = `${siteUrl}${ROUTE.blog}/${post.slug.current}`
  const authors = (post.authors || []).map((author) => ({
    "@type": "Person",
    name: author.name,
    ...(author.photo ? { image: author.photo } : {}),
  }))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seo?.title || post.title,
    description: post.seo?.description || "",
    datePublished: post.publishedAt,
    url: postUrl,
    image:
      post.seo?.socialImage ||
      `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/api/og?title=${encodeURIComponent(post.title)}`,
    author:
      authors.length > 0 ? authors : [{ "@type": "Person", name: "Unknown" }],
  }

  return (
    <main className="pt-8 pb-24 md:pt-11 lg:pt-16 lg:pb-48">
      <Post
        className="relative z-10"
        post={post}
        backLink={{ label: "Blog", href: ROUTE.blog }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  )
}

export async function generateStaticParams() {
  const posts = await getAllPosts(false)

  return posts.map((post) => ({
    slug: post.slug.current,
  }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug, false)

  if (!post) {
    return {}
  }

  const { seo } = post

  const description =
    seo.description?.length > 0
      ? seo.description
      : getExcerpt({ content: portableToPlain(post.content), length: 160 })

  const metadata = getMetadata({
    title: `${seo.title} | ${config.projectName}`,
    description: description,
    pathname: `${ROUTE.blog}/${post.slug.current}`,
    imagePath: seo.socialImage,
    noIndex: seo.noIndex,
  })

  return metadata
}
