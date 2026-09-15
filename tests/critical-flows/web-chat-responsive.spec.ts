import { expect, test } from "@playwright/test"

import { webChatContract } from "./contracts"
import { gotoCriticalPage } from "./helpers"

test("keeps channel links and bento captions within their responsive layouts", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await gotoCriticalPage(page, webChatContract.route)
  // The lazy live-chat module replaces the initial panel tree on hydration.
  // Its textbox only exists once that replacement has finished.
  await expect(
    page
      .getByTestId("web-chat-hero")
      .getByRole("textbox", { name: "Message the agent" })
  ).toBeVisible()

  for (const width of [320, 390, 639, 640, 768, 1023, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 })
    const panel = page
      .locator('[data-slot="web-chat-panel"]')
      .filter({ visible: true })
      .first()
    // Re-resolve the visible panel if a breakpoint changes during measurement.
    await expect(async () => {
      const panelBox = await panel.boundingBox()
      expect(panelBox).not.toBeNull()
      expect(panelBox!.x).toBeGreaterThanOrEqual(0)
      expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(width)
    }).toPass({ timeout: 10_000 })

    const links = page.locator(
      'main a[aria-label$="connect this channel to your agent"]'
    )
    await expect(links).toHaveCount(6)
    for (const link of await links.all()) {
      const box = await link.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.x, `channel left edge at ${width}px`).toBeGreaterThanOrEqual(
        0
      )
      expect(
        box!.x + box!.width,
        `channel right edge at ${width}px`
      ).toBeLessThanOrEqual(width)
    }

    const clippedCaptions = await page
      .locator("main section h3")
      .evaluateAll((headings) =>
        headings.flatMap((heading) => {
          if (!heading.getBoundingClientRect().width) return []
          const caption = heading.parentElement!
          let card = caption.parentElement
          while (card && getComputedStyle(card).overflow !== "hidden")
            card = card.parentElement
          if (!card) return []
          const text = caption.getBoundingClientRect()
          const frame = card.getBoundingClientRect()
          if (!frame.width) return []
          return text.left < frame.left - 1 ||
            text.right > frame.right + 1 ||
            text.bottom > frame.bottom + 1
            ? [heading.textContent]
            : []
        })
      )
    expect(clippedCaptions, `clipped captions at ${width}px`).toEqual([])

    if (width === 768 || width === 1024) {
      const hero = page.getByTestId("web-chat-hero")
      await expect(hero.locator("h1")).toHaveCSS(
        "font-size",
        width === 768 ? "40px" : "48px"
      )
      const copy = await hero
        .getByRole("button", { name: "Copy Prompt", exact: true })
        .boundingBox()
      const cli = hero
        .getByText("npx novu connect --channel web-chat", { exact: true })
        .filter({ visible: true })
      const cliBox = await cli.boundingBox()
      expect(copy!.x + copy!.width).toBeLessThan(cliBox!.x)
      expect(
        await cli.evaluate((node) => node.scrollWidth <= node.clientWidth)
      ).toBe(true)
      expect((await panel.boundingBox())!.width).toBeCloseTo(285.6, 0)

      const card = (name: string) =>
        page
          .getByRole("heading", { name, exact: true })
          .filter({ visible: true })
          .locator("..")
          .locator("..")
      const oldWidget = (await card("The old chat widget").boundingBox())!
      const webChat = (await card("Web Chat").boundingBox())!
      expect(oldWidget.width).toBe(width === 768 ? 704 : 468)
      expect(webChat.y - oldWidget.y).toBe(width === 768 ? 500 : 0)
      const subscriber = (await card(
        "Connects users to their profiles"
      ).boundingBox())!
      const activity = (await card("Keeps every conversation").boundingBox())!
      expect(subscriber.height).toBe(480)
      expect(activity.y - subscriber.y).toBe(width === 768 ? 500 : 0)
      const order = (await card("Works in your app's context").boundingBox())!
      const actions = (await card("Takes real actions").boundingBox())!
      const render = (await card("Renders your components").boundingBox())!
      expect(actions.y).toBe(order.y)
      expect(render.y - order.y).toBe(width === 768 ? 500 : 0)
      expect(order.height).toBe(width === 768 ? 480 : 448)

      const sideTab = page.getByRole("tab", { name: "Side panel", exact: true })
      await sideTab.focus()
      await page.keyboard.press("ArrowRight")
      await expect(
        page.getByRole("tab", { name: "Full screen", exact: true })
      ).toHaveAttribute("aria-selected", "true")
      const preview = page
        .getByRole("tabpanel", { name: "Full screen", exact: true })
        .locator("img")
      await expect(preview).toBeVisible()
      await expect
        .poll(() =>
          preview.evaluate((image) => (image as HTMLImageElement).currentSrc)
        )
        .toContain(
          width === 768
            ? "surface-full-screen-tablet"
            : "surface-full-screen-laptop"
        )
      expect((await preview.boundingBox())!.height).toBe(
        width === 768 ? 528 : 613
      )
      await page.keyboard.press("ArrowLeft")
      await expect(sideTab).toHaveAttribute("aria-selected", "true")
    }

    if (width < 640) {
      for (const title of [
        "Connects users to their profiles",
        "Keeps every conversation",
      ]) {
        const caption = page
          .getByRole("heading", { name: title, exact: true })
          .locator("..")
        const artwork = caption.locator("..").locator("img").locator("..")
        const captionBox = await caption.boundingBox()
        const artworkBox = await artwork.boundingBox()
        expect(captionBox).not.toBeNull()
        expect(artworkBox).not.toBeNull()
        const gap = captionBox!.y - (artworkBox!.y + artworkBox!.height)
        expect(
          gap,
          `${title}: no blank area before the caption at ${width}px`
        ).toBeGreaterThanOrEqual(-1)
        expect(gap).toBeLessThanOrEqual(1)
      }
    }

    const track = page.locator("[data-wc-logo-track]")
    const box = await track.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width / box!.height).toBeCloseTo(
      width < 1024 ? 320 / 658 : 1280 / 480,
      1
    )
    const center = await track.locator("[data-wc-first]").boundingBox()
    expect(center).not.toBeNull()
    expect((center!.x - box!.x) / box!.width).toBeCloseTo(
      width < 1024 ? 125 / 320 : 97 / 1280,
      2
    )
  }
})
