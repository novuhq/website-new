import assert from "node:assert/strict"
import test from "node:test"
import vm from "node:vm"

import { buildGettingStartedFlowBootstrapScript } from "../src/lib/getting-started-flow-bootstrap"
import {
  getGettingStartedFlowForRandomValue,
  GETTING_STARTED_FLOW_COOKIE_NAME,
  isGettingStartedFlow,
} from "../src/lib/getting-started-flow-experiment"

interface BootstrapOptions {
  cookie?: string
  cryptoValue?: number
  enabled: boolean
  protocol?: "http:" | "https:"
  qaEnabled?: boolean
  search?: string
}

function runBootstrap({
  cookie = "",
  cryptoValue = 0,
  enabled,
  protocol = "https:",
  qaEnabled = false,
  search = "",
}: BootstrapOptions) {
  const attributes = new Map<string, string>()
  const cookieJar = new Map(
    cookie
      .split(";")
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => {
        const separatorIndex = value.indexOf("=")
        return [
          value.slice(0, separatorIndex),
          value.slice(separatorIndex + 1),
        ] as const
      })
  )
  const writtenCookies: string[] = []

  const document = {
    addEventListener() {},
    documentElement: {
      removeAttribute(name: string) {
        attributes.delete(name)
      },
      setAttribute(name: string, value: string) {
        attributes.set(name, value)
      },
    },
  }

  Object.defineProperty(document, "cookie", {
    configurable: true,
    get: () =>
      Array.from(cookieJar, ([name, value]) => `${name}=${value}`).join("; "),
    set: (value: string) => {
      writtenCookies.push(value)
      const [cookieValue] = value.split(";", 1)
      const separatorIndex = cookieValue.indexOf("=")
      cookieJar.set(
        cookieValue.slice(0, separatorIndex),
        cookieValue.slice(separatorIndex + 1)
      )
    },
  })

  const browserWindow = {
    crypto: {
      getRandomValues(values: Uint32Array) {
        values[0] = cryptoValue
        return values
      },
    },
    location: { hostname: "localhost", pathname: "/", protocol, search },
  } as Record<string, unknown>

  vm.runInNewContext(
    buildGettingStartedFlowBootstrapScript({ enabled, qaEnabled }),
    {
      document,
      Math,
      setTimeout() {},
      Uint32Array,
      URLSearchParams,
      window: browserWindow,
    }
  )

  return {
    assignment: browserWindow.__novuGettingStartedFlowAssignment
      ? JSON.parse(
          JSON.stringify(browserWindow.__novuGettingStartedFlowAssignment)
        )
      : undefined,
    rootVariant: attributes.get("data-getting-started-flow"),
    writtenCookie:
      writtenCookies.find((value) =>
        value.startsWith(`${GETTING_STARTED_FLOW_COOKIE_NAME}=`)
      ) ?? null,
  }
}

test("validates getting-started variants", () => {
  assert.equal(isGettingStartedFlow("ui"), true)
  assert.equal(isGettingStartedFlow("cli"), true)
  assert.equal(isGettingStartedFlow("prompt"), true)
  assert.equal(isGettingStartedFlow("baseline"), false)
  assert.equal(isGettingStartedFlow(undefined), false)
})

test("maps the 34/33/33 allocation boundaries", () => {
  assert.equal(getGettingStartedFlowForRandomValue(0), "ui")
  assert.equal(getGettingStartedFlowForRandomValue(0.339_999), "ui")
  assert.equal(getGettingStartedFlowForRandomValue(0.34), "cli")
  assert.equal(getGettingStartedFlowForRandomValue(0.669_999), "cli")
  assert.equal(getGettingStartedFlowForRandomValue(0.67), "prompt")
  assert.equal(getGettingStartedFlowForRandomValue(0.999_999), "prompt")
  assert.throws(() => getGettingStartedFlowForRandomValue(-0.01), RangeError)
  assert.throws(() => getGettingStartedFlowForRandomValue(1), RangeError)
  assert.throws(
    () => getGettingStartedFlowForRandomValue(Number.NaN),
    RangeError
  )
})

test("keeps the synchronous fallback bounded and independent of remote flags", () => {
  const script = buildGettingStartedFlowBootstrapScript({
    enabled: true,
    qaEnabled: true,
  })

  assert.ok(Buffer.byteLength(script, "utf8") < 8_750)
  assert.doesNotMatch(script, /https:\/\/|get_variant_value|mixpanel/i)
  assert.match(script, /addEventListener/)
})

test("keeps the production baseline when the experiment is disabled", () => {
  const result = runBootstrap({
    cookie: `${GETTING_STARTED_FLOW_COOKIE_NAME}=cli`,
    enabled: false,
  })

  assert.equal(result.rootVariant, undefined)
  assert.equal(result.assignment, undefined)
  assert.equal(result.writtenCookie, null)
})

test("ignores a production QA override when the QA flag is disabled", () => {
  const result = runBootstrap({
    cookie: `${GETTING_STARTED_FLOW_COOKIE_NAME}=cli`,
    enabled: true,
    qaEnabled: false,
    search: "?gsf=prompt",
  })

  assert.equal(result.rootVariant, "cli")
  assert.deepEqual(result.assignment, {
    isQa: false,
    source: "cookie",
    variant: "cli",
  })
})

test("QA override works without changing the sticky assignment", () => {
  const result = runBootstrap({
    cookie: `${GETTING_STARTED_FLOW_COOKIE_NAME}=cli`,
    enabled: false,
    qaEnabled: true,
    search: "?gsf=prompt",
  })

  assert.equal(result.rootVariant, "prompt")
  assert.deepEqual(result.assignment, {
    isQa: true,
    source: "qa",
    variant: "prompt",
  })
  assert.equal(result.writtenCookie, null)
})

test("reuses a valid assignment cookie", () => {
  const result = runBootstrap({
    cookie: `another=value; ${GETTING_STARTED_FLOW_COOKIE_NAME}=cli`,
    enabled: true,
  })

  assert.equal(result.rootVariant, "cli")
  assert.deepEqual(result.assignment, {
    isQa: false,
    source: "cookie",
    variant: "cli",
  })
  assert.equal(result.writtenCookie, null)
})

test("replaces an invalid cookie with a random sticky assignment", () => {
  const result = runBootstrap({
    cookie: `${GETTING_STARTED_FLOW_COOKIE_NAME}=invalid`,
    cryptoValue: Math.floor(0.8 * 4_294_967_296),
    enabled: true,
  })

  assert.equal(result.rootVariant, "prompt")
  assert.deepEqual(result.assignment, {
    isQa: false,
    source: "random",
    variant: "prompt",
  })
  assert.match(
    result.writtenCookie ?? "",
    new RegExp(`^${GETTING_STARTED_FLOW_COOKIE_NAME}=prompt;`)
  )
  assert.match(result.writtenCookie ?? "", /; SameSite=Lax; Secure$/)
})
