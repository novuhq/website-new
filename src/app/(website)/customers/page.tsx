import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import { getCustomersPage } from "@/lib/customers"
import { getMetadata } from "@/lib/get-metadata"
import CTA from "@/components/cta"
import CustomersGrid from "@/components/pages/customers/customers-grid"
import Hero from "@/components/pages/customers/hero"
import Reviews from "@/components/pages/customers/reviews"

export default async function CustomersPage() {
  const page = await getCustomersPage()

  if (!page) {
    notFound()
  }

  return (
    <main>
      <Hero
        customers={[
          page.big_cards[0],
          page.small_cards[0],
          page.small_cards[1],
          page.big_cards[1],
        ]}
      />
      <CustomersGrid customers={page.grid_customers} />
      <Reviews reviews={page.tweets} />
      <CTA
        title="Free to start, ready to scale"
        className="pt-[162px] md:pt-36 lg:pt-[186px] xl:pt-[243px]"
        containerClassName="px-5 md:px-0 max-w-192 lg:translate-x-0"
        titleClassName="max-w-[246px] md:max-w-full"
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
  SEO_DATA.customers || {
    title: "Customers",
    description: "Customers use Novu",
    pathname: ROUTE.customers,
  }
)
