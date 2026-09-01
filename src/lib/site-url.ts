const DEFAULT_SITE_URL = "https://novu.co"
const SUPPORTED_SITE_PROTOCOLS = new Set(["http:", "https:"])

function parseSiteUrl(value: string, source: string, allowBareHost = false) {
  const normalizedValue =
    allowBareHost && !value.includes("://") ? `https://${value}` : value
  const siteUrl = new URL(normalizedValue)

  if (!SUPPORTED_SITE_PROTOCOLS.has(siteUrl.protocol)) {
    throw new Error(
      `${source} must use http or https, received "${siteUrl.protocol}"`
    )
  }

  return siteUrl.toString().replace(/\/$/, "")
}

function withLeadingSlash(pathname: string) {
  return pathname.startsWith("/") ? pathname : `/${pathname}`
}

function withoutTrailingSlash(pathname: string) {
  if (pathname === "/") return pathname
  return pathname.replace(/\/+$/, "")
}

export function getSiteUrl() {
  if (process.env.VERCEL_ENV === "preview") {
    const previewUrl =
      process.env.VERCEL_BRANCH_URL?.trim() || process.env.VERCEL_URL?.trim()

    if (previewUrl) {
      return parseSiteUrl(
        previewUrl,
        process.env.VERCEL_BRANCH_URL ? "VERCEL_BRANCH_URL" : "VERCEL_URL",
        true
      )
    }
  }

  const configuredSiteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL?.trim()

  if (configuredSiteUrl) {
    return parseSiteUrl(configuredSiteUrl, "NEXT_PUBLIC_DEFAULT_SITE_URL")
  }

  return DEFAULT_SITE_URL
}

export function toCanonicalPathname(pathname: string) {
  return withoutTrailingSlash(withLeadingSlash(pathname))
}

export function toMarkdownPathname(pathname: string) {
  const normalized = withoutTrailingSlash(withLeadingSlash(pathname))
  return normalized === "/" ? "/index.md" : `${normalized}.md`
}

export function pathSegmentsToPathname(pathSegments: string[]) {
  const cleaned: string[] = []

  for (const segment of pathSegments.filter(Boolean)) {
    try {
      cleaned.push(decodeURIComponent(segment))
    } catch {
      return null
    }
  }

  if (
    cleaned.length === 0 ||
    (cleaned.length === 1 && cleaned[0] === "index")
  ) {
    return "/"
  }

  return `/${cleaned.join("/")}`
}

export function normalizePathname(pathname: string) {
  const normalized = withoutTrailingSlash(withLeadingSlash(pathname))
  return normalized === "" ? "/" : normalized
}

export function absoluteUrl(pathname: string) {
  const url = new URL(withLeadingSlash(pathname), `${getSiteUrl()}/`)

  if (url.pathname !== "/") {
    url.pathname = withoutTrailingSlash(url.pathname)
  }

  if (url.pathname === "/" && url.search === "" && url.hash === "") {
    return `${url.protocol}//${url.host}`
  }

  return url.toString()
}
