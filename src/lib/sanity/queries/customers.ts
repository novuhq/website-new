import { ROUTE } from "@/constants/routes"
import { groq } from "next-sanity"

const COVER_WIDTH = 704
const COVER_ASPECT_RATIO = 16 / 9

const customersPageFields = `
  _id,
  name,
  slug,
  "logo": {
    "url": logo.asset->url + "?auto=format",
    "width": logo.asset->metadata.dimensions.width,
    "height": logo.asset->metadata.dimensions.height
  },
  title,
  author,
  authorPosition,
  cardType,
  link,
`

const customerFields = `
  _id,
  name,
  slug,
  "pathname": "${ROUTE.customers}/" + slug.current,
  "logo": {
    "url": logo.asset->url + "?auto=format",
    "width": logo.asset->metadata.dimensions.width,
    "height": logo.asset->metadata.dimensions.height
  },
  title,
  author,
  authorPosition,
  cardType,
  link,
  "storyPhoto": storyPhoto.asset->url + "?w=${COVER_WIDTH * 2}&h=${Math.ceil(
    (COVER_WIDTH / COVER_ASPECT_RATIO) * 2
  )}&q=100&fit=crop&auto=format",
  about,
  industry,
  channels,
  "quote": quote {
    title,
    "authorLogo": {
      "url": authorLogo.asset->url + "?auto=format",
      "width": authorLogo.asset->metadata.dimensions.width,
      "height": authorLogo.asset->metadata.dimensions.height
    },
    authorName,
    authorPosition
  },
  challengesSolution,
  "body": body[] {
    ...,
    _type == "quoteBlock" => {
      ...,
      "authors": authors[]{
        ...,
        "photo": photo.asset->url + "?w=28&h=28&fit=crop&auto=format"
      }
    }
  },
  related[]->{
    _id,
    name,
    slug,
    "logo": {
      "url": logo.asset->url + "?auto=format",
      "width": logo.asset->metadata.dimensions.width,
      "height": logo.asset->metadata.dimensions.height
    },
    title,
    author,
    authorPosition,
    cardType,
    link
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
    bigCards[0].customer->{${customersPageFields}},
    smallCards[0].customer->{${customersPageFields}},
    smallCards[1].customer->{${customersPageFields}},
    bigCards[1].customer->{${customersPageFields}}
  ],
  gridCustomers[] {
    customer->{
      ${customersPageFields}
    }
  },
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

export const allCustomersQuery = groq`
  *[_type == "customer" && link.type == "story"] | order(name asc) {
    ${customerFields}
  }
`

export const customerBySlugQuery = groq`
  *[_type == "customer" && slug.current == $slug][0] {
    ${customerFields}
  }
`

export const latestCustomersQuery = groq`
  *[_type == "customer" && link.type == "story" && slug.current != $currentSlug] | order(_createdAt desc)[0...4] {
    _id,
    slug,
    title,
  }
`
