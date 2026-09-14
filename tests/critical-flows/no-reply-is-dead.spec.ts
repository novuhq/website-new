import { expect, test } from "@playwright/test"

import { expectReactHandlerReady, gotoCriticalPage } from "./helpers"

test.describe("notification hero playback", () => {
  test("can pause and resume the autoplaying hero with the keyboard", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await gotoCriticalPage(page, "/no-reply-is-dead/")

    const video = page.locator("main video").first()
    const pause = page.getByRole("button", { name: "Pause hero animation" })
    await expect(pause).toBeVisible()
    await expect
      .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
      .toBe(false)

    await pause.focus()
    await page.keyboard.press("Enter")
    await expect
      .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
      .toBe(true)

    const play = page.getByRole("button", { name: "Play hero animation" })
    await expect(play).toBeFocused()
    const pausedTime = await video.evaluate(
      (node) => (node as HTMLVideoElement).currentTime
    )
    await page.keyboard.press("Space")
    await expect
      .poll(() =>
        video.evaluate((node) => (node as HTMLVideoElement).currentTime)
      )
      .toBeGreaterThan(pausedTime)
    await expect(pause).toBeFocused()
  })

  test("keeps the poster static with reduced motion until explicitly played", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await gotoCriticalPage(page, "/no-reply-is-dead/")

    const video = page.locator("main video").first()
    // Check the initial media state as well as the hydrated control to catch
    // autoplay starting before the motion preference has been read.
    expect(
      await video.evaluate((node) => (node as HTMLVideoElement).autoplay)
    ).toBe(false)
    const play = page.getByRole("button", { name: "Play hero animation" })
    await expectReactHandlerReady(play, "onClick")
    expect(
      await video.evaluate((node) => (node as HTMLVideoElement).paused)
    ).toBe(true)
    expect(
      await video.evaluate((node) => (node as HTMLVideoElement).currentTime)
    ).toBe(0)
    await expect(video).toHaveAttribute("poster", /hero-poster/)

    await play.click()
    await expect
      .poll(() =>
        video.evaluate((node) => (node as HTMLVideoElement).currentTime)
      )
      .toBeGreaterThan(0)
    await expect(
      page.getByRole("button", { name: "Pause hero animation" })
    ).toBeVisible()
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
    await expect(
      page.getByRole("button", { name: "Play hero animation" })
    ).toBeVisible()
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
