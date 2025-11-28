import { Metadata, Route } from "next"
import { draftMode } from "next/headers"
import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"
import { Rss } from "lucide-react"

import {
  getCategories,
  getFeaturedPost,
  getPaginatedPosts,
  getTotalPages,
} from "@/lib/blog"
import { getMetadata } from "@/lib/get-metadata"
import { Link } from "@/components/ui/link"
import SearchBar from "@/components/ui/search-bar"
import { Separator } from "@/components/ui/separator"
import CategoriesList from "@/components/pages/blog/categories-list"
import FeaturedPost from "@/components/pages/blog/featured-posts"
import Pagination from "@/components/pages/blog/pagination"
import PostsList from "@/components/pages/blog/posts-lists"
import SubscriptionForm from "@/components/pages/blog/subscription-form"
import CTA from "@/components/pages/cta"

export default async function BlogPage() {
  const { isEnabled: isDraftMode } = await draftMode()
  const currentPage = 1

  const [posts, totalPages, categories, featuredPosts] = await Promise.all([
    getPaginatedPosts(currentPage, isDraftMode, {
      nonFeaturedOnly: true,
    }),
    getTotalPages(isDraftMode),
    getCategories(isDraftMode),
    getFeaturedPost(isDraftMode),
  ])

  if (totalPages === 0) {
    return (
      <main className="pb-20 md:pb-24 xl:pb-32">
        <p className="text-lg tracking-tight text-muted-foreground">
          No posts yet
        </p>
      </main>
    )
  }

  return (
    <div className="relative">
      <main className="relative z-10 mx-auto flex max-w-4xl flex-col px-5 pt-12 md:px-8 md:pt-16 lg:pt-20 xl:pt-24">
        <h1 className="max-w-xl text-4xl leading-tight font-medium tracking-tighter text-balance md:text-[3rem] lg:leading-dense">
          Built with Novu
        </h1>
        <p className="mt-3 max-w-lg leading-normal font-book tracking-tighter text-pretty text-gray-8">
          Discover ideas, updates, and breakthroughs from the Novu team.
        </p>
        <SubscriptionForm className="mt-6 max-w-80 md:mt-7" />
        <div className="mt-12 flex flex-col md:mt-14 md:flex-row md:items-center md:justify-between lg:mt-16">
          <CategoriesList
            categories={[
              {
                title: "All Posts",
                url: ROUTE.blog as Route<string>,
                slug: { current: "" },
              },
              ...categories,
            ]}
          />
          <Link
            className="ml-12 hidden h-full px-2 whitespace-nowrap md:inline-flex [&_svg]:size-5"
            href={ROUTE.blogRss}
            size="sm"
            variant="foreground"
          >
            <Rss size={20} />
            RSS
          </Link>
          <SearchBar
            className="ml-4 hidden lg:inline-flex lg:w-53 lg:shrink-0"
            placeholder="Search..."
          />
        </div>
        <Separator className="mt-6 mb-8 hidden md:block" />
        {featuredPosts && featuredPosts.length > 0 && (
          <>
            <FeaturedPost className="mt-6 mb-12 md:m-0" posts={featuredPosts} />
            <Separator className="hidden md:mt-10 md:mb-12 md:block lg:mt-16 lg:mb-14" />
          </>
        )}
        <PostsList title="All posts" posts={posts} />
        {totalPages > 1 && (
          <Pagination
            className="mt-14 w-full md:mt-20 lg:ml-64 lg:w-fit"
            currentPage={currentPage}
            pageCount={totalPages}
          />
        )}
      </main>
      <CTA
        title="You’re five minutes away from your first Novu-backed notification"
        description="Create a free account, send your first notification, all before your coffee gets cold... no credit card required."
        actions={[
          {
            kind: "primary-button",
            label: "Get started",
            href: `${ROUTE.dashboard}?utm_campaign=gs-website-inbox`,
          },
          {
            kind: "secondary-button",
            label: "Contact us",
            href: ROUTE.contactUs,
          },
        ]}
      />
    </div>
  )
}

export const metadata: Metadata = getMetadata({
  title: `${SEO_DATA.blog.title} | ${config.projectName}`,
  description: SEO_DATA.blog.description,
  pathname: SEO_DATA.blog.pathname,
})
