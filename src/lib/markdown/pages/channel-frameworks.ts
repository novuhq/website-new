import {
  fillTemplate,
  getCombo,
  getConnectCommand,
} from "@/data/pages/channel-frameworks"

import { escapeMarkdownText, formatCodeFence } from "../markdown-format"
import { bulletList } from "../page-utils"
import type { MarkdownPage } from "../types"

export async function getChannelFrameworks(
  pathname: string
): Promise<MarkdownPage | null> {
  const match = pathname.match(/^\/channels\/([^/]+)\/([^/]+)$/)
  if (!match) return null

  const combo = getCombo(match[1], match[2])
  if (!combo) return null

  const { channel, framework } = combo

  const steps = framework.steps
    .map(
      (step, index) =>
        `${index + 1}. ${escapeMarkdownText(step.title)}: ${escapeMarkdownText(fillTemplate(step.body, combo))}`
    )
    .join("\n")

  const faq = [
    ...framework.faq.map((item) => ({
      question: fillTemplate(item.question, combo),
      answer: fillTemplate(item.answer, combo),
    })),
    ...channel.faq
      .filter((item) => !/^Does Novu run/i.test(item.question))
      .slice(0, 2),
  ]
    .map(
      (item) =>
        `### ${escapeMarkdownText(item.question)}\n\n${escapeMarkdownText(item.answer)}`
    )
    .join("\n\n")

  const body = [
    `${escapeMarkdownText(framework.tagline)} Novu Connect gives it a voice in ${escapeMarkdownText(channel.channelName)}.`,
    escapeMarkdownText(fillTemplate(framework.connectIntro, combo)),
    `Connect command: ${escapeMarkdownText(getConnectCommand(combo))}`,
    `## What is ${escapeMarkdownText(framework.name)}`,
    escapeMarkdownText(framework.whatItIs),
    bulletList(framework.strengths),
    `## How to connect ${escapeMarkdownText(framework.name)} to ${escapeMarkdownText(channel.channelName)}`,
    steps,
    "Prompt for your coding agent:",
    formatCodeFence(fillTemplate(framework.promptTemplate, combo), "text"),
    `## ${escapeMarkdownText(framework.name)} and ${escapeMarkdownText(channel.channelName)}, common questions`,
    faq,
  ]
    .filter(Boolean)
    .join("\n\n")

  return {
    title: `Connect ${framework.name} to ${channel.channelName} | Novu Connect`,
    description: `Give your ${framework.name} agent a voice in ${channel.channelName} with Novu Connect.`,
    pathname: `/channels/${channel.slug}/${framework.slug}`,
    body,
  }
}
