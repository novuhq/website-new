import { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import {
  emailForAiAgentsData as channel,
  EMAIL_AGENTS_COMMAND,
  EMAIL_AGENTS_CTA,
  EMAIL_AGENTS_PROMPT,
  EMAIL_AGENTS_SEO_DESCRIPTION,
  EMAIL_AGENTS_SEO_TITLE,
} from "@/data/pages/email-for-ai-agents"
import { HOME_COMPLIANCE, HOME_FEATURED_CUSTOMERS } from "@/data/pages/home"

import { getMetadata } from "@/lib/get-metadata"
import { safeJsonLdStringify } from "@/lib/json-ld"
import { absoluteUrl, toCanonicalPathname } from "@/lib/site-url"
import CustomerLogosMarquee from "@/components/customer-logos-marquee"
import EmailAgentsCapabilities from "@/components/pages/email-for-ai-agents/capabilities"
import EmailAgentsConnectStack from "@/components/pages/email-for-ai-agents/connect-stack"
import EmailAgentsDeliveryLayer from "@/components/pages/email-for-ai-agents/delivery-layer"
import EmailAgentsHero from "@/components/pages/email-for-ai-agents/hero"
import EmailAgentsUseCase from "@/components/pages/email-for-ai-agents/use-case"
import FAQ from "@/components/pages/faq"
import Compliance from "@/components/pages/home/compliance"
import Cta from "@/components/pages/home/cta"
import FeaturedCustomers from "@/components/pages/home/featured-customers"

const OG_IMAGE_PATH = "/og-images/og-image-email-for-ai-agents.jpg"

export const metadata: Metadata = getMetadata({
  title: EMAIL_AGENTS_SEO_TITLE,
  description: EMAIL_AGENTS_SEO_DESCRIPTION,
  pathname: String(ROUTE.emailForAiAgents),
  imagePath: OG_IMAGE_PATH,
  imageAlt: channel.hero.heading,
  markdownPathname: true,
})

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
    <div className="overflow-clip font-inter">
      <EmailAgentsHero channel={channel} />
      <CustomerLogosMarquee className="mt-14 md:mt-16" />
      <EmailAgentsUseCase channel={channel} />
      <EmailAgentsConnectStack channel={channel} />
      <EmailAgentsCapabilities channel={channel} />
      <EmailAgentsDeliveryLayer />
      <Compliance
        {...HOME_COMPLIANCE}
        className="mt-24 mb-24 md:mt-32 md:mb-32 lg:mt-60 lg:mb-60 xl:mt-60 xl:mb-60"
      />
      <FeaturedCustomers
        {...HOME_FEATURED_CUSTOMERS}
        className="mt-24 mb-24 md:mt-32 md:mb-32 lg:mt-55 lg:mb-55 xl:mt-55 xl:mb-55"
      />
      <FAQ
        className="relative z-10 mt-24 mb-24 pt-0 pb-0 sm:pb-0 md:mt-32 md:mb-32 md:pt-0 md:pb-0 lg:mt-55 lg:mb-60 lg:pb-0 xl:mt-55 xl:mb-60"
        title="Email for AI agents, common questions"
        titleClassName="text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] md:text-[2rem] lg:text-[2.5rem] xl:text-[2.75rem]"
        containerClassName="max-w-288 gap-y-10 lg:max-w-288"
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
