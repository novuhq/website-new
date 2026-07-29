import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ROUTE } from "@/constants/routes"
import {
  fillTemplate,
  getAllComboParams,
  getCombo,
  getConnectCommand,
  getCoverImagePath,
} from "@/data/pages/channel-frameworks"

import { getMetadata } from "@/lib/get-metadata"
import { safeJsonLdStringify } from "@/lib/json-ld"
import { absoluteUrl, toCanonicalPathname } from "@/lib/site-url"
import ChannelUseCase from "@/components/pages/channels/channel-use-case"
import FrameworkChannelChooser from "@/components/pages/channels/framework-channel-chooser"
import FrameworkConnect from "@/components/pages/channels/framework-connect"
import FrameworkHero from "@/components/pages/channels/framework-hero"
import FrameworkTech from "@/components/pages/channels/framework-tech"
import FAQ from "@/components/pages/faq"

type PageProps = {
  params: Promise<{ channel: string; framework: string }>
}

export function generateStaticParams() {
  return getAllComboParams()
}

function comboPathname(channelSlug: string, frameworkSlug: string) {
  return `/channels/${channelSlug}/${frameworkSlug}`
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { channel: channelSlug, framework: frameworkSlug } = await params
  const combo = getCombo(channelSlug, frameworkSlug)

  if (!combo) {
    return {}
  }

  const { channel, framework } = combo

  return getMetadata({
    title: `Connect ${framework.name} to ${channel.channelName} | Novu Connect`,
    description: `Give your ${framework.name} agent a voice in ${channel.channelName}. Two-way conversations, user identity mapping, and reliable delivery with Novu Connect. Connect it with ${getConnectCommand(combo)}.`,
    pathname: comboPathname(channelSlug, frameworkSlug),
    imagePath: getCoverImagePath(combo),
    markdownPathname: true,
  })
}

async function ChannelFrameworkPage({ params }: PageProps) {
  const { channel: channelSlug, framework: frameworkSlug } = await params
  const combo = getCombo(channelSlug, frameworkSlug)

  if (!combo) {
    notFound()
  }

  const { channel, framework } = combo

  const seoTitle = `Connect ${framework.name} to ${channel.channelName} | Novu Connect`
  const seoDescription = `Give your ${framework.name} agent a voice in ${channel.channelName}. Two-way conversations, user identity mapping, and reliable delivery with Novu Connect.`

  const siteUrl = absoluteUrl("/")
  const pageUrl = absoluteUrl(
    toCanonicalPathname(comboPathname(channelSlug, frameworkSlug))
  )
  const channelUrl = absoluteUrl(
    toCanonicalPathname(`/channels/${channel.slug}`)
  )
  const connectUrl = absoluteUrl(toCanonicalPathname(String(ROUTE.connect)))
  const imageUrl = absoluteUrl(getCoverImagePath(combo))
  const organizationId = `${siteUrl}#organization`
  const websiteId = `${siteUrl}#website`
  const webPageId = `${pageUrl}#webpage`
  const faqId = `${pageUrl}#faq`
  const breadcrumbId = `${pageUrl}#breadcrumb`
  const howToId = `${pageUrl}#howto`

  const combinedFaq = [
    ...framework.faq.map((item) => ({
      question: fillTemplate(item.question, combo),
      answer: fillTemplate(item.answer, combo),
    })),
    ...channel.faq
      .filter((item) => !/^Does Novu run/i.test(item.question))
      .slice(0, 2),
  ]

  const webPageJsonLd = {
    "@type": "WebPage",
    "@id": webPageId,
    name: seoTitle,
    description: seoDescription,
    url: pageUrl,
    image: imageUrl,
    isPartOf: { "@id": websiteId },
    publisher: { "@id": organizationId },
    breadcrumb: { "@id": breadcrumbId },
    mainEntity: [{ "@id": faqId }, { "@id": howToId }],
  }

  const faqJsonLd = {
    "@type": "FAQPage",
    "@id": faqId,
    mainEntity: combinedFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Novu", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Novu Connect",
        item: connectUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: channel.channelName,
        item: channelUrl,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: framework.name,
        item: pageUrl,
      },
    ],
  }

  const howToJsonLd = {
    "@type": "HowTo",
    "@id": howToId,
    name: `How to connect a ${framework.name} agent to ${channel.channelName} with Novu Connect`,
    description: fillTemplate(framework.connectIntro, combo),
    step: framework.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: fillTemplate(step.body, combo),
    })),
  }

  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [webPageJsonLd, faqJsonLd, breadcrumbJsonLd, howToJsonLd],
  }

  return (
    <div className="overflow-clip">
      <FrameworkHero combo={combo} />
      <FrameworkTech combo={combo} />
      <ChannelUseCase channel={channel} />
      <FrameworkConnect combo={combo} />
      <FAQ
        className="relative z-10 mt-18 pt-0 pb-0 sm:pb-0 md:pt-0 md:pb-0 lg:pb-0"
        title={`${framework.name} and ${channel.channelName}, common questions`}
        titleClassName="text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] md:text-[2rem]"
        containerClassName="max-w-176 gap-y-8 lg:max-w-176 lg:px-0"
        defaultOpenFirst
        variant="minimal"
        accordion={{ items: combinedFaq }}
      />
      <FrameworkChannelChooser combo={combo} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(jsonLdGraph),
        }}
      />
    </div>
  )
}

export default ChannelFrameworkPage
