import type { ComponentType, SVGProps } from "react"
import apnsIcon from "@/svgs/header/integrations/apns.inline.svg"
import awsSnsIcon from "@/svgs/header/integrations/aws-sns.inline.svg"
import brailIcon from "@/svgs/header/integrations/brail.inline.svg"
import brevoIcon from "@/svgs/header/integrations/brevo.inline.svg"
import discordIcon from "@/svgs/header/integrations/discord.inline.svg"
import expoPushIcon from "@/svgs/header/integrations/expo-push.inline.svg"
import fcmIcon from "@/svgs/header/integrations/fcm.inline.svg"
import flagsmithIcon from "@/svgs/header/integrations/flagsmith.inline.svg"
import langchainIcon from "@/svgs/header/integrations/langchain.inline.svg"
import launchdarklyIcon from "@/svgs/header/integrations/launchdarkly.inline.svg"
import mailgunIcon from "@/svgs/header/integrations/mailgun.inline.svg"
import mailjetIcon from "@/svgs/header/integrations/mailjet.inline.svg"
import maizzleIcon from "@/svgs/header/integrations/maizzle.inline.svg"
import mattermostIcon from "@/svgs/header/integrations/mattermost.inline.svg"
import mjmlIcon from "@/svgs/header/integrations/mjml.inline.svg"
import msTeamsIcon from "@/svgs/header/integrations/ms-teams.inline.svg"
import novuInboxIcon from "@/svgs/header/integrations/novu-inbox.inline.svg"
import onesignalIcon from "@/svgs/header/integrations/onesignal.inline.svg"
import plivoIcon from "@/svgs/header/integrations/plivo.inline.svg"
import posthogIcon from "@/svgs/header/integrations/posthog.inline.svg"
import postmarkIcon from "@/svgs/header/integrations/postmark.inline.svg"
import pushWebhookIcon from "@/svgs/header/integrations/push-webhook.inline.svg"
import pusherBeamsIcon from "@/svgs/header/integrations/pusher-beams.inline.svg"
import pushpadIcon from "@/svgs/header/integrations/pushpad.inline.svg"
import reactEmailIcon from "@/svgs/header/integrations/react-email.inline.svg"
import resendIcon from "@/svgs/header/integrations/resend.inline.svg"
import sendgridIcon from "@/svgs/header/integrations/sendgrid.inline.svg"
import sesIcon from "@/svgs/header/integrations/ses.inline.svg"
import slackIcon from "@/svgs/header/integrations/slack.inline.svg"
import sms77Icon from "@/svgs/header/integrations/sms77.inline.svg"
import telnyxIcon from "@/svgs/header/integrations/telnyx.inline.svg"
import termiiIcon from "@/svgs/header/integrations/termii.inline.svg"
import twilioIcon from "@/svgs/header/integrations/twilio.inline.svg"
import vercelAiSdkIcon from "@/svgs/header/integrations/vercel-ai-sdk.inline.svg"
import vonageIcon from "@/svgs/header/integrations/vonage.inline.svg"
import vueEmailIcon from "@/svgs/header/integrations/vue-email.inline.svg"
import whatsappIcon from "@/svgs/header/integrations/whatsapp.inline.svg"
import zulipIcon from "@/svgs/header/integrations/zulip.inline.svg"

import type { TIntegrationMenuIcon } from "@/types/integration-menu"
import { cn } from "@/lib/utils"

type TInlineIcon = ComponentType<SVGProps<SVGSVGElement>>

const ICONS: Record<TIntegrationMenuIcon, TInlineIcon> = {
  "integration-novu-inbox": novuInboxIcon,
  "integration-sendgrid": sendgridIcon,
  "integration-ses": sesIcon,
  "integration-postmark": postmarkIcon,
  "integration-resend": resendIcon,
  "integration-brevo": brevoIcon,
  "integration-mailgun": mailgunIcon,
  "integration-mailjet": mailjetIcon,
  "integration-twilio": twilioIcon,
  "integration-plivo": plivoIcon,
  "integration-aws-sns": awsSnsIcon,
  "integration-vonage": vonageIcon,
  "integration-sms77": sms77Icon,
  "integration-telnyx": telnyxIcon,
  "integration-termii": termiiIcon,
  "integration-fcm": fcmIcon,
  "integration-apns": apnsIcon,
  "integration-expo-push": expoPushIcon,
  "integration-onesignal": onesignalIcon,
  "integration-pushpad": pushpadIcon,
  "integration-pusher-beams": pusherBeamsIcon,
  "integration-push-webhook": pushWebhookIcon,
  "integration-slack": slackIcon,
  "integration-discord": discordIcon,
  "integration-ms-teams": msTeamsIcon,
  "integration-mattermost": mattermostIcon,
  "integration-whatsapp": whatsappIcon,
  "integration-zulip": zulipIcon,
  "integration-react-email": reactEmailIcon,
  "integration-vue-email": vueEmailIcon,
  "integration-mjml": mjmlIcon,
  "integration-maizzle": maizzleIcon,
  "integration-brail": brailIcon,
  "integration-langchain": langchainIcon,
  "integration-vercel-ai-sdk": vercelAiSdkIcon,
  "integration-launchdarkly": launchdarklyIcon,
  "integration-flagsmith": flagsmithIcon,
  "integration-posthog": posthogIcon,
}

interface IIntegrationMenuIconProps {
  icon?: TIntegrationMenuIcon
  className?: string
}

function IntegrationMenuIcon({ icon, className }: IIntegrationMenuIconProps) {
  if (!icon) return null

  const Icon = ICONS[icon]

  return (
    <Icon
      className={cn("size-4 shrink-0", className)}
      aria-hidden="true"
      focusable="false"
    />
  )
}

export default IntegrationMenuIcon
