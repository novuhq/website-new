import { groq } from "next-sanity"

const linkFields = `
  text,
  href,
  isExternal,
  variant
`

const pricingHeroCardFields = `
  title,
  isFeatured,
  textBeforePrice,
  price[] {
    ...,
  },
  link{
    ${linkFields}
  },
  extraInfo,
  description,
  details[] {
    ...,
  }
`

const pricingHeroFields = `
  title,
  description,
  plans[] {
    ${pricingHeroCardFields}
  }
`

const planHeadingFields = `
  id, 
  label,
  isFeatured,
  buttonUrl,
  buttonText
`

const tableCellFields = `
  value,
  booleanValue
`

const rowFields = `
  isGroupTitle,
  title,
  subtitle,
  tooltip,
  free {
    ${tableCellFields}
  },
  pro {
    ${tableCellFields}
  },
  enterprise {
    ${tableCellFields}
  },
  team {
    ${tableCellFields}
  }
`

const pricingPlansFields = `
  title,
  headings[] {
    id,
    ${planHeadingFields}
  },
  rows[] {
    ${rowFields}
  }
`

const ctaBlockFields = `
  text,
  description,
  buttonText,
  buttonUrl
`

const pageCtaFields = `
  title,
  description,
  actions[] {
    label,
    href,
    isExternal
  }
`

const faqFields = `
  title,
  accordion {
    items[] {
      question,
      answer[] {
        ...,
        markDefs[] {
          ...,
          _type == "link" => {
            href,
            isExternal
          }
        }
      }
    }
  }
`

const fullPricingPageFields = `
  "hero": hero {
    ${pricingHeroFields}
  },
  logos {
    _type,
    title,
    description,
    items[] {
      _key,
      _type,
      title,
      logo {
        asset-> {
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        },
        alt
      },
      priority,
      rowIndex
    },
    rows
  },
  "plans": plans {
    ${pricingPlansFields}
  },
  "cta": cta {
    ${ctaBlockFields}
  },
  "faq": faq {
    ${faqFields}
  },
  "pageCta": pageCta {
    ${pageCtaFields}
  }
`

export const pricingPageQuery = groq`
  *[_type == "pricing"][0] {
    ${fullPricingPageFields}
  }
`
