import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"
import { parseBody } from "next-sanity/webhook"

const WEBHOOK_TYPES = ["changelogPost", "customers", "customer"] as const

type WebhookPayload = {
  _type: (typeof WEBHOOK_TYPES)[number]
  orderRank?: string
}

// Debounce for customer order changes
let customersRevalidateTimer: NodeJS.Timeout | null = null
const DEBOUNCE_DELAY = 2000

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
    const orderRank = body.orderRank

    revalidateTag(type)

    if (type === "customer") {
      revalidateTag("customers")

      if (orderRank) {
        if (customersRevalidateTimer) {
          clearTimeout(customersRevalidateTimer)
        }

        customersRevalidateTimer = setTimeout(() => {
          revalidatePath("/customers")
          customersRevalidateTimer = null
        }, DEBOUNCE_DELAY)

        return NextResponse.json({
          revalidated: "debounced",
          type,
          orderRank: true,
          timestamp: Date.now(),
        })
      } else {
        revalidatePath("/customers")
      }
    }

    return NextResponse.json(
      {
        revalidated: true,
        type,
        timestamp: Date.now(),
      },
      {
        headers: {
          // Prevent CDN caching of this endpoint
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      }
    )
  } catch (err) {
    return new Response((err as Error).message, { status: 500 })
  }
}
