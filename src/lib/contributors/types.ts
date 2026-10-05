export interface ContributorPull {
  id?: string | number
  title: string
  htmlUrl: string
  createdAt?: string
  mergedAt?: string
}

export interface ContributorActivityPage {
  pulls: ContributorPull[]
  nextOffset: number | null
  unavailable: boolean
}

export interface Contributor {
  github: string
  name?: string
  bio?: string
  location?: string
  website?: string
  twitter?: string
  teammate: boolean
  totalPulls: number
  pulls: ContributorPull[]
}

export interface ContributorAchievement {
  date: string
  title: string
  slug: string
  tooltip: string
  badge: {
    alt: string
    src: string
    width: number
    height: number
  }
}
