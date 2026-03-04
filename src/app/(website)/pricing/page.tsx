import { Metadata } from "next"
import { SEO_DATA } from "@/constants/seo-data"
import pricingContent from "@root/content/pricing.json"

import { IPricingPageData } from "@/types/pricing"
import { getMetadata } from "@/lib/get-metadata"
import PricingPageContent from "@/components/pages/pricing/pricing-page-content"

async function PricingPage() {
  return <PricingPageContent page={pricingContent as IPricingPageData} />
}

export default PricingPage

export const metadata: Metadata = getMetadata(SEO_DATA.pricing)

export const revalidate = 90
