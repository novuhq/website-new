import { ROUTE } from "@/constants/routes"
import { groq } from "next-sanity"

import { HOW_TO_COVER_HEIGHT, HOW_TO_COVER_WIDTH } from "@/lib/how-to/cover"

const imageFields = `
  "url": asset->url + "?auto=format",
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "alt": alt
`

const howToCategoryFields = `
  "id": slug.current,
  title,
  description,
  slug
`

const templateReferenceFields = `
  "id": slug.current,
  name,
  description
`

const templateIconReferenceFields = `
  ${templateReferenceFields},
  "icon": icon {
    ${imageFields}
  }
`

const templateMcpServerFields = `
  ${templateIconReferenceFields},
  url
`

const templateChannelFields = `
  ${templateIconReferenceFields},
  "isComingSoon": isComingSoon == true
`

const templateAvatarFields = `
  "id": slug.current,
  name,
  "darkImage": darkImage {
    ${imageFields}
  },
  "lightImage": lightImage {
    ${imageFields}
  }
`

const howToCompanyFields = `
  "id": _id,
  name
`

const howToAuthorFields = `
  name,
  company->{
    ${howToCompanyFields}
  },
  avatar->{
    ${templateAvatarFields}
  }
`

const howToCardFields = groq`
  _type,
  _createdAt,
  title,
  slug,
  caption,
  summary,
  publishedAt,
  "pathname": "${ROUTE.connectHowTo}/" + slug.current,
  "author": select(
    defined(author) => author->{
      ${howToAuthorFields}
    },
    {
      "name": agentName,
      "company": null,
      "avatar": avatar->{
        ${templateAvatarFields}
      }
    }
  ),
  category->{
    ${howToCategoryFields}
  },
  mcpServerList[]->{
    ${templateMcpServerFields}
  },
  channels[]->{
    ${templateChannelFields}
  }
`

const howToContentFields = groq`
  content[] {
    ...,
    _type == "connectedMcpBlock" => {
      ...,
      "items": items[] {
        description,
        connector->{
          ${templateMcpServerFields}
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
  }
`

const howToFullPostFields = groq`
  ${howToCardFields},
  coverMode,
  coverTemplate,
  "coverText": coalesce(coverText, title),
  useTemplateUrl,
  readDocsUrl,
  "customCover": cover.asset->url + "?w=${HOW_TO_COVER_WIDTH}&h=${HOW_TO_COVER_HEIGHT}&q=100&fit=crop&auto=format",
  "coverAlt": cover.alt,
  ${howToContentFields},
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description, caption, ""),
    "socialImage": seo.socialImage.asset->url + "?w=1200&h=630&fit=crop&auto=format",
    "noIndex": seo.noIndex == true
  }
`

export const howToIndexQuery = groq`
  {
    "categories": *[_type == "howToCategory" && count(*[_type == "howToPost" && references(^._id)]) > 0] | order(orderRank asc) {
      ${howToCategoryFields}
    },
    "connectors": *[_type == "templateMcpServer"] | order(orderRank asc, name asc) {
      ${templateMcpServerFields}
    },
    "posts": *[_type == "howToPost"] | order(category->orderRank asc, publishedAt desc, title asc) {
      ${howToCardFields}
    }
  }
`

export const howToPostsQuery = groq`
  *[_type == "howToPost"] | order(publishedAt desc, title asc) {
    ${howToCardFields}
  }
`

export const howToPostBySlugQuery = groq`
  *[_type == "howToPost" && slug.current == $slug][0] {
    ${howToFullPostFields}
  }
`

export const howToRelatedPostsByCategoryQuery = groq`
  *[
    _type == "howToPost" &&
    slug.current != $slug &&
    category->slug.current == $categorySlug
  ] | order(publishedAt desc, title asc)[0...$limit] {
    ${howToCardFields}
  }
`
