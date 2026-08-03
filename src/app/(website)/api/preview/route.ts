import { draftMode } from "next/headers"
import { defineEnableDraftMode } from "next-sanity/draft-mode"

import { getPreviewClient } from "@/lib/sanity/client"

/**
 * Preview API route used by Sanity Studio.
 *
 * `defineEnableDraftMode` verifies Sanity's short-lived preview URL secret
 * before it enables the draft-mode cookie and redirects to the validated path.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const disable = searchParams.get("disable")

  if (disable) {
    const draft = await draftMode()
    draft.disable()

    return new Response("Draft mode is disabled")
  }

  try {
    const enableDraftMode = defineEnableDraftMode({
      client: getPreviewClient(),
    })

    return enableDraftMode.GET(request)
  } catch (error) {
    console.error("Unable to enable Sanity draft mode", error)
    return new Response("Draft mode is unavailable", { status: 503 })
  }
}
