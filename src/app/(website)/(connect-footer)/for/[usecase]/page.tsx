import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getMetadata } from "@/lib/get-metadata"
import UseCaseLanding from "@/components/pages/connect-usecase"
import { USE_CASE_LANDINGS } from "@/components/pages/connect-usecase/config"

interface UseCasePageProps {
  params: Promise<{ usecase: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(USE_CASE_LANDINGS).map((usecase) => ({ usecase }))
}

export async function generateMetadata({
  params,
}: UseCasePageProps): Promise<Metadata> {
  const { usecase } = await params
  const config = USE_CASE_LANDINGS[usecase]

  if (!config) return {}

  return getMetadata({
    title: `${config.heroTitle} | Novu`,
    description: config.heroDescription,
    pathname: `/for/${config.slug}`,
  })
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { usecase } = await params
  const config = USE_CASE_LANDINGS[usecase]

  if (!config) notFound()

  return <UseCaseLanding {...config} />
}
