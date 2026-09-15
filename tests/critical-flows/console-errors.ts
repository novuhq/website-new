const BLOCKED_THIRD_PARTY_RESOURCE_ERROR =
  "Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector"

const REPORT_ONLY_CSP_RESOURCE_ERROR =
  /^\[Report Only\] Refused to (?:load|connect to) https:\/\/\S+ because it does not appear in the [a-z-]+ directive of the Content Security Policy\.$/
const REPORT_ONLY_CSP_HEADER_WARNING_PREFIX = "The Content Security Policy '"
const REPORT_ONLY_CSP_HEADER_WARNING_SUFFIX =
  "' was delivered in report-only mode, but does not specify a 'report-to'; the policy will have no effect. Please either add a 'report-to' directive, or deliver the policy via the 'Content-Security-Policy' header."
const EXPECTED_EXTERNAL_NETWORK_ERROR = new Set([
  "Failed to load resource: The network connection was lost.",
  "Failed to load resource: the server responded with a status of 403 ()",
  "Failed to load resource: the server responded with a status of 403 (Forbidden)",
])
const BLOCKED_THIRD_PARTY_HOST =
  /^(?:[^.]+\.)*(?:cdn-plain\.com|plain\.com|segment\.com|segment\.io|snitcher\.com|vector\.co)$/

function isReportOnlyCspDiagnostic(message: string) {
  return (
    REPORT_ONLY_CSP_RESOURCE_ERROR.test(message) ||
    (message.startsWith(REPORT_ONLY_CSP_HEADER_WARNING_PREFIX) &&
      message.endsWith(REPORT_ONLY_CSP_HEADER_WARNING_SUFFIX))
  )
}

function isExpectedExternalNetworkError(message: string, sourceUrl?: string) {
  if (!sourceUrl || !EXPECTED_EXTERNAL_NETWORK_ERROR.has(message)) return false

  try {
    const url = new URL(sourceUrl)

    return (
      BLOCKED_THIRD_PARTY_HOST.test(url.hostname) ||
      (url.hostname === "ddwl4m2hdecbv.cloudfront.net" &&
        url.pathname.startsWith("/b/GOYPYHQGXDOX/"))
    )
  } catch {
    return false
  }
}

export function isExpectedBrowserConsoleError(
  message: string,
  sourceUrl?: string
) {
  return (
    message === BLOCKED_THIRD_PARTY_RESOURCE_ERROR ||
    isReportOnlyCspDiagnostic(message) ||
    isExpectedExternalNetworkError(message, sourceUrl)
  )
}
