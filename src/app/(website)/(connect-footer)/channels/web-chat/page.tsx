import type { Metadata } from "next"
import { ROUTE } from "@/constants/routes"

import { getMetadata } from "@/lib/get-metadata"
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
  title: "Web Chat: Your Agent, Live Inside Your Product | Novu",
  description:
    "Web Chat uses product context, takes action, and continues conversations across channels. Live in two minutes.",
  pathname: "/channels/web-chat",
  imagePath: "/og-images/og-image-web-chat.jpg",
  imageAlt: "Novu Web Chat: your agent, live inside your product",
})

/**
 * The inter-section gaps, one per boundary. Sections never carry their own
 * vertical spacing — this page owns it exclusively, so no future section can
 * arrive with its own idea of rhythm. (They used to: `mt-24 md:mt-32` on
 * most, `py-20 md:py-28` on compare-bento/deploy-aci, nothing at all on
 * surface-tabs — three conventions that fought each other at the boundaries.)
 *
 * Desktop values are measured from Figma's `45487-79054`, each one the
 * whitespace between consecutive section content boxes. The rhythm is
 * deliberately NOT uniform, so a single shared constant cannot express it:
 * 240px is the norm, the deploy-ACI → ownership run tightens to 228px, the
 * hero exits at 180px, and the channels grid is pulled in to 144px because
 * its tile grid carries its own visual air.
 *
 * Mobile stays a uniform 144px. Figma's mobile frame (`45487-98982`) authors
 * only four of these sections, so there is no per-boundary mobile value to
 * match — see the mobile-coverage audit in
 * `docs/superpowers/logs/2026-09-08-web-chat-figma-node-map.md`.
 */
const GAP = {
  compareBento: "mt-36 md:mt-45", // 180px — hero frame bottom → §2
  productBento: "mt-36 md:mt-60", // 240px
  surfaceTabs: "mt-36 md:mt-60", // 240px
  channelsGrid: "mt-36 md:mt-36", // 144px — tightened around the tile grid
  deployAci: "mt-36 md:mt-60", // 240px
  designSystem: "mt-36 md:mt-57", // 228px
  configurator: "mt-36 md:mt-57", // 228px
  ownership: "mt-36 md:mt-57", // 228px
  cta: "md:mt-60 lg:mt-60", // 240px, overriding Cta's own md:mt-32 lg:mt-44
} as const

export default function WebChatPage() {
  return (
    <div className="overflow-clip">
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
    </div>
  )
}
