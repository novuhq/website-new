import { expect, test } from "@playwright/test"

import { gotoCriticalPage } from "./helpers"

test.describe("notification hero playback", () => {
  test("autoplays the hero without a playback control", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await gotoCriticalPage(page, "/no-reply-is-dead/")

    const video = page.locator("main video").first()
    await expect
      .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
      .toBe(false)
    await expect(
      page.getByRole("button", { name: /hero animation/i })
    ).toHaveCount(0)
  })

  test("keeps the poster static with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await gotoCriticalPage(page, "/no-reply-is-dead/")

    const video = page.locator("main video").first()
    // Check the initial media state to catch autoplay starting before the
    // motion preference has been read.
    expect(
      await video.evaluate((node) => (node as HTMLVideoElement).autoplay)
    ).toBe(false)
    expect(
      await video.evaluate((node) => (node as HTMLVideoElement).paused)
    ).toBe(true)
    expect(
      await video.evaluate((node) => (node as HTMLVideoElement).currentTime)
    ).toBe(0)
    await expect(video).toHaveAttribute("poster", /hero-poster/)
    await expect(
      page.getByRole("button", { name: /hero animation/i })
    ).toHaveCount(0)
  })

  test("stops playback when reduced motion is enabled on the open page", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await gotoCriticalPage(page, "/no-reply-is-dead/")

    const video = page.locator("main video").first()
    await expect
      .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
      .toBe(false)
    await page.emulateMedia({ reducedMotion: "reduce" })
    await expect
      .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
      .toBe(true)
    await expect
      .poll(() =>
        video.evaluate((node) => (node as HTMLVideoElement).currentTime)
      )
      .toBe(0)
  })
})

test("keeps the Microsoft Teams logo at the Figma size on hover", async ({
  page,
}) => {
  await gotoCriticalPage(page, "/no-reply-is-dead/")

  const teamsLink = page.getByRole("link", { name: "Microsoft Teams" })
  await teamsLink.scrollIntoViewIfNeeded()
  const logos = teamsLink.locator("img")
  await expect(logos).toHaveCount(2)

  const expectedSize = (page.viewportSize()?.width ?? 0) >= 1024 ? 28 : 20
  const restingLogo = await logos.nth(0).boundingBox()
  const hoverLogo = await logos.nth(1).boundingBox()
  expect(restingLogo).toMatchObject({
    width: expectedSize,
    height: expectedSize,
  })
  expect(hoverLogo).toMatchObject({
    width: expectedSize,
    height: expectedSize,
  })

  const canHover = await page.evaluate(
    () => window.matchMedia("(hover: hover)").matches
  )
  if (canHover) {
    await teamsLink.hover()
    await expect(logos.nth(1)).toHaveCSS("opacity", "1")
    expect(await logos.nth(0).boundingBox()).toMatchObject({
      width: expectedSize,
      height: expectedSize,
    })
    expect(await logos.nth(1).boundingBox()).toMatchObject({
      width: expectedSize,
      height: expectedSize,
    })
  }
})
