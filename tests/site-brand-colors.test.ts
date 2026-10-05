import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { htmlToDOM } from "html-react-parser"

import {
  normalizeColor,
  selectAccent,
  type AccentCandidate,
} from "@/lib/site-brand/colors"
import { collectCssCandidates } from "@/lib/site-brand/css"

function extract(html: string, ...stylesheets: string[]) {
  return selectAccent(collectCssCandidates(htmlToDOM(html), stylesheets))
}

const candidate = (
  color: string,
  score: number,
  source: AccentCandidate["source"] = "css"
): AccentCandidate => ({ color, score, source, reason: "fixture" })

describe("normalizeColor", () => {
  const samples = [
    [" #F06 ", "#ff0066"],
    ["rebeccapurple", "#663399"],
    ["rgb(0 54 255)", "#0036ff"],
    ["rgba(255, 0, 0, 1)", "#ff0000"],
    ["hsl(240 100% 50%)", "#0000ff"],
    ["lab(50% 60 30)", "#d43d49"],
    ["oklch(60% 0.2 30)", "#de3e2d"],
    ["color(display-p3 .0118 .2067 .9861)", "#0036ff"],
    ["#0036ffff", "#0036ff"],
  ]
  for (const [input, expected] of samples) {
    it(`converts ${input} to opaque sRGB`, () => {
      assert.equal(normalizeColor(input), expected)
    })
  }

  it("rejects ambiguous transparency, unresolved and unsupported expressions", () => {
    for (const input of [
      "transparent",
      "#0036ff80",
      "rgb(255 0 0 / .9)",
      "currentColor",
      "inherit",
      "240 100% 50%",
      "var(--primary)",
      "",
      "color-mix(in srgb, red, blue)",
      "rgb(none 0 255)",
      "not-a-color",
    ])
      assert.equal(normalizeColor(input), null, input)
  })
})

describe("selectAccent", () => {
  it("skips neutral and invalid metadata before preferring usable metadata", () => {
    assert.deepEqual(
      selectAccent([
        candidate("white", 50, "meta"),
        candidate("broken", 50, "meta"),
        candidate("#f15406", 45, "manifest"),
        candidate("#0036ff", 40, "meta"),
      ]),
      { color: "#f15406", source: "manifest" }
    )
  })

  it("prefers CTA evidence over metadata without adjusting the extracted color", () => {
    assert.deepEqual(
      selectAccent([
        candidate("#ec3c00", 80),
        candidate("#0036ff", 50, "meta"),
      ]),
      { color: "#ec3c00", source: "css" }
    )
  })

  it("requires sufficient confidence and chroma", () => {
    for (const values of [
      [],
      [candidate("#0036ff", 20)],
      [candidate("#111111", 80)],
      [candidate("#f1f1f2", 80)],
    ]) {
      assert.deepEqual(selectAccent(values), { color: null, source: null })
    }
  })

  it("does not count repeated or equivalent declarations as extra votes", () => {
    assert.deepEqual(
      selectAccent([
        ...Array.from({ length: 20 }, () => candidate("#0036ff", 80)),
        candidate("color(display-p3 .0118 .2067 .9861)", 80),
        candidate("#ec3c00", 80),
      ]),
      { color: null, source: null }
    )
  })

  it("returns no accent for comparably strong conflicting colors", () => {
    assert.deepEqual(
      selectAccent([candidate("#0036ff", 80), candidate("#ec3c00", 79)]),
      { color: null, source: null }
    )
  })

  it("groups modern-color rounding differences", () => {
    assert.deepEqual(
      selectAccent([candidate("#0036ff", 80), candidate("#0035ff", 80)]),
      { color: "#0036ff", source: "css" }
    )
  })
})

