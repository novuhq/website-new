import { expect, test } from "@playwright/test"

import {
  expectClipboardText,
  expectHealthyPage,
  expectReactHandlerReady,
  gotoCriticalPage,
  installClipboardMock,
  observeApplicationErrors,
} from "./helpers"

test("renders the Webflow hero and copies its setup instructions", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page)
  const consoleErrors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text())
  })
  await installClipboardMock(page)
  await gotoCriticalPage(page, "/channels/web-chat/webflow")

  const main = page.getByRole("main")
  await expect(main).toHaveCount(1)
  await expect(main.getByRole("heading", { level: 1 })).toHaveText(
    "Add an AI agent to your Webflow site"
  )
  await expect(
    main.getByText("Web Chat for Webflow", { exact: true })
  ).toBeVisible()
  await expect(
    main.getByRole("region", { name: "Trusted by teams worldwide" })
  ).toBeVisible()
  await expect(
    main
      .getByRole("region", {
        name: "Add an AI agent to your Webflow site",
        exact: true,
      })
      .getByText("npx novu connect --channel web-chat", { exact: true })
  ).toBeVisible()

  const features = main.getByRole("region", {
    name: "Your agent, live on your Webflow site",
  })
  await expect(
    features.getByRole("heading", {
      level: 2,
      name: "Your agent, live on your Webflow site",
    })
  ).toBeVisible()
  await expect(features.getByRole("listitem")).toHaveCount(6)
  await expect(features.getByRole("heading", { level: 3 })).toHaveText([
    "One-snippet embed",
    "No backend to host",
    "Themeable",
    "Two-way",
    "Every channel, one workflow",
    "Shareable public link",
  ])
  await expect(
    features.getByText(
      "Paste one script tag into Webflow’s Embed element or site-wide custom code.",
      { exact: true }
    )
  ).toBeVisible()

  const setup = main.getByRole("region", {
    name: "How to add an AI agent to your Webflow site in four steps",
  })
  await expect(
    setup.getByRole("heading", {
      level: 2,
      name: "How to add an AI agent to your Webflow site in four steps",
    })
  ).toBeVisible()
  const steps = setup.getByRole("listitem")
  await expect(steps).toHaveCount(4)
  await expect(steps.nth(0)).toContainText(
    "npx novu connect --channel web-chat."
  )
  await expect(steps.nth(1)).toContainText(
    "Copy your one-line Web Chat embed, a single script tag."
  )
  await expect(steps.nth(2)).toContainText("Project Settings → Custom Code")
  await expect(steps.nth(3)).toContainText(
    "Publish. Your agent is live in the chat, replying to visitors."
  )

  const copyPrompt = main.getByRole("button", {
    name: "Copy Prompt",
    exact: true,
  })
  await expect(copyPrompt).toBeVisible()
  await expectReactHandlerReady(copyPrompt, "onClick")
  await copyPrompt.click()
  await expectClipboardText(
    page,
    "Add Novu Web Chat to my Webflow site. Run npx novu connect --channel web-chat, then help me embed the chat on my site and connect it to my AI agent."
  )
  await expect(
    main.getByText("Prompt copied to clipboard", { exact: true })
  ).toHaveText("Prompt copied to clipboard")

  const hero = main.getByRole("region", {
    name: "Add an AI agent to your Webflow site",
    exact: true,
  })
  const copyCommand = hero.getByRole("button", {
    name: "Copy to clipboard",
    exact: true,
  })
  await expect(copyCommand).toBeVisible()
  await expectReactHandlerReady(copyCommand, "onClick")
  await copyCommand.click()
  await expectClipboardText(page, "npx novu connect --channel web-chat")
  await expect(
    hero.getByText("Command copied to clipboard", { exact: true })
  ).toHaveText("Command copied to clipboard")

  expectHealthyPage(applicationErrors)
  // gotoCriticalPage intentionally blocks third-party scripts in Chromium.
  expect(
    consoleErrors.filter(
      (message) =>
        message !==
        "Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector"
    )
  ).toEqual([])
})

test("shows every channel and makes the upcoming-channel hint accessible", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page)
  await installClipboardMock(page)
  await gotoCriticalPage(page, "/channels/web-chat/webflow")

  const section = page.getByRole("region", {
    name: "One workflow, every channel",
  })
  await expect(section.getByRole("heading", { level: 2 })).toHaveText(
    "One workflow, every channel"
  )
  await expect(
    section.getByText(
      "Your agent’s logic works across Webflow chat and every channel. Novu handles delivery through one workflow. Run the command to connect Web Chat.",
      { exact: true }
    )
  ).toBeVisible()
  for (const channel of [
    "Telegram",
    "MS Teams",
    "Email",
    "Web Chat",
    "WhatsApp",
    "Slack",
    "iMessage",
  ]) {
    await expect(section.getByText(channel, { exact: true })).toBeVisible()
  }
  await expect(
    section.getByRole("img", {
      name: "Your Webflow site is just the beginning!",
    })
  ).toBeVisible()

  const copyCommand = section.getByRole("button", {
    name: "Copy to clipboard",
    exact: true,
  })
  await expectReactHandlerReady(copyCommand, "onClick")
  await copyCommand.click()
  await expectClipboardText(page, "npx novu connect --channel web-chat")
  await expect(
    section.getByText("Command copied to clipboard", { exact: true })
  ).toHaveText("Command copied to clipboard")

  const more = section.getByRole("button", {
    name: "More channels",
    exact: true,
  })
  const tooltip = page.getByRole("tooltip", {
    name: "More channels coming soon",
  })
  const tooltipPanel = page.locator('[data-slot="tooltip-content"]')
  await expect(tooltip).toHaveCount(0)
  await more.hover()
  await expect(tooltip).toBeVisible()
  await expect(tooltipPanel).toBeVisible()
  await page.mouse.move(0, 0, { steps: 10 })
  await expect(tooltip).toHaveCount(0)

  // The copy control precedes the hint in the actual keyboard tab order.
  await copyCommand.focus()
  await page.keyboard.press("Tab")
  await expect(more).toBeFocused()
  await expect(tooltip).toBeVisible()
  await expect(tooltipPanel).toBeVisible()
  await expect(more).toHaveAccessibleDescription("More channels coming soon")
  await page.keyboard.press("Escape")
  await expect(tooltip).toHaveCount(0)
  expectHealthyPage(applicationErrors)
})
