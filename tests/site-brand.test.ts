import assert from "node:assert/strict"
import { it } from "node:test"

import sharp from "sharp"

import { createBrandProfileReader } from "@/lib/site-brand"
import type { ResourceLoader } from "@/lib/site-brand/fetch"

type Fixture =
  | { body: string | Buffer; type?: string; finalUrl?: string }
  | Error

function fixtureReader(fixtures: Record<string, Fixture>) {
  const calls: string[] = []
  const createLoader = (): ResourceLoader => ({
    async load(url, options) {
      calls.push(url.href)
      const fixture = fixtures[url.href]
      if (!fixture)
        throw Object.assign(new Error("Site returned 404"), { statusCode: 404 })
      if (fixture instanceof Error) throw fixture
      if (Buffer.byteLength(fixture.body) > options.maxBytes) {
        throw new Error("Resource exceeds its size limit")
      }
      return {
        url: new URL(fixture.finalUrl ?? url.href),
        contentType: fixture.type ?? "text/html",
        body: Buffer.from(fixture.body),
      }
    },
    close() {},
  })
  return { read: createBrandProfileReader({ createLoader }), calls }
}

it("reads a manifest theme when the page has no theme metadata", async () => {
  const { read } = fixtureReader({
    "https://brand.example/": {
      body: '<title>Brand</title><link rel="manifest" href="/app.webmanifest">',
    },
    "https://brand.example/app.webmanifest": {
      body: '{"theme_color":"rgb(0 54 255)"}',
      type: "application/manifest+json",
    },
  })
  const brand = await read("brand.example")
  assert.equal(brand.accent, "#0036ff")
  assert.equal(brand.accentSource, "manifest")
  assert.equal(brand.name, "Brand")
})

it("accepts a normal server-rendered page larger than the old HTML prefix limit", async () => {
  const { read } = fixtureReader({
    "https://brand.example/": {
      body: `<title>Brand</title><meta name="theme-color" content="#0036ff"><!--${"x".repeat(600 * 1024)}-->`,
    },
  })
  assert.equal((await read("brand.example")).accent, "#0036ff")
})

it("does not let a neutral theme-color hide a usable TileColor", async () => {
  const { read } = fixtureReader({
    "https://brand.example/": {
      body: '<meta name="theme-color" content="#fff"><meta name="msapplication-TileColor" content="#0036ff">',
    },
  })
  assert.equal((await read("brand.example")).accent, "#0036ff")
})

it("falls through neutral metadata to a manifest without selecting background_color", async () => {
  const fixtures = {
    "https://brand.example/": {
      body: '<meta name="theme-color" content="white"><link rel="manifest" href="site.json">',
    },
    "https://brand.example/site.json": {
      body: '{"background_color":"red","theme_color":"#0036ff"}',
      type: "application/json",
    },
  }
  assert.equal(
    (await fixtureReader(fixtures).read("brand.example")).accentSource,
    "manifest"
  )
  fixtures["https://brand.example/site.json"].body =
    '{"background_color":"red"}'
  assert.equal(
    (await fixtureReader(fixtures).read("brand.example")).accent,
    null
  )
})

it("resolves the manifest against a redirected page and its first document base", async () => {
  const { read, calls } = fixtureReader({
    "https://brand.example/": {
      finalUrl: "https://www.brand.example/product/",
      body: '<base href="../assets/"><base href="/wrong/"><link href="theme.json" rel="manifest">',
    },
    "https://www.brand.example/assets/theme.json": {
      body: '{"theme_color":"#0036ff"}',
      type: "text/plain",
    },
  })
  assert.equal((await read("brand.example")).accent, "#0036ff")
  assert.ok(calls.includes("https://www.brand.example/assets/theme.json"))
})

