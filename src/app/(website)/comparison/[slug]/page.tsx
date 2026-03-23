import { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getAllComparisonSlugs,
  getComparisonBySlug,
} from "@/data/pages/comparison"
import { comparisonReviews } from "@/data/pages/comparison/reviews"

import { getMetadata } from "@/lib/get-metadata"
import Banner from "@/components/pages/banner"
import CodeSection from "@/components/pages/comparison/code-section"
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
    title: `${data.title} | Novu`,
    description: data.description,
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
    <div className="overflow-hidden">
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
      <CodeSection codeSection={data.codeSection} />
      <ComparisonTableSection comparisonTable={data.comparisonTable} />
      <Banner className="pt-16 md:pt-24 lg:pt-36 xl:pt-50" {...data.banner} />
      <Reviews
        className="mt-16 md:mt-24 lg:mt-36 xl:mt-50"
        reviews={comparisonReviews}
        title={data.reviewsSection.title}
        subtitle={data.reviewsSection.subtitle}
      />
      <FAQ
        className="mt-13.5 md:mt-22 lg:mt-34 xl:mt-28"
        {...data.faqSection}
      />
      <CTA className="lg:-mt-32 [&_a]:max-sm:h-10 [&_a]:max-sm:px-5 [&_a]:max-sm:text-xs [&_a]:max-2xs:w-full" {...data.ctaSection} />
    </div>
  )
}

export default ComparisonPage
