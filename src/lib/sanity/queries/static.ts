import { groq } from "next-sanity"

const commonStaticPageFields = groq`
  _type,
  _createdAt,
  title,
  slug,
  publishedAt,
  isFeatured,
  "content": content[] {
    ...
  },
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description, caption, ""),
    "socialImage": seo.socialImage.asset->url + "?w=1200&h=630&fit=crop&auto=format",
    "noIndex": seo.noIndex == true
  }
`

// Query for all posts with pagination
export const staticPagesQuery = groq`
  *[_type == "staticPage"] | order(publishedAt desc) {
    ${commonStaticPageFields}
  }
`

// Query for a single post by slug
export const staticPageBySlugQuery = groq`
  *[_type == "staticPage" && slug.current == $slug][0] {
    ${commonStaticPageFields}
  }
`
