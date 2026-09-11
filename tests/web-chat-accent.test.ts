import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  accentForeground,
  DEFAULT_ACCENT,
  normalizeHex,
  relativeLuminance,
} from "@/lib/accent"
import { brandCssVars, buildBrandTheme } from "@/lib/web-chat-theme"

describe("normalizeHex", () => {
  it("expands shorthand and adds the leading hash", () => {
    assert.equal(normalizeHex("abc"), "#aabbcc")
    assert.equal(normalizeHex("#ABC"), "#aabbcc")
  })

  it("lowercases six-digit values", () => {
    assert.equal(normalizeHex("#E65006"), "#e65006")
  })

  it("returns null for values that are not hex colours", () => {
    assert.equal(normalizeHex(""), null)
    assert.equal(normalizeHex("rebeccapurple"), null)
    assert.equal(normalizeHex("#12345"), null)
    assert.equal(normalizeHex("#gggggg"), null)
  })
})

describe("relativeLuminance", () => {
  it("puts white at 1 and black at 0", () => {
    assert.equal(relativeLuminance("#ffffff"), 1)
    assert.equal(relativeLuminance("#000000"), 0)
  })

  it("orders brand accents between black and white", () => {
    const orange = relativeLuminance("#e65006")
    const paleYellow = relativeLuminance("#ffe066")

    assert.ok(orange > 0 && orange < 1)
    assert.ok(paleYellow > orange)
  })
})

describe("accentForeground", () => {
  it("keeps white on the Figma reference accents", () => {
    assert.equal(accentForeground("#e65006"), "#ffffff")
    assert.equal(accentForeground("#0036ff"), "#ffffff")
    assert.equal(accentForeground(DEFAULT_ACCENT), "#ffffff")
  })

  it("switches to black on a pale accent", () => {
    assert.equal(accentForeground("#ffe066"), "#000000")
  })
})

describe("buildBrandTheme", () => {
  it("falls back to the default accent when extraction produced nothing", () => {
    assert.equal(buildBrandTheme(null).accent, DEFAULT_ACCENT)
    assert.equal(buildBrandTheme(undefined).accent, DEFAULT_ACCENT)
    assert.equal(buildBrandTheme("not-a-colour").accent, DEFAULT_ACCENT)
  })

  it("normalizes a supplied accent and derives its foreground", () => {
    const theme = buildBrandTheme("#E65006")

    assert.equal(theme.accent, "#e65006")
    assert.equal(theme.accentForeground, "#ffffff")
  })

  it("derives a translucent soft variant of the accent", () => {
    assert.equal(buildBrandTheme("#e65006").accentSoft, "#e650061f")
    // Measured off `hero-personalization-05` (`45487-89814`).
    assert.equal(buildBrandTheme("#e65006").accentRow, "#e6500630")
    assert.equal(buildBrandTheme("#e65006").accentNav, "#e65006b8")
  })
})

describe("brandCssVars", () => {
  it("maps a theme onto the page's custom properties", () => {
    assert.deepEqual(brandCssVars(buildBrandTheme("#0036ff")), {
      "--wc-accent": "#0036ff",
      "--wc-accent-foreground": "#ffffff",
      "--wc-accent-soft": "#0036ff1f",
      "--wc-accent-row": "#0036ff30",
      "--wc-accent-nav": "#0036ffb8",
      "--wc-hue": "#0036ff",
    })
  })
})
