import { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import { getAllChangelogPosts } from "@/lib/changelog"
import { getMetadata } from "@/lib/get-metadata"
import ChangelogHero from "@/components/pages/changelog/hero"
import PostsList from "@/components/pages/changelog/posts-list"

export default async function ChangelogPage() {
  const posts = await getAllChangelogPosts()

  return (
    <main className="pb-12 md:pb-14 lg:pb-16 xl:pb-24">
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
