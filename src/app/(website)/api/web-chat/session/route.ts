import { NextRequest, NextResponse } from "next/server"

import {
  createWebChatSession,
  WEB_CHAT_SESSION_MAX_AGE,
} from "@/lib/web-chat-session"

export const runtime = "nodejs"

const headers = { "Cache-Control": "private, no-store", Vary: "Cookie" }

export async function POST(request: NextRequest) {
  // Next may normalize request.url to localhost in development. Host retains
  // the browser-facing authority and cannot be overridden by browser JS.
  const authority = request.headers.get("host") ?? request.nextUrl.host
  const expectedOrigin = `${request.nextUrl.protocol}//${authority}`
  if (request.headers.get("origin") !== expectedOrigin) {
    return NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403, headers }
    )
  }
  const secure = request.nextUrl.protocol === "https:"
  if (!secure && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Live chat is unavailable" },
      { status: 503, headers }
    )
  }
  const cookieName = secure ? "__Host-novu-web-chat" : "novu-web-chat-local"
  const result = createWebChatSession(request.cookies.get(cookieName)?.value)
  if (!result) {
    return NextResponse.json(
      { error: "Live chat is unavailable" },
      { status: 503, headers }
    )
  }
  const response = NextResponse.json(result.session, { headers })
  response.cookies.set(cookieName, result.cookie, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: WEB_CHAT_SESSION_MAX_AGE,
  })
  return response
}
