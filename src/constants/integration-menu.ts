import type { Route } from "next"
import { ROUTE } from "@/constants/routes"

import type { IMenuItem } from "@/types/common"

const integrationItem = (
  label: string,
  slug: string,
  iconSrc: string
): IMenuItem => ({
  label,
  href: `/integrations/${slug}` as Route<string>,
  iconSrc,
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
    integrationItem(
      "Novu Inbox",
      "novu-inbox",
      "/images/integration-icons/in-app/novu-icon.svg"
    ),
  ]),
  categoryItem("Email", ROUTE.integrationsChannelsEmail, 18, [
    integrationItem(
      "SendGrid",
      "sendgrid",
      "/images/integration-icons/email/sendgrid-icon.svg"
    ),
    integrationItem(
      "Amazon SES",
      "ses",
      "/images/integration-icons/email/amazon-ses.svg"
    ),
    integrationItem(
      "Postmark",
      "postmark",
      "/images/integration-icons/email/postmark-icon.svg"
    ),
    integrationItem(
      "Resend",
      "resend",
      "/images/integration-icons/email/resend-icon.svg"
    ),
    integrationItem(
      "Brevo (Sendinblue)",
      "brevo",
      "/images/integration-icons/email/brevo-icon.svg"
    ),
    integrationItem(
      "Mailgun",
      "mailgun",
      "/images/integration-icons/email/mailgun-icon.svg"
    ),
    integrationItem(
      "Mailjet",
      "mailjet",
      "/images/integration-icons/email/mailjet-icon.svg"
    ),
  ]),
  categoryItem("SMS", ROUTE.integrationsChannelsSms, 23, [
    integrationItem(
      "Twilio",
      "twilio",
      "/images/integration-icons/sms/twilio-icon.svg"
    ),
    integrationItem(
      "Plivo",
      "plivo",
      "/images/integration-icons/sms/plivo-icon.svg"
    ),
    integrationItem(
      "AWS SNS",
      "aws-sns",
      "/images/integration-icons/sms/aws-sns-icon.svg"
    ),
    integrationItem(
      "Nexmo (Vonage)",
      "vonage",
      "/images/integration-icons/sms/vonage-icon.svg"
    ),
    integrationItem(
      "SMS77 (seven.io)",
      "sms77",
      "/images/integration-icons/sms/sms77-icon.svg"
    ),
    integrationItem(
      "Telnyx",
      "telnyx",
      "/images/integration-icons/sms/telnyx-icon.svg"
    ),
    integrationItem(
      "Termii",
      "termii",
      "/images/integration-icons/sms/termii-icon.svg"
    ),
  ]),
  categoryItem("Push", ROUTE.integrationsChannelsPush, 7, [
    integrationItem(
      "Firebase Cloud Messaging",
      "fcm",
      "/images/integration-icons/push/fcm-icon.svg"
    ),
    integrationItem(
      "Apple Push Notification",
      "apns",
      "/images/integration-icons/push/apns-icon.svg"
    ),
    integrationItem(
      "Expo Push",
      "expo-push",
      "/images/integration-icons/push/expo-push-icon.svg"
    ),
    integrationItem(
      "OneSignal",
      "onesignal",
      "/images/integration-icons/push/onesignal-icon.svg"
    ),
    integrationItem(
      "Pushpad",
      "pushpad",
      "/images/integration-icons/push/pushpad-icon.svg"
    ),
    integrationItem(
      "Pusher Beams",
      "pusher-beams",
      "/images/integration-icons/push/pusher-beams-icon.svg"
    ),
    integrationItem(
      "Push Webhook",
      "push-webhook",
      "/images/integration-icons/push/push-webhook-icon.svg"
    ),
  ]),
  categoryItem("Chat", ROUTE.integrationsChannelsChat, 6, [
    integrationItem(
      "Slack",
      "slack",
      "/images/integration-icons/chat/slack-icon.svg"
    ),
    integrationItem(
      "Discord",
      "discord",
      "/images/integration-icons/chat/discord-icon.svg"
    ),
    integrationItem(
      "Microsoft Teams",
      "ms-teams",
      "/images/integration-icons/chat/microsoft-teams-icon.svg"
    ),
    integrationItem(
      "Mattermost",
      "mattermost",
      "/images/integration-icons/chat/mattermost-icon.svg"
    ),
    integrationItem(
      "WhatsApp Business",
      "whatsapp",
      "/images/integration-icons/chat/whatsapp-business-icon.svg"
    ),
    integrationItem(
      "Zulip",
      "zulip",
      "/images/integration-icons/chat/zulip-icon.svg"
    ),
  ]),
  categoryItem("Workflow integrations", ROUTE.integrationsSourcesWorkflow, 5, [
    integrationItem(
      "React Email",
      "react-email",
      "/images/integration-icons/workflow/react-icon.svg"
    ),
    integrationItem(
      "Vue Email",
      "vue-email",
      "/images/integration-icons/workflow/vue-icon.svg"
    ),
    integrationItem(
      "MJML",
      "mjml",
      "/images/integration-icons/workflow/mjml-icon.svg"
    ),
    integrationItem(
      "Maizzle",
      "maizzle",
      "/images/integration-icons/workflow/maizzle-icon.svg"
    ),
    integrationItem(
      "Brail",
      "brail",
      "/images/integration-icons/workflow/brail-icon.svg"
    ),
  ]),
  categoryItem("AI SDKs", ROUTE.integrationsSourcesAiSdks, 2, [
    integrationItem(
      "LangChain",
      "langchain",
      "/images/integration-icons/ai/langchain-icon.svg"
    ),
    integrationItem(
      "Vercel AI SDK",
      "vercel-ai-sdk",
      "/images/integration-icons/ai/ai-sdk-icon.png"
    ),
  ]),
  categoryItem("Feature Flags", ROUTE.integrationsSourcesFeatureFlags, 3, [
    integrationItem(
      "LaunchDarkly",
      "launchdarkly",
      "/images/integration-icons/feature/launchdarkly-icon.svg"
    ),
    integrationItem(
      "Flagsmith",
      "flagsmith",
      "/images/integration-icons/feature/flagsmith-icon.svg"
    ),
    integrationItem(
      "PostHog",
      "posthog",
      "/images/integration-icons/feature/posthog-icon.svg"
    ),
  ]),
]
