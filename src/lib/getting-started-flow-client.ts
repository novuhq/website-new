"use client"

import {
  getGettingStartedFlowForRandomValue,
  GETTING_STARTED_FLOW_ASSIGNMENT_EVENT,
  GETTING_STARTED_FLOW_ASSIGNMENT_VERSION,
  GETTING_STARTED_FLOW_COOKIE_MAX_AGE_SECONDS,
  GETTING_STARTED_FLOW_COOKIE_NAME,
  GETTING_STARTED_FLOW_EVENT_ENDPOINT,
  GETTING_STARTED_FLOW_EXPERIMENT_KEY,
  GETTING_STARTED_FLOW_EXPOSED_EVENT,
  GETTING_STARTED_FLOW_QA_PARAM,
  GETTING_STARTED_FLOW_SELECTED_EVENT,
  isGettingStartedFlow,
  SEGMENT_ANONYMOUS_ID_COOKIE_NAME,
  SEGMENT_ANONYMOUS_ID_MAX_AGE_SECONDS,
  type GettingStartedFlowAssignment,
  type GettingStartedFlowEvent,
} from "@/lib/getting-started-flow-experiment"

type ExperimentClientWindow = Window & {
  __novuApplyGettingStartedFlow?: () => void
  __novuGettingStartedFlowAssignment?: GettingStartedFlowAssignment
  __novuGettingStartedFlowClickListenerInstalled?: boolean
  __novuGettingStartedFlowEventQueue?: Array<{
    event: GettingStartedFlowEvent
    properties: Record<string, unknown>
  }>
  __novuGettingStartedFlowExposureKey?: string
  __novuGettingStartedFlowHydrated?: boolean
  __novuSegmentAnonymousId?: string
  __novuTrackGettingStartedFlowEvent?: typeof trackGettingStartedFlowEvent
}

function getBrowserWindow() {
  return window as ExperimentClientWindow
}

function getAssignment(): GettingStartedFlowAssignment | null {
  const assignment = getBrowserWindow().__novuGettingStartedFlowAssignment

  if (
    !assignment ||
    !isGettingStartedFlow(assignment.variant) ||
    (assignment.source !== "cookie" &&
      assignment.source !== "qa" &&
      assignment.source !== "random")
  ) {
    return null
  }

  return assignment
}

function readCookie(name: string): string | null {
  try {
    const prefix = `${name}=`
    const cookie = document.cookie
      .split(";")
      .map((value) => value.trim())
      .find((value) => value.startsWith(prefix))

    return cookie?.slice(prefix.length) ?? null
  } catch {
    return null
  }
}

function readAssignmentCookie(): string | null {
  return readCookie(GETTING_STARTED_FLOW_COOKIE_NAME)
}

function parseAnonymousId(value: string | null): string | null {
  if (!value) return null

  try {
    const parsed = JSON.parse(decodeURIComponent(value))
    return typeof parsed === "string" && parsed ? parsed : null
  } catch {
    return value.length <= 128 ? value : null
  }
}

function createAnonymousId() {
  try {
    return window.crypto.randomUUID()
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  }
}

