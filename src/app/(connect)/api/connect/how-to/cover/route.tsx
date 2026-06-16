import type { CSSProperties } from "react"
import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

import {
  HOW_TO_COVER_HEIGHT,
  HOW_TO_COVER_WIDTH,
  isHowToCoverTemplate,
  type THowToCoverTemplate,
} from "@/lib/how-to/cover"

export const runtime = "edge"
export const preferredRegion = "auto"

const COVER_TEMPLATES = {
  default: {
    path: "/og-images/how-to/default.png",
  },
  "template-1": {
    path: "/og-images/how-to/template-1.jpg",
  },
  "template-2": {
    path: "/og-images/how-to/template-2.png",
  },
} satisfies Record<THowToCoverTemplate, { path: string }>

const SCALE = 2
const LOCAL_ASSET_BASE_URL = "http://localhost:3000"

const TITLE_STYLE = {
  display: "-webkit-box",
  margin: 0,
  overflow: "hidden",
  color: "white",
  fontSize: 40 * SCALE,
  fontWeight: 500,
  letterSpacing: `${-0.8 * SCALE}px`,
  lineHeight: 1.25,
  textOverflow: "ellipsis",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3,
  wordBreak: "break-word",
} satisfies CSSProperties

function getTemplateKey(value: string | null): THowToCoverTemplate {
  return isHowToCoverTemplate(value) ? value : "default"
}

function getVercelDeploymentUrl() {
  const vercelUrl = process.env.VERCEL_URL

  if (!vercelUrl) {
    return null
  }

  return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`
}

function getPublicAssetBaseUrl() {
  return (
    getVercelDeploymentUrl() ||
    process.env.NEXT_PUBLIC_DEFAULT_SITE_URL ||
    LOCAL_ASSET_BASE_URL
  )
}

function getPublicAssetUrl(path: string) {
  return new URL(path, getPublicAssetBaseUrl()).toString()
}

async function loadCoverFont() {
  const fontUrl = getPublicAssetUrl("/fonts/inter/inter-semibold.ttf")

  try {
    const response = await fetch(fontUrl)

    if (!response.ok) {
      console.warn(
        `Failed to load how-to cover font: ${response.status} ${response.statusText}`
      )

      return null
    }

    return response.arrayBuffer()
  } catch (error) {
    console.warn("Failed to load how-to cover font", error)

    return null
  }
}

function CoverTitle({
  hasCustomFont,
  logo,
  template,
  title,
}: {
  hasCustomFont: boolean
  logo: string
  template: THowToCoverTemplate
  title: string
}) {
  if (!title || template === "default") {
    return null
  }

  if (template === "template-1") {
    return (
      <div
        style={{
          position: "absolute",
          top: 158,
          left: 178,
          display: "flex",
          flexDirection: "column",
          width: 986,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt=""
          style={{
            width: 256,
            height: 100,
            marginBottom: 18 * SCALE,
            objectFit: "contain",
          }}
        />
        <h1
          style={{
            ...TITLE_STYLE,
            fontFamily: hasCustomFont ? "Inter" : undefined,
          }}
        >
          {title}
        </h1>
      </div>
    )
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        bottom: 58,
        display: "flex",
        width: 1120,
      }}
    >
      <h1
        style={{
          ...TITLE_STYLE,
          fontFamily: hasCustomFont ? "Inter" : undefined,
        }}
      >
        {title}
      </h1>
    </div>
  )
}

export async function GET(request: NextRequest) {
  try {
    const template = getTemplateKey(
      request.nextUrl.searchParams.get("template")
    )
    const title = request.nextUrl.searchParams.get("title")?.trim() || ""
    const cover = COVER_TEMPLATES[template]
    const background = getPublicAssetUrl(cover.path)
    const logo = getPublicAssetUrl("/images/connect-logo.png")

    const font = await loadCoverFont()

    return new ImageResponse(
      (
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            backgroundColor: "#05050B",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={background}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <CoverTitle
            hasCustomFont={Boolean(font)}
            logo={logo}
            template={template}
            title={title}
          />
        </div>
      ),
      {
        width: HOW_TO_COVER_WIDTH,
        height: HOW_TO_COVER_HEIGHT,
        fonts: font
          ? [
              {
                name: "Inter",
                data: font,
                style: "normal",
                weight: 500,
              },
            ]
          : [],
      }
    )
  } catch (error) {
    console.error(error)

    return new Response("Failed to generate the how-to cover image", {
      status: 500,
    })
  }
}
