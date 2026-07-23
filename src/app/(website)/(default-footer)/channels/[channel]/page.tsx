import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ROUTE } from "@/constants/routes"
import { getAllChannelSlugs, getChannelBySlug } from "@/data/pages/channels"

import type { IAgentTemplateData } from "@/types/templates"
import { getMetadata } from "@/lib/get-metadata"
import { getAgentTemplates } from "@/lib/templates"
import ChannelConnect from "@/components/pages/channels/channel-connect"
import ChannelConnectStack from "@/components/pages/channels/channel-connect-stack"
import ChannelHero from "@/components/pages/channels/channel-hero"
import ChannelTemplates from "@/components/pages/channels/channel-templates"
import ChannelUseCase from "@/components/pages/channels/channel-use-case"
import CTA from "@/components/pages/cta"
import FAQ from "@/components/pages/faq"

// Select the curated starter templates for a channel, in the order listed on
// the channel's data file. Resilient: if Sanity is unreachable the section is
// simply omitted, the page still renders.
async function getStarterTemplates(
  ids: string[]
): Promise<IAgentTemplateData[]> {
  if (!ids.length) return []

  try {
    const all = await getAgentTemplates()
    const byId = new Map(all.map((template) => [template.id, template]))
    return ids
      .map((id) => byId.get(id))
      .filter((template): template is IAgentTemplateData => Boolean(template))
  } catch {
    return []
  }
}

type PageProps = {
  params: Promise<{ channel: string }>
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
    imagePath: `/api/og?template=default&title=${encodeURIComponent(channel.hero.heading)}`,
    markdownPathname: true,
  })
}

async function ChannelPage({ params }: PageProps) {
  const { channel: slug } = await params
  const channel = getChannelBySlug(slug)

  if (!channel) {
    notFound()
  }

  const templates = await getStarterTemplates(channel.starterTemplateIds)

  const siteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || ""
  const pageUrl = `${siteUrl}/channels/${channel.slug}`
  const imageUrl = `${siteUrl}/api/og?template=default&title=${encodeURIComponent(channel.hero.heading)}`

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: channel.seoTitle,
    description: channel.seoDescription,
    url: pageUrl,
    image: imageUrl,
    author: { "@type": "Organization", name: "Novu", url: "https://novu.co" },
    publisher: {
      "@type": "Organization",
      name: "Novu",
      url: "https://novu.co",
      logo: {
        "@type": "ImageObject",
        url: "https://novu.co/images/logo.svg",
      },
    },
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Novu",
        item: siteUrl || "https://novu.co",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Novu Connect",
        item: `${siteUrl}${ROUTE.connect}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: channel.channelName,
        item: pageUrl,
      },
    ],
  }

  const templatesItemListJsonLd = templates.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Starter AI agent templates for ${channel.channelName}`,
        itemListElement: templates.map((template, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${template.name} agent`,
          description: template.summary,
          url: `${ROUTE.connectApp}?agentTemplateId=${template.id}`,
        })),
      }
    : null

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to connect an AI agent to ${channel.channelName} with Novu Connect`,
    description: channel.citation,
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pick a starter agent or bring your own",
        text: `Choose a ready-made agent template for ${channel.channelName}, or connect the agent you already built.`,
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

  const jsonLdGraph = [
    articleJsonLd,
    faqJsonLd,
    breadcrumbJsonLd,
    howToJsonLd,
    ...(templatesItemListJsonLd ? [templatesItemListJsonLd] : []),
  ]

  return (
    <div className="overflow-clip">
      <ChannelHero channel={channel} />
      <ChannelUseCase channel={channel} />
      <ChannelTemplates channel={channel} templates={templates} />
      <ChannelConnect channel={channel} />
      <ChannelConnectStack channel={channel} />
      <FAQ
        className="relative z-10"
        title={`${channel.channelName} and Novu Connect, common questions`}
        accordion={{
          items: channel.faq.map((item) => ({
            question: item.question,
            answer: item.answer,
          })),
        }}
      />
      <CTA
        title="Give your agent a voice, anywhere your users are"
        description="Pro tip: paste 'Add an agent to my app https://novu.co/agents.md' into your coding agent, or run npx novu connect. One agent, every channel, one conversation."
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
            label: "Book a demo",
            href: ROUTE.bookADemoConnect,
            clickLocation: `channel_${channel.slug}_cta`,
            clickText: "book_a_demo",
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdGraph).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  )
}

export default ChannelPage
