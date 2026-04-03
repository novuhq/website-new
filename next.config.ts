import type { NextConfig } from "next"

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy-Report-Only",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdn.segment.com https://snap.licdn.com https://plausible.io https://chat.cdn-plain.com; style-src 'self' 'unsafe-inline' https://use.typekit.net; font-src 'self' https://use.typekit.net https://p.typekit.net; img-src 'self' data: blob: https://cdn.sanity.io https://img.youtube.com https://manage.novu.co https://www.googletagmanager.com; frame-src https://www.googletagmanager.com https://www.youtube.com https://www.youtube-nocookie.com https://app.cal.com; connect-src 'self' https://api.github.com https://uptime.betterstack.com https://api.hsforms.com https://*.sanity.io https://cdn.sanity.io https://api.segment.io https://cdn.segment.com https://api.mixpanel.com https://snap.licdn.com https://plausible.io https://www.googletagmanager.com https://chat.cdn-plain.com; media-src 'self' https://cdn.sanity.io; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self' https://api.hsforms.com; frame-ancestors 'none'",
  },
  {
    key: "Feature-Policy",
    value: "camera 'none'; microphone 'none'; geolocation 'none'",
  },
]

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/integrations",
        destination: "/integrations/channels",
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
  serverExternalPackages: [
    "eslint",
    "postcss",
    "prettier",
    "shiki",
    "typescript",
  ],
  outputFileTracingIncludes: {
    "/integrations/channels": ["./src/content/integrations/**/*.mdx"],
    "/integrations/sources": ["./src/content/integrations/**/*.mdx"],
    "/integrations/[slug]": ["./src/content/integrations/**/*.mdx"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "manage.novu.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
