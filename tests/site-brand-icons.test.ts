import assert from "node:assert/strict"
import { it } from "node:test"

import { iconColorScheme, preferDarkLogo } from "@/lib/site-brand/icons"

const uri = (svg: string) =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`

it("recognizes simple scheme declarations without misreading negated or mixed queries", () => {
  assert.equal(iconColorScheme("(prefers-color-scheme: dark)"), "dark")
  assert.equal(
    iconColorScheme(" ONLY screen AND (prefers-color-scheme: LIGHT) "),
    "light"
  )
  for (const query of [
    "not (prefers-color-scheme: dark)",
    "print and (prefers-color-scheme: dark)",
    "(prefers-color-scheme: dark), (max-width: 300px)",
    "(prefers-color-scheme: dark) and (min-width: 600px)",
  ]) {
    assert.equal(iconColorScheme(query), null)
  }
})

it("preserves vectors and unrelated SVG conditions when choosing dark presentation", () => {
  const path = '<path fill="white" d="M0 0h32v32H0z"/>'
  const logo = uri(
    `<svg xmlns="http://www.w3.org/2000/svg"><style>@media screen and (prefers-color-scheme: dark) { path { fill: red } } @media print { path { fill: black } } @media not (prefers-color-scheme: dark) { path { stroke: blue } }</style>${path}</svg>`
  )
  const svg = Buffer.from(
    preferDarkLogo(logo)!.split(",")[1],
    "base64"
  ).toString()
  assert.ok(svg.includes(path))
  assert.match(svg, /@media all \{ path \{ fill: red/)
  assert.match(svg, /@media print/)
  assert.match(svg, /@media not \(prefers-color-scheme: dark\)/)
})

it("keeps nonadaptive images and malformed SVG styles unchanged", () => {
  for (const logo of [
    null,
    "data:image/png;base64,AA==",
    uri('<svg><path fill="red"/></svg>'),
    uri("<svg><style>@media (prefers-color-scheme: dark) {</style></svg>"),
  ]) {
    assert.equal(preferDarkLogo(logo), logo)
  }
})
