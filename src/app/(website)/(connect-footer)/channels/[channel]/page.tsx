import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ROUTE } from "@/constants/routes"
import { getAllChannelSlugs, getChannelBySlug } from "@/data/pages/channels"

import { DEFAULT_CONNECT_PROMPT } from "@/lib/connect-prompt"
import { getMetadata } from "@/lib/get-metadata"
import { safeJsonLdStringify } from "@/lib/json-ld"
import { absoluteUrl, toCanonicalPathname } from "@/lib/site-url"
import ChannelConnect from "@/components/pages/channels/channel-connect"
import ChannelConnectStack from "@/components/pages/channels/channel-connect-stack"
import ChannelHero from "@/components/pages/channels/channel-hero"
import ChannelUseCase from "@/components/pages/channels/channel-use-case"
import FAQ from "@/components/pages/faq"
import CTA from "@/components/pages/home/cta"

type PageProps = {
  params: Promise<{ channel: string }>
}

function getChannelOgImagePath(channel: string) {
  return `/og-images/channels/${channel}.jpg`
}

export function generateStaticParams() {
  return getAllChannelSlugs().map((channel) => ({ channel }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { channel: slug } = await params
  const channel = getChannelBySlug(slug)

  if (!channel) {
    return {}
  }

  return getMetadata({
    title: channel.seoTitle,
    description: channel.seoDescription,
    pathname: `/channels/${slug}`,
    imagePath: getChannelOgImagePath(slug),
    imageAlt: channel.hero.heading,
    markdownPathname: true,
  })
}

async function ChannelPage({ params }: PageProps) {
  const { channel: slug } = await params
  const channel = getChannelBySlug(slug)

  if (!channel) {
    notFound()
  }

  const siteUrl = absoluteUrl("/")
  const pageUrl = absoluteUrl(toCanonicalPathname(`/channels/${channel.slug}`))
  const connectUrl = absoluteUrl(toCanonicalPathname(String(ROUTE.connect)))
  const imageUrl = absoluteUrl(getChannelOgImagePath(channel.slug))
  const organizationId = `${siteUrl}#organization`
  const websiteId = `${siteUrl}#website`
  const webPageId = `${pageUrl}#webpage`
  const faqId = `${pageUrl}#faq`
  const breadcrumbId = `${pageUrl}#breadcrumb`
  const howToId = `${pageUrl}#howto`

  const webPageJsonLd = {
    "@type": "WebPage",
    "@id": webPageId,
    name: channel.seoTitle,
    description: channel.seoDescription,
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
    mainEntity: channel.faq.map((item) => ({
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
        item: connectUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: channel.channelName,
        item: pageUrl,
      },
    ],
  }

  const howToJsonLd = {
    "@type": "HowTo",
    "@id": howToId,
    name: `How to connect an AI agent to ${channel.channelName} with Novu Connect`,
    description: channel.citation,
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Bring your agent",
        text: `Connect the agent you already built to ${channel.channelName}.`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Connect the channel",
        text: `Run npx novu connect --channel ${channel.cliSlug}, or paste the integration prompt into your coding agent.`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Claim your agent",
        text: "Sign up to keep the agent live and reach users across every channel from one conversation.",
      },
    ],
  }

  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [webPageJsonLd, faqJsonLd, breadcrumbJsonLd, howToJsonLd],
  }

  return (
    <div className="overflow-clip font-inter">
      <ChannelHero channel={channel} />
      <ChannelUseCase channel={channel} />
      <ChannelConnect channel={channel} />
      <ChannelConnectStack channel={channel} />
      <FAQ
        className="relative z-10 mt-18 pt-0 pb-0 sm:pb-0 md:pt-0 md:pb-0 lg:pb-0"
        title={`${channel.channelName} and Novu Connect, common questions`}
        titleClassName="text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] md:text-[2rem]"
        containerClassName="max-w-176 gap-y-8 lg:max-w-176 lg:px-0"
        defaultOpenFirst
        variant="minimal"
        accordion={{
          items: channel.faq.map((item) => ({
            question: item.question,
            answer: item.answer,
          })),
        }}
      />
      <CTA
        title="Give your agent a voice, anywhere your users are"
        description={`Pro tip: paste '${DEFAULT_CONNECT_PROMPT}' into your coding agent, or run npx novu connect. One agent, every channel, one conversation.`}
        actions={[
          {
            kind: "primary-button",
            label: "Explore Novu Connect",
            href: ROUTE.connect,
            clickLocation: `channel_${channel.slug}_cta`,
            clickText: "explore_connect",
          },
          {
            kind: "secondary-button",
            label: "Book a Demo",
            href: ROUTE.bookADemoConnect,
            clickLocation: `channel_${channel.slug}_cta`,
            clickText: "book_a_demo",
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(jsonLdGraph),
        }}
      />
    </div>
  )
}

export default ChannelPage
