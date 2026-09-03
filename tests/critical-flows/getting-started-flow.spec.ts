import { expect, test, type Page } from "@playwright/test"

import {
  GETTING_STARTED_FLOW_ASSIGNMENT_EVENT,
  GETTING_STARTED_FLOW_COOKIE_NAME,
  GETTING_STARTED_FLOW_EXPOSED_EVENT,
  GETTING_STARTED_FLOW_SELECTED_EVENT,
  SEGMENT_ANONYMOUS_ID_COOKIE_NAME,
  WEBSITE_CLI_COMMAND_COPIED_EVENT,
  WEBSITE_PROMPT_COPIED_EVENT,
} from "../../src/lib/getting-started-flow-experiment"
import {
  expectClipboardText,
  expectHealthyPage,
  expectReactHandlerReady,
  gotoCriticalPage,
  installClipboardMock,
  observeApplicationErrors,
} from "./helpers"

interface TrackedEvent {
  anonymousId?: string
  event: string
  properties?: Record<string, unknown>
}

async function installAnalyticsRecorder(page: Page) {
  await page.addInitScript(() => {
    const browserState = window as unknown as {
      __NOVU_TEST_ANALYTICS_EVENTS__: TrackedEvent[]
    }

    browserState.__NOVU_TEST_ANALYTICS_EVENTS__ = []
    const nativeFetch = window.fetch

    window.fetch = (...args) => {
      const [input, init] = args

      try {
        const requestUrl = new URL(
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.href
              : input.url,
          window.location.href
        )

        if (
          requestUrl.pathname === "/api/experiments/getting-started-flow/" &&
          typeof init?.body === "string"
        ) {
          const body = JSON.parse(init.body) as TrackedEvent
          browserState.__NOVU_TEST_ANALYTICS_EVENTS__.push(body)
        }
      } catch {
        // The production request still runs; malformed test data is ignored.
      }

      return nativeFetch(...args)
    }
  })
}

async function readTrackedEvents(page: Page): Promise<TrackedEvent[]> {
  return page.evaluate(() => {
    return (
      window as unknown as {
        __NOVU_TEST_ANALYTICS_EVENTS__: TrackedEvent[]
      }
    ).__NOVU_TEST_ANALYTICS_EVENTS__
  })
}

const variantExpectations = [
  { variant: "ui", actionName: "Get started free", actionRole: "link" },
  { variant: "cli", actionName: "Copy to clipboard", actionRole: "button" },
  { variant: "prompt", actionName: "Copy prompt", actionRole: "button" },
] as const

for (const { variant, actionName, actionRole } of variantExpectations) {
  test(`QA can render the ${variant} arm without a flag request`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page)
    await installAnalyticsRecorder(page)
    await gotoCriticalPage(page, `/?gsf=${variant}`)

    await expect(page.locator("html")).toHaveAttribute(
      "data-getting-started-flow",
      variant
    )

    const selectedArm = page.locator(
      `[data-getting-started-flow-variant="${variant}"]`
    )
    await expect(selectedArm).toBeVisible()
    const primaryAction = selectedArm.getByRole(actionRole, {
      name: actionName,
    })
    await expect(primaryAction).toBeVisible()
    await expect(primaryAction).toHaveAttribute(
      "data-click-location",
      "home_hero"
    )

    if (variant !== "ui") {
      const secondarySignup = selectedArm.getByRole("link", {
        name: "Sign up instead",
      })
      await expect(secondarySignup).not.toHaveAttribute(
        "data-getting-started-flow-action"
      )
      await expect(secondarySignup).toHaveAttribute(
        "data-getting-started-flow-signup",
        "true"
      )
    }

    for (const otherVariant of ["baseline", "ui", "cli", "prompt"]) {
      if (otherVariant === variant) continue
      await expect(
        page.locator(`[data-getting-started-flow-variant="${otherVariant}"]`)
      ).toBeHidden()
    }

    await expect
      .poll(async () => {
        const events = await readTrackedEvents(page)
        return events.filter(
          ({ event }) => event === GETTING_STARTED_FLOW_EXPOSED_EVENT
        )
      })
      .toHaveLength(1)

    const [exposure] = (await readTrackedEvents(page)).filter(
      ({ event }) => event === GETTING_STARTED_FLOW_EXPOSED_EVENT
    )
    expect(exposure.properties).toMatchObject({
      assignment_source: "qa",
      getting_started_flow: variant,
      is_qa: true,
      variant,
    })

    const assignmentCookies = (await page.context().cookies()).filter(
      ({ name }) => name === GETTING_STARTED_FLOW_COOKIE_NAME
    )
    expect(assignmentCookies).toEqual([])
    expectHealthyPage(applicationErrors)
  })
}

