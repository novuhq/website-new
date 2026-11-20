import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { normalizeDashboardUrl } from "@/lib/normalize-dashboard-url"

describe("normalizeDashboardUrl", () => {
  it("keeps dashboard sign-up and sign-in paths", () => {
    assert.equal(
      normalizeDashboardUrl("https://dashboard.novu.co/auth/sign-up"),
      "https://dashboard.novu.co/auth/sign-up"
    )
    assert.equal(
      normalizeDashboardUrl(
        "https://dashboard.novu.co/auth/sign-up?product_type=agents"
      ),
      "https://dashboard.novu.co/auth/sign-up?product_type=agents"
    )
    assert.equal(
      normalizeDashboardUrl("https://dashboard.novu.co/auth/sign-in"),
      "https://dashboard.novu.co/auth/sign-in"
    )
  })

  it("rewrites the legacy dashboard host while keeping auth paths", () => {
    assert.equal(
      normalizeDashboardUrl("https://dashboard-v2.novu.co/auth/sign-up"),
      "https://dashboard.novu.co/auth/sign-up"
    )
    assert.equal(
      normalizeDashboardUrl("https://dashboard-v2.novu.co/"),
      "https://dashboard.novu.co"
    )
  })
})
