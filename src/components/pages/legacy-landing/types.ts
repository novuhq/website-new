import type { ReactNode } from "react"

export interface LandingAction {
  label: string
  href: string
  hiddenLabel?: string
  newTab?: boolean
}

export interface LandingPicture {
  alt: string
  height: number
  src: string
  width: number
}

export interface PictureSectionData {
  action?: LandingAction
  description: string
  image: LandingPicture
  title: string
}

export interface IconGridItem {
  description: ReactNode
  icon: string
  link?: LandingAction
  title: string
}

export interface IconGridData {
  action?: LandingAction
  items: readonly IconGridItem[]
  title: string
}

export interface DualCtaData {
  description: ReactNode
  primary: LandingAction
  secondary: LandingAction
  title: string
}

export interface CodeSectionData {
  action?: LandingAction
  code: string
  description: string
  title: string
}

export interface ImageCardData {
  description: string
  image: LandingPicture
  title: string
}

export interface BentoCardData extends ImageCardData {
  imageMobile?: LandingPicture
}

export interface LogoData {
  image: LandingPicture
  title: string
}

export interface LinkCardData {
  description: string
  link: LandingAction
  title: string
}

export interface ComplianceItem {
  image: LandingPicture
  title: string
}

export interface SecurityCtaCardData {
  action: LandingAction
  description: string
  title: string
}

export interface SecurityCtaData {
  primary: SecurityCtaCardData
  secondary: SecurityCtaCardData
  title: string
}
