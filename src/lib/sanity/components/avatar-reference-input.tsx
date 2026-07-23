/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import { Box, Card, Flex, Stack, Text } from "@sanity/ui"
import { ReferenceInputProps, useClient } from "sanity"

interface IAvatarPreview {
  name?: string
  darkImageUrl?: string
  lightImageUrl?: string
}

function AvatarCircle({
  src,
  label,
  size = 56,
}: {
  src: string
  label: string
  size?: number
}) {
  return (
    <Box
      aria-label={label}
      style={{
        width: size,
        height: size,
        overflow: "hidden",
        borderRadius: "9999px",
        background: "#111217",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
      }}
    >
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Box>
  )
}

function AvatarReferenceInput(props: ReferenceInputProps) {
  const { value, renderDefault } = props
  const client = useClient({
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19",
  })
  const [preview, setPreview] = useState<IAvatarPreview | null>(null)

  useEffect(() => {
    let isMounted = true
    const ref = value?._ref

    if (!ref) {
      setPreview(null)
      return
    }

    client
      .fetch<IAvatarPreview | null>(
        `*[_id == $ref || _id == "drafts." + $ref][0]{
          name,
          "darkImageUrl": darkImage.asset->url,
          "lightImageUrl": lightImage.asset->url
        }`,
        { ref }
      )
      .then((nextPreview) => {
        if (isMounted) {
          setPreview(nextPreview)
        }
      })
      .catch(() => {
        if (isMounted) {
          setPreview(null)
        }
      })

    return () => {
      isMounted = false
    }
  }, [client, value?._ref])

  return (
    <Stack space={4}>
      {renderDefault(props)}

      {preview?.darkImageUrl && (
        <Card padding={4} radius={3} tone="transparent" border>
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Preview
            </Text>
            <Flex align="center" gap={4}>
              <Flex align="center" gap={2}>
                <AvatarCircle
                  src={preview.darkImageUrl}
                  label={`${preview.name || "Selected avatar"} dark variant`}
                  size={64}
                />
                <Text size={1} muted>
                  Dark
                </Text>
              </Flex>
              {preview.lightImageUrl && (
                <Flex align="center" gap={2}>
                  <AvatarCircle
                    src={preview.lightImageUrl}
                    label={`${preview.name || "Selected avatar"} light variant`}
                    size={64}
                  />
                  <Text size={1} muted>
                    Light
                  </Text>
                </Flex>
              )}
            </Flex>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}

export default AvatarReferenceInput
