import { expect, test } from "@playwright/test"

import { getWebChatBuilderBySlug } from "../../src/data/pages/web-chat-builders"
import {
  expectAccordionItemExpanded,
  expectClipboardText,
  expectHealthyPage,
  expectReactHandlerReady,
  gotoCriticalPage,
  installClipboardMock,
  observeApplicationErrors,
  observeBrowserConsoleErrors,
} from "./helpers"

const faqQuestions = [
  "How do I add an AI chatbot to a Blink.new app?",
  "Can I style it to match my Blink.new app?",
  "Is this human live chat?",
  "Can the same agent reach users on WhatsApp or email?",
]

const figmaHeroVariants = [
  [
    "blink-new",
    "Add an AI agent to your Blink.new app",
    "Give your Blink.new app an AI agent",
  ],
  [
    "lovable",
    "Add an AI agent to your Lovable app",
    "Give your Lovable app an AI agent",
  ],
  [
    "replit",
    "Add an AI agent to your Replit app",
    "Give your Replit app an AI agent",
  ],
  [
    "bolt-new",
    "Add an AI agent to your Bolt.new app",
    "Give your Bolt.new app an AI agent",
  ],
  [
    "sim-studio",
    "Add your Sim agent to your website",
    "Bring your Sim agent to your website",
  ],
  [
    "vellum",
    "Add your Vellum agent to your website",
    "Bring your Vellum agent to your website",
  ],
  [
    "flowise",
    "Add your Flowise agent to your website",
    "Bring your Flowise agent to your website",
  ],
  [
    "wordware",
    "Add your Wordware agent to your website",
    "Bring your Wordware agent to your website",
  ],
  [
    "crew-ai",
    "Add your CrewAI agent to your website",
    "Bring your CrewAI agent to your website",
  ],
  [
    "langgraph",
    "Add your LangGraph agent to your website",
    "Bring your LangGraph agent to your website",
  ],
  [
    "lindy",
    "Add your Lindy agent to your website",
    "Bring your Lindy agent to your website",
  ],
  [
    "stack-ai",
    "Add your Stack AI agent to your website",
    "Bring your Stack AI agent to your website",
  ],
  [
    "relevance-ai",
    "Add your Relevance AI agent to your website",
    "Bring your Relevance AI agent to your website",
  ],
] as const

const channelArtworkMessages: Record<
  (typeof figmaHeroVariants)[number][0],
  string
> = {
  "blink-new": "Your Blink.new app is just the beginning!",
  lovable: "Your Lovable app is just the beginning!",
  replit: "Your Replit app is just the beginning!",
  "bolt-new": "Your Bolt.new app is just the beginning!",
  "sim-studio": "Your Sim agent is just the beginning!",
  vellum: "Your Vellum agent is just the beginning!",
  flowise: "Your Flowise agent is just the beginning!",
  wordware: "Your Wordware agent is just the beginning!",
  "crew-ai": "Your CrewAI agent is just the beginning!",
  langgraph: "Your LangGraph agent is just the beginning!",
  lindy: "Your Lindy agent is just the beginning!",
  "stack-ai": "Your Stack AI agent is just the beginning!",
  "relevance-ai": "Your Relevance AI agent is just the beginning!",
}

test("renders the builder FAQ with its first answer open and keyboard controls", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page)
  await gotoCriticalPage(page, "/channels/web-chat/blink-new")
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
    "Connect your agent to Novu Web Chat, then paste the embed into your Blink.new app."
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
  await gotoCriticalPage(page, "/channels/web-chat/blink-new")
  const config = getWebChatBuilderBySlug("blink-new")!
  const canonical = page.locator('link[rel="canonical"]')
  await expect(canonical).toHaveCount(1)
  const url = (await canonical.getAttribute("href"))!
  expect(new URL(url).pathname).toBe("/channels/web-chat/blink-new/")
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
      { "@type": "ListItem", position: 2, name: "Blink.new", item: url },
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
    await expectAccordionItemExpanded(trigger)
    await expect(
      page.locator("#web-chat-builder-faq").getByText(item.answer, {
        exact: true,
      })
    ).toBeVisible()
  }
})

