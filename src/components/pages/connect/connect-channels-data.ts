import type { StaticImageData } from "next/image"
import discordIcon from "@/svgs/pages/connect/channels/discord.svg"
import emailIcon from "@/svgs/pages/connect/channels/email.svg"
import githubIcon from "@/svgs/pages/connect/channels/github.svg"
import googleChatIcon from "@/svgs/pages/connect/channels/google-chat.svg"
import iMessageIcon from "@/svgs/pages/connect/channels/imessage.svg"
import linearIcon from "@/svgs/pages/connect/channels/linear.svg"
import messengerIcon from "@/svgs/pages/connect/channels/messenger.svg"
import slackIcon from "@/svgs/pages/connect/channels/slack.svg"
import teamsIcon from "@/svgs/pages/connect/channels/teams.png"
import telegramIcon from "@/svgs/pages/connect/channels/telegram.svg"
import whatsappIcon from "@/svgs/pages/connect/channels/whatsapp.svg"
import zoomIcon from "@/svgs/pages/connect/channels/zoom.svg"
import teamsHeroIcon from "@/svgs/pages/connect/hero/teams.svg"

type ConnectChannelState = "default" | "coming-soon"

interface IConnectChannel {
  name: string
  description?: string
  state?: ConnectChannelState
  icon: StaticImageData
  heroName?: string
  heroIcon?: StaticImageData
  heroIconClassName?: string
}

const CONNECT_CHANNELS: IConnectChannel[] = [
  {
    name: "Slack",
    description: "Send team alerts",
    icon: slackIcon,
    heroIconClassName: "size-[75%]",
  },
  {
    name: "WhatsApp",
    description: "Reach users fast",
    icon: whatsappIcon,
    heroIconClassName: "size-[82%]",
  },
  {
    name: "Email",
    description: "Deliver clean digests",
    icon: emailIcon,
    heroIconClassName: "size-[86%]",
  },
  {
    name: "Telegram",
    description: "Push instant updates",
    icon: telegramIcon,
    heroIconClassName: "size-[76.5%]",
  },
  {
    name: "Teams",
    description: "Notify team channels",
    icon: teamsIcon,
    heroName: "MS Teams",
    heroIcon: teamsHeroIcon,
  },
  {
    name: "Google Chat",
    state: "coming-soon",
    icon: googleChatIcon,
  },
  {
    name: "iMessage",
    state: "coming-soon",
    icon: iMessageIcon,
  },
  {
    name: "Linear",
    state: "coming-soon",
    icon: linearIcon,
  },
  {
    name: "Zoom",
    state: "coming-soon",
    icon: zoomIcon,
  },
  {
    name: "Discord",
    state: "coming-soon",
    icon: discordIcon,
  },
  {
    name: "Messenger",
    state: "coming-soon",
    icon: messengerIcon,
  },
  {
    name: "GitHub",
    state: "coming-soon",
    icon: githubIcon,
  },
]

function isConnectChannelAvailable(channel: IConnectChannel) {
  return channel.state !== "coming-soon"
}

export { CONNECT_CHANNELS, isConnectChannelAvailable }
export type { IConnectChannel }
