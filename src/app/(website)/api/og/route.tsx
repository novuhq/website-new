import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"
import config from "@/configs/website-config"

export const runtime = "edge"
export const preferredRegion = "auto"

const DEFAULT_WIDTH = 1200
const DEFAULT_HEIGHT = 630

const DEFAULT_TEMPLATES = {
  default: "/og-images/default.jpg",
} as const

type TemplateKey = keyof typeof DEFAULT_TEMPLATES

const getTemplateImage = (key: string): string => {
  return DEFAULT_TEMPLATES[key as TemplateKey] || DEFAULT_TEMPLATES.default
}

function sanitizeTitle(str: string) {
  return (
    str
      // Normalize quotes
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
      .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
      // Normalize dashes
      .replace(/[\u2013\u2014\u2212]/g, "-")
      // Normalize ellipsis
      .replace(/\u2026/g, "...")
      // Remove non-breaking & soft hyphen
      .replace(/\u00A0/g, " ")
      .replace(/\u00AD/g, "")
      // Escape HTML entities
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      // Remove control chars (except \n, \t)
      .replace(/[\u0000-\u001F\u007F]/g, "")
  )
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const templateKey = searchParams.get("template") || "default"
    const title = sanitizeTitle(searchParams.get("title") || "")
    const width = parseInt(searchParams.get("width") || `${DEFAULT_WIDTH}`, 10)
    const height = parseInt(
      searchParams.get("height") || `${DEFAULT_HEIGHT}`,
      10
    )

    const imageUrl = getTemplateImage(templateKey)

    const siteUrl =
      process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || "http://localhost:3000"
    const background = fetch(`${siteUrl}${imageUrl}`).then((res) =>
      res.arrayBuffer()
    )
    const font = fetch(
      `${siteUrl}/fonts/brother-1816/brother-1816-regular.ttf`
    ).then((res) => res.arrayBuffer())

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
            padding: "40px",
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
              objectFit: "cover",
            }}
            src={backgroundDataUrl}
            alt=""
            width={width}
            height={height}
          />

          <h1
            style={{
              position: "relative",
              zIndex: 10,
              fontSize: "3.5rem",
              letterSpacing: "-0.04em",
              fontWeight: 600,
              lineHeight: 1.25,
              color: "white",
              maxWidth: "80%",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </h1>
        </div>
      ),
      {
        width,
        height,
        fonts: [
          { name: "Brother1816", data: fontRes, style: "normal", weight: 400 },
        ],
      }
    )
  } catch (e) {
    console.error(e)
    return new Response("Failed to generate the image", { status: 500 })
  }
}
