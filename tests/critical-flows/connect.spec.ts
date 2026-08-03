import { expect, test } from "@playwright/test"

import { connectContract } from "./contracts"
import {
  expectClipboardText,
  expectHealthyPage,
  expectReactHandlerReady,
  gotoCriticalPage,
  installClipboardMock,
  observeApplicationErrors,
} from "./helpers"

test.describe("critical Novu Connect journey", () => {
  test(`[${connectContract.id}] exposes working setup and template handoffs`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    await installClipboardMock(page)
    await gotoCriticalPage(page, connectContract.route)

    const hero = page.locator("#connect")
    await expect(
      hero.getByRole("heading", {
        level: 1,
        name: connectContract.heading,
      })
    ).toBeVisible()

    const commandButton = hero.locator(
      '[data-click-text="copy_connect_command"]'
    )
    await expectReactHandlerReady(commandButton, "onClick")
    await commandButton.click()
    await expect(commandButton).toHaveAccessibleName("Copied command")
    await expectClipboardText(page, connectContract.command)

    const promptButton = hero.locator('[data-click-text="copy_prompt"]')
    await expectReactHandlerReady(promptButton, "onClick")
    await promptButton.click()
    await expect(promptButton).toHaveAccessibleName("Prompt copied")
    await expectClipboardText(page, connectContract.prompt)

    await expect(
      hero.getByRole("link", { name: "Sign Up", exact: true })
    ).toHaveAttribute("href", connectContract.signUpDestination)

    const templates = page.locator("#templates")
    const firstTemplateLink = templates
      .locator("[data-template-card]")
      .first()
      .getByRole("link", { name: /^Use .+ template$/ })
    await expect(firstTemplateLink).toBeVisible()

    const templateHref = await firstTemplateLink.getAttribute("href")
    expect(templateHref).not.toBeNull()

    const templateUrl = new URL(templateHref!)
    expect(templateUrl.origin).toBe(connectContract.connectAppDestination)
    expect(templateUrl.searchParams.get("agentTemplateId")).toBeTruthy()

    await expect(
      templates.getByRole("link", { name: "Start From Scratch" })
    ).toHaveAttribute("href", connectContract.connectAppDestination)
    expectHealthyPage(applicationErrors)
  })
})
