import { revalidateTag } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"
import { parseBody } from "next-sanity/webhook"

const WEBHOOK_TYPES = ["changelogPost"] as const

type WebhookPayload = {
  _type: (typeof WEBHOOK_TYPES)[number]
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response(
        "Missing environment variable SANITY_REVALIDATE_SECRET",
        { status: 500 }
      )
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true
    )

    if (!isValidSignature) {
      const message = "Invalid signature"

      return new Response(JSON.stringify({ message, isValidSignature, body }), {
        status: 401,
      })
    } else if (!body?._type || !WEBHOOK_TYPES.includes(body._type)) {
      const message = "Bad Request"

      return new Response(JSON.stringify({ message, body }), { status: 400 })
    }

    const type = body._type

    revalidateTag(type)

    return NextResponse.json({ body })
  } catch (err) {
    return new Response((err as Error).message, { status: 500 })
  }
}
