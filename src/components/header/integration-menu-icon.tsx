import type { ComponentType, SVGProps } from "react"
import apnsIcon from "@/svgs/header/integrations/apns.inline.svg"
import awsSnsIcon from "@/svgs/header/integrations/aws-sns.inline.svg"
import brevoIcon from "@/svgs/header/integrations/brevo.inline.svg"
import discordIcon from "@/svgs/header/integrations/discord.inline.svg"
import expoPushIcon from "@/svgs/header/integrations/expo-push.inline.svg"
import fcmIcon from "@/svgs/header/integrations/fcm.inline.svg"
import langchainIcon from "@/svgs/header/integrations/langchain.inline.svg"
import mailgunIcon from "@/svgs/header/integrations/mailgun.inline.svg"
import mailjetIcon from "@/svgs/header/integrations/mailjet.inline.svg"
import mattermostIcon from "@/svgs/header/integrations/mattermost.inline.svg"
import novuInboxIcon from "@/svgs/header/integrations/novu-inbox.inline.svg"
import onesignalIcon from "@/svgs/header/integrations/onesignal.inline.svg"
import plivoIcon from "@/svgs/header/integrations/plivo.inline.svg"
import postmarkIcon from "@/svgs/header/integrations/postmark.inline.svg"
import pushWebhookIcon from "@/svgs/header/integrations/push-webhook.inline.svg"
import pusherBeamsIcon from "@/svgs/header/integrations/pusher-beams.inline.svg"
import pushpadIcon from "@/svgs/header/integrations/pushpad.inline.svg"
import resendIcon from "@/svgs/header/integrations/resend.inline.svg"
import sendgridIcon from "@/svgs/header/integrations/sendgrid.inline.svg"
import sesIcon from "@/svgs/header/integrations/ses.inline.svg"
import sms77Icon from "@/svgs/header/integrations/sms77.inline.svg"
import telnyxIcon from "@/svgs/header/integrations/telnyx.inline.svg"
import termiiIcon from "@/svgs/header/integrations/termii.inline.svg"
import twilioIcon from "@/svgs/header/integrations/twilio.inline.svg"
import vercelAiSdkIcon from "@/svgs/header/integrations/vercel-ai-sdk.inline.svg"
import vonageIcon from "@/svgs/header/integrations/vonage.inline.svg"
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
  "integration-discord": discordIcon,
  "integration-mattermost": mattermostIcon,
  "integration-zulip": zulipIcon,
  "integration-langchain": langchainIcon,
  "integration-vercel-ai-sdk": vercelAiSdkIcon,
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
