import assert from "node:assert/strict"
import { afterEach, beforeEach, describe, it, mock } from "node:test"

import { NextRequest } from "next/server"

import { POST as submitCareerApplication } from "@/app/(website)/api/careers/apply/route"
import { POST as submitChannelWaitlist } from "@/app/(website)/api/channel-waitlist/route"
import { POST as submitHubspotForm } from "@/app/(website)/api/hubspot/route"

const ENVIRONMENT_KEYS = [
  "HUBSPOT_ACCESS_TOKEN",
  "NEXT_PUBLIC_HUBSPOT_FORM_PORTAL_ID",
  "NOTION_API_KEY",
  "NOTION_DATA_SOURCE_ID",
  "NOTION_WAITLIST_DATABASE_ID",
] as const
const originalEnvironment = new Map(
  ENVIRONMENT_KEYS.map((key) => [key, process.env[key]])
)

type FetchCall = {
  init?: RequestInit
  url: string
}

function restoreEnvironment() {
  for (const [key, value] of originalEnvironment) {
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
}

function getRequestUrl(input: string | URL | Request) {
  return input instanceof Request ? input.url : String(input)
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

beforeEach(() => {
  process.env.HUBSPOT_ACCESS_TOKEN = "test-hubspot-token"
  process.env.NEXT_PUBLIC_HUBSPOT_FORM_PORTAL_ID = "test-portal"
  process.env.NOTION_API_KEY = "test-notion-token"
  process.env.NOTION_DATA_SOURCE_ID = "career-data-source"
  process.env.NOTION_WAITLIST_DATABASE_ID = "waitlist-database"
})

afterEach(() => {
  mock.restoreAll()
  restoreEnvironment()
})

describe("forms API route integrations", () => {
  it("submits the subscription payload through the HubSpot route", async () => {
    const calls: FetchCall[] = []
    const fetchMock = mock.method(
      globalThis,
      "fetch",
      async (input: string | URL | Request, init?: RequestInit) => {
        calls.push({ url: getRequestUrl(input), init })
        return jsonResponse({ inlineMessage: "Thanks" })
      }
    )
    const fields = [
      {
        objectTypeId: "0-1",
        name: "email",
        value: "critical-flow+skipform@hubspot.com",
      },
    ]
    const request = new NextRequest("http://localhost/api/hubspot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formId: "subscription-form",
        data: { fields },
      }),
    })

    const response = await submitHubspotForm(request)

    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { sent: true })
    assert.equal(fetchMock.mock.callCount(), 1)
    assert.equal(
      calls[0].url,
      "https://api.hsforms.com/submissions/v3/integration/secure/submit/test-portal/subscription-form"
    )
    assert.equal(calls[0].init?.method, "POST")
    assert.equal(
      new Headers(calls[0].init?.headers).get("Authorization"),
      "Bearer test-hubspot-token"
    )
    assert.deepEqual(JSON.parse(String(calls[0].init?.body)), { fields })
  })

  it("creates a validated channel waitlist page through the Notion route", async () => {
    const calls: FetchCall[] = []
    const fetchMock = mock.method(
      globalThis,
      "fetch",
      async (input: string | URL | Request, init?: RequestInit) => {
        const url = getRequestUrl(input)
        calls.push({ url, init })

        if (url.endsWith("/databases/waitlist-database")) {
          return jsonResponse({ data_sources: [{ id: "waitlist-source" }] })
        }

        if (url.endsWith("/data_sources/waitlist-source")) {
          return jsonResponse({
            properties: {
              Email: { type: "email" },
              "Requested Channel": { type: "select" },
              "Signup Date": { type: "date" },
              "Source Page": { type: "url" },
              "UTM Source": { type: "rich_text" },
            },
          })
        }

        if (url.endsWith("/pages")) {
          return jsonResponse({ id: "waitlist-page" })
        }

        throw new Error(`Unexpected Notion request: ${url}`)
      }
    )
    const request = new NextRequest("http://localhost/api/channel-waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: "Zoom",
        companyWebsite: "",
        email: "critical-flow-waitlist@example.com",
        sourcePage: "https://novu.co/",
        utmSource: "critical-flow",
      }),
    })

    const response = await submitChannelWaitlist(request)

    assert.equal(response.status, 201)
    assert.deepEqual(await response.json(), {
      id: "waitlist-page",
      sent: true,
    })
    assert.equal(fetchMock.mock.callCount(), 3)

    const createPageCall = calls.find(({ url }) => url.endsWith("/pages"))
    assert.ok(createPageCall)
    assert.equal(
      new Headers(createPageCall.init?.headers).get("Authorization"),
      "Bearer test-notion-token"
    )

    const createPagePayload = JSON.parse(String(createPageCall.init?.body))
    assert.equal(createPagePayload.parent.data_source_id, "waitlist-source")
    assert.equal(
      createPagePayload.properties.Email.email,
      "critical-flow-waitlist@example.com"
    )
    assert.equal(
      createPagePayload.properties["Requested Channel"].select.name,
      "Zoom"
    )
  })

  it("uploads the CV and creates a career application through Notion", async () => {
    const calls: FetchCall[] = []
    const fetchMock = mock.method(
      globalThis,
      "fetch",
      async (input: string | URL | Request, init?: RequestInit) => {
        const url = getRequestUrl(input)
        calls.push({ url, init })

        if (url.endsWith("/file_uploads")) {
          return jsonResponse({ id: "cv-upload" })
        }

        if (url.endsWith("/file_uploads/cv-upload/send")) {
          return jsonResponse({ id: "cv-upload" })
        }

        if (url.endsWith("/pages")) {
          return jsonResponse({ id: "career-application" })
        }

        throw new Error(`Unexpected Notion request: ${url}`)
      }
    )
    const formData = new FormData()
    formData.set("fullName", "Critical Flow Tester")
    formData.set("email", "critical-flow-careers@example.com")
    formData.set("phoneNumber", "+49 30 1234567")
    formData.set(
      "linkedInProfile",
      "https://www.linkedin.com/in/critical-flow-tester"
    )
    formData.set("location", "Berlin, Germany")
    formData.set("remoteAsyncExperience", "Yes")
    formData.set("personalNote", "Testing the complete application route.")
    formData.set("department", "Engineering")
    formData.set("jobSlug", "")
    formData.set(
      "cv",
      new File(["%PDF-1.4\n% Integration fixture\n"], "critical-flow-cv.pdf", {
        type: "application/pdf",
      })
    )
    const request = new NextRequest("http://localhost/api/careers/apply", {
      method: "POST",
      body: formData,
    })

    const response = await submitCareerApplication(request)

    assert.equal(response.status, 201)
    assert.deepEqual(await response.json(), {
      id: "career-application",
      sent: true,
    })
    assert.equal(fetchMock.mock.callCount(), 3)

    const createUploadCall = calls.find(({ url }) =>
      url.endsWith("/file_uploads")
    )
    assert.ok(createUploadCall)
    assert.deepEqual(JSON.parse(String(createUploadCall.init?.body)), {
      content_type: "application/pdf",
      filename: "critical-flow-cv.pdf",
    })

    const sendUploadCall = calls.find(({ url }) => url.endsWith("/send"))
    assert.ok(sendUploadCall?.init?.body instanceof FormData)
    assert.equal(
      (sendUploadCall.init.body.get("file") as File).name,
      "critical-flow-cv.pdf"
    )

    const createPageCall = calls.find(({ url }) => url.endsWith("/pages"))
    assert.ok(createPageCall)
    assert.equal(
      new Headers(createPageCall.init?.headers).get("Authorization"),
      "Bearer test-notion-token"
    )

    const createPagePayload = JSON.parse(String(createPageCall.init?.body))
    assert.equal(createPagePayload.parent.data_source_id, "career-data-source")
    assert.equal(
      createPagePayload.properties.Email.email,
      "critical-flow-careers@example.com"
    )
    assert.equal(
      createPagePayload.properties.CV.files[0].file_upload.id,
      "cv-upload"
    )
  })
})
