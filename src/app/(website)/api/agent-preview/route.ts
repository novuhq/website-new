import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { getBrandProfile } from "@/lib/site-brand"

// Node runtime: uses Buffer (base64) and outbound fetch to arbitrary hosts.
export const runtime = "nodejs"

const bodySchema = z.object({
  url: z.string().trim().min(3).max(2048),
})

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { error: true, message: "Unsupported content type." },
        { status: 415 }
      )
    }

    let raw: unknown
    try {
      raw = await request.json()
    } catch {
      return NextResponse.json(
        { error: true, message: "Invalid JSON payload" },
        { status: 400 }
      )
    }

    const parsed = bodySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: true, message: "Enter a valid website URL" },
        { status: 400 }
      )
    }

    const brand = await getBrandProfile(parsed.data.url)
    return NextResponse.json({ brand }, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not read that site"

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: true, message: "That site took too long to respond" },
        { status: 504 }
      )
    }

    // Bad URL / blocked host / non-HTML: user-fixable, return 422 with the reason.
    return NextResponse.json({ error: true, message }, { status: 422 })
  }
}
