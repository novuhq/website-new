import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"
import config from "@/configs/website-config"

import { getSiteUrl } from "@/lib/site-url"

export const runtime = "edge"
export const preferredRegion = "auto"

const DEFAULT_WIDTH = 1200
const DEFAULT_HEIGHT = 630
const MIN_WIDTH = 300
const MAX_WIDTH = 1600
const MIN_HEIGHT = 150
const MAX_HEIGHT = 900
const MAX_TITLE_LENGTH = 180

const DEFAULT_TEMPLATES = {
  default: "/og-images/default.jpg",
  blog: "/og-images/default-post.jpg",
  changelog: "/og-images/default-post.jpg",
} as const

type TemplateKey = keyof typeof DEFAULT_TEMPLATES

const getTemplateImage = (key: string): string => {
  return DEFAULT_TEMPLATES[key as TemplateKey] || DEFAULT_TEMPLATES.default
}

function getBoundedDimension(
  value: string | null,
  fallback: number,
  minimum: number,
  maximum: number
) {
  if (!value || !/^\d{1,4}$/.test(value)) return fallback
  return Math.min(maximum, Math.max(minimum, Number(value)))
}

function getSafeTitle(value: string) {
  let title = ""

  for (const character of value) {
    const codePoint = character.codePointAt(0)
    title +=
      codePoint !== undefined && (codePoint < 32 || codePoint === 127)
        ? " "
        : character
    if (title.length >= MAX_TITLE_LENGTH) break
  }

  return title.trim().slice(0, MAX_TITLE_LENGTH)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const templateKey = (searchParams.get("template") || "default").slice(0, 32)
    const title = getSafeTitle(searchParams.get("title") || "")
    const width = getBoundedDimension(
      searchParams.get("width"),
      DEFAULT_WIDTH,
      MIN_WIDTH,
      MAX_WIDTH
    )
    const height = getBoundedDimension(
      searchParams.get("height"),
      DEFAULT_HEIGHT,
      MIN_HEIGHT,
      MAX_HEIGHT
    )

    const imageUrl = getTemplateImage(templateKey)

    const siteUrl = getSiteUrl()
    const background = fetch(`${siteUrl}${imageUrl}`).then((res) =>
      res.arrayBuffer()
    )
    const font = fetch(`${siteUrl}/fonts/inter/inter-regular.ttf`).then((res) =>
      res.arrayBuffer()
    )

    const [fontRes, backgroundRes] = await Promise.all([font, background])

    // Convert ArrayBuffer to base64 data URL
    const backgroundBase64 = Buffer.from(backgroundRes).toString("base64")
    const backgroundDataUrl = `data:image/jpeg;base64,${backgroundBase64}`

    return new ImageResponse(
      (
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            width: "100%",
            height: "100%",
            backgroundColor: config.metaThemeColor,
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            src={backgroundDataUrl}
            alt=""
          />

          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              paddingLeft: "56px",
              paddingRight: "115px",
              paddingBottom: "44px",
              width: "100%",
            }}
          >
            <h1
              style={{
                fontSize: "3.875rem",
                letterSpacing: "-0.04em",
                fontWeight: 600,
                lineHeight: 1.25,
                color: "white",
                maxWidth: "100%",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </h1>
          </div>
        </div>
      ),
      {
        width,
        height,
        fonts: [
          { name: "Inter", data: fontRes, style: "normal", weight: 400 },
          { name: "Inter", data: fontRes, style: "normal", weight: 600 },
        ],
      }
    )
  } catch (e) {
    console.error(e)
    return new Response("Failed to generate the image", { status: 500 })
  }
}
