import { expect, test, type Page, type Request } from "@playwright/test"

import {
  GETTING_STARTED_FLOW_ASSIGNMENT_EVENT,
  GETTING_STARTED_FLOW_COOKIE_NAME,
  GETTING_STARTED_FLOW_EXPOSED_EVENT,
  GETTING_STARTED_FLOW_PREHYDRATION_COPIED_ATTRIBUTE,
  GETTING_STARTED_FLOW_READY_ATTRIBUTE,
  GETTING_STARTED_FLOW_SELECTED_EVENT,
  SEGMENT_ANONYMOUS_ID_COOKIE_NAME,
  WEBSITE_CLI_COMMAND_COPIED_EVENT,
  WEBSITE_PROMPT_COPIED_EVENT,
} from "../../src/lib/getting-started-flow-experiment"
import { gettingStartedFlowExperimentContract } from "./contracts"
import {
  blockThirdPartyScripts,
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
  messageId?: string
  properties?: Record<string, unknown>
  timestamp?: string
}

const trackedEventsByPage = new WeakMap<Page, TrackedEvent[]>()
const attemptedEventsByPage = new WeakMap<Page, TrackedEvent[]>()
const beaconEventsByPage = new WeakMap<Page, TrackedEvent[]>()

function readRequestEvent(request: Request): TrackedEvent | null {
  if (
    request.method() !== "POST" ||
    new URL(request.url()).pathname !== "/api/experiments/getting-started-flow/"
  ) {
    return null
  }

  const body = request.postData()
  if (!body) return null

  try {
    return JSON.parse(body) as TrackedEvent
  } catch {
    return null
  }
}

async function installAnalyticsRecorder(page: Page) {
  const trackedEvents: TrackedEvent[] = []
  const attemptedEvents: TrackedEvent[] = []
  const beaconEvents: TrackedEvent[] = []
  const deliveredMessageIds = new Set<string>()
  const pendingBeaconEvents: TrackedEvent[] = []
  const completedBodylessResponses: boolean[] = []
  trackedEventsByPage.set(page, trackedEvents)
  attemptedEventsByPage.set(page, attemptedEvents)
  beaconEventsByPage.set(page, beaconEvents)

  const recordAttempt = (event: TrackedEvent) => {
    if (
      event.messageId &&
      attemptedEvents.some(({ messageId }) => messageId === event.messageId)
    ) {
      return
    }
    attemptedEvents.push(event)
  }
  const recordDelivery = (event: TrackedEvent) => {
    if (event.messageId && deliveredMessageIds.has(event.messageId)) return
    if (event.messageId) deliveredMessageIds.add(event.messageId)
    trackedEvents.push(event)
  }

  await page.exposeFunction(
    "__NOVU_TEST_RECORD_BEACON_ATTEMPT__",
    (body: string, queued: boolean) => {
      let event: TrackedEvent
      try {
        event = JSON.parse(body) as TrackedEvent
      } catch {
        return
      }

      beaconEvents.push(event)
      recordAttempt(event)
      if (!queued) return
      if (event.messageId && deliveredMessageIds.has(event.messageId)) return

      const completed = completedBodylessResponses.shift()
      if (completed === undefined) {
        pendingBeaconEvents.push(event)
      } else if (completed) {
        recordDelivery(event)
      }
    }
  )
  await page.addInitScript(() => {
    const nativeSendBeacon = navigator.sendBeacon.bind(navigator)
    const browserWindow = window as unknown as {
      __NOVU_TEST_RECORD_BEACON_ATTEMPT__: (
        body: string,
        queued: boolean
      ) => Promise<void>
    }

    Object.defineProperty(navigator, "sendBeacon", {
      configurable: true,
      value: (url: string | URL, data?: BodyInit | null) => {
        const queued = nativeSendBeacon(url, data)
        if (!(data instanceof Blob)) return queued

        try {
          const requestUrl = new URL(String(url), window.location.href)
          if (
            requestUrl.pathname === "/api/experiments/getting-started-flow/"
          ) {
            void data.text().then((body) => {
              void browserWindow.__NOVU_TEST_RECORD_BEACON_ATTEMPT__(
                body,
                queued
              )
            })
          }
        } catch {
          // The native beacon remains queued; malformed test data is ignored.
        }

        return queued
      },
    })
  })
  page.on("request", (request) => {
    const event = readRequestEvent(request)
    if (event) recordAttempt(event)
  })
  page.on("response", (response) => {
    const request = response.request()
    if (
      request.method() !== "POST" ||
      new URL(request.url()).pathname !==
        "/api/experiments/getting-started-flow/"
    ) {
      return
    }

    const event = readRequestEvent(request)
    if (event) {
      const pendingIndex = pendingBeaconEvents.findIndex(
        ({ messageId }) => messageId === event.messageId
      )
      if (pendingIndex !== -1) pendingBeaconEvents.splice(pendingIndex, 1)
      if (response.ok()) recordDelivery(event)
      return
    }

    const pendingBeacon = pendingBeaconEvents.shift()
    if (pendingBeacon) {
      if (response.ok()) recordDelivery(pendingBeacon)
    } else {
      completedBodylessResponses.push(response.ok())
    }
  })
}

