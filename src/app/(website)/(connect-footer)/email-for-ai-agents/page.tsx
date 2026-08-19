import { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import { HOME_COMPLIANCE, HOME_FEATURED_CUSTOMERS } from "@/data/pages/home"
import {
  EMAIL_AGENTS_COMMAND,
  EMAIL_AGENTS_CTA,
  EMAIL_AGENTS_DELIVERY,
  EMAIL_AGENTS_PROMPT,
  EMAIL_AGENTS_SEO_DESCRIPTION,
  EMAIL_AGENTS_SEO_TITLE,
  emailForAiAgentsData as channel,
} from "@/data/pages/email-for-ai-agents"

import { getMetadata } from "@/lib/get-metadata"
import { safeJsonLdStringify } from "@/lib/json-ld"
import { absoluteUrl, toCanonicalPathname } from "@/lib/site-url"
import ChannelConnect from "@/components/pages/channels/channel-connect"
import ChannelConnectStack from "@/components/pages/channels/channel-connect-stack"
import ChannelUseCase from "@/components/pages/channels/channel-use-case"
import EmailAgentsHero from "@/components/pages/email-for-ai-agents/hero"
import FAQ from "@/components/pages/faq"
import Compliance from "@/components/pages/home/compliance"
import Cta from "@/components/pages/home/cta"
import FeaturedCustomers from "@/components/pages/home/featured-customers"
import SectionWithLogosAnimated from "@/components/section-with-logos-animated"

const OG_IMAGE_PATH = "/og-images/channels/email.jpg"

export const metadata: Metadata = getMetadata({
  title: EMAIL_AGENTS_SEO_TITLE,
  description: EMAIL_AGENTS_SEO_DESCRIPTION,
  pathname: String(ROUTE.emailForAiAgents),
  imagePath: OG_IMAGE_PATH,
  imageAlt: channel.hero.heading,
  markdownPathname: true,
})

function DeliveryLayerSection() {
  return (
    <section className="safe-paddings mt-18">
      <div className="container mx-auto max-w-176 px-5 md:px-8 lg:px-0">
        <div className="flex flex-col gap-4">
          <h2 className="text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-white md:text-[2rem]">
            {EMAIL_AGENTS_DELIVERY.title}
          </h2>
          <p className="text-base leading-normal font-normal tracking-tighter text-gray-80">
            {EMAIL_AGENTS_DELIVERY.description}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {EMAIL_AGENTS_DELIVERY.points.map((point) => (
            <div
              key={point.title}
              className="flex flex-col gap-2 rounded-xl border border-gray-20 bg-[#0b0c0e] p-6"
            >
              <h3 className="text-lg leading-tight font-medium tracking-tighter text-white">
                {point.title}
              </h3>
              <p className="text-base leading-snug font-light tracking-normal text-gray-80">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

async function EmailForAiAgentsPage() {
  const siteUrl = absoluteUrl("/")
  const pageUrl = absoluteUrl(
    toCanonicalPathname(String(ROUTE.emailForAiAgents))
  )
  const connectUrl = absoluteUrl(toCanonicalPathname(String(ROUTE.connect)))
  const imageUrl = absoluteUrl(OG_IMAGE_PATH)
  const organizationId = `${siteUrl}#organization`
  const websiteId = `${siteUrl}#website`
  const webPageId = `${pageUrl}#webpage`
  const faqId = `${pageUrl}#faq`
  const breadcrumbId = `${pageUrl}#breadcrumb`
  const howToId = `${pageUrl}#howto`

  const webPageJsonLd = {
    "@type": "WebPage",
    "@id": webPageId,
    name: EMAIL_AGENTS_SEO_TITLE,
    description: EMAIL_AGENTS_SEO_DESCRIPTION,
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
        name: "Email for AI agents",
        item: pageUrl,
      },
    ],
  }

  const howToJsonLd = {
    "@type": "HowTo",
    "@id": howToId,
    name: "How to connect an AI agent to Email with Novu Connect",
    description: channel.citation,
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Bring your agent",
        text: "Connect the agent you already built and let it send and reply to users over email.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Connect the channel",
        text: `Run ${EMAIL_AGENTS_COMMAND}, or paste the integration prompt into your coding agent.`,
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
    <div className="overflow-clip">
      <EmailAgentsHero channel={channel} />
      <SectionWithLogosAnimated
        className="mt-16 mb-0 px-5 md:mt-20 md:mb-0 md:px-8 lg:mt-24 lg:mb-0 xl:mb-0"
        titleHighlight="Novu"
        title="is trusted by leading teams worldwide"
        titleSize="sm"
        titleClassName="leading-normal font-normal tracking-tighter"
        rows={2}
      />
      <ChannelUseCase channel={channel} />
      <ChannelConnectStack channel={channel} />
      <ChannelConnect channel={channel} />
      <DeliveryLayerSection />
      <Compliance {...HOME_COMPLIANCE} />
      <FeaturedCustomers {...HOME_FEATURED_CUSTOMERS} />
      <FAQ
        className="relative z-10 mt-18 pt-0 pb-0 sm:pb-0 md:pt-0 md:pb-0 lg:pb-0"
        title="Email for AI agents, common questions"
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
      <Cta
        title={EMAIL_AGENTS_CTA.title}
        description={EMAIL_AGENTS_CTA.description}
        command={EMAIL_AGENTS_COMMAND}
        prompt={EMAIL_AGENTS_PROMPT}
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

export default EmailForAiAgentsPage
