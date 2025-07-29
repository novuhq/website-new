import type { NextConfig } from "next"

import config from "./src/configs/website-config"

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
  serverExternalPackages: [
    "eslint",
    "next-mdx-remote",
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
    ],
  },
}

export default nextConfig
