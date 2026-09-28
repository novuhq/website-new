import assert from "node:assert/strict"
import dns from "node:dns/promises"
import http, {
  type IncomingMessage,
  type RequestOptions,
  type ServerResponse,
} from "node:http"
import https from "node:https"
import type { TestContext } from "node:test"

export type Address = { address: string; family: number }
type DnsFixture = Address[] | (() => Promise<Address[]>)
export const publicAddress = { address: "93.184.216.34", family: 4 }

/** Only DNS and the external destination are replaced; HTTP streams stay real. */
export async function upstream(
  t: TestContext,
  handler: (request: IncomingMessage, response: ServerResponse) => void,
  records: Record<string, DnsFixture> = { "brand.example": [publicAddress] }
) {
  const server = http.createServer(handler)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const bound = server.address()
  assert.ok(bound && typeof bound !== "string")
  const origin = `http://127.0.0.1:${bound.port}`
  t.after(async () => {
    server.closeAllConnections()
    await new Promise<void>((resolve) => server.close(() => resolve()))
  })

  const lookups: string[] = []
  const connections: { url: string; address: string; family: number }[] = []
  t.mock.method(dns, "lookup", async (hostname: string) => {
    lookups.push(hostname)
    assert.ok(
      Object.hasOwn(records, hostname),
      `Unexpected DNS query: ${hostname}`
    )
    const fixture = records[hostname]
    return typeof fixture === "function" ? fixture() : fixture
  })

  const realRequest = http.request
  const fixtureRequest = (
    url: URL,
    options: RequestOptions,
    callback: (response: IncomingMessage) => void
  ) => {
    // This fails if production delegates connection lookup back to DNS.
    assert.equal(
      typeof options.lookup,
      "function",
      "Connection must pin validated DNS"
    )
    assert.equal(
      options.agent,
      false,
      "Connections must not reuse an unvalidated socket"
    )
    options.lookup!(url.hostname, {}, (error, address, family) => {
      assert.ifError(error)
      assert.equal(typeof address, "string")
      connections.push({
        url: url.href,
        address: address as string,
        family: family!,
      })
    })
    return realRequest(
      new URL(`${url.pathname}${url.search}`, origin),
      {
        ...options,
        lookup: undefined,
        family: 4,
        headers: { ...options.headers, host: url.host },
      },
      callback
    )
  }
  t.mock.method(http, "request", fixtureRequest)
  t.mock.method(https, "request", fixtureRequest)
  return { lookups, connections }
}
