import { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import { getMetadata } from "@/lib/get-metadata"
import { safeJsonLdStringify } from "@/lib/json-ld"
import IntegrationsTabPageContent from "@/app/(website)/integrations/_components/integrations-tab-page-content"

const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || ""

export const revalidate = false
export const dynamic = "force-static"

export async function generateMetadata(): Promise<Metadata> {
  const seo = SEO_DATA.integrationsSources
  const base = getMetadata(seo)
  const canonicalUrl = `${SITE_URL}${ROUTE.integrations}/sources/`

  return {
    ...base,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...base.openGraph,
      url: canonicalUrl,
    },
  }
}

export default async function IntegrationsSourcesPage() {
  const seo = SEO_DATA.integrationsSources
  const pageUrl = `${SITE_URL}${ROUTE.integrations}/sources/`
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.title,
    description: seo.description,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "Novu",
      url: "https://novu.co",
    },
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(collectionJsonLd),
        }}
      />
      <IntegrationsTabPageContent tab="sources" />
    </>
  )
}