for (const slug of [
  "webflow",
  "not-published",
  "toString",
  "constructor",
  "__proto__",
]) {
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

test("renders the Blink.new hero and copies its setup instructions", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page)
  const consoleErrors = observeBrowserConsoleErrors(page)
  await installClipboardMock(page)
  await gotoCriticalPage(page, "/channels/web-chat/blink-new")

  const main = page.getByRole("main")
  await expect(main).toHaveCount(1)
  await expect(main.getByRole("heading", { level: 1 })).toHaveText(
    "Add an AI agent to your Blink.new app"
  )
  await expect(
    main.getByText("Web Chat for Blink.new", { exact: true })
  ).toBeVisible()
  await expect(
    main.getByRole("region", { name: "Trusted by teams worldwide" })
  ).toBeVisible()
  await expect(
    main
      .getByRole("region", {
        name: "Add an AI agent to your Blink.new app",
        exact: true,
      })
      .getByText("npx novu connect --channel web-chat", { exact: true })
  ).toBeVisible()

  const features = main.getByRole("region", {
    name: "Your agent, live in your Blink.new app",
  })
  await expect(
    features.getByRole("heading", {
      level: 2,
      name: "Your agent, live in your Blink.new app",
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
    features.getByText("Paste one script tag into your Blink.new app.", {
      exact: true,
    })
  ).toBeVisible()

  const setup = main.getByRole("region", {
    name: "How to add an AI agent to your Blink.new app in four steps",
  })
  await expect(
    setup.getByRole("heading", {
      level: 2,
      name: "How to add an AI agent to your Blink.new app in four steps",
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
  await expect(steps.nth(2)).toContainText(
    "Paste the embed where you want the widget in your Blink.new app."
  )
  await expect(steps.nth(3)).toContainText(
    "Publish. Your agent is live in the chat, replying to visitors."
  )

  const copyPrompt = main
    .getByRole("region", {
      name: "Add an AI agent to your Blink.new app",
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
    "Add Novu Web Chat to my Blink.new app. Run npx novu connect --channel web-chat, then help me embed the chat in my app and connect it to my AI agent."
  )
  await expect(
    main
      .getByRole("region", {
        name: "Add an AI agent to your Blink.new app",
        exact: true,
      })
      .getByText("Prompt copied to clipboard", { exact: true })
  ).toHaveText("Prompt copied to clipboard")

  const hero = main.getByRole("region", {
    name: "Add an AI agent to your Blink.new app",
    exact: true,
  })
  const heroArtwork = hero.locator("img").first()
  await expect(heroArtwork).toHaveAttribute("src", /app-hero\.[\w.~+-]+\.webp/)
  await expect(
    hero.getByText("Built with Blink.new", { exact: true })
  ).toBeVisible()
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

test("renders every supplied Figma hero and builder-aware CTA variant", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "One desktop project covers the registry-backed static hero variants"
  )

  for (const [slug, title, ctaTitle] of figmaHeroVariants) {
    await gotoCriticalPage(page, `/channels/web-chat/${slug}`)
    const hero = page.getByRole("region", { name: title, exact: true })
    const artwork = hero.locator("img").first()
    const cta = page.locator("section.cta")
    const channels = page.getByRole("region", {
      name: "One workflow, every channel",
      exact: true,
    })
    const artworkMessage = channelArtworkMessages[slug]

    await expect(hero.getByRole("heading", { level: 1 })).toHaveText(title)
    await expect(cta.getByRole("heading", { level: 2 })).toHaveText(ctaTitle)
    await expect(page.getByRole("main")).not.toContainText("Webflow")
    await expect(
      channels.getByText(artworkMessage, { exact: true })
    ).toBeVisible()
    await expect(
      channels.getByRole("img", { name: artworkMessage, exact: true })
    ).toHaveAttribute("src", /channels-mascot\.[\w-]+\.png/)
    // One plate per kind now; the builder is named by the badge over it.
    const { hero: heroCopy, media } = getWebChatBuilderBySlug(slug)!

    await expect(artwork).toHaveAttribute(
      "src",
      new RegExp(`${media.hero}\\.[\\w.~+-]+\\.webp`)
    )
    await expect(
      hero.getByText(heroCopy.badge.label, { exact: true })
    ).toBeVisible()
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
  await gotoCriticalPage(page, "/channels/web-chat/blink-new")
  const cta = page.locator("section.cta")
  await expect(cta).toHaveCount(1)
  await expect(cta.getByRole("heading", { level: 2 })).toHaveText(
    "Give your Blink.new app an AI agent"
  )
  await expect(
    cta.getByText(
      "Bring the agent you built. Novu puts it in your Blink.new app and reaches your users on every channel from one workflow.",
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
  await expect(
    cta.getByText("npx novu connect --channel web-chat", { exact: true })
  ).toBeVisible()
  const copy = cta.getByRole("button", {
    name: "Copy to clipboard",
    exact: true,
  })
  const prompt = cta.getByRole("button", { name: "Copy prompt", exact: true })
  await expect(prompt).toHaveCSS("background-color", "rgb(255, 255, 255)")
  await expect(prompt).toHaveCSS("color", "rgb(0, 0, 0)")
  await expect(cta.locator("video")).toHaveCount(1)
  await expectReactHandlerReady(copy, "onClick")
  await copy.focus()
  await page.keyboard.press("Enter")
  await expectClipboardText(page, "npx novu connect --channel web-chat")
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
    "Your agent, live in your Blink.new app",
    "How to add an AI agent to your Blink.new app in four steps",
    "One workflow, every channel",
    "Frequently asked questions",
    "Give your Blink.new app an AI agent",
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
  request,
}) => {
  const applicationErrors = observeApplicationErrors(page)
  await installClipboardMock(page)
  await gotoCriticalPage(page, "/channels/web-chat/blink-new")

  const section = page.getByRole("region", {
    name: "One workflow, every channel",
  })
  await expect(section.getByRole("heading", { level: 2 })).toHaveText(
    "One workflow, every channel"
  )
  await expect(
    section.getByText(
      "Your agent’s logic works across your Blink.new app and every channel. Novu handles delivery through one workflow. Run the command to connect Web Chat.",
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
  for (const [channel, href] of [
    ["Telegram", "/channels/telegram/"],
    ["MS Teams", "/channels/microsoft-teams/"],
    ["Email", "/channels/email/"],
    ["WhatsApp", "/channels/whatsapp/"],
    ["Slack", "/channels/slack/"],
    ["iMessage", "/channels/imessage/"],
  ]) {
    const link = section.getByRole("link", { name: channel, exact: true })
    await expect(link).toHaveAttribute("href", href)
    const response = await request.get(href)
    expect(response.ok(), `${href} should resolve`).toBe(true)
  }
  // The Web Chat channel page ships separately, so that tile stays unlinked.
  await expect(
    section.getByRole("link", { name: "Web Chat", exact: true })
  ).toHaveCount(0)
  const channelsArtwork = section.getByRole("img", {
    name: "Your Blink.new app is just the beginning!",
  })
  await expect(
    section.getByText("Your Blink.new app is just the beginning!", {
      exact: true,
    })
  ).toBeVisible()
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

  // The copy control precedes the channel links, which precede the hint in the
  // actual keyboard tab order. Web Chat has no page yet, so it is not in it.
  await copyCommand.focus()
  for (const channel of [
    "Telegram",
    "MS Teams",
    "Email",
    "WhatsApp",
    "Slack",
    "iMessage",
  ]) {
    await page.keyboard.press("Tab")
    await expect(
      section.getByRole("link", { name: channel, exact: true })
    ).toBeFocused()
  }
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
  await gotoCriticalPage(page, "/channels/web-chat/blink-new")
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

test("centers the hero copy and actions on tablet widths", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1112 })
  const applicationErrors = observeApplicationErrors(page)
  await gotoCriticalPage(page, "/channels/web-chat/blink-new")

  const hero = page.getByRole("region", {
    name: "Add an AI agent to your Blink.new app",
    exact: true,
  })
  const heading = page.locator("#web-chat-builder-title")
  const eyebrow = hero.getByText("Web Chat for Blink.new", { exact: true })
  const description = hero.getByText(
    "Bring your AI agent to Blink.new with one embed. Chat with users and reach them across messaging channels and email through one workflow. Your agent’s channel, not a generic widget.",
    { exact: true }
  )
  const prompt = hero.getByRole("button", { name: "Copy Prompt", exact: true })

  const viewportCenter = 834 / 2
  for (const element of [heading, description]) {
    expect(
      await element.evaluate((node) => getComputedStyle(node).textAlign),
      `${await element.textContent()} should be centered`
    ).toBe("center")
  }
  expect(
    await eyebrow.evaluate((node) => getComputedStyle(node).justifyContent)
  ).toBe("center")
  for (const element of [heading, description]) {
    const box = (await element.boundingBox())!
    expect(
      Math.abs(box.x + box.width / 2 - viewportCenter)
    ).toBeLessThanOrEqual(1)
  }
  // The prompt button and the command sit on one row, centered as a group.
  const actionsCenter = await prompt.evaluate((node) => {
    const edges = Array.from(node.parentElement!.children).map((child) =>
      child.getBoundingClientRect()
    )

    return (
      (Math.min(...edges.map(({ left }) => left)) +
        Math.max(...edges.map(({ right }) => right))) /
      2
    )
  })
  expect(Math.abs(actionsCenter - viewportCenter)).toBeLessThanOrEqual(1)

  // The two-column desktop layout keeps its left alignment.
  await page.setViewportSize({ width: 1440, height: 900 })
  const desktopHeading = (await heading.boundingBox())!
  expect(desktopHeading.x + desktopHeading.width / 2).toBeLessThan(
    1440 / 2 - 100
  )
  expectHealthyPage(applicationErrors)
})

test("matches the shared Webflow Figma section geometry at 1920px", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "The source Figma frame is a 1920px desktop composition"
  )

  await page.setViewportSize({ width: 1920, height: 1080 })
  await gotoCriticalPage(page, "/channels/web-chat/blink-new")

  const faq = page.locator("#web-chat-builder-faq")
  const faqContainer = faq.locator(":scope > div")
  const faqTitle = faq.getByRole("heading", { level: 2 })
  const accordion = faq.locator('[data-slot="accordion"]')
  const hero = page.getByRole("region", {
    name: "Add an AI agent to your Blink.new app",
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
