import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  getAllWebChatBuilderSlugs,
  getWebChatBuilderBySlug,
  getWebChatBuilderPathname,
  resolveWebChatBuilderMedia,
  type IWebChatBuilderPage,
} from "@/data/pages/web-chat-builders"

describe("Web Chat builder pages", () => {
  it("publishes Webflow as the only initial builder", () => {
    assert.deepEqual(getAllWebChatBuilderSlugs(), ["webflow"])
    assert.equal(getWebChatBuilderBySlug("webflow")?.builderName, "Webflow")
    assert.equal(
      getWebChatBuilderPathname("webflow"),
      "/channels/web-chat/webflow"
    )
  })

  it("returns undefined for an unpublished builder", () => {
    assert.equal(getWebChatBuilderBySlug("wix"), undefined)
  })

  for (const slug of ["toString", "constructor", "__proto__"]) {
    it(`returns undefined for the inherited property name ${slug}`, () => {
      assert.equal(getWebChatBuilderBySlug(slug), undefined)
    })
  }

  it("resolves each artwork slot from an unpublished page's media references", () => {
    const webflow = getWebChatBuilderBySlug("webflow")!
    assert.deepEqual(webflow.media, {
      hero: "webflow-hero",
      channels: "webflow-channels",
    })
    const fixture = {
      ...webflow,
      slug: "unpublished-media-fixture",
      builderName: "Unpublished fixture",
      media: { hero: "webflow-channels", channels: "webflow-hero" },
    } satisfies IWebChatBuilderPage
    const artwork = {
      "webflow-hero": { id: "hero-artwork" },
      "webflow-channels": { id: "channels-artwork" },
    }

    assert.deepEqual(resolveWebChatBuilderMedia(fixture.media, artwork), {
      hero: { id: "channels-artwork" },
      channels: { id: "hero-artwork" },
    })
    assert.equal(getWebChatBuilderBySlug(fixture.slug), undefined)
    assert.deepEqual(getAllWebChatBuilderSlugs(), ["webflow"])
  })
})
