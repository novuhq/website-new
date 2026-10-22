import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import { getChangelogPosts } from "@/lib/changelog"
import { getMetadata } from "@/lib/get-metadata"
import { absoluteUrl, getSiteUrl } from "@/lib/site-url"
import ChangelogHero from "@/components/pages/changelog/hero"
import PostsList from "@/components/pages/changelog/posts-list"
import CTA from "@/components/pages/cta"

const CHANGELOG_POSTS_PER_PAGE = 6

export default async function ChangelogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const pageParams = await searchParams
  const page = Number(pageParams?.page ?? 1)

  if (isNaN(page) || page < 1) notFound()

  const allPosts = await getChangelogPosts()
  const end = page * CHANGELOG_POSTS_PER_PAGE
  const posts = allPosts.slice(0, end)
  const hasMore = end < allPosts.length

  const siteUrl = getSiteUrl()
  const changelogJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Changelog | Novu",
    description: "Product updates, improvements, and fixes",
    url: `${siteUrl}/changelog/`,
    isPartOf: {
      "@type": "WebSite",
      name: "Novu",
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: "Novu",
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/logo.svg"),
      },
    },
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(changelogJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ChangelogHero
        title="Changelog"
        description="Product updates, improvements, and fixes"
      />

      {posts && posts.length > 0 ? (
        <PostsList posts={posts} hasMore={hasMore} />
      ) : (
        <section className="mx-auto w-full max-w-3xl px-5 py-12 md:px-8 md:py-16">
          <p className="text-center text-muted-foreground">
            No changelog entries found yet.
          </p>
        </section>
      )}

      <CTA
        title="Free to start, ready to scale"
        description={
          <>
            <strong>10K events/month</strong> free forever. From weekend
            projects to enterprise scale, we've got you covered.
          </>
        }
        actions={[
          {
            kind: "primary-button",
            label: "Get started",
            href: ROUTE.dashboard,
            clickLocation: "changelog_cta",
            clickText: "get_started",
          },
          {
            kind: "secondary-button",
            label: "See our plans",
            href: ROUTE.pricing,
          },
        ]}
      />
    </div>
  )
}

export const metadata: Metadata = getMetadata({
  ...(SEO_DATA.changelog || {
    title: "Changelog",
    description: "Latest updates",
    pathname: ROUTE.changelog,
  }),
  markdownPathname: true,
})
