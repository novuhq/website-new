// Static agent-discovery files served from `public/`. They are not Next.js
// routes, so next-sitemap can't find them automatically. They are real files
// (not directories), so `trailingSlash: false` keeps the canonical URL exact.
const agentDiscoveryFiles = ["/agents.md", "/auth.md", "/llms.txt"]

const siteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || "http://localhost:3000"

const CONTENT_SIGNAL = "Content-Signal: ai-train=yes, search=yes, ai-input=yes"

function addContentSignal(robotsTxt) {
  return robotsTxt
    .split("\n")
    .flatMap((line) =>
      line.trim() === "Allow: /" ? [line, CONTENT_SIGNAL] : [line]
    )
    .join("\n")
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  trailingSlash: true,
  generateRobotsTxt: true,
  sitemapBaseFileName: "next-sitemap",
  exclude: ["/studio", "/studio/*", "/api/*"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
    additionalSitemaps: [`${siteUrl}/sitemap-index.xml`],
    transformRobotsTxt: async (_, robotsTxt) => addContentSignal(robotsTxt),
  },
  additionalPaths: async () =>
    agentDiscoveryFiles.map((loc) => ({
      loc,
      trailingSlash: false,
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    })),
}
