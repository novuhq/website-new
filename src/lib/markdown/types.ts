export type MarkdownPage = {
  title: string
  description?: string
  pathname: string
  body: string
  updatedAt?: string
  noIndex?: boolean
}

export type MarkdownResult =
  | { type: "page"; page: MarkdownPage }
  | { type: "redirect"; location: string }
  | { type: "not-found" }

export type SeoEntry = {
  title: string
  description: string
  pathname: string
}

export type MarkdownPageBuilder = (
  pathname: string
) => Promise<MarkdownPage | null>

export type MarkdownResultBuilder = (
  pathname: string
) => Promise<MarkdownResult | null>
