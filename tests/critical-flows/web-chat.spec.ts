import { expect, test, type Page } from "@playwright/test"

import { webChatContract } from "./contracts"
import {
  expectHealthyPage,
  gotoCriticalPage,
  observeApplicationErrors,
} from "./helpers"

const PREVIEW_ROUTE = "**/api/agent-preview"

/**
 * `HeroProductUI` and `HeroAgentPanel` each mount a desktop tree and a
 * separate compact/mobile tree side by side (one CSS-hidden via
 * `hidden md:flex` / `md:hidden`, never removed from the DOM) so a single
 * Playwright project only ever has ONE of the two visible at a time — the
 * other is present but `display:none`. Scoping to `data-testid="web-chat-hero"`
 * alone still resolves both trees' matching nodes (strict-mode counts
 * hidden elements too), so every hero locator here also filters to the
 * visible one. This is what the final review's "Data sources" (4 elements)
 * and "firstMessage" (2 elements) collisions were: not page-wide duplicates,
 * but the hero's own desktop+compact trees both mounted at once.
 */
function heroTableTitle(page: Page) {
  return page
    .getByTestId("web-chat-hero")
    .getByTestId("hero-table-title")
    .filter({ visible: true })
}

function heroMessage(page: Page, text: string) {
  return page
    .getByTestId("web-chat-hero")
    .getByText(text)
    .filter({ visible: true })
}

// The dynamically loaded composer proves the hero has hydrated before typing.
async function openWebChat(page: Page) {
  await gotoCriticalPage(page, webChatContract.route)
  await expect(
    page
      .getByTestId("web-chat-hero")
      .getByRole("textbox", { name: "Message the agent" })
  ).toBeVisible()
}

