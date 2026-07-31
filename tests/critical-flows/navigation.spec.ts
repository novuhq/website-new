import { expect, test } from "@playwright/test"

import { navigationContract } from "./contracts"
import {
  expectHealthyPage,
  gotoCriticalPage,
  observeApplicationErrors,
} from "./helpers"

test.describe("critical responsive navigation", () => {
  test(`[${navigationContract.id}] opens pricing and preserves authentication destinations`, async ({
    isMobile,
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    await gotoCriticalPage(page, navigationContract.route)

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: navigationContract.heading,
      })
    ).toBeVisible()

    if (isMobile) {
      await page.getByRole("button", { name: "Toggle menu" }).click()
      await expect(
        page.getByRole("navigation", { name: "Mobile navigation" })
      ).toBeVisible()
    }

    const navigationRoot = isMobile
      ? page.getByRole("dialog", { name: "Menu" })
      : page.locator("header")

    for (const authLink of navigationContract.authLinks) {
      await expect(
        navigationRoot.getByRole("link", {
          name: authLink.name,
          exact: true,
        })
      ).toHaveAttribute("href", authLink.href)
    }

    await navigationRoot
      .getByRole("link", { name: "Pricing", exact: true })
      .click()
    await expect(page).toHaveURL(/\/pricing\/?$/)
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: navigationContract.destinationHeading,
      })
    ).toBeVisible()
    expectHealthyPage(applicationErrors)
  })
})
