import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  FAQ_SECTION,
  MULTI_CHANNEL_METADATA,
  MULTI_CHANNEL_SLUG,
  toPlainText,
} from "@/data/pages/usecase-multi-channel"

import { getMetadata } from "@/lib/get-metadata"
import { safeJsonLdStringify } from "@/lib/json-ld"
import {
  isUseCaseSlug,
  USE_CASE_PAGES,
} from "@/components/pages/usecases/child-data"
import MultiChannelPage from "@/components/pages/usecases/multi-channel/page"
import { USE_CASE_SLUGS } from "@/components/pages/usecases/types"
import UseCasePage from "@/components/pages/usecases/use-case-page"

interface UseCaseRouteProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return USE_CASE_SLUGS.map((slug) => ({ slug }))
}

const multiChannelFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_SECTION.items.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: toPlainText(answer) },
  })),
}

export async function generateMetadata({
  params,
}: UseCaseRouteProps): Promise<Metadata> {
  const { slug } = await params
  const pathname = `/usecases/${slug}/`

  if (slug === MULTI_CHANNEL_SLUG) {
    return getMetadata({ pathname, ...MULTI_CHANNEL_METADATA })
  }

  if (!isUseCaseSlug(slug)) {
    notFound()
  }

  return getMetadata({ pathname, ...USE_CASE_PAGES[slug].metadata })
}

export default async function UseCaseRoute({ params }: UseCaseRouteProps) {
  const { slug } = await params

  if (slug === MULTI_CHANNEL_SLUG) {
    return (
      <>
        <MultiChannelPage />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLdStringify(multiChannelFaqJsonLd),
          }}
        />
      </>
    )
  }

  if (!isUseCaseSlug(slug)) {
    notFound()
  }

  return <UseCasePage data={USE_CASE_PAGES[slug]} />
}
