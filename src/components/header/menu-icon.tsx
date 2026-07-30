import type { ComponentType, SVGProps } from "react"
import Image from "next/image"
import aiClaudeIcon from "@/svgs/header/menu/ai-claude.inline.svg"
import aiCodexIcon from "@/svgs/header/menu/ai-codex.inline.svg"
import aiConsoleIcon from "@/svgs/header/menu/ai-console.inline.svg"
import aiCursorIcon from "@/svgs/header/menu/ai-cursor.inline.svg"
import aiMcpIcon from "@/svgs/header/menu/ai-mcp.inline.svg"
import aiSkillsIcon from "@/svgs/header/menu/ai-skills.inline.svg"
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
  copilot: aiConsoleIcon,
  aci: aiConsoleIcon,
  prompt: aiConsoleIcon,
  skills: aiSkillsIcon,
  claude: aiClaudeIcon,
  codex: aiCodexIcon,
  cursor: aiCursorIcon,
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

const IMAGE_ICON_PATHS: Partial<Record<TMenuIcon, string>> = {
  slack: "/images/header/menu/channels-slack.svg",
  whatsapp: "/images/header/menu/channels-whatsapp.svg",
  telegram: "/images/header/menu/channels-telegram.svg",
  teams: "/images/header/menu/channels-ms-teams.svg",
  imessage: "/images/header/menu/channels-imessage.svg",
  email: "/images/header/menu/channels-email.svg",
  inbox: "/images/header/menu/channels-inbox.svg",
  push: "/images/header/menu/channels-push.svg",
  chat: "/images/header/menu/channels-chat.svg",
  sms: "/images/header/menu/channels-sms.svg",
}

function MenuIcon({ icon, className }: IMenuIconProps) {
  if (!icon) return null

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

  const imagePath = IMAGE_ICON_PATHS[icon]
  if (!imagePath) return null

  return (
    <Image
      className={cn("size-4 shrink-0 object-contain", className)}
      src={imagePath}
      width={16}
      height={16}
      alt=""
      aria-hidden="true"
      unoptimized
    />
  )
}

export default MenuIcon