it("retains identity when the manifest is broken and stylesheets fail", async () => {
  const { read } = fixtureReader({
    "https://brand.example/": {
      body: '<title>Acme &amp; Co | Home</title><meta name="description" content="Build &amp; ship"><link rel="manifest" href="bad.json"><link rel="stylesheet" href="missing.css"><link rel="icon" href="/logo.png">',
    },
    "https://brand.example/bad.json": { body: "<html>not json</html>" },
    "https://brand.example/logo.png": { body: "logo", type: "image/png" },
  })
  const brand = await read("brand.example")
  assert.equal(brand.name, "Acme & Co")
  assert.equal(brand.description, "Build & ship")
  assert.equal(brand.accent, null)
  assert.equal(brand.logo, "data:image/png;base64,bG9nbw==")
})

it("uses matching primary-button CSS instead of neutral metadata", async () => {
  const { read } = fixtureReader({
    "https://brand.example/": {
      body: '<meta name="theme-color" content="white"><style>.button-primary { background: #0036ff }</style><a class="button-primary" href="/start">Get started</a>',
    },
  })
  const brand = await read("brand.example")
  assert.equal(brand.accent, "#0036ff")
  assert.equal(brand.accentSource, "css")
})

it("reads linked CSS and resolves HSL channels through their consuming rule", async () => {
  const { read } = fixtureReader({
    "https://brand.example/": {
      body: '<link rel="stylesheet" href="/theme.css"><button class="button-primary">Get started</button>',
    },
    "https://brand.example/theme.css": {
      body: ":root { --brand: 240 100% 50% } .button-primary { background: hsl(var(--brand)) }",
      type: "text/css",
    },
  })
  assert.equal((await read("brand.example")).accent, "#0000ff")
})

it("normalizes cache keys but keeps page-specific themes separate", async () => {
  const { read, calls } = fixtureReader({
    "https://brand.example/": {
      body: '<meta name="theme-color" content="#0036ff">',
    },
    "https://brand.example/other?theme=red": {
      body: '<meta name="theme-color" content="#ff0000">',
    },
  })
  await read(" BRAND.EXAMPLE ")
  await read("https://brand.example/#section")
  assert.equal(
    calls.filter((url) => url === "https://brand.example/").length,
    1
  )
  assert.equal(
    (await read("https://brand.example/other?theme=red")).accent,
    "#ff0000"
  )
})

it("keeps document order when a linked stylesheet overrides an earlier inline style", async () => {
  const { read } = fixtureReader({
    "https://brand.example/": {
      body: '<style>.button-primary { background: blue }</style><link rel="stylesheet" href="/theme.css"><button class="button-primary">Get started</button>',
    },
    "https://brand.example/theme.css": {
      body: ".button-primary { background: red }",
      type: "text/css",
    },
  })
  assert.equal((await read("brand.example")).accent, "#ff0000")
})

it("retries extraction after a transient optional-resource failure", async () => {
  const fixtures: Record<string, Fixture> = {
    "https://brand.example/": {
      body: '<link rel="manifest" href="theme.json">',
    },
    "https://brand.example/theme.json": Object.assign(
      new Error("Site returned 503"),
      { statusCode: 503 }
    ),
  }
  const { read } = fixtureReader(fixtures)
  assert.equal((await read("brand.example")).accent, null)
  fixtures["https://brand.example/theme.json"] = {
    body: '{"theme_color":"#0036ff"}',
    type: "application/json",
  }
  assert.equal((await read("brand.example")).accent, "#0036ff")
})

it("rejects a non-HTML page instead of returning a misleading successful profile", async () => {
  const { read } = fixtureReader({
    "https://brand.example/": { body: "{}", type: "application/json" },
  })
  await assert.rejects(read("brand.example"), /HTML/)
})

const blueLogo =
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path fill="#0036ff" d="M0 0h32v32H0z"/></svg>'

const logoUri = (body: Buffer | string, type = "image/png") =>
  `data:${type};base64,${Buffer.from(body).toString("base64")}`

async function iconPng(size: number) {
  return sharp({
    create: { width: size, height: size, channels: 4, background: "blue" },
  })
    .png()
    .toBuffer()
}

