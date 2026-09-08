import type { StaticImageData } from "next/image"
import imessageIcon from "@/svgs/pages/connect/channels/imessage.svg"
import webChatIcon from "@/svgs/pages/connect/channels/web-chat.svg"
import awsIcon from "@/svgs/pages/home/stack/aws.svg"
import chatSdkIcon from "@/svgs/pages/home/stack/chat-sdk.svg"
import claudeIcon from "@/svgs/pages/home/stack/claude.svg"
import customCodeIcon from "@/svgs/pages/home/stack/custom-code.svg"
import emailIcon from "@/svgs/pages/home/stack/email.svg"
import langChainIcon from "@/svgs/pages/home/stack/lang-chain.svg"
import slackIcon from "@/svgs/pages/home/stack/slack.svg"
import teamsIcon from "@/svgs/pages/home/stack/teams.svg"
import telegramIcon from "@/svgs/pages/home/stack/telegram.svg"
import whatsappIcon from "@/svgs/pages/home/stack/whatsapp.svg"

/**
 * Shared configurator core (originally Task 3 of the web-chat Figma redesign
 * plan). Task 3 itself is still BLOCKED in this branch's history (its own
 * report: `.superpowers/sdd/2026-09-08-web-chat-figma-redesign/task-3-report.md`
 * — a sandboxed Playwright baseline never ran, so it made no source changes).
 * Its brief specified this exact module: move `IStackOption`, `DEFAULT_CHANNELS`
 * and `DEFAULT_FRAMEWORKS` out of `connect-stack.tsx` verbatim (same values,
 * same icon imports, same order) and add `WEB_CHAT_CHANNEL`.
 *
 * Task 15 (§8 configurator) depends on this module and cannot import something
 * that does not exist, so this file recreates Task 3's deliverable exactly as
 * specified, as net-new files only. `connect-stack.tsx` and
 * `channel-connect-stack.tsx` are NOT touched here — they keep their own
 * inline copies of these same lists for now. A future pass (Task 3, redone)
 * should point those two files at this module and delete their inline copies.
 */

export interface IStackOption {
  cliSlug?: string
  connectPath?: "bridge" | "managed"
  icon?: StaticImageData | string
  label: string
  promptLabel?: string
  value: string
}

export const DEFAULT_CHANNELS: IStackOption[] = [
  {
    value: "email",
    label: "Email",
    icon: emailIcon,
  },
  {
    value: "telegram",
    label: "Telegram",
    icon: telegramIcon,
  },
  {
    value: "slack",
    label: "Slack",
    icon: slackIcon,
  },
  {
    value: "teams",
    label: "MS Teams",
    icon: teamsIcon,
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    icon: whatsappIcon,
  },
  {
    value: "sendblue",
    label: "iMessage",
    icon: imessageIcon,
  },
]

export const DEFAULT_FRAMEWORKS: IStackOption[] = [
  {
    value: "ai-sdk",
    label: "Vercel AI SDK",
    icon: chatSdkIcon,
  },
  {
    value: "langchain",
    label: "LangChain",
    icon: langChainIcon,
  },
  {
    value: "custom-code",
    label: "Custom code",
    icon: customCodeIcon,
  },
  {
    value: "chat-sdk",
    label: "Chat SDK",
    icon: chatSdkIcon,
  },
  {
    value: "claude-managed-agent",
    label: "Claude Managed Agent",
    icon: claudeIcon,
    cliSlug: "claude",
    connectPath: "managed",
  },
  {
    value: "aws-claude-managed-agent",
    label: "AWS Claude Managed Agent",
    icon: awsIcon,
    cliSlug: "claude-aws",
    connectPath: "managed",
  },
]

/**
 * Not part of the homepage's channel list. Added for the Web Chat page's own
 * configurator (§8), which defaults to it. `cliSlug` must stay `"web-chat"` so
 * the generated command reads `npx novu connect --channel web-chat`, matching
 * the hero's CLI pill (`HERO_CLI_COMMAND` in `web-chat.ts`).
 */
export const WEB_CHAT_CHANNEL: IStackOption = {
  value: "web-chat",
  label: "Web Chat",
  cliSlug: "web-chat",
  icon: webChatIcon,
}
