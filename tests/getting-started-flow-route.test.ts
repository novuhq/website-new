import assert from "node:assert/strict"
import test from "node:test"

import { NextRequest } from "next/server"

import { POST } from "../src/app/api/experiments/getting-started-flow/route"
import {
  GETTING_STARTED_FLOW_ASSIGNMENT_VERSION,
  GETTING_STARTED_FLOW_EXPERIMENT_KEY,
  GETTING_STARTED_FLOW_EXPOSED_EVENT,
  GETTING_STARTED_FLOW_SELECTED_EVENT,
  WEBSITE_CLI_COMMAND_COPIED_EVENT,
  WEBSITE_PROMPT_COPIED_EVENT,
  type GettingStartedFlow,
  type GettingStartedFlowEvent,
} from "../src/lib/getting-started-flow-experiment"

const ENDPOINT = "https://novu.co/api/experiments/getting-started-flow/"
const EVENT_TIMESTAMP = new Date().toISOString()

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
    timestamp: EVENT_TIMESTAMP,
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

interface ValidEventCase {
  event: GettingStartedFlowEvent
  name: string
  properties: Record<string, string>
  variant: GettingStartedFlow
}

const validEventCases: ValidEventCase[] = [
  {
    event: GETTING_STARTED_FLOW_EXPOSED_EVENT,
    name: "ui exposure",
    properties: {},
    variant: "ui",
  },
  {
    event: GETTING_STARTED_FLOW_EXPOSED_EVENT,
    name: "cli exposure",
    properties: {},
    variant: "cli",
  },
  {
    event: GETTING_STARTED_FLOW_EXPOSED_EVENT,
    name: "prompt exposure",
    properties: {},
    variant: "prompt",
  },
  {
    event: GETTING_STARTED_FLOW_SELECTED_EVENT,
    name: "ui primary selection",
    properties: { action: "sign_up_primary" },
    variant: "ui",
  },
  {
    event: GETTING_STARTED_FLOW_SELECTED_EVENT,
    name: "cli primary selection",
    properties: { action: "copy_cli" },
    variant: "cli",
  },
  {
    event: GETTING_STARTED_FLOW_SELECTED_EVENT,
    name: "prompt primary selection",
    properties: { action: "copy_prompt" },
    variant: "prompt",
  },
  {
    event: WEBSITE_CLI_COMMAND_COPIED_EVENT,
    name: "cli copy diagnostic",
    properties: { command: "npx novu connect" },
    variant: "cli",
  },
  {
    event: WEBSITE_PROMPT_COPIED_EVENT,
    name: "prompt copy diagnostic",
    properties: {
      prompt:
        "Connect my agent to customers with Novu using instructions from https://novu.co/agents.md",
    },
    variant: "prompt",
  },
]

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

test("forwards every valid event and variant combination", async (context) => {
  await withEnvironment(
    {
      CRITICAL_FLOW_TESTING: "0",
      GETTING_STARTED_FLOW_EXPERIMENT_ENABLED: "true",
      NEXT_PUBLIC_SEGMENT_WRITE_KEY: "test-write-key",
      NODE_ENV: "production",
      VERCEL_ENV: "production",
    },
    async () => {
      const originalFetch = globalThis.fetch
      const requests: Array<Record<string, unknown>> = []

      try {
        globalThis.fetch = (async (_input, init) => {
          requests.push(
            JSON.parse(String(init?.body)) as Record<string, unknown>
          )
          return new Response(null, { status: 200 })
        }) as typeof fetch

        for (const [index, eventCase] of validEventCases.entries()) {
          await context.test(eventCase.name, async () => {
            const messageId = `gsf-valid-${index}`
            const response = await POST(
              createRequest(
                createBody({
                  assignment: {
                    isQa: false,
                    source: "random",
                    variant: eventCase.variant,
                  },
                  event: eventCase.event,
                  messageId,
                  properties: eventCase.properties,
                })
              )
            )

            assert.equal(response.status, 204)
            assert.equal(requests.length, index + 1)

            const outboundRequest = requests[index]
            assert.equal(outboundRequest.event, eventCase.event)
            assert.equal(outboundRequest.messageId, messageId)
            assert.equal(outboundRequest.timestamp, EVENT_TIMESTAMP)
            assert.deepEqual(outboundRequest.properties, {
              assignment_source: "random",
              assignment_version: GETTING_STARTED_FLOW_ASSIGNMENT_VERSION,
              experiment_key: GETTING_STARTED_FLOW_EXPERIMENT_KEY,
              getting_started_flow: eventCase.variant,
              is_qa: false,
              variant: eventCase.variant,
              ...eventCase.properties,
            })
          })
        }
      } finally {
        globalThis.fetch = originalFetch
      }
    }
  )
})

