import { expect, test, type Page, type WebSocketRoute } from "@playwright/test"

import { webChatContract } from "./contracts"
import {
  expectHealthyPage,
  gotoCriticalPage,
  observeApplicationErrors,
} from "./helpers"

// Run against a server started with NEXT_PUBLIC_NOVU_APP_IDENTIFIER set.
// All Novu traffic is intercepted; no real subscriber receives test messages.
test.skip(
  process.env.PLAYWRIGHT_NOVU_FIXTURE !== "1",
  "Set PLAYWRIGHT_NOVU_FIXTURE=1 and start the app with a public Novu app identifier."
)

async function mockNovu(page: Page) {
  const requests: Record<string, string>[] = []
  const sessions: Record<string, unknown>[] = []
  let socket: WebSocketRoute | undefined
  let sequence = 0
  let failNext = false
  await page.route("https://api.novu.co/**", async (route) => {
    const request = route.request()
    const path = new URL(request.url()).pathname
    if (path.endsWith("/inbox/session")) {
      sessions.push(request.postDataJSON())
      return route.fulfill({
        json: {
          data: {
            token: "fixture-session",
            applicationIdentifier: "web-chat-playwright-fixture",
          },
        },
      })
    }
    if (
      path.endsWith("/agent-chat/conversations") &&
      request.method() === "POST"
    ) {
      requests.push(request.postDataJSON())
      if (failNext) {
        failNext = false
        return route.fulfill({
          status: 503,
          json: { message: "Temporary failure" },
        })
      }
      return route.fulfill({
        json: {
          data: {
            identifier: "fixture-conversation",
            messageId: `user-${requests.length}`,
          },
        },
      })
    }
    if (path.endsWith("/events"))
      return route.fulfill({
        json: { data: { events: [], olderCursor: null } },
      })
    return route.fulfill({ json: { data: {} } })
  })
  await page.routeWebSocket("wss://socket.novu.co/**", (ws) => {
    socket = ws
  })
  return {
    requests,
    sessions,
    failNext: () => {
      failNext = true
    },
    connected: () => Boolean(socket),
    emit: (event: Record<string, unknown>) => {
      if (!socket) throw new Error("Novu socket is not connected")
      socket.send(
        JSON.stringify({
          event: "agent_event",
          data: {
            agentId: "webchat",
            conversationIdentifier: "fixture-conversation",
            runId: "fixture-run",
            timestamp: new Date().toISOString(),
            sequence: ++sequence,
            event,
          },
        })
      )
    },
  }
}

function composer(page: Page) {
  return page
    .getByTestId("web-chat-hero")
    .getByRole("textbox", { name: "Message the agent" })
}
function transcript(page: Page) {
  return page.getByRole("log", { name: "Agent conversation" })
}

