import type { Route } from "next"
import { ROUTE } from "@/constants/routes"
import {
  getWebChatBuilderPathname,
  WEB_CHAT_BUILDER_LIST,
} from "@/data/pages/web-chat-builder-list"

import type { IMenuItem, TMenuIcon } from "@/types/common"
import type { TIntegrationMenuSlug } from "@/types/integration-menu"

const integrationItem = (
  label: string,
  slug: TIntegrationMenuSlug
): IMenuItem => ({
  label,
  href: `/integrations/${slug}` as Route<string>,
  integrationIcon: `integration-${slug}`,
})

const menuIconIntegrationItem = (
  label: string,
  slug: string,
  menuIcon: TMenuIcon
): IMenuItem => ({
  label,
  href: `/integrations/${slug}` as Route<string>,
  menuIcon,
})

const channelPageItem = (
  label: string,
  href: IMenuItem["href"],
  menuIcon: TMenuIcon
): IMenuItem => ({ label, href, menuIcon })

const categoryItem = (
  label: string,
  href: IMenuItem["href"],
  totalCount: number,
  children: IMenuItem[]
): IMenuItem => ({
  label,
  href,
  children,
  remainingCount: Math.max(totalCount - children.length, 0),
})

// Each category shows a curated list and links the remainder to the category.
export const INTEGRATION_MENU_ITEMS: IMenuItem[] = [
  categoryItem("In-app", ROUTE.integrationsChannelsInApp, 2, [
    integrationItem("Inbox", "novu-inbox"),
    channelPageItem("Web Chat", ROUTE.channelWebChat, "web-chat"),
  ]),
  categoryItem("Email", ROUTE.integrationsChannelsEmail, 19, [
    integrationItem("SendGrid", "sendgrid"),
    integrationItem("Amazon SES", "ses"),
    integrationItem("Postmark", "postmark"),
    integrationItem("Resend", "resend"),
    integrationItem("Brevo (Sendinblue)", "brevo"),
    integrationItem("Mailgun", "mailgun"),
    integrationItem("Mailjet", "mailjet"),
  ]),
  categoryItem("SMS", ROUTE.integrationsChannelsSms, 38, [
    integrationItem("Twilio", "twilio"),
    integrationItem("Plivo", "plivo"),
    integrationItem("AWS SNS", "aws-sns"),
    integrationItem("Nexmo (Vonage)", "vonage"),
    integrationItem("SMS77 (seven.io)", "sms77"),
    integrationItem("Telnyx", "telnyx"),
    integrationItem("Termii", "termii"),
  ]),
  categoryItem("Push", ROUTE.integrationsChannelsPush, 8, [
    integrationItem("Firebase Cloud Messaging", "fcm"),
    integrationItem("Apple Push Notification", "apns"),
    integrationItem("Expo Push", "expo-push"),
    integrationItem("OneSignal", "onesignal"),
    integrationItem("Pushpad", "pushpad"),
    integrationItem("Pusher Beams", "pusher-beams"),
    integrationItem("Push Webhook", "push-webhook"),
  ]),
  // 12 chat providers plus iMessage, which the category lists as an agent channel.
  categoryItem("Chat", ROUTE.integrationsChannelsChat, 13, [
    channelPageItem("Slack", ROUTE.channelSlack, "slack"),
    channelPageItem("Microsoft Teams", ROUTE.channelMicrosoftTeams, "teams"),
    channelPageItem("WhatsApp", ROUTE.channelWhatsApp, "whatsapp"),
    channelPageItem("Telegram", ROUTE.channelTelegram, "telegram"),
    channelPageItem("iMessage", ROUTE.channelIMessage, "imessage"),
    integrationItem("Discord", "discord"),
    integrationItem("Mattermost", "mattermost"),
    integrationItem("Zulip", "zulip"),
  ]),
  categoryItem("Agent runtimes", ROUTE.integrationsSourcesAgentRuntimes, 6, [
    integrationItem("LangChain", "langchain"),
    integrationItem("Vercel AI SDK", "vercel-ai-sdk"),
    menuIconIntegrationItem("Chat SDK", "chat-sdk", "chat-sdk"),
    menuIconIntegrationItem("Custom code", "custom-code", "custom-code"),
    menuIconIntegrationItem(
      "Claude Managed Agent",
      "claude-managed-agent",
      "claude"
    ),
    menuIconIntegrationItem(
      "AWS Claude Managed Agent",
      "aws-claude-managed-agent",
      "claude-aws"
    ),
  ]),
  categoryItem(
    "AI builders",
    ROUTE.channelWebChat,
    WEB_CHAT_BUILDER_LIST.length,
    WEB_CHAT_BUILDER_LIST.map(({ slug, builderName }) =>
      channelPageItem(
        builderName,
        getWebChatBuilderPathname(slug) as Route<string>,
        slug
      )
    )
  ),
]
