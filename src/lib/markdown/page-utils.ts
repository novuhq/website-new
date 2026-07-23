import { Children, isValidElement, type ReactNode } from "react"

import type {
  FaqAnswer,
  ICtaSection,
  IFaqSection,
  TSectionAction,
} from "@/types/common"

import { escapeMarkdownText, formatMarkdownLink } from "./markdown-format"
import type { MarkdownPage, SeoEntry } from "./types"
import { absoluteUrl, toCanonicalPathname, toMarkdownPathname } from "./url"

type MarkdownCta = {
  label: string
  href: string | URL
}

export function compact(value: string) {
  return value
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export function asText(value: ReactNode): string {
  if (value === null || value === undefined || typeof value === "boolean") {
    return ""
  }

  if (typeof value === "string" || typeof value === "number") {
    return escapeMarkdownText(String(value))
  }

  if (Array.isArray(value)) {
    return value.map(asText).filter(Boolean).join(" ")
  }

  if (!isValidElement(value)) {
    return ""
  }

  const props = value.props as {
    children?: ReactNode
    href?: string | URL
  }
  const text = Children.toArray(props.children).map(asText).join(" ").trim()

  if (typeof value.type === "string" && value.type === "a" && props.href) {
    return formatMarkdownLink(text, props.href, { labelIsEscaped: true })
  }

  return text
}

export function bulletList(items: Array<string | undefined | null>) {
  return items
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item))
    .map((item) => `- ${escapeMarkdownText(item)}`)
    .join("\n")
}

export function linkList(
  items: Array<{ title: string; href: string; description?: string }>
) {
  return items
    .map((item) => {
      const link = `- ${formatMarkdownLink(item.title, item.href)}`
      return item.description
        ? `${link}: ${escapeMarkdownText(item.description)}`
        : link
    })
    .join("\n")
}

export function postListMarkdown(
  posts: Array<{
    title: string
    url?: string
    pathname?: string
    caption?: string
    publishedAt?: string
  }>
) {
  return linkList(
    posts.map((post) => ({
      title: post.title,
      href: absoluteUrl(toCanonicalPathname(post.url ?? post.pathname ?? "")),
      description: [post.publishedAt, post.caption].filter(Boolean).join(" - "),
    }))
  )
}

export function ctaMarkdown(
  cta: MarkdownCta | null | undefined,
  label = "Call to action"
) {
  if (!cta) return ""

  return `${label}: ${formatMarkdownLink(cta.label, cta.href)}`
}

function actionMarkdown(action: TSectionAction) {
  if ("href" in action) {
    return formatMarkdownLink(action.label, action.href)
  }

  if (action.kind === "scheduling-button") {
    return escapeMarkdownText(action.label)
  }

  return ""
}

export function actionsMarkdown(actions: TSectionAction[] | undefined) {
  return (actions ?? [])
    .map(actionMarkdown)
    .filter(Boolean)
    .map((item) => `- ${item}`)
    .join("\n")
}

export function ctaSectionMarkdown(section: ICtaSection) {
  return [
    `## ${escapeMarkdownText(section.title)}`,
    asText(section.description),
    section.hint ? escapeMarkdownText(section.hint) : "",
    actionsMarkdown(section.actions),
  ]
    .filter(Boolean)
    .join("\n\n")
}

function maybeAnswerToText(answer: FaqAnswer) {
  if (typeof answer === "function") {
    return asText(answer(() => undefined))
  }

  return asText(answer)
}

export function faqMarkdown(section: IFaqSection) {
  const items = section.accordion.items
    .map(
      (item) =>
        `### ${escapeMarkdownText(item.question)}\n\n${maybeAnswerToText(item.answer)}`
    )
    .join("\n\n")

  return `## ${escapeMarkdownText(section.title)}\n\n${items}`
}

export function formatPage(page: MarkdownPage) {
  const canonicalPathname = toCanonicalPathname(page.pathname)
  const markdownPathname = toMarkdownPathname(page.pathname)
  const header = [
    `# ${escapeMarkdownText(page.title)}`,
    page.description ? `> ${escapeMarkdownText(page.description)}` : "",
    `Canonical: ${absoluteUrl(canonicalPathname)}`,
    `Markdown: ${absoluteUrl(markdownPathname)}`,
    page.updatedAt ? `Last updated: ${page.updatedAt}` : "",
  ]
    .filter(Boolean)
    .join("\n\n")

  return `${header}\n\n${compact(page.body)}\n`
}

export function pageFromSeo(
  entry: SeoEntry,
  body: string,
  noIndex?: boolean
): MarkdownPage {
  return {
    title: entry.title,
    description: entry.description,
    pathname: entry.pathname || "/",
    body,
    noIndex,
  }
}
