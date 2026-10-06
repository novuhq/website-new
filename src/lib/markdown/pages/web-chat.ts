import { ROUTE } from "@/constants/routes"
import {
  HERO_CLI_COMMAND,
  HERO_IMPLEMENT_PROMPT,
  HERO_META_INTEGRATIONS,
  HERO_META_INTEGRATIONS_PREFIX,
  HERO_META_INTEGRATIONS_SUFFIX,
  WEB_CHAT_SEO,
} from "@/data/pages/web-chat"
import {
  CHANNELS_GRID_DESCRIPTION,
  CHANNELS_GRID_HEADING_FULL,
  CHANNELS_GRID_TILES,
} from "@/data/pages/web-chat-channels"
import {
  COMPARE_DESCRIPTION,
  COMPARE_HEADING,
  COMPARE_OLD_WIDGET_POINTS,
  COMPARE_OLD_WIDGET_TITLE,
  COMPARE_WEB_CHAT_POINTS,
  COMPARE_WEB_CHAT_TITLE,
} from "@/data/pages/web-chat-compare"
import {
  CONFIGURATOR_DESCRIPTION,
  CONFIGURATOR_HEADING,
} from "@/data/pages/web-chat-configurator"
import {
  DEPLOY_ACI_DESCRIPTION,
  DEPLOY_ACI_HEADING,
  DEPLOY_ACI_ITEMS,
} from "@/data/pages/web-chat-deploy-aci"
import {
  DESIGN_SYSTEM_DESCRIPTION,
  DESIGN_SYSTEM_HEADING,
} from "@/data/pages/web-chat-design-system"
import {
  OWNERSHIP_CARDS,
  OWNERSHIP_TAGLINE_WORDS,
} from "@/data/pages/web-chat-ownership"
import {
  PRODUCT_BENTO_CARDS,
  PRODUCT_BENTO_DESCRIPTION,
  PRODUCT_BENTO_HEADING_LINES,
} from "@/data/pages/web-chat-product-bento"
import {
  SURFACE_TABS_BUTTON_HREF,
  SURFACE_TABS_BUTTON_LABEL,
  SURFACE_TABS_DESCRIPTION_LINES,
  SURFACE_TABS_HEADING_LINES,
} from "@/data/pages/web-chat-surface-tabs"

import {
  escapeMarkdownText,
  formatCodeFence,
  formatMarkdownLink,
} from "../markdown-format"
import { bulletList, linkList } from "../page-utils"
import type { MarkdownPage } from "../types"
import { absoluteUrl, toCanonicalPathname } from "../url"

const PATHNAME = String(ROUTE.channelWebChat)

function pageUrl(pathname: string) {
  return absoluteUrl(toCanonicalPathname(pathname))
}

function titledList(items: ReadonlyArray<{ title: string; body: string }>) {
  return items
    .map(
      (item) =>
        `- ${escapeMarkdownText(item.title)}: ${escapeMarkdownText(item.body)}`
    )
    .join("\n")
}

/** The hero's meta line, with the same links: "… our Lovable and v0 integrations." */
function integrationsSentence() {
  const links = HERO_META_INTEGRATIONS.map((integration) =>
    formatMarkdownLink(integration.label, pageUrl(integration.href))
  )
  const list =
    links.length > 1
      ? `${links.slice(0, -1).join(", ")} and ${links.at(-1)}`
      : links.join("")

  return `${escapeMarkdownText(HERO_META_INTEGRATIONS_PREFIX)} ${list} ${escapeMarkdownText(HERO_META_INTEGRATIONS_SUFFIX)}`
}

function taglineText(accent: boolean) {
  return OWNERSHIP_TAGLINE_WORDS.filter((word) => word.accent === accent)
    .map((word) => word.text)
    .join(" ")
}

export async function getWebChat(
  pathname: string
): Promise<MarkdownPage | null> {
  if (pathname !== PATHNAME) return null

  const body = [
    `Connect command: ${escapeMarkdownText(HERO_CLI_COMMAND)}`,
    `Prompt for your coding agent:\n\n${formatCodeFence(HERO_IMPLEMENT_PROMPT, "text")}`,
    integrationsSentence(),
    `## ${escapeMarkdownText(COMPARE_HEADING)}`,
    escapeMarkdownText(COMPARE_DESCRIPTION),
    `### ${escapeMarkdownText(COMPARE_OLD_WIDGET_TITLE)}`,
    bulletList([...COMPARE_OLD_WIDGET_POINTS]),
    `### ${escapeMarkdownText(COMPARE_WEB_CHAT_TITLE)}`,
    bulletList([...COMPARE_WEB_CHAT_POINTS]),
    `## ${escapeMarkdownText(PRODUCT_BENTO_HEADING_LINES.join(" "))}`,
    escapeMarkdownText(PRODUCT_BENTO_DESCRIPTION),
    titledList(PRODUCT_BENTO_CARDS),
    `## ${escapeMarkdownText(SURFACE_TABS_HEADING_LINES.join(" "))}`,
    escapeMarkdownText(SURFACE_TABS_DESCRIPTION_LINES.join(" ")),
    formatMarkdownLink(SURFACE_TABS_BUTTON_LABEL, SURFACE_TABS_BUTTON_HREF),
    `## ${escapeMarkdownText(CHANNELS_GRID_HEADING_FULL)}`,
    escapeMarkdownText(CHANNELS_GRID_DESCRIPTION),
    linkList(
      CHANNELS_GRID_TILES.map((tile) => ({
        title: tile.name,
        href: pageUrl(String(tile.href)),
      }))
    ),
    `## ${escapeMarkdownText(DEPLOY_ACI_HEADING)}`,
    escapeMarkdownText(DEPLOY_ACI_DESCRIPTION),
    titledList(DEPLOY_ACI_ITEMS),
    `## ${escapeMarkdownText(DESIGN_SYSTEM_HEADING)}`,
    escapeMarkdownText(DESIGN_SYSTEM_DESCRIPTION),
    `## ${escapeMarkdownText(CONFIGURATOR_HEADING)}`,
    escapeMarkdownText(CONFIGURATOR_DESCRIPTION),
    `## ${escapeMarkdownText(taglineText(false).replace(/\.$/, ""))}`,
    escapeMarkdownText(`${taglineText(true)}.`),
    titledList(OWNERSHIP_CARDS),
  ]
    .filter(Boolean)
    .join("\n\n")

  return {
    title: WEB_CHAT_SEO.title,
    description: WEB_CHAT_SEO.description,
    pathname: PATHNAME,
    body,
  }
}
