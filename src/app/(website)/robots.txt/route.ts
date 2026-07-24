import { absoluteUrl, getSiteUrl } from "@/lib/site-url"

const CONTENT_SIGNAL = "Content-Signal: ai-train=yes, search=yes, ai-input=yes"

function buildRobotsTxt() {
  const siteUrl = getSiteUrl()

  return [
    "# AI agents: see /llms.txt and /agents.md",
    "User-agent: *",
    "Allow: /",
    CONTENT_SIGNAL,
    "",
    `Host: ${siteUrl}`,
    "",
    `Sitemap: ${absoluteUrl("/next-sitemap.xml")}`,
    `Sitemap: ${absoluteUrl("/sitemap-index.xml")}`,
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
