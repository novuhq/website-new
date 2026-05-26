/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || "http://localhost:3000",
  trailingSlash: true,
  generateRobotsTxt: false,
  sitemapBaseFileName: "next-sitemap",
  exclude: ["/studio", "/studio/*", "/api/*"],
}
