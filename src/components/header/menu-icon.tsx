import type { ComponentType, SVGProps } from "react"
import type { WebChatBuilderSlug } from "@/data/pages/web-chat-builders"
import aiAciIcon from "@/svgs/header/menu/ai-aci.inline.svg"
import aiClaudeIcon from "@/svgs/header/menu/ai-claude.inline.svg"
import aiCodexIcon from "@/svgs/header/menu/ai-codex.inline.svg"
import aiConsoleIcon from "@/svgs/header/menu/ai-console.inline.svg"
import aiCopilotIcon from "@/svgs/header/menu/ai-copilot.inline.svg"
import aiCursorIcon from "@/svgs/header/menu/ai-cursor.inline.svg"
import aiCustomCodeIcon from "@/svgs/header/menu/ai-custom-code.inline.svg"
import aiMcpIcon from "@/svgs/header/menu/ai-mcp.inline.svg"
import aiSkillsIcon from "@/svgs/header/menu/ai-skills.inline.svg"
import channelsChatIcon from "@/svgs/header/menu/channels-chat.inline.svg"
import channelsClaudeAwsIcon from "@/svgs/header/menu/channels-claude-aws.inline.svg"
import channelsEmailIcon from "@/svgs/header/menu/channels-email.inline.svg"
import channelsImessageIcon from "@/svgs/header/menu/channels-imessage.inline.svg"
import channelsInboxIcon from "@/svgs/header/menu/channels-inbox.inline.svg"
import channelsLangchainIcon from "@/svgs/header/menu/channels-langchain.inline.svg"
import channelsMsTeamsIcon from "@/svgs/header/menu/channels-ms-teams.inline.svg"
import channelsPushIcon from "@/svgs/header/menu/channels-push.inline.svg"
import channelsSlackIcon from "@/svgs/header/menu/channels-slack.inline.svg"
import channelsSmsIcon from "@/svgs/header/menu/channels-sms.inline.svg"
import channelsTelegramIcon from "@/svgs/header/menu/channels-telegram.inline.svg"
import vercelIcon from "@/svgs/header/menu/channels-vercel.inline.svg"
import channelsWebChatIcon from "@/svgs/header/menu/channels-web-chat.inline.svg"
import channelsWhatsappIcon from "@/svgs/header/menu/channels-whatsapp.inline.svg"
import resourcesAboutIcon from "@/svgs/header/menu/resources-about.inline.svg"
import resourcesApiIcon from "@/svgs/header/menu/resources-api.inline.svg"
import resourcesBlogIcon from "@/svgs/header/menu/resources-blog.inline.svg"
import resourcesCareersIcon from "@/svgs/header/menu/resources-careers.inline.svg"
import resourcesChangelogIcon from "@/svgs/header/menu/resources-changelog.inline.svg"
import resourcesCommunityIcon from "@/svgs/header/menu/resources-community.inline.svg"
import resourcesContactIcon from "@/svgs/header/menu/resources-contact.inline.svg"
import resourcesCustomersIcon from "@/svgs/header/menu/resources-customers.inline.svg"
import resourcesDocumentationIcon from "@/svgs/header/menu/resources-documentation.inline.svg"
import resourcesGithubIcon from "@/svgs/header/menu/resources-github.inline.svg"
import resourcesHistoryIcon from "@/svgs/header/menu/resources-history.inline.svg"
import resourcesIntegrationsIcon from "@/svgs/header/menu/resources-integrations.inline.svg"
import resourcesSdksIcon from "@/svgs/header/menu/resources-sdks.inline.svg"
import resourcesStatusIcon from "@/svgs/header/menu/resources-status.inline.svg"
import solutionsAgentsIcon from "@/svgs/header/menu/solutions-ai-agents.inline.svg"
import solutionsNotificationsIcon from "@/svgs/header/menu/solutions-app-notifications.inline.svg"
import solutionsBuildersIcon from "@/svgs/header/menu/solutions-builders.inline.svg"
import solutionsEnterpriseIcon from "@/svgs/header/menu/solutions-enterprise.inline.svg"
import webChatBlinkNewIcon from "@/svgs/header/menu/web-chat-blink-new.inline.svg"
import webChatBoltNewIcon from "@/svgs/header/menu/web-chat-bolt-new.inline.svg"
import webChatCrewAiIcon from "@/svgs/header/menu/web-chat-crew-ai.inline.svg"
import webChatFlowiseIcon from "@/svgs/header/menu/web-chat-flowise.inline.svg"
import webChatLanggraphIcon from "@/svgs/header/menu/web-chat-langgraph.inline.svg"
import webChatLindyIcon from "@/svgs/header/menu/web-chat-lindy.inline.svg"
import webChatLovableIcon from "@/svgs/header/menu/web-chat-lovable.inline.svg"
import webChatRelevanceAiIcon from "@/svgs/header/menu/web-chat-relevance-ai.inline.svg"
import webChatReplitIcon from "@/svgs/header/menu/web-chat-replit.inline.svg"
import webChatSimStudioIcon from "@/svgs/header/menu/web-chat-sim-studio.inline.svg"
import webChatStackAiIcon from "@/svgs/header/menu/web-chat-stack-ai.inline.svg"
import webChatVellumIcon from "@/svgs/header/menu/web-chat-vellum.inline.svg"
import webChatWordwareIcon from "@/svgs/header/menu/web-chat-wordware.inline.svg"

