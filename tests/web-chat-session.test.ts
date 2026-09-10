import assert from "node:assert/strict"
import { createHmac } from "node:crypto"
import { afterEach, beforeEach, it } from "node:test"

import { NextRequest } from "next/server"

import { POST } from "@/app/(website)/api/web-chat/session/route"

const keys = [
  "NOVU_WEB_CHAT_APPLICATION_IDENTIFIER",
  "NOVU_WEB_CHAT_SECRET_KEY",
  "NOVU_WEB_CHAT_HMAC_ENABLED",
] as const
const saved = new Map(keys.map((key) => [key, process.env[key]]))
const secret = "web-chat-unit-test-secret-not-a-real-key"
const origin = "https://novu.example"

beforeEach(() => {
  process.env.NOVU_WEB_CHAT_APPLICATION_IDENTIFIER = "test-app"
  process.env.NOVU_WEB_CHAT_SECRET_KEY = secret
  process.env.NOVU_WEB_CHAT_HMAC_ENABLED = "true"
})
afterEach(() => {
  for (const key of keys) {
    const value = saved.get(key)
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
})

function request(cookie?: string, requestOrigin = origin, suffix = "") {
  return new NextRequest(`${origin}/api/web-chat/session${suffix}`, {
    method: "POST",
    headers: { origin: requestOrigin, ...(cookie ? { cookie } : {}) },
  })
}
const cookieFrom = (response: Response) =>
  response.headers.get("set-cookie")!.split(";")[0]

it("issues different authenticated identities to independent visitors", async () => {
  const first = await POST(request())
  const second = await POST(request())
  assert.equal(first.status, 200)
  assert.equal(second.status, 200)
  const a = await first.json()
  const b = await second.json()
  assert.notEqual(a.subscriberId, b.subscriberId)
  assert.match(a.subscriberId, /^web-chat-[0-9a-f-]{36}$/)
  assert.equal(a.applicationIdentifier, "test-app")
  assert.equal(
    a.subscriberHash,
    createHmac("sha256", secret).update(a.subscriberId).digest("hex")
  )
  assert.equal(
    b.subscriberHash,
    createHmac("sha256", secret).update(b.subscriberId).digest("hex")
  )
  assert.ok(!JSON.stringify(a).includes(secret))
})

it("reuses only a verified visitor cookie and prevents credential caching", async () => {
  const first = await POST(request())
  const cookie = first.headers.get("set-cookie")!
  assert.match(cookie, /HttpOnly/i)
  assert.match(cookie, /Secure/i)
  assert.match(cookie, /SameSite=Strict/i)
  assert.match(cookie, /Path=\//i)
  assert.match(first.headers.get("cache-control")!, /private.*no-store/)
  const again = await POST(request(cookieFrom(first)))
  assert.deepEqual(await again.json(), await first.json())
})

it("does not sign a subscriber id supplied in a cookie, query, or request body", async () => {
  const original = await POST(request())
  const identity = await original.json()
  const forged = cookieFrom(original).replace(
    identity.subscriberId,
    "web-chat-00000000-0000-4000-8000-000000000000"
  )
  const replacement = await POST(
    new NextRequest(`${origin}/api/web-chat/session?subscriberId=victim`, {
      method: "POST",
      headers: { origin, cookie: forged, "content-type": "application/json" },
      body: JSON.stringify({
        subscriberId: "victim",
        subscriberHash: "forged",
      }),
    })
  )
  const result = await replacement.json()
  assert.equal(replacement.status, 200)
  assert.notEqual(result.subscriberId, identity.subscriberId)
  assert.notEqual(
    result.subscriberId,
    "web-chat-00000000-0000-4000-8000-000000000000"
  )
  assert.notEqual(result.subscriberId, "victim")
})

it("does not accept a cookie signed for another Novu application", async () => {
  const first = await POST(request())
  const a = await first.json()
  process.env.NOVU_WEB_CHAT_APPLICATION_IDENTIFIER = "other-app"
  const b = await (await POST(request(cookieFrom(first)))).json()
  assert.notEqual(a.subscriberId, b.subscriberId)
})

it("rotates an expired visitor cookie instead of renewing the old identity", async (t) => {
  const first = await POST(request())
  const a = await first.json()
  const later = Date.now() + 25 * 60 * 60 * 1000
  t.mock.method(Date, "now", () => later)
  const b = await (await POST(request(cookieFrom(first)))).json()
  assert.notEqual(a.subscriberId, b.subscriberId)
})

it("keeps live chat unavailable until HMAC setup is explicitly confirmed", async () => {
  process.env.NOVU_WEB_CHAT_HMAC_ENABLED = "false"
  assert.equal((await POST(request())).status, 503)
})

it("does not turn a Novu subscriber hash into a visitor cookie signature", async () => {
  const first = await POST(request())
  const a = await first.json()
  const cookie = cookieFrom(first).replace(/[0-9a-f]{64}$/, a.subscriberHash)
  const b = await (await POST(request(cookie))).json()
  assert.notEqual(a.subscriberId, b.subscriberId)
})

for (const key of keys) {
  it(`keeps live chat unavailable without ${key}`, async () => {
    delete process.env[key]
    const response = await POST(request())
    assert.equal(response.status, 503)
    assert.equal(response.headers.get("set-cookie"), null)
    assert.match(response.headers.get("cache-control")!, /no-store/)
    assert.deepEqual(await response.json(), {
      error: "Live chat is unavailable",
    })
  })
}

it("rejects cross-origin session requests", async () => {
  const response = await POST(request(undefined, "https://other.example"))
  assert.equal(response.status, 403)
  assert.equal(response.headers.get("set-cookie"), null)
})

it("validates the browser origin against Host when Next normalizes its internal URL", async () => {
  const response = await POST(
    new NextRequest("https://localhost/api/web-chat/session", {
      method: "POST",
      headers: { origin, host: "novu.example" },
    })
  )
  assert.equal(response.status, 200)
})
