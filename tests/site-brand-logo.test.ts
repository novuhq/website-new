import assert from "node:assert/strict"
import { it } from "node:test"

import sharp from "sharp"

import { selectAccent, type AccentCandidate } from "@/lib/site-brand/colors"
import { collectLogoCandidates } from "@/lib/site-brand/logo"

const uri = (body: Buffer | string, type = "image/png") =>
  `data:${type};base64,${Buffer.from(body).toString("base64")}`
const pixel = (r: number, g: number, b: number, a = 255) => [r, g, b, a]
const blue = pixel(0, 54, 255)
const red = pixel(255, 0, 0)
const white = pixel(255, 255, 255)
const css = (color: string, score = 20): AccentCandidate => ({
  color,
  score,
  source: "css",
  reason: "Uncorroborated theme token --brand",
})

async function png(pixels: number[][]) {
  return sharp(Buffer.from(pixels.flat()), {
    raw: { width: 8, height: pixels.length / 8, channels: 4 },
  })
    .png()
    .toBuffer()
}

async function accent(pixels: number[][], evidence: AccentCandidate[] = []) {
  return selectAccent([
    ...evidence,
    ...(await collectLogoCandidates(uri(await png(pixels)), evidence)),
  ])
}

it("extracts a dominant logo color without counting its white background", async () => {
  assert.deepEqual(
    await accent([...Array(48).fill(white), ...Array(16).fill(blue)]),
    {
      color: "#0036ff",
      source: "logo",
    }
  )
})

it("ignores transparent colors and keeps a monochrome logo inconclusive", async () => {
  assert.equal(
    (
      await accent([
        ...Array(32).fill(white),
        ...Array(32).fill(pixel(255, 0, 0, 0)),
      ])
    ).color,
    null
  )
  assert.equal((await accent(Array(64).fill(pixel(30, 30, 30)))).color, null)
})

it("does not promote a stray colored pixel in a mostly neutral image", async () => {
  assert.equal((await accent([...Array(63).fill(white), blue])).color, null)
})

it("keeps an evenly multicolored logo inconclusive without interface evidence", async () => {
  assert.equal(
    (await accent([...Array(32).fill(red), ...Array(32).fill(blue)])).color,
    null
  )
})

it("uses a substantial matching logo color to corroborate a declared brand token", async () => {
  assert.deepEqual(
    await accent(
      [...Array(32).fill(red), ...Array(32).fill(blue)],
      [css("#0036ff")]
    ),
    {
      color: "#0036ff",
      source: "logo",
    }
  )
})

it("prefers the closer logo match when two brand variables are shades of the same hue", async () => {
  const evidence = [css("#ec3c00"), css("#f15406")]
  for (const candidates of [evidence, [...evidence].reverse()]) {
    assert.deepEqual(
      await accent(Array(64).fill(pixel(241, 85, 8)), candidates),
      { color: "#f15406", source: "logo" }
    )
  }
})

it("keeps equally close competing shades ambiguous", async () => {
  assert.equal(
    (
      await accent(Array(64).fill(pixel(240, 80, 10)), [
        css("#f0460a"),
        css("#f05a0a"),
      ])
    ).color,
    null
  )
})

it("does not let an unrelated logo break a tie between strong interface colors", async () => {
  assert.equal(
    (
      await accent(Array(64).fill(pixel(0, 200, 50)), [
        css("#0036ff", 80),
        css("#ff0000", 80),
      ])
    ).color,
    null
  )
})

it("can resolve competing interface evidence when the logo corroborates one color", async () => {
  assert.deepEqual(
    await accent(Array(64).fill(blue), [
      css("#0036ff", 80),
      css("#ff0000", 80),
    ]),
    {
      color: "#0036ff",
      source: "logo",
    }
  )
})

it("rejects corrupt, unknown, oversized, or excessively large decoded images", async () => {
  for (const input of [
    "https://example.com/logo.png",
    "data:image/png;base64,???",
    uri("not an image"),
    uri(Buffer.alloc(201 * 1024)),
  ]) {
    assert.deepEqual(await collectLogoCandidates(input, []), [])
  }
  const huge = await sharp({
    create: { width: 1100, height: 1100, channels: 4, background: "red" },
  })
    .png()
    .toBuffer()
  assert.deepEqual(await collectLogoCandidates(uri(huge), []), [])
})

