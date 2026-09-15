import type { StaticImageData } from "next/image"
import type { WebChatBuilderMediaKey } from "@/data/pages/web-chat-builders"
import webflowChannels from "@/images/pages/channels/web-chat-builder/webflow/channels-mascot.png"
import webflowHero from "@/images/pages/channels/web-chat-builder/webflow/hero.png"

export const WEB_CHAT_BUILDER_MEDIA = {
  "webflow-hero": webflowHero,
  "webflow-channels": webflowChannels,
} satisfies Record<WebChatBuilderMediaKey, StaticImageData>
