import { Metadata } from "next"
import { notFound } from "next/navigation"
import { SEO_DATA } from "@/constants/seo-data"

import { getMetadata } from "@/lib/get-metadata"
import { getPricingPage } from "@/lib/pricing"
import PricingPageContent from "@/components/pages/pricing/pricing-page-content"

async function PricingPage() {
  const page = await getPricingPage()

  if (!page) {
    return notFound()
  }

  return <PricingPageContent page={page} />
}

export default PricingPage

export const metadata: Metadata = getMetadata(SEO_DATA.pricing)

export const revalidate = 90
