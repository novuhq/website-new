import { formatPage } from "./page-utils"
import { getBlogListing, getBlogPost } from "./pages/blog"
import { getChangelog } from "./pages/changelog"
import { getComparison } from "./pages/comparison"
import { getConnect } from "./pages/connect"
import { getCustomers } from "./pages/customers"
import { getIntegrations } from "./pages/integrations"
import { getPricing } from "./pages/pricing"
import { getStaticMarketingPage, getStaticSanityPage } from "./pages/static"
import { isUnsupportedMarkdownPathname } from "./registry"
import type { MarkdownPage, MarkdownPageBuilder, MarkdownResult } from "./types"
import { normalizePathname } from "./url"

const PAGE_BUILDERS: MarkdownPageBuilder[] = [
  getPricing,
  getConnect,
  getBlogPost,
  getChangelog,
  getCustomers,
  getComparison,
  getStaticSanityPage,
]

export async function getMarkdownPageByPath(
  pathname: string
): Promise<MarkdownResult> {
  const normalized = normalizePathname(pathname)

  if (isUnsupportedMarkdownPathname(normalized)) {
    return { type: "not-found" }
  }

  const direct = await getStaticMarketingPage(normalized)
  if (direct) return { type: "page", page: direct }

  const maybeRedirectOrIntegration = await getIntegrations(normalized)
  if (maybeRedirectOrIntegration) return maybeRedirectOrIntegration

  const maybeBlogListing = await getBlogListing(normalized)
  if (maybeBlogListing) return maybeBlogListing

  for (const builder of PAGE_BUILDERS) {
    const page = await builder(normalized)
    if (page) return { type: "page", page }
  }

  return { type: "not-found" }
}

export function markdownResponseBody(page: MarkdownPage) {
  return formatPage(page)
}
