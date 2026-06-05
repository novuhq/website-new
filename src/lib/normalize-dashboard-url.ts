const DASHBOARD_URL = "https://dashboard.novu.co"
const DASHBOARD_HOST = "dashboard.novu.co"
const LEGACY_DASHBOARD_HOST = "dashboard-v2.novu.co"
const DASHBOARD_AUTH_PATHS = new Set(["/auth/sign-in", "/auth/sign-up"])

export function normalizeDashboardUrl(href: string | URL): string {
  const value = href.toString()

  try {
    const url = new URL(value)
    const pathname = url.pathname.replace(/\/$/, "")
    const isDashboardHost = url.hostname === DASHBOARD_HOST
    const isLegacyDashboardHost = url.hostname === LEGACY_DASHBOARD_HOST

    if (isLegacyDashboardHost) {
      const normalizedPath =
        !pathname || DASHBOARD_AUTH_PATHS.has(pathname) ? "" : url.pathname

      return `${DASHBOARD_URL}${normalizedPath}${url.search}${url.hash}`
    }

    if (isDashboardHost && DASHBOARD_AUTH_PATHS.has(pathname)) {
      return `${DASHBOARD_URL}${url.search}${url.hash}`
    }
  } catch {
    // Relative URLs are left unchanged.
  }

  return value
}
