export interface CommunityMember {
  login: string
  avatarUrl: string
  /** Commits to novuhq/novu, as GitHub's contributors API counts them. */
  contributions: number
}

export type CommunityIssueTag =
  | "bug"
  | "feature"
  | "docs feedback"
  | "good first issue"
  | "help wanted"

export interface CommunityIssue {
  title: string
  number: number
  url: string
  createdAt: string
  repositoryName: string
  tags: CommunityIssueTag[]
}

export interface CommunityStats {
  count: number
  commits: number
  closedIssues: number
  contributors: number
  forks: number
  pullRequests: number
  openIssues: number
}
