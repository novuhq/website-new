import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"
import { parseBody } from "next-sanity/webhook"

import {
  REVALIDATION_CONFIG,
  WEBHOOK_TYPES,
  type WebhookType,
} from "@/lib/revalidation/config"

type WebhookPayload = {
  _type: WebhookType
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

    const config = REVALIDATION_CONFIG[type]

    config.tags.forEach((tag) => revalidateTag(tag))
    config.paths?.forEach((path) => revalidatePath(path, "page"))

    return NextResponse.json({ body })
  } catch (err) {
    return new Response((err as Error).message, { status: 500 })
  }
}