async function readTrackedEvents(page: Page): Promise<TrackedEvent[]> {
  return trackedEventsByPage.get(page) ?? []
}

async function readAttemptedEvents(page: Page): Promise<TrackedEvent[]> {
  return attemptedEventsByPage.get(page) ?? []
}

async function readBeaconEvents(page: Page): Promise<TrackedEvent[]> {
  return beaconEventsByPage.get(page) ?? []
}

const variantExpectations = [
  {
    variant: "ui",
    action: gettingStartedFlowExperimentContract.primaryActionByVariant.ui,
    actionName: "Get started free",
    actionRole: "link",
  },
  {
    variant: "cli",
    action: gettingStartedFlowExperimentContract.primaryActionByVariant.cli,
    actionName: "Copy to clipboard",
    actionRole: "button",
  },
  {
    variant: "prompt",
    action: gettingStartedFlowExperimentContract.primaryActionByVariant.prompt,
    actionName: "Copy prompt",
    actionRole: "button",
  },
] as const

for (const { variant, action, actionName, actionRole } of variantExpectations) {
  test(`QA can render the ${variant} arm without a flag request`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page, {
      includeConsoleErrors: true,
    })
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
    await expect(primaryAction).toHaveAttribute(
      "data-getting-started-flow-action",
      action
    )
    expect((await primaryAction.boundingBox())?.height).toBeGreaterThanOrEqual(
      44
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
      expect(
        (await secondarySignup.boundingBox())?.height
      ).toBeGreaterThanOrEqual(44)
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
  const applicationErrors = observeApplicationErrors(page, {
    includeConsoleErrors: true,
  })
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
  test.skip(
    process.env.GETTING_STARTED_FLOW_EXPERIMENT_ENABLED === "false",
    "Production experiment is explicitly disabled"
  )
  const applicationErrors = observeApplicationErrors(page, {
    includeConsoleErrors: true,
  })
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
  expectHealthyPage(applicationErrors)
})

for (const { variant, action, actionName } of variantExpectations) {
  test(`the pre-paint ${variant} arm works without application chunks`, async ({
    page,
  }) => {
    const applicationErrors = observeApplicationErrors(page, {
      includeConsoleErrors: true,
    })
    await page.route("**/_next/static/chunks/**", async (route) => {
      if (route.request().resourceType() === "script") {
        await route.abort("blockedbyclient")
        return
      }

      await route.continue()
    })
    await installClipboardMock(page)
    await installAnalyticsRecorder(page)
    await gotoCriticalPage(page, `/?gsf=${variant}`)

    await expect(page.locator("html")).toHaveAttribute(
      "data-getting-started-flow",
      variant
    )
    await expect(page.locator("html")).not.toHaveAttribute(
      GETTING_STARTED_FLOW_READY_ATTRIBUTE,
      ""
    )

    const selectedArm = page.locator(
      `[data-getting-started-flow-variant="${variant}"]`
    )
    await expect(selectedArm).toBeVisible()
    const primaryAction = selectedArm.locator(
      `[data-getting-started-flow-action="${action}"]`
    )
    await expect(primaryAction).toHaveAccessibleName(actionName)

    if (variant === "ui") {
      await page.evaluate(() => {
        window.addEventListener(
          "click",
          (event) => event.preventDefault(),
          true
        )
      })
    }

    const copiedValue = await primaryAction.getAttribute(
      "data-getting-started-flow-copy-value"
    )
    await primaryAction.click()

    if (copiedValue) {
      await expectClipboardText(page, copiedValue)
      await expect(primaryAction).toHaveAccessibleName("Copied")
      await expect(primaryAction.locator("xpath=..")).toContainText(
        /(?:Command|Prompt) copied to clipboard/
      )
    } else {
      expect(
        new URL((await primaryAction.getAttribute("href"))!).searchParams.get(
          "ajs_aid"
        )
      ).toBeTruthy()
    }

    await expect
      .poll(async () =>
        (await readTrackedEvents(page)).map(({ event }) => event)
      )
      .toEqual(
        expect.arrayContaining([
          GETTING_STARTED_FLOW_EXPOSED_EVENT,
          GETTING_STARTED_FLOW_SELECTED_EVENT,
        ])
      )

    if (copiedValue) {
      const diagnosticEvent =
        variant === "cli"
          ? WEBSITE_CLI_COMMAND_COPIED_EVENT
          : WEBSITE_PROMPT_COPIED_EVENT
      const diagnosticProperty = variant === "cli" ? "command" : "prompt"

      await expect
        .poll(async () =>
          (await readTrackedEvents(page)).find(
            ({ event }) => event === diagnosticEvent
          )
        )
        .toMatchObject({
          event: diagnosticEvent,
          properties: { [diagnosticProperty]: copiedValue },
        })
    }

    const bootstrap = page.locator("#getting-started-flow-bootstrap")
    await expect(bootstrap).toHaveAttribute("type", "text/javascript")
    expect((await bootstrap.textContent())?.length).toBeLessThan(8_750)
    expectHealthyPage(applicationErrors)
  })
}

