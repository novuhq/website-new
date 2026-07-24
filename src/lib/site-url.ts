const DEFAULT_SITE_URL = "https://novu.co"
const SUPPORTED_SITE_PROTOCOLS = new Set(["http:", "https:"])

function withLeadingSlash(pathname: string) {
  return pathname.startsWith("/") ? pathname : `/${pathname}`
}

function withoutTrailingSlash(pathname: string) {
  if (pathname === "/") return pathname
  return pathname.replace(/\/+$/, "")
}

export function getSiteUrl() {
  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_DEFAULT_SITE_URL?.trim() || DEFAULT_SITE_URL
  const siteUrl = new URL(configuredSiteUrl)

  if (!SUPPORTED_SITE_PROTOCOLS.has(siteUrl.protocol)) {
    throw new Error(
      `NEXT_PUBLIC_DEFAULT_SITE_URL must use http or https, received "${siteUrl.protocol}"`
    )
  }

  return siteUrl.toString().replace(/\/$/, "")
}

export function toCanonicalPathname(pathname: string) {
  const normalized = withoutTrailingSlash(withLeadingSlash(pathname))
  return normalized === "/" ? "/" : `${normalized}/`
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
  return new URL(withLeadingSlash(pathname), `${getSiteUrl()}/`).toString()
}
