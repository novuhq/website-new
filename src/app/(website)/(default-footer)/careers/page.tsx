import { Metadata } from "next"
import { SEO_DATA } from "@/constants/seo-data"

import { type ICareerJob } from "@/types/careers"
import { getMetadata } from "@/lib/get-metadata"
import { sanityFetch } from "@/lib/sanity/client"
import { openCareerJobsQuery } from "@/lib/sanity/queries/careers"
import Form from "@/components/pages/careers/form"
import Hero from "@/components/pages/careers/hero"
import OpenRoles from "@/components/pages/careers/open-roles"
import Team from "@/components/pages/careers/team"

export default async function CareersPage() {
  const jobs = await sanityFetch<ICareerJob[]>({
    query: openCareerJobsQuery,
    tags: ["careers"],
  })

  return (
    <main className="overflow-x-clip">
      <Hero />
      <Team />
      {/* {jobs.length > 0 ? <OpenRoles jobs={jobs} /> : <Form />} */}
      {jobs.length > 0 && <OpenRoles jobs={jobs} />}
      <Form />
    </main>
  )
}

export const metadata: Metadata = getMetadata(SEO_DATA.careers)
