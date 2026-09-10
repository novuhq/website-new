import { expect, test, type Locator, type Page } from "@playwright/test"

import { webChatContract } from "./contracts"
import {
  expectHealthyPage,
  gotoCriticalPage,
  observeApplicationErrors,
} from "./helpers"

const FRAMEWORKS = [
  "Chat SDK & Vercel",
  "Claude",
  "AWS",
  "Custom code",
  "LangChain",
]
const STEP_MS = 3_700
const CYCLE_MS = STEP_MS * FRAMEWORKS.length

async function openTrack(page: Page) {
  await gotoCriticalPage(page, webChatContract.route)
  const track = page.locator("[data-wc-logo-track]").filter({ visible: true })
  await expect(track).toHaveCount(1)
  await track.scrollIntoViewIfNeeded()
  await expect(track.locator("[data-wc-framework]")).toHaveCount(5)
  return track
}

// Seek the actual CSS animations, including each logo's corner marks, on one
// shared clock. Negative CSS delays retain their phase offsets when seeking.
async function sample(track: Locator, time?: number) {
  return track.evaluate((node, currentTime) => {
    const animations = node.getAnimations({ subtree: true })
    if (currentTime !== undefined) {
      for (const animation of animations) {
        animation.pause()
        animation.currentTime = currentTime
      }
    }
    const bounds = node.getBoundingClientRect()
    return {
      animationCount: animations.length,
      logos: [...node.querySelectorAll<HTMLElement>("[data-wc-framework]")].map(
        (logo) => {
          const rect = logo.getBoundingClientRect()
          const style = getComputedStyle(logo)
          return {
            name: logo.dataset.wcFramework,
            opacity: Number(style.opacity),
            cornerOpacity: Number(
              getComputedStyle(logo.querySelector(".wc-flc-corners")!).opacity
            ),
            x: (rect.left - bounds.left) / bounds.width,
            y: (rect.top - bounds.top) / bounds.height,
            width: rect.width / bounds.width,
            height: rect.height / bounds.height,
          }
        }
      ),
    }
  }, time)
}

type Snapshot = Awaited<ReturnType<typeof sample>>

function expectSeparatedLogos(snapshot: Snapshot) {
  const visible = snapshot.logos.filter((logo) => logo.opacity > 0.05)
  for (let index = 0; index < visible.length; index++) {
    const a = visible[index]
    for (const b of visible.slice(index + 1)) {
      const overlapX =
        Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
      const overlapY =
        Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)
      expect(
        overlapX <= 0 || overlapY <= 0,
        `${a.name} overlaps ${b.name}`
      ).toBe(true)
    }
  }
}

