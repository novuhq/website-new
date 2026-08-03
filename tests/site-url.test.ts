import assert from "node:assert/strict"
import { afterEach, beforeEach, describe, it } from "node:test"

import { getMetadata } from "@/lib/get-metadata"
import {
  absoluteUrl,
  getSiteUrl,
  toCanonicalPathname,
  toMarkdownPathname,
} from "@/lib/site-url"

const originalSiteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL
const originalVercelEnv = process.env.VERCEL_ENV
const originalVercelBranchUrl = process.env.VERCEL_BRANCH_URL
const originalVercelUrl = process.env.VERCEL_URL

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name]
  } else {
    process.env[name] = value
  }
}

beforeEach(() => {
  delete process.env.VERCEL_ENV
  delete process.env.VERCEL_BRANCH_URL
  delete process.env.VERCEL_URL
})

afterEach(() => {
  restoreEnv("NEXT_PUBLIC_DEFAULT_SITE_URL", originalSiteUrl)
  restoreEnv("VERCEL_ENV", originalVercelEnv)
  restoreEnv("VERCEL_BRANCH_URL", originalVercelBranchUrl)
  restoreEnv("VERCEL_URL", originalVercelUrl)
})

describe("site URL helpers", () => {
  it("uses the production URL when no override is configured", () => {
    delete process.env.NEXT_PUBLIC_DEFAULT_SITE_URL

    assert.equal(getSiteUrl(), "https://novu.co")
    assert.equal(
      absoluteUrl("/channels/slack/"),
      "https://novu.co/channels/slack/"
    )
  })

  it("normalizes configured origins and canonical paths", () => {
    process.env.NEXT_PUBLIC_DEFAULT_SITE_URL = "http://localhost:3007/"

    assert.equal(getSiteUrl(), "http://localhost:3007")
    assert.equal(toCanonicalPathname("channels/slack"), "/channels/slack/")
    assert.equal(toMarkdownPathname("/channels/slack/"), "/channels/slack.md")
  })

  it("uses the branch URL for Vercel preview deployments", () => {
    process.env.NEXT_PUBLIC_DEFAULT_SITE_URL = "https://novu.co"
    process.env.VERCEL_ENV = "preview"
    process.env.VERCEL_BRANCH_URL =
      "website-new-git-hero-local-novuhq.vercel.app"

    assert.equal(
      getSiteUrl(),
      "https://website-new-git-hero-local-novuhq.vercel.app"
    )
    assert.equal(
      absoluteUrl("/social-previews/index.jpg"),
      "https://website-new-git-hero-local-novuhq.vercel.app/social-previews/index.jpg"
    )
  })

  it("keeps the configured public URL for Vercel production deployments", () => {
    process.env.NEXT_PUBLIC_DEFAULT_SITE_URL = "https://novu.co"
    process.env.VERCEL_ENV = "production"
    process.env.VERCEL_BRANCH_URL = "website-new-git-main-novuhq.vercel.app"

    assert.equal(getSiteUrl(), "https://novu.co")
  })

  it("rejects non-http site URLs", () => {
    process.env.NEXT_PUBLIC_DEFAULT_SITE_URL = "javascript:alert(1)"

    assert.throws(() => getSiteUrl(), /must use http or https/)
  })
})

describe("metadata URL generation", () => {
  it("keeps canonical, markdown, social image and manifest URLs aligned", () => {
    process.env.NEXT_PUBLIC_DEFAULT_SITE_URL = "https://preview.novu.co/"

    const metadata = getMetadata({
      title: "Slack",
      description: "Connect Slack",
      pathname: "/channels/slack",
      imagePath: "/api/og?title=Slack",
      markdownPathname: true,
    })

    assert.equal(
      metadata.alternates?.canonical,
      "https://preview.novu.co/channels/slack/"
    )
    assert.deepEqual(metadata.alternates?.types, {
      "text/markdown": "https://preview.novu.co/channels/slack.md",
    })
    assert.equal(
      metadata.openGraph?.url,
      "https://preview.novu.co/channels/slack/"
    )
    assert.equal(metadata.manifest, "https://preview.novu.co/manifest.json")
  })

  it("removes markdown alternates and indexing for private pages", () => {
    const metadata = getMetadata({
      pathname: "/customers/draft",
      markdownPathname: true,
      noIndex: true,
    })

    assert.equal(metadata.alternates?.types, undefined)
    assert.deepEqual(metadata.robots, { index: false, follow: false })
  })
})
