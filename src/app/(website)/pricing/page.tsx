import { Metadata } from "next"
import { notFound } from "next/navigation"
import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import { getMetadata } from "@/lib/get-metadata"
import { getPricingPage } from "@/lib/pricing"
import Cta from "@/components/cta"
import ComparisonTable from "@/components/pages/pricing/comparison-table"
import CtaCard from "@/components/pages/pricing/cta-card"
import FAQ from "@/components/pages/pricing/faq"
import PricingPlansCards from "@/components/pages/pricing/pricing-plans-cards"
import SectionWithLogosAnimated from "@/components/pages/pricing/section-with-logos-animated"

async function PricingPage() {
  const page = await getPricingPage()

  if (!page) {
    return notFound()
  }

  const { hero, logos, plans, cta, faq, pageCta } = page

  return (
    <>
      <PricingPlansCards {...hero} />
      <SectionWithLogosAnimated {...logos} />
      <ComparisonTable {...plans} />
      <CtaCard {...cta} />
      <FAQ {...faq} className="mt-13.5 md:mt-22 lg:mt-34 xl:mt-28" />
      <Cta {...pageCta} className="text-center" />
    </>
  )
}

export default PricingPage

export const metadata: Metadata = getMetadata(
  SEO_DATA.pricing || {
    title: `Pricing | ${config.projectName}`,
    description: "Flexible pricing for companies and developers",
    pathname: ROUTE.pricing,
  }
)

export const revalidate = 90
