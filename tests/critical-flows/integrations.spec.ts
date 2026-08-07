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

  test("groups agent runtimes and exposes live agent channels", async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    await gotoCriticalPage(page, "/integrations/sources")

    const agentRuntimesSection = page.getByRole("region", {
      name: "Agent runtimes",
    })
    await expect(
      agentRuntimesSection.locator('[data-slot="integration-card"]')
    ).toHaveCount(6)
    for (const group of integrationsContract.agentRuntimeGroups) {
      await expect(
        agentRuntimesSection.getByRole("heading", {
          level: 3,
          name: group,
          exact: true,
        })
      ).toBeVisible()
    }

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
    await expect(runtimeCards).toHaveCount(6)
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

    const agentChannelCards = page.locator('[data-slot="integration-card"]')
    await expect(agentChannelCards).toHaveCount(6)
    const agentChannelImages = agentChannelCards.locator("img")
    await expect(agentChannelImages).toHaveCount(6)
    for (let index = 0; index < 6; index += 1) {
      const image = agentChannelImages.nth(index)
      await image.scrollIntoViewIfNeeded()
      await expect
        .poll(() =>
          image.evaluate(
            (element) =>
              (element as HTMLImageElement).complete &&
              (element as HTMLImageElement).naturalWidth > 0
          )
        )
        .toBe(true)
    }

    await expect
      .poll(() =>
        agentChannelCards.evaluateAll((cards) =>
          cards.every((card) => card.tagName === "A")
        )
      )
      .toBe(true)
    for (const title of integrationsContract.agentChannels) {
      await expect(
        agentChannelCards.getByRole("heading", {
          level: 3,
          name: title,
          exact: true,
        })
      ).toHaveCount(1)
    }

    expectHealthyPage(applicationErrors)
  })

  test("keeps detail hero actions mutually exclusive and stacks CLI commands", async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    await gotoCriticalPage(page, "/integrations/langchain")

    const runtimeHero = page.locator("article header")
    const runtimeTagline = runtimeHero.getByText(
      "LangChain is the open-source framework for building agents and LLM apps in Python and JavaScript.",
      { exact: true }
    )
    const copyCommand = runtimeHero.getByRole("button", {
      name: "Copy to clipboard",
    })
    const commandText = runtimeHero.getByText(
      "npx novu connect --channel <channel> --runtime langchain",
      { exact: true }
    )

    await expect(copyCommand).toBeVisible()
    await expect(
      runtimeHero.getByRole("link", { name: "Integrate LangChain" })
    ).toHaveCount(0)
    await expect
      .poll(async () => {
        const [taglineBox, commandBox] = await Promise.all([
          runtimeTagline.boundingBox(),
          copyCommand.locator("xpath=../..").boundingBox(),
        ])

        if (!taglineBox || !commandBox) return false
        return commandBox.y >= taglineBox.y + taglineBox.height + 27
      })
      .toBe(true)

    const [heroBox, commandBox] = await Promise.all([
      runtimeHero.boundingBox(),
      copyCommand.locator("xpath=../..").boundingBox(),
    ])
    expect(heroBox).not.toBeNull()
    expect(commandBox).not.toBeNull()
    expect(commandBox!.width).toBeLessThanOrEqual(heroBox!.width)

    const commandTextMetrics = await commandText.evaluate((element) => {
      const styles = window.getComputedStyle(element)

      return {
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        overflowX: styles.overflowX,
        textOverflow: styles.textOverflow,
      }
    })
    expect(commandTextMetrics.overflowX).toBe("auto")
    expect(commandTextMetrics.textOverflow).toBe("clip")

    if ((page.viewportSize()?.width ?? 0) >= 640) {
      expect(commandBox!.width).toBeGreaterThan(282)
      expect(commandTextMetrics.scrollWidth).toBeLessThanOrEqual(
        commandTextMetrics.clientWidth + 4
      )
    }

    await gotoCriticalPage(page, "/integrations/sendgrid")
    const providerHero = page.locator("article header")
    await expect(
      providerHero.getByRole("link", { name: "Integrate SendGrid" })
    ).toHaveAttribute(
      "href",
      "https://docs.novu.co/platform/integrations/email/sendgrid"
    )
    await expect(
      providerHero.getByRole("button", { name: "Copy to clipboard" })
    ).toHaveCount(0)

    expectHealthyPage(applicationErrors)
  })
})
