/**
 * Split integration markdown body into the three standard sections.
 * Headings are case-insensitive for "How it works".
 */
export function splitIntegrationSections(rawBody: string): {
  overview: string
  howItWorks: string
  configure: string
} {
  return {
    overview: extractAfterHeading(rawBody, /^##\s+Overview\s*$/im),
    howItWorks: extractAfterHeading(rawBody, /^##\s+How\s+it\s+works\s*$/im),
    configure: extractAfterHeading(rawBody, /^##\s+Configure\s*$/im),
  }
}

function extractAfterHeading(body: string, headingLine: RegExp): string {
  const match = body.match(headingLine)
  if (!match || match.index === undefined) {
    return ""
  }

  const afterHeading = body.slice(match.index + match[0].length)
  const nextSection = afterHeading.search(/^##\s+/m)

  if (nextSection === -1) {
    return afterHeading.trim()
  }

  return afterHeading.slice(0, nextSection).trim()
}
