import { getChannelBySlug } from "@/data/pages/channels"
import { getFrameworkBySlug } from "@/data/pages/frameworks"

import type { IChannelPageData } from "@/types/channel"
import type { IAgentFrameworkData } from "@/types/framework"

/**
 * The framework x channel matrix, one published combo per page
 * (e.g. /channels/slack/langchain). Add a { channel, framework } pair here to
 * publish it; unlisted pairs return notFound. Both slugs must exist in their
 * own registries (channels + frameworks).
 */
export const publishedCombos: Array<{ channel: string; framework: string }> = [
  { channel: "slack", framework: "langchain" },
  { channel: "microsoft-teams", framework: "langchain" },
  { channel: "whatsapp", framework: "langchain" },
  { channel: "telegram", framework: "langchain" },
  { channel: "email", framework: "langchain" },
  { channel: "slack", framework: "ai-sdk" },
  { channel: "microsoft-teams", framework: "ai-sdk" },
  { channel: "whatsapp", framework: "ai-sdk" },
  { channel: "telegram", framework: "ai-sdk" },
  { channel: "email", framework: "ai-sdk" },
]

export interface IChannelFrameworkCombo {
  channel: IChannelPageData
  framework: IAgentFrameworkData
}

export function getCombo(
  channelSlug: string,
  frameworkSlug: string
): IChannelFrameworkCombo | undefined {
  const isPublished = publishedCombos.some(
    (combo) =>
      combo.channel === channelSlug && combo.framework === frameworkSlug
  )
  if (!isPublished) return undefined

  const channel = getChannelBySlug(channelSlug)
  const framework = getFrameworkBySlug(frameworkSlug)
  if (!channel || !framework) return undefined

  return { channel, framework }
}

export function getAllComboParams(): Array<{
  channel: string
  framework: string
}> {
  return publishedCombos.filter(
    (combo) =>
      getChannelBySlug(combo.channel) && getFrameworkBySlug(combo.framework)
  )
}

/**
 * The connect command for a combo. Bridge frameworks pass `--runtime`;
 * managed frameworks connect the channel directly.
 */
export function getConnectCommand(combo: IChannelFrameworkCombo): string {
  const { channel, framework } = combo
  if (framework.connectPath === "bridge" && framework.runtimeFlag) {
    return `npx novu connect --runtime ${framework.runtimeFlag} --channel ${channel.cliSlug}`
  }
  return `npx novu connect --channel ${channel.cliSlug}`
}

/** Substitute {channelName} and {cliSlug} placeholders in framework copy. */
export function fillTemplate(
  text: string,
  combo: IChannelFrameworkCombo
): string {
  return text
    .replaceAll("{channelName}", combo.channel.channelName)
    .replaceAll("{cliSlug}", combo.channel.cliSlug)
}

/**
 * Other published channels for the same framework, excluding the current one.
 * Powers the "connect to another channel" chooser at the foot of each page.
 */
export function getSiblingChannels(
  combo: IChannelFrameworkCombo
): IChannelPageData[] {
  return publishedCombos
    .filter(
      (c) =>
        c.framework === combo.framework.slug && c.channel !== combo.channel.slug
    )
    .map((c) => getChannelBySlug(c.channel))
    .filter((channel): channel is IChannelPageData => Boolean(channel))
}

/** Public path to a combo's rendered cover image. */
export function getCoverImagePath(combo: IChannelFrameworkCombo): string {
  return `/images/covers/${combo.framework.slug}-${combo.channel.slug}.jpg`
}

export interface IFrameworkCommand {
  channelSlug: string
  channelName: string
  command: string
}

/**
 * Every published connect command for a framework, one per channel, in matrix
 * order. Powers the channel command picker shown next to the CLI command CTA.
 */
export function getFrameworkCommands(
  frameworkSlug: string
): IFrameworkCommand[] {
  return publishedCombos
    .filter((c) => c.framework === frameworkSlug)
    .map((c) => getCombo(c.channel, c.framework))
    .filter((combo): combo is IChannelFrameworkCombo => Boolean(combo))
    .map((combo) => ({
      channelSlug: combo.channel.slug,
      channelName: combo.channel.channelName,
      command: getConnectCommand(combo),
    }))
}

/**
 * Render-time logo asset paths (public-relative, for Remotion staticFile).
 * Used by scripts/render-covers.mjs to render one still per combo.
 */
export const FRAMEWORK_COVER_LOGO: Record<string, string> = {
  langchain: "images/integration-icons/ai/langchain-icon.svg",
  "ai-sdk": "images/integration-icons/ai/ai-sdk-icon.png",
}

export const CHANNEL_COVER_LOGO: Record<string, string> = {
  slack: "images/integration-icons/chat/slack-icon.svg",
  "microsoft-teams": "images/integration-icons/chat/microsoft-teams-icon.svg",
  whatsapp: "images/integration-icons/chat/whatsapp-business-icon.svg",
  telegram: "images/covers-assets/telegram.svg",
  email: "images/covers-assets/email.svg",
}
