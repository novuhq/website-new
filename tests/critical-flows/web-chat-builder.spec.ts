import { expect, test } from "@playwright/test"

import { getWebChatBuilderBySlug } from "../../src/data/pages/web-chat-builders"
import {
  expectClipboardText,
  expectHealthyPage,
  expectReactHandlerReady,
  gotoCriticalPage,
  installClipboardMock,
  observeApplicationErrors,
  observeBrowserConsoleErrors,
} from "./helpers"

const faqQuestions = [
  "How do I add an AI chatbot to a Webflow site?",
  "Can I style it to match my Webflow design?",
  "Is this human live chat?",
  "Can the same agent reach users on WhatsApp or email?",
]

const figmaHeroVariants = [
  ["blink-new", "Add an AI agent to your Blink.new app"],
  ["lovable", "Add an AI agent to your Lovable app"],
  ["replit", "Add an AI agent to your Replit app"],
  ["bolt-new", "Add an AI agent to your Bolt.new app"],
  ["sim-studio", "Add your Sim agent to your website"],
  ["vellum", "Add your Vellum agent to your website"],
  ["flowise", "Add your Flowise agent to your website"],
  ["wordware", "Add your Wordware agent to your website"],
  ["crew-ai", "Add your CrewAI agent to your website"],
  ["langgraph", "Add your LangGraph agent to your website"],
  ["lindy", "Add your Lindy agent to your website"],
  ["stack-ai", "Add your Stack AI agent to your website"],
  ["relevance-ai", "Add your Relevance AI agent to your website"],
] as const

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
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(
      page.locator("#web-chat-builder-faq").getByText(item.answer, {
        exact: true,
      })
    ).toBeVisible()
  }
})

for (const slug of ["not-published", "toString", "constructor", "__proto__"]) {
  test(`returns a true 404 without structured data for ${slug}`, async ({
    page,
  }) => {
    const response = await page.goto(`/channels/web-chat/${slug}`, {
      waitUntil: "domcontentloaded",
    })
    expect(response?.status()).toBe(404)
    await expect(
      page.locator('script[type="application/ld+json"]')
    ).toHaveCount(0)
  })
}

test("renders the Webflow hero and copies its setup instructions", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page)
  const consoleErrors = observeBrowserConsoleErrors(page)
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

  const copyPrompt = main
    .getByRole("region", {
      name: "Add an AI agent to your Webflow site",
      exact: true,
    })
    .getByRole("button", {
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
    main
      .getByRole("region", {
        name: "Add an AI agent to your Webflow site",
        exact: true,
      })
      .getByText("Prompt copied to clipboard", { exact: true })
  ).toHaveText("Prompt copied to clipboard")

  const hero = main.getByRole("region", {
    name: "Add an AI agent to your Webflow site",
    exact: true,
  })
  const heroArtwork = hero.locator("img").first()
  await expect(heroArtwork).toHaveAttribute("src", /hero\.[\w-]+\.png/)
  await expect
    .poll(() =>
      heroArtwork.evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0
      )
    )
    .toBe(true)
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
  expect(consoleErrors).toEqual([])
})

test("renders every supplied Figma hero variant", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "One desktop project covers the registry-backed static hero variants"
  )

  for (const [slug, title] of figmaHeroVariants) {
    await gotoCriticalPage(page, `/channels/web-chat/${slug}`)
    const hero = page.getByRole("region", { name: title, exact: true })
    const artwork = hero.locator("img").first()

    await expect(hero.getByRole("heading", { level: 1 })).toHaveText(title)
    await expect(artwork).toHaveAttribute("src", /hero\.[\w-]+\.png/)
    await expect
      .poll(() =>
        artwork.evaluate((image: HTMLImageElement) => ({
          complete: image.complete,
          naturalWidth: image.naturalWidth,
        }))
      )
      .toEqual({ complete: true, naturalWidth: 608 })
    const artworkBox = await artwork.boundingBox()
    expect(artworkBox?.width).toBeCloseTo(608, 0)
    expect(artworkBox?.height).toBeCloseTo(640, 0)
  }
})