describe("collectCssCandidates", () => {
  it("clears inherited alias provenance when a local literal has the same color", () => {
    assert.deepEqual(
      extract(`<html><style>
        :root { --danger:#f15406; --brand:var(--danger) }
        .primary { --brand:#f15406; background:var(--brand) }
      </style><body><button class="primary">Get started</button></body></html>`),
      { color: "#f15406", source: "css" }
    )
  })

  it("preserves inline and linked stylesheet order in the document", () => {
    const linked = {
      href: "/brand.css",
      css: ".primary { background:#ec3c00 }",
    }
    const inline = "<style>.primary { background:#0036ff }</style>"
    const link = '<link rel="stylesheet" href="/brand.css">'
    const action = '<body><button class="primary">Get started</button></body>'
    assert.deepEqual(
      selectAccent(
        collectCssCandidates(
          htmlToDOM(`<html><head>${inline}${link}</head>${action}</html>`),
          [linked]
        )
      ),
      { color: "#ec3c00", source: "css" }
    )
    assert.deepEqual(
      selectAccent(
        collectCssCandidates(
          htmlToDOM(`<html><head>${link}${inline}</head>${action}</html>`),
          [linked]
        )
      ),
      { color: "#0036ff", source: "css" }
    )
  })

  it("skips linked and inline styles with conditional media", () => {
    assert.deepEqual(
      selectAccent(
        collectCssCandidates(
          htmlToDOM(
            '<html><head><link rel="stylesheet" href="/brand.css" media="(prefers-color-scheme:dark)"><style media="(min-width:800px)">.primary { background:#0036ff }</style></head><body><button class="primary">Get started</button></body></html>'
          ),
          [{ href: "/brand.css", css: ".primary { background:#ec3c00 }" }]
        )
      ),
      { color: null, source: null }
    )
  })

  for (const media of ["screen", " ScReEn ", " ALL "]) {
    for (const source of ["link", "style"]) {
      it(`accepts unconditional ${media} media on a ${source}`, () => {
        const css = ".primary { background:#0036ff }"
        const stylesheet =
          source === "link"
            ? `<link rel="stylesheet" href="/brand.css" media="${media}">`
            : `<style media="${media}">${css}</style>`
        const nodes = htmlToDOM(
          `<html><head>${stylesheet}</head><body><button class="primary">Get started</button></body></html>`
        )
        assert.deepEqual(
          selectAccent(
            collectCssCandidates(nodes, [{ href: "/brand.css", css }])
          ),
          { color: "#0036ff", source: "css" }
        )
      })
    }
  }

  it("recognizes ToDesktop's inline primary-button hex and Display P3 fallback", () => {
    assert.deepEqual(
      extract(`<html><body>
      <style hidden>.button-primary { background:#0036ff; background:color(display-p3 .0118 .2067 .9861) }</style>
      <button class="button-primary"><span>Sign up</span></button>
    </body></html>`),
      { color: "#0036ff", source: "css" }
    )
  })

  it("resolves Recent-style variables only when a matching background consumes them", () => {
    assert.deepEqual(
      extract(
        '<html><body><div class="brand-marker"></div></body></html>',
        `
      :root { --accent:#ec3c00; --brand-red:#f15406; --primary:#eee }
      .brand-marker { background-color:var(--accent) }
      .bg-primary { background-color:var(--primary) }
    `
      ),
      { color: "#ec3c00", source: "css" }
    )
  })

  it("does not promote unused root tokens or primary utility rules", () => {
    assert.deepEqual(
      extract(
        "<html><body><p>Product</p></body></html>",
        `
      :root { --primary:#0036ff; --accent:#ec3c00 }
      .bg-primary { background:var(--primary) }
      .button-primary { background:#f15406 }
    `
      ),
      { color: null, source: null }
    )
  })

  it("requires an hsl consumer for bare HSL channels", () => {
    const html =
      '<html><body><button class="cta">Get started</button></body></html>'
    assert.deepEqual(
      extract(
        html,
        ":root { --primary:240 100% 50% }.cta { background:hsl(var(--primary)) }"
      ),
      { color: "#0000ff", source: "css" }
    )
    assert.deepEqual(
      extract(
        html,
        ":root { --primary:240 100% 50% }.cta { background:var(--primary) }"
      ),
      { color: null, source: null }
    )
  })

  it("uses active theme variables and inherits local overrides", () => {
    assert.deepEqual(
      extract(
        '<html class="light"><body><section style="--accent:#f15406"><a href="/signup" class="cta">Get started</a></section></body></html>',
        `
      :root { --accent:#0036ff } .dark { --accent:#a020f0 } .light { --accent:#ec3c00 }
      .cta { background:var(--accent) }
    `
      ),
      { color: "#f15406", source: "css" }
    )
  })

  it("resolves nested variables and fallbacks", () => {
    assert.deepEqual(
      extract(
        '<html><body><button style="background:var(--missing, var(--button-color, rgb(0 54 255)))">Get started</button></body></html>'
      ),
      { color: "#0036ff", source: "css" }
    )
  })

  it("rejects variable cycles without hanging", () => {
    assert.deepEqual(
      extract(
        '<html><body><button class="cta">Get started</button></body></html>',
        `
      :root { --accent:var(--other); --other:var(--accent) }
      .cta { background:var(--accent) }
    `
      ),
      { color: null, source: null }
    )
  })

  it("ignores foreground, status, destructive, and unrelated component evidence", () => {
    assert.deepEqual(
      extract(
        '<html><body><button class="primary">Get started</button><button class="button-destructive">Delete account</button><aside class="sidebar"></aside></body></html>',
        `
      :root { --primary-foreground:#0036ff; --destructive:#ff0000; --sidebar-primary:#ec3c00 }
      .primary { color:var(--primary-foreground); border-color:#0036ff; background:var(--primary-foreground) }
      .button-destructive { background:var(--destructive) }
      .sidebar { background:var(--sidebar-primary) }
    `
      ),
      { color: null, source: null }
    )
  })

  it("does not reject valid shadcn CTA backgrounds because of foreground/state utility names", () => {
    assert.deepEqual(
      extract(
        '<html><body><button class="bg-primary text-primary-foreground aria-invalid:border-destructive">Get started</button></body></html>',
        `
      :root { --primary:#0036ff; --primary-foreground:white }
      .bg-primary { background:var(--primary) }
    `
      ),
      { color: "#0036ff", source: "css" }
    )
  })

  it("does not promote brand variables used only by destructive or hidden elements", () => {
    assert.deepEqual(
      extract(
        '<html><body><button class="button-destructive" style="background:var(--accent)">Delete account</button><div hidden><button class="primary" style="background:var(--accent)">Get started</button></div></body></html>',
        ":root { --accent:#0036ff }"
      ),
      { color: null, source: null }
    )
  })

  it("does not resurrect an opaque background overridden by transparency or an unsupported expression", () => {
    const html =
      '<html><body><button class="primary">Get started</button></body></html>'
    assert.deepEqual(
      extract(
        html,
        ".primary { background:#0036ff; background:rgb(255 255 255 / .5) }"
      ),
      { color: null, source: null }
    )
    assert.deepEqual(
      extract(
        html,
        ".primary { background:#0036ff; background:color-mix(in srgb,red,blue) }"
      ),
      { color: null, source: null }
    )
  })

  it("skips uncertain conditional rules, interaction states and pseudo-elements", () => {
    assert.deepEqual(
      extract(
        '<html><body><button class="primary">Get started</button></body></html>',
        `
      @media (prefers-color-scheme:dark) { .primary { background:#0036ff } }
      @supports (color:color-mix(in srgb,red,blue)) { .primary { background:#ec3c00 } }
      .primary:hover { background:#f15406 }
      .primary::before { background:#ff0000 }
    `
      ),
      { color: null, source: null }
    )
  })

  it("allows unconditional layers, matching attributes and escaped utility names", () => {
    assert.deepEqual(
      extract(
        '<html><body><a data-action="signup" class="bg-[#0036ff]" href="/signup">Get started</a></body></html>',
        `
      @layer utilities { a[data-action="signup"].bg-\\[\\#0036ff\\] { background:#0036ff } }
    `
      ),
      { color: "#0036ff", source: "css" }
    )
  })

  it("recognizes CTA text but does not infer an accent from ordinary page backgrounds", () => {
    assert.deepEqual(
      extract(
        '<html><body><a href="/download" style="background:#0036ff">Download for Mac</a></body></html>'
      ),
      { color: "#0036ff", source: "css" }
    )
    assert.deepEqual(
      extract(
        '<html><body style="background:#0036ff"><div style="background:#ec3c00">Welcome</div></body></html>'
      ),
      { color: null, source: null }
    )
  })

  it("respects inline overrides and important declarations in the supported selector subset", () => {
    assert.deepEqual(
      extract(
        '<html><body><button class="primary" style="background:#ec3c00">Get started</button></body></html>',
        ".primary { background:#0036ff !important }"
      ),
      { color: "#0036ff", source: "css" }
    )
  })

  it("returns no accent for conflicting primary CTAs", () => {
    assert.deepEqual(
      extract(
        '<html><body><button class="primary-a">Sign up</button><button class="primary-b">Get started</button></body></html>',
        ".primary-a { background:#0036ff }.primary-b { background:#ec3c00 }"
      ),
      { color: null, source: null }
    )
  })

  it("recovers from a malformed stylesheet and ignores unsupported colors", () => {
    assert.deepEqual(
      extract(
        '<html><body><button class="primary">Get started</button></body></html>',
        ".broken {",
        ".primary { background:color-mix(in srgb, red, blue) }"
      ),
      { color: null, source: null }
    )
  })

  it("inherits computed custom-property aliases from their defining scope", () => {
    assert.deepEqual(
      extract(
        '<html><body><section style="--accent:#ec3c00"><button class="primary">Get started</button></section></body></html>',
        ":root { --accent:#0036ff; --primary:var(--accent) }.primary { background:var(--primary) }"
      ),
      { color: "#0036ff", source: "css" }
    )
  })

  it("keeps foreground exclusions through inherited aliases", () => {
    assert.deepEqual(
      extract(
        '<html><body><button class="primary">Get started</button></body></html>',
        ":root { --foreground:#0036ff; --primary:var(--foreground) }.primary { background:var(--primary) }"
      ),
      { color: null, source: null }
    )
  })

  it("does not treat serialized JavaScript component markup as rendered evidence", () => {
    assert.deepEqual(
      extract(
        '<html><body><div class="skeleton"></div><script>window.payload = "<button class=button-primary>Get started</button>"</script></body></html>',
        ":root { --accent:#ec3c00; --brand-red:#f15406 }.button-primary { background:var(--accent) }"
      ),
      { color: null, source: null }
    )
  })

  it("uses a declared link color without treating default links or generic body text as evidence", () => {
    assert.deepEqual(
      extract(
        '<html><body><a href="/docs">Documentation</a></body></html>',
        ":root { --brand:#0036ff } a { color:var(--brand) }"
      ),
      { color: "#0036ff", source: "css" }
    )
    assert.deepEqual(
      extract(
        '<html><body><a href="/docs">Documentation</a></body></html>',
        "body { color:#0036ff }"
      ),
      { color: null, source: null }
    )
    assert.deepEqual(
      extract(
        '<html><body><a href="/docs">Documentation</a><p style="color:#ec3c00">Ordinary text</p></body></html>'
      ),
      { color: null, source: null }
    )
  })

  for (const name of ["--brand", "--primary", "--color-primary", "--accent"]) {
    it(`uses ${name} consumed by a visible text highlight`, () => {
      assert.deepEqual(
        extract(
          '<html><body><h1>Build <span class="highlight">anything</span></h1></body></html>',
          `:root { ${name}:240 100% 50% }.highlight { color:hsl(var(${name})) }`
        ),
        { color: "#0000ff", source: "css" }
      )
    })
  }

  it("prioritizes explicitly active navigation over an ordinary colored link", () => {
    assert.deepEqual(
      extract(
        '<html><body><nav><a href="/" aria-current="page">Home</a><a href="/docs">Docs</a></nav></body></html>',
        'a { color:#ec3c00 } [aria-current="page"] { color:#0036ff }'
      ),
      { color: "#0036ff", source: "css" }
    )
    assert.deepEqual(
      extract(
        '<html><body><button role="tab" aria-selected="true" style="background:#0036ff">Overview</button></body></html>'
      ),
      { color: "#0036ff", source: "css" }
    )
  })

  it("uses an explicit mark background, but does not invent the browser default highlight color", () => {
    assert.deepEqual(
      extract(
        '<html><body><p>Build <mark style="background:#ec3c00">anything</mark></p></body></html>'
      ),
      { color: "#ec3c00", source: "css" }
    )
    assert.deepEqual(
      extract("<html><body><mark>Anything</mark></body></html>"),
      { color: null, source: null }
    )
  })

  it("uses primary CTA text while retaining stronger CTA background priority", () => {
    const html =
      '<html><body><a class="primary" href="/signup">Get started</a><a href="/docs">Docs</a></body></html>'
    assert.deepEqual(
      extract(html, "a { color:#ec3c00 }.primary { color:#0036ff }"),
      { color: "#0036ff", source: "css" }
    )
    assert.deepEqual(
      extract(html, "a { color:#ec3c00 }.primary { background:#0036ff }"),
      { color: "#0036ff", source: "css" }
    )
  })

  it("tracks declared text color into descendants without counting colors overridden on the actual label", () => {
    const css =
      ":root { --brand:#0036ff; --accent:#ec3c00 } a { color:var(--brand) }"
    assert.deepEqual(
      extract(
        '<html><body><a href="/docs"><span>Documentation</span></a></body></html>',
        css
      ),
      { color: "#0036ff", source: "css" }
    )
    assert.deepEqual(
      extract(
        '<html><body><a href="/docs"><span style="color:var(--accent)">Documentation</span></a></body></html>',
        css
      ),
      { color: "#ec3c00", source: "css" }
    )
  })

  for (const hidden of ["display:none", "visibility:hidden", "opacity:0"]) {
    for (const source of ["inline", "stylesheet"]) {
      it(`excludes ${hidden} elements and descendants through ${source} declarations`, () => {
        const attrs =
          source === "inline" ? `style="${hidden}"` : 'class="hidden-scope"'
        const css = source === "stylesheet" ? `.hidden-scope { ${hidden} }` : ""
        assert.deepEqual(
          extract(
            `<html><body><div ${attrs}><a href="/docs" style="color:#0036ff">Documentation</a><button class="primary" style="background:#ec3c00">Get started</button></div></body></html>`,
            css
          ),
          { color: null, source: null }
        )
      })
    }
  }

  it("resolves variable-based visibility and honors supported overriding declarations", () => {
    assert.deepEqual(
      extract(
        '<html><body><a class="docs" href="/docs">Documentation</a></body></html>',
        ":root { --hidden:0 }.docs { color:#0036ff;opacity:var(--hidden) }"
      ),
      { color: null, source: null }
    )
    assert.deepEqual(
      extract(
        '<html><body><a class="docs" href="/docs" style="display:block">Documentation</a></body></html>',
        ":root { --brand:#0036ff }.docs { color:var(--brand);display:none }"
      ),
      { color: "#0036ff", source: "css" }
    )
  })

  it("excludes destructive links and foreground token text even in selected navigation", () => {
    assert.deepEqual(
      extract(
        '<html><body><a href="/delete" style="color:#0036ff">Delete account</a><a aria-current="page" href="/" style="color:var(--primary-foreground)">Home</a></body></html>',
        ":root { --primary-foreground:#ec3c00 }"
      ),
      { color: null, source: null }
    )
  })

  it("preserves ambiguity when ordinary colored links disagree", () => {
    assert.deepEqual(
      extract(
        '<html><body><a href="/docs" style="color:#0036ff">Docs</a><a href="/about" style="color:#ec3c00">About</a></body></html>'
      ),
      { color: null, source: null }
    )
  })

  it("keeps an unbranded ordinary link weak so it cannot replace metadata or suppress image fallback", () => {
    const candidates = collectCssCandidates(
      htmlToDOM(
        '<html><body><a href="/docs" style="color:#0036ff">Documentation</a></body></html>'
      ),
      []
    )
    assert.ok(
      candidates.some(
        (value) => value.color === "#0036ff" && value.score === 30
      )
    )
    assert.deepEqual(selectAccent(candidates), { color: null, source: null })
    assert.deepEqual(
      selectAccent([...candidates, candidate("#ec3c00", 50, "meta")]),
      { color: "#ec3c00", source: "meta" }
    )
  })

  it("does not promote an unrelated colored badge inside a selected tab", () => {
    assert.deepEqual(
      extract(
        '<html><body><button role="tab" aria-selected="true" style="color:white"><span>Event</span><span style="color:#ccd9ff">Product badge</span></button></body></html>'
      ),
      { color: null, source: null }
    )
    assert.deepEqual(
      extract(
        '<html><body><button role="tab" aria-selected="true" style="color:#0036ff"><span>Event</span><span style="color:#ec3c00">Product badge</span></button></body></html>'
      ),
      { color: "#0036ff", source: "css" }
    )
  })

  it("allows explicit brand-token text inside selected controls", () => {
    assert.deepEqual(
      extract(
        '<html><body><button role="tab" aria-selected="true"><span style="color:var(--brand)">Overview</span></button></body></html>',
        ":root { --brand:#0036ff }"
      ),
      { color: "#0036ff", source: "css" }
    )
  })
})
