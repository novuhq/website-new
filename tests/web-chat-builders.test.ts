import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  getAllWebChatBuilderSlugs,
  getWebChatBuilderBySlug,
} from "@/data/pages/web-chat-builders"

describe("Web Chat builder pages", () => {
  it("publishes Webflow as the only initial builder", () => {
    assert.deepEqual(getAllWebChatBuilderSlugs(), ["webflow"])
    assert.equal(getWebChatBuilderBySlug("webflow")?.builderName, "Webflow")
  })

  it("returns undefined for an unpublished builder", () => {
    assert.equal(getWebChatBuilderBySlug("wix"), undefined)
  })
})
