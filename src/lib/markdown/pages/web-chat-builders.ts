import { ROUTE } from "@/constants/routes"
import {
  getWebChatBuilderBySlug,
  getWebChatBuilderPathname,
  getWebChatBuilderStepText,
  type IWebChatBuilderPage,
} from "@/data/pages/web-chat-builders"

import { escapeMarkdownText, formatMarkdownLink } from "../markdown-format"
import type { MarkdownPage } from "../types"
import { absoluteUrl, toCanonicalPathname } from "../url"

const BUILDER_PATHNAME = new RegExp(`^${String(ROUTE.channelWebChat)}/([^/]+)$`)

function sectionMarkdown(section: IWebChatBuilderPage["sections"][number]) {
  switch (section.type) {
    case "primary":
      return [
        `## ${escapeMarkdownText(section.title)}`,
        section.features
          .map(
            (feature) =>
              `- ${escapeMarkdownText(feature.title)}: ${escapeMarkdownText(feature.description)}`
          )
          .join("\n"),
      ]
    case "secondary":
      return [
        `## ${escapeMarkdownText(section.title)}`,
        escapeMarkdownText(section.description),
        section.steps
          .map(
            (step, index) =>
              `${index + 1}. ${escapeMarkdownText(getWebChatBuilderStepText(step))}`
          )
          .join("\n"),
      ]
    case "tertiary":
      return [
        `## ${escapeMarkdownText(section.title)}`,
        escapeMarkdownText(section.description),
        `Connect command: ${escapeMarkdownText(section.command)}`,
        `Channels: ${escapeMarkdownText(
          section.channels.map((channel) => channel.name).join(", ")
        )}. ${escapeMarkdownText(section.moreChannelsHint)}.`,
      ]
  }
}

export async function getWebChatBuilder(
  pathname: string
): Promise<MarkdownPage | null> {
  const match = pathname.match(BUILDER_PATHNAME)
  if (!match) return null

  const page = getWebChatBuilderBySlug(match[1])
  if (!page) return null

  const faq = page.faq
    .map(
      (item) =>
        `### ${escapeMarkdownText(item.question)}\n\n${escapeMarkdownText(item.answer)}`
    )
    .join("\n\n")

  const body = [
    `Part of ${formatMarkdownLink(
      "Novu Web Chat",
      absoluteUrl(toCanonicalPathname(String(ROUTE.channelWebChat)))
    )}.`,
    `Connect command: ${escapeMarkdownText(page.hero.command)}`,
    `Prompt for your coding agent: ${escapeMarkdownText(page.hero.prompt)}`,
    ...page.sections.flatMap(sectionMarkdown),
    `## ${escapeMarkdownText(page.faqTitle)}`,
    faq,
  ]
    .filter(Boolean)
    .join("\n\n")

  return {
    title: page.seo.title,
    description: page.seo.description,
    pathname: getWebChatBuilderPathname(page.slug),
    body,
  }
}
