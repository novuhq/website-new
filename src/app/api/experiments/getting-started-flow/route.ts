import { NextRequest, NextResponse } from "next/server"

import {
  GETTING_STARTED_FLOW_ASSIGNMENT_VERSION,
  GETTING_STARTED_FLOW_COOKIE_MAX_AGE_SECONDS,
  GETTING_STARTED_FLOW_COOKIE_NAME,
  GETTING_STARTED_FLOW_EXPERIMENT_KEY,
  GETTING_STARTED_FLOW_SELECTED_EVENT,
  isGettingStartedFlow,
  isGettingStartedFlowEvent,
  SEGMENT_ANONYMOUS_ID_COOKIE_NAME,
  SEGMENT_ANONYMOUS_ID_MAX_AGE_SECONDS,
  WEBSITE_CLI_COMMAND_COPIED_EVENT,
  WEBSITE_PROMPT_COPIED_EVENT,
  type GettingStartedFlow,
  type GettingStartedFlowAssignmentSource,
} from "@/lib/getting-started-flow-experiment"
import {
  isGettingStartedFlowExperimentEnabled,
  isGettingStartedFlowQaEnabled,
} from "@/lib/getting-started-flow-server"

export const runtime = "nodejs"

const MAX_BODY_BYTES = 16_384
const NO_STORE_HEADERS = { "Cache-Control": "no-store" }
const SEGMENT_TRACK_ENDPOINT = "https://api.segment.io/v1/track"
const ASSIGNMENT_SOURCES = new Set<GettingStartedFlowAssignmentSource>([
  "cookie",
  "qa",
  "random",
])
const ACTIONS = new Set(["copy_cli", "copy_prompt", "sign_up_primary"])

type SegmentDeliveryResult = "delivered" | "failed" | "unconfigured"

interface EventRequestBody {
  anonymousId: string
  assignment: {
    isQa: boolean
    source: GettingStartedFlowAssignmentSource
    variant: string
  }
  event: string
  messageId: string
  properties?: Record<string, unknown>
}

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { headers: NO_STORE_HEADERS, status })
}

function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin")
  const fetchSite = request.headers.get("sec-fetch-site")

  if (!origin || fetchSite !== "same-origin") return false

  try {
    const forwardedHost = request.headers
      .get("x-forwarded-host")
      ?.split(",", 1)[0]
      .trim()
    const requestHost = forwardedHost || request.headers.get("host")

    return Boolean(requestHost && new URL(origin).host === requestHost)
  } catch {
    return false
  }
}

function isValidBody(value: unknown): value is EventRequestBody {
  if (!value || typeof value !== "object") return false

  const body = value as Partial<EventRequestBody>
  const assignment = body.assignment

  if (
    typeof body.anonymousId !== "string" ||
    body.anonymousId.length === 0 ||
    body.anonymousId.length > 128 ||
    !assignment ||
    typeof assignment.isQa !== "boolean" ||
    !ASSIGNMENT_SOURCES.has(
      assignment.source as GettingStartedFlowAssignmentSource
    ) ||
    !isGettingStartedFlow(assignment.variant) ||
    !isGettingStartedFlowEvent(body.event) ||
    typeof body.messageId !== "string" ||
    body.messageId.length === 0 ||
    body.messageId.length > 128 ||
    (body.properties !== undefined &&
      (!body.properties ||
        typeof body.properties !== "object" ||
        Array.isArray(body.properties)))
  ) {
    return false
  }

  if (assignment.isQa !== (assignment.source === "qa")) return false

  return hasValidEventProperties(
    body.event,
    assignment.variant,
    body.properties
  )
}

function hasValidEventProperties(
  event: EventRequestBody["event"],
  variant: GettingStartedFlow,
  properties: EventRequestBody["properties"]
) {
  if (event === GETTING_STARTED_FLOW_SELECTED_EVENT) {
    const action = properties?.action
    if (typeof action !== "string" || !ACTIONS.has(action)) return false

    if (action === "copy_cli") return variant === "cli"
    if (action === "copy_prompt") return variant === "prompt"
    if (action === "sign_up_primary") return variant === "ui"

    return false
  }

  if (event === WEBSITE_CLI_COMMAND_COPIED_EVENT) {
    const command = properties?.command
    return (
      variant === "cli" &&
      typeof command === "string" &&
      command.length > 0 &&
      command.length <= 256
    )
  }

  if (event === WEBSITE_PROMPT_COPIED_EVENT) {
    const prompt = properties?.prompt
    return (
      variant === "prompt" &&
      typeof prompt === "string" &&
      prompt.length > 0 &&
      prompt.length <= 4096
    )
  }

  return true
}

