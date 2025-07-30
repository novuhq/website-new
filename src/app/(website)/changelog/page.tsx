import { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import { getAllChangelogPosts } from "@/lib/changelog"
import { getMetadata } from "@/lib/get-metadata"
import CTA from "@/components/cta"
import ChangelogHero from "@/components/pages/changelog/hero"
import PostsList from "@/components/pages/changelog/posts-list"

export default async function ChangelogPage() {
  const posts = await getAllChangelogPosts()

  return (
    <main>
      <ChangelogHero
        title="Changelog"
        description="Product updates, improvements, and fixes"
      />

      {posts && posts.length > 0 ? (
        <PostsList posts={posts} />
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
            href: `${ROUTE.dashboard}?utm_campaign=gs-website-inbox`,
          },
          {
            kind: "secondary-button",
            label: "See our plans",
            href: ROUTE.pricing,
          },
        ]}
      />
    </main>
  )
}

export const metadata: Metadata = getMetadata(
  SEO_DATA.changelog || {
    title: "Changelog",
    description: "Latest updates",
    pathname: ROUTE.changelog,
  }
)
