import assert from "node:assert/strict"
import test from "node:test"

import { NextRequest } from "next/server"

import { POST } from "../src/app/api/experiments/getting-started-flow/route"
import {
  GETTING_STARTED_FLOW_EXPOSED_EVENT,
  GETTING_STARTED_FLOW_SELECTED_EVENT,
} from "../src/lib/getting-started-flow-experiment"

const ENDPOINT = "https://novu.co/api/experiments/getting-started-flow/"

function createRequest(body: unknown, origin = "https://novu.co") {
  return new NextRequest(ENDPOINT, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Host: "novu.co",
      Origin: origin,
      "Sec-Fetch-Site":
        origin === "https://novu.co" ? "same-origin" : "cross-site",
    },
    method: "POST",
  })
}

function createBody(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    anonymousId: "00000000-0000-4000-8000-000000000001",
    assignment: { isQa: false, source: "random", variant: "cli" },
    event: GETTING_STARTED_FLOW_EXPOSED_EVENT,
    messageId: "gsf-00000000-0000-4000-8000-000000000002",
    properties: {},
    ...overrides,
  }
}

async function withEnvironment<T>(
  values: Record<string, string | undefined>,
  callback: () => Promise<T>
) {
  const previous = Object.fromEntries(
    Object.keys(values).map((key) => [key, process.env[key]])
  )

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }

  try {
    return await callback()
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
}

test("rejects cross-origin and inconsistent experiment events", async () => {
  const missingBrowserHeaders = await POST(
    new NextRequest(ENDPOINT, {
      body: JSON.stringify(createBody()),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
  )
  assert.equal(missingBrowserHeaders.status, 403)

  const crossOrigin = await POST(
    createRequest(createBody(), "https://attacker.example")
  )
  assert.equal(crossOrigin.status, 403)

  const inconsistentAssignment = await POST(
    createRequest(
      createBody({
        assignment: { isQa: false, source: "qa", variant: "cli" },
      })
    )
  )
  assert.equal(inconsistentAssignment.status, 400)

  const wrongArmAction = await POST(
    createRequest(
      createBody({
        event: GETTING_STARTED_FLOW_SELECTED_EVENT,
        properties: { action: "copy_prompt" },
      })
    )
  )
  assert.equal(wrongArmAction.status, 400)
})

test("drops production and QA events when their switches are disabled", async () => {
  await withEnvironment(
    {
      CRITICAL_FLOW_TESTING: "0",
      GETTING_STARTED_FLOW_EXPERIMENT_ENABLED: "false",
      GETTING_STARTED_FLOW_EXPERIMENT_QA_ENABLED: "false",
      NODE_ENV: "production",
      VERCEL_ENV: "production",
    },
    async () => {
      const productionResponse = await POST(createRequest(createBody()))
      assert.equal(productionResponse.status, 204)
      assert.equal(productionResponse.headers.get("set-cookie"), null)

      const qaResponse = await POST(
        createRequest(
          createBody({
            assignment: { isQa: true, source: "qa", variant: "prompt" },
          })
        )
      )
      assert.equal(qaResponse.status, 204)
      assert.equal(qaResponse.headers.get("set-cookie"), null)
    }
  )
})

test("preserves the Segment payload and reports upstream failure", async () => {
  await withEnvironment(
    {
      CRITICAL_FLOW_TESTING: "0",
      GETTING_STARTED_FLOW_EXPERIMENT_ENABLED: "true",
      NEXT_PUBLIC_SEGMENT_WRITE_KEY: "test-write-key",
      NODE_ENV: "production",
    },
    async () => {
      const originalFetch = globalThis.fetch
      const requests: Array<{
        body: Record<string, unknown>
        authorization: string | null
      }> = []

      try {
        globalThis.fetch = (async (_input, init) => {
          requests.push({
            authorization: new Headers(init?.headers).get("authorization"),
            body: JSON.parse(String(init?.body)) as Record<string, unknown>,
          })
          return new Response(null, { status: 500 })
        }) as typeof fetch

        const body = createBody()
        const response = await POST(createRequest(body))

        assert.equal(response.status, 503)
        assert.match(
          response.headers.get("set-cookie") ?? "",
          /ajs_anonymous_id=/
        )
        assert.equal(requests.length, 1)
        assert.equal(requests[0].body.event, body.event)
        assert.equal(requests[0].body.messageId, body.messageId)
        assert.equal(requests[0].authorization, "Basic dGVzdC13cml0ZS1rZXk6")
      } finally {
        globalThis.fetch = originalFetch
      }
    }
  )
})
