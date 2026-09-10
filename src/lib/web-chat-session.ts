import "server-only"

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto"

export type WebChatSession = {
  applicationIdentifier: string
  subscriberId: string
  subscriberHash: string
}

export const WEB_CHAT_SESSION_MAX_AGE = 24 * 60 * 60

/** Never accept a client-selected subscriber ID as input to Novu's signer. */
export function createWebChatSession(visitorCookie?: string): {
  session: WebChatSession
  cookie: string
} | null {
  const applicationIdentifier =
    process.env.NOVU_WEB_CHAT_APPLICATION_IDENTIFIER?.trim()
  const secret = process.env.NOVU_WEB_CHAT_SECRET_KEY?.trim()
  // Deployment must explicitly confirm the dashboard's HMAC setting. A public
  // identifier alone must never silently re-enable unsigned live chat.
  if (
    !applicationIdentifier ||
    !secret ||
    process.env.NOVU_WEB_CHAT_HMAC_ENABLED !== "true"
  )
    return null

  const now = Math.floor(Date.now() / 1000)
  const signCookie = (id: string, expires: number) =>
    createHmac("sha256", secret)
      .update(`web-chat-visitor:v1:${applicationIdentifier}:${id}:${expires}`)
      .digest("hex")
  const match = visitorCookie?.match(
    /^(web-chat-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\.(\d{10})\.([0-9a-f]{64})$/
  )
  let subscriberId: string | undefined
  let expires = now + WEB_CHAT_SESSION_MAX_AGE
  if (match) {
    const cookieExpires = Number(match[2])
    if (
      cookieExpires > now &&
      cookieExpires <= now + WEB_CHAT_SESSION_MAX_AGE &&
      timingSafeEqual(
        Buffer.from(match[3], "hex"),
        Buffer.from(signCookie(match[1], cookieExpires), "hex")
      )
    ) {
      subscriberId = match[1]
      expires = cookieExpires
    }
  }
  subscriberId ??= `web-chat-${randomUUID()}`
  return {
    session: {
      applicationIdentifier,
      subscriberId,
      subscriberHash: createHmac("sha256", secret)
        .update(subscriberId)
        .digest("hex"),
    },
    cookie: `${subscriberId}.${expires}.${signCookie(subscriberId, expires)}`,
  }
}