test("the pre-hydration clipboard fallback restores keyboard focus", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page, {
    includeConsoleErrors: true,
  })
  await page.route("**/_next/static/chunks/**", async (route) => {
    if (route.request().resourceType() === "script") {
      await route.abort("blockedbyclient")
      return
    }
    await route.continue()
  })
  await page.addInitScript(() => {
    const browserState = window as unknown as {
      __NOVU_TEST_EXEC_COMMAND_VALUE__: string | null
    }
    browserState.__NOVU_TEST_EXEC_COMMAND_VALUE__ = null
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: (command: string) => {
        const activeElement = document.activeElement
        browserState.__NOVU_TEST_EXEC_COMMAND_VALUE__ =
          activeElement instanceof HTMLTextAreaElement
            ? activeElement.value
            : null
        return command === "copy"
      },
    })
  })
  await installAnalyticsRecorder(page)
  await gotoCriticalPage(page, "/?gsf=cli")

  const copyButton = page.locator(
    '[data-getting-started-flow-variant="cli"] [data-getting-started-flow-action="copy_cli"]'
  )
  await expect(page.locator("html")).not.toHaveAttribute(
    GETTING_STARTED_FLOW_READY_ATTRIBUTE,
    ""
  )
  const copiedValue = await copyButton.getAttribute(
    "data-getting-started-flow-copy-value"
  )
  await copyButton.focus()
  await expect(copyButton).toBeFocused()
  await copyButton.press("Enter")

  await expect(copyButton).toHaveAccessibleName("Copied")
  await expect(copyButton).toBeFocused()
  expect(
    await page.evaluate(
      () =>
        (
          window as unknown as {
            __NOVU_TEST_EXEC_COMMAND_VALUE__: string | null
          }
        ).__NOVU_TEST_EXEC_COMMAND_VALUE__
    )
  ).toBe(copiedValue)
  await expect
    .poll(async () => {
      return (await readTrackedEvents(page)).filter(
        ({ event }) => event === GETTING_STARTED_FLOW_SELECTED_EVENT
      )
    })
    .toHaveLength(1)
  expectHealthyPage(applicationErrors)
})

