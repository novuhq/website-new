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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const templateKey = searchParams.get("template") || "default"
    const title = searchParams.get("title") || ""
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
    const font = fetch(`${siteUrl}/fonts/inter/inter-regular.ttf`).then((res) =>
      res.arrayBuffer()
    )

    const [fontRes, backgroundRes] = await Promise.all([font, background])

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
            src={backgroundRes as unknown as string}
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
