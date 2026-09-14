import { expect, test } from "@playwright/test"

import { webChatContract } from "./contracts"
import { gotoCriticalPage } from "./helpers"

test("colors hero and illustration bubbles independently with readable text", async ({
  page,
}) => {
  let accent: string | null = "#34d59a"
  let fail = false
  await page.route("**/api/agent-preview", (route) =>
    fail
      ? route.fulfill({ status: 503, json: { error: "Unavailable" } })
      : route.fulfill({
          json: { brand: { domain: "example.com", accent, logo: null } },
        })
  )
  await gotoCriticalPage(page, webChatContract.route)
  await expect(
    page
      .getByTestId("web-chat-hero")
      .getByRole("textbox", { name: "Message the agent" })
  ).toBeVisible()
  const bento = page
    .getByRole("heading", {
      name: "Not a chat box on your site. An agent inside your app",
    })
    .locator("xpath=ancestor::section")
  const ui = bento.locator("[data-brand-ui]").filter({ visible: true })
  const comparison = page
    .getByRole("heading", {
      name: "You know the old chat widget. This is Web Chat",
    })
    .locator("xpath=ancestor::section")
  const comparisonUI = comparison
    .locator("[data-brand-ui]")
    .filter({ visible: true })
  const heroBubble = page
    .getByTestId("web-chat-hero")
    .getByText(webChatContract.firstMessage, { exact: true })
    .filter({ visible: true })
  const submit = async () => {
    await page
      .getByRole("textbox", { name: "Your website URL" })
      .fill("example.com")
    await page
      .getByRole("button", { name: webChatContract.submitLabel })
      .click()
  }

  await submit()
  await expect(ui).toHaveCount(5)
  const bubble = ui.first().locator("[data-accent-fill]").first()
  const text = ui.first().locator("[data-accent-text]").first()
  await expect(bubble).toHaveCSS("fill", "rgb(52, 213, 154)")
  await expect(text).toHaveCSS("fill", "rgb(0, 0, 0)")
  await expect(heroBubble).toHaveCSS("background-color", "rgb(52, 213, 154)")
  await expect(heroBubble).toHaveCSS("color", "rgb(0, 0, 0)")
  await expect(comparisonUI).toHaveCount(2)
  for (const artwork of await comparisonUI.all()) {
    await expect(artwork.locator("[data-accent-fill]")).toHaveCSS(
      "fill",
      "rgb(52, 213, 154)"
    )
    await expect(artwork.locator("[data-accent-text]")).toHaveCSS(
      "fill",
      "rgb(0, 0, 0)"
    )
  }
  await expect(ui.first()).toHaveCSS("mix-blend-mode", "normal")
  await expect(ui.first().locator("image").first()).toHaveAttribute(
    "xlink:href",
    "/images/web-chat-bento/portrait.jpg"
  )

  accent = "#0036ff"
  await submit()
  await expect(bubble).toHaveCSS("fill", "rgb(0, 54, 255)")
  await expect(text).toHaveCSS("fill", "rgb(255, 255, 255)")
  await expect(heroBubble).toHaveCSS("background-color", "rgb(0, 54, 255)")
  await expect(heroBubble).toHaveCSS("color", "rgb(255, 255, 255)")
  for (const artwork of await comparisonUI.all()) {
    await expect(artwork.locator("[data-accent-fill]")).toHaveCSS(
      "fill",
      "rgb(0, 54, 255)"
    )
    await expect(artwork.locator("[data-accent-text]")).toHaveCSS(
      "fill",
      "rgb(255, 255, 255)"
    )
  }

  // Recent's Figma reference explicitly keeps white text on its orange.
  accent = "#e65006"
  await submit()
  await expect(bubble).toHaveCSS("fill", "rgb(230, 80, 6)")
  await expect(text).toHaveCSS("fill", "rgb(255, 255, 255)")
  await expect(heroBubble).toHaveCSS("background-color", "rgb(230, 80, 6)")
  await expect(heroBubble).toHaveCSS("color", "rgb(255, 255, 255)")
  for (const artwork of await comparisonUI.all()) {
    await expect(artwork.locator("[data-accent-text]")).toHaveCSS(
      "fill",
      "rgb(255, 255, 255)"
    )
  }

  // Other colors, including Claude's clay, still use maximum contrast.
  accent = "#d97757"
  await submit()
  await expect(heroBubble).toHaveCSS("background-color", "rgb(217, 119, 87)")
  await expect(heroBubble).toHaveCSS("color", "rgb(0, 0, 0)")

  accent = null
  await submit()
  await expect(heroBubble).toHaveCSS("background-color", "rgb(0, 0, 0)")
  await expect(heroBubble).toHaveCSS("color", "rgb(255, 255, 255)")
  for (const layer of await page.locator("[data-brand-artwork]").all()) {
    await expect(layer).toHaveCSS("opacity", "0")
  }

  await page.getByRole("button", { name: "Reset personalization" }).click()
  await expect(bento).toHaveCSS("--wc-accent", "#c25cd6")
  await expect(bento.locator("[data-brand-artwork]").first()).toHaveCSS(
    "opacity",
    "0"
  )
  await expect(comparison.locator("[data-brand-artwork]").first()).toHaveCSS(
    "opacity",
    "0"
  )
  fail = true
  await submit()
  await expect(page.locator("[data-wc-state]")).toHaveAttribute(
    "data-wc-state",
    "fallback"
  )
  await expect(bento.locator("[data-brand-artwork]").first()).toHaveCSS(
    "opacity",
    "0"
  )
  await expect(comparison.locator("[data-brand-artwork]").first()).toHaveCSS(
    "opacity",
    "0"
  )
})
