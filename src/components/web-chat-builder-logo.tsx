import type { ComponentType, SVGProps } from "react"
import type { WebChatBuilderSlug } from "@/data/pages/web-chat-builders"
import blinkNewLogo from "@/svgs/web-chat-builders/blink-new.inline.svg"
import boltNewLogo from "@/svgs/web-chat-builders/bolt-new.inline.svg"
import crewAiLogo from "@/svgs/web-chat-builders/crew-ai.inline.svg"
import flowiseLogo from "@/svgs/web-chat-builders/flowise.inline.svg"
import langgraphLogo from "@/svgs/web-chat-builders/langgraph.inline.svg"
import lindyLogo from "@/svgs/web-chat-builders/lindy.inline.svg"
import lovableLogo from "@/svgs/web-chat-builders/lovable.inline.svg"
import relevanceAiLogo from "@/svgs/web-chat-builders/relevance-ai.inline.svg"
import replitLogo from "@/svgs/web-chat-builders/replit.inline.svg"
import simStudioLogo from "@/svgs/web-chat-builders/sim-studio.inline.svg"
import stackAiLogo from "@/svgs/web-chat-builders/stack-ai.inline.svg"
import vellumLogo from "@/svgs/web-chat-builders/vellum.inline.svg"
import wordwareLogo from "@/svgs/web-chat-builders/wordware.inline.svg"

export type TWebChatBuilderLogo = ComponentType<SVGProps<SVGSVGElement>>

// Keyed by builder slug, so a new builder page cannot ship without its logo.
// Used by the header menu and by the badge on the shared hero artwork.
export const WEB_CHAT_BUILDER_LOGOS: Record<
  WebChatBuilderSlug,
  TWebChatBuilderLogo
> = {
  "blink-new": blinkNewLogo,
  lovable: lovableLogo,
  replit: replitLogo,
  "bolt-new": boltNewLogo,
  "sim-studio": simStudioLogo,
  vellum: vellumLogo,
  flowise: flowiseLogo,
  wordware: wordwareLogo,
  "crew-ai": crewAiLogo,
  langgraph: langgraphLogo,
  lindy: lindyLogo,
  "stack-ai": stackAiLogo,
  "relevance-ai": relevanceAiLogo,
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