test("QA assignment does not require the Segment client", async ({ page }) => {
  const applicationErrors = observeApplicationErrors(page)
  await gotoCriticalPage(page, "/?gsf=cli")

  const copyButton = page
    .locator('[data-getting-started-flow-variant="cli"]')
    .getByRole("button", { name: "Copy to clipboard" })
  await expect(copyButton).toBeVisible()
  await expectReactHandlerReady(copyButton, "onClick")

  expectHealthyPage(applicationErrors)
})

test("a production exposure is delivered first-party and renews the assignment", async ({
  page,
}) => {
  await installAnalyticsRecorder(page)
  const persistenceResponse = page.waitForResponse((response) => {
    return (
      response.request().method() === "POST" &&
      new URL(response.url()).pathname ===
        "/api/experiments/getting-started-flow/"
    )
  })

  await gotoCriticalPage(page, "/")

  const response = await persistenceResponse
  expect(response.status()).toBe(204)
  const setCookie = await response.headerValue("set-cookie")
  expect(setCookie).toContain(`${GETTING_STARTED_FLOW_COOKIE_NAME}=`)
  expect(setCookie).toContain(`${SEGMENT_ANONYMOUS_ID_COOKIE_NAME}=`)
  expect(setCookie).toContain("Max-Age=5184000")
  expect(setCookie?.toLowerCase()).toContain("samesite=lax")

  const rootVariant = await page
    .locator("html")
    .getAttribute("data-getting-started-flow")
  expect(["ui", "cli", "prompt"]).toContain(rootVariant)
})

test("an immediate signup keeps its exposure, selection, and anonymous ID", async ({
  page,
}) => {
  await page.route("**/_next/static/chunks/**", async (route) => {
    if (route.request().resourceType() === "script") {
      await route.abort("blockedbyclient")
      return
    }

    await route.continue()
  })
  await installAnalyticsRecorder(page)
  await gotoCriticalPage(page, "/?gsf=ui")
  await page.evaluate(() => {
    document.addEventListener("click", (event) => event.preventDefault())
  })

  const signupLink = page
    .locator('[data-getting-started-flow-variant="ui"]')
    .getByRole("link", { name: "Get started free" })
  await signupLink.click()

  await expect
    .poll(async () => (await readTrackedEvents(page)).map(({ event }) => event))
    .toEqual(
      expect.arrayContaining([
        GETTING_STARTED_FLOW_EXPOSED_EVENT,
        GETTING_STARTED_FLOW_SELECTED_EVENT,
      ])
    )

  const signupHref = await signupLink.getAttribute("href")
  expect(signupHref).not.toBeNull()
  const signupUrl = new URL(signupHref!)
  expect(signupUrl.searchParams.get("product_type")).toBe("agents")
  expect(signupUrl.searchParams.get("ajs_aid")).toBeTruthy()
})

test("a middle-click signup keeps identity and records one selection", async ({
  page,
}) => {
  await installAnalyticsRecorder(page)
  await gotoCriticalPage(page, "/?gsf=ui")

  const signupLink = page
    .locator('[data-getting-started-flow-variant="ui"]')
    .getByRole("link", { name: "Get started free" })
  await signupLink.dispatchEvent("auxclick", { button: 1 })

  const signupHref = await signupLink.getAttribute("href")
  expect(new URL(signupHref!).searchParams.get("ajs_aid")).toBeTruthy()
  await expect
    .poll(async () => {
      return (await readTrackedEvents(page)).filter(
        ({ event }) => event === GETTING_STARTED_FLOW_SELECTED_EVENT
      )
    })
    .toHaveLength(1)
})

