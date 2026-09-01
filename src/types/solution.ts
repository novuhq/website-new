import type { Route } from "next"
import type { StaticImageData } from "next/image"

/**
 * Data model for a /solutions landing page (e.g. /solutions/ai-agents).
 * One entry per audience lives in `src/data/pages/solutions/`.
 */

export type TSolutionConversionTrack = "self-serve" | "book-a-call"

export interface ISolutionCta {
  label: string
  href: Route<string> | URL
}

/**
 * How a section renders. "prose" is heading + body + optional bullet grid;
 * "cards" is a bento card grid (optionally with home-page graphics);
 * "stats" is a stat-tile strip; "channels" is the five-channel icon grid.
 */
export type TSolutionSectionVariant = "prose" | "cards" | "stats" | "channels"

export interface ISolutionCard {
  title: string
  body: string
  /** Optional graphic reused from the homepage assets. */
  image?: StaticImageData
  imageClassName?: string
  /**
   * Overlay the interactive Connect mascot eyes on the graphic (only valid on
   * the one-conversation artwork, which shares the eyes' coordinate system).
   */
  mascotEyes?: boolean
}

export interface ISolutionStat {
  value: string
  label: string
}

export interface ISolutionSection {
  heading: string
  body: string
  variant?: TSolutionSectionVariant
  bullets?: string[]
  cards?: ISolutionCard[]
  stats?: ISolutionStat[]
}

export interface ISolutionCodeSnippet {
  heading: string
  description?: string
  /** Filename-style label shown in the code block header, e.g. "workflow.ts". */
  label: string
  code: string
}

export interface ISolutionFaqItem {
  question: string
  answer: string
}

/** Feeds the homepage Compliance strip (cert badges + book-a-call). */
export interface ISolutionCompliance {
  title: string
  description: string
  items: ISolutionFaqItem[]
}

export interface ISolutionPageData {
  slug: string
  /** Short display name for breadcrumbs, e.g. "For AI Agents". */
  name: string
  seoTitle: string
  seoDescription: string
  /** Which conversion track this page is optimized for. */
  conversionTrack: TSolutionConversionTrack
  /**
   * Hero treatment. "globe" reuses the homepage animated globe hero (with a
   * page-specific set of card events); "default" is the compact text hero.
   */
  heroVariant?: "default" | "globe"
  hero: {
    eyebrow: string
    heading: string
    subheading: string
  }
  /**
   * Hero buttons. On pages where `command` is present, the command block takes
   * the primary slot, so `primaryCta` may be omitted.
   */
  primaryCta?: ISolutionCta
  secondaryCta?: ISolutionCta
  /** Copy-paste CLI command shown in the hero and the closing CTA. */
  command?: string
  /** Copy-paste prompt a developer hands to their coding agent. */
  prompt?: string
  sections: ISolutionSection[]
  codeSnippet?: ISolutionCodeSnippet
  /** When set, the homepage Compliance strip renders before the FAQ. */
  compliance?: ISolutionCompliance
  faq: ISolutionFaqItem[]
  finalCta: {
    title: string
    description: string
  }
}
