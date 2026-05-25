import { ImageValue, ValidationContext } from "sanity"

export const MAX_TEMPLATE_AVATAR_IMAGE_SIZE_BYTES = 100 * 1024

export const customImageFileSizeValidation =
  (maxSizeBytes = MAX_TEMPLATE_AVATAR_IMAGE_SIZE_BYTES) =>
  async (value: ImageValue | undefined, context?: ValidationContext) => {
    if (!value?.asset?._ref) {
      return true
    }

    const client = context?.getClient({
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19",
    })

    if (!client) {
      return true
    }

    let asset: { size?: number } | null

    try {
      asset = await client.fetch<{ size?: number } | null>(
        `*[_id == $assetId][0]{size}`,
        { assetId: value.asset._ref }
      )
    } catch {
      return true
    }

    if (!asset?.size || asset.size <= maxSizeBytes) {
      return true
    }

    return `Image must be ${Math.round(maxSizeBytes / 1024)}KB or smaller.`
  }
