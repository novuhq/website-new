import { compile } from "css-select"
import { Element, type DOMNode } from "html-react-parser"
import postcss, { type Declaration, type Rule } from "postcss"

import { normalizeColor, type AccentCandidate } from "./colors"
import {
  createCssAdapter,
  CssAnalysisBudget,
  CssAnalysisLimitError,
  cssTextContent,
} from "./css-budget"

type StyledValue = {
  value: string
  important: boolean
  specificity: number
  order: number
}
type ElementStyles = {
  variables: Map<string, StyledValue>
  backgrounds: StyledValue[]
  properties: Map<string, StyledValue>
}
type ResolvedValue = { value: string; references: Set<string> }
type Variables = Map<string, string | ResolvedValue | null>
type InterfaceContext = {
  primary: boolean
  link: boolean
  active: Element | null
  highlight: boolean
  excluded: boolean
}
type TextColor = {
  resolved: ResolvedValue
  origin: Element
  activeScope: Element | null
}
type Visibility = { subtreeHidden: boolean; visibilityHidden: boolean }
export type LinkedStylesheet = { href: string; css: string }

const TRACKED_PROPERTY =
  /^(background(?:-color)?|color|display|visibility|opacity)$/i

const EXCLUDED_TOKEN =
  /(?:^|[-_])(foreground|text|border|outline|ring|shadow|success|warning|danger|error|destructive|status|muted|secondary|sidebar|chart|admin|popover|card)(?:$|[-_])/i
const BRAND_TOKEN = /(?:^|[-_])(brand|primary|accent)(?:$|[-_])/i
const EXCLUDED_ACTION =
  /(?:^|[-_\s])(destructive|danger|error|success|warning|status|alert|delete|remove|cancel)(?:$|[-_\s])/i
const PRIMARY_CLASS = /(?:^|[-_])(primary|cta)(?:$|[-_])/i
const CTA_TEXT =
  /\b(get started|sign\s?up|start (?:for free|free|your|a trial)|try (?:it|for free|now)|book (?:a |your )?demo|contact sales|download|subscribe|join (?:us|now))\b/i

function higherPriority(a: StyledValue, b: StyledValue): number {
  return (
    Number(a.important) - Number(b.important) ||
    a.specificity - b.specificity ||
    a.order - b.order
  )
}

