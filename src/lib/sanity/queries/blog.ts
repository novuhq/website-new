import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"
import { groq } from "next-sanity"

const COVER_ASPECT_RATIO = config.blog.coverAspectRatio

const postCardReadyFilter = groq`
  _type == "blogPost" &&
  defined(title) &&
  defined(slug.current) &&
  defined(caption) &&
  defined(publishedAt) &&
  defined(category._ref) &&
  defined(cover.asset._ref) &&
  count(authors) > 0
`

const commonPostFields = `
  _type,
  _createdAt,
  title,
  slug,
  caption,
  publishedAt,
  isFeatured,
  "category": category->{
    title,
    slug
  },
  "pathname": "${ROUTE.blog}/" + slug.current
`

const postCardFields = `
  ${commonPostFields},
  "cover": cover.asset->url + "?w=${config.blog.postCardCoverWidth * 2}&h=${Math.ceil((config.blog.postCardCoverWidth / COVER_ASPECT_RATIO) * 2)}&q=100&fit=crop&auto=format",
  "coverAlt": cover.alt,
  "authors": authors[]->{
    name,
    position,
    "photo": photo.asset->url + "?w=64&h=64&fit=crop&auto=format",
    },
`

const postExcerptFields = groq`
  ${commonPostFields},
  "content": content[] {
    ...,
    _type == "quoteBlock" => {
      ...,
      "authors": authors[]{
        ...,
        "photo": photo.asset->url + "?w=64&h=64&fit=crop&auto=format"
      }
    }
  },
  "authors": authors[]->{
    name,
    position,
    "photo": photo.asset->url + "?w=88&h=88&fit=crop&auto=format"
  },
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description, caption, ""),
  }
`

const fullPostFields = groq`
  ${commonPostFields},
  "cover": cover.asset->url + "?w=${config.blog.postCardCoverWidth * 2}&h=${Math.ceil((config.blog.postCardCoverWidth / COVER_ASPECT_RATIO) * 2)}&q=100&fit=crop&auto=format",
  "coverAlt": cover.alt,
  "content": content[] {
    ...,
    _type == "relatedPostsBlock" => {
      _type,
      "items": items[] {
        ...,
        _type == "reference" => {
          ...,
          "_refType": @->_type,
          "title": @->title,
          "slug": @->slug,
          "pathname": "${ROUTE.blog}/" + @->slug.current,
          "category": @->category->{
            title,
            slug
          },
          "publishedAt": @->publishedAt,
          "authors": @->authors[]->{
            name,
            "photo": photo.asset->url + "?w=64&h=64&fit=crop&auto=format"
          }
        }
      }
    },
    _type == "quoteBlock" => {
      ...,
      "authors": authors[]{
        ...,
        "photo": photo.asset->url + "?w=64&h=64&fit=crop&auto=format"
      }
    }
  },
  "authors": authors[]->{
    name,
    position,
    "photo": photo.asset->url + "?w=88&h=88&fit=crop&auto=format"
  },
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description, caption, ""),
    "socialImage": seo.socialImage.asset->url + "?w=1200&h=630&fit=crop&auto=format",
    "noIndex": seo.noIndex == true
  }
`

// Query for featured post
export const featuredPostQuery = groq`
  *[${postCardReadyFilter} && isFeatured == true] | order(publishedAt desc) {
    ${postCardFields}
  }
`

// Query for all categories that have at least one post
export const categoriesQuery = groq`
  *[_type == "blogCategory" && defined(title) && defined(slug.current) && count(*[${postCardReadyFilter} && references(^._id)]) > 0] | order(title asc) {
    title,
    slug
  }
`

// Query for all posts with pagination
export const postsQuery = groq`
  *[${postCardReadyFilter}] | order(publishedAt desc) {
    ${postCardFields}
  }
`

// Query for latest N posts (accepts $limit parameter)
export const latestPostsQuery = groq`
  *[${postCardReadyFilter}] | order(publishedAt desc)[0...$limit] {
    ${postCardFields}
  }
`

// Query for all posts with excerpt
export const postsWithExcerptQuery = groq`
  *[${postCardReadyFilter}] | order(publishedAt desc) {
    ${postExcerptFields}
  }
`

// Query for latest N posts with excerpt
export const latestPostsWithExcerptQuery = groq`
  *[${postCardReadyFilter}] | order(publishedAt desc)[0...$limit] {
    ${postExcerptFields}
  }
`

// Query for posts by category
export const postsByCategoryQuery = groq`
  *[${postCardReadyFilter} && category->slug.current == $slug] | order(publishedAt desc) {
    ${postCardFields}
  }
`

// Query for a single post by slug
export const postBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    ${fullPostFields}
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "blogCategory" && slug.current == $slug][0] {
    title,
    slug
  }
`

// Query for pagination
export const totalPostsQuery = groq`{
  "total": count(*[${postCardReadyFilter}]),
  "nonFeatured": count(*[${postCardReadyFilter} && (!defined(isFeatured) || isFeatured == false)])
}
`

// Query for total posts by category
export const totalPostsByCategoryQuery = groq`{
  "total": count(*[${postCardReadyFilter} && category->slug.current == $slug]),
  "nonFeatured": count(*[${postCardReadyFilter} && category->slug.current == $slug && (!defined(isFeatured) || isFeatured == false)])
}`

// Query for paginated posts
export const paginatedPostsQuery = groq`
  *[${postCardReadyFilter}] | order(publishedAt desc)[$start...$end] {
    ${postCardFields}
  }
`

// Query for paginated non-featured posts
export const paginatedNonFeaturedPostsQuery = groq`
  *[${postCardReadyFilter} && (!defined(isFeatured) || isFeatured == false)] | order(publishedAt desc)[$start...$end] {
    ${postCardFields}
  }
`

// Query for paginated posts by category
export const paginatedPostsByCategoryQuery = groq`
  *[${postCardReadyFilter} && category->slug.current == $slug] | order(publishedAt desc)[$start...$end] {
    ${postCardFields}
  }
`

// Query for paginated non-featured posts by category
export const paginatedNonFeaturedPostsByCategoryQuery = groq`
  *[${postCardReadyFilter} && category->slug.current == $slug && (!defined(isFeatured) || isFeatured == false)] | order(publishedAt desc)[$start...$end] {
    ${postCardFields}
  }
`
