import { ROUTE } from "@/constants/routes"
import { groq } from "next-sanity"

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
  link_type,
  external_link,
`

const customerFields = `
  _id,
  name,
  slug,
  "pathname": "${ROUTE.changelog}/" + slug.current,
  "logo": {
    "url": logo.asset->url + "?auto=format",
    "asset": {
      "url": logo.asset->url,
      "metadata": logo.asset->metadata
    }
  },
  "logomark": {
    "url": logomark.asset->url + "?auto=format",
    "asset": {
      "url": logomark.asset->url,
      "metadata": logomark.asset->metadata
    }
  },
  title,
  author,
  author_position,
  card_type,
  link_type,
  external_link,
  "story_photo": {
    "url": story_photo.asset->url + "?auto=format",
    "asset": {
      "url": story_photo.asset->url,
      "metadata": story_photo.asset->metadata
    }
  },
  about,
  industry,
  email_channels,
  inbox_channels,
  sms_channels,
  quote_title,
  "quote_author_logo": {
    "url": quote_author_logo.asset->url + "?auto=format",
    "asset": {
      "url": quote_author_logo.asset->url,
      "metadata": quote_author_logo.asset->metadata
    }
  },
  quote_author_name,
  quote_author_position,
  key_challenges,
  novu_solution,
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
    "logomark": {
      "url": logomark.asset->url + "?auto=format",
      "asset": {
        "url": logomark.asset->url,
        "metadata": logomark.asset->metadata
      }
    },
    title,
    author,
    author_position,
    card_type,
    link_type
  },
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description, about, ""),
    "socialImage": coalesce(seo.socialImage.asset->url + "?w=1200&h=630&fit=crop&auto=format"),
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
  *[_type == "customer"] | order(name asc) {
    ${customerFields}
  }
`

export const customerBySlugQuery = groq`
  *[_type == "customer" && slug.current == $slug][0] {
    ${customerFields}
  }
`

export const latestCustomersQuery = groq`
  *[_type == "customer" && link_type == "story" && slug.current != $currentSlug] | order(_createdAt desc)[0...3] {
    _id,
    slug,
    title,
  }
`
