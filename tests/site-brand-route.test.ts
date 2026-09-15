import assert from "node:assert/strict"
import { it } from "node:test"

import { NextRequest } from "next/server"

import { POST } from "@/app/(website)/api/agent-preview/route"

import { publicAddress, upstream } from "./helpers/site-brand-upstream"

function request(url: string) {
  return new NextRequest("https://novu.co/api/agent-preview", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url }),
  })
}

it("POST returns real manifest extraction with normalized color and retained identity fields", async (t) => {
  const icon =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jWl0AAAAASUVORK5CYII="
  const network = await upstream(
    t,
    (incoming, response) => {
      if (incoming.url === "/start?theme=light") {
        response.writeHead(302, { location: "/product/" })
        response.end()
      } else if (incoming.url === "/product/") {
        response.writeHead(200, { "content-type": "text/html; charset=utf-8" })
        response.end(`<!doctype html><html><head>
        <title>Ignored title</title>
        <meta property="og:site_name" content="Acme &amp; Co | Platform">
        <meta name="description" content="Build &amp; ship">
        <base href="../assets/">
        <link rel="manifest" href="theme.webmanifest">
        <link rel="icon" href="logo.png">
      </head><body>Welcome</body></html>`)
      } else if (incoming.url === "/assets/theme.webmanifest") {
        response.writeHead(200, { "content-type": "application/manifest+json" })
        response.end('{"theme_color":"rgb(0 54 255)"}')
      } else if (incoming.url === "/assets/logo.png") {
        response.writeHead(200, { "content-type": "image/png" })
        response.end(Buffer.from(icon, "base64"))
      } else {
        response.writeHead(404)
        response.end()
      }
    },
    { "api-manifest.example": [publicAddress] }
  )

  const response = await POST(
    request("  API-MANIFEST.EXAMPLE/start?theme=light#cta  ")
  )

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), {
    brand: {
      url: "https://api-manifest.example/start?theme=light",
      domain: "api-manifest.example",
      name: "Acme & Co",
      description: "Build & ship",
      accent: "#0036ff",
      accentSource: "manifest",
      logo: `data:image/png;base64,${icon}`,
    },
  })
  assert.deepEqual(network.connections.map(({ url }) => url).sort(), [
    "https://api-manifest.example/assets/logo.png",
    "https://api-manifest.example/assets/theme.webmanifest",
    "https://api-manifest.example/product/",
    "https://api-manifest.example/start?theme=light",
  ])
})

it("POST keeps a successful identity response when optional upstream resources fail", async (t) => {
  await upstream(
    t,
    (incoming, response) => {
      if (incoming.url === "/") {
        response.writeHead(200, { "content-type": "text/html" })
        response.end(`<!doctype html><title>Fallback Brand | Home</title>
        <meta name="description" content="Still available">
        <meta name="theme-color" content="white">
        <link rel="manifest" href="/unavailable.webmanifest">`)
      } else {
        response.writeHead(
          incoming.url === "/unavailable.webmanifest" ? 503 : 404
        )
        response.end("unavailable")
      }
    },
    { "api-optional-failure.example": [publicAddress] }
  )

  const response = await POST(request("api-optional-failure.example"))

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), {
    brand: {
      url: "https://api-optional-failure.example/",
      domain: "api-optional-failure.example",
      name: "Fallback Brand",
      description: "Still available",
      accent: null,
      accentSource: null,
      logo: null,
    },
  })
})

it("POST extracts a linked CSS accent from a matching primary action", async (t) => {
  await upstream(
    t,
    (incoming, response) => {
      if (incoming.url === "/") {
        response.writeHead(200, { "content-type": "text/html" })
        response.end(
          '<title>CSS Brand</title><link rel="stylesheet" href="/theme.css"><button class="button-primary">Get started</button>'
        )
      } else if (incoming.url === "/theme.css") {
        response.writeHead(200, { "content-type": "text/css" })
        response.end(
          ":root { --brand: 240 100% 50% } .button-primary { background: hsl(var(--brand)) }"
        )
      } else {
        response.writeHead(404)
        response.end()
      }
    },
    { "api-css.example": [publicAddress] }
  )

  const response = await POST(request("api-css.example"))

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), {
    brand: {
      url: "https://api-css.example/",
      domain: "api-css.example",
      name: "CSS Brand",
      description: "",
      accent: "#0000ff",
      accentSource: "css",
      logo: null,
    },
  })
})

it("POST falls through a colorless manifest to the favicon palette", async (t) => {
  await upstream(
    t,
    (incoming, response) => {
      if (incoming.url === "/") {
        response.writeHead(200, { "content-type": "text/html" })
        response.end(
          '<title>Logo Brand</title><link rel="manifest" href="/manifest.json"><link rel="icon" href="/icon.svg">'
        )
      } else if (incoming.url === "/manifest.json") {
        response.writeHead(200, { "content-type": "application/manifest+json" })
        response.end('{"background_color":"white"}')
      } else if (incoming.url === "/icon.svg") {
        response.writeHead(200, { "content-type": "image/svg+xml" })
        response.end(
          '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path fill="#0036ff" d="M0 0h32v32H0z"/></svg>'
        )
      } else {
        response.writeHead(404)
        response.end()
      }
    },
    { "api-logo.example": [publicAddress] }
  )
  const response = await POST(request("api-logo.example"))
  const { brand } = await response.json()
  assert.equal(response.status, 200)
  assert.equal(brand.name, "Logo Brand")
  assert.equal(brand.accent, "#0036ff")
  assert.equal(brand.accentSource, "logo")
  assert.ok(brand.logo.startsWith("data:image/svg+xml;base64,"))
})