test("a pre-hydration copy is not replayed after delayed chunks load", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page, {
    includeConsoleErrors: true,
  })
  let releaseChunks = () => {}
  const chunksReleased = new Promise<void>((resolve) => {
    releaseChunks = resolve
  })

  await page.route("**/_next/static/chunks/**", async (route) => {
    if (route.request().resourceType() === "script") {
      await chunksReleased
    }
    await route.continue()
  })
  await installClipboardMock(page)
  await installAnalyticsRecorder(page)
  await blockThirdPartyScripts(page)

  const response = await page.goto("/?gsf=cli", { waitUntil: "commit" })
  expect(response).not.toBeNull()

  const copyButton = page.locator(
    '[data-getting-started-flow-variant="cli"] [data-getting-started-flow-action="copy_cli"]'
  )
  await expect(copyButton).toBeVisible()
  await page.evaluate(() => {
    const browserState = window as unknown as Record<string, unknown>
    browserState.__NOVU_TEST_FALLBACK_CLICK_PROPAGATED__ = false
    document.addEventListener(
      "click",
      () => {
        browserState.__NOVU_TEST_FALLBACK_CLICK_PROPAGATED__ = true
      },
      true
    )

    let resolveClipboard!: () => void
    const clipboardResult = new Promise<void>((resolve) => {
      resolveClipboard = resolve
    })
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => clipboardResult },
    })
    browserState.__NOVU_TEST_RESOLVE_CLIPBOARD__ = resolveClipboard
  })
  await copyButton.click()
  expect(
    await page.evaluate(
      () =>
        (window as unknown as Record<string, unknown>)
          .__NOVU_TEST_FALLBACK_CLICK_PROPAGATED__
    )
  ).toBe(false)

  releaseChunks()
  await page.waitForLoadState("domcontentloaded")
  await expectReactHandlerReady(copyButton, "onClick")
  await expect(copyButton).toHaveAccessibleName("Copy to clipboard")
  await expect(page.locator("html")).toHaveAttribute(
    GETTING_STARTED_FLOW_READY_ATTRIBUTE,
    ""
  )
  await page.evaluate(() => {
    const browserState = window as unknown as {
      __NOVU_TEST_CAPTURE_COPY_TIMER__: boolean
      __NOVU_TEST_COPY_TIMERS__: Array<() => void>
      __NOVU_TEST_RESOLVE_CLIPBOARD__: () => void
    }
    const nativeSetTimeout = window.setTimeout.bind(window)
    browserState.__NOVU_TEST_CAPTURE_COPY_TIMER__ = true
    browserState.__NOVU_TEST_COPY_TIMERS__ = []
    window.setTimeout = ((
      handler: TimerHandler,
      timeout?: number,
      ...args: unknown[]
    ) => {
      if (
        timeout === 2_000 &&
        browserState.__NOVU_TEST_CAPTURE_COPY_TIMER__ &&
        typeof handler === "function"
      ) {
        const callback = handler as (...callbackArgs: unknown[]) => void
        browserState.__NOVU_TEST_COPY_TIMERS__.push(() => callback(...args))
        browserState.__NOVU_TEST_CAPTURE_COPY_TIMER__ = false
        return -browserState.__NOVU_TEST_COPY_TIMERS__.length
      }

      return nativeSetTimeout(handler, timeout, ...args)
    }) as typeof window.setTimeout

    browserState.__NOVU_TEST_RESOLVE_CLIPBOARD__()
  })
  await expect(copyButton).toHaveAccessibleName("Copied")
  await expect
    .poll(() =>
      copyButton.evaluate(
        (element) => getComputedStyle(element, "::after").content
      )
    )
    .toBe('"Copied"')
  await expect
    .poll(async () => {
      return (await readTrackedEvents(page)).filter(
        ({ event }) => event === GETTING_STARTED_FLOW_SELECTED_EVENT
      )
    })
    .toHaveLength(1)
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as unknown as {
              __NOVU_TEST_COPY_TIMERS__: Array<() => void>
            }
          ).__NOVU_TEST_COPY_TIMERS__.length
      )
    )
    .toBe(1)
  await copyButton.click()
  await expect(copyButton).not.toHaveAttribute(
    GETTING_STARTED_FLOW_PREHYDRATION_COPIED_ATTRIBUTE
  )
  await expect(copyButton).toHaveAccessibleName("Copied")
  await expect(copyButton.locator("xpath=..")).toContainText(
    "Command copied to clipboard"
  )
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as unknown as {
              __NOVU_TEST_COPY_TIMERS__: Array<() => void>
            }
          ).__NOVU_TEST_COPY_TIMERS__.length
      )
    )
    .toBe(1)
  await page.evaluate(() => {
    ;(
      window as unknown as {
        __NOVU_TEST_COPY_TIMERS__: Array<() => void>
      }
    ).__NOVU_TEST_COPY_TIMERS__.shift()?.()
  })
  await expect(copyButton).toHaveAccessibleName("Copied")
  await expect(copyButton.locator("xpath=..")).toContainText(
    "Command copied to clipboard"
  )
  await expect
    .poll(async () => {
      return (await readTrackedEvents(page)).filter(
        ({ event }) => event === GETTING_STARTED_FLOW_SELECTED_EVENT
      )
    })
    .toHaveLength(2)
  await expect(copyButton).toHaveAccessibleName("Copy to clipboard")
  expectHealthyPage(applicationErrors)
})

