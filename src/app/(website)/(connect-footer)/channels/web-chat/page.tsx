import type { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import { WEB_CHAT_SEO } from "@/data/pages/web-chat"

import { getMetadata } from "@/lib/get-metadata"
import { safeJsonLdStringify } from "@/lib/json-ld"
import { absoluteUrl, toCanonicalPathname } from "@/lib/site-url"
import { brandCssVars, buildBrandTheme } from "@/lib/web-chat-theme"
import { WebChatBrandProvider } from "@/components/pages/channels/web-chat/brand-provider"
import { ChannelsGrid } from "@/components/pages/channels/web-chat/channels-grid"
import { CompareBento } from "@/components/pages/channels/web-chat/compare-bento"
import { WebChatConfigurator } from "@/components/pages/channels/web-chat/configurator"
import { DeployAci } from "@/components/pages/channels/web-chat/deploy-aci"
import { DesignSystemShowcase } from "@/components/pages/channels/web-chat/design-system-showcase"
import { WebChatHero } from "@/components/pages/channels/web-chat/hero"
import { Ownership } from "@/components/pages/channels/web-chat/ownership"
import { ProductBento } from "@/components/pages/channels/web-chat/product-bento"
import { SurfaceTabs } from "@/components/pages/channels/web-chat/surface-tabs"
import Cta from "@/components/pages/home/cta"

export const metadata: Metadata = getMetadata({
  ...WEB_CHAT_SEO,
  pathname: String(ROUTE.channelWebChat),
  markdownPathname: true,
})

/** Follow the homepage's mobile/tablet/laptop rhythm; retain Figma's wide-screen gaps. */
const GAP = {
  compareBento: "mt-24 md:mt-33 lg:mt-45 xl:mt-45",
  productBento: "mt-24 md:mt-40 lg:mt-45 xl:mt-60",
  surfaceTabs: "mt-24 md:mt-40 lg:mt-45 xl:mt-60",
  channelsGrid: "mt-24 md:mt-28 lg:mt-32 xl:mt-36",
  deployAci: "mt-24 md:mt-28 lg:mt-32 xl:mt-60",
  designSystem: "mt-24 md:mt-28 lg:mt-32 xl:mt-57",
  configurator: "mt-24 md:mt-28 lg:mt-32 xl:mt-57",
  ownership: "mt-24 md:mt-28 lg:mt-32 xl:mt-57",
  cta: "mt-24 md:mt-28 lg:mt-32 xl:mt-60",
} as const

/**
 * The default accent custom properties, applied to the whole page.
 *
 * Sections after the two bentos keep the default theme. The provider overrides
 * these variables only for the hero, comparison bento, and product bento.
 */
const DEFAULT_BRAND_VARS = brandCssVars(buildBrandTheme(null))

export default function WebChatPage() {
  const siteUrl = absoluteUrl("/")
  const pageUrl = absoluteUrl(toCanonicalPathname(String(ROUTE.channelWebChat)))
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        name: WEB_CHAT_SEO.title,
        description: WEB_CHAT_SEO.description,
        url: pageUrl,
        image: absoluteUrl(WEB_CHAT_SEO.imagePath),
        isPartOf: { "@id": `${siteUrl}#website` },
        publisher: { "@id": `${siteUrl}#organization` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Novu", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Novu Connect",
            item: absoluteUrl(toCanonicalPathname(String(ROUTE.connect))),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Web Chat",
            item: pageUrl,
          },
        ],
      },
    ],
  }

  return (
    <div className="overflow-clip font-inter" style={DEFAULT_BRAND_VARS}>
      {/*
        Share the submitted brand with the two bento sections. Their existing
        hue layers recolor the current artwork; later sections keep the default
        theme.
      */}
      <WebChatBrandProvider>
        <WebChatHero />

        <div className={GAP.compareBento}>
          <CompareBento />
        </div>
        <div className={GAP.productBento}>
          <ProductBento />
        </div>
      </WebChatBrandProvider>

      <div className={GAP.surfaceTabs}>
        <SurfaceTabs />
      </div>
      <div className={GAP.channelsGrid}>
        <ChannelsGrid />
      </div>
      <div className={GAP.deployAci}>
        <DeployAci />
      </div>
      <div className={GAP.designSystem}>
        <DesignSystemShowcase />
      </div>
      <div className={GAP.configurator}>
        <WebChatConfigurator />
      </div>
      <div className={GAP.ownership}>
        <Ownership />
      </div>

      <Cta
        className={GAP.cta}
        title="Put your agent inside your product"
        description="Keep your agent’s model, runtime, and logic. One agent, every channel, one conversation."
        actions={[
          {
            kind: "primary-button",
            label: "Explore Novu Connect",
            href: ROUTE.connect,
            clickLocation: "web_chat_cta",
            clickText: "explore_connect",
          },
          {
            kind: "secondary-button",
            label: "Book a Demo",
            href: ROUTE.bookADemoConnect,
            clickLocation: "web_chat_cta",
            clickText: "book_a_demo",
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />
    </div>
  )
}
