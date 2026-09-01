import emailStackIcon from "@/svgs/pages/home/stack/email.svg"
import slackStackIcon from "@/svgs/pages/home/stack/slack.svg"
import teamsStackIcon from "@/svgs/pages/home/stack/teams.svg"
import telegramStackIcon from "@/svgs/pages/home/stack/telegram.svg"
import whatsappStackIcon from "@/svgs/pages/home/stack/whatsapp.svg"

import type { IStackOption } from "@/components/pages/home/connect-stack"

// Channel options for the ConnectStack configurator on /solutions/ai-agents.
// The five approved Connect channels only (the homepage default list also
// carries iMessage, which is gated here). "Microsoft Teams" spelled in full.
export const AGENT_CONNECT_CHANNELS: IStackOption[] = [
  { value: "slack", label: "Slack", icon: slackStackIcon },
  { value: "teams", label: "Microsoft Teams", icon: teamsStackIcon },
  { value: "whatsapp", label: "WhatsApp", icon: whatsappStackIcon },
  { value: "telegram", label: "Telegram", icon: telegramStackIcon },
  { value: "email", label: "Email", icon: emailStackIcon },
]

export const AGENT_CONNECT_TITLE = "Wire it for your exact stack"

export const AGENT_CONNECT_DESCRIPTION =
  "Pick your channel and the framework your agent already uses. Novu generates the prompt to paste into your coding agent, or the exact CLI command to run. Same two minutes, whatever your stack."