it("prefers a later SVG over small and large raster favicon declarations", async () => {
  const { read, calls } = fixtureReader({
    "https://brand.example/": {
      body: '<link rel="icon" href="/tiny.png" sizes="16x16"><link rel="icon" href="/large.png" sizes="512x512"><link rel="icon" href="/logo.svg" type="image/svg+xml">',
    },
    "https://brand.example/tiny.png": {
      body: await iconPng(16),
      type: "image/png",
    },
    "https://brand.example/large.png": {
      body: await iconPng(512),
      type: "image/png",
    },
    "https://brand.example/logo.svg": { body: blueLogo, type: "image/svg+xml" },
  })
  assert.equal(
    (await read("brand.example")).logo,
    logoUri(blueLogo, "image/svg+xml")
  )
  assert.equal(calls.filter((url) => /tiny|large/.test(url)).length, 0)
})

it("prefers a high resolution PNG when no vector icon is available", async () => {
  const large = await iconPng(192)
  const { read } = fixtureReader({
    "https://brand.example/": {
      body: '<link rel="icon" href="/tiny.png" sizes="16x16"><link rel="icon" href="/large.png" sizes="192x192">',
    },
    "https://brand.example/tiny.png": {
      body: await iconPng(16),
      type: "image/png",
    },
    "https://brand.example/large.png": { body: large, type: "image/png" },
  })
  assert.equal((await read("brand.example")).logo, logoUri(large))
})

it("reads manifest icons without theme_color and resolves them against the final manifest URL", async () => {
  const large = await iconPng(192)
  const { read } = fixtureReader({
    "https://brand.example/": {
      body: '<base href="/assets/"><link rel="manifest" href="app.json"><link rel="icon" href="/tiny.png" sizes="16x16">',
    },
    "https://brand.example/assets/app.json": {
      body: '{"icons":[{"src":"icon.png","sizes":"192x192","purpose":"any"}]}',
      type: "application/json",
      finalUrl: "https://cdn.example/app/manifest.json",
    },
    "https://brand.example/tiny.png": {
      body: await iconPng(16),
      type: "image/png",
    },
    "https://cdn.example/app/icon.png": { body: large, type: "image/png" },
  })
  assert.equal((await read("brand.example")).logo, logoUri(large))
})

it("falls back from unavailable preferred icons and retains a small icon if needed", async () => {
  const small = await iconPng(16)
  const { read } = fixtureReader({
    "https://brand.example/": {
      body: '<link rel="icon" href="/tiny.png" sizes="16x16"><link rel="icon" href="/large.png" sizes="192x192"><link rel="icon" href="/missing.svg">',
    },
    "https://brand.example/tiny.png": { body: small, type: "image/png" },
    "https://brand.example/large.png": {
      body: "not an image",
      type: "text/html",
    },
  })
  assert.equal((await read("brand.example")).logo, logoUri(small))
})

it("can upgrade a good page icon to a manifest SVG within the shared icon budget", async () => {
  const { read, calls } = fixtureReader({
    "https://brand.example/": {
      body: '<link rel="manifest" href="/app.json"><link rel="icon" href="/large.png" sizes="192x192">',
    },
    "https://brand.example/app.json": {
      body: '{"icons":[{"src":"/logo.svg","sizes":"any","type":"image/svg+xml"}]}',
      type: "application/json",
    },
    "https://brand.example/large.png": {
      body: await iconPng(192),
      type: "image/png",
    },
    "https://brand.example/logo.svg": { body: blueLogo, type: "image/svg+xml" },
  })
  assert.equal(
    (await read("brand.example")).logo,
    logoUri(blueLogo, "image/svg+xml")
  )
  assert.equal(calls.length, 4)
})

it("ranks before limiting downloads and does not treat an ICO sizes=any as a vector", async () => {
  const large = await iconPng(192)
  const { read, calls } = fixtureReader({
    "https://brand.example/": {
      body:
        Array.from(
          { length: 8 },
          (_, i) => `<link rel="icon" href="/${i}.png" sizes="16x16">`
        ).join("") +
        '<link rel="icon" href="/legacy.ico" sizes="any"><link rel="icon" href="/large.png" sizes="192x192">',
    },
    "https://brand.example/large.png": { body: large, type: "image/png" },
  })
  assert.equal((await read("brand.example")).logo, logoUri(large))
  assert.equal(calls.length, 2)
})

