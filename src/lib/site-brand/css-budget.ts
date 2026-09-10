import type { Options } from "css-select"
import { Element, type DOMNode } from "html-react-parser"

export class CssAnalysisLimitError extends Error {}

/** Synchronous analysis cannot be interrupted by the network's abort timer. */
export class CssAnalysisBudget {
  private work = 4_000_000
  private entries = 250_000
  private cssCharacters = 512 * 1024

  spend(amount = 1) {
    this.work -= amount
    if (this.work < 0) throw new CssAnalysisLimitError()
  }

  allocate(amount: number) {
    this.spend(amount)
    this.entries -= amount
    if (this.entries < 0) throw new CssAnalysisLimitError()
  }

  parse(text: string) {
    this.spend(text.length)
    this.cssCharacters -= text.length
    if (this.cssCharacters < 0) throw new CssAnalysisLimitError()
  }
}

export function cssTextContent(
  node: DOMNode,
  budget: CssAnalysisBudget,
  maxLength = Infinity
): string {
  const stack = [node]
  const parts: string[] = []
  let length = 0
  while (stack.length && length < maxLength) {
    budget.spend()
    const current = stack.pop()!
    if (current.type === "text") {
      const text = current.data.slice(0, maxLength - length)
      budget.spend(text.length)
      parts.push(text)
      length += text.length + 1
    } else if ("children" in current) {
      budget.spend(current.children.length)
      for (let i = current.children.length - 1; i >= 0; i--)
        stack.push(current.children[i] as DOMNode)
    }
  }
  return parts.join(" ")
}

/** Charge actual DOM reads, including ancestor/sibling walks inside css-select. */
export function createCssAdapter(
  budget: CssAnalysisBudget
): NonNullable<Options<DOMNode, Element>["adapter"]> {
  return {
    isTag(node): node is Element {
      budget.spend()
      return node instanceof Element
    },
    getAttributeValue(element, name) {
      const value = element.attribs[name]
      // String predicates scan in native code. Charge bounded 32-character
      // blocks so repeated long utility-class attributes do not dominate.
      budget.spend(1 + Math.ceil((value?.length ?? 0) / 32))
      return value
    },
    getChildren(node) {
      const children = "children" in node ? node.children : []
      budget.spend(1 + children.length)
      return children as DOMNode[]
    },
    getName(element) {
      budget.spend()
      return element.name
    },
    getParent(node) {
      budget.spend()
      return node.parent as DOMNode | null
    },
    getSiblings(node) {
      const siblings = node.parent ? node.parent.children : [node]
      budget.spend(1 + siblings.length)
      return siblings as DOMNode[]
    },
    getText(node) {
      return cssTextContent(node, budget)
    },
    hasAttrib(element, name) {
      budget.spend()
      return Object.hasOwn(element.attribs, name)
    },
    removeSubsets(nodes) {
      budget.spend(nodes.length)
      const unique = new Set(nodes)
      return [...unique].filter((node) => {
        let parent = node.parent
        while (parent) {
          budget.spend()
          if (unique.has(parent as DOMNode)) return false
          parent = parent.parent
        }
        return true
      })
    },
  }
}
