import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getMetadata } from "@/lib/get-metadata"
import BuilderLanding from "@/components/pages/web-chat-builder/landing"
import { getHub } from "@/components/pages/web-chat-builder/config"

const SLUG = "ai-chatbot-for-website"

export async function generateMetadata(): Promise<Metadata> {
  const config = getHub(SLUG)
  if (!config) return {}

  return getMetadata({
    title: config.seoTitle,
    description: config.seoDescription,
    pathname: `/${SLUG}`,
  })
}

export default function AiChatbotForWebsitePage() {
  const config = getHub(SLUG)
  if (!config) notFound()

  return <BuilderLanding {...config} />
}