it("prefers an explicitly dark icon over light and unqualified icons", async () => {
  const dark = await iconPng(192)
  const { read, calls } = fixtureReader({
    "https://brand.example/": {
      body: '<link rel="icon" href="/light.svg" media="(prefers-color-scheme: light)"><link rel="icon" href="/generic.svg"><link rel="icon" href="/dark.png" sizes="192x192" media="screen and (prefers-color-scheme: dark)">',
    },
    "https://brand.example/light.svg": {
      body: blueLogo,
      type: "image/svg+xml",
    },
    "https://brand.example/generic.svg": {
      body: blueLogo,
      type: "image/svg+xml",
    },
    "https://brand.example/dark.png": { body: dark, type: "image/png" },
  })
  assert.equal((await read("brand.example")).logo, logoUri(dark))
  assert.equal(calls.length, 2)
})

it("falls back to a generic icon if the declared dark variant fails", async () => {
  const { read } = fixtureReader({
    "https://brand.example/": {
      body: '<link rel="icon" href="/dark.svg" media="(prefers-color-scheme: dark)"><link rel="icon" href="/generic.svg">',
    },
    "https://brand.example/generic.svg": {
      body: blueLogo,
      type: "image/svg+xml",
    },
  })
  assert.equal(
    (await read("brand.example")).logo,
    logoUri(blueLogo, "image/svg+xml")
  )
})

it("renders SVG dark rules without changing the color extraction policy", async () => {
  const adaptive =
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><style>:root { fill:#37c38f } @media (prefers-color-scheme: dark) { :root { fill:#34d59a } } @media (prefers-color-scheme: light) { :root { fill:#37c38f } }</style><path d="M0 0h32v32H0z"/></svg>'
  const { read } = fixtureReader({
    "https://brand.example/": { body: '<link rel="icon" href="/logo.svg">' },
    "https://brand.example/logo.svg": { body: adaptive, type: "image/svg+xml" },
  })
  const brand = await read("brand.example")
  const svg = Buffer.from(brand.logo!.split(",")[1], "base64").toString()
  assert.match(svg, /@media all\s*\{/)
  assert.match(svg, /@media not all\s*\{/)
  assert.equal(brand.accent, "#37c38f")
})

it("falls back to the downloaded logo when the manifest has no theme color", async () => {
  const { read, calls } = fixtureReader({
    "https://brand.example/": {
      body: '<title>Brand</title><link rel="manifest" href="/site.json"><link rel="icon" href="/logo.svg"><style>:root { --brand: #0036ff }</style>',
    },
    "https://brand.example/site.json": {
      body: '{"background_color":"red"}',
      type: "application/json",
    },
    "https://brand.example/logo.svg": { body: blueLogo, type: "image/svg+xml" },
  })
  const brand = await read("brand.example")
  assert.equal(brand.accent, "#0036ff")
  assert.equal(brand.accentSource, "logo")
  assert.equal(brand.name, "Brand")
  assert.ok(brand.logo?.startsWith("data:image/svg+xml;base64,"))
  assert.equal(calls.filter((url) => url.endsWith("logo.svg")).length, 1)
  await read("brand.example")
  assert.equal(calls.length, 3)
})

it("retains confident CSS when the logo uses a different color", async () => {
  const { read } = fixtureReader({
    "https://brand.example/": {
      body: '<link rel="icon" href="/logo.svg"><style>.button-primary { background: red }</style><button class="button-primary">Get started</button>',
    },
    "https://brand.example/logo.svg": { body: blueLogo, type: "image/svg+xml" },
  })
  const brand = await read("brand.example")
  assert.equal(brand.accent, "#ff0000")
  assert.equal(brand.accentSource, "css")
})

it("falls through a missing manifest to matching brand-token link text", async () => {
  const { read } = fixtureReader({
    "https://brand.example/": {
      body: '<link rel="manifest" href="/missing.json"><style>:root { --color-primary: #0036ff } a { color: var(--color-primary) }</style><a href="/features">Features</a>',
    },
  })
  const brand = await read("brand.example")
  assert.equal(brand.accent, "#0036ff")
  assert.equal(brand.accentSource, "css")
})