test.describe("web chat personalizer", () => {
  test("scopes personalization to the hero, leaving the sections below it", async ({
    page,
  }) => {
    const errors = observeApplicationErrors(page)
    await page.route(PREVIEW_ROUTE, (route) =>
      route.fulfill({
        json: {
          brand: {
            domain: webChatContract.domain,
            accent: webChatContract.accent,
            logo: null,
          },
        },
      })
    )
    await openWebChat(page)

    // The two bento sections read `--wc-accent-soft` directly, so they need a
    // definition in scope even though they never restyle. The page root
    // supplies the default theme; the provider overrides it inside the hero.
    const root = page.locator("main div.overflow-clip").first()
    const hero = page.getByTestId("web-chat-hero")
    const bentoGlow = page.locator('div[class*="blur-[90px]"]').first()

    await expect(root).toHaveCSS("--wc-accent", "#c25cd6")
    await expect(bentoGlow).toHaveCSS("--wc-accent-soft", "#c25cd61f")
    await expect(bentoGlow).toHaveCSS("opacity", "0")

    await page
      .getByRole("textbox", { name: "Your website URL" })
      .fill(webChatContract.domain)
    await page
      .getByRole("button", { name: webChatContract.submitLabel })
      .click()

    // The hero takes the brand...
    await expect(hero).toHaveCSS("--wc-accent", webChatContract.accent)
    await expect(heroMessage(page, webChatContract.firstMessage)).toBeVisible()

    // ...and nothing below it does. The bentos' accent glow stays off because
    // it is gated on a `data-wc-state` ancestor they no longer have.
    await expect(root).toHaveCSS("--wc-accent", "#c25cd6")
    await expect(bentoGlow).toHaveCSS("--wc-accent-soft", "#c25cd61f")
    await expect(bentoGlow).toHaveCSS("opacity", "0")
    await expect(
      page.locator("[data-wc-state]").locator('div[class*="blur-[90px]"]')
    ).toHaveCount(0)

    expectHealthyPage(errors)
  })

  test("keeps the extracted identity when a website has no accent color", async ({
    page,
  }) => {
    const logo =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4="
    await page.route(PREVIEW_ROUTE, (route) =>
      route.fulfill({
        json: { brand: { domain: "todesktop.com", accent: null, logo } },
      })
    )
    await openWebChat(page)
    await page
      .getByRole("textbox", { name: "Your website URL" })
      .fill("todesktop.com")
    await page
      .getByRole("button", { name: webChatContract.submitLabel })
      .click()

    await expect(page.locator("[data-wc-state]")).toHaveAttribute(
      "data-wc-state",
      "personalized"
    )
    await expect(heroMessage(page, "todesktop.com").first()).toBeVisible()
    await expect(page.locator("[data-wc-state]")).toHaveCSS(
      "--wc-accent",
      "#c25cd6"
    )
    await expect(
      page
        .getByRole("status")
        .filter({ hasText: webChatContract.fallbackAlert })
    ).toBeHidden()
    await expect(heroMessage(page, webChatContract.firstMessage)).toBeVisible()
    // The sidebar is desktop-only; verify the actual extracted logo when shown.
    const sidebarLogo = page
      .getByTestId("web-chat-hero")
      .locator(`img[src="${logo}"]`)
    await expect(sidebarLogo.first()).toHaveAttribute("src", logo)
  })

  test("restores the live message composer after resetting a preview", async ({
    page,
  }) => {
    await page.route(PREVIEW_ROUTE, (route) =>
      route.fulfill({
        json: {
          brand: { domain: "recent.dev", accent: "#e65006", logo: null },
        },
      })
    )
    await openWebChat(page)
    const composer = page
      .getByTestId("web-chat-hero")
      .getByRole("textbox", { name: "Message the agent" })
    await expect(composer).toBeVisible()
    await page
      .getByRole("textbox", { name: "Your website URL" })
      .fill("recent.dev")
    await page
      .getByRole("button", { name: webChatContract.submitLabel })
      .click()
    await expect(heroTableTitle(page)).toHaveText(
      webChatContract.personalizedTableTitle
    )
    await expect(composer).toBeHidden()
    await page.getByRole("button", { name: "Reset personalization" }).click()
    await expect(composer).toBeVisible()
    await expect(heroTableTitle(page)).toHaveText(
      webChatContract.defaultTableTitle
    )
  })

  test(`[${webChatContract.id}] personalizes the hero and plays the conversation`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)

    await page.route(PREVIEW_ROUTE, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          brand: {
            url: `https://${webChatContract.domain}`,
            domain: webChatContract.domain,
            name: "Recent",
            description: "",
            accent: webChatContract.accent,
            logo: null,
          },
        }),
      })
    )

    await openWebChat(page)

    await expect(
      page.getByRole("heading", { level: 1, name: webChatContract.heading })
    ).toBeVisible()
    // Pre-submit: the hero's table title must read the DEFAULT string. This
    // is the same locator the post-submit assertion below uses — if
    // personalization silently no-ops, this test now fails here too, not
    // just pass through on a stale duplicate match.
    await expect(heroTableTitle(page)).toHaveText(
      webChatContract.defaultTableTitle
    )

    await page
      .getByRole("textbox", { name: /site|domain|url/i })
      .fill(webChatContract.domain)
    await page
      .getByRole("button", { name: webChatContract.submitLabel })
      .click()

    // The real personalization signal: the hero table's *title* flips from
    // "Data sources" to "Form submissions". Unlike the row text "Form
    // submissions" (which is already present pre-submit as row 2 of
    // `HERO_TABLE_DEFAULT` in src/data/pages/web-chat.ts), the table TITLE
    // genuinely does not exist anywhere in the DOM until personalization
    // flips it — so this assertion is false pre-submit and would stay false
    // (timing out) if personalization broke.
    await expect(heroTableTitle(page)).toHaveText(
      webChatContract.personalizedTableTitle
    )
    await expect(heroMessage(page, webChatContract.firstMessage)).toBeVisible()

    const accent = await page
      .locator("[data-wc-state]")
      .first()
      .evaluate((node) =>
        getComputedStyle(node).getPropertyValue("--wc-accent").trim()
      )
    expect(accent).toBe(webChatContract.accent)

    expectHealthyPage(applicationErrors)
  })

  test(`[${webChatContract.id}] keeps the default theme and still animates when extraction fails`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)

    await page.route(PREVIEW_ROUTE, (route) =>
      route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({
          error: true,
          message: "Could not read that site",
        }),
      })
    )

    await openWebChat(page)

    await page
      .getByRole("textbox", { name: /site|domain|url/i })
      .fill(webChatContract.domain)
    await page
      .getByRole("button", { name: webChatContract.submitLabel })
      .click()

    await expect(
      page
        .getByRole("status")
        .filter({ hasText: webChatContract.fallbackAlert })
    ).toBeVisible()

    // The spec is explicit: a personalization failure must not block the animation.
    await expect(heroMessage(page, webChatContract.firstMessage)).toBeVisible()

    expectHealthyPage(applicationErrors)
  })

  test(`[${webChatContract.id}] reset returns the hero to its default state`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)

    await page.route(PREVIEW_ROUTE, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          brand: {
            url: `https://${webChatContract.domain}`,
            domain: webChatContract.domain,
            name: "Recent",
            description: "",
            accent: webChatContract.accent,
            logo: null,
          },
        }),
      })
    )

    await openWebChat(page)

    await page
      .getByRole("textbox", { name: /site|domain|url/i })
      .fill(webChatContract.domain)
    await page
      .getByRole("button", { name: webChatContract.submitLabel })
      .click()
    await expect(heroTableTitle(page)).toHaveText(
      webChatContract.personalizedTableTitle
    )

    await page.getByRole("button", { name: /reset/i }).click()

    await expect(heroTableTitle(page)).toHaveText(
      webChatContract.defaultTableTitle
    )
    await expect(heroMessage(page, webChatContract.firstMessage)).toBeHidden()

    expectHealthyPage(applicationErrors)
  })

  test(`[${webChatContract.id}] configurator switches result and action together`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)

    await openWebChat(page)

    // §8's configurator has its own "Copy prompt" button whose accessible
    // name differs from the hero's "Copy Prompt" only by case — Playwright's
    // default role-name match is case-insensitive, so an unscoped query
    // matches both. Scoping to the section root (and using `exact: true`
    // as a second, independent guard) makes this unambiguous.
    const configurator = page.getByTestId("web-chat-configurator")

    await expect(
      configurator.getByRole("heading", {
        name: webChatContract.configuratorHeading,
      })
    ).toBeVisible()

    await expect(
      configurator.getByRole("button", {
        name: webChatContract.configuratorCopyPrompt,
        exact: true,
      })
    ).toBeVisible()

    await configurator
      .getByRole("tab", { name: webChatContract.configuratorCliTab })
      .click()

    await expect(
      configurator.getByText(webChatContract.configuratorCommand)
    ).toBeVisible()
    await expect(
      configurator.getByRole("button", {
        name: webChatContract.configuratorCopyCli,
      })
    ).toBeVisible()
    await expect(
      configurator.getByRole("button", {
        name: webChatContract.configuratorCopyPrompt,
        exact: true,
      })
    ).toBeHidden()

    expectHealthyPage(applicationErrors)
  })
})
