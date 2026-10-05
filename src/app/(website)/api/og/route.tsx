import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"
import config from "@/configs/website-config"

import { normalizeContributorGithub } from "@/lib/contributors/image-urls"
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
const MAX_AVATAR_BYTES = 2_000_000
const AVATAR_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

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

function arrayBufferToDataUrl(buffer: ArrayBuffer, contentType: string) {
  const bytes = new Uint8Array(buffer)
  let binary = ""

  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192))
  }

  return `data:${contentType};base64,${btoa(binary)}`
}

async function getGithubAvatarDataUrl(github: string, size: number) {
  try {
    const response = await fetch(
      `https://avatars.githubusercontent.com/${encodeURIComponent(github)}?v=4&size=${size}`,
      {
        headers: { Accept: "image/png,image/jpeg,image/webp" },
        signal: AbortSignal.timeout(4_000),
      }
    )
    if (!response.ok) return null

    const contentType = response.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .toLowerCase()
    const contentLength = Number(response.headers.get("content-length"))
    if (
      !contentType ||
      !AVATAR_CONTENT_TYPES.has(contentType) ||
      (Number.isFinite(contentLength) && contentLength > MAX_AVATAR_BYTES)
    ) {
      return null
    }

    const avatar = await response.arrayBuffer()
    if (!avatar.byteLength || avatar.byteLength > MAX_AVATAR_BYTES) return null

    return arrayBufferToDataUrl(avatar, contentType)
  } catch {
    return null
  }
}

async function getContributorImage(
  github: string,
  width: number,
  height: number
) {
  const compact = width <= 600 || height <= 250
  const avatarSize = compact ? 116 : 300
  const avatarDataUrl = await getGithubAvatarDataUrl(
    github,
    compact ? 160 : 384
  )
  const maximumVisibleHandleLength = compact ? 22 : 27
  const visibleGithub =
    github.length > maximumVisibleHandleLength
      ? `${github.slice(0, maximumVisibleHandleLength - 1)}…`
      : github
  const handleFontSize = compact
    ? github.length > 24
      ? 20
      : 27
    : github.length > 24
      ? 44
      : 62

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: compact ? "18px 22px" : "68px 74px",
          overflow: "hidden",
          backgroundColor: "#07070a",
          backgroundImage:
            "linear-gradient(125deg, #07070a 0%, #0c1222 52%, #170b1d 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: compact ? -90 : -260,
            right: compact ? -40 : -100,
            display: "flex",
            width: compact ? 210 : 620,
            height: compact ? 210 : 620,
            borderRadius: "999px",
            border: compact
              ? "54px solid rgba(0, 213, 255, 0.08)"
              : "150px solid rgba(0, 213, 255, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: compact ? -100 : -310,
            left: compact ? 80 : 260,
            display: "flex",
            width: compact ? 220 : 680,
            height: compact ? 220 : 680,
            borderRadius: "999px",
            border: compact
              ? "58px solid rgba(255, 77, 203, 0.07)"
              : "170px solid rgba(255, 77, 203, 0.07)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: avatarSize,
            height: avatarSize,
            flexShrink: 0,
            overflow: "hidden",
            borderRadius: "999px",
            border: compact
              ? "2px solid rgba(255, 255, 255, 0.22)"
              : "4px solid rgba(255, 255, 255, 0.22)",
            backgroundImage:
              "linear-gradient(135deg, #00d5ff 0%, #8b5cf6 52%, #ff4dcb 100%)",
          }}
        >
          {avatarDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarDataUrl}
              width={avatarSize}
              height={avatarSize}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                fontSize: compact ? 50 : 132,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {github.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: 0,
            width: compact ? width - avatarSize - 64 : width - avatarSize - 212,
            marginLeft: compact ? 20 : 64,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: compact ? 17 : 32,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#f7f7f8",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: compact ? 22 : 42,
                height: compact ? 22 : 42,
                marginRight: compact ? 7 : 13,
                borderRadius: compact ? 6 : 11,
                backgroundImage:
                  "linear-gradient(135deg, #00d5ff 0%, #ff4dcb 100%)",
                color: "white",
                fontSize: compact ? 13 : 25,
                fontWeight: 700,
              }}
            >
              N
            </span>
            novu
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: "100%",
              marginTop: compact ? 8 : 26,
              overflow: "hidden",
              color: "white",
              fontSize: handleFontSize,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.045em",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            @{visibleGithub}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: compact ? 8 : 22,
              color: "#a8a8b3",
              fontSize: compact ? 14 : 28,
              lineHeight: 1.25,
            }}
          >
            Novu open-source contributor
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  )
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

    if (templateKey === "contributor") {
      const github = normalizeContributorGithub(
        searchParams.get("github") || ""
      )
      if (!github) {
        return new Response("Invalid GitHub handle", {
          status: 400,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        })
      }

      return getContributorImage(github, width, height)
    }

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