test.describe("web chat ACI framework track", () => {
  test("moves the incoming, centered, and outgoing logos through every framework", async ({
    page,
  }) => {
    const errors = observeApplicationErrors(page)
    await page.emulateMedia({ reducedMotion: "no-preference" })
    const track = await openTrack(page)
    const mobile = await page.evaluate(
      () => matchMedia("(max-width: 767px)").matches
    )
    const first = await sample(track, 1_000)
    expect(first.animationCount).toBeGreaterThan(0)

    for (let step = 0; step < FRAMEWORKS.length; step++) {
      const held = await sample(track, step * STEP_MS + 1_000)
      const centered = held.logos.filter((logo) => logo.opacity > 0.9)
      expect(centered.map((logo) => logo.name)).toEqual([FRAMEWORKS[step]])
      const outer = held.logos.filter(
        (logo) => logo.opacity > 0.05 && logo.opacity < 0.9
      )
      expect(outer).toHaveLength(2)
      for (const logo of outer) expect(logo.opacity).toBeCloseTo(0.4, 2)

      const center = centered[0]
      expect(center.cornerOpacity).toBe(1)
      const incoming = held.logos.find(
        (logo) => logo.name === FRAMEWORKS[(step + 1) % FRAMEWORKS.length]
      )!
      const outgoing = held.logos.find(
        (logo) =>
          logo.name ===
          FRAMEWORKS[(step + FRAMEWORKS.length - 1) % FRAMEWORKS.length]
      )!
      if (mobile) {
        expect(incoming.x + incoming.width).toBeLessThan(center.x)
        expect(outgoing.x).toBeGreaterThan(center.x + center.width)
      } else {
        expect(incoming.y + incoming.height).toBeLessThan(center.y)
        expect(outgoing.y).toBeGreaterThan(center.y + center.height)
      }
      expectSeparatedLogos(held)

      const endOfHold = await sample(track, step * STEP_MS + 2_900)
      for (const logo of [incoming, center, outgoing]) {
        const still = endOfHold.logos.find(
          (candidate) => candidate.name === logo.name
        )!
        expect(still.x).toBeCloseTo(logo.x, 3)
        expect(still.y).toBeCloseTo(logo.y, 3)
        expect(still.opacity).toBeCloseTo(logo.opacity, 3)
      }

      const moving = await sample(track, step * STEP_MS + 3_350)
      for (const logo of [incoming, center, outgoing]) {
        const moved = moving.logos.find(
          (candidate) => candidate.name === logo.name
        )!
        if (mobile) expect(moved.x).toBeGreaterThan(logo.x + 0.01)
        else expect(moved.y).toBeGreaterThan(logo.y + 0.01)
        expect(moved.cornerOpacity).toBe(1)
      }
      // Check the entire handoff, rather than just its beginning and end, so
      // a stationary fallback behind the entering logo cannot go unnoticed.
      for (const offset of [3_050, 3_200, 3_350, 3_500, 3_650]) {
        expectSeparatedLogos(await sample(track, step * STEP_MS + offset))
      }
    }

    const wrapped = await sample(track, CYCLE_MS + 1_000)
    for (const logo of first.logos) {
      const repeated = wrapped.logos.find(
        (candidate) => candidate.name === logo.name
      )!
      expect(repeated.x).toBeCloseTo(logo.x, 3)
      expect(repeated.y).toBeCloseTo(logo.y, 3)
      expect(repeated.opacity).toBeCloseTo(logo.opacity, 3)
    }
    expectHealthyPage(errors)
  })

  test("reduced motion shows one stationary logo in the center", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    const track = await openTrack(page)
    const snapshot = await sample(track)
    expect(snapshot.animationCount).toBe(0)
    expect(snapshot.logos.filter((logo) => logo.opacity > 0)).toHaveLength(1)
    const center = snapshot.logos.find((logo) => logo.opacity > 0)!
    expect(center.name).toBe(FRAMEWORKS[0])
    expect(center.opacity).toBe(1)
    expect(center.cornerOpacity).toBe(1)

    // Switching the preference at runtime also cancels motion without waiting
    // for a reload or a client-side state update.
    await page.emulateMedia({ reducedMotion: "no-preference" })
    const animated = await sample(track, 1_000)
    const animatedCenter = animated.logos.find((logo) => logo.opacity > 0.9)!
    expect(center.x).toBeCloseTo(animatedCenter.x, 3)
    expect(center.y).toBeCloseTo(animatedCenter.y, 3)
    await page.emulateMedia({ reducedMotion: "reduce" })
    expect((await sample(track)).animationCount).toBe(0)
  })

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false })

    test("server-rendered logos retain their CSS motion and section copy", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" })
      const track = await openTrack(page)
      await expect(
        page.getByRole("heading", { name: "Deploy the ACI, not just chat" })
      ).toBeVisible()
      const first = await sample(track, 1_000)
      const next = await sample(track, STEP_MS + 1_000)
      expect(first.animationCount).toBeGreaterThan(0)
      expect(first.logos.find((logo) => logo.opacity > 0.9)?.name).toBe(
        FRAMEWORKS[0]
      )
      expect(next.logos.find((logo) => logo.opacity > 0.9)?.name).toBe(
        FRAMEWORKS[1]
      )
    })
  })
})
