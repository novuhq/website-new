import "server-only"

import { createClient, QueryParams } from "next-sanity"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19"

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
})
export const freshClient = client.withConfig({
  useCdn: false,
})
export function getPreviewClient() {
  const token = process.env.SANITY_API_PREVIEW_TOKEN

  if (!token) {
    throw new Error(
      "SANITY_API_PREVIEW_TOKEN is required to access draft content"
    )
  }

  return freshClient.withConfig({
    token,
    perspective: "drafts",
  })
}

export const getClient = (preview = false, useCdn = true) =>
  preview ? getPreviewClient() : useCdn ? client : freshClient

export async function sanityFetch<QueryResponse>({
  query,
  qParams = {},
  preview = false,
  tags = [],
  cache = "force-cache",
  useCdn = true,
}: {
  query: string
  qParams?: QueryParams
  preview?: boolean
  tags?: string[]
  cache?: RequestCache
  useCdn?: boolean
}): Promise<QueryResponse> {
  const resolvedCache = preview ? "no-store" : cache
  const options: { cache: RequestCache; next?: { tags: string[] } } = {
    cache: resolvedCache,
  }

  if (resolvedCache !== "no-store") {
    options.next = { tags }
  }

  return getClient(preview, useCdn).fetch<QueryResponse>(
    query,
    qParams,
    options
  )
}
