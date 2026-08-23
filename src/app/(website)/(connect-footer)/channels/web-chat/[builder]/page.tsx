import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getMetadata } from "@/lib/get-metadata"
import BuilderLanding from "@/components/pages/web-chat-builder/landing"
import {
  getAllBuilderSlugs,
  getBuilder,
} from "@/components/pages/web-chat-builder/config"

interface BuilderPageProps {
  params: Promise<{ builder: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllBuilderSlugs().map((builder) => ({ builder }))
}

export async function generateMetadata({
  params,
}: BuilderPageProps): Promise<Metadata> {
  const { builder } = await params
  const config = getBuilder(builder)

  if (!config) return {}

  return getMetadata({
    title: config.seoTitle,
    description: config.seoDescription,
    pathname: `/channels/web-chat/${config.slug}`,
  })
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const { builder } = await params
  const config = getBuilder(builder)

  if (!config) notFound()

  return <BuilderLanding {...config} />
}
