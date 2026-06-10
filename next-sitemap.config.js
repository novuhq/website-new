// Static agent-discovery files served from `public/`. They are not Next.js
// routes, so next-sitemap can't find them automatically. They are real files
// (not directories), so `trailingSlash: false` keeps the canonical URL exact.
const agentDiscoveryFiles = ["/agents.md", "/auth.md", "/llms.txt"]

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || "http://localhost:3000",
  trailingSlash: true,
  generateRobotsTxt: false,
  sitemapBaseFileName: "next-sitemap",
  exclude: ["/studio", "/studio/*", "/api/*"],
  additionalPaths: async () =>
    agentDiscoveryFiles.map((loc) => ({
      loc,
      trailingSlash: false,
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    })),
}