test("pre-hydration context actions prepare signup without converting", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page, {
    includeConsoleErrors: true,
  })
  let releaseChunks = () => {}
  const chunksReleased = new Promise<void>((resolve) => {
    releaseChunks = resolve
  })
  await page.route("**/_next/static/chunks/**", async (route) => {
    if (route.request().resourceType() === "script") {
      await chunksReleased
    }
    await route.continue()
  })
  await installAnalyticsRecorder(page)
  await blockThirdPartyScripts(page)
  const response = await page.goto("/?gsf=ui", { waitUntil: "commit" })
  expect(response).not.toBeNull()

  const signupLink = page
    .locator('[data-getting-started-flow-variant="ui"]')
    .getByRole("link", { name: "Get started free" })
  const unexpectedSelection = page
    .waitForRequest(
      (request) =>
        readRequestEvent(request)?.event ===
        GETTING_STARTED_FLOW_SELECTED_EVENT,
      { timeout: 500 }
    )
    .then(
      () => true,
      () => false
    )
  await signupLink.evaluate((link) => {
    link.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        button: 2,
        cancelable: true,
      })
    )
    link.dispatchEvent(
      new MouseEvent("mouseup", {
        bubbles: true,
        button: 2,
        cancelable: true,
      })
    )
  })
  await signupLink.dispatchEvent("contextmenu", { button: 2 })
  await signupLink.dispatchEvent("auxclick", { button: 2 })

  expect(
    new URL((await signupLink.getAttribute("href"))!).searchParams.get(
      "ajs_aid"
    )
  ).toBeTruthy()
  expect(await unexpectedSelection).toBe(false)
  expect(
    (await readAttemptedEvents(page)).filter(
      ({ event }) => event === GETTING_STARTED_FLOW_SELECTED_EVENT
    )
  ).toEqual([])

  releaseChunks()
  await page.waitForLoadState("domcontentloaded")
  await expect(page.locator("html")).toHaveAttribute(
    GETTING_STARTED_FLOW_READY_ATTRIBUTE,
    ""
  )
  expectHealthyPage(applicationErrors)
})

test("signup keeps its exposure, selection, and anonymous ID", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page, {
    includeConsoleErrors: true,
  })
  await installAnalyticsRecorder(page)
  await gotoCriticalPage(page, "/?gsf=ui")
  await page.evaluate(() => {
    document.addEventListener("click", (event) => event.preventDefault())
  })

  const signupLink = page
    .locator('[data-getting-started-flow-variant="ui"]')
    .getByRole("link", { name: "Get started free" })
  await expect
    .poll(async () =>
      new URL((await signupLink.getAttribute("href"))!).searchParams.get(
        "ajs_aid"
      )
    )
    .not.toBeNull()
  await signupLink.click()

  await expect
    .poll(async () => (await readTrackedEvents(page)).map(({ event }) => event))
    .toEqual(
      expect.arrayContaining([
        GETTING_STARTED_FLOW_EXPOSED_EVENT,
        GETTING_STARTED_FLOW_SELECTED_EVENT,
      ])
    )

  const trackedEvents = await readTrackedEvents(page)
  const exposure = trackedEvents.find(
    ({ event }) => event === GETTING_STARTED_FLOW_EXPOSED_EVENT
  )
  const selection = trackedEvents.find(
    ({ event }) => event === GETTING_STARTED_FLOW_SELECTED_EVENT
  )
  expect(exposure?.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  expect(selection?.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  expect(Date.parse(selection!.timestamp!)).toBeGreaterThan(
    Date.parse(exposure!.timestamp!)
  )

  const signupHref = await signupLink.getAttribute("href")
  expect(signupHref).not.toBeNull()
  const signupUrl = new URL(signupHref!)
  expect(signupUrl.searchParams.get("product_type")).toBe("agents")
  expect(signupUrl.searchParams.get("ajs_aid")).toBeTruthy()
  expectHealthyPage(applicationErrors)
})

