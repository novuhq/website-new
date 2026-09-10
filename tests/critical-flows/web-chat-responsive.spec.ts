import { expect, test } from "@playwright/test"

import { webChatContract } from "./contracts"
import { gotoCriticalPage } from "./helpers"

test("keeps channel links and bento captions within their responsive layouts", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await gotoCriticalPage(page, webChatContract.route)

  for (const width of [320, 390, 639, 640, 768, 1023, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    const panel = page
      .locator('[data-slot="web-chat-panel"]')
      .filter({ visible: true })
      .first()
    const panelBox = await panel.boundingBox()
    expect(panelBox).not.toBeNull()
    expect(panelBox!.x).toBeGreaterThanOrEqual(0)
    expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(width)

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
