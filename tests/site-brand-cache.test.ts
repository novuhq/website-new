import assert from "node:assert/strict"
import { it } from "node:test"

import { createCachedReader } from "@/lib/site-brand/cache"

it("deduplicates in-flight work and expires successful values", async () => {
  let now = 0
  let reads = 0
  const read = createCachedReader({
    read: async () => ({ value: ++reads, cacheable: true }),
    ttl: () => 100,
    now: () => now,
  })
  assert.deepEqual(await Promise.all([read("a"), read("a")]), [1, 1])
  now = 99
  assert.equal(await read("a"), 1)
  now = 100
  assert.equal(await read("a"), 2)
})

it("does not retain failed or explicitly uncacheable work", async () => {
  let attempts = 0
  const read = createCachedReader({
    read: async () => {
      if (++attempts === 1) throw new Error("upstream failed")
      return { value: attempts, cacheable: false }
    },
    ttl: () => 100,
  })
  await assert.rejects(read("a"), /upstream failed/)
  assert.equal(await read("a"), 2)
  assert.equal(await read("a"), 3)
})

it("evicts the least recently used entry when the count limit is reached", async () => {
  let reads = 0
  const read = createCachedReader({
    read: async (key) => ({ value: `${key}:${++reads}`, cacheable: true }),
    ttl: () => 1000,
    maxEntries: 2,
  })
  await read("a")
  await read("b")
  await read("a")
  await read("c")
  assert.equal(await read("a"), "a:1")
  assert.equal(await read("b"), "b:4")
})

it("bounds total retained bytes and skips a value larger than the budget", async () => {
  let reads = 0
  const read = createCachedReader({
    read: async (key) => ({ value: `${key}${++reads}`, cacheable: true }),
    ttl: () => 1000,
    maxBytes: 10,
  })
  await read("aaa")
  await read("bbb")
  assert.equal(await read("aaa"), "aaa3")
  assert.equal(
    await read("a-value-larger-than-the-budget"),
    "a-value-larger-than-the-budget4"
  )
  assert.equal(
    await read("a-value-larger-than-the-budget"),
    "a-value-larger-than-the-budget5"
  )
})

it("uses a shorter lifetime for profiles without an accent", async () => {
  let now = 0
  let reads = 0
  const read = createCachedReader({
    read: async (key) => ({
      value: {
        accent: key === "neutral" ? null : "#0036ff",
        revision: ++reads,
      },
      cacheable: true,
    }),
    ttl: (value) => (value.accent ? 100 : 10),
    now: () => now,
  })
  await read("neutral")
  await read("color")
  now = 11
  assert.equal((await read("neutral")).revision, 3)
  assert.equal((await read("color")).revision, 2)
})