import type { TMenuIcon } from "@/types/common"
import { cn } from "@/lib/utils"

interface IMenuIconProps {
  icon?: TMenuIcon
  className?: string
}

type TInlineIcon = ComponentType<SVGProps<SVGSVGElement>>

const INLINE_ICONS: Partial<Record<TMenuIcon, TInlineIcon>> = {
  agents: solutionsAgentsIcon,
  notifications: solutionsNotificationsIcon,
  builders: solutionsBuildersIcon,
  enterprise: solutionsEnterpriseIcon,
  mcp: aiMcpIcon,
  copilot: aiCopilotIcon,
  aci: aiAciIcon,
  prompt: aiConsoleIcon,
  skills: aiSkillsIcon,
  claude: aiClaudeIcon,
  codex: aiCodexIcon,
  cursor: aiCursorIcon,
  "custom-code": aiCustomCodeIcon,
  "ai-sdk": vercelIcon,
  "chat-sdk": vercelIcon,
  blog: resourcesBlogIcon,
  customers: resourcesCustomersIcon,
  community: resourcesCommunityIcon,
  changelog: resourcesChangelogIcon,
  history: resourcesHistoryIcon,
  documentation: resourcesDocumentationIcon,
  api: resourcesApiIcon,
  sdks: resourcesSdksIcon,
  integrations: resourcesIntegrationsIcon,
  github: resourcesGithubIcon,
  about: resourcesAboutIcon,
  careers: resourcesCareersIcon,
  brand: aiMcpIcon,
  status: resourcesStatusIcon,
  contact: resourcesContactIcon,
}

// Keyed by builder slug, so a new builder page cannot ship without its icon.
const WEB_CHAT_BUILDER_ICONS: Record<WebChatBuilderSlug, TInlineIcon> = {
  "blink-new": webChatBlinkNewIcon,
  lovable: webChatLovableIcon,
  replit: webChatReplitIcon,
  "bolt-new": webChatBoltNewIcon,
  "sim-studio": webChatSimStudioIcon,
  vellum: webChatVellumIcon,
  flowise: webChatFlowiseIcon,
  wordware: webChatWordwareIcon,
  "crew-ai": webChatCrewAiIcon,
  langgraph: webChatLanggraphIcon,
  lindy: webChatLindyIcon,
  "stack-ai": webChatStackAiIcon,
  "relevance-ai": webChatRelevanceAiIcon,
}

const COLOR_INLINE_ICONS: Partial<Record<TMenuIcon, TInlineIcon>> = {
  ...WEB_CHAT_BUILDER_ICONS,
  slack: channelsSlackIcon,
  whatsapp: channelsWhatsappIcon,
  telegram: channelsTelegramIcon,
  teams: channelsMsTeamsIcon,
  imessage: channelsImessageIcon,
  email: channelsEmailIcon,
  inbox: channelsInboxIcon,
  push: channelsPushIcon,
  chat: channelsChatIcon,
  "web-chat": channelsWebChatIcon,
  sms: channelsSmsIcon,
  langchain: channelsLangchainIcon,
  "claude-aws": channelsClaudeAwsIcon,
}

function MenuIcon({ icon, className }: IMenuIconProps) {
  if (!icon) return null

  const ColorInlineIcon = COLOR_INLINE_ICONS[icon]
  if (ColorInlineIcon) {
    return (
      <ColorInlineIcon
        className={cn("size-4 shrink-0", className)}
        aria-hidden="true"
        focusable="false"
      />
    )
  }

  const InlineIcon = INLINE_ICONS[icon]
  if (InlineIcon) {
    return (
      <InlineIcon
        className={cn(
          "size-4 shrink-0 text-gray-70 transition-colors group-hover:text-white",
          className
        )}
        aria-hidden="true"
        focusable="false"
      />
    )
  }

  return null
}

export default MenuIcon
