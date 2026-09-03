import {
  EMAIL_AGENTS_COMMAND,
  EMAIL_AGENTS_DELIVERY,
  EMAIL_AGENTS_PROMPT,
  EMAIL_AGENTS_SEO_DESCRIPTION,
  EMAIL_AGENTS_SEO_TITLE,
  emailForAiAgentsData as channel,
} from "@/data/pages/email-for-ai-agents"

import { escapeMarkdownText } from "../markdown-format"
import { bulletList } from "../page-utils"
import type { MarkdownPage } from "../types"

const PATHNAME = "/email-for-ai-agents"

export async function getEmailForAiAgents(
  pathname: string
): Promise<MarkdownPage | null> {
  if (pathname !== PATHNAME) return null

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
    `Connect command: ${escapeMarkdownText(EMAIL_AGENTS_COMMAND)}`,
    "## What your agent can do over Email",
    bulletList(channel.capabilities),
    `## ${escapeMarkdownText(EMAIL_AGENTS_DELIVERY.title)}`,
    escapeMarkdownText(EMAIL_AGENTS_DELIVERY.description),
    bulletList(
      EMAIL_AGENTS_DELIVERY.points.map(
        (point) => `${point.title}: ${point.description}`
      )
    ),
    "## Example use case",
    `Agent: ${escapeMarkdownText(channel.useCase.company)}. Talking to: ${escapeMarkdownText(channel.useCase.audience)}.`,
    escapeMarkdownText(channel.useCase.summary),
    transcript,
    "## How to connect",
    escapeMarkdownText(channel.onRamp.note),
    `Prompt for your coding agent: ${escapeMarkdownText(EMAIL_AGENTS_PROMPT)}`,
    "## Email for AI agents, common questions",
    faq,
  ]
    .filter(Boolean)
    .join("\n\n")

  return {
    title: EMAIL_AGENTS_SEO_TITLE,
    description: EMAIL_AGENTS_SEO_DESCRIPTION,
    pathname: PATHNAME,
    body,
  }
}