test("sends to the original agent, streams a reply, and preserves a failed draft for retry", async ({
  page,
}) => {
  const errors = observeApplicationErrors(page)
  const novu = await mockNovu(page)
  await gotoCriticalPage(page, webChatContract.route)
  await expect(composer(page)).toBeEnabled()
  await expect.poll(novu.connected).toBe(true)
  expect(novu.sessions[0]).toMatchObject({
    subscriber: { subscriberId: "69b008bc508e082a4f4f8322" },
  })
  const send = page.getByRole("button", { name: "Send message", exact: true })
  await expect(send).toBeDisabled()
  await composer(page).fill("What is Novu Connect?")
  await composer(page).press("Enter")
  await expect.poll(() => novu.requests.length).toBe(1)
  expect(novu.requests[0]).toEqual({
    agentId: "webchat",
    text: "What is Novu Connect?",
  })
  await expect(composer(page)).toHaveValue("")
  await expect(transcript(page)).toContainText("What is Novu Connect?")
  novu.emit({ type: "run-start" })
  novu.emit({ type: "message-start", messageId: "assistant-1" })
  novu.emit({
    type: "message-delta",
    messageId: "assistant-1",
    delta: "Novu connects",
  })
  await expect(transcript(page)).toContainText("Novu connects")
  await expect(composer(page)).toBeDisabled()
  novu.emit({
    type: "message-delta",
    messageId: "assistant-1",
    delta: " your agent to users.",
  })
  novu.emit({ type: "message-end", messageId: "assistant-1" })
  novu.emit({ type: "run-finish" })
  await expect(transcript(page)).toContainText(
    "Novu connects your agent to users."
  )
  await expect(composer(page)).toBeEnabled()

  await page
    .locator('[data-slot="web-chat-panel"]')
    .filter({ visible: true })
    .screenshot({ path: test.info().outputPath("live-chat.png") })

  // Switching responsive trees must retain the same session and draft.
  await composer(page).fill("Which channels?")
  const viewport = page.viewportSize()!
  await page.setViewportSize({
    width: viewport.width >= 768 ? 390 : 1280,
    height: 900,
  })
  await expect(composer(page)).toHaveValue("Which channels?")
  await expect(transcript(page)).toContainText(
    "Novu connects your agent to users."
  )

  novu.failNext()
  await composer(page).fill("Which channels?")
  await send.click()
  await expect(
    page.getByTestId("web-chat-hero").getByRole("alert")
  ).toContainText("Please try again")
  await expect(composer(page)).toHaveValue("Which channels?")
  await send.click()
  await expect(composer(page)).toHaveValue("")
  await expect(
    page.getByTestId("web-chat-hero").getByRole("alert")
  ).toHaveCount(0)
  expect(novu.requests).toHaveLength(3)
  expect(novu.requests[2]).toMatchObject({
    text: "Which channels?",
    conversationIdentifier: "fixture-conversation",
  })
  expectHealthyPage(errors)
})

test("handles approvals and starts a fresh live conversation after preview reset", async ({
  page,
}) => {
  const novu = await mockNovu(page)
  await page.route("**/api/agent-preview", (route) =>
    route.fulfill({
      json: { brand: { domain: "recent.dev", accent: "#e65006", logo: null } },
    })
  )
  await gotoCriticalPage(page, webChatContract.route)
  await expect.poll(novu.connected).toBe(true)
  await composer(page).fill("Show available actions")
  await composer(page).press("Shift+Enter")
  await composer(page).press("Enter")
  await expect(composer(page)).toHaveValue("")
  expect(novu.requests).toHaveLength(1)
  novu.emit({
    type: "tool-approval-request",
    messageId: "assistant-1",
    approvalId: "approval-1",
    toolUseId: "tool-1",
    toolName: "List channels",
    input: {},
    approveActionId: "approve-1",
    denyActionId: "deny-1",
  })
  await page.getByRole("button", { name: "Approve", exact: true }).click()
  await expect.poll(() => novu.requests.length).toBe(2)
  expect(novu.requests[1]).toEqual({
    agentId: "webchat",
    conversationIdentifier: "fixture-conversation",
    actionId: "approve-1",
  })
  novu.emit({
    type: "tool-approval-response",
    approvalId: "approval-1",
    decision: "approved",
  })
  await expect(
    page.getByRole("button", { name: "Approve", exact: true })
  ).toHaveCount(0)
  await page
    .getByRole("textbox", { name: "Your website URL" })
    .fill("recent.dev")
  await page.getByRole("button", { name: webChatContract.submitLabel }).click()
  await expect(composer(page)).toHaveCount(0)
  await page.getByRole("button", { name: "Reset personalization" }).click()
  await expect(composer(page)).toBeEnabled()
  await expect(transcript(page)).toHaveCount(0)
  await composer(page).fill("New conversation")
  await composer(page).press("Enter")
  await expect.poll(() => novu.requests.length).toBe(3)
  expect(novu.requests[2]).toEqual({
    agentId: "webchat",
    text: "New conversation",
  })
})
