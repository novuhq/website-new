import { getChannelBySlug } from "@/data/pages/channels"

import { getStarterAgentTemplates } from "@/lib/templates/starter-templates"
import { getAgentTemplateUrl } from "@/lib/templates/url"

import { escapeMarkdownText, formatMarkdownLink } from "../markdown-format"
import { bulletList } from "../page-utils"
import type { MarkdownPage } from "../types"

async function getStarterTemplatesMarkdown(ids: string[]): Promise<string> {
  const selected = await getStarterAgentTemplates(ids)

  if (!selected.length) return ""

  const items = selected
    .map(
      (template) =>
        `- ${escapeMarkdownText(template.name)} (${escapeMarkdownText(template.agentName)}): ${escapeMarkdownText(template.summary)} ${formatMarkdownLink("Start it", getAgentTemplateUrl(template.id))}`
    )
    .join("\n")

  return `## Starter agent templates\n\n${items}`
}

export async function getChannels(
  pathname: string
): Promise<MarkdownPage | null> {
  const match = pathname.match(/^\/channels\/([^/]+)$/)
  if (!match) return null

  const channel = getChannelBySlug(match[1])
  if (!channel) return null

  const templatesMarkdown = await getStarterTemplatesMarkdown(
    channel.starterTemplateIds
  )

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
    templatesMarkdown,
    `## How to connect`,
    escapeMarkdownText(channel.onRamp.note),
    `Prompt for your coding agent: ${escapeMarkdownText(channel.prompt)}`,
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
