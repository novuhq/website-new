import { NextRequest, NextResponse } from "next/server"

import { sameOriginRequest } from "@/lib/request-origin"
import {
  createWebChatSession,
  WEB_CHAT_SESSION_MAX_AGE,
} from "@/lib/web-chat-session"

export const runtime = "nodejs"

const responseHeaders = {
  "Cache-Control": "private, no-store",
  Vary: "Cookie",
}

export async function POST(request: NextRequest) {
  const origin = sameOriginRequest(request)
  if (!origin) {
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
