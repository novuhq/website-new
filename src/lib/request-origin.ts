import type { NextRequest } from "next/server"

/**
 * The request's `Origin` when it matches the host it was sent to, else null.
 * Browsers send `Origin` on every POST, so this rejects cross-site form and
 * fetch submissions. It does not stop scripted clients, which can set any
 * header; rate limiting has to happen in front of the app.
 */
export function sameOriginRequest(request: NextRequest): URL | null {
  const value = request.headers.get("origin")
  if (!value) return null

  let origin: URL
  try {
    origin = new URL(value)
  } catch {
    return null
  }
  if (origin.origin !== value) return null

  const authority = request.headers.get("host") ?? request.nextUrl.host
  return origin.host === authority ? origin : null
}
