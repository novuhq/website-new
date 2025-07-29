import { Metadata } from "next"
import { ROUTE } from "@/constants/routes"

import { getChangelogPostsByCategory } from "@/lib/changelog"
import { getMetadata } from "@/lib/get-metadata"
import ChangelogHero from "@/components/pages/changelog/hero"
import PostsList from "@/components/pages/changelog/posts-list"

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const posts = await getChangelogPostsByCategory(category)
  const categoryTitle =
    posts?.[0]?.categories.find((c) => c.slug.current === category)?.title ||
    category

  return (
    <main className="pb-12 md:pb-14 lg:pb-16 xl:pb-24">
      <ChangelogHero
        title="Changelog"
        description={`Latest updates and improvements in the ${categoryTitle.toLowerCase()} category.`}
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const posts = await getChangelogPostsByCategory(category)
  const categoryTitle =
    posts?.[0]?.categories.find((c) => c.slug.current === category)?.title ||
    category

  return getMetadata({
    title: `${categoryTitle} | Changelog | Novu`,
    description: `Latest updates and improvements in the ${categoryTitle.toLowerCase()} category.`,
    pathname: `${ROUTE.changelog}/category/${category}`,
  })
}