for (const copyVariant of [
  {
    copiedEvent: WEBSITE_CLI_COMMAND_COPIED_EVENT,
    name: "Copy to clipboard",
    variant: "cli",
  },
  {
    copiedEvent: WEBSITE_PROMPT_COPIED_EVENT,
    name: "Copy prompt",
    variant: "prompt",
  },
] as const) {
  test(`the ${copyVariant.variant} action works before hydration`, async ({
    page,
  }) => {
    await page.route("**/_next/static/chunks/**", async (route) => {
      if (route.request().resourceType() === "script") {
        await route.abort("blockedbyclient")
        return
      }

      await route.continue()
    })
    await installClipboardMock(page)
    await installAnalyticsRecorder(page)
    await gotoCriticalPage(page, `/?gsf=${copyVariant.variant}`)

    const copyButton = page
      .locator(`[data-getting-started-flow-variant="${copyVariant.variant}"]`)
      .getByRole("button", { name: copyVariant.name })
    const copyValue = await copyButton.getAttribute(
      "data-getting-started-flow-copy-value"
    )
    expect(copyValue).toBeTruthy()

    await copyButton.click()
    await expectClipboardText(page, copyValue!)
    await expect(page.getByRole("status")).toHaveText(
      copyVariant.variant === "cli"
        ? "Command copied to clipboard"
        : "Prompt copied to clipboard"
    )
    await expect
      .poll(() =>
        copyButton.evaluate(
          (button) => getComputedStyle(button, "::after").content
        )
      )
      .toBe('"Copied"')

    await expect
      .poll(async () =>
        (await readTrackedEvents(page)).map(({ event }) => event)
      )
      .toEqual(
        expect.arrayContaining([
          GETTING_STARTED_FLOW_SELECTED_EVENT,
          copyVariant.copiedEvent,
        ])
      )

    const events = await readTrackedEvents(page)
    expect(
      events.filter(
        ({ event }) => event === GETTING_STARTED_FLOW_SELECTED_EVENT
      )
    ).toHaveLength(1)
    expect(
      events.filter(({ event }) => event === copyVariant.copiedEvent)
    ).toHaveLength(1)
  })
}

test("Segment localStorage identity wins when its cookie diverges", async ({
  page,
}) => {
  await page.addInitScript((cookieName) => {
    window.localStorage.setItem(cookieName, JSON.stringify("local-storage-id"))
    document.cookie = `${cookieName}=%22cookie-id%22; Path=/; SameSite=Lax`
  }, SEGMENT_ANONYMOUS_ID_COOKIE_NAME)
  await installAnalyticsRecorder(page)
  await gotoCriticalPage(page, "/?gsf=ui")
  await page.evaluate(() => {
    document.addEventListener("click", (event) => event.preventDefault())
  })

  await expect
    .poll(async () => {
      return (await readTrackedEvents(page)).find(
        ({ event }) => event === GETTING_STARTED_FLOW_EXPOSED_EVENT
      )?.anonymousId
    })
    .toBe("local-storage-id")

  const signupLink = page
    .locator('[data-getting-started-flow-variant="ui"]')
    .getByRole("link", { name: "Get started free" })
  await signupLink.click()

  const signupHref = await signupLink.getAttribute("href")
  expect(new URL(signupHref!).searchParams.get("ajs_aid")).toBe(
    "local-storage-id"
  )
})

test("QA assignment follows client-side query changes", async ({ page }) => {
  await page.addInitScript((assignmentEvent) => {
    const browserState = window as unknown as {
      __NOVU_TEST_ASSIGNMENT_COUNT__: number
    }
    browserState.__NOVU_TEST_ASSIGNMENT_COUNT__ = 0
    window.addEventListener(assignmentEvent, () => {
      browserState.__NOVU_TEST_ASSIGNMENT_COUNT__ += 1
    })
  }, GETTING_STARTED_FLOW_ASSIGNMENT_EVENT)
  await installAnalyticsRecorder(page)
  await gotoCriticalPage(page, "/?gsf=cli")
  await expect(page.locator("html")).toHaveAttribute(
    "data-getting-started-flow",
    "cli"
  )
  await expectReactHandlerReady(
    page
      .locator('[data-getting-started-flow-variant="cli"]')
      .getByRole("button", { name: "Copy to clipboard" }),
    "onClick"
  )
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as unknown as {
              __NOVU_TEST_ASSIGNMENT_COUNT__: number
            }
          ).__NOVU_TEST_ASSIGNMENT_COUNT__
      )
    )
    .toBeGreaterThanOrEqual(2)

  await page.evaluate(() => {
    window.history.pushState(null, "", "?gsf=prompt")
  })

  await expect(page.locator("html")).toHaveAttribute(
    "data-getting-started-flow",
    "prompt"
  )
  await expect(
    page.locator('[data-getting-started-flow-variant="prompt"]')
  ).toBeVisible()
  await expect(
    page.locator('[data-getting-started-flow-variant="cli"]')
  ).toBeHidden()

  await expect
    .poll(async () => {
      const events = await readTrackedEvents(page)
      return events
        .filter(({ event }) => event === GETTING_STARTED_FLOW_EXPOSED_EVENT)
        .map(({ properties }) => properties?.variant)
    })
    .toEqual(["cli", "prompt"])
})

