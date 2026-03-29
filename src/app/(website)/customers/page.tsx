import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import { getCustomersPage } from "@/lib/customers"
import { getMetadata } from "@/lib/get-metadata"
import CTA from "@/components/pages/cta"
import CustomersGrid from "@/components/pages/customers/customers-grid"
import Hero from "@/components/pages/customers/hero"
import Reviews from "@/components/pages/customers/reviews"

export default async function CustomersPage() {
  const page = await getCustomersPage()

  if (!page) {
    notFound()
  }

  const categories = Array.from(
    new Set(
      page.customersGrid.map((item) => item?.category?.name).filter(Boolean)
    )
  )

  const isFeaturedExist = page.customersGrid.some((item) => item.isFeatured)

  const siteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || "https://novu.co"

  const reviews = page.tweets
    .filter((tweet) => tweet.name && tweet.text)
    .slice(0, 10)
    .map((tweet) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: tweet.name,
      },
      reviewBody: tweet.text.replace(/<[^>]*>/g, ""),
    }))

  const reviewJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Novu",
    description:
      "Open-source notification infrastructure for developers and product teams.",
    url: `${siteUrl}/customers/`,
    image: `${siteUrl}/social-previews/index.jpg`,
    brand: { "@type": "Brand", name: "Novu" },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      description: "Free up to 10,000 workflow runs per month",
      url: `${siteUrl}/pricing/`,
    },
    ...(reviews.length > 0 && { review: reviews }),
    ...(reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        bestRating: "5",
        ratingCount: String(reviews.length),
      },
    }),
  }

  return (
    <div>
      <Hero customers={page.cards} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(reviewJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CustomersGrid
        isFeaturedExist={isFeaturedExist}
        categories={categories}
        customers={page.customersGrid}
      />
      <Reviews reviews={page.tweets} />
      <CTA
        title="Free to start, ready to scale"
        className="pt-[162px] md:pt-36 lg:pt-[186px] xl:pt-[243px]"
        containerClassName="px-5 md:px-0 max-w-192 lg:translate-x-0"
        titleClassName="max-w-[246px] md:max-w-full"
        descriptionClassName="max-w-[320px] md:max-w-[448px] sm:max-w-[368px]"
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

export const metadata: Metadata = getMetadata(SEO_DATA.customers)
