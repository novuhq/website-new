import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ROUTE } from "@/constants/routes"
import { WEB_CHAT_SEO } from "@/data/pages/web-chat"
import {
  getAllWebChatBuilderSlugs,
  getWebChatBuilderBySlug,
  getWebChatBuilderPathname,
  getWebChatBuilderStepText,
  type IWebChatBuilderSecondarySection,
} from "@/data/pages/web-chat-builders"

import { getMetadata } from "@/lib/get-metadata"
import { safeJsonLdStringify } from "@/lib/json-ld"
import { absoluteUrl, toCanonicalPathname } from "@/lib/site-url"
import WebChatBuilderLanding from "@/components/pages/channels/web-chat-builder/landing"

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
    pathname: getWebChatBuilderPathname(page.slug),
    // The builder pages share the Web Chat page's artwork, so they share its image.
    imagePath: WEB_CHAT_SEO.imagePath,
    imageAlt: WEB_CHAT_SEO.imageAlt,
    markdownPathname: true,
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
  const setup = page.sections.find(
    (section): section is IWebChatBuilderSecondarySection =>
      section.type === "secondary"
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
        image: absoluteUrl(WEB_CHAT_SEO.imagePath),
        isPartOf: { "@id": `${siteUrl}#website` },
        publisher: { "@id": `${siteUrl}#organization` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: [
          { "@id": `${pageUrl}#faq` },
          ...(setup ? [{ "@id": `${pageUrl}#howto` }] : []),
        ],
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
            name: "Novu Connect",
            item: absoluteUrl(toCanonicalPathname(String(ROUTE.connect))),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Web Chat",
            item: webChatUrl,
          },
          {
            "@type": "ListItem",
            position: 4,
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
      ...(setup
        ? [
            {
              "@type": "HowTo",
              "@id": `${pageUrl}#howto`,
              name: setup.title,
              description: setup.description,
              step: setup.steps.map((step, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                text: getWebChatBuilderStepText(step),
              })),
            },
          ]
        : []),
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
