import { expect, test } from "@playwright/test"

import { integrationsContract } from "./contracts"
import {
  expectHealthyPage,
  expectReactHandlerReady,
  gotoCriticalPage,
  observeApplicationErrors,
} from "./helpers"

test.describe("critical integrations discovery journey", () => {
  test(`[${integrationsContract.id}] finds a provider and preserves its documentation handoff`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    await gotoCriticalPage(page, integrationsContract.route)

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: integrationsContract.heading,
      })
    ).toBeVisible()

    const searchInput = page.getByRole("searchbox", {
      name: "Search integrations by title or category",
    })
    await expectReactHandlerReady(searchInput, "onChange")
    await searchInput.fill(integrationsContract.query)
    await expect
      .poll(() => new URL(page.url()).searchParams.get("q"))
      .toBe(integrationsContract.query)

    const integrationCards = page.locator('[data-slot="integration-card"]')
    await expect(integrationCards).toHaveCount(1)

    const matchingCard = integrationCards.filter({
      has: page.getByRole("heading", {
        level: 3,
        name: integrationsContract.detailHeading,
        exact: true,
      }),
    })
    await expect(matchingCard).toBeVisible()
    await matchingCard.click()

    await expect(page).toHaveURL(
      new RegExp(`${integrationsContract.detailRoute}/?$`)
    )
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: integrationsContract.detailHeading,
        exact: true,
      })
    ).toBeVisible()
    await expect(
      page.getByRole("link", {
        name: `Integrate ${integrationsContract.detailHeading}`,
        exact: true,
      })
    ).toHaveAttribute("href", integrationsContract.docsDestination)
    expectHealthyPage(applicationErrors)
  })
})
