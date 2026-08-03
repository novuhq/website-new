import { expect, test } from "@playwright/test"

import { channelHandoffContract, channelPagesContract } from "./contracts"
import {
  expectHealthyPage,
  gotoCriticalPage,
  observeApplicationErrors,
} from "./helpers"

test.describe("critical channel landing-page journeys", () => {
  test(`[${channelPagesContract.id}] renders every published channel landing page`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)

    for (const channel of channelPagesContract.pages) {
      await test.step(channel.route, async () => {
        await gotoCriticalPage(page, channel.route)
        await expect(
          page.getByRole("heading", { level: 1, name: channel.heading })
        ).toBeVisible()
        await expect(
          page.getByRole("link", { name: "Explore Novu Connect" }).first()
        ).toHaveAttribute("href", /\/connect\/?$/)
        await expect(page.locator("main")).toContainText(
          `npx novu connect --channel ${channel.cliSlug}`
        )
        await expect(
          page.getByRole("heading", { name: /common questions$/i })
        ).toBeVisible()
      })
    }

    expectHealthyPage(applicationErrors)
  })

  test(`[${channelHandoffContract.id}] opens Novu Connect from a channel page`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    await gotoCriticalPage(page, channelHandoffContract.route)

    await page
      .getByRole("link", { name: "Explore Novu Connect" })
      .first()
      .click()
    await expect(page).toHaveURL(/\/connect\/?$/)
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: channelHandoffContract.destinationHeading,
      })
    ).toBeVisible()
    expectHealthyPage(applicationErrors)
  })
})
