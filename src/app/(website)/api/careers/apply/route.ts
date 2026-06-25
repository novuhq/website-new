import { NextRequest, NextResponse } from "next/server"
import { createClient } from "next-sanity"
import { z } from "zod"

const applicationSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  role: z.string().trim().min(1),
  link: z.string().trim().url(),
  note: z.string().trim().min(20),
})

function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19"
  const token = process.env.SANITY_API_PREVIEW_TOKEN

  if (!projectId || !dataset || !apiVersion || !token) {
    throw new Error("Missing Sanity write configuration")
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = applicationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid application payload",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    const client = getSanityClient()
    const application = await client.create({
      _type: "candidateApplication",
      ...parsed.data,
      status: "new",
      source: "careers",
      submittedAt: now,
    })

    return NextResponse.json(
      { sent: true, id: application._id },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    const isConfigurationError = message.includes("Sanity write configuration")

    return NextResponse.json(
      {
        error: true,
        message: isConfigurationError
          ? "Server configuration error"
          : "Unable to submit application",
      },
      { status: isConfigurationError ? 500 : 502 }
    )
  }
}