it("extracts a static SVG and rejects SVGs that can reference external resources", async () => {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path fill="#0036ff" d="M0 0h32v32H0z"/></svg>'
  assert.deepEqual(
    selectAccent(await collectLogoCandidates(uri(svg, "image/svg+xml"), [])),
    { color: "#0036ff", source: "logo" }
  )
  for (const unsafe of [
    '<svg xmlns="http://www.w3.org/2000/svg"><image href="file:///tmp/private.png"/></svg>',
    '<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///tmp/private">]><svg>&x;</svg>',
    '<svg><style>@import "https://example.com/style.css";</style></svg>',
    '<svg><path style="fill:url(https://example.com/a.svg)"/></svg>',
    '<svg><use href="&#102;ile:///tmp/private.svg"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:s="http://www.w3.org/2000/svg" width="32" height="32"><s:style>@import "data:text/css;base64,cmVjdCB7IGZpbGw6ICMwMDM2ZmYgfQ==";</s:style><rect width="32" height="32"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:é="http://www.w3.org/2000/svg" width="32" height="32"><é:style>rect { fill: #0036ff }</é:style><rect width="32" height="32"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" xml:base="file:///tmp/private.svg" width="32" height="32"><path fill="url(#secret)" d="M0 0h32v32H0z"/></svg>',
  ]) {
    // Content sniffing applies even when the server labels SVG bytes as PNG.
    assert.deepEqual(await collectLogoCandidates(uri(unsafe), []), [])
  }
})

it("reads literal colors in an SVG stylesheet while retaining its unconditional theme", async () => {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"><style xmlns="http://www.w3.org/2000/svg">:root { fill: #37c38f } @media (prefers-color-scheme: dark) { :root { fill: #34d59a } }</style><path d="M0 0h32v32H0z"/></svg>'
  assert.deepEqual(
    selectAccent(await collectLogoCandidates(uri(svg, "image/svg+xml"), [])),
    { color: "#37c38f", source: "logo" }
  )
})

it("preserves selector matching and cascade for simple SVG color rules", async () => {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><style type="text/css">.unused { fill: red } path { fill: blue } .mark { fill: rgb(0 54 255) !important } #mark { fill: red }</style><path id="mark" class="mark" d="M0 0h32v32H0z"/></svg>'
  assert.equal(
    selectAccent(await collectLogoCandidates(uri(svg, "image/svg+xml"), []))
      .color,
    "#0036ff"
  )
})

it("rejects imports, resource paint values, and unsupported SVG stylesheet properties", async () => {
  for (const cssText of [
    '@import "data:text/css;base64,cGF0aHtmaWxsOnJlZH0=";',
    "path { fill: url(https://example.com/paint.svg) }",
    "path { fill: red; filter: url(#effect) }",
    "@font-face { src: url(file:///tmp/private) } path { fill: red }",
    "path:hover { fill: red }",
  ]) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><style>${cssText}</style><path fill="blue" d="M0 0h32v32H0z"/></svg>`
    assert.deepEqual(
      await collectLogoCandidates(uri(svg, "image/svg+xml"), []),
      []
    )
  }
})

it("does not infer a logo color from only a conditional SVG stylesheet", async () => {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><style>@media (prefers-color-scheme: dark) { path { fill: red } }</style><path d="M0 0h32v32H0z"/></svg>'
  assert.deepEqual(
    await collectLogoCandidates(uri(svg, "image/svg+xml"), []),
    []
  )
})

it("reads PNG frames embedded in ICO favicons and rejects invalid frame offsets", async () => {
  const frame = await png(Array(64).fill(blue))
  const ico = Buffer.alloc(22 + frame.length)
  ico.writeUInt16LE(1, 2)
  ico.writeUInt16LE(1, 4)
  ico[6] = 8
  ico[7] = 8
  ico.writeUInt32LE(frame.length, 14)
  ico.writeUInt32LE(22, 18)
  frame.copy(ico, 22)
  assert.equal(
    selectAccent(await collectLogoCandidates(uri(ico, "image/x-icon"), []))
      .color,
    "#0036ff"
  )
  ico.writeUInt32LE(0xffffffff, 18)
  assert.deepEqual(
    await collectLogoCandidates(uri(ico, "image/x-icon"), []),
    []
  )
})

it("reads a legacy 32-bit ICO including its transparency mask", async () => {
  const ico = Buffer.alloc(22 + 40 + 8 * 8 * 4 + 8 * 4)
  ico.writeUInt16LE(1, 2)
  ico.writeUInt16LE(1, 4)
  ico[6] = 8
  ico[7] = 8
  ico.writeUInt32LE(ico.length - 22, 14)
  ico.writeUInt32LE(22, 18)
  ico.writeUInt32LE(40, 22)
  ico.writeInt32LE(8, 26)
  ico.writeInt32LE(16, 30)
  ico.writeUInt16LE(1, 34)
  ico.writeUInt16LE(32, 36)
  for (let offset = 62; offset < 62 + 256; offset += 4) {
    // Legacy icons may use zero alpha for all opaque pixels; the AND mask rules.
    ico[offset] = 255
    ico[offset + 1] = 54
  }
  assert.equal(
    selectAccent(await collectLogoCandidates(uri(ico, "image/x-icon"), []))
      .color,
    "#0036ff"
  )
  ico.fill(255, 62 + 256)
  assert.deepEqual(
    await collectLogoCandidates(uri(ico, "image/x-icon"), []),
    []
  )
  // Modern 32-bit icons use the alpha channel and ignore a legacy AND mask.
  for (let offset = 65; offset < 62 + 256; offset += 4) ico[offset] = 255
  assert.equal(
    selectAccent(await collectLogoCandidates(uri(ico, "image/x-icon"), []))
      .color,
    "#0036ff"
  )
})
