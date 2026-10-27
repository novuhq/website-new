import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  createSourceGithubResolver,
  getSourceGithubs,
  resolveSourceGithub,
  type ContributorHandle,
} from "@/lib/contributors/source-githubs"

function handle(
  sourceGithub: string,
  totalPulls: number,
  teammate = false
): ContributorHandle {
  return {
    github: sourceGithub.toLowerCase(),
    sourceGithub,
    teammate,
    totalPulls,
  }
}

describe("contributor source GitHub handles", () => {
  it("maps mixed-case handles to the casing the API stores", () => {
    const sourceGithubs = getSourceGithubs([
      handle("mayorJAY", 3),
      handle("devxprite", 1),
    ])

    assert.deepEqual(sourceGithubs, { mayorjay: "mayorJAY" })
    assert.equal(resolveSourceGithub(sourceGithubs, "mayorjay"), "mayorJAY")
    assert.equal(resolveSourceGithub(sourceGithubs, "devxprite"), "devxprite")
  })

  it("picks the duplicate with the most pull requests", () => {
    const sourceGithubs = getSourceGithubs([
      handle("J-rayX", 1),
      handle("j-rayX", 0),
      handle("hitblast", 1),
      handle("HitBlast", 0),
    ])

    assert.deepEqual(sourceGithubs, { "j-rayx": "J-rayX" })
  })

  it("keeps the first duplicate on a tie", () => {
    const sourceGithubs = getSourceGithubs([
      handle("immattdavison", 3),
      handle("ImMattDavison", 3),
    ])

    assert.deepEqual(sourceGithubs, {})
  })

  it("prefers a community duplicate over a teammate one", () => {
    const sourceGithubs = getSourceGithubs([
      handle("BolotskyDev", 5, true),
      handle("bolotskydev", 2),
    ])

    assert.deepEqual(sourceGithubs, {})

    const reversed = getSourceGithubs([
      handle("bolotskydev", 2),
      handle("BolotskyDev", 5, true),
    ])

    assert.deepEqual(reversed, {})
  })

  it("ignores inherited object keys", () => {
    const sourceGithubs = getSourceGithubs([])

    assert.equal(
      resolveSourceGithub(sourceGithubs, "constructor"),
      "constructor"
    )
    assert.equal(resolveSourceGithub(sourceGithubs, "tostring"), "tostring")
  })
})

describe("contributor source GitHub resolver", () => {
  it("resolves handles through the contributors list", async () => {
    const resolve = createSourceGithubResolver(
      async () => ({ mayorjay: "mayorJAY" }),
      { retryAfterMs: 30_000 }
    )

    assert.equal(await resolve("mayorjay"), "mayorJAY")
    assert.equal(await resolve("devxprite"), "devxprite")
  })

  it("falls back to the lowercase handle and pauses the list after a failure", async () => {
    let time = 0
    let loads = 0
    let listAvailable = false
    const resolve = createSourceGithubResolver(
      async () => {
        loads++
        if (!listAvailable)
          throw new Error("Contributors API list is unavailable")
        return { mayorjay: "mayorJAY" }
      },
      { retryAfterMs: 30_000, now: () => time }
    )

    assert.equal(await resolve("mayorjay"), "mayorjay")
    assert.equal(loads, 1)

    listAvailable = true
    time = 29_999
    assert.equal(await resolve("mayorjay"), "mayorjay")
    assert.equal(loads, 1)

    time = 30_000
    assert.equal(await resolve("mayorjay"), "mayorJAY")
    assert.equal(loads, 2)
  })
})
