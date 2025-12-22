import { PortableTextBlock } from "@portabletext/react"

import { ICtaSection } from "./common"

export type IPricingHero = {
  title: string
  plans: IPricingHeroCard[]
  onContactUsClick: (source: string) => void
}

export type Link = {
  _type: "link"
  text: string
  href: string
  isExternal?: boolean
  variant?: "primary" | "secondary" | "text"
}

export type NumericPrice = {
  _type: "numericPrice"
  value: number
  paymentPeriod: string
}

export type CustomPrice = {
  _type: "customPrice"
  value: string
}

export type IPricingHeroCard = {
  title: string
  textBeforePrice?: string
  description: string
  isFeatured?: boolean
  price: (NumericPrice | CustomPrice)[]
  link: Link
  extraInfo?: string
  details: PortableTextBlock[]
}

export type TableCell = {
  value?: PortableTextBlock[]
  booleanValue?: boolean
}

export type Row = {
  isGroupTitle?: boolean
  tooltip?: PortableTextBlock[]
  title: string
  subtitle?: string
  free?: TableCell
  pro?: TableCell
  team?: TableCell
  enterprise?: TableCell
}

export type PlanHeading = {
  id: string
  label: string
  isFeatured: boolean
  buttonUrl?: string
  buttonText?: string
}

export type Headings = PlanHeading[]

export type Plans = {
  title: string
  headings: Headings
  rows: Row[]
  onContactUsClick: (source: string) => void
}

export type Accordion = {
  items: Array<{
    question: string
    answer: PortableTextBlock[]
  }>
}

export type Faq = {
  title: string
  accordion: Accordion
}

export type ICtaCard = {
  text: string
  description?: string
  buttonText: string
  buttonUrl: string | URL
  onScheduleClick: (source: string) => void
}

export type LogoItem = {
  _key: string
  _type: "logoItem"
  title?: string
  logo?: {
    asset?: {
      _id: string
      url: string
      metadata?: {
        dimensions?: {
          width: number
          height: number
        }
      }
    }
    alt?: string
  }
  priority?: number
  rowIndex?: number
}

export type Logos = {
  _type: "logos"
  title?: string
  description?: string
  items?: LogoItem[]
  rows?: number
}

export type IPricingPageData = {
  _type: "pricing"
  _createdAt: string
  _updatedAt: string
  title: string
  hero: IPricingHero
  logos: Logos
  plans: Plans
  faq: Faq
  cta: ICtaCard
  pageCta: ICtaSection
}
