import discord from "@/svgs/pages/connect/channels/discord.svg"
import email from "@/svgs/pages/connect/channels/email.svg"
import github from "@/svgs/pages/connect/channels/github.svg"
import googleChat from "@/svgs/pages/connect/channels/google-chat.svg"
import iMessage from "@/svgs/pages/connect/channels/imessage.svg"
import linear from "@/svgs/pages/connect/channels/linear.svg"
import messenger from "@/svgs/pages/connect/channels/messenger.svg"
import slack from "@/svgs/pages/connect/channels/slack.svg"
import teams from "@/svgs/pages/connect/channels/teams.png"
import telegram from "@/svgs/pages/connect/channels/telegram.svg"
import whatsapp from "@/svgs/pages/connect/channels/whatsapp.svg"
import zoom from "@/svgs/pages/connect/channels/zoom.svg"

import type { IChannel } from "@/components/pages/connect/channels"
import Channels from "@/components/pages/connect/channels"

const CHANNELS: IChannel[] = [
  {
    name: "Slack",
    description: "Send team alerts",
    icon: slack,
  },
  {
    name: "WhatsApp",
    description: "Reach users fast",
    icon: whatsapp,
  },
  {
    name: "Email",
    description: "Deliver clean digests",
    icon: email,
  },
  {
    name: "Telegram",
    description: "Push instant updates",
    icon: telegram,
  },
  {
    name: "Teams",
    description: "Notify team channels",
    icon: teams,
  },
  {
    name: "Google Chat",
    state: "coming-soon",
    icon: googleChat,
  },
  {
    name: "iMessage",
    state: "coming-soon",
    icon: iMessage,
  },
  {
    name: "Linear",
    state: "coming-soon",
    icon: linear,
  },
  {
    name: "Zoom",
    state: "coming-soon",
    icon: zoom,
  },
  {
    name: "Discord",
    state: "coming-soon",
    icon: discord,
  },
  {
    name: "Messenger",
    state: "coming-soon",
    icon: messenger,
  },
  {
    name: "GitHub",
    state: "coming-soon",
    icon: github,
  },
]

function BookADemoConnectChannels() {
  return (
    <Channels
      channels={CHANNELS}
      className="pt-20 md:pt-30 lg:pt-40 xl:pt-60"
      description="Support customer communication across messaging, email, collaboration, and custom channels from one platform."
      headerClassName="xl:max-w-none"
      title="Meet customers wherever they are"
      titleClassName="xl:text-5xl xl:whitespace-nowrap"
      trackingLocation="book_a_demo_connect_channels"
    />
  )
}

export default BookADemoConnectChannels
