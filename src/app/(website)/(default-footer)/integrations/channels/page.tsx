import { Metadata } from "next"
import { SEO_DATA } from "@/constants/seo-data"

import { getMetadata } from "@/lib/get-metadata"
import { safeJsonLdStringify } from "@/lib/json-ld"
import { absoluteUrl, toCanonicalPathname } from "@/lib/site-url"

import IntegrationsTabPageContent from "../_components/integrations-tab-page-content"

export const revalidate = false
export const dynamic = "force-static"

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({
    ...SEO_DATA.integrationsChannels,
    markdownPathname: true,
  })
}

export default async function IntegrationsChannelsPage() {
  const seo = SEO_DATA.integrationsChannels
  const pageUrl = absoluteUrl(toCanonicalPathname(seo.pathname))
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.title,
    description: seo.description,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "Novu",
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: "Novu",
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/logo.svg"),
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
      <IntegrationsTabPageContent tab="channels" />
    </>
  )
}
