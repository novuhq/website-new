import { Metadata } from "next"
import { notFound } from "next/navigation"
import config from "@/configs/website-config"
import { ROUTE } from "@/constants/routes"

import { getMetadata } from "@/lib/get-metadata"
import { safeJsonLdStringify } from "@/lib/json-ld"
import { compileIntegrationMdx } from "@/lib/markdown/compile-mdx"
import {
  getAllIntegrations,
  getIntegrationBySlug,
  getRelatedIntegrations,
} from "@/lib/integrations"
import {
  getDefaultIntegrationSeoDescription,
  getDefaultIntegrationSeoTitleSegment,
} from "@/lib/integrations/seo-defaults"
import CTA from "@/components/pages/cta"
import IntegrationDetail from "@/components/pages/integrations/integration-detail"

export const revalidate = false
export const dynamic = "force-static"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const items = await getAllIntegrations()
  return items.map((i) => ({ slug: i.slug }))
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
    integration.seo?.description ?? getDefaultIntegrationSeoDescription(integration)

  return getMetadata({
    title: `${titleSegment} | ${config.projectName}`,
    description,
    pathname: `${ROUTE.integrations}/${integration.slug}`,
    noIndex: integration.seo?.noIndex,
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
    compileIntegrationMdx(integration.rawBody),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || ""
  const pageUrl = `${siteUrl}${ROUTE.integrations}/${integration.slug}`

  const resolvedDescription =
    integration.seo?.description ?? getDefaultIntegrationSeoDescription(integration)

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
      <CTA
        title={`Send notifications with\nthe providers you already use`}
        titleClassName="whitespace-pre-line"
        className="!pt-24 md:!pt-46"
        description={
          <>
            Start with one provider or connect multiple channels, and
            <br className="hidden md:block" />
            manage them in one place with Novu.
          </>
        }
        actions={[
          {
            kind: "primary-button",
            label: "Start building",
            href: `${ROUTE.dashboard}?utm_campaign=gs-website-inbox`,
          },
          {
            kind: "secondary-button",
            label: "TALK TO US",
            href: ROUTE.contactUs,
          },
        ]}
      />
    </div>
  )
}