test("a hydrated middle-click signup keeps identity and records one selection", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page, {
    includeConsoleErrors: true,
  })
  await installAnalyticsRecorder(page)
  await gotoCriticalPage(page, "/?gsf=ui")
  await expect(page.locator("html")).toHaveAttribute(
    GETTING_STARTED_FLOW_READY_ATTRIBUTE,
    ""
  )

  const signupLink = page
    .locator('[data-getting-started-flow-variant="ui"]')
    .getByRole("link", { name: "Get started free" })
  await expect
    .poll(async () => {
      const href = await signupLink.getAttribute("href")
      return href ? new URL(href).searchParams.get("ajs_aid") : null
    })
    .not.toBeNull()
  const prematureSelection = page
    .waitForRequest(
      (request) =>
        readRequestEvent(request)?.event ===
        GETTING_STARTED_FLOW_SELECTED_EVENT,
      { timeout: 300 }
    )
    .then(
      () => true,
      () => false
    )
  await signupLink.evaluate((link) => {
    link.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        button: 1,
        cancelable: true,
      })
    )
  })
  expect(await prematureSelection).toBe(false)
  await signupLink.evaluate((link) => {
    link.dispatchEvent(
      new MouseEvent("mouseup", {
        bubbles: true,
        button: 1,
        cancelable: true,
      })
    )
  })

  const signupHref = await signupLink.getAttribute("href")
  expect(new URL(signupHref!).searchParams.get("ajs_aid")).toBeTruthy()
  await expect
    .poll(async () => {
      return (await readTrackedEvents(page)).filter(
        ({ event }) => event === GETTING_STARTED_FLOW_SELECTED_EVENT
      )
    })
    .toHaveLength(1)
  expectHealthyPage(applicationErrors)
})

test("signup selection reaches the endpoint during a real same-tab navigation", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page, {
    includeConsoleErrors: true,
  })
  await page.route("**/_next/static/chunks/**", async (route) => {
    if (route.request().resourceType() === "script") {
      await route.abort("blockedbyclient")
      return
    }
    await route.continue()
  })
  await page.context().route("https://dashboard.novu.co/**", async (route) => {
    await route.fulfill({
      body: "<!doctype html><title>Dashboard signup</title>",
      contentType: "text/html",
      status: 200,
    })
  })
  let resolveKeepalive!: (keepalive: boolean) => void
  const selectionKeepalive = new Promise<boolean>((resolve) => {
    resolveKeepalive = resolve
  })
  await page.exposeFunction(
    "__NOVU_TEST_RECORD_SELECTION_KEEPALIVE__",
    (keepalive: boolean) => resolveKeepalive(keepalive)
  )
  await page.addInitScript((selectedEvent) => {
    const browserWindow = window as unknown as {
      __NOVU_TEST_RECORD_SELECTION_KEEPALIVE__: (
        keepalive: boolean
      ) => Promise<void>
    }
    const nativeFetch = window.fetch.bind(window)

    window.fetch = (input, init) => {
      if (typeof init?.body === "string") {
        try {
          const payload = JSON.parse(init.body) as TrackedEvent
          if (payload.event === selectedEvent) {
            void browserWindow.__NOVU_TEST_RECORD_SELECTION_KEEPALIVE__(
              init.keepalive === true
            )
          }
        } catch {
          // Non-experiment requests continue through the native fetch.
        }
      }

      return nativeFetch(input, init)
    }
  }, GETTING_STARTED_FLOW_SELECTED_EVENT)
  await installAnalyticsRecorder(page)
  await gotoCriticalPage(page, "/?gsf=ui")

  const signupLink = page
    .locator('[data-getting-started-flow-variant="ui"]')
    .getByRole("link", { name: "Get started free" })
  await expect(page.locator("html")).not.toHaveAttribute(
    GETTING_STARTED_FLOW_READY_ATTRIBUTE,
    ""
  )
  await expect
    .poll(async () => {
      return (await readTrackedEvents(page)).filter(
        ({ event }) => event === GETTING_STARTED_FLOW_EXPOSED_EVENT
      )
    })
    .toHaveLength(1)

  let resolveSelectionRequest!: (result: {
    event: TrackedEvent
    status: number
  }) => void
  const selectionRequest = new Promise<{
    event: TrackedEvent
    status: number
  }>((resolve) => {
    resolveSelectionRequest = resolve
  })
  await page.route(
    "**/api/experiments/getting-started-flow/",
    async (route) => {
      const request = route.request()
      const event = readRequestEvent(request)
      const requestUrl = new URL(request.url())
      const response = await route.fetch({
        headers: {
          ...request.headers(),
          host: requestUrl.host,
          origin: requestUrl.origin,
          "sec-fetch-site": "same-origin",
        },
      })
      await route.fulfill({ response })
      if (event?.event === GETTING_STARTED_FLOW_SELECTED_EVENT)
        resolveSelectionRequest({ event, status: response.status() })
    }
  )
  await Promise.all([
    page.waitForURL("https://dashboard.novu.co/**"),
    signupLink.click(),
  ])

  const selection = await selectionRequest
  expect(await selectionKeepalive).toBe(true)
  expect(selection.status).toBe(204)
  expect(selection.event.properties?.action).toBe("sign_up_primary")
  expect(selection.event.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  const destination = new URL(page.url())
  expect(destination.origin).toBe("https://dashboard.novu.co")
  expect(destination.searchParams.get("product_type")).toBe("agents")
  expect(destination.searchParams.get("ajs_aid")).toBeTruthy()
  expectHealthyPage(applicationErrors)
})

