import { expect, test } from "@playwright/test"

import {
  connectStackContract,
  liveChannelContract,
  waitlistContract,
} from "./contracts"
import {
  expectClipboardText,
  expectHealthyPage,
  expectReactHandlerReady,
  gotoCriticalPage,
  installClipboardMock,
  observeApplicationErrors,
} from "./helpers"

test.describe("critical homepage channel journeys", () => {
  test(`[${liveChannelContract.id}] exposes a working live-channel command`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    await installClipboardMock(page)
    await gotoCriticalPage(page, liveChannelContract.route)

    const tabList = page.getByRole("tablist", {
      name: "Communication channels",
    })
    await tabList
      .getByRole("tab", { name: liveChannelContract.channel, exact: true })
      .click()

    const panel = page.getByRole("tabpanel", {
      name: liveChannelContract.channel,
    })
    await expect(
      panel.getByRole("heading", {
        level: 3,
        name: liveChannelContract.heading,
      })
    ).toBeVisible()
    await expect(panel).toContainText(liveChannelContract.command)

    const copyButton = panel
      .getByRole("button")
      .filter({ hasText: liveChannelContract.command })
    await copyButton.click()
    await expect(copyButton).toHaveAccessibleName("Command copied")
    await expectClipboardText(page, liveChannelContract.command)
    expectHealthyPage(applicationErrors)
  })

  test(`[${waitlistContract.id}] validates and retries the coming-soon waitlist`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    const payloads: unknown[] = []
    let attempts = 0

    await page.route("**/api/channel-waitlist", async (route) => {
      attempts += 1
      payloads.push(route.request().postDataJSON())

      await route.fulfill({
        status: attempts === 1 ? 500 : 200,
        contentType: "application/json",
        body: JSON.stringify(
          attempts === 1
            ? { error: "Temporary waitlist failure" }
            : { success: true }
        ),
      })
    })

    await gotoCriticalPage(page, waitlistContract.route)
    const channelTab = page
      .getByRole("tablist", { name: "Communication channels" })
      .getByRole("tab", { name: waitlistContract.channel, exact: true })
    await expectReactHandlerReady(channelTab, "onClick")
    await channelTab.click()
    await expect(channelTab).toHaveAttribute("aria-selected", "true")

    const panel = page.getByRole("tabpanel", { name: waitlistContract.channel })
    const emailInput = panel.getByRole("textbox", {
      name: `Email to be notified when ${waitlistContract.channel} is live`,
    })
    const submitButton = panel.getByRole("button", { name: "Notify me" })

    await emailInput.fill("not-an-email")
    await submitButton.click()
    await expect(panel.getByRole("alert")).toHaveText(
      waitlistContract.validationError
    )
    expect(attempts).toBe(0)

    await emailInput.fill(waitlistContract.email)
    await submitButton.click()
    await expect(panel.getByRole("alert")).toHaveText(
      waitlistContract.submissionError
    )
    await expect(submitButton).toBeEnabled()

    await submitButton.click()
    await expect(panel.getByRole("status")).toHaveText(waitlistContract.success)
    expect(attempts).toBe(2)
    expect(payloads).toEqual([
      expect.objectContaining({
        channel: waitlistContract.channel,
        email: waitlistContract.email,
      }),
      expect.objectContaining({
        channel: waitlistContract.channel,
        email: waitlistContract.email,
      }),
    ])
    expectHealthyPage(applicationErrors)
  })

  test(`[${connectStackContract.id}] generates and copies a channel-specific setup`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    await installClipboardMock(page)
    await gotoCriticalPage(page, connectStackContract.route)

    const stack = page.locator("section.connect-stack")
    await expect(
      stack.getByRole("heading", {
        level: 2,
        name: connectStackContract.heading,
      })
    ).toBeVisible()

    const channelSelect = stack.getByRole("combobox", {
      name: "Communication channel",
    })
    await expectReactHandlerReady(channelSelect, "onPointerDown")
    await channelSelect.click()
    await page
      .getByRole("option", { name: connectStackContract.channel, exact: true })
      .click()
    await expect(channelSelect).toContainText(connectStackContract.channel)

    const frameworkSelect = stack.getByRole("combobox", {
      name: "AI Framework",
    })
    await frameworkSelect.click()
    await page
      .getByRole("option", {
        name: connectStackContract.framework,
        exact: true,
      })
      .click()
    await expect(frameworkSelect).toContainText(connectStackContract.framework)
    await expect(stack).toContainText(
      `Generated for ${connectStackContract.channel} and ${connectStackContract.framework}.`
    )

    const promptPanel = stack.getByRole("tabpanel", { name: "AI prompt" })
    await expect(promptPanel.locator("code")).toHaveText(
      connectStackContract.prompt
    )

    const promptCopyButton = promptPanel.getByRole("button")
    await expect(promptCopyButton).toHaveAccessibleName("Copy AI prompt")
    await promptCopyButton.click()
    await expect(promptCopyButton).toHaveAccessibleName("Copied AI prompt")
    await expectClipboardText(page, connectStackContract.prompt)

    const cliTab = stack.getByRole("tab", { name: "CLI command" })
    await cliTab.click()
    await expect(cliTab).toHaveAttribute("data-state", "active")

    const cliPanel = stack.getByRole("tabpanel", { name: "CLI command" })
    await expect(cliPanel.locator("code")).toHaveText(
      connectStackContract.command
    )

    const commandCopyButton = cliPanel.getByRole("button")
    await expect(commandCopyButton).toHaveAccessibleName("Copy CLI command")
    await commandCopyButton.click()
    await expect(commandCopyButton).toHaveAccessibleName("Copied CLI command")
    await expectClipboardText(page, connectStackContract.command)
    expectHealthyPage(applicationErrors)
  })
})
