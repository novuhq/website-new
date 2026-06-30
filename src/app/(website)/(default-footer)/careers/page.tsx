import { Metadata } from "next"
import { SEO_DATA } from "@/constants/seo-data"

import { getMetadata } from "@/lib/get-metadata"
import { getOpenCareerJobs } from "@/lib/notion/careers"
import Form from "@/components/pages/careers/form"
import Hero from "@/components/pages/careers/hero"
import OpenRoles from "@/components/pages/careers/open-roles"
import Team from "@/components/pages/careers/team"

export default async function CareersPage() {
  const jobs = await getOpenCareerJobs()

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
