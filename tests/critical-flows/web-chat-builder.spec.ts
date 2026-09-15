import { expect, test } from "@playwright/test"

import { getWebChatBuilderBySlug } from "../../src/data/pages/web-chat-builders"
import {
  expectClipboardText,
  expectHealthyPage,
  expectReactHandlerReady,
  gotoCriticalPage,
  installClipboardMock,
  observeApplicationErrors,
} from "./helpers"

const faqQuestions = [
  "How do I add an AI chatbot to a Webflow site?",
  "Can I style it to match my Webflow design?",
  "Is this human live chat?",
  "Can the same agent reach users on WhatsApp or email?",
]

test("renders the builder FAQ with its first answer open and keyboard controls", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page)
  await gotoCriticalPage(page, "/channels/web-chat/webflow")
  const faq = page.locator("#web-chat-builder-faq")
  await expect(faq.getByRole("heading", { level: 2 })).toHaveText(
    "Frequently asked questions"
  )
  await expect(faq.getByRole("heading", { level: 3 })).toHaveText(faqQuestions)
  const triggers = faq.getByRole("button")
  await expect(triggers).toHaveText(faqQuestions)
  await expect(triggers.nth(0)).toHaveAttribute("aria-expanded", "true")
  for (let index = 1; index < 4; index++) {
    await expect(triggers.nth(index)).toHaveAttribute("aria-expanded", "false")
  }
  await expect(faq.getByRole("region")).toHaveText(
    "Connect your agent to Novu Web Chat, then paste the embed into a Webflow Embed element or site-wide custom code."
  )
  await expectReactHandlerReady(triggers.nth(0), "onClick")
  await triggers.nth(0).focus()
  await page.keyboard.press("Tab")
  await expect(triggers.nth(1)).toBeFocused()
  expect(
    await triggers.nth(1).evaluate((node) => getComputedStyle(node).boxShadow)
  ).not.toBe("none")
  await page.keyboard.press("Enter")
  await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "true")
  await expect(triggers.nth(0)).toHaveAttribute("aria-expanded", "false")
  await expect(
    faq.getByRole("region", { name: faqQuestions[1], exact: true })
  ).not.toBeEmpty()
  await page.keyboard.press("ArrowDown")
  await expect(triggers.nth(2)).toBeFocused()
  await page.keyboard.press("Space")
  await expect(triggers.nth(2)).toHaveAttribute("aria-expanded", "true")
  await page.keyboard.press("Space")
  await expect(triggers.nth(2)).toHaveAttribute("aria-expanded", "false")
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  expectHealthyPage(applicationErrors)
})

test("publishes one canonical and page, breadcrumb, and FAQ structured data from the registry", async ({
  page,
  request,
}) => {
  await gotoCriticalPage(page, "/channels/web-chat/webflow")
  const config = getWebChatBuilderBySlug("webflow")!
  const canonical = page.locator('link[rel="canonical"]')
  await expect(canonical).toHaveCount(1)
  const url = (await canonical.getAttribute("href"))!
  expect(new URL(url).pathname).toBe("/channels/web-chat/webflow/")
  await expect(page).toHaveTitle(config.seo.title)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    config.seo.description
  )
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    url
  )
  const script = page.locator('main script[type="application/ld+json"]')
  await expect(script).toHaveCount(1)
  const data = JSON.parse((await script.textContent())!)
  expect(data["@context"]).toBe("https://schema.org")
  expect(data["@graph"]).toHaveLength(3)
  const [webPage, breadcrumb, faq] = data["@graph"]
  for (const item of breadcrumb.itemListElement) {
    const response = await request.get(new URL(item.item).pathname)
    expect(response.ok(), `Breadcrumb URL ${item.item} should resolve`).toBe(
      true
    )
  }
  expect(webPage).toMatchObject({
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: config.seo.title,
    description: config.seo.description,
    breadcrumb: { "@id": `${url}#breadcrumb` },
    mainEntity: { "@id": `${url}#faq` },
  })
  expect(breadcrumb).toMatchObject({
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Novu",
        item: new URL("/", url).href,
      },
      { "@type": "ListItem", position: 2, name: "Webflow", item: url },
    ],
  })
  expect(faq).toMatchObject({ "@type": "FAQPage", "@id": `${url}#faq` })
  expect(faq.mainEntity.map((item: { name: string }) => item.name)).toEqual(
    faqQuestions
  )
  expect(faq.mainEntity).toEqual(
    config.faq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    }))
  )
  for (const item of config.faq) {
    expect(item.answer).not.toMatch(/<[^>]+>/)
    const trigger = page
      .locator("#web-chat-builder-faq")
      .getByRole("button", { name: item.question, exact: true })
    await expectReactHandlerReady(trigger, "onClick")
    if ((await trigger.getAttribute("aria-expanded")) !== "true")
      await trigger.click()
    await expect(
      page
        .locator("#web-chat-builder-faq")
        .getByRole("region", { name: item.question, exact: true })
    ).toHaveText(item.answer)
  }
})

test("returns a true 404 for an unpublished builder", async ({ request }) => {
  const response = await request.get("/channels/web-chat/not-published")
  expect(response.status()).toBe(404)
  expect(await response.text()).not.toContain('"@type":"FAQPage"')
})

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
