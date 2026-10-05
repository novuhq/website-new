import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getMetadata } from "@/lib/get-metadata"
import {
  isUseCaseSlug,
  USE_CASE_PAGES,
} from "@/components/pages/usecases/child-data"
import { USE_CASE_SLUGS } from "@/components/pages/usecases/types"
import UseCasePage from "@/components/pages/usecases/use-case-page"

interface UseCaseRouteProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return USE_CASE_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: UseCaseRouteProps): Promise<Metadata> {
  const { slug } = await params

  if (!isUseCaseSlug(slug)) {
    notFound()
  }

  const data = USE_CASE_PAGES[slug]

  return getMetadata({
    pathname: `/usecases/${slug}/`,
    ...data.metadata,
  })
}

export default async function UseCaseRoute({ params }: UseCaseRouteProps) {
  const { slug } = await params

  if (!isUseCaseSlug(slug)) {
    notFound()
  }

  return <UseCasePage data={USE_CASE_PAGES[slug]} />
}