test("a rejected pre-hydration selection fetch falls back to a beacon", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page, {
    includeConsoleErrors: true,
  })
  await page.route("**/_next/static/chunks/**", async (route) => {
    if (route.request().resourceType() === "script") {
      await route.abort("blockedbyclient")
      return
    }
    await route.continue()
  })
  await page.addInitScript((selectedEvent) => {
    const browserState = window as unknown as {
      __NOVU_TEST_REJECTED_SELECTION_FETCH__: string | null
    }
    const nativeFetch = window.fetch.bind(window)
    browserState.__NOVU_TEST_REJECTED_SELECTION_FETCH__ = null

    window.fetch = (input, init) => {
      if (
        browserState.__NOVU_TEST_REJECTED_SELECTION_FETCH__ === null &&
        typeof init?.body === "string"
      ) {
        try {
          const payload = JSON.parse(init.body) as TrackedEvent
          if (payload.event === selectedEvent) {
            browserState.__NOVU_TEST_REJECTED_SELECTION_FETCH__ = init.body
            return Promise.reject(
              new TypeError("forced selection fetch rejection")
            )
          }
        } catch {
          // Non-experiment requests continue through the native fetch.
        }
      }

      return nativeFetch(input, init)
    }
  }, GETTING_STARTED_FLOW_SELECTED_EVENT)
  await installClipboardMock(page)
  await installAnalyticsRecorder(page)
  await gotoCriticalPage(page, "/?gsf=cli")
  await expect
    .poll(async () => {
      return (await readTrackedEvents(page)).filter(
        ({ event }) => event === GETTING_STARTED_FLOW_EXPOSED_EVENT
      )
    })
    .toHaveLength(1)

  const copyButton = page.locator(
    '[data-getting-started-flow-variant="cli"] [data-getting-started-flow-action="copy_cli"]'
  )
  await expect(page.locator("html")).not.toHaveAttribute(
    GETTING_STARTED_FLOW_READY_ATTRIBUTE,
    ""
  )
  await copyButton.click()

  await expect
    .poll(async () => {
      return (await readBeaconEvents(page)).filter(
        ({ event }) => event === GETTING_STARTED_FLOW_SELECTED_EVENT
      )
    })
    .toHaveLength(1)
  await expect
    .poll(async () => {
      return (await readTrackedEvents(page)).filter(
        ({ event }) => event === GETTING_STARTED_FLOW_SELECTED_EVENT
      )
    })
    .toHaveLength(1)

  const selectionFetch = await page.evaluate(() => {
    const body = (
      window as unknown as {
        __NOVU_TEST_REJECTED_SELECTION_FETCH__: string | null
      }
    ).__NOVU_TEST_REJECTED_SELECTION_FETCH__

    return body ? (JSON.parse(body) as TrackedEvent) : null
  })
  const [selectionBeacon] = (await readBeaconEvents(page)).filter(
    ({ event }) => event === GETTING_STARTED_FLOW_SELECTED_EVENT
  )
  expect(selectionFetch?.messageId).toBe(selectionBeacon.messageId)
  expect(selectionFetch?.properties?.action).toBe("copy_cli")
  expect(selectionBeacon.properties?.action).toBe("copy_cli")
  expectHealthyPage(applicationErrors)
})

