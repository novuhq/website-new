const DASHBOARD_URL = "https://dashboard.novu.co"
const LEGACY_DASHBOARD_HOST = "dashboard-v2.novu.co"

export function normalizeDashboardUrl(href: string | URL): string {
  const value = href.toString()

  try {
    const url = new URL(value)

    if (url.hostname === LEGACY_DASHBOARD_HOST) {
      const pathname = url.pathname === "/" ? "" : url.pathname

      return `${DASHBOARD_URL}${pathname}${url.search}${url.hash}`
    }
  } catch {
    // Relative URLs are left unchanged.
  }

  return value
}
