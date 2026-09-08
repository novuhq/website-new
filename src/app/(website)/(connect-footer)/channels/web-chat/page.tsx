import type { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import ogImage from "@/images/pages/channels/web-chat/og-image.webp"

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
  imagePath: ogImage.src,
  imageAlt: "Novu Web Chat: your agent, live inside your product",
})

/**
 * The single inter-section gap for every mounted section below the hero.
 * Each section's own root used to carry its own margin or padding (`mt-24
 * md:mt-32` on most, `py-20 md:py-28` on compare-bento/deploy-aci, nothing
 * at all on surface-tabs) — three incompatible conventions that fought each
 * other at the boundaries and drifted from Figma's rhythm. Sections no
 * longer carry their own vertical spacing; this page owns it exclusively,
 * so no future section can arrive with its own idea of spacing.
 */
const SECTION_GAP = "mt-36 md:mt-48"

export default function WebChatPage() {
  return (
    <div className="overflow-clip">
      <WebChatBrandProvider>
        <WebChatHero />
        <div className={SECTION_GAP}>
          <CompareBento />
        </div>
        <div className={SECTION_GAP}>
          <ProductBento />
        </div>
      </WebChatBrandProvider>

      <div className={SECTION_GAP}>
        <SurfaceTabs />
      </div>
      <div className={SECTION_GAP}>
        <ChannelsGrid />
      </div>
      <div className={SECTION_GAP}>
        <DeployAci />
      </div>
      <div className={SECTION_GAP}>
        <DesignSystemShowcase />
      </div>
      <div className={SECTION_GAP}>
        <WebChatConfigurator />
      </div>
      <div className={SECTION_GAP}>
        <Ownership />
      </div>

      <Cta
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