test("Segment localStorage identity wins when its cookie diverges", async ({
  page,
}) => {
  await page.addInitScript((cookieName) => {
    window.localStorage.setItem(
      cookieName,
      JSON.stringify("local%2Fstorage-id")
    )
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
    .toBe("local%2Fstorage-id")

  const signupLink = page
    .locator('[data-getting-started-flow-variant="ui"]')
    .getByRole("link", { name: "Get started free" })
  await signupLink.click()

  const signupHref = await signupLink.getAttribute("href")
  expect(new URL(signupHref!).searchParams.get("ajs_aid")).toBe(
    "local%2Fstorage-id"
  )
})

test("oversized stored anonymous IDs fall back to a bounded UUID", async ({
  page,
}) => {
  await page.addInitScript((cookieName) => {
    const oversizedId = "x".repeat(129)
    window.localStorage.setItem(cookieName, JSON.stringify(oversizedId))
    document.cookie = `${cookieName}=${encodeURIComponent(
      JSON.stringify(oversizedId)
    )}; Path=/; SameSite=Lax`
  }, SEGMENT_ANONYMOUS_ID_COOKIE_NAME)
  await installAnalyticsRecorder(page)
  await gotoCriticalPage(page, "/?gsf=ui")

  await expect
    .poll(async () => {
      return (await readTrackedEvents(page)).find(
        ({ event }) => event === GETTING_STARTED_FLOW_EXPOSED_EVENT
      )?.anonymousId
    })
    .toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )

  const exposure = (await readTrackedEvents(page)).find(
    ({ event }) => event === GETTING_STARTED_FLOW_EXPOSED_EVENT
  )
  const signupLink = page
    .locator('[data-getting-started-flow-variant="ui"]')
    .getByRole("link", { name: "Get started free" })
  await expect
    .poll(async () => {
      const href = await signupLink.getAttribute("href")
      return href ? new URL(href).searchParams.get("ajs_aid") : null
    })
    .toBe(exposure?.anonymousId)
})

test("the anonymous ID fallback remains a UUID v4", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Object.getPrototypeOf(window.crypto), "randomUUID", {
      configurable: true,
      value: undefined,
    })
  })
  await installAnalyticsRecorder(page)
  await gotoCriticalPage(page, "/?gsf=ui")

  await expect
    .poll(async () => {
      return (await readTrackedEvents(page)).find(
        ({ event }) => event === GETTING_STARTED_FLOW_EXPOSED_EVENT
      )
    })
    .not.toBeUndefined()

  const [recordedExposure] = (await readTrackedEvents(page)).filter(
    ({ event }) => event === GETTING_STARTED_FLOW_EXPOSED_EVENT
  )
  const uuidV4 =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  expect(recordedExposure.anonymousId).toMatch(uuidV4)
  expect(recordedExposure.messageId).toMatch(
    /^gsf-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
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
    .toBeGreaterThanOrEqual(1)

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
  const applicationErrors = observeApplicationErrors(page, {
    includeConsoleErrors: true,
  })
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
  await expect(page.locator("#getting-started-flow-bootstrap")).toHaveAttribute(
    "type",
    "text/plain"
  )
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
  expectHealthyPage(applicationErrors)
})

test("rejected client delivery falls back without an unhandled error", async ({
  page,
}) => {
  const applicationErrors = observeApplicationErrors(page, {
    includeConsoleErrors: true,
  })
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
      page.evaluate(() => {
        return (
          window as unknown as {
            __NOVU_TEST_BEACON_EVENTS__: string[]
          }
        ).__NOVU_TEST_BEACON_EVENTS__
          .map((body) => (JSON.parse(body) as TrackedEvent).event)
          .sort()
      })
    )
    .toEqual(
      [
        GETTING_STARTED_FLOW_EXPOSED_EVENT,
        GETTING_STARTED_FLOW_SELECTED_EVENT,
        WEBSITE_CLI_COMMAND_COPIED_EVENT,
      ].sort()
    )
  const selectedPayload = await page.evaluate((selectedEvent) => {
    const payloads = (
      window as unknown as {
        __NOVU_TEST_BEACON_EVENTS__: string[]
      }
    ).__NOVU_TEST_BEACON_EVENTS__.map(
      (body) => JSON.parse(body) as TrackedEvent
    )

    return payloads.find(({ event }) => event === selectedEvent)
  }, GETTING_STARTED_FLOW_SELECTED_EVENT)
  expect(selectedPayload?.properties?.action).toBe("copy_cli")
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
