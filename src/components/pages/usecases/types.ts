export const USE_CASE_SLUGS = [
  "add-notifications",
  "content-management",
  "improve-communication-experience",
  "multi-channel-notifications",
  "unified-platform",
] as const

export type UseCaseSlug = (typeof USE_CASE_SLUGS)[number]

export type FeatureAnimation =
  | "content-management"
  | "digest"
  | "monitoring"
  | "preferences"
  | "priority-management"
  | "timezone"

export interface UseCaseLink {
  readonly text: string
  readonly url: string
}

export interface UseCaseFeature {
  readonly animation: FeatureAnimation
  readonly title: string
  readonly description: string
}

export interface UseCaseImage {
  readonly src: string
  readonly alt: string
  readonly width: number
  readonly height: number
}

export interface UseCasePainCard {
  readonly title: string
  readonly description: string
  readonly image: UseCaseImage
}

export interface UseCaseBenefit {
  readonly title: string
  readonly description: string
  readonly image: UseCaseImage
}

export interface UseCasePageData {
  readonly slug: UseCaseSlug
  readonly metadata: {
    readonly title: string
    readonly description: string
  }
  readonly hero: {
    readonly title: string
    readonly description: string
    readonly links: readonly UseCaseLink[]
  }
  readonly features: readonly UseCaseFeature[]
  readonly painRestatement: {
    readonly title: string
    readonly description: string
    readonly cards: readonly UseCasePainCard[]
  }
  readonly benefits: {
    readonly title: string
    readonly description: string
    readonly sections: readonly UseCaseBenefit[]
  }
}

export interface IndexAction {
  readonly label: string
  readonly href: string
}

export interface IndexPictureSectionData {
  readonly id:
    | "hero"
    | "multi-channel"
    | "application"
    | "management"
    | "content"
  readonly title: string
  readonly description: string
  readonly imageSide: "left" | "right"
  readonly action: IndexAction
  readonly image: UseCaseImage
}

export interface IndexGoal {
  readonly title: string
  readonly description: string
  readonly action: IndexAction
}

export interface IndexCtaData {
  readonly title: string
  readonly description: string
  readonly primaryAction: IndexAction
  readonly secondaryAction: IndexAction
}
