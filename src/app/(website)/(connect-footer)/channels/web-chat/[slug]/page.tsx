import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ROUTE } from "@/constants/routes"
import {
  getAllWebChatBuilderSlugs,
  getWebChatBuilderBySlug,
  getWebChatBuilderPathname,
} from "@/data/pages/web-chat-builders"

import { getMetadata } from "@/lib/get-metadata"
import { safeJsonLdStringify } from "@/lib/json-ld"
import { absoluteUrl, toCanonicalPathname } from "@/lib/site-url"
import WebChatBuilderLanding from "@/components/pages/channels/web-chat-builder/landing"

type Props = { params: Promise<{ slug: string }> }

// The builder pages share the Web Chat page's artwork, so they share its image.
const SOCIAL_IMAGE_PATH = "/og-images/og-image-web-chat.jpg"
const SOCIAL_IMAGE_ALT = "Novu Web Chat: your agent, live inside your product"

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
    pathname: getWebChatBuilderPathname(page.slug),
    imagePath: SOCIAL_IMAGE_PATH,
    imageAlt: SOCIAL_IMAGE_ALT,
  })
}

export default async function WebChatBuilderPage({ params }: Props) {
  const { slug } = await params
  const page = getWebChatBuilderBySlug(slug)
  if (!page) notFound()

  const siteUrl = absoluteUrl("/")
  const webChatUrl = absoluteUrl(
    toCanonicalPathname(String(ROUTE.channelWebChat))
  )
  const pageUrl = absoluteUrl(
    toCanonicalPathname(getWebChatBuilderPathname(page.slug))
  )
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        name: page.seo.title,
        description: page.seo.description,
        url: pageUrl,
        image: absoluteUrl(SOCIAL_IMAGE_PATH),
        isPartOf: { "@id": `${siteUrl}#website` },
        publisher: { "@id": `${siteUrl}#organization` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: { "@id": `${pageUrl}#faq` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Novu",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Web Chat",
            item: webChatUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: page.builderName,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: page.faq.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  }

  return (
    <>
      <WebChatBuilderLanding page={page} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />
    </>
  )
}
