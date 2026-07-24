import type { CSSProperties } from "react"
import DiscordIcon from "@/images/pages/home/features/discord.inline.svg"
import EmailIcon from "@/images/pages/home/features/email.inline.svg"
import GithubIcon from "@/images/pages/home/features/github.inline.svg"
import GoogleChatIcon from "@/images/pages/home/features/google-chat.inline.svg"
import ImessageIcon from "@/images/pages/home/features/imessage.inline.svg"
import LinearIcon from "@/images/pages/home/features/linear.inline.svg"
import MessengerIcon from "@/images/pages/home/features/messenger.inline.svg"
import SlackIcon from "@/images/pages/home/features/slack.inline.svg"
import TeamsIcon from "@/images/pages/home/features/teams.inline.svg"
import TelegramIcon from "@/images/pages/home/features/telegram.inline.svg"
import WhatsappIcon from "@/images/pages/home/features/whatsapp.inline.svg"
import ZoomIcon from "@/images/pages/home/features/zoom.inline.svg"

import { cn } from "@/lib/utils"

const CHANNEL_ICONS = {
  slack: SlackIcon,
  whatsapp: WhatsappIcon,
  telegram: TelegramIcon,
  teams: TeamsIcon,
  github: GithubIcon,
  email: EmailIcon,
  imessage: ImessageIcon,
  zoom: ZoomIcon,
  linear: LinearIcon,
  discord: DiscordIcon,
  messenger: MessengerIcon,
  "google-chat": GoogleChatIcon,
}

const CHANNEL_COLORS: Record<keyof typeof CHANNEL_ICONS, string> = {
  slack: "#E01E5A",
  whatsapp: "#25D366",
  telegram: "#229ED9",
  teams: "#6264A7",
  github: "#FFFFFF",
  email: "#E18CF2",
  imessage: "#34C759",
  zoom: "#2D8CFF",
  linear: "#F7F8F8",
  discord: "#5865F2",
  messenger: "#0084FF",
  "google-chat": "#00AC47",
}

const SLACK_HOVER_CLASSES = [
  "group-hover:[&>path:nth-of-type(1)]:fill-[#E01E5A]",
  "group-hover:[&>path:nth-of-type(2)]:fill-[#36C5F0]",
  "group-hover:[&>path:nth-of-type(3)]:fill-[#2EB67D]",
  "group-hover:[&>path:nth-of-type(4)]:fill-[#ECB22E]",
  "group-focus-visible:[&>path:nth-of-type(1)]:fill-[#E01E5A]",
  "group-focus-visible:[&>path:nth-of-type(2)]:fill-[#36C5F0]",
  "group-focus-visible:[&>path:nth-of-type(3)]:fill-[#2EB67D]",
  "group-focus-visible:[&>path:nth-of-type(4)]:fill-[#ECB22E]",
]

const SLACK_ACTIVE_CLASSES = [
  "[&>path:nth-of-type(1)]:fill-[#E01E5A]",
  "[&>path:nth-of-type(2)]:fill-[#36C5F0]",
  "[&>path:nth-of-type(3)]:fill-[#2EB67D]",
  "[&>path:nth-of-type(4)]:fill-[#ECB22E]",
]

interface IChannelIconProps {
  channel: string
  className?: string
  isActive?: boolean
}

function ChannelIcon({
  channel,
  className,
  isActive = false,
}: IChannelIconProps) {
  if (!(channel in CHANNEL_ICONS)) return null

  const channelKey = channel as keyof typeof CHANNEL_ICONS
  const Icon = CHANNEL_ICONS[channelKey]
  const style = {
    "--channel-color": CHANNEL_COLORS[channelKey],
  } as CSSProperties

  return (
    <Icon
      className={cn(
        "size-6 shrink-0 text-gray-50 transition-colors duration-200 group-hover:text-[var(--channel-color)] group-focus-visible:text-[var(--channel-color)] md:size-7 [&>path]:transition-[fill] [&>path]:duration-200",
        isActive && "text-[var(--channel-color)]",
        channel === "slack" &&
          (isActive ? SLACK_ACTIVE_CLASSES : SLACK_HOVER_CLASSES),
        channel === "imessage" &&
          (isActive
            ? "[&>path:nth-of-type(2)]:fill-white"
            : "group-hover:[&>path:nth-of-type(2)]:fill-white group-focus-visible:[&>path:nth-of-type(2)]:fill-white"),
        className
      )}
      style={style}
      data-channel-icon={channel}
      aria-hidden
    />
  )
}

export default ChannelIcon
