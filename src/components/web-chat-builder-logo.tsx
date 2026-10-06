import type { ComponentType, SVGProps } from "react"
import type { WebChatBuilderSlug } from "@/data/pages/web-chat-builder-list"
import lovableLogo from "@/svgs/web-chat-builders/lovable.inline.svg"
import v0Logo from "@/svgs/web-chat-builders/v0.inline.svg"

type TWebChatBuilderLogo = ComponentType<SVGProps<SVGSVGElement>>

// Keyed by builder slug, so a new builder page cannot ship without its logo.
// Used by the header menu and by the badge on the shared hero artwork.
export const WEB_CHAT_BUILDER_LOGOS: Record<
  WebChatBuilderSlug,
  TWebChatBuilderLogo
> = {
  lovable: lovableLogo,
  v0: v0Logo,
}

function WebChatBuilderLogo({
  className,
  slug,
}: {
  className?: string
  slug: string
}) {
  const Logo = WEB_CHAT_BUILDER_LOGOS[slug as WebChatBuilderSlug]

  if (!Logo) return null

  return <Logo className={className} aria-hidden="true" focusable="false" />
}

export default WebChatBuilderLogo
