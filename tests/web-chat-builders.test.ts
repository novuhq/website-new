import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  getAllWebChatBuilderSlugs,
  getWebChatBuilderBySlug,
  getWebChatBuilderPathname,
} from "@/data/pages/web-chat-builders"

describe("Web Chat builder pages", () => {
  it("publishes every launched builder with its Figma hero title", () => {
    const builders = [
      ["lovable", "Lovable", "Add an AI agent to your Lovable app"],
      ["v0", "v0", "Add an AI agent to your v0 app"],
    ] as const

    assert.deepEqual(
      getAllWebChatBuilderSlugs(),
      builders.map(([slug]) => slug)
    )

    for (const [slug, builderName, title] of builders) {
      const page = getWebChatBuilderBySlug(slug)

      assert.equal(page?.builderName, builderName)
      assert.equal(page?.hero.title, title)
      assert.equal(
        getWebChatBuilderPathname(slug),
        `/channels/web-chat/${slug}`
      )
    }
  })

  it("returns undefined for an unpublished builder", () => {
    assert.equal(getWebChatBuilderBySlug("wix"), undefined)
  })

  it("does not publish the retired builders", () => {
    for (const slug of [
      "webflow",
      "blink-new",
      "replit",
      "bolt-new",
      "sim-studio",
      "vellum",
      "flowise",
      "wordware",
      "crew-ai",
      "langgraph",
      "lindy",
      "stack-ai",
      "relevance-ai",
    ]) {
      assert.equal(getWebChatBuilderBySlug(slug), undefined, slug)
    }
    assert.equal(getAllWebChatBuilderSlugs().length, 2)
  })

  it("personalizes shared copy for each builder", () => {
    const lovable = getWebChatBuilderBySlug("lovable")!

    assert.equal(
      lovable.sections[0].title,
      "Your agent, live in your Lovable app"
    )
    assert.equal(lovable.cta.title, "Give your Lovable app an AI agent")
    assert.equal(
      lovable.faq[0].question,
      "How do I add an AI chatbot to a Lovable app?"
    )
    const lovableChannels = lovable.sections.find(
      (section) => section.type === "tertiary"
    )!
    assert.equal(
      lovableChannels.imageAlt,
      "Your Lovable app is just the beginning!"
    )

    for (const slug of getAllWebChatBuilderSlugs()) {
      const page = getWebChatBuilderBySlug(slug)!
      const renderedCopy = JSON.stringify({
        seo: page.seo,
        hero: page.hero,
        sections: page.sections,
        faqTitle: page.faqTitle,
        faq: page.faq,
        cta: page.cta,
      })

      assert.doesNotMatch(renderedCopy, /webflow/i, slug)
    }
  })

  for (const slug of ["toString", "constructor", "__proto__"]) {
    it(`returns undefined for the inherited property name ${slug}`, () => {
      assert.equal(getWebChatBuilderBySlug(slug), undefined)
    })
  }
})
