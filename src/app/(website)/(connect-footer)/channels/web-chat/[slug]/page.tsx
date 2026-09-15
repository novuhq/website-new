import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getAllWebChatBuilderSlugs,
  getWebChatBuilderBySlug,
  getWebChatBuilderPathname,
} from "@/data/pages/web-chat-builders"

import WebChatBuilderLanding from "@/components/pages/channels/web-chat-builder/landing"
import { getMetadata } from "@/lib/get-metadata"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getAllWebChatBuilderSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getWebChatBuilderBySlug(slug)
  if (!page) return {}

  return getMetadata({
    title: page.seo.title,
    description: page.seo.description,
    pathname: getWebChatBuilderPathname(slug),
  })
}

export default async function WebChatBuilderPage({ params }: Props) {
  const { slug } = await params
  const page = getWebChatBuilderBySlug(slug)
  if (!page) notFound()

  return <WebChatBuilderLanding page={page} />
}
