import { expect, type Locator, type Page } from "@playwright/test"

const CLIPBOARD_TEXT_KEY = "__NOVU_CRITICAL_FLOW_CLIPBOARD_TEXT__"
const FIRST_PARTY_ORIGIN = new URL(
  process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000"
).origin
const THIRD_PARTY_SCRIPT_URL =
  /^https:\/\/(?:[^/]+\.)?(?:cdn-plain\.com|plain\.com|segment\.com|segment\.io|snitcher\.com|vector\.co)(?:\/|$)/
const pagesWithThirdPartyScriptsBlocked = new WeakSet<Page>()

function isExpectedConsoleError(message: string) {
  if (
    message === "Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector"
  ) {
    return true
  }

  // Chromium omits the resource URL from this message. CI providers can be
  // denied by third-party CDNs even when the application itself is healthy.
  // First-party 403 responses are observed separately below and still fail.
  if (
    message.startsWith(
      "Failed to load resource: the server responded with a status of 403"
    )
  ) {
    return true
  }

  // WebKit reports every non-enforced CSP observation as a console error.
  // Enforced violations omit this prefix and remain test failures.
  return (
    (message.startsWith("The Content Security Policy ") &&
      message.includes("was delivered in report-only mode")) ||
    message.startsWith("[Report Only] Refused to ")
  )
}

function isExpectedWebKitPageError(page: Page, message: string) {
  if (page.context().browser()?.browserType().name() !== "webkit") {
    return false
  }

  if (
    message === "ResizeObserver loop completed with undelivered notifications."
  ) {
    return true
  }

  try {
    const { host } = new URL(page.url())
    const messageSuffix = " due to access control checks."
    const requestPrefix = `/${host}`

    if (
      !message.startsWith(`${requestPrefix}/`) ||
      !message.endsWith(messageSuffix)
    ) {
      return false
    }

    const requestPath = message.slice(
      requestPrefix.length,
      -messageSuffix.length
    )

    return requestPath === "/" || /[?&]_rsc=/.test(requestPath)
  } catch {
    return false
  }
}

export async function blockThirdPartyScripts(page: Page) {
  if (pagesWithThirdPartyScriptsBlocked.has(page)) return

  await page.route(THIRD_PARTY_SCRIPT_URL, (route) =>
    route.abort("blockedbyclient")
  )
  pagesWithThirdPartyScriptsBlocked.add(page)
}

export function observeApplicationErrors(
  page: Page,
  { includeConsoleErrors = false }: { includeConsoleErrors?: boolean } = {}
) {
  const errors: string[] = []

  if (includeConsoleErrors) {
    page.on("console", (message) => {
      if (
        message.type() === "error" &&
        !isExpectedConsoleError(message.text())
      ) {
        errors.push(message.text())
      }
    })
  }
  page.on("pageerror", (error) => {
    if (!isExpectedWebKitPageError(page, error.message)) {
      errors.push(error.message)
    }
  })
  page.on("response", (response) => {
    if (response.status() !== 403) return

    const responseUrl = new URL(response.url())
    if (responseUrl.origin !== FIRST_PARTY_ORIGIN) return

    errors.push(
      `First-party request returned 403: ${response.request().method()} ${responseUrl.pathname}`
    )
  })

  return errors
}

export async function gotoCriticalPage(page: Page, pagePath: string) {
  await blockThirdPartyScripts(page)
  const response = await page.goto(pagePath, { waitUntil: "domcontentloaded" })

  expect(
    response,
    `${pagePath} did not return a document response`
  ).not.toBeNull()
  expect(
    response?.ok(),
    `${pagePath} returned ${response?.status() ?? "no status"}`
  ).toBeTruthy()
  await expect(page).not.toHaveTitle("")
}

export function expectHealthyPage(applicationErrors: string[]) {
  expect(applicationErrors).toEqual([])
}

export async function expectReactHandlerReady(
  element: Locator,
  handlerName: string
) {
  await expect
    .poll(() =>
      element.evaluate(
        (node, expectedHandlerName) =>
          Object.keys(node).some((key) => {
            const reactProps = (node as unknown as Record<string, unknown>)[key]

            return (
              key.startsWith("__reactProps$") &&
              typeof (reactProps as Record<string, unknown> | undefined)?.[
                expectedHandlerName
              ] === "function"
            )
          }),
        handlerName
      )
    )
    .toBe(true)
}

export async function installClipboardMock(page: Page) {
  await page.addInitScript(
    ({ clipboardKey }) => {
      const browserState = window as unknown as Record<string, unknown>
      browserState[clipboardKey] = ""

      Object.defineProperty(document, "execCommand", {
        configurable: true,
        value: (command: string) => {
          if (command !== "copy") return false

          browserState[clipboardKey] = document.getSelection()?.toString() || ""
          return true
        },
      })

      try {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: async (text: string) => {
              browserState[clipboardKey] = text
            },
          },
        })
      } catch {
        // The execCommand mock remains available as a fallback.
      }
    },
    { clipboardKey: CLIPBOARD_TEXT_KEY }
  )
}

export async function expectClipboardText(page: Page, expectedText: string) {
  await expect
    .poll(() =>
      page.evaluate(
        (clipboardKey) =>
          (window as unknown as Record<string, unknown>)[clipboardKey],
        CLIPBOARD_TEXT_KEY
      )
    )
    .toBe(expectedText)
}
