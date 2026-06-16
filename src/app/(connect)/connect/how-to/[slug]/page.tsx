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
import { getHowToCoverPath } from "@/lib/how-to/cover"
import { portableToPlain } from "@/lib/sanity/utils/portable-to-plain"
import { getExcerpt } from "@/lib/utils"
import HowToPost from "@/components/pages/connect/how-to/post/post-content"
import FinalCta from "@/components/pages/final-cta"

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
  let postCoverImage: string | null = null

  if (post.cover) {
    postCoverImage = post.cover.startsWith("http")
      ? post.cover
      : `${siteUrl}${post.cover}`
  }

  const postImage =
    post.seo?.socialImage ||
    postCoverImage ||
    `${siteUrl}${getHowToCoverPath({ template: "default" })}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seo?.title || post.title,
    description,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
          ...(post.author.company?.name
            ? {
                affiliation: {
                  "@type": "Organization",
                  name: post.author.company.name,
                },
              }
            : {}),
        }
      : undefined,
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
            Build {post.author.name}
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
        actions={[
          {
            kind: "primary-button",
            label: "Connect agent for free now",
            href: ROUTE.connectApp,
            clickLocation: "connect_how_to_post_final_cta",
            clickText: "connect_agent_for_free_now",
            openInNewTab: true,
          },
        ]}
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