function getOrCreateSegmentAnonymousId() {
  const browserWindow = getBrowserWindow()
  if (browserWindow.__novuSegmentAnonymousId) {
    return browserWindow.__novuSegmentAnonymousId
  }

  let localStorageId: string | null = null

  try {
    localStorageId = parseAnonymousId(
      window.localStorage.getItem(SEGMENT_ANONYMOUS_ID_COOKIE_NAME)
    )
  } catch {
    // Fall back to the first-party cookie when storage is unavailable.
  }

  const anonymousId =
    localStorageId ??
    parseAnonymousId(readCookie(SEGMENT_ANONYMOUS_ID_COOKIE_NAME)) ??
    createAnonymousId()
  browserWindow.__novuSegmentAnonymousId = anonymousId

  try {
    window.localStorage.setItem(
      SEGMENT_ANONYMOUS_ID_COOKIE_NAME,
      JSON.stringify(anonymousId)
    )
  } catch {
    // The cookie and event payload still retain the identity.
  }

  try {
    const hostname = window.location.hostname
    const sharedDomain =
      hostname === "novu.co" || hostname.endsWith(".novu.co")
        ? "Domain=.novu.co"
        : ""

    document.cookie = [
      `${SEGMENT_ANONYMOUS_ID_COOKIE_NAME}=${encodeURIComponent(
        JSON.stringify(anonymousId)
      )}`,
      `Max-Age=${SEGMENT_ANONYMOUS_ID_MAX_AGE_SECONDS}`,
      "Path=/",
      "SameSite=Lax",
      sharedDomain,
      window.location.protocol === "https:" ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ")
  } catch {
    // The event still carries the in-memory ID when cookies are unavailable.
  }

  return anonymousId
}

function sendEventBeacon(body: string) {
  try {
    return navigator.sendBeacon(
      GETTING_STARTED_FLOW_EVENT_ENDPOINT,
      new Blob([body], { type: "application/json" })
    )
  } catch {
    return false
  }
}

function deliverEvent(
  event: GettingStartedFlowEvent,
  properties: Record<string, unknown>,
  assignment: GettingStartedFlowAssignment
) {
  const body = JSON.stringify({
    anonymousId: getOrCreateSegmentAnonymousId(),
    assignment,
    event,
    messageId: `gsf-${createAnonymousId()}`,
    properties,
  })

  try {
    const request = fetch(GETTING_STARTED_FLOW_EVENT_ENDPOINT, {
      body,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      method: "POST",
    })

    void request
      .then((response) => {
        if (!response.ok) {
          sendEventBeacon(body)
        }
      })
      .catch(() => {
        sendEventBeacon(body)
      })
    return true
  } catch {
    return sendEventBeacon(body)
  }
}

export function trackGettingStartedFlowEvent(
  event: GettingStartedFlowEvent,
  properties?: Record<string, unknown>
): boolean {
  const assignment = getAssignment()
  if (!assignment) return false

  const payload = {
    experiment_key: GETTING_STARTED_FLOW_EXPERIMENT_KEY,
    assignment_version: GETTING_STARTED_FLOW_ASSIGNMENT_VERSION,
    getting_started_flow: assignment.variant,
    variant: assignment.variant,
    assignment_source: assignment.source,
    is_qa: assignment.isQa,
    ...properties,
  }

  return deliverEvent(event, payload, assignment)
}

function exposeGettingStartedFlow() {
  if (window.location.pathname !== "/") return

  const assignment = getAssignment()
  if (!assignment) return

  const exposureKey = [
    GETTING_STARTED_FLOW_EXPERIMENT_KEY,
    GETTING_STARTED_FLOW_ASSIGNMENT_VERSION,
    assignment.variant,
    assignment.isQa ? "qa" : "production",
  ].join(":")
  const browserWindow = getBrowserWindow()

  if (browserWindow.__novuGettingStartedFlowExposureKey === exposureKey) return

  if (trackGettingStartedFlowEvent(GETTING_STARTED_FLOW_EXPOSED_EVENT)) {
    browserWindow.__novuGettingStartedFlowExposureKey = exposureKey
  }
}

function createRandomAssignment(): GettingStartedFlowAssignment {
  let randomValue = Math.random()

  try {
    const values = new Uint32Array(1)
    window.crypto.getRandomValues(values)
    randomValue = values[0] / 4_294_967_296
  } catch {
    // Math.random is an adequate non-security fallback for experiment bucketing.
  }

  const variant = getGettingStartedFlowForRandomValue(randomValue)

  try {
    document.cookie = [
      `${GETTING_STARTED_FLOW_COOKIE_NAME}=${variant}`,
      `Max-Age=${GETTING_STARTED_FLOW_COOKIE_MAX_AGE_SECONDS}`,
      "Path=/",
      "SameSite=Lax",
      window.location.protocol === "https:" ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ")
  } catch {
    // Cookie-disabled visitors keep the in-memory assignment for this page.
  }

  return { isQa: false, source: "random", variant }
}

function applyGettingStartedFlow(enabled: boolean, qaEnabled: boolean) {
  const browserWindow = getBrowserWindow()
  const override = new URLSearchParams(window.location.search).get(
    GETTING_STARTED_FLOW_QA_PARAM
  )
  let assignment: GettingStartedFlowAssignment | null = null

  if (qaEnabled && isGettingStartedFlow(override)) {
    assignment = { isQa: true, source: "qa", variant: override }
  } else if (enabled) {
    const cookieValue = readAssignmentCookie()
    const currentAssignment = getAssignment()

    assignment =
      currentAssignment &&
      !currentAssignment.isQa &&
      (currentAssignment.source === "random" ||
        currentAssignment.variant === cookieValue)
        ? currentAssignment
        : isGettingStartedFlow(cookieValue)
          ? { isQa: false, source: "cookie", variant: cookieValue }
          : createRandomAssignment()
  }

  if (assignment) {
    document.documentElement.dataset.gettingStartedFlow = assignment.variant
    browserWindow.__novuGettingStartedFlowAssignment = assignment
  } else {
    delete document.documentElement.dataset.gettingStartedFlow
    delete browserWindow.__novuGettingStartedFlowAssignment
  }

  exposeGettingStartedFlow()
  window.dispatchEvent(new CustomEvent(GETTING_STARTED_FLOW_ASSIGNMENT_EVENT))
}

function prepareSignupLink(link: HTMLAnchorElement) {
  const assignment = getAssignment()
  if (!assignment) return

  try {
    const url = new URL(link.href, window.location.href)
    if (url.hostname !== "dashboard.novu.co") return

    url.searchParams.set("ajs_aid", getOrCreateSegmentAnonymousId())
    link.href = url.toString()
  } catch {
    // Keep the original signup URL if it cannot be parsed.
  }
}

function installActionTracking() {
  const browserWindow = getBrowserWindow()
  if (browserWindow.__novuGettingStartedFlowClickListenerInstalled) return

  browserWindow.__novuGettingStartedFlowClickListenerInstalled = true
  const getEventTarget = (event: Event) =>
    event.target instanceof Element ? event.target : null
  const prepareSignupFromEvent = (event: Event) => {
    const signupTarget = getEventTarget(event)?.closest<HTMLAnchorElement>(
      "a[data-getting-started-flow-signup]"
    )
    if (signupTarget) prepareSignupLink(signupTarget)
  }
  const trackActionFromEvent = (event: Event) => {
    const actionTarget = getEventTarget(event)?.closest<HTMLElement>(
      "[data-getting-started-flow-action]"
    )
    const action = actionTarget?.dataset.gettingStartedFlowAction
    if (!action) return

    // Copy conversions belong to the React copy handlers, which only emit
    // after the clipboard operation succeeds. These listeners own links.
    if (action === "copy_cli" || action === "copy_prompt") return

    trackGettingStartedFlowEvent(GETTING_STARTED_FLOW_SELECTED_EVENT, {
      action,
    })
  }

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.button === 1) prepareSignupFromEvent(event)
    },
    true
  )
  document.addEventListener(
    "auxclick",
    (event) => {
      if (event.button !== 1) return
      prepareSignupFromEvent(event)
      trackActionFromEvent(event)
    },
    true
  )
  document.addEventListener(
    "click",
    (event) => {
      prepareSignupFromEvent(event)
      trackActionFromEvent(event)
    },
    true
  )
}

export function initializeGettingStartedFlow(
  enabled: boolean,
  qaEnabled: boolean
) {
  const browserWindow = getBrowserWindow()
  browserWindow.__novuGettingStartedFlowHydrated = true
  browserWindow.__novuApplyGettingStartedFlow = () =>
    applyGettingStartedFlow(enabled, qaEnabled)
  browserWindow.__novuTrackGettingStartedFlowEvent =
    trackGettingStartedFlowEvent

  installActionTracking()
  applyGettingStartedFlow(enabled, qaEnabled)
}
