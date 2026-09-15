import type { Route } from "next"
import type { StaticImageData } from "next/image"
import { ROUTE } from "@/constants/routes"
import emailIcon from "@/svgs/pages/channels/web-chat/channel-email.svg"
import teamsIcon from "@/svgs/pages/channels/web-chat/channel-teams.svg"
import iMessageIcon from "@/svgs/pages/connect/channels/imessage.svg"
import slackIcon from "@/svgs/pages/connect/channels/slack.svg"
import telegramIcon from "@/svgs/pages/connect/channels/telegram.svg"
import webChatIcon from "@/svgs/pages/connect/channels/web-chat.svg"
import whatsappIcon from "@/svgs/pages/connect/channels/whatsapp.svg"

/**
 * §5 "channels grid" (Figma `45487-81559`, mobile `45497-144406`). Section
 * is not personalized: no brand-accent tokens here, only the shared design
 * system.
 */

// Heading (`45487-81704` desktop, `45497-144386` mobile). The frame breaks
// each breakpoint's copy differently, so both line groupings are captured
// verbatim rather than one being inferred from the other.
export const CHANNELS_GRID_HEADING_FULL =
  "Your agent starts in-app and continues across every connected channel"

export const CHANNELS_GRID_HEADING_MOBILE_LINES = [
  "Your agent starts",
  "in-app and continues across every connected channel",
] as const

export const CHANNELS_GRID_HEADING_DESKTOP_LINES = [
  "Your agent starts in-app",
  "and continues across",
  "every connected channel",
] as const

// Description (`45487-81705` desktop, `45497-144387` mobile) — same copy,
// but the mobile frame sets it in `rgba(255,255,255,0.8)` rather than the
// desktop `#A3A6B2`.
export const CHANNELS_GRID_DESCRIPTION =
  "Novu Connect, our Agent Communication Infrastructure (ACI), keeps the same agent and conversation across your product and every channel, without code changes. Choose a channel to learn how to connect it."

// Actions (`45487-81707` button, `45487-81715` CLI pill)
export const CHANNELS_GRID_BOOK_A_DEMO_LABEL = "Book a demo"
export const CHANNELS_GRID_CLI_COMMAND = "npx novu connect"

export interface IChannelsGridTile {
  href?: Route<string>
  icon: StaticImageData
  isActive?: boolean
  name: string
}

export interface ILinkedChannelsGridTile extends IChannelsGridTile {
  href: Route<string>
}

// Grid contents, reading the frame row by row: Telegram, MS Teams, Email,
// iMessage, Slack, WhatsApp, then the two-wide mascot card, then the active
// Web Chat tile (current page, so it carries no link).
export const CHANNELS_GRID_TILES: ILinkedChannelsGridTile[] = [
  {
    name: "Telegram",
    icon: telegramIcon,
    href: ROUTE.channelTelegram as Route<string>,
  },
  {
    name: "MS Teams",
    icon: teamsIcon,
    href: ROUTE.channelMicrosoftTeams as Route<string>,
  },
  { name: "Email", icon: emailIcon, href: ROUTE.channelEmail as Route<string> },
  {
    name: "iMessage",
    icon: iMessageIcon,
    href: ROUTE.channelIMessage as Route<string>,
  },
  { name: "Slack", icon: slackIcon, href: ROUTE.channelSlack as Route<string> },
  {
    name: "WhatsApp",
    icon: whatsappIcon,
    href: ROUTE.channelWhatsApp as Route<string>,
  },
]

export const CHANNELS_GRID_WEB_CHAT_TILE: IChannelsGridTile = {
  name: "Web Chat",
  icon: webChatIcon,
  isActive: true,
}