test("an SPA entry records one successful CLI selection", async ({ page }) => {
  await installClipboardMock(page)
  await installAnalyticsRecorder(page)
  await gotoCriticalPage(page, "/pricing/")
  await page.evaluate((cookieName) => {
    document.cookie = `${cookieName}=cli; Path=/; SameSite=Lax`
    ;(window as unknown as Record<string, unknown>).__NOVU_SPA_MARKER__ = true
  }, GETTING_STARTED_FLOW_COOKIE_NAME)

  const homeLink = page.locator('a[href="/"]').first()
  await expectReactHandlerReady(homeLink, "onClick")
  await homeLink.click()
  await expect(page).toHaveURL(/\/$/)
  expect(
    await page.evaluate(
      () => (window as unknown as Record<string, unknown>).__NOVU_SPA_MARKER__
    )
  ).toBe(true)

  const copyButton = page
    .locator('[data-getting-started-flow-variant="cli"]')
    .getByRole("button", { name: "Copy to clipboard" })
  await expectReactHandlerReady(copyButton, "onClick")
  await copyButton.click()

  await expect
    .poll(async () => {
      return (await readTrackedEvents(page)).filter(
        ({ event }) => event === GETTING_STARTED_FLOW_SELECTED_EVENT
      )
    })
    .toHaveLength(1)
})

test("rejected client delivery falls back without an unhandled error", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page)
  await page.addInitScript(() => {
    const browserState = window as unknown as {
      __NOVU_TEST_BEACON_EVENTS__: string[]
    }
    const nativeFetch = window.fetch
    browserState.__NOVU_TEST_BEACON_EVENTS__ = []

    window.fetch = (input, init) => {
      const requestUrl = new URL(
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url,
        window.location.href
      )

      if (requestUrl.pathname === "/api/experiments/getting-started-flow/") {
        return Promise.reject(new Error("forced experiment transport failure"))
      }

      return nativeFetch(input, init)
    }

    Object.defineProperty(navigator, "sendBeacon", {
      configurable: true,
      value: (_url: string | URL, data?: BodyInit | null) => {
        if (data instanceof Blob) {
          void data.text().then((body) => {
            browserState.__NOVU_TEST_BEACON_EVENTS__.push(body)
          })
        }
        return true
      },
    })
  })
  await installClipboardMock(page)
  await gotoCriticalPage(page, "/?gsf=cli")

  const copyButton = page
    .locator('[data-getting-started-flow-variant="cli"]')
    .getByRole("button", { name: "Copy to clipboard" })
  await expectReactHandlerReady(copyButton, "onClick")
  await copyButton.click()

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as unknown as {
              __NOVU_TEST_BEACON_EVENTS__: string[]
            }
          ).__NOVU_TEST_BEACON_EVENTS__.length
      )
    )
    .toBeGreaterThanOrEqual(3)
  expectHealthyPage(applicationErrors)
})

test("successful CLI and prompt copies emit conversion events", async ({
  page,
}) => {
  await installClipboardMock(page)
  await installAnalyticsRecorder(page)

  await gotoCriticalPage(page, "/?gsf=cli")
  const cliCopyButton = page
    .locator('[data-getting-started-flow-variant="cli"]')
    .getByRole("button", { name: "Copy to clipboard" })
  await expectReactHandlerReady(cliCopyButton, "onClick")
  await cliCopyButton.click()

  await expect
    .poll(async () => (await readTrackedEvents(page)).map(({ event }) => event))
    .toEqual(
      expect.arrayContaining([
        GETTING_STARTED_FLOW_SELECTED_EVENT,
        WEBSITE_CLI_COMMAND_COPIED_EVENT,
      ])
    )

  await gotoCriticalPage(page, "/?gsf=prompt")
  const promptCopyButton = page
    .locator('[data-getting-started-flow-variant="prompt"]')
    .getByRole("button", { name: "Copy prompt" })
  await expectReactHandlerReady(promptCopyButton, "onClick")
  await promptCopyButton.click()

  await expect
    .poll(async () => (await readTrackedEvents(page)).map(({ event }) => event))
    .toEqual(
      expect.arrayContaining([
        GETTING_STARTED_FLOW_SELECTED_EVENT,
        WEBSITE_PROMPT_COPIED_EVENT,
      ])
    )
})
