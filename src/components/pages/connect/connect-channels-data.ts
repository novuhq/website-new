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
      iconClassName: "size-[75%]",
    },
  },
  {
    name: "WhatsApp",
    description: "Reach users fast",
    icon: whatsappIcon,
    hero: {
      iconClassName: "size-[82%]",
    },
  },
  {
    name: "Email",
    description: "Deliver clean digests",
    icon: emailIcon,
    hero: {
      iconClassName: "size-[86%]",
    },
  },
  {
    name: "Telegram",
    description: "Push instant updates",
    icon: telegramIcon,
    hero: {
      iconClassName: "size-[76.5%]",
    },
  },
  {
    name: "Teams",
    description: "Notify team channels",
    icon: teamsIcon,
    hero: {
      name: "MS Teams",
      icon: teamsHeroIcon,
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

const CONNECT_HERO_CHANNELS: ConnectHeroChannel[] = CONNECT_CHANNEL_ITEMS.filter(
  isConnectChannelAvailable
).map((channel) => ({
  name: channel.hero?.name ?? channel.name,
  icon: channel.hero?.icon ?? channel.icon,
  iconClassName: channel.hero?.iconClassName,
}))

export { CONNECT_CHANNELS, CONNECT_HERO_CHANNELS }
export type { ConnectChannel }
