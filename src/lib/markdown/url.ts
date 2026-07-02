export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || "https://novu.co"
  ).replace(/\/$/, "")
}

function withLeadingSlash(pathname: string) {
  return pathname.startsWith("/") ? pathname : `/${pathname}`
}

function withoutTrailingSlash(pathname: string) {
  if (pathname === "/") return pathname
  return pathname.replace(/\/+$/, "")
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
  return `${getSiteUrl()}${pathname}`
}