test("finishes with accessible setup actions and one shared header and Connect footer", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page)
  await installClipboardMock(page)
  await gotoCriticalPage(page, "/channels/web-chat/webflow")
  const cta = page.locator("section.cta")
  await expect(cta).toHaveCount(1)
  await expect(cta.getByRole("heading", { level: 2 })).toHaveText(
    "One engine underneath"
  )
  await expect(
    cta.getByText(
      "Whether you're building a modern app or an AI agent, Novu is the delivery layer that connects you to the world.",
      { exact: true }
    )
  ).toBeVisible()
  await expect(page.getByRole("banner")).toHaveCount(1)
  await expect(page.getByRole("contentinfo")).toHaveCount(1)
  await expect(
    page.getByRole("navigation", { name: "Footer navigation", exact: true })
  ).toHaveCount(1)
  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("link", { name: "See pricing", exact: true })
  ).toHaveAttribute("href", "/connect/#pricing")
  await expect(cta.getByRole("link")).toHaveCount(0)
  await expect(cta.getByText("npx novu connect", { exact: true })).toBeVisible()
  const copy = cta.getByRole("button", {
    name: "Copy to clipboard",
    exact: true,
  })
  const prompt = cta.getByRole("button", { name: "Copy prompt", exact: true })
  await expect(cta.locator("video")).toHaveCount(1)
  await expectReactHandlerReady(copy, "onClick")
  await copy.focus()
  await page.keyboard.press("Enter")
  await expectClipboardText(page, "npx novu connect")
  await expect(
    cta.getByText("Command copied to clipboard", { exact: true })
  ).toBeVisible()
  await page.keyboard.press("Tab")
  await expect(prompt).toBeFocused()
  await page.keyboard.press("Space")
  await expectClipboardText(
    page,
    "Connect my agent to customers with Novu using instructions from https://novu.co/agents.md"
  )
  await expect(
    cta.getByText("Prompt copied to clipboard", { exact: true })
  ).toBeVisible()
  await expect(page.locator("main h2")).toHaveText([
    "Your agent, live on your Webflow site",
    "How to add an AI agent to your Webflow site in four steps",
    "One workflow, every channel",
    "Frequently asked questions",
    "One engine underneath",
  ])
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
  expectHealthyPage(applicationErrors)
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
  const channelsArtwork = section.getByRole("img", {
    name: "Your Webflow site is just the beginning!",
  })
  await expect(channelsArtwork).toBeVisible()
  await expect(channelsArtwork).toHaveAttribute(
    "src",
    /channels-mascot\.[\w-]+\.png/
  )
  await channelsArtwork.scrollIntoViewIfNeeded()
  await expect
    .poll(() =>
      channelsArtwork.evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0
      )
    )
    .toBe(true)

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

test("keeps the channel hint open when keyboard focus scrolls the mobile grid", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const applicationErrors = observeApplicationErrors(page)
  await gotoCriticalPage(page, "/channels/web-chat/webflow")
  const section = page.getByRole("region", {
    name: "One workflow, every channel",
    exact: true,
  })
  const copy = section.getByRole("button", {
    name: "Copy to clipboard",
    exact: true,
  })
  const more = section.getByRole("button", {
    name: "More channels",
    exact: true,
  })
  await expectReactHandlerReady(more, "onFocus")
  await copy.focus()
  const scrollBefore = await page.evaluate(() => scrollY)
  // This test covers focus-driven scrolling; tab order is asserted above.
  // Explicit focus also works when macOS has full keyboard access disabled.
  await more.focus()
  await expect(more).toBeFocused()
  await expect(
    page.getByRole("tooltip", { name: "More channels coming soon" })
  ).toBeVisible()
  // WebKit on Linux does not consistently perform the native focus-scroll.
  // Scroll the keyboard-focused control explicitly and verify the hint survives.
  await more.scrollIntoViewIfNeeded()
  await expect(more).toBeInViewport()
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(scrollBefore)
  // Let the browser dispatch the native focus-scroll event before checking the hint.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })
  )
  const tooltip = page.getByRole("tooltip", {
    name: "More channels coming soon",
  })
  await expect(tooltip).toBeVisible()
  await expect(more).toHaveAccessibleDescription("More channels coming soon")
  await page.keyboard.press("Escape")
  await expect(tooltip).toHaveCount(0)
  await expect(more).toBeFocused()
  await copy.focus()
  await expect(more).not.toBeFocused()
  await expect(tooltip).toHaveCount(0)
  await more.focus()
  await expect(tooltip).toBeVisible()
  await copy.focus()
  await expect(tooltip).toHaveCount(0)
  await more.focus()
  await expect(tooltip).toBeVisible()
  await more.click()
  await expect(tooltip).toHaveCount(0)
  expectHealthyPage(applicationErrors)
})

test("matches the Webflow Figma section geometry at 1920px", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "The source Figma frame is a 1920px desktop composition"
  )

  await page.setViewportSize({ width: 1920, height: 1080 })
  await gotoCriticalPage(page, "/channels/web-chat/webflow")

  const faq = page.locator("#web-chat-builder-faq")
  const faqContainer = faq.locator(":scope > div")
  const faqTitle = faq.getByRole("heading", { level: 2 })
  const accordion = faq.locator('[data-slot="accordion"]')
  const hero = page.getByRole("region", {
    name: "Add an AI agent to your Webflow site",
    exact: true,
  })
  const heroArtwork = hero.locator("img").first()

  const faqBox = await faq.boundingBox()
  const faqContainerBox = await faqContainer.boundingBox()
  const faqTitleBox = await faqTitle.boundingBox()
  const accordionBox = await accordion.boundingBox()
  const heroArtworkBox = await heroArtwork.boundingBox()

  expect(faqBox?.height).toBeCloseTo(362, 0)
  expect(faqContainerBox?.width).toBeCloseTo(1024, 0)
  expect(accordionBox!.y - (faqTitleBox!.y + faqTitleBox!.height)).toBeCloseTo(
    40,
    0
  )
  expect(heroArtworkBox?.width).toBeCloseTo(608, 0)
  expect(heroArtworkBox?.height).toBeCloseTo(640, 0)
})
