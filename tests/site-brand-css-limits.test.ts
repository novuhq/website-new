import assert from "node:assert/strict"
import { it } from "node:test"
import { fileURLToPath } from "node:url"
import { Worker } from "node:worker_threads"

import type { AccentCandidate } from "@/lib/site-brand/colors"

// A regression must fail this test without exhausting the test runner's heap.
async function extractWithinLimits(html: string): Promise<AccentCandidate[]> {
  const worker = new Worker(
    `
      require("tsx/cjs")
      const { parentPort, workerData } = require("node:worker_threads")
      const { htmlToDOM } = require("html-react-parser")
      const { collectCssCandidates } = require(workerData.modulePath)
      parentPort.postMessage(collectCssCandidates(htmlToDOM(workerData.html), []))
    `,
    {
      eval: true,
      resourceLimits: { maxOldGenerationSizeMb: 128 },
      workerData: {
        html,
        modulePath: fileURLToPath(
          new URL("../src/lib/site-brand/css.ts", import.meta.url)
        ),
      },
    }
  )
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await new Promise<AccentCandidate[]>((resolve, reject) => {
      timer = setTimeout(
        () =>
          reject(new Error("CSS extraction exceeded its processing budget")),
        10_000
      )
      worker.once("message", resolve)
      worker.once("error", reject)
      worker.once("exit", (code) => {
        if (code !== 0) reject(new Error(`CSS worker exited with code ${code}`))
      })
    })
  } finally {
    clearTimeout(timer)
    await worker.terminate()
  }
}

const primary = '<button class="primary">Get started</button>'
const primaryCss = ".primary { background: #0036ff }"
const variables = (count: number) =>
  Array.from({ length: count }, (_, i) => `--v${i}: red`).join(";")

it("extracts a brand without copying thousands of variables into every descendant", async () => {
  const candidates = await extractWithinLimits(
    `<html><style>:root { ${variables(3000)} } ${primaryCss}</style><body>${"<div></div>".repeat(4000)}${primary}</body></html>`
  )
  assert.ok(
    candidates.some(({ color, score }) => color === "#0036ff" && score === 80)
  )
})

it("preserves CSS branding with repeated framework resets and long utility classes", async () => {
  const classes = `primary ${"utility-class ".repeat(30)}`
  const rules = Array.from(
    { length: 100 },
    (_, i) => `.absent-${i} { color:red }`
  ).join("")
  const html = `<html><style>* { ${variables(64)} } ${primaryCss}${rules}</style><body>${`<button class="${classes}">Get started</button>`.repeat(1200)}</body></html>`
  const candidates = await extractWithinLimits(html)
  assert.ok(
    candidates.some(({ color, score }) => color === "#0036ff" && score === 80)
  )
})

it("discards CSS evidence when many local overrides multiply inherited maps", async () => {
  const html = `<html><style>:root { ${variables(1000)} } ${primaryCss}</style><body>${Array.from({ length: 2000 }, (_, i) => `<button class="primary" style="--local:${i}">Get started</button>`).join("")}</body></html>`
  assert.deepEqual(await extractWithinLimits(html), [])
})

it("bounds declarations multiplied across matching elements", async () => {
  const html = `<html><style>${primaryCss} * { ${variables(500)} }</style><body>${primary.repeat(2000)}</body></html>`
  assert.deepEqual(await extractWithinLimits(html), [])
})

it("bounds selector work even when expensive rules do not match", async () => {
  const rules = Array.from(
    { length: 2000 },
    (_, i) => `html body .absent-${i} { color:red }`
  ).join("")
  const html = `<html><style>${primaryCss}${rules}</style><body>${primary.repeat(4000)}</body></html>`
  assert.deepEqual(await extractWithinLimits(html), [])
})

it("bounds repeated variable resolution even when expansion produces no text", async () => {
  const aliases = Array.from(
    { length: 23 },
    (_, i) => `--v${i + 1}:var(--v${i}) var(--v${i})`
  ).join(";")
  const html = `<html><style>:root { --v0:; ${aliases} } ${primaryCss}</style><body>${primary}</body></html>`
  assert.deepEqual(await extractWithinLimits(html), [])
})

it("bounds the combined CSS parsed across separate style blocks", async () => {
  const html = `<html><style>${primaryCss}</style>${`<style>/*${"x".repeat(64 * 1024)}*/</style>`.repeat(12)}<body>${primary}</body></html>`
  assert.deepEqual(await extractWithinLimits(html), [])
})
