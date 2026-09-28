import { NextRequest, NextResponse } from "next/server"

import {
  createWebChatSession,
  WEB_CHAT_SESSION_MAX_AGE,
} from "@/lib/web-chat-session"

export const runtime = "nodejs"

const responseHeaders = {
  "Cache-Control": "private, no-store",
  Vary: "Cookie",
}

function browserOrigin(request: NextRequest): URL | null {
  const value = request.headers.get("origin")
  if (!value) return null

  try {
    const origin = new URL(value)
    return origin.origin === value ? origin : null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const origin = browserOrigin(request)
  const authority = request.headers.get("host") ?? request.nextUrl.host
  if (!origin || origin.host !== authority) {
    return NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403, headers: responseHeaders }
    )
  }

  const secure = origin.protocol === "https:"
  const loopback = ["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname)
  if (!secure && process.env.NODE_ENV === "production" && !loopback) {
    return NextResponse.json(
      { error: "Live chat is unavailable" },
      { status: 503, headers: responseHeaders }
    )
  }

  const cookieName = secure ? "__Host-novu-web-chat" : "novu-web-chat-local"
  const result = createWebChatSession(request.cookies.get(cookieName)?.value)
  if (!result) {
    return NextResponse.json(
      { error: "Live chat is unavailable" },
      { status: 503, headers: responseHeaders }
    )
  }

  const response = NextResponse.json(result.session, {
    headers: responseHeaders,
  })
  response.cookies.set(cookieName, result.cookie, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: WEB_CHAT_SESSION_MAX_AGE,
  })
  return response
}
