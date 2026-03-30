import { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getAllComparisonSlugs,
  getComparisonBySlug,
} from "@/data/pages/comparison"
import { comparisonReviews } from "@/data/pages/comparison/reviews"

import { getMetadata } from "@/lib/get-metadata"
import Banner from "@/components/pages/banner"
import CodeWithInbox from "@/components/pages/home/code-with-inbox/code-with-inbox"
import ComparisonTableSection from "@/components/pages/comparison/comparison-table"
import Difference from "@/components/pages/comparison/difference"
import Frustrations from "@/components/pages/comparison/frustrations"
import Hero from "@/components/pages/comparison/hero"
import Intro from "@/components/pages/comparison/intro"
import CTA from "@/components/pages/cta"
import FAQ from "@/components/pages/faq"
import Reviews from "@/components/pages/reviews"
import SectionWithLogosAnimated from "@/components/section-with-logos-animated"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = getComparisonBySlug(slug)

  if (!data) {
    return {}
  }

  return getMetadata({
    title: `Best ${data.competitor} Alternatives | Novu`,
    description: `Exploring alternatives to ${data.competitor}? See why developers choose Novu for multi-channel notifications: open-source, fully customizable, and built for scale.`,
    pathname: `/comparison/${slug}`,
  })
}

async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params
  const data = getComparisonBySlug(slug)

  if (!data) {
    notFound()
  }

  return (
    <div className="overflow-clip">
      <Hero hero={data.hero} />
      <SectionWithLogosAnimated
        className="mt-16 mb-0 md:mt-20 md:mb-0 lg:mt-24 lg:mb-0 xl:mt-32 xl:mb-0"
        titleHighlight="Novu"
        title="is trusted by leading teams worldwide"
        titleSize="sm"
        rows={2}
      />
      <Intro intro={data.intro} />
      <Frustrations frustrations={data.frustrations} />
      <Difference difference={data.difference} />
      <CodeWithInbox />
      <ComparisonTableSection comparisonTable={data.comparisonTable} />
      <Banner className="pt-16 md:pt-24 lg:pt-36 xl:pt-50" {...data.banner} />
      <Reviews
        className="mt-16 md:mt-24 lg:mt-36 xl:mt-50"
        reviews={comparisonReviews}
        title={data.reviewsSection.title}
        subtitle={data.reviewsSection.subtitle}
      />
      <FAQ
        className="relative z-10 mt-13.5 md:mt-22 lg:mt-34 xl:mt-28"
        {...data.faqSection}
      />
      <CTA
        className="lg:-mt-32 [&_a]:max-sm:h-10 [&_a]:max-sm:px-5 [&_a]:max-sm:text-xs [&_a]:max-2xs:w-full"
        {...data.ctaSection}
      />
    </div>
  )
}

export default ComparisonPage
