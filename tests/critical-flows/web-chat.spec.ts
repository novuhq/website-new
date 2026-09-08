import { expect, test } from "@playwright/test"

import { webChatContract } from "./contracts"
import {
  expectHealthyPage,
  gotoCriticalPage,
  observeApplicationErrors,
} from "./helpers"

const PREVIEW_ROUTE = "**/api/agent-preview"

test.describe("web chat personalizer", () => {
  test(`[${webChatContract.id}] personalizes the hero and plays the conversation`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)

    await page.route(PREVIEW_ROUTE, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          brand: {
            url: `https://${webChatContract.domain}`,
            domain: webChatContract.domain,
            name: "Recent",
            description: "",
            accent: webChatContract.accent,
            logo: null,
          },
        }),
      })
    )

    await gotoCriticalPage(page, webChatContract.route)

    await expect(
      page.getByRole("heading", { level: 1, name: webChatContract.heading })
    ).toBeVisible()
    await expect(
      page.getByText(webChatContract.defaultTableTitle, { exact: true })
    ).toBeVisible()

    await page
      .getByRole("textbox", { name: /site|domain|url/i })
      .fill(webChatContract.domain)
    await page
      .getByRole("button", { name: webChatContract.submitLabel })
      .click()

    await expect(
      page.getByText(webChatContract.personalizedTableTitle, { exact: true })
    ).toBeVisible()
    await expect(page.getByText(webChatContract.firstMessage)).toBeVisible()

    const accent = await page
      .locator("[data-wc-state]")
      .first()
      .evaluate((node) =>
        getComputedStyle(node).getPropertyValue("--wc-accent").trim()
      )
    expect(accent).toBe(webChatContract.accent)

    expectHealthyPage(applicationErrors)
  })

  test(`[${webChatContract.id}] keeps the default theme and still animates when extraction fails`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)

    await page.route(PREVIEW_ROUTE, (route) =>
      route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({
          error: true,
          message: "Could not read that site",
        }),
      })
    )

    await gotoCriticalPage(page, webChatContract.route)

    await page
      .getByRole("textbox", { name: /site|domain|url/i })
      .fill(webChatContract.domain)
    await page
      .getByRole("button", { name: webChatContract.submitLabel })
      .click()

    await expect(
      page
        .getByRole("status")
        .filter({ hasText: webChatContract.fallbackAlert })
    ).toBeVisible()

    // The spec is explicit: a personalization failure must not block the animation.
    await expect(page.getByText(webChatContract.firstMessage)).toBeVisible()

    expectHealthyPage(applicationErrors)
  })

  test(`[${webChatContract.id}] reset returns the hero to its default state`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)

    await page.route(PREVIEW_ROUTE, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          brand: {
            url: `https://${webChatContract.domain}`,
            domain: webChatContract.domain,
            name: "Recent",
            description: "",
            accent: webChatContract.accent,
            logo: null,
          },
        }),
      })
    )

    await gotoCriticalPage(page, webChatContract.route)

    await page
      .getByRole("textbox", { name: /site|domain|url/i })
      .fill(webChatContract.domain)
    await page
      .getByRole("button", { name: webChatContract.submitLabel })
      .click()
    await expect(
      page.getByText(webChatContract.personalizedTableTitle, { exact: true })
    ).toBeVisible()

    await page.getByRole("button", { name: /reset/i }).click()

    await expect(
      page.getByText(webChatContract.defaultTableTitle, { exact: true })
    ).toBeVisible()
    await expect(page.getByText(webChatContract.firstMessage)).toBeHidden()

    expectHealthyPage(applicationErrors)
  })
})
