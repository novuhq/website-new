import assert from "node:assert/strict"
import { describe, it, type TestContext } from "node:test"
import { setTimeout as delay } from "node:timers/promises"

import { createResourceLoader, normalizeUrl } from "../src/lib/site-brand/fetch"
import {
  publicAddress,
  upstream,
  type Address,
} from "./helpers/site-brand-upstream"

const resourceOptions = { maxBytes: 1024, accept: "text/html" }

function loader(
  t: TestContext,
  options?: Parameters<typeof createResourceLoader>[0]
) {
  const instance = createResourceLoader(options)
  t.after(() => instance.close())
  return instance
}

describe("public resource URL normalization", () => {
  it("adds HTTPS, removes fragments, and preserves the selected page and query", () => {
    assert.equal(
      normalizeUrl("  Brand.Example/docs?theme=dark#cta  ").href,
      "https://brand.example/docs?theme=dark"
    )
    assert.equal(
      normalizeUrl("http://brand.example:8080/a?b=c#d").href,
      "http://brand.example:8080/a?b=c"
    )
    assert.equal(
      normalizeUrl("brand.example:8080/a?b=c").href,
      "https://brand.example:8080/a?b=c"
    )
  })

  for (const input of [
    "",
    "ftp://brand.example/file",
    "file:///etc/passwd",
    "javascript:alert(1)",
    "data:text/html,hello",
    "https://user:password@brand.example/",
    "https://user@brand.example/",
    "https://localhost/",
    "https://LOCALHOST./",
    "https://sub.localhost/",
    "https://printer.local/",
    "https://printer.local./",
    "http://127.0.0.1/",
    "http://127.1/",
    "http://2130706433/",
    "http://0x7f000001/",
    "http://0.0.0.0/",
    "http://10.0.0.1/",
    "http://172.16.0.1/",
    "http://192.168.1.1/",
    "http://169.254.169.254/",
    "http://100.64.0.1/",
    "http://192.0.2.1/",
    "http://198.18.0.1/",
    "http://203.0.113.1/",
    "http://224.0.0.1/",
    "http://240.0.0.1/",
    "http://[::1]/",
    "http://[::2]/",
    "http://[fc00::1]/",
    "http://[fe80::1]/",
    "http://[fec0::1]/",
    "http://[2001:db8::1]/",
    "http://[3fff::1]/",
    "http://[::ffff:127.0.0.1]/",
    "http://[::ffff:169.254.169.254]/",
    "http://[64:ff9b::a00:1]/",
    "http://[2002:7f00:1::]/",
  ]) {
    it(`rejects nonpublic or unsupported input ${JSON.stringify(input)}`, () => {
      assert.throws(() => normalizeUrl(input))
    })
  }

  for (const input of [
    "https://8.8.8.8/",
    "https://[2606:4700:4700::1111]/",
    "https://[::ffff:8.8.8.8]/",
    "https://fdbrand.example/",
  ]) {
    it(`allows public input ${input}`, () => assert.ok(normalizeUrl(input)))
  }
})

