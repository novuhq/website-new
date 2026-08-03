import { expect, test } from "@playwright/test"

import { destinations, pricingContract } from "./contracts"
import {
  expectHealthyPage,
  gotoCriticalPage,
  observeApplicationErrors,
} from "./helpers"

test.describe("critical acquisition journeys", () => {
  test(`[${pricingContract.id}] preserves self-serve and enterprise plan handoffs`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    await gotoCriticalPage(page, pricingContract.route)

    await expect(
      page.getByRole("heading", { level: 1, name: pricingContract.heading })
    ).toBeVisible()

    for (const planName of pricingContract.selfServePlans) {
      const plan = page.locator("li").filter({
        has: page.getByRole("heading", {
          level: 3,
          name: planName,
          exact: true,
        }),
      })
      await expect(
        plan.getByRole("link", { name: "Get started", exact: true })
      ).toHaveAttribute("href", destinations.dashboard)
    }

    const enterprisePlan = page.locator("li").filter({
      has: page.getByRole("heading", {
        level: 3,
        name: pricingContract.enterprisePlan,
        exact: true,
      }),
    })
    await enterprisePlan
      .getByRole("link", { name: "Contact us", exact: true })
      .click()
    await expect(
      page.locator('[data-cal-namespace="novu-meeting"]')
    ).toHaveAttribute("data-cal-link", /utm_source=pricing_card_enterprise/)
    expectHealthyPage(applicationErrors)
  })
})
