import { ROUTE } from "@/constants/routes"
import {
  HOME_CHANNEL_PAGE_PATHNAMES,
  HOME_CHANNELS,
  HOME_CLI_SLUGS,
  HOME_COMPLIANCE,
  HOME_COMPLIANCE_CERTIFICATIONS,
  HOME_CONNECT_STACK,
  HOME_FAQ,
  HOME_FEATURED_CUSTOMERS,
  HOME_HERO,
  HOME_LIVE_CHANNEL_KEYS,
  HOME_NOVU_CONNECT_INTRO,
  HOME_NOVU_CONNECT_ITEMS,
  HOME_NOVU_NOTIFY_INTRO,
  HOME_NOVU_NOTIFY_ITEMS,
} from "@/data/pages/home"

import { escapeMarkdownText, formatMarkdownLink } from "../markdown-format"
import { bulletList, faqMarkdown } from "../page-utils"
import { absoluteUrl, toCanonicalPathname } from "../url"

function section(title: string, content: Array<string | undefined | null>) {
  return [`## ${title}`, ...content].filter(Boolean).join("\n\n")
}

function itemSections(items: Array<{ title: string; description: string }>) {
  return items
    .map((item) => `### ${item.title}\n\n${item.description.trim()}`)
    .join("\n\n")
}

const LIVE_CHANNEL_KEYS = new Set<string>(HOME_LIVE_CHANNEL_KEYS)

function channelLine(channel: (typeof HOME_CHANNELS)[number]) {
  const pagePathname = HOME_CHANNEL_PAGE_PATHNAMES[channel.key]
  const label = pagePathname
    ? formatMarkdownLink(
        channel.label,
        absoluteUrl(toCanonicalPathname(pagePathname))
      )
    : escapeMarkdownText(channel.label)
  const cliSlug = HOME_CLI_SLUGS[channel.key]
  const status = LIVE_CHANNEL_KEYS.has(channel.key)
    ? cliSlug
      ? `Connect with \`npx novu connect --channel ${cliSlug}\`.`
      : "Live now."
    : "Coming soon."

  return `- ${label}: ${escapeMarkdownText(channel.description)} ${status}`
}

export async function getHomeBody() {
  const featuredCustomersSection = section(HOME_FEATURED_CUSTOMERS.title, [
    bulletList(
      HOME_FEATURED_CUSTOMERS.items.map(
        (item) =>
          `“${item.quote}” — ${item.authorName}, ${item.authorPosition} at ${item.company}`
      )
    ),
    formatMarkdownLink(
      HOME_FEATURED_CUSTOMERS.linkText,
      absoluteUrl(toCanonicalPathname("/customers"))
    ),
  ])

  return [
    HOME_HERO.description,
    `Connect command: \`${HOME_HERO.command}\``,
    section("Channels your agent and product can reach", [
      HOME_CHANNELS.map(channelLine).join("\n"),
    ]),
    section("Novu Connect: The Agent Communication Infrastructure", [
      HOME_NOVU_CONNECT_INTRO.description.trim(),
      HOME_CONNECT_STACK.title,
      HOME_CONNECT_STACK.description,
      itemSections(HOME_NOVU_CONNECT_ITEMS),
    ]),
    section("Novu Notify: notification infrastructure for products", [
      HOME_NOVU_NOTIFY_INTRO.description,
      itemSections(HOME_NOVU_NOTIFY_ITEMS),
    ]),
    featuredCustomersSection,
    section(HOME_COMPLIANCE.title, [
      HOME_COMPLIANCE.description,
      itemSections(
        HOME_COMPLIANCE.items.map((item) => ({
          title: item.question,
          description: item.answer,
        }))
      ),
      bulletList(HOME_COMPLIANCE_CERTIFICATIONS),
    ]),
    faqMarkdown(HOME_FAQ),
    section("Prompt for your coding agent", [
      `Connect my AI agent to my customers' channels with Novu. Start with \`npx novu connect\`, or read ${absoluteUrl("/agents.md")} for the full agent quickstart.`,
    ]),
    section("Get started", [
      [
        formatMarkdownLink("Start building", ROUTE.dashboardV2SignUp),
        formatMarkdownLink("Read the docs", ROUTE.docsOverview),
        formatMarkdownLink("Agent quickstart", absoluteUrl("/agents.md")),
      ]
        .map((item) => `- ${item}`)
        .join("\n"),
    ]),
  ]
    .filter(Boolean)
    .join("\n\n")
}
