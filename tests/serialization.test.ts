import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { safeJsonLdStringify } from "@/lib/json-ld"
import {
  escapeMarkdownText,
  formatMarkdownLink,
  safeMarkdownUrl,
} from "@/lib/markdown/markdown-format"
import { getAgentTemplateUrl } from "@/lib/templates/url"

describe("JSON-LD serialization", () => {
  it("escapes script-breaking characters", () => {
    const serialized = safeJsonLdStringify({
      value: "</script><script>alert('&')</script>",
    })

    assert.equal(serialized.includes("</script>"), false)
    assert.match(serialized, /\\u003c\/script\\u003e/)
    assert.match(serialized, /\\u0026/)
  })
})

describe("Markdown serialization", () => {
  it("escapes Sanity-authored Markdown control characters", () => {
    assert.equal(
      escapeMarkdownText("[Template] <script> `code`"),
      "\\[Template\\] &lt;script&gt; \\`code\\`"
    )
  })

  it("rejects unsafe links", () => {
    assert.equal(safeMarkdownUrl("javascript:alert(1)"), null)
    assert.equal(formatMarkdownLink("Open", "javascript:alert(1)"), "Open")
  })

  it("encodes template IDs as query parameters", () => {
    assert.equal(
      getAgentTemplateUrl("support & sales"),
      "https://connect.novu.co/?agentTemplateId=support+%26+sales"
    )
  })
})
