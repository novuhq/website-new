import { expect, test, type Page, type Route } from "@playwright/test"

import { STORYBOARD_TIMING } from "../../src/data/pages/web-chat-storyboard"
import { webChatContract } from "./contracts"
import {
  expectHealthyPage,
  gotoCriticalPage,
  observeApplicationErrors,
} from "./helpers"

const PREVIEW_ROUTE = "**/api/agent-preview"
const DEFAULT_ACCENT = "#c25cd6"
const BRAND = {
  domain: webChatContract.domain,
  accent: webChatContract.accent,
  logo: null,
}
const REPLY = "Should I check the missing fields or review the full submission?"
const FINAL_REPLY = "In this form (#1048), the Email field is not filled out."
const FADE_MS = Math.max(
  STORYBOARD_TIMING.grayscaleMs,
  STORYBOARD_TIMING.blurMs
)

function hero(page: Page) {
  return page.getByTestId("web-chat-hero")
}

// Both responsive trees remain mounted, so use the visible one throughout.
function panel(page: Page) {
  return hero(page)
    .locator('[data-slot="web-chat-panel"]')
    .filter({ visible: true })
}

function dashboard(page: Page) {
  return hero(page)
    .locator('[data-slot="hero-dashboard-content"]')
    .filter({ visible: true })
}

function tableTitle(page: Page) {
  return hero(page).getByTestId("hero-table-title").filter({ visible: true })
}

function message(page: Page, text: string) {
  return panel(page).getByText(text, { exact: true })
}

async function openWebChat(page: Page, mockClock = true) {
  // Let hydration run normally, then freeze only the interaction timeline.
  if (mockClock) {
    await page.clock.install({ time: new Date("2026-09-09T09:00:00Z") })
  }
  await gotoCriticalPage(page, webChatContract.route)
  await expect(
    hero(page).getByRole("textbox", { name: "Message the agent" })
  ).toBeVisible()
  if (mockClock) {
    await page.clock.pauseAt(new Date("2026-09-09T10:00:00Z"))
  }
}

async function submitDomain(page: Page) {
  await page
    .getByRole("textbox", { name: "Your website URL" })
    .fill(BRAND.domain)
  await page.getByRole("button", { name: webChatContract.submitLabel }).click()
}

async function holdPreviewResponse(page: Page) {
  let receiveRequest!: (route: Route) => void
  const request = new Promise<Route>((resolve) => {
    receiveRequest = resolve
  })
  await page.route(PREVIEW_ROUTE, receiveRequest)
  return { request }
}

async function expectStep(page: Page, step: number) {
  await expect(hero(page)).toHaveAttribute("data-storyboard-step", String(step))
}