describe("bounded public resource loader", () => {
  it("returns the final response and pins each DNS result without forwarding cookies", async (t) => {
    const network = await upstream(
      t,
      (request, response) => {
        assert.equal(request.headers.cookie, undefined)
        assert.equal(request.headers.authorization, undefined)
        assert.equal(request.headers["accept-encoding"], "identity")
        assert.equal(request.headers.accept, "text/html")
        if (request.url === "/start") {
          response.writeHead(302, {
            location: "https://cdn.example/page?q=1#part",
            "set-cookie": "secret=value",
          })
          response.end()
        } else {
          response.writeHead(200, {
            "content-type": "text/html; charset=utf-8",
          })
          response.end("<title>Brand</title>")
        }
      },
      {
        "brand.example": [publicAddress],
        "cdn.example": [{ address: "1.1.1.1", family: 4 }],
      }
    )
    const result = await loader(t).load(
      new URL("http://brand.example/start"),
      resourceOptions
    )
    assert.equal(result.url.href, "https://cdn.example/page?q=1")
    assert.equal(result.contentType, "text/html; charset=utf-8")
    assert.equal(result.body.toString(), "<title>Brand</title>")
    assert.deepEqual(network.lookups, ["brand.example", "cdn.example"])
    assert.deepEqual(network.connections, [
      {
        url: "http://brand.example/start",
        address: "93.184.216.34",
        family: 4,
      },
      { url: "https://cdn.example/page?q=1", address: "1.1.1.1", family: 4 },
    ])
  })

  it("validates URL objects passed directly to load", async (t) => {
    const network = await upstream(t, (_request, response) =>
      response.end("unsafe")
    )
    await assert.rejects(
      loader(t).load(new URL("http://127.0.0.1/"), resourceOptions)
    )
    assert.equal(network.connections.length, 0)
  })

  for (const addresses of [
    [{ address: "10.0.0.1", family: 4 }],
    [publicAddress, { address: "127.0.0.1", family: 4 }],
    [{ address: "::ffff:192.168.1.1", family: 6 }],
    [],
  ]) {
    it(`rejects unsafe or empty DNS results ${JSON.stringify(addresses)}`, async (t) => {
      const network = await upstream(
        t,
        (_request, response) => response.end("unsafe"),
        {
          "brand.example": addresses,
        }
      )
      await assert.rejects(
        loader(t).load(new URL("https://brand.example/"), resourceOptions)
      )
      assert.equal(network.connections.length, 0)
    })
  }

  for (const destination of [
    "http://127.0.0.1/private",
    "http://[::ffff:10.0.0.1]/",
    "https://user:pass@cdn.example/",
    "file:///etc/passwd",
    "http://private.example/",
  ]) {
    it(`rejects redirect destination ${destination}`, async (t) => {
      const network = await upstream(
        t,
        (_request, response) => {
          response.writeHead(302, { location: destination })
          response.end()
        },
        {
          "brand.example": [publicAddress],
          "private.example": [{ address: "10.0.0.1", family: 4 }],
        }
      )
      await assert.rejects(
        loader(t).load(new URL("https://brand.example/"), resourceOptions)
      )
      assert.equal(network.connections.length, 1)
    })
  }

  it("resolves relative redirects and rejects a fourth redirect", async (t) => {
    const network = await upstream(t, (request, response) => {
      const hop = Number(request.url!.slice(1))
      response.writeHead(302, { location: `${hop + 1}` })
      response.end()
    })
    await assert.rejects(
      loader(t).load(new URL("http://brand.example/0"), resourceOptions),
      /redirect/i
    )
    assert.deepEqual(
      network.connections.map(({ url }) => url),
      [
        "http://brand.example/0",
        "http://brand.example/1",
        "http://brand.example/2",
        "http://brand.example/3",
      ]
    )
  })

  it("rejects oversized declared content before consuming its body", async (t) => {
    await upstream(t, (_request, response) => {
      response.writeHead(200, { "content-length": 100_000 })
      response.flushHeaders()
    })
    await assert.rejects(
      loader(t).load(new URL("https://brand.example/"), {
        ...resourceOptions,
        maxBytes: 8,
      }),
      /size|limit|large/i
    )
  })

  it("rejects a chunked body as soon as it exceeds the byte cap", async (t) => {
    await upstream(t, (_request, response) => {
      response.write("12345")
      response.write("67890")
      // Keeping the stream open proves the loader does not wait for a full body.
    })
    await assert.rejects(
      loader(t, { timeoutMs: 300 }).load(new URL("https://brand.example/"), {
        ...resourceOptions,
        maxBytes: 8,
      }),
      /size|limit|large/i
    )
  })

  it("accepts a body exactly at the byte cap", async (t) => {
    await upstream(t, (_request, response) => response.end("12345678"))
    const result = await loader(t).load(new URL("https://brand.example/"), {
      ...resourceOptions,
      maxBytes: 8,
    })
    assert.equal(result.body.toString(), "12345678")
  })

  it("rejects compression rather than exposing unchecked compressed content", async (t) => {
    await upstream(t, (_request, response) => {
      response.writeHead(200, { "content-encoding": "gzip" })
      response.end("compressed")
    })
    await assert.rejects(
      loader(t).load(new URL("https://brand.example/"), resourceOptions),
      /encoding|compress/i
    )
  })

  it("exposes failed HTTP statuses for optional-resource cache policy", async (t) => {
    await upstream(t, (_request, response) => {
      response.writeHead(503)
      response.end("unavailable")
    })
    await assert.rejects(
      loader(t).load(new URL("https://brand.example/"), resourceOptions),
      { statusCode: 503 }
    )
  })

  it("applies its deadline through body consumption", async (t) => {
    await upstream(t, (_request, response) => {
      response.writeHead(200)
      response.write("partial")
    })
    await assert.rejects(
      loader(t, { timeoutMs: 50 }).load(
        new URL("https://brand.example/"),
        resourceOptions
      ),
      { name: "AbortError" }
    )
  })

  it("applies its deadline before response headers arrive", async (t) => {
    const network = await upstream(t, () => {})
    await assert.rejects(
      loader(t, { timeoutMs: 50 }).load(
        new URL("https://brand.example/"),
        resourceOptions
      ),
      { name: "AbortError" }
    )
    assert.equal(network.connections.length, 1)
  })

  it("rejects a truncated response instead of returning a partial resource", async (t) => {
    await upstream(t, (_request, response) => {
      response.writeHead(200, { "content-length": 100 })
      response.write("partial")
      const timer = setTimeout(() => response.destroy(), 5)
      response.on("close", () => clearTimeout(timer))
    })
    await assert.rejects(
      loader(t).load(new URL("https://brand.example/"), resourceOptions)
    )
  })

  it("releases a failed request's slot so an independent resource can complete", async (t) => {
    await upstream(t, (request, response) => {
      response.writeHead(request.url === "/missing" ? 404 : 200)
      response.end(request.url === "/missing" ? "missing" : "ready")
    })
    const resources = loader(t, { concurrency: 1 })
    const [failed, successful] = await Promise.allSettled([
      resources.load(new URL("https://brand.example/missing"), resourceOptions),
      resources.load(new URL("https://brand.example/next"), resourceOptions),
    ])
    assert.equal(failed.status, "rejected")
    assert.equal(successful.status, "fulfilled")
    if (successful.status === "fulfilled")
      assert.equal(successful.value.body.toString(), "ready")
  })

  it("bounds slow DNS and never connects after its deadline", async (t) => {
    let finishDns!: (addresses: Address[]) => void
    const network = await upstream(
      t,
      (_request, response) => response.end("late"),
      {
        "brand.example": () =>
          new Promise((resolve) => {
            finishDns = resolve
          }),
      }
    )
    await assert.rejects(
      loader(t, { timeoutMs: 40 }).load(
        new URL("https://brand.example/"),
        resourceOptions
      ),
      { name: "AbortError" }
    )
    finishDns([publicAddress])
    await delay(0)
    assert.equal(network.connections.length, 0)
  })

  it("shares one deadline across requests waiting for a concurrency slot", async (t) => {
    const network = await upstream(t, (_request, response) =>
      response.write("waiting")
    )
    const resources = loader(t, { timeoutMs: 50, concurrency: 1 })
    await Promise.all([
      assert.rejects(
        resources.load(new URL("https://brand.example/first"), resourceOptions),
        { name: "AbortError" }
      ),
      assert.rejects(
        resources.load(
          new URL("https://brand.example/queued"),
          resourceOptions
        ),
        { name: "AbortError" }
      ),
    ])
    assert.equal(network.connections.length, 1)
  })

  it("does not reset the deadline for a redirect", async (t) => {
    const network = await upstream(t, (request, response) => {
      if (request.url === "/first") {
        const timer = setTimeout(() => {
          response.writeHead(302, { location: "/second" })
          response.end()
        }, 40)
        response.on("close", () => clearTimeout(timer))
      } else {
        const timer = setTimeout(() => response.end("too late"), 90)
        response.on("close", () => clearTimeout(timer))
      }
    })
    await assert.rejects(
      loader(t, { timeoutMs: 110 }).load(
        new URL("https://brand.example/first"),
        resourceOptions
      ),
      { name: "AbortError" }
    )
    assert.equal(network.connections.length, 2)
  })

  it("closes active and queued requests and rejects later loads", async (t) => {
    let received!: () => void
    const started = new Promise<void>((resolve) => {
      received = resolve
    })
    const network = await upstream(t, (_request, response) => {
      response.write("waiting")
      received()
    })
    const resources = loader(t, { concurrency: 1 })
    const requests = [
      assert.rejects(
        resources.load(new URL("https://brand.example/first"), resourceOptions),
        { name: "AbortError" }
      ),
      assert.rejects(
        resources.load(
          new URL("https://brand.example/queued"),
          resourceOptions
        ),
        { name: "AbortError" }
      ),
    ]
    await started
    resources.close()
    await Promise.all(requests)
    await assert.rejects(
      resources.load(new URL("https://brand.example/late"), resourceOptions),
      { name: "AbortError" }
    )
    assert.equal(network.connections.length, 1)
  })

  it("keeps at most three requests active while queued resources still complete", async (t) => {
    let active = 0
    let peak = 0
    await upstream(t, (_request, response) => {
      active += 1
      peak = Math.max(peak, active)
      const timer = setTimeout(() => {
        active -= 1
        response.end("ready")
      }, 20)
      response.on("close", () => clearTimeout(timer))
    })
    const resources = loader(t, { concurrency: 10 })
    const results = await Promise.all(
      Array.from({ length: 7 }, (_, index) =>
        resources.load(
          new URL(`https://brand.example/${index}`),
          resourceOptions
        )
      )
    )
    assert.equal(peak, 3)
    assert.deepEqual(
      results.map(({ body }) => body.toString()),
      Array(7).fill("ready")
    )
  })
})
