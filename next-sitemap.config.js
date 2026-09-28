// Static agent-discovery files served from `public/`. They are not Next.js
// routes, so next-sitemap can't find them automatically. They are real files
// (not directories), so `trailingSlash: false` keeps the canonical URL exact.
const agentDiscoveryFiles = ["/agents.md", "/auth.md", "/llms.txt"]

const siteUrl =
  process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || "http://localhost:3000"
const contributorsApiUrl = (
  process.env.CONTRIBUTORS_API_URL || "https://contributors.novu.co"
).replace(/\/$/, "")

async function getContributorPaths(lastmod) {
  try {
    const response = await globalThis.fetch(
      `${contributorsApiUrl}/contributors`,
      {
        signal: globalThis.AbortSignal.timeout(10_000),
      }
    )
    if (!response.ok) return []

    const payload = await response.json()
    const contributors = Array.isArray(payload?.list) ? payload.list : []
    const githubHandles = new Set(
      contributors
        .filter(({ teammate }) => teammate !== true)
        .map(({ github }) => github)
        .filter(
          (github) =>
            typeof github === "string" && /^[a-zA-Z0-9-]{1,39}$/.test(github)
        )
        .map((github) => github.toLowerCase())
    )

    return [...githubHandles].map((github) => ({
      loc: `/contributors/${github}`,
      changefreq: "weekly",
      priority: 0.6,
      lastmod,
    }))
  } catch {
    return []
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  trailingSlash: true,
  // robots.txt is served by src/app/(website)/robots.txt/route.ts so it is
  // included in the Next.js build output (postbuild public/ files are not).
  generateRobotsTxt: false,
  sitemapBaseFileName: "next-sitemap",
  exclude: ["/studio", "/studio/*", "/api/*"],
  additionalPaths: async () => {
    const lastmod = new Date().toISOString()
    const contributorPaths = await getContributorPaths(lastmod)
    const discoveryPaths = agentDiscoveryFiles.map((loc) => ({
      loc,
      trailingSlash: false,
      changefreq: "weekly",
      priority: 0.7,
      lastmod,
    }))

    return [...discoveryPaths, ...contributorPaths]
  },
}
