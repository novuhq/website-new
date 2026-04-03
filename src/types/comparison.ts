import { ReactNode } from "react"
import { StaticImageData } from "next/image"

import { IBanner, ICtaSection, IFaqSection } from "./common"

export interface IComparisonHero {
  heading: {
    prefix: string
    highlight: string
  }
  subheading: string
  primaryCta: {
    label: string
    href: string
    clickLocation?: string
    clickText?: string
  }
  secondaryCta: {
    label: string
    href: string
    clickLocation?: string
    clickText?: string
  }
  note: ReactNode
  illustration: {
    src: StaticImageData
    width: number
    height: number
    className?: string
    wrapperClassName?: string
  }
}

export interface IComparisonIntro {
  title: string
  description: string
  switchLabel: ReactNode
  benefits: string[]
  cta: {
    label: string
    href: string
    clickLocation?: string
    clickText?: string
  }
}

export interface IComparisonFrustration {
  title: string
  description: string
  icon: StaticImageData
}

export interface IComparisonFrustrations {
  title: string
  subtitle: string
  items: IComparisonFrustration[]
  cta: {
    label: string
    href: string
    clickLocation?: string
    clickText?: string
  }
}

export interface IComparisonDifferenceCard {
  title: string
  description: string
  icon: StaticImageData
  image: StaticImageData
}

export interface IComparisonDifference {
  title: string
  subtitle: string
  cards: IComparisonDifferenceCard[]
  cta: {
    label: string
    href: string
    clickLocation?: string
    clickText?: string
  }
}

export interface IComparisonCodeAccordionItem {
  title: string
  description: string
}

export interface IComparisonCodeSection {
  title: string
  subtitle: string
  image: {
    src: StaticImageData
    width: number
    height: number
    className?: string
  }
  items: IComparisonCodeAccordionItem[]
}

export interface IComparisonTable {
  title: string
  subtitle: string
  columnHeaders: [string, string, string, string]
  rows: [ReactNode, ReactNode, ReactNode, ReactNode][]
}

export interface IComparisonReviewsSection {
  title: string
  subtitle?: string
}

export interface IComparisonPageData {
  slug: string
  competitor: string
  title: string
  description: string
  hero: IComparisonHero
  intro: IComparisonIntro
  frustrations: IComparisonFrustrations
  difference: IComparisonDifference
  codeSection: IComparisonCodeSection
  comparisonTable: IComparisonTable
  banner: IBanner
  reviewsSection: IComparisonReviewsSection
  faqSection: IFaqSection
  ctaSection: ICtaSection
}
