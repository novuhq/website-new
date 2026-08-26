"use client"

import emailIcon from "@/svgs/pages/home/stack/email.svg"
import slackIcon from "@/svgs/pages/home/stack/slack.svg"
import teamsIcon from "@/svgs/pages/home/stack/teams.svg"
import telegramIcon from "@/svgs/pages/home/stack/telegram.svg"
import whatsappIcon from "@/svgs/pages/home/stack/whatsapp.svg"

import type { IChannelPageData } from "@/types/channel"
import ConnectStack, {
  type IStackOption,
} from "@/components/pages/home/connect-stack"

// The five launched channels, in the exact external labels the brand rules use.
export const LIVE_CHANNEL_OPTIONS: IStackOption[] = [
  { value: "slack", label: "Slack", icon: slackIcon },
  { value: "whatsapp", label: "WhatsApp", icon: whatsappIcon },
  { value: "telegram", label: "Telegram", icon: telegramIcon },
  { value: "teams", label: "Microsoft Teams", icon: teamsIcon },
  { value: "email", label: "Email", icon: emailIcon },
]

function ChannelConnectStack({ channel }: { channel: IChannelPageData }) {
  return (
    <ConnectStack
      title={`Generate your ${channel.channelName} integration prompt`}
      description={`Pick your AI framework and copy a ready-to-use prompt to connect your agent to ${channel.channelName} with Novu Connect.`}
      channels={LIVE_CHANNEL_OPTIONS}
      defaultChannelValue={channel.cliSlug}
      variant="compact"
    />
  )
}

export default ChannelConnectStack
