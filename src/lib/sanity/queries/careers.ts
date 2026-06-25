import { groq } from "next-sanity"

export const openCareerJobsQuery = groq`
  *[_type == "careerJob" && status == "open"] | order(publishedAt desc) {
    _id,
    title,
    department,
    employmentType,
    location,
    applicationUrl,
    publishedAt,
    "slug": slug.current
  }
`
