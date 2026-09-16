import type { StaticImageData } from "next/image"
import type { WebChatBuilderMediaKey } from "@/data/pages/web-chat-builders"
import blinkNewHero from "@/images/pages/channels/web-chat-builder/blink-new/hero.png"
import boltNewHero from "@/images/pages/channels/web-chat-builder/bolt-new/hero.png"
import crewAiHero from "@/images/pages/channels/web-chat-builder/crew-ai/hero.png"
import flowiseHero from "@/images/pages/channels/web-chat-builder/flowise/hero.png"
import langgraphHero from "@/images/pages/channels/web-chat-builder/langgraph/hero.png"
import lindyHero from "@/images/pages/channels/web-chat-builder/lindy/hero.png"
import lovableHero from "@/images/pages/channels/web-chat-builder/lovable/hero.png"
import relevanceAiHero from "@/images/pages/channels/web-chat-builder/relevance-ai/hero.png"
import replitHero from "@/images/pages/channels/web-chat-builder/replit/hero.png"
import simStudioHero from "@/images/pages/channels/web-chat-builder/sim-studio/hero.png"
import stackAiHero from "@/images/pages/channels/web-chat-builder/stack-ai/hero.png"
import vellumHero from "@/images/pages/channels/web-chat-builder/vellum/hero.png"
import webflowChannels from "@/images/pages/channels/web-chat-builder/webflow/channels-mascot.png"
import wordwareHero from "@/images/pages/channels/web-chat-builder/wordware/hero.png"

export const WEB_CHAT_BUILDER_MEDIA = {
  "blink-new-hero": blinkNewHero,
  "lovable-hero": lovableHero,
  "replit-hero": replitHero,
  "bolt-new-hero": boltNewHero,
  "sim-studio-hero": simStudioHero,
  "vellum-hero": vellumHero,
  "flowise-hero": flowiseHero,
  "wordware-hero": wordwareHero,
  "crew-ai-hero": crewAiHero,
  "langgraph-hero": langgraphHero,
  "lindy-hero": lindyHero,
  "stack-ai-hero": stackAiHero,
  "relevance-ai-hero": relevanceAiHero,
  "webflow-channels": webflowChannels,
} satisfies Record<WebChatBuilderMediaKey, StaticImageData>
