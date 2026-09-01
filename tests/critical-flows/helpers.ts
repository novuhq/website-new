import { expect, type Locator, type Page } from "@playwright/test"

const CLIPBOARD_TEXT_KEY = "__NOVU_CRITICAL_FLOW_CLIPBOARD_TEXT__"
const THIRD_PARTY_SCRIPT_URL =
  /^https:\/\/(?:[^/]+\.)?(?:cdn-plain\.com|plain\.com|snitcher\.com|vector\.co)(?:\/|$)/
const pagesWithThirdPartyScriptsBlocked = new WeakSet<Page>()

function isExpectedWebKitNavigationCancellation(page: Page, message: string) {
  if (page.context().browser()?.browserType().name() !== "webkit") {
    return false
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

async function blockThirdPartyScripts(page: Page) {
  if (pagesWithThirdPartyScriptsBlocked.has(page)) return

  await page.route(THIRD_PARTY_SCRIPT_URL, (route) =>
    route.abort("blockedbyclient")
  )
  pagesWithThirdPartyScriptsBlocked.add(page)
}

export function observeApplicationErrors(page: Page) {
  const errors: string[] = []

  page.on("pageerror", (error) => {
    if (!isExpectedWebKitNavigationCancellation(page, error.message)) {
      errors.push(error.message)
    }
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
