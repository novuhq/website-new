import type { IChannelPageData } from "@/types/channel"

import { emailChannelData } from "./email"
import { imessageChannelData } from "./imessage"
import { microsoftTeamsChannelData } from "./microsoft-teams"
import { slackChannelData } from "./slack"
import { telegramChannelData } from "./telegram"
import { whatsappChannelData } from "./whatsapp"

export const channelPages: Record<string, IChannelPageData> = {
  slack: slackChannelData,
  whatsapp: whatsappChannelData,
  telegram: telegramChannelData,
  "microsoft-teams": microsoftTeamsChannelData,
  email: emailChannelData,
  imessage: imessageChannelData,
}

export function getChannelBySlug(slug: string): IChannelPageData | undefined {
  return channelPages[slug]
}

export function getAllChannelSlugs(): string[] {
  return Object.keys(channelPages)
}

export function getAllChannels(): IChannelPageData[] {
  return Object.values(channelPages)
}
