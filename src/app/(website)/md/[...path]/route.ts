import type { NextRequest } from "next/server"

import {
  getMarkdownPageByPath,
  markdownResponseBody,
} from "@/lib/markdown/page-markdown"
import {
  getSiteUrl,
  pathSegmentsToPathname,
  toCanonicalPathname,
  toMarkdownPathname,
} from "@/lib/markdown/url"

type RouteContext = {
  params: Promise<{ path: string[] }>
}

function markdownHeaders({
  canonicalPathname,
  markdownPathname,
  noIndex,
}: {
  canonicalPathname: string
  markdownPathname: string
  noIndex?: boolean
}) {
  const siteUrl = getSiteUrl()
  const headers = new Headers({
    "Content-Type": "text/markdown; charset=utf-8",
    "Cache-Control":
      "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    "X-Content-Type-Options": "nosniff",
    Link: [
      `<${siteUrl}${canonicalPathname}>; rel="canonical"`,
      `<${siteUrl}${markdownPathname}>; rel="alternate"; type="text/markdown"`,
    ].join(", "),
  })

  if (noIndex) {
    headers.set("X-Robots-Tag", "noindex")
  }

  return headers
}

async function getMarkdownResponse(
  request: NextRequest,
  context: RouteContext
) {
  if (request.nextUrl.pathname.startsWith("/md/")) {
    return new Response("Not found", { status: 404 })
  }

  const { path } = await context.params
  const pathname = pathSegmentsToPathname(path)
  if (!pathname) {
    return new Response("Not found", { status: 404 })
  }

  const result = await getMarkdownPageByPath(pathname)

  if (result.type === "not-found") {
    return new Response(
      "Markdown representation is not available for this resource.",
      {
        status: 404,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      }
    )
  }

  if (result.type === "redirect") {
    return Response.redirect(new URL(result.location, request.url), 308)
  }

  const canonicalPathname = toCanonicalPathname(result.page.pathname)
  const markdownPathname = toMarkdownPathname(result.page.pathname)
  const headers = markdownHeaders({
    canonicalPathname,
    markdownPathname,
    noIndex: result.page.noIndex,
  })

  return new Response(markdownResponseBody(result.page), { headers })
}

export async function GET(request: NextRequest, context: RouteContext) {
  return getMarkdownResponse(request, context)
}

export async function HEAD(request: NextRequest, context: RouteContext) {
  const response = await getMarkdownResponse(request, context)
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  })
}
