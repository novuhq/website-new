import { Suspense } from "react"
import { ROUTE } from "@/constants/routes"

import type { IntegrationTabType } from "@/types/integration"
import {
  getIntegrationCategories,
  getIntegrationsByTab,
} from "@/lib/integrations"
import Banner from "@/components/pages/banner"
import CTA from "@/components/pages/cta"
import IntegrationsHero from "@/components/pages/integrations/integrations-hero"
import IntegrationsSections from "@/components/pages/integrations/integrations-sections"
import IntegrationsTabs from "@/components/pages/integrations/integrations-tabs"

const BANNER_CONTENT: Record<
  IntegrationTabType,
  {
    title: string
    description: string
    cta: { label: string; href: string; openInNewTab: boolean }
  }
> = {
  channels: {
    title: "Use the HTTP Step",
    description:
      "Send HTTP requests from your workflow to trigger third-\nparty actions and connect external services.",
    cta: {
      label: "View docs",
      href: "https://docs.novu.co/platform/workflow/add-and-configure-steps/configure-action-steps/http-step",
      openInNewTab: true,
    },
  },
  sources: {
    title: "Add Custom Webhook",
    description:
      "Send notifications through a custom webhook when your\nprovider is not available as a built-in integration.",
    cta: {
      label: "View docs",
      href: "https://docs.novu.co/platform/developer/webhooks",
      openInNewTab: true,
    },
  },
}

interface IntegrationsTabPageContentProps {
  tab: IntegrationTabType
}

async function IntegrationsTabPageContent({
  tab,
}: IntegrationsTabPageContentProps) {
  const [categories, integrations] = await Promise.all([
    getIntegrationCategories(tab),
    getIntegrationsByTab(tab),
  ])
  const categoryItems = categories.map((c) => ({
    slug: c.slug,
    title: c.title,
  }))

  return (
    <div>
      <IntegrationsHero />
      <Suspense>
        <IntegrationsTabs activeTab={tab} categoryItems={categoryItems} />
      </Suspense>
      <Suspense>
        <IntegrationsSections
          tab={tab}
          categories={categories}
          integrations={integrations}
        />
      </Suspense>
      <Banner
        title={BANNER_CONTENT[tab].title}
        description={BANNER_CONTENT[tab].description}
        cta={BANNER_CONTENT[tab].cta}
        className="pb-18"
      />
      <CTA
        title={`Send notifications with\nthe providers you already use`}
        titleClassName="whitespace-pre-line"
        className="!pt-27 !pb-45"
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
            openInNewTab: true,
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

export default IntegrationsTabPageContent
