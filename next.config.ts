import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  trailingSlash: true,
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
  images: {
    formats: ["image/webp"],
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