function selectorWeight(selector: string): number | null {
  // Only static selectors with straightforward specificity are supported. In
  // particular, don't strip :hover or ::before and accidentally match their base.
  const plain = selector
    .replace(/\\(?:[\da-f]{1,6}\s?|.)/gi, "x")
    .replace(/\[[^\]]*\]/g, ".attribute")
  const withoutRoot = plain.replace(/:root\b/g, ".root")
  if (/[():&|]/.test(withoutRoot) || selector.length > 500) return null
  const ids = withoutRoot.match(/#[\w-]+/g)?.length ?? 0
  const classes = withoutRoot.match(/\.[\w-]+/g)?.length ?? 0
  const tags =
    withoutRoot.replace(/[#.][\w-]+/g, "").match(/\b[a-z][\w-]*\b/gi)?.length ??
    0
  return ids * 1_000_000 + classes * 1_000 + tags
}

function supportedRule(rule: Rule, budget: CssAnalysisBudget): boolean {
  let parent = rule.parent
  while (parent && parent.type !== "root") {
    budget.spend()
    // Layers are unconditional. Media/supports/container/keyframes and nested
    // selectors need browser context and are deliberately not evaluated.
    if (parent.type !== "atrule" || parent.name.toLowerCase() !== "layer")
      return false
    parent = parent.parent
  }
  return true
}

function isScreenStylesheet(media: string | undefined): boolean {
  return !media || /^(all|screen)$/i.test(media.trim())
}

/** Resolve nested var() fallbacks with explicit limits against cyclic/expanding input. */
function resolveValue(
  value: string,
  variables: Variables,
  budget: CssAnalysisBudget,
  visited = new Set<string>(),
  depth = 0
): ResolvedValue | null {
  budget.spend(value.length + visited.size + 1)
  if (depth > 24 || value.length > 4096) return null
  const references = new Set<string>()
  let output = ""
  let cursor = 0
  while (cursor < value.length) {
    const start = value.indexOf("var(", cursor)
    if (start < 0) {
      output += value.slice(cursor)
      break
    }
    output += value.slice(cursor, start)
    let nesting = 1
    let end = start + 4
    let comma = -1
    for (; end < value.length && nesting; end++) {
      if (value[end] === "(") nesting++
      else if (value[end] === ")") nesting--
      else if (value[end] === "," && nesting === 1 && comma < 0) comma = end
    }
    if (nesting) return null
    const name = value.slice(start + 4, comma < 0 ? end - 1 : comma).trim()
    if (!/^--[\w-]+$/.test(name) || visited.has(name)) return null
    if (!references.has(name)) {
      budget.allocate(1)
      references.add(name)
    }
    const nextVisited = new Set(visited).add(name)
    const variable = variables.get(name)
    let resolved =
      typeof variable === "string"
        ? resolveValue(variable, variables, budget, nextVisited, depth + 1)
        : (variable ?? null)
    if (!resolved && comma >= 0)
      resolved = resolveValue(
        value.slice(comma + 1, end - 1),
        variables,
        budget,
        nextVisited,
        depth + 1
      )
    if (!resolved) return null
    budget.spend(resolved.value.length)
    output += resolved.value
    if (output.length > 4096) return null
    budget.spend(resolved.references.size)
    for (const reference of resolved.references) {
      if (!references.has(reference)) {
        budget.allocate(1)
        references.add(reference)
      }
    }
    cursor = end
  }
  return { value: output, references }
}

function actionEvidence(
  element: Element,
  budget: CssAnalysisBudget
): {
  action: boolean
  link: boolean
  active: boolean
  excluded: boolean
  primary: boolean
} {
  const attrs = element.attribs
  const link =
    (element.name === "a" && Boolean(attrs.href)) || attrs.role === "link"
  const action =
    element.name === "button" ||
    link ||
    attrs.role === "button" ||
    (element.name === "input" && /^(submit|button)$/i.test(attrs.type ?? ""))
  budget.spend((attrs.class?.length ?? 0) + (attrs.id?.length ?? 0))
  const classes = (attrs.class ?? "")
    .split(/\s+/)
    .filter((name) => !name.includes(":"))
  const label = `${attrs["aria-label"] ?? ""} ${attrs.value ?? ""} ${action ? cssTextContent(element, budget, 200) : ""}`
  budget.spend(label.length + (attrs["data-variant"]?.length ?? 0))
  const excluded =
    "disabled" in attrs ||
    attrs["aria-disabled"] === "true" ||
    EXCLUDED_ACTION.test(
      `${classes.join(" ")} ${attrs.id ?? ""} ${attrs["data-variant"] ?? ""} ${label}`
    )
  return {
    action,
    link,
    active:
      (Boolean(attrs["aria-current"]) && attrs["aria-current"] !== "false") ||
      attrs["aria-selected"] === "true" ||
      (attrs.role === "tab" && attrs["data-state"] === "active"),
    excluded,
    primary:
      action &&
      !excluded &&
      (classes.some((name) => PRIMARY_CLASS.test(name)) ||
        CTA_TEXT.test(label)),
  }
}

/**
 * Static evidence collection, not computed style: no JS, imports, conditional
 * rules, selector pseudos other than :root, gradients, or complete layer cascade.
 * Matched backgrounds and declared interface text colors can corroborate tokens.
 * Visibility excludes supported CSS/ancestor hiding, not all browser visibility.
 */
export function collectCssCandidates(
  nodes: DOMNode[],
  stylesheets: (string | LinkedStylesheet)[]
): AccentCandidate[] {
  try {
    return analyzeCss(nodes, stylesheets, new CssAnalysisBudget())
  } catch (error) {
    // Partial evidence can pick a color whose later override was never read.
    // Leave metadata/manifest/logo candidates available to the caller instead.
    if (error instanceof CssAnalysisLimitError) return []
    throw error
  }
}

function analyzeCss(
  nodes: DOMNode[],
  stylesheets: (string | LinkedStylesheet)[],
  budget: CssAnalysisBudget
): AccentCandidate[] {
  const elements: Element[] = []
  // Records preserve link/style source order. Bare strings are detached fixture
  // sheets and precede document styles because they have no document position.
  const documentSheets = stylesheets.filter(
    (sheet): sheet is string => typeof sheet === "string"
  )
  const linked = new Map(
    stylesheets
      .filter((sheet): sheet is LinkedStylesheet => typeof sheet !== "string")
      .map((sheet) => [sheet.href, sheet.css])
  )
  budget.spend(nodes.length)
  const stack = [...nodes].reverse()
  while (stack.length && elements.length < 8000) {
    budget.spend()
    const node = stack.pop()!
    if (!(node instanceof Element)) continue
    if (node.name === "style") {
      if (isScreenStylesheet(node.attribs.media))
        documentSheets.push(cssTextContent(node, budget))
      continue
    }
    if (
      node.name === "link" &&
      (node.attribs.rel ?? "")
        .toLowerCase()
        .split(/\s+/)
        .includes("stylesheet") &&
      isScreenStylesheet(node.attribs.media) &&
      !("disabled" in node.attribs)
    ) {
      const sheet = linked.get(node.attribs.href)
      if (sheet !== undefined) documentSheets.push(sheet)
    }
    if (["script", "template", "noscript"].includes(node.name)) continue
    if ("hidden" in node.attribs || node.attribs["aria-hidden"] === "true")
      continue
    elements.push(node)
    budget.spend(node.children.length)
    for (let i = node.children.length - 1; i >= 0; i--)
      stack.push(node.children[i] as DOMNode)
  }
  if (stack.length) throw new CssAnalysisLimitError()
  const adapter = createCssAdapter(budget)
  const styles = new Map<Element, ElementStyles>()
  let order = 0
  function add(
    element: Element,
    declaration: Declaration,
    specificity: number
  ) {
    const prop = declaration.prop
    if (!prop.startsWith("--") && !TRACKED_PROPERTY.test(prop)) return
    budget.allocate(1)
    let style = styles.get(element)
    if (!style) {
      style = { variables: new Map(), backgrounds: [], properties: new Map() }
      styles.set(element, style)
    }
    const value = {
      value: declaration.value,
      important: Boolean(declaration.important),
      specificity,
      order: order++,
    }
    if (prop.startsWith("--")) {
      const previous = style.variables.get(prop)
      if (!previous || higherPriority(value, previous) > 0)
        style.variables.set(prop, value)
    } else if (/^background(?:-color)?$/i.test(prop))
      style.backgrounds.push(value)
    else {
      const name = prop.toLowerCase()
      const previous = style.properties.get(name)
      if (!previous || higherPriority(value, previous) > 0)
        style.properties.set(name, value)
    }
  }
  let rules = 0
  for (const sheet of documentSheets) {
    budget.parse(sheet)
    let root
    try {
      root = postcss.parse(sheet)
    } catch {
      continue
    }
    root.walkRules((rule) => {
      if (++rules > 8000) throw new CssAnalysisLimitError()
      budget.spend(rule.nodes.length)
      if (!supportedRule(rule, budget)) return
      const declarations = rule.nodes.filter(
        (node): node is Declaration =>
          node.type === "decl" &&
          (node.prop.startsWith("--") || TRACKED_PROPERTY.test(node.prop))
      )
      if (!declarations.length) return
      for (const selector of rule.selectors) {
        budget.spend(selector.length)
        const weight = selectorWeight(selector)
        if (weight === null) continue
        let matches
        try {
          matches = compile(selector, { adapter })
        } catch (error) {
          if (error instanceof CssAnalysisLimitError) throw error
          continue
        }
        // Match only the bounded, visible candidate set. Adapter calls also
        // account for work inside descendant and sibling combinators.
        for (const element of elements) {
          budget.spend()
          if (!matches(element)) continue
          for (const declaration of declarations)
            add(element, declaration, weight)
        }
      }
    })
  }
  for (const element of elements) {
    if (!element.attribs.style) continue
    const inline = `x{${element.attribs.style}}`
    budget.parse(inline)
    let root
    try {
      root = postcss.parse(inline)
    } catch {
      /* An invalid inline declaration must not lose other evidence. */
      continue
    }
    root.walkDecls((decl) => add(element, decl, 1_000_000_000))
  }
  const inherited = new Map<Element, Variables>()
  const contexts = new Map<Element, InterfaceContext>()
  const visibility = new Map<Element, Visibility>()
  const textColors = new Map<Element, TextColor | null>()
  const candidates: AccentCandidate[] = []
  const emptyVariables: Variables = new Map()
  for (const element of elements) {
    budget.spend()
    const parentElement =
      element.parent instanceof Element ? element.parent : undefined
    const parent =
      (parentElement && inherited.get(parentElement)) || emptyVariables
    const style = styles.get(element)
    let variables = parent
    let computed = parent
    budget.spend(style?.variables.size ?? 0)
    const localVariables = [...(style?.variables ?? [])].filter(
      ([name, value]) => {
        const inheritedValue = parent.get(name)
        // Framework resets repeat the same literal custom properties on every
        // element. Aliases must still resolve in the new scope, and a literal
        // override must clear any provenance inherited from an earlier alias.
        return !(
          inheritedValue &&
          typeof inheritedValue !== "string" &&
          inheritedValue.references.size === 0 &&
          !value.value.includes("var(") &&
          inheritedValue.value === value.value
        )
      }
    )
    if (localVariables.length) {
      // Unchanged descendants share immutable computed values. Charge both
      // copies before allocating when local overrides actually require them.
      budget.allocate(2 * (parent.size + localVariables.length))
      variables = new Map(parent)
      for (const [name, value] of localVariables)
        variables.set(name, value.value)
      // Aliases inherit their computed value, not a child's overridden input.
      computed = new Map(parent)
      for (const [name, value] of localVariables)
        computed.set(
          name,
          resolveValue(value.value, variables, budget, new Set([name]))
        )
    }
    inherited.set(element, computed)
    const property = (name: string): ResolvedValue | null => {
      const declaration = style?.properties.get(name)
      return declaration
        ? resolveValue(declaration.value, computed, budget)
        : null
    }
    const parentVisibility = parentElement
      ? visibility.get(parentElement)
      : undefined
    const display = property("display")?.value.trim().toLowerCase()
    const opacity = property("opacity")?.value.trim()
    const visible = property("visibility")?.value.trim().toLowerCase()
    const state = {
      subtreeHidden:
        Boolean(parentVisibility?.subtreeHidden) ||
        display === "none" ||
        (Boolean(opacity) && Number(opacity?.replace(/%$/, "")) === 0),
      visibilityHidden:
        visible === "visible"
          ? false
          : visible === "hidden" ||
            visible === "collapse" ||
            Boolean(parentVisibility?.visibilityHidden),
    }
    visibility.set(element, state)
    const ownContext = actionEvidence(element, budget)
    const parentContext = parentElement
      ? contexts.get(parentElement)
      : undefined
    const context = {
      primary: ownContext.action
        ? ownContext.primary
        : Boolean(parentContext?.primary),
      link: ownContext.action ? ownContext.link : Boolean(parentContext?.link),
      active: ownContext.active ? element : (parentContext?.active ?? null),
      highlight: element.name === "mark" || Boolean(parentContext?.highlight),
      excluded: ownContext.excluded || Boolean(parentContext?.excluded),
    }
    contexts.set(element, context)
    let textColor = parentElement
      ? (textColors.get(parentElement) ?? null)
      : null
    if (style?.properties.has("color")) {
      const resolved = property("color")
      if (!resolved || !/^(inherit|unset)$/i.test(resolved.value.trim()))
        textColor = resolved
          ? { resolved, origin: element, activeScope: context.active }
          : null
    }
    textColors.set(element, textColor)
    if (element.name === "html" || element.name === "body") {
      for (const [name, value] of style?.variables ?? []) {
        if (!BRAND_TOKEN.test(name) || EXCLUDED_TOKEN.test(name)) continue
        const resolved = resolveValue(
          value.value,
          variables,
          budget,
          new Set([name])
        )
        const color = resolved && normalizeColor(resolved.value)
        if (color)
          candidates.push({
            color,
            source: "css",
            score: 20,
            reason: `Uncorroborated theme token ${name}`,
          })
      }
    }
    if (state.subtreeHidden || state.visibilityHidden || context.excluded)
      continue
    for (const declaration of (style?.backgrounds ?? []).sort((a, b) =>
      higherPriority(b, a)
    )) {
      const resolved = resolveValue(declaration.value, computed, budget)
      if (!resolved) break
      const color = normalizeColor(resolved.value)
      if (!color) break
      const references = [...resolved.references]
      if (references.some((name) => EXCLUDED_TOKEN.test(name))) break
      const branded = references.some((name) => BRAND_TOKEN.test(name))
      if (
        ownContext.primary ||
        branded ||
        ownContext.active ||
        element.name === "mark"
      )
        candidates.push({
          color,
          source: "css",
          score: ownContext.primary
            ? 80
            : branded || ownContext.active
              ? 65
              : 60,
          reason: ownContext.primary
            ? "Matching primary CTA background"
            : branded
              ? `Matching background uses ${references.filter((name) => BRAND_TOKEN.test(name)).join(", ")}`
              : "Matching active navigation or highlight background",
        })
      break
    }
    // Only text-bearing nodes vote. This avoids counting an ancestor's color
    // when every visible label child explicitly overrides that inherited color.
    const hasText =
      element.children.some(
        (child) => child.type === "text" && child.data.trim()
      ) ||
      (element.name === "input" && Boolean(element.attribs.value))
    if (
      !hasText ||
      !textColor ||
      ["html", "body"].includes(textColor.origin.name)
    )
      continue
    const references = [...textColor.resolved.references]
    if (references.some((name) => EXCLUDED_TOKEN.test(name))) continue
    const color = normalizeColor(textColor.resolved.value)
    if (!color) continue
    const branded = references.some((name) => BRAND_TOKEN.test(name))
    // An arbitrary badge or product color nested inside a selected tab is not
    // the tab's label color. Preserve explicit brand-token corroboration there.
    const activeText =
      context.active &&
      (branded ||
        textColor.origin === context.active ||
        textColor.activeScope !== context.active)
    const score = context.primary
      ? 70
      : activeText
        ? 60
        : context.link
          ? branded
            ? 55
            : 30
          : context.highlight || branded
            ? 60
            : 0
    if (score)
      candidates.push({
        color,
        source: "css",
        score,
        reason: context.primary
          ? "Declared primary CTA text color"
          : activeText
            ? "Declared active navigation text color"
            : context.link
              ? branded
                ? "Declared brand-token link color"
                : "Uncorroborated declared link color"
              : "Declared highlight or brand-token text color",
      })
  }
  return candidates
}
