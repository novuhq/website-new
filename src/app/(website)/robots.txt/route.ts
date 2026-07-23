const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || "https://novu.co"

const CONTENT_SIGNAL = "Content-Signal: ai-train=yes, search=yes, ai-input=yes"

function buildRobotsTxt() {
  return [
    "User-agent: *",
    "Allow: /",
    CONTENT_SIGNAL,
    "",
    `Host: ${SITE_URL}`,
    "",
    `Sitemap: ${SITE_URL}/next-sitemap.xml`,
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
    "",
  ].join("\n")
}

export function GET() {
  return new Response(buildRobotsTxt(), {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
