import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllSolutionSlugs, getSolutionBySlug } from "@/data/pages/solutions"
import {
  AGENT_CONNECT_CHANNELS,
  AGENT_CONNECT_DESCRIPTION,
  AGENT_CONNECT_TITLE,
} from "@/data/pages/solutions/ai-agents-connect-stack"
import {
  AGENT_FEATURE_ITEMS,
  AGENT_FEATURES_DESCRIPTION,
  AGENT_FEATURES_TITLE,
} from "@/data/pages/solutions/ai-agents-features"

import type { TSectionAction } from "@/types/common"
import type { ISolutionPageData } from "@/types/solution"
import { getMetadata } from "@/lib/get-metadata"
import { safeJsonLdStringify } from "@/lib/json-ld"
import { absoluteUrl, toCanonicalPathname } from "@/lib/site-url"
import FAQ from "@/components/pages/faq"
import Compliance from "@/components/pages/home/compliance"
import ConnectStack from "@/components/pages/home/connect-stack"
import CTA from "@/components/pages/home/cta"
import Features from "@/components/pages/home/features"
import AgentGallery from "@/components/pages/solutions/agent-gallery"
import ChannelIntentSync from "@/components/pages/solutions/channel-intent-sync"
import SolutionCode from "@/components/pages/solutions/solution-code"
import SolutionGlobeHero from "@/components/pages/solutions/solution-globe-hero"
import SolutionHero from "@/components/pages/solutions/solution-hero"
import SolutionSections from "@/components/pages/solutions/solution-sections"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllSolutionSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const solution = getSolutionBySlug(slug)

  if (!solution) {
    return {}
  }

  return getMetadata({
    title: solution.seoTitle,
    description: solution.seoDescription,
    pathname: `/solutions/${slug}`,
  })
}

function getFinalCtaActions(solution: ISolutionPageData): TSectionAction[] {
  const actions: TSectionAction[] = []

  if (solution.primaryCta) {
    actions.push({
      kind: "primary-button",
      label: solution.primaryCta.label,
      href: solution.primaryCta.href,
      clickLocation: `solution_${solution.slug}_cta`,
      clickText: "primary_cta",
    })
  }

  if (solution.secondaryCta) {
    actions.push({
      kind: "secondary-button",
      label: solution.secondaryCta.label,
      href: solution.secondaryCta.href,
      clickLocation: `solution_${solution.slug}_cta`,
      clickText: "secondary_cta",
    })
  }

  return actions
}

async function SolutionPage({ params }: PageProps) {
  const { slug } = await params
  const solution = getSolutionBySlug(slug)

  if (!solution) {
    notFound()
  }

  const siteUrl = absoluteUrl("/")
  const pageUrl = absoluteUrl(
    toCanonicalPathname(`/solutions/${solution.slug}`)
  )
  const organizationId = `${siteUrl}#organization`
  const websiteId = `${siteUrl}#website`
  const webPageId = `${pageUrl}#webpage`
  const faqId = `${pageUrl}#faq`
  const breadcrumbId = `${pageUrl}#breadcrumb`

  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webPageId,
        name: solution.seoTitle,
        description: solution.seoDescription,
        url: pageUrl,
        isPartOf: { "@id": websiteId },
        publisher: { "@id": organizationId },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: [{ "@id": faqId }],
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        mainEntity: solution.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
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
            name: solution.name,
            item: pageUrl,
          },
        ],
      },
    ],
  }

  // Command-track pages close with the copyable command and coding-agent
  // prompt; the rest close with their primary and secondary buttons.
  const ctaActions = solution.command ? [] : getFinalCtaActions(solution)

  return (
    <div
      className="overflow-clip font-inter"
      data-conversion-track={solution.conversionTrack}
    >
      {solution.heroVariant === "globe" ? (
        <>
          <SolutionGlobeHero solution={solution} />
          <ChannelIntentSync />
          <Features
            title={AGENT_FEATURES_TITLE}
            description={AGENT_FEATURES_DESCRIPTION}
            items={AGENT_FEATURE_ITEMS}
            defaultKey="slack"
          />
        </>
      ) : (
        <SolutionHero solution={solution} />
      )}
      <SolutionSections solution={solution} />
      {solution.heroVariant === "globe" ? (
        <>
          <ConnectStack
            title={AGENT_CONNECT_TITLE}
            description={AGENT_CONNECT_DESCRIPTION}
            channels={AGENT_CONNECT_CHANNELS}
            defaultChannelValue="slack"
          />
          <AgentGallery />
        </>
      ) : null}
      <SolutionCode solution={solution} />
      {solution.compliance ? (
        <Compliance
          className="mt-20 md:mt-24 lg:mt-28 xl:mt-28"
          title={solution.compliance.title}
          description={solution.compliance.description}
          items={solution.compliance.items}
        />
      ) : null}
      <FAQ
        className="relative z-10 mt-20 pt-0 pb-0 sm:pb-0 md:pt-0 md:pb-0 lg:pb-0"
        title={`${solution.name.replace(/^For /, "Novu for ")}, common questions`}
        titleClassName="text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] md:text-[2rem]"
        containerClassName="max-w-176 gap-y-8 lg:max-w-176 lg:px-0"
        defaultOpenFirst
        variant="minimal"
        accordion={{
          items: solution.faq.map((item) => ({
            question: item.question,
            answer: item.answer,
          })),
        }}
      />
      <CTA
        title={solution.finalCta.title}
        description={solution.finalCta.description}
        {...(solution.command
          ? { command: solution.command, prompt: solution.prompt }
          : { actions: ctaActions })}
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

export default SolutionPage
