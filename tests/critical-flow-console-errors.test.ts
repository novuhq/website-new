import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { isExpectedBrowserConsoleError } from "./critical-flows/console-errors"

describe("critical-flow browser console errors", () => {
  it("recognizes browser-generated report-only CSP diagnostics", () => {
    const cases: [message: string, sourceUrl?: string][] = [
      [
        "[Report Only] Refused to load https://www.google.com/pagead/1p-user-list/16864812041/?random=123 because it does not appear in the img-src directive of the Content Security Policy.",
      ],
      [
        "[Report Only] Refused to connect to https://px.ads.linkedin.com/wa/?medium=fetch&fmt=g because it does not appear in the connect-src directive of the Content Security Policy.",
      ],
      [
        "[Report Only] Refused to load https://novu.co/broken.png because it does not appear in the img-src directive of the Content Security Policy.",
      ],
      [
        "[Report Only] Refused to load https://analytics.ahrefs.com/analytics.js because it does not appear in the script-src directive of the Content Security Policy.",
      ],
      [
        "The Content Security Policy 'default-src self' was delivered in report-only mode, but does not specify a 'report-to'; the policy will have no effect. Please either add a 'report-to' directive, or deliver the policy via the 'Content-Security-Policy' header.",
      ],
      ["Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector"],
      [
        "Failed to load resource: the server responded with a status of 403 ()",
        "https://ddwl4m2hdecbv.cloudfront.net/b/GOYPYHQGXDOX/GOYPYHQGXDOX.js.gz",
      ],
      [
        "Failed to load resource: The network connection was lost.",
        "https://cdn.segment.com/analytics.js/v1/test/analytics.min.js",
      ],
    ]

    for (const [message, sourceUrl] of cases) {
      assert.equal(isExpectedBrowserConsoleError(message, sourceUrl), true)
    }
  })

  it("retains enforced CSP and ordinary console errors", () => {
    const cases: [message: string, sourceUrl?: string][] = [
      [
        "Refused to load https://www.google.com/pagead/pixel because it does not appear in the img-src directive of the Content Security Policy.",
      ],
      [
        "[Report Only] Refused to load javascript:alert(1) because it does not appear in the script-src directive of the Content Security Policy.",
      ],
      [
        "[Report Only] Refused to load https://novu.co/broken.png because it does not appear in the img-src directive of another policy.",
      ],
      ["Failed to load resource: the server responded with a status of 403 ()"],
      [
        "Failed to load resource: the server responded with a status of 403 ()",
        "https://novu.co/api/search",
      ],
      [
        "Failed to load resource: the server responded with a status of 403 ()",
        "https://ddwl4m2hdecbv.cloudfront.net.evil.invalid/b/GOYPYHQGXDOX/script.js",
      ],
      ["Application crashed"],
    ]

    for (const [message, sourceUrl] of cases) {
      assert.equal(isExpectedBrowserConsoleError(message, sourceUrl), false)
    }
  })
})
