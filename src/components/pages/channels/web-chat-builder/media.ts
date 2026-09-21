import type { StaticImageData } from "next/image"
import type { WebChatBuilderMediaKey } from "@/data/pages/web-chat-builders"
import agentHero from "@/images/pages/channels/web-chat-builder/shared/agent-hero.webp"
import appHero from "@/images/pages/channels/web-chat-builder/shared/app-hero.webp"
import sharedChannels from "@/images/pages/channels/web-chat-builder/shared/channels-mascot.png"

// One hero plate per builder kind: the browser mock spells out your-app.com for
// app builders and your-site.com for agent builders. The builder itself is
// named by the badge the hero draws over the artwork.
export const WEB_CHAT_BUILDER_MEDIA = {
  "app-hero": appHero,
  "agent-hero": agentHero,
  "shared-channels": sharedChannels,
} satisfies Record<WebChatBuilderMediaKey, StaticImageData>