test("rejects a missing, malformed, or stale client event timestamp", async () => {
  const missingTimestamp = createBody()
  delete missingTimestamp.timestamp

  assert.equal((await POST(createRequest(missingTimestamp))).status, 400)
  assert.equal(
    (
      await POST(
        createRequest(createBody({ timestamp: "2026-02-31T12:00:00.000Z" }))
      )
    ).status,
    400
  )
  assert.equal(
    (
      await POST(
        createRequest(
          createBody({
            timestamp: new Date(Date.now() - 60 * 60 * 1_000).toISOString(),
          })
        )
      )
    ).status,
    400
  )
  assert.equal(
    (
      await POST(
        createRequest(
          createBody({
            timestamp: new Date(Date.now() + 60 * 60 * 1_000).toISOString(),
          })
        )
      )
    ).status,
    400
  )
})

test("retries transient Segment failures with the same payload", async () => {
  await withEnvironment(
    {
      CRITICAL_FLOW_TESTING: "0",
      GETTING_STARTED_FLOW_EXPERIMENT_ENABLED: "true",
      NEXT_PUBLIC_SEGMENT_WRITE_KEY: "test-write-key",
      NODE_ENV: "production",
    },
    async () => {
      const originalFetch = globalThis.fetch
      const requests: Array<Record<string, unknown>> = []

      try {
        globalThis.fetch = (async (_input, init) => {
          requests.push(
            JSON.parse(String(init?.body)) as Record<string, unknown>
          )
          return new Response(null, {
            status: requests.length === 1 ? 500 : 200,
          })
        }) as typeof fetch

        const response = await POST(createRequest(createBody()))

        assert.equal(response.status, 204)
        assert.equal(requests.length, 2)
        assert.deepEqual(requests[1], requests[0])
      } finally {
        globalThis.fetch = originalFetch
      }
    }
  )
})

test("honors a bounded 429 retry and does not retry permanent 4xx", async () => {
  await withEnvironment(
    {
      CRITICAL_FLOW_TESTING: "0",
      GETTING_STARTED_FLOW_EXPERIMENT_ENABLED: "true",
      NEXT_PUBLIC_SEGMENT_WRITE_KEY: "test-write-key",
      NODE_ENV: "production",
    },
    async () => {
      const originalFetch = globalThis.fetch

      try {
        let requests = 0
        globalThis.fetch = (async () => {
          requests += 1
          return requests === 1
            ? new Response(null, {
                headers: { "Retry-After": "0" },
                status: 429,
              })
            : new Response(null, { status: 200 })
        }) as typeof fetch

        assert.equal(
          (await POST(createRequest(createBody()))).status,
          204,
          "429 should retry"
        )
        assert.equal(requests, 2)

        requests = 0
        globalThis.fetch = (async () => {
          requests += 1
          return new Response(null, { status: 400 })
        }) as typeof fetch

        assert.equal(
          (await POST(createRequest(createBody()))).status,
          503,
          "permanent 4xx should fail without retry"
        )
        assert.equal(requests, 1)
      } finally {
        globalThis.fetch = originalFetch
      }
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
        assert.equal(requests.length, 3)
        for (const request of requests) {
          assert.equal(request.body.event, body.event)
          assert.equal(request.body.messageId, body.messageId)
          assert.equal(request.authorization, "Basic dGVzdC13cml0ZS1rZXk6")
        }
      } finally {
        globalThis.fetch = originalFetch
      }
    }
  )
})
