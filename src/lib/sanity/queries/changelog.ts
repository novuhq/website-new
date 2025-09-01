import { ROUTE } from "@/constants/routes"
import { groq } from "next-sanity"

const COVER_WIDTH = 704
const COVER_ASPECT_RATIO = 16 / 9

const fullPostFields = `
_type,
  title,
  slug,
  publishedAt,
  caption,
  "categories": categories[]->{
    title,
    slug
  },
  "pathname": "${ROUTE.changelog}/" + slug.current,
  "authors": authors[]->{
    name,
    "photo": photo.asset->url + "?w=56&h=56&fit=crop&auto=format"
  },
    "cover": cover.asset->url + "?w=${COVER_WIDTH * 2}&h=${Math.ceil(
      (COVER_WIDTH / COVER_ASPECT_RATIO) * 2
    )}&q=100&fit=crop&auto=format",
  "content": content[] {
    ...,
    _type == "quoteBlock" => {
      ...,
      "authors": authors[]{
        ...,
        "photo": photo.asset->url + "?w=56&h=56&fit=crop&auto=format"
      }
    }
  },
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description, caption, ""),
    "socialImage": coalesce(seo.socialImage->url + "?w=1200&h=630&fit=crop&auto=format"),
    "noIndex": seo.noIndex == true
  }

`

// Query for all posts
export const changelogPostsQuery = groq`
  *[_type == "changelogPost"] | order(publishedAt desc) {
    ${fullPostFields}
  }
`

// Query for the latest post
export const changelogLatestPostQuery = groq`
  *[_type == "changelogPost"] | order(publishedAt desc)[0] {
    ${fullPostFields}
  }
`

// Query for a single post by slug
export const changelogPostBySlugQuery = groq`
  *[_type == "changelogPost" && slug.current == $slug][0] {
    ${fullPostFields}
  }
`

// Query all posts by category slug
export const changelogPostsByCategoryQuery = groq`
  *[_type == "changelogPost" && references(*[_type == "changelogCategory" && slug.current == $slug]._id)] | order(publishedAt desc) {
    ${fullPostFields}
  }
`
