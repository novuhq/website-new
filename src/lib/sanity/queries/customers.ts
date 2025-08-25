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
    "asset": {
      "url": logo.asset->url,
      "metadata": logo.asset->metadata
    }
  },
  title,
  author,
  author_position,
  card_type,
  link,
`

const customerFields = `
  _id,
  name,
  slug,
  "pathname": "${ROUTE.customers}/" + slug.current,
  "logo": {
    "url": logo.asset->url + "?auto=format",
    "asset": {
      "url": logo.asset->url,
      "metadata": logo.asset->metadata
    }
  },
  title,
  author,
  author_position,
  card_type,
  link,
  "story_photo": story_photo.asset->url + "?w=${COVER_WIDTH * 2}&h=${Math.ceil(
    (COVER_WIDTH / COVER_ASPECT_RATIO) * 2
  )}&q=100&fit=crop&auto=format",
  about,
  industry,
  channels,
  socials,
  "quote": quote {
    title,
    "author_logo": {
      "url": author_logo.asset->url + "?auto=format",
      "asset": {
        "url": author_logo.asset->url,
        "metadata": author_logo.asset->metadata
      },
    },
    author_name,
    author_position
  },
  challenges_solution,
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
      "asset": {
        "url": logo.asset->url,
        "metadata": logo.asset->metadata
      }
    },
    title,
    author,
    author_position,
    card_type,
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
  small_cards[] {
    customer->{
      ${customersPageFields}
    }
  },
  big_cards[] {
    customer->{
      ${customersPageFields}
    }
  },
  grid_customers[] {
    customer->{
      ${customersPageFields}
    }
  },
  tweets[] {
    text,
    "logo": {
      "url": logo.asset->url + "?auto=format",
      "asset": {
        "url": logo.asset->url,
        "metadata": logo.asset->metadata
      }
    },
    name,
    tag,
    tweet_link
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
