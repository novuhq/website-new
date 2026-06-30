import { Metadata } from "next"
import { notFound } from "next/navigation"
import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"

import { getMetadata } from "@/lib/get-metadata"
import { getCareerJobBySlug, getOpenCareerJobs } from "@/lib/notion/careers"
import { getExcerpt } from "@/lib/utils"
import CareerJobPage from "@/components/pages/careers/job-page"

interface CareerJobRouteProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const jobs = await getOpenCareerJobs()

  return jobs.map(({ slug }) => ({
    slug,
  }))
}

export async function generateMetadata({
  params,
}: CareerJobRouteProps): Promise<Metadata> {
  const { slug } = await params
  const job = await getCareerJobBySlug(slug)

  if (!job) {
    return {}
  }

  const description = getExcerpt({
    content: job.plainContent,
    length: 160,
  })

  return getMetadata({
    title: `${job.title} | Careers | ${config.projectName}`,
    description,
    pathname: `${ROUTE.careers}/${job.slug}`,
  })
}

export default async function CareerJobRoute({ params }: CareerJobRouteProps) {
  const { slug } = await params
  const job = await getCareerJobBySlug(slug)

  if (!job) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || ""
  const pathname = `${ROUTE.careers}/${job.slug}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.plainContent,
    datePosted: job.publishedAt,
    employmentType: job.hours,
    hiringOrganization: {
      "@type": "Organization",
      name: "Novu",
      sameAs: "https://novu.co",
      logo: "https://novu.co/images/logo.svg",
    },
    jobLocationType: job.location.toLowerCase().includes("remote")
      ? "TELECOMMUTE"
      : undefined,
    applicantLocationRequirements: {
      "@type": "Country",
      name: job.location,
    },
    url: `${siteUrl}${pathname}`,
  }

  return (
    <>
      <CareerJobPage job={job} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  )
}
