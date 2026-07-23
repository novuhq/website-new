import { type ReactNode } from "react"
import { getComparisonBySlug } from "@/data/pages/comparison"
import { comparisonReviews } from "@/data/pages/comparison/reviews"

import {
  asText,
  bulletList,
  ctaMarkdown,
  ctaSectionMarkdown,
  faqMarkdown,
} from "../page-utils"
import type { MarkdownPage } from "../types"

function comparisonTableMarkdown(rows: Array<Array<ReactNode>>) {
  return rows
    .map((row) => {
      const [feature, novu, competitor, meaning] = row.map(asText)
      return [
        `### ${feature}`,
        `- Novu: ${novu}`,
        `- Alternative: ${competitor}`,
        `- What this means: ${meaning}`,
      ].join("\n")
    })
    .join("\n\n")
}

function reviewMarkdown() {
  return comparisonReviews
    .map((review) =>
      [
        `### ${review.name}${review.tag ? ` (${review.tag})` : ""}`,
        review.text ? `> ${review.text}` : "",
        review.tweetLink ? `Source: ${review.tweetLink}` : "",
      ]
        .filter(Boolean)
        .join("\n\n")
    )
    .join("\n\n")
}

export async function getComparison(
  pathname: string
): Promise<MarkdownPage | null> {
  const match = pathname.match(/^\/comparison\/([^/]+)$/)
  if (!match) return null

  const data = getComparisonBySlug(match[1])
  if (!data) return null

  const title =
    `${data.hero.heading.prefix} ${data.hero.heading.highlight}`.replace(
      /\u00a0/g,
      " "
    )
  const body = [
    data.hero.subheading,
    [
      ctaMarkdown(data.hero.primaryCta, "Primary action"),
      ctaMarkdown(data.hero.secondaryCta, "Secondary action"),
      asText(data.hero.note),
    ]
      .filter(Boolean)
      .join("\n\n"),
    [
      `## ${data.intro.title}`,
      data.intro.description,
      asText(data.intro.switchLabel),
      bulletList(data.intro.benefits),
      ctaMarkdown(data.intro.cta),
    ]
      .filter(Boolean)
      .join("\n\n"),
    [
      `## ${data.frustrations.title}`,
      data.frustrations.subtitle,
      data.frustrations.items
        .map((item) => `### ${item.title}\n\n${item.description}`)
        .join("\n\n"),
      ctaMarkdown(data.frustrations.cta),
    ]
      .filter(Boolean)
      .join("\n\n"),
    [
      `## ${data.difference.title}`,
      data.difference.subtitle,
      data.difference.cards
        .map((card) => `### ${card.title}\n\n${card.description}`)
        .join("\n\n"),
      ctaMarkdown(data.difference.cta),
    ]
      .filter(Boolean)
      .join("\n\n"),
    `## ${data.codeSection.title}\n\n${data.codeSection.subtitle}\n\n${data.codeSection.items.map((item) => `### ${item.title}\n\n${item.description}`).join("\n\n")}`,
    `## ${data.comparisonTable.title}\n\n${data.comparisonTable.subtitle}\n\n${comparisonTableMarkdown(data.comparisonTable.rows)}`,
    [
      `## ${data.banner.title}`,
      data.banner.description,
      ctaMarkdown(data.banner.cta),
    ]
      .filter(Boolean)
      .join("\n\n"),
    [
      `## ${data.reviewsSection.title}`,
      data.reviewsSection.subtitle,
      reviewMarkdown(),
    ]
      .filter(Boolean)
      .join("\n\n"),
    faqMarkdown(data.faqSection),
    ctaSectionMarkdown(data.ctaSection),
  ]
    .filter(Boolean)
    .join("\n\n")

  return {
    title,
    description: data.description,
    pathname: `/comparison/${data.slug}`,
    body,
  }
}
