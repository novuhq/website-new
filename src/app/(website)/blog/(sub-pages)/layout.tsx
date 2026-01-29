import { ReactNode } from "react"
import { type Route } from "next"
import { draftMode } from "next/headers"
import { ROUTE } from "@/constants/routes"
import { Rss } from "lucide-react"

import { getCategories } from "@/lib/blog"
import { Link } from "@/components/ui/link"
import SearchBar from "@/components/ui/search-bar"
import { Separator } from "@/components/ui/separator"
import SubscriptionForm from "@/components/ui/subscription-form"
import CategoriesList from "@/components/pages/blog/categories-list"
import CTA from "@/components/pages/cta"

export default async function BlogPagesLayout({
  children,
}: {
  children: ReactNode
}) {
  const { isEnabled: isDraftMode } = await draftMode()
  const categories = await getCategories(isDraftMode)

  return (
    <div className="relative">
      <main className="relative z-10 mx-auto flex max-w-4xl flex-col px-5 pt-12 md:px-8 md:pt-16 lg:pt-20 xl:pt-24">
        <p className="max-w-xl text-4xl leading-tight font-medium tracking-tighter text-balance md:text-[3rem] lg:leading-dense">
          Built with Novu
        </p>
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
        <Separator className="mt-6 bg-transparent md:mb-8 md:bg-border" />
        {children}
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
