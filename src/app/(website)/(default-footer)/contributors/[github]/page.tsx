import type { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getContributor,
  getContributorAchievements,
  getContributorSocialImageUrl,
} from "@/lib/contributors"
import { getMetadata } from "@/lib/get-metadata"
import ContributorPage from "@/components/pages/contributor"

interface PageProps {
  params: Promise<{ github: string }>
}

export const revalidate = 3600

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { github } = await params
  const { contributor, unavailable } = await getContributor(github)
  const name = contributor?.github || github
  const imagePath = contributor
    ? getContributorSocialImageUrl(contributor.github)
    : undefined

  return getMetadata({
    title: `Novu - ${name}`,
    description: `Come and meet our awesome contributor ${name}`,
    pathname: `/contributors/${name.toLowerCase()}`,
    imagePath,
    imageAlt: contributor ? `${name} — Novu contributor` : undefined,
    noIndex: unavailable || !contributor,
  })
}

export default async function ContributorRoute({ params }: PageProps) {
  const { github } = await params
  const { contributor, unavailable } = await getContributor(github)

  if (unavailable) {
    throw new Error("Contributor data is temporarily unavailable")
  }
  if (!contributor) notFound()

  return (
    <ContributorPage
      contributor={contributor}
      additionalAchievements={getContributorAchievements(contributor.github)}
    />
  )
}
