import { ROUTE } from "@/constants/routes"
import { groq } from "next-sanity"

const COVER_WIDTH = 704
const COVER_ASPECT_RATIO = 16 / 9

const customersCardsFields = `
  _id,
  name,
  slug,
  "logo": {
    "url": logo.asset->url + "?auto=format",
    "width": logo.asset->metadata.dimensions.width,
    "height": logo.asset->metadata.dimensions.height
  },
  "quoteText": quote_text,
  "quoteAuthorName": quote_name,
  "quoteAuthorPosition": quote_position,
`

const customersGridFields = `
  _id,
  name,
  slug,
  url,
  "logo": {
    "url": logo.asset->url + "?auto=format",
    "width": logo.asset->metadata.dimensions.width,
    "height": logo.asset->metadata.dimensions.height
  },
  about,
  "isFeatured": is_featured,
  category[0]->{
    _id,
    name
  },
  "channelsList": channels_list,
`

const customerFields = `
  _id,
  name,
  type,
  url,
  slug,
  "pathname": "${ROUTE.customers}/" + slug.current,
  "logo": {
    "url": logo.asset->url + "?auto=format",
    "width": logo.asset->metadata.dimensions.width,
    "height": logo.asset->metadata.dimensions.height
  },
  title,
  category[0]->{
    _id,
    name
  },
  "isFeatured": is_featured,
  "channelsList": channels_list,
  "storyPhoto": coalesce(
    storyPhoto.asset->url + "?w=${COVER_WIDTH * 2}&h=${Math.ceil(
      (COVER_WIDTH / COVER_ASPECT_RATIO) * 2
    )}&q=100&fit=crop&auto=format",
    ""
  ),
  about,
  industry,
  "quote": {
    "text": quote_text,
    "photo": {
      "url": quote_photo.asset->url + "?auto=format",
      "width": quote_photo.asset->metadata.dimensions.width,
      "height": quote_photo.asset->metadata.dimensions.height
    },
    "authorName": quote_name,
    "authorPosition": quote_position
  },
  challengesSolution,
  "body": body[] {
    ...,
    _type == "quoteBlock" => {
      ...,
      "authors": authors[]{
        ...,
        "photo": coalesce(photo.asset->url + "?w=28&h=28&fit=crop&auto=format", "")
      }
    }
  },
  related[]->{
    _id,
    name,
    type,
    url,
    slug,
    "logo": {
      "url": logo.asset->url + "?auto=format",
      "width": logo.asset->metadata.dimensions.width,
      "height": logo.asset->metadata.dimensions.height
    },
    title
  },
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description, about, ""),
    "socialImage": coalesce(seo.socialImage.asset->url + "?w=1200&h=630&fit=crop&auto=format", ""),
    "noIndex": seo.noIndex == true
  }
`

const fullCustomersPageFields = `
  _id,
  _type,
  "cards": [
    cardsBig[0]->{${customersCardsFields}},
    cardsSmall[0]->{${customersCardsFields}},
    cardsSmall[1]->{${customersCardsFields}},
    cardsBig[1]->{${customersCardsFields}}
  ],
  tweets[] {
    text,
    "logo": {
      "url": logo.asset->url + "?auto=format",
      "width": logo.asset->metadata.dimensions.width,
      "height": logo.asset->metadata.dimensions.height
    },
    name,
    tag,
    tweetLink
  }
`

export const customersPageQuery = groq`
  *[_type == "customers"][0] {
    ${fullCustomersPageFields}
  }
`

export const customersGridQuery = groq`
*[_type == "customer"] | order(orderRank) {
  ${customersGridFields}
}
`

export const allCustomersQuery = groq`
  *[_type == "customer" && type == "story"] | order(orderRank) {
    ${customerFields}
  }
`

export const customerBySlugQuery = groq`
  *[_type == "customer" && slug.current == $slug][0] {
    ${customerFields}
  }
`

export const latestCustomersQuery = groq`
  *[_type == "customer" && type == "story" && slug.current != $currentSlug] | order(_createdAt desc)[0...4] {
    _id,
    slug,
    title,
    "logo": {
      "url": logo.asset->url + "?auto=format",
      "width": logo.asset->metadata.dimensions.width,
      "height": logo.asset->metadata.dimensions.height
    },
  }
`

export const allCustomersLogosQuery = groq`
  *[_type == "customer"] | order(orderRank) {
    name,
    "logo": {
      "url": logo.asset->url + "?auto=format",
      "width": logo.asset->metadata.dimensions.width,
      "height": logo.asset->metadata.dimensions.height
    },
  }
`
