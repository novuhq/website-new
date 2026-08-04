import { getChannelBySlug } from "@/data/pages/channels"

import { escapeMarkdownText, formatCodeFence } from "../markdown-format"
import { bulletList } from "../page-utils"
import type { MarkdownPage } from "../types"

export async function getChannels(
  pathname: string
): Promise<MarkdownPage | null> {
  const match = pathname.match(/^\/channels\/([^/]+)$/)
  if (!match) return null

  const channel = getChannelBySlug(match[1])
  if (!channel) return null

  const transcript = channel.useCase.transcript
    .map(
      (line) =>
        `- ${escapeMarkdownText(line.from)}: ${escapeMarkdownText(line.text)}`
    )
    .join("\n")

  const faq = channel.faq
    .map(
      (item) =>
        `### ${escapeMarkdownText(item.question)}\n\n${escapeMarkdownText(item.answer)}`
    )
    .join("\n\n")

  const body = [
    escapeMarkdownText(channel.hero.subheading),
    escapeMarkdownText(channel.citation),
    `Connect command: npx novu connect --channel ${escapeMarkdownText(channel.cliSlug)}`,
    `## What your agent can do in ${escapeMarkdownText(channel.channelName)}`,
    bulletList(channel.capabilities),
    `## Example use case`,
    `Agent: ${escapeMarkdownText(channel.useCase.company)}. Talking to: ${escapeMarkdownText(channel.useCase.audience)}.`,
    escapeMarkdownText(channel.useCase.summary),
    transcript,
    `## How to connect`,
    escapeMarkdownText(channel.onRamp.note),
    "Prompt for your coding agent:",
    formatCodeFence(channel.prompt, "text"),
    `## ${escapeMarkdownText(channel.channelName)} and Novu Connect, common questions`,
    faq,
  ]
    .filter(Boolean)
    .join("\n\n")

  return {
    title: channel.seoTitle,
    description: channel.seoDescription,
    pathname: `/channels/${channel.slug}`,
    body,
  }
}
