import { Metadata } from "next"
import { notFound } from "next/navigation"
import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"

import { getMetadata } from "@/lib/get-metadata"
import {
  getAllIntegrations,
  getIntegrationBySlug,
  getRelatedIntegrations,
} from "@/lib/integrations"
import {
  getDefaultIntegrationSeoDescription,
  getDefaultIntegrationSeoTitleSegment,
} from "@/lib/integrations/seo-defaults"
import { safeJsonLdStringify } from "@/lib/json-ld"
import { compileIntegrationMdx } from "@/lib/markdown/compile-mdx"
import CTA from "@/components/pages/cta"
import IntegrationDetail from "@/components/pages/integrations/integration-detail"

export const revalidate = false
export const dynamic = "force-static"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const items = await getAllIntegrations()
  return items
    .filter((item) => item.hasDedicatedPage)
    .map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const integration = await getIntegrationBySlug(slug)

  if (!integration) {
    return {}
  }

  const titleSegment =
    integration.seo?.title ?? getDefaultIntegrationSeoTitleSegment(integration)
  const description =
    integration.seo?.description ??
    getDefaultIntegrationSeoDescription(integration)

  return getMetadata({
    title: `${titleSegment} | ${config.projectName}`,
    description,
    pathname: `${ROUTE.integrations}/${integration.slug}`,
    noIndex: integration.seo?.noIndex,
    markdownPathname: true,
  })
}

export default async function IntegrationDetailPage({ params }: PageProps) {
  const { slug } = await params
  const integration = await getIntegrationBySlug(slug)

  if (!integration) {
    notFound()
  }

  const [relatedIntegrations, { content }] = await Promise.all([
    getRelatedIntegrations(slug),
    compileIntegrationMdx(integration.relativePath),
  ])

  const isLiveAgentChannel =
    integration.category === "agent-channels" &&
    integration.product === "connect" &&
    integration.availability === "live"

  const siteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || ""
  const pageUrl = `${siteUrl}${ROUTE.integrations}/${integration.slug}`

  const resolvedDescription =
    integration.seo?.description ??
    getDefaultIntegrationSeoDescription(integration)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: integration.title,
    description: resolvedDescription,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "Novu",
      url: "https://novu.co",
    },
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(jsonLd),
        }}
      />
      <IntegrationDetail
        integration={integration}
        relatedIntegrations={relatedIntegrations}
        content={content}
      />
      {isLiveAgentChannel ? (
        <CTA
          title={`Bring your agent to every\nconversation`}
          titleClassName="whitespace-pre-line"
          className="!pt-24 md:!pt-46"
          description="Connect the agent you already built to the channels where customers and teams communicate. Novu handles channel-specific messaging, conversation context, and delivery."
          actions={[
            {
              kind: "primary-button",
              label: "Explore agent channels",
              href: "https://docs.novu.co/agents/channels",
              clickLocation: "integrations_detail_cta",
              clickText: "explore_agent_channels",
              openInNewTab: true,
            },
            {
              kind: "secondary-button",
              label: "Read the agent documentation",
              href: "https://docs.novu.co/agents",
              clickLocation: "integrations_detail_cta",
              clickText: "read_agent_docs",
              openInNewTab: true,
            },
          ]}
        />
      ) : (
        <CTA
          title={`Connect your communication\nstack to Novu`}
          titleClassName="whitespace-pre-line"
          className="!pt-24 md:!pt-46"
          description={
            <>
              Use Novu Notify for multi-channel notifications and Novu Connect
              <br className="hidden md:block" /> for contextual agent
              conversations, actions, and approvals.
            </>
          }
          actions={[
            {
              kind: "primary-button",
              label: "Start building",
              href: ROUTE.dashboard,
              clickLocation: "integrations_detail_cta",
              clickText: "start_building",
            },
            {
              kind: "secondary-button",
              label: "TALK TO US",
              href: ROUTE.contactUs,
            },
          ]}
        />
      )}
    </div>
  )
}
