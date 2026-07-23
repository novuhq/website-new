import { ROUTE } from "@/constants/routes"
import { getChannelBySlug } from "@/data/pages/channels"

import type { IAgentTemplateData } from "@/types/templates"
import { getAgentTemplates } from "@/lib/templates"

import { bulletList } from "../page-utils"
import type { MarkdownPage } from "../types"

async function getStarterTemplatesMarkdown(ids: string[]): Promise<string> {
  if (!ids.length) return ""

  let selected: IAgentTemplateData[] = []
  try {
    const all = await getAgentTemplates()
    const byId = new Map(all.map((template) => [template.id, template]))
    selected = ids
      .map((id) => byId.get(id))
      .filter((template): template is IAgentTemplateData => Boolean(template))
  } catch {
    return ""
  }

  if (!selected.length) return ""

  const items = selected
    .map(
      (template) =>
        `- ${template.name} (${template.agentName}): ${template.summary} Start it at ${ROUTE.connectApp}?agentTemplateId=${template.id}`
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
    .map((line) => `- ${line.from}: ${line.text}`)
    .join("\n")

  const faq = channel.faq
    .map((item) => `### ${item.question}\n\n${item.answer}`)
    .join("\n\n")

  const body = [
    channel.hero.subheading,
    channel.citation,
    `Connect command: npx novu connect --channel ${channel.cliSlug}`,
    `## What your agent can do in ${channel.channelName}`,
    bulletList(channel.capabilities),
    `## Example use case`,
    `Agent: ${channel.useCase.company}. Talking to: ${channel.useCase.audience}.`,
    channel.useCase.summary,
    transcript,
    templatesMarkdown,
    `## How to connect`,
    channel.onRamp.note,
    `Prompt for your coding agent: ${channel.prompt}`,
    `## ${channel.channelName} and Novu Connect, common questions`,
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
