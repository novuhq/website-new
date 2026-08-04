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

  test("filters shared agent runtimes and keeps coming-soon channels non-interactive", async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    await gotoCriticalPage(page, "/integrations/sources")

    const agentRuntimesFilter = page.getByRole("button", {
      name: "Agent runtimes",
      exact: true,
    })
    await expectReactHandlerReady(agentRuntimesFilter, "onClick")
    await agentRuntimesFilter.click()
    await expect
      .poll(() => new URL(page.url()).searchParams.get("category"))
      .toBe("agent-runtimes")

    const runtimeCards = page.locator('[data-slot="integration-card"]')
    await expect(runtimeCards).toHaveCount(4)
    for (const title of integrationsContract.agentRuntimes) {
      await expect(
        runtimeCards.getByRole("heading", {
          level: 3,
          name: title,
          exact: true,
        })
      ).toHaveCount(1)
    }

    await gotoCriticalPage(page, "/integrations/channels")
    const agentChannelsFilter = page.getByRole("button", {
      name: "Agent channels",
      exact: true,
    })
    await expectReactHandlerReady(agentChannelsFilter, "onClick")
    await agentChannelsFilter.click()
    await expect
      .poll(() => new URL(page.url()).searchParams.get("category"))
      .toBe("agent-channels")

    await page.getByRole("button", { name: "Show more" }).click()
    const agentChannelCards = page.locator('[data-slot="integration-card"]')
    await expect(agentChannelCards).toHaveCount(11)
    await expect
      .poll(() =>
        agentChannelCards
          .locator("img")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0
            )
          )
      )
      .toBe(true)

    const comingSoonCards = page.locator(
      '[data-slot="integration-card"][data-availability="coming-soon"]'
    )
    await expect(comingSoonCards).toHaveCount(5)
    await expect
      .poll(() =>
        comingSoonCards.evaluateAll((cards) =>
          cards.every((card) => card.tagName === "ARTICLE")
        )
      )
      .toBe(true)
    for (const title of integrationsContract.comingSoonAgentChannels) {
      await expect(
        comingSoonCards.getByRole("heading", {
          level: 3,
          name: title,
          exact: true,
        })
      ).toHaveCount(1)
    }

    expectHealthyPage(applicationErrors)
  })
})
