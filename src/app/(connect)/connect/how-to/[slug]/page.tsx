import { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"

import { getMetadata } from "@/lib/get-metadata"
import {
  getAllHowToPosts,
  getHowToPostBySlug,
  getRelatedHowToPosts,
} from "@/lib/how-to"
import { portableToPlain } from "@/lib/sanity/utils/portable-to-plain"
import { getExcerpt } from "@/lib/utils"
import FinalCta from "@/components/pages/connect/final-cta"
import HowToPost from "@/components/pages/connect/how-to-post"

interface HowToPostPageProps {
  params: Promise<{ slug: string }>
}

export default async function ConnectHowToPostPage({
  params,
}: HowToPostPageProps) {
  const { isEnabled: isDraftMode } = await draftMode()
  const { slug } = await params
  const post = await getHowToPostBySlug(slug, isDraftMode)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedHowToPosts(
    post.slug.current,
    post.category.slug.current,
    6,
    isDraftMode
  )
  const siteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || ""
  const postUrl = `${siteUrl}${ROUTE.connectHowTo}/${post.slug.current}`
  const description =
    post.seo?.description ||
    getExcerpt({ content: portableToPlain(post.content), length: 160 })
  const postImage =
    post.seo?.socialImage ||
    `${siteUrl}/api/og?template=blog&title=${encodeURIComponent(post.title)}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seo?.title || post.title,
    description,
    datePublished: post.publishedAt || post._createdAt,
    url: postUrl,
    image: postImage,
    publisher: {
      "@type": "Organization",
      name: "Novu",
      url: "https://novu.co",
      logo: {
        "@type": "ImageObject",
        url: "https://novu.co/images/logo.svg",
      },
    },
  }

  return (
    <div className="relative overflow-clip bg-black">
      <HowToPost post={post} relatedPosts={relatedPosts} />
      <FinalCta
        title={
          <>
            Build {post.agentName}
            <br className="hidden sm:block" aria-hidden />
            <span className="sm:hidden"> </span>
            in your workspace
          </>
        }
        description={
          <>
            Novu Connect is free to start.
            <br className="hidden sm:block" aria-hidden />
            <span className="sm:hidden"> </span>
            No infrastructure to set up.
          </>
        }
        buttonText="Connect agent for free now"
        clickLocation="connect_how_to_post_final_cta"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  )
}

export async function generateStaticParams() {
  const posts = await getAllHowToPosts(false)

  return posts.map((post) => ({
    slug: post.slug.current,
  }))
}

export async function generateMetadata({
  params,
}: HowToPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getHowToPostBySlug(slug, false)

  if (!post) {
    return {}
  }

  const description =
    post.seo.description?.length > 0
      ? post.seo.description
      : getExcerpt({ content: portableToPlain(post.content), length: 160 })

  return getMetadata({
    title: `${post.seo.title} | ${config.projectName}`,
    description,
    pathname: `${ROUTE.connectHowTo}/${post.slug.current}`,
    imagePath: post.seo.socialImage,
    noIndex: post.seo.noIndex,
  })
}
