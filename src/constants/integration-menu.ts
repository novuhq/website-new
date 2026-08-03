import type { Route } from "next"
import { ROUTE } from "@/constants/routes"

import type { IMenuItem } from "@/types/common"
import type { TIntegrationMenuSlug } from "@/types/integration-menu"

const integrationItem = (
  label: string,
  slug: TIntegrationMenuSlug
): IMenuItem => ({
  label,
  href: `/integrations/${slug}` as Route<string>,
  integrationIcon: `integration-${slug}`,
})

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

// Keep each curated list in the same order as its integration MDX entries.
// The menu shows up to seven integrations and links the remainder to the category.
export const INTEGRATION_MENU_ITEMS: IMenuItem[] = [
  categoryItem("In-app", ROUTE.integrationsChannelsInApp, 1, [
    integrationItem("Novu Inbox", "novu-inbox"),
  ]),
  categoryItem("Email", ROUTE.integrationsChannelsEmail, 18, [
    integrationItem("SendGrid", "sendgrid"),
    integrationItem("Amazon SES", "ses"),
    integrationItem("Postmark", "postmark"),
    integrationItem("Resend", "resend"),
    integrationItem("Brevo (Sendinblue)", "brevo"),
    integrationItem("Mailgun", "mailgun"),
    integrationItem("Mailjet", "mailjet"),
  ]),
  categoryItem("SMS", ROUTE.integrationsChannelsSms, 23, [
    integrationItem("Twilio", "twilio"),
    integrationItem("Plivo", "plivo"),
    integrationItem("AWS SNS", "aws-sns"),
    integrationItem("Nexmo (Vonage)", "vonage"),
    integrationItem("SMS77 (seven.io)", "sms77"),
    integrationItem("Telnyx", "telnyx"),
    integrationItem("Termii", "termii"),
  ]),
  categoryItem("Push", ROUTE.integrationsChannelsPush, 7, [
    integrationItem("Firebase Cloud Messaging", "fcm"),
    integrationItem("Apple Push Notification", "apns"),
    integrationItem("Expo Push", "expo-push"),
    integrationItem("OneSignal", "onesignal"),
    integrationItem("Pushpad", "pushpad"),
    integrationItem("Pusher Beams", "pusher-beams"),
    integrationItem("Push Webhook", "push-webhook"),
  ]),
  categoryItem("Chat", ROUTE.integrationsChannelsChat, 6, [
    integrationItem("Slack", "slack"),
    integrationItem("Discord", "discord"),
    integrationItem("Microsoft Teams", "ms-teams"),
    integrationItem("Mattermost", "mattermost"),
    integrationItem("WhatsApp Business", "whatsapp"),
    integrationItem("Zulip", "zulip"),
  ]),
  categoryItem("Workflow integrations", ROUTE.integrationsSourcesWorkflow, 5, [
    integrationItem("React Email", "react-email"),
    integrationItem("Vue Email", "vue-email"),
    integrationItem("MJML", "mjml"),
    integrationItem("Maizzle", "maizzle"),
    integrationItem("Brail", "brail"),
  ]),
  categoryItem("AI SDKs", ROUTE.integrationsSourcesAiSdks, 2, [
    integrationItem("LangChain", "langchain"),
    integrationItem("Vercel AI SDK", "vercel-ai-sdk"),
  ]),
  categoryItem("Feature Flags", ROUTE.integrationsSourcesFeatureFlags, 3, [
    integrationItem("LaunchDarkly", "launchdarkly"),
    integrationItem("Flagsmith", "flagsmith"),
    integrationItem("PostHog", "posthog"),
  ]),
]