test.describe("web chat hero transition", () => {
  test("waits for branding, resolves the table, then plays and loops the conversation", async ({
    page,
  }) => {
    const errors = observeApplicationErrors(page)
    const { request } = await holdPreviewResponse(page)
    // Motion uses the browser animation timeline for filters. Keep real time
    // here so these checks verify the rendered fade as well as React state.
    await openWebChat(page, false)
    await submitDomain(page)
    const pendingResponse = await request

    await expect(hero(page)).toHaveAttribute(
      "data-storyboard-phase",
      "grayscale"
    )
    await expect(tableTitle(page)).toHaveText(webChatContract.defaultTableTitle)
    await expect(message(page, webChatContract.firstMessage)).toBeHidden()

    await expect(hero(page)).toHaveAttribute("data-storyboard-phase", "waiting")
    await expect(panel(page)).toHaveCSS("filter", "grayscale(1)")
    await expect(dashboard(page)).toHaveCSS("filter", /^blur\([1-9]/)

    // Regression: the old 1.4-second timer began the conversation before a
    // slow extraction returned, displaying the wrong theme and table.
    await page.waitForTimeout(2500)
    await expect(hero(page)).toHaveAttribute("data-storyboard-phase", "waiting")
    await expectStep(page, 0)
    await expect(hero(page)).toHaveCSS("--wc-accent", DEFAULT_ACCENT)
    await expect(tableTitle(page)).toHaveText(webChatContract.defaultTableTitle)
    await expect(message(page, webChatContract.firstMessage)).toBeHidden()

    await pendingResponse.fulfill({ json: { brand: BRAND } })
    await expect(hero(page)).toHaveAttribute("data-storyboard-phase", "recolor")
    await expect(hero(page)).toHaveCSS("--wc-accent", BRAND.accent)
    await expect(tableTitle(page)).toHaveText(
      webChatContract.personalizedTableTitle
    )
    await expect(message(page, webChatContract.firstMessage)).toBeHidden()

    await expectStep(page, 1)
    await expect(message(page, webChatContract.firstMessage)).toBeVisible()
    await expect(message(page, REPLY)).toBeHidden()
    await expect(message(page, "Missing fields")).toBeHidden()
    await expect(message(page, FINAL_REPLY)).toBeHidden()
    await expect(panel(page)).toHaveCSS("filter", /^(none|grayscale\(0\))$/)
    await expect(dashboard(page)).toHaveCSS("filter", /^(none|blur\(0px\))$/)

    await expectStep(page, 2)
    await expect(message(page, REPLY)).toBeHidden()
    await expectStep(page, 3)
    await expect(message(page, webChatContract.firstMessage)).toBeVisible()
    await expect(message(page, REPLY)).toBeVisible()
    await expect(message(page, "Missing fields")).toBeHidden()

    await expectStep(page, 4)
    await expect(message(page, "Missing fields")).toBeVisible()
    await expect(message(page, FINAL_REPLY)).toBeHidden()

    await expectStep(page, 5)
    await expect(message(page, FINAL_REPLY)).toBeVisible()
    const missingEmail = panel(page).getByText("Not provided", { exact: true })
    await expect(missingEmail).toBeVisible()
    await expect(missingEmail).toHaveCSS("color", "rgb(228, 67, 67)")
    await expect(missingEmail.locator("..")).toContainText("Email address")
    await expect(missingEmail.locator("..")).not.toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)"
    )

    await expectStep(page, 1)
    await expect(hero(page)).toHaveAttribute(
      "data-storyboard-phase",
      "conversation"
    )
    await expect(message(page, webChatContract.firstMessage)).toBeVisible()
    await expect(message(page, REPLY)).toBeHidden()
    await expect(message(page, "Missing fields")).toBeHidden()
    await expect(message(page, FINAL_REPLY)).toBeHidden()
    await expect(missingEmail).toBeHidden()
    await expect(hero(page)).toHaveCSS("--wc-accent", BRAND.accent)
    await expect(tableTitle(page)).toHaveText(
      webChatContract.personalizedTableTitle
    )
    await expect(panel(page)).toHaveCSS("filter", /^(none|grayscale\(0\))$/)
    expectHealthyPage(errors)
  })

  test("finishes the grayscale fade before applying a fast brand response", async ({
    page,
  }) => {
    await page.route(PREVIEW_ROUTE, (route) =>
      route.fulfill({ json: { brand: BRAND } })
    )
    await openWebChat(page)
    await submitDomain(page)
    await expect(page.locator("[data-wc-state]")).toHaveAttribute(
      "data-wc-state",
      "personalized"
    )
    await expect(hero(page)).toHaveAttribute(
      "data-storyboard-phase",
      "grayscale"
    )
    await expect(hero(page)).toHaveCSS("--wc-accent", DEFAULT_ACCENT)
    await expect(tableTitle(page)).toHaveText(webChatContract.defaultTableTitle)

    await page.clock.runFor(FADE_MS - 1)
    await expect(hero(page)).toHaveAttribute(
      "data-storyboard-phase",
      "grayscale"
    )
    await expect(hero(page)).toHaveCSS("--wc-accent", DEFAULT_ACCENT)
    await expect(message(page, webChatContract.firstMessage)).toBeHidden()
    await page.clock.runFor(1)
    await expect(hero(page)).toHaveAttribute("data-storyboard-phase", "recolor")
    await expect(hero(page)).toHaveCSS("--wc-accent", BRAND.accent)
    await expect(tableTitle(page)).toHaveText(
      webChatContract.personalizedTableTitle
    )
    await expect(message(page, webChatContract.firstMessage)).toBeHidden()
  })

  test("reset cancels a waiting preview and ignores its late brand response", async ({
    page,
  }) => {
    const { request } = await holdPreviewResponse(page)
    await openWebChat(page)
    await submitDomain(page)
    const pendingResponse = await request
    await page.clock.runFor(FADE_MS)
    await expect(hero(page)).toHaveAttribute("data-storyboard-phase", "waiting")

    await page.getByRole("button", { name: "Reset personalization" }).click()
    await expect(hero(page)).toHaveAttribute("data-storyboard-phase", "idle")
    await expect(
      hero(page).getByRole("textbox", { name: "Message the agent" })
    ).toBeVisible()
    await pendingResponse.fulfill({ json: { brand: BRAND } })
    await page.clock.runFor(5000)

    await expect(page.locator("[data-wc-state]")).toHaveAttribute(
      "data-wc-state",
      "idle"
    )
    await expect(hero(page)).toHaveAttribute("data-storyboard-phase", "idle")
    await expect(hero(page)).toHaveCSS("--wc-accent", DEFAULT_ACCENT)
    await expect(tableTitle(page)).toHaveText(webChatContract.defaultTableTitle)
    await expect(message(page, webChatContract.firstMessage)).toBeHidden()
  })

  test("reduced motion waits for branding and shows a static complete conversation", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    const { request } = await holdPreviewResponse(page)
    await openWebChat(page)
    await submitDomain(page)
    const pendingResponse = await request
    await page.clock.runFor(5000)
    await expect(hero(page)).toHaveAttribute("data-storyboard-phase", "waiting")
    await expect(tableTitle(page)).toHaveText(webChatContract.defaultTableTitle)
    await expect(message(page, webChatContract.firstMessage)).toBeHidden()
    await expect(panel(page)).toHaveCSS("filter", /^(none|grayscale\(0\))$/)
    await expect(dashboard(page)).toHaveCSS("filter", /^(none|blur\(0px\))$/)

    await pendingResponse.fulfill({ json: { brand: BRAND } })
    await expectStep(page, 5)
    await expect(hero(page)).toHaveAttribute(
      "data-storyboard-phase",
      "conversation"
    )
    await expect(hero(page)).toHaveCSS("--wc-accent", BRAND.accent)
    await expect(message(page, webChatContract.firstMessage)).toBeVisible()
    await expect(message(page, REPLY)).toBeVisible()
    await expect(message(page, "Missing fields")).toBeVisible()
    await expect(message(page, FINAL_REPLY)).toBeVisible()
    await expect(
      panel(page).getByText("Not provided", { exact: true })
    ).toBeVisible()
    await expect(panel(page)).toHaveCSS("transition-duration", "0s")
    await expect(dashboard(page)).toHaveCSS("transition-property", "none")
    expect(
      await panel(page).evaluate(
        (element) =>
          element
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === "running").length
      )
    ).toBe(0)

    await page.clock.runFor(20_000)
    await expectStep(page, 5)
    await expect(message(page, FINAL_REPLY)).toBeVisible()
  })
})