function getEventProperties(body: EventRequestBody) {
  const properties: Record<string, unknown> = {
    assignment_source: body.assignment.source,
    assignment_version: GETTING_STARTED_FLOW_ASSIGNMENT_VERSION,
    experiment_key: GETTING_STARTED_FLOW_EXPERIMENT_KEY,
    getting_started_flow: body.assignment.variant,
    is_qa: body.assignment.isQa,
    variant: body.assignment.variant,
  }

  if (body.event === GETTING_STARTED_FLOW_SELECTED_EVENT) {
    const action = body.properties?.action
    if (typeof action === "string" && ACTIONS.has(action)) {
      properties.action = action
    }
  } else if (body.event === WEBSITE_CLI_COMMAND_COPIED_EVENT) {
    const command = body.properties?.command
    if (typeof command === "string" && command.length <= 256) {
      properties.command = command
    }
  } else if (body.event === WEBSITE_PROMPT_COPIED_EVENT) {
    const prompt = body.properties?.prompt
    if (typeof prompt === "string" && prompt.length <= 4096) {
      properties.prompt = prompt
    }
  }

  return properties
}

async function forwardToSegment(
  request: NextRequest,
  body: EventRequestBody
): Promise<SegmentDeliveryResult> {
  const writeKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY?.trim()
  if (process.env.CRITICAL_FLOW_TESTING === "1") return "delivered"
  if (!writeKey) return "unconfigured"

  const referer = request.headers.get("referer")
  let pageContext: Record<string, string> | undefined

  if (referer) {
    try {
      const pageUrl = new URL(referer)
      if (pageUrl.origin === request.nextUrl.origin) {
        pageContext = {
          path: pageUrl.pathname,
          search: pageUrl.search,
          url: pageUrl.toString(),
        }
      }
    } catch {
      // Omit malformed referrer context.
    }
  }

  try {
    const response = await fetch(SEGMENT_TRACK_ENDPOINT, {
      body: JSON.stringify({
        anonymousId: body.anonymousId,
        context: {
          library: { name: "novu-getting-started-flow", version: "1" },
          page: pageContext,
          userAgent: request.headers.get("user-agent") ?? undefined,
        },
        event: body.event,
        messageId: body.messageId,
        properties: getEventProperties(body),
        timestamp: new Date().toISOString(),
      }),
      headers: {
        Authorization: `Basic ${Buffer.from(`${writeKey}:`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(3_000),
    })

    return response.ok ? "delivered" : "failed"
  } catch {
    // Analytics delivery must never affect the visitor's experiment flow.
    return "failed"
  }
}

function setIdentityCookies(
  request: NextRequest,
  response: NextResponse,
  body: EventRequestBody
) {
  const secure =
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https"
  const hostname = request.nextUrl.hostname
  const sharedDomain =
    hostname === "novu.co" || hostname.endsWith(".novu.co")
      ? ".novu.co"
      : undefined

  if (!body.assignment.isQa) {
    response.cookies.set({
      httpOnly: false,
      maxAge: GETTING_STARTED_FLOW_COOKIE_MAX_AGE_SECONDS,
      name: GETTING_STARTED_FLOW_COOKIE_NAME,
      path: "/",
      sameSite: "lax",
      secure,
      value: body.assignment.variant,
    })
  }

  response.cookies.set({
    domain: sharedDomain,
    httpOnly: false,
    maxAge: SEGMENT_ANONYMOUS_ID_MAX_AGE_SECONDS,
    name: SEGMENT_ANONYMOUS_ID_COOKIE_NAME,
    path: "/",
    sameSite: "lax",
    secure,
    value: JSON.stringify(body.anonymousId),
  })
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return errorResponse("Cross-origin requests are not allowed", 403)
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    return errorResponse("Request body is too large", 413)
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return errorResponse("Expected an application/json request", 415)
  }

  let rawBody: string

  try {
    rawBody = await request.text()
  } catch {
    return errorResponse("Invalid JSON", 400)
  }

  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
    return errorResponse("Request body is too large", 413)
  }

  let body: unknown

  try {
    body = JSON.parse(rawBody)
  } catch {
    return errorResponse("Invalid JSON", 400)
  }

  if (!isValidBody(body)) {
    return errorResponse("Invalid getting-started-flow event", 400)
  }

  if (!body.assignment.isQa && !isGettingStartedFlowExperimentEnabled()) {
    return new NextResponse(null, {
      headers: NO_STORE_HEADERS,
      status: 204,
    })
  }

  if (body.assignment.isQa && !isGettingStartedFlowQaEnabled()) {
    return new NextResponse(null, {
      headers: NO_STORE_HEADERS,
      status: 204,
    })
  }

  const deliveryResult = await forwardToSegment(request, body)

  const response = new NextResponse(null, {
    headers: NO_STORE_HEADERS,
    status: deliveryResult === "delivered" ? 204 : 503,
  })
  setIdentityCookies(request, response, body)

  return response
}
