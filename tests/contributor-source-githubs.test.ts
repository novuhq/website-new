import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  getSourceGithubs,
  resolveSourceGithub,
} from "@/lib/contributors/source-githubs"

describe("contributor source GitHub handles", () => {
  it("maps mixed-case handles to the casing the API stores", () => {
    const sourceGithubs = getSourceGithubs([
      { github: "mayorjay", sourceGithub: "mayorJAY", totalPulls: 3 },
      { github: "devxprite", sourceGithub: "devxprite", totalPulls: 1 },
    ])

    assert.deepEqual(sourceGithubs, { mayorjay: "mayorJAY" })
    assert.equal(resolveSourceGithub(sourceGithubs, "mayorjay"), "mayorJAY")
    assert.equal(resolveSourceGithub(sourceGithubs, "devxprite"), "devxprite")
  })

  it("picks the duplicate with the most pull requests", () => {
    const sourceGithubs = getSourceGithubs([
      { github: "j-rayx", sourceGithub: "J-rayX", totalPulls: 1 },
      { github: "j-rayx", sourceGithub: "j-rayX", totalPulls: 0 },
      { github: "hitblast", sourceGithub: "hitblast", totalPulls: 1 },
      { github: "hitblast", sourceGithub: "HitBlast", totalPulls: 0 },
    ])

    assert.deepEqual(sourceGithubs, { "j-rayx": "J-rayX" })
  })

  it("keeps the first duplicate on a tie", () => {
    const sourceGithubs = getSourceGithubs([
      { github: "immattdavison", sourceGithub: "immattdavison", totalPulls: 3 },
      { github: "immattdavison", sourceGithub: "ImMattDavison", totalPulls: 3 },
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
