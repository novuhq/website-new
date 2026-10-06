import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { sameOriginRequest } from "@/lib/request-origin"
import { getBrandProfile } from "@/lib/site-brand"
import { normalizeUrl } from "@/lib/site-brand/fetch"

// Node runtime: uses Buffer (base64) and outbound fetch to arbitrary hosts.
export const runtime = "nodejs"
// Extraction has an 8s network deadline; leave headroom for parsing only.
export const maxDuration = 15

// One extraction can fetch up to 11 resources. Refuse new work past this many
// in flight on an instance instead of queueing it behind slow sites.
const MAX_IN_FLIGHT = 8
let inFlight = 0

const bodySchema = z.object({
  url: z.string().trim().min(3).max(2048),
})

function failure(message: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ error: true, message }, { status, headers })
}

export async function POST(request: NextRequest) {
  if (!sameOriginRequest(request)) {
    return failure("Invalid request origin", 403)
  }

  // Compare the media type exactly: a substring check would also accept the
  // CORS-safelisted `text/plain;charset=application/json`.
  const mediaType = (request.headers.get("content-type") ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase()
  if (mediaType !== "application/json") {
    return failure("Unsupported content type.", 415)
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return failure("Invalid JSON payload", 400)
  }

  const parsed = bodySchema.safeParse(raw)
  if (!parsed.success) return failure("Enter a valid website URL", 400)
  try {
    normalizeUrl(parsed.data.url)
  } catch {
    return failure("Enter a valid public website URL", 400)
  }

  if (inFlight >= MAX_IN_FLIGHT) {
    return failure("Too many previews in progress. Try again shortly.", 503, {
      "Retry-After": "5",
    })
  }

  inFlight += 1
  try {
    const brand = await getBrandProfile(parsed.data.url)
    return NextResponse.json({ brand }, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return failure("That site took too long to respond", 504)
    }
    // Keep upstream failures generic: their messages carry resolver, TLS and
    // connection details that would turn this endpoint into a network probe.
    return failure("Could not read that site", 422)
  } finally {
    inFlight -= 1
  }
}
