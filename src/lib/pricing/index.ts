import { IPricingPageData } from "@/types/pricing"
import { sanityFetch } from "@/lib/sanity/client"
import {
  pricingPageQuery,
} from "@/lib/sanity/queries/pricing"

const REVALIDATE_PRICING_TAG = ["pricing"]

export async function getPricingPage(
  preview = false
): Promise<IPricingPageData | null> {
  const page = await sanityFetch<IPricingPageData>({
    query: pricingPageQuery,
    preview,
    tags: REVALIDATE_PRICING_TAG,
  })
  return page || null
}