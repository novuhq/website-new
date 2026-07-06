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
import emailHeroIcon from "@/svgs/pages/connect/hero/email.svg"
import slackHeroIcon from "@/svgs/pages/connect/hero/slack.svg"
import teamsHeroIcon from "@/svgs/pages/connect/hero/teams.svg"
import telegramHeroIcon from "@/svgs/pages/connect/hero/telegram.svg"
import whatsappHeroIcon from "@/svgs/pages/connect/hero/whatsapp.svg"

type ConnectChannelState = "default" | "coming-soon"

interface ConnectChannel {
  name: string
  description?: string
  state?: ConnectChannelState
  icon: StaticImageData
}

interface HeroChannelPresentation {
  name?: string
  icon?: StaticImageData
  iconClassName?: string
}

type ConnectChannelItem = ConnectChannel & {
  hero?: HeroChannelPresentation
}

type ConnectHeroChannel = {
  name: string
  icon: StaticImageData
  iconClassName?: string
}

const CONNECT_CHANNEL_ITEMS = [
  {
    name: "Slack",
    description: "Send team alerts",
    icon: slackIcon,
    hero: {
      icon: slackHeroIcon,
      iconClassName: "translate-y-[0.019em] lg:translate-y-[0.058em]",
    },
  },
  {
    name: "WhatsApp",
    description: "Reach users fast",
    icon: whatsappIcon,
    hero: {
      icon: whatsappHeroIcon,
      iconClassName: "translate-y-[0.019em] lg:translate-y-[0.058em]",
    },
  },
  {
    name: "Email",
    description: "Deliver clean digests",
    icon: emailIcon,
    hero: {
      icon: emailHeroIcon,
      iconClassName: "translate-y-[0.038em] lg:translate-y-[0.058em]",
    },
  },
  {
    name: "Telegram",
    description: "Push instant updates",
    icon: telegramIcon,
    hero: {
      icon: telegramHeroIcon,
      iconClassName: "translate-y-[0.019em] lg:translate-y-[0.058em]",
    },
  },
  {
    name: "Teams",
    description: "Notify team channels",
    icon: teamsIcon,
    hero: {
      name: "MS Teams",
      icon: teamsHeroIcon,
      iconClassName: "lg:translate-y-[0.058em]",
    },
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
] satisfies ConnectChannelItem[]

function getConnectChannel(channel: ConnectChannelItem): ConnectChannel {
  const connectChannel: ConnectChannel = {
    name: channel.name,
    icon: channel.icon,
  }

  if (channel.description) {
    connectChannel.description = channel.description
  }

  if (channel.state) {
    connectChannel.state = channel.state
  }

  return connectChannel
}

function isConnectChannelAvailable(channel: ConnectChannel) {
  return channel.state !== "coming-soon"
}

const CONNECT_CHANNELS: ConnectChannel[] =
  CONNECT_CHANNEL_ITEMS.map(getConnectChannel)

const CONNECT_HERO_CHANNELS: ConnectHeroChannel[] =
  CONNECT_CHANNEL_ITEMS.filter(isConnectChannelAvailable).map((channel) => ({
    name: channel.hero?.name ?? channel.name,
    icon: channel.hero?.icon ?? channel.icon,
    iconClassName: channel.hero?.iconClassName,
  }))

export { CONNECT_CHANNELS, CONNECT_HERO_CHANNELS }
export type { ConnectChannel }
