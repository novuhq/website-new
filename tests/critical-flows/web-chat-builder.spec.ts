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
    main.getByText("npx novu connect --channel web-chat", { exact: true })
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

  const copyCommand = main.getByRole("button", {
    name: "Copy to clipboard",
    exact: true,
  })
  await expect(copyCommand).toBeVisible()
  await expectReactHandlerReady(copyCommand, "onClick")
  await copyCommand.click()
  await expectClipboardText(page, "npx novu connect --channel web-chat")
  await expect(
    main.getByText("Command copied to clipboard", { exact: true })
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
