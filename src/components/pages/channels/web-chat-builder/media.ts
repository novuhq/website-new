import type { StaticImageData } from "next/image"
import type { WebChatBuilderMediaKey } from "@/data/pages/web-chat-builders"
import appHero from "@/images/pages/channels/web-chat-builder/shared/app-hero.png"
import sharedChannels from "@/images/pages/channels/web-chat-builder/shared/channels-mascot.png"

// One hero plate shared by every builder. The builder itself is named by the
// badge the hero draws over the artwork.
export const WEB_CHAT_BUILDER_MEDIA = {
  "app-hero": appHero,
  "shared-channels": sharedChannels,
} satisfies Record<WebChatBuilderMediaKey, StaticImageData>
