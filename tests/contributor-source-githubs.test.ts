import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
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
