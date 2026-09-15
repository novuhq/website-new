import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  getAllWebChatBuilderSlugs,
  getWebChatBuilderBySlug,
  getWebChatBuilderPathname,
  resolveWebChatBuilderMedia,
  type IWebChatBuilderPage,
  type WebChatBuilderMediaKey,
} from "@/data/pages/web-chat-builders"

describe("Web Chat builder pages", () => {
  it("publishes every designed builder with its Figma hero title", () => {
    const builders = [
      ["webflow", "Webflow", "Add an AI agent to your Webflow site"],
      ["blink-new", "Blink.new", "Add an AI agent to your Blink.new app"],
      ["lovable", "Lovable", "Add an AI agent to your Lovable app"],
      ["replit", "Replit", "Add an AI agent to your Replit app"],
      ["bolt-new", "Bolt.new", "Add an AI agent to your Bolt.new app"],
      ["sim-studio", "Sim Studio", "Add your Sim agent to your website"],
      ["vellum", "Vellum", "Add your Vellum agent to your website"],
      ["flowise", "Flowise", "Add your Flowise agent to your website"],
      ["wordware", "Wordware", "Add your Wordware agent to your website"],
      ["crew-ai", "CrewAI", "Add your CrewAI agent to your website"],
      ["langgraph", "LangGraph", "Add your LangGraph agent to your website"],
      ["lindy", "Lindy", "Add your Lindy agent to your website"],
      ["stack-ai", "Stack AI", "Add your Stack AI agent to your website"],
      [
        "relevance-ai",
        "Relevance AI",
        "Add your Relevance AI agent to your website",
      ],
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
      media: {
        hero: "blink-new-hero",
        channels: "webflow-channels",
      },
    } satisfies IWebChatBuilderPage
    const artwork = Object.fromEntries(
      getAllWebChatBuilderSlugs()
        .map((slug) => getWebChatBuilderBySlug(slug)!)
        .flatMap(({ media }) => [media.hero, media.channels])
        .map((key) => [key, { id: key }])
    ) as Record<WebChatBuilderMediaKey, { id: string }>

    assert.deepEqual(resolveWebChatBuilderMedia(fixture.media, artwork), {
      hero: { id: "blink-new-hero" },
      channels: { id: "webflow-channels" },
    })
    assert.equal(getWebChatBuilderBySlug(fixture.slug), undefined)
    assert.equal(getAllWebChatBuilderSlugs().length, 14)
  })
})
