import { Suspense } from "react"
import { ROUTE } from "@/constants/routes"

import type { IntegrationTabType } from "@/types/integration"
import {
  getIntegrationCategories,
  getIntegrationsByTab,
} from "@/lib/integrations"
import CTA from "@/components/pages/cta"
import IntegrationsHero from "@/components/pages/integrations/integrations-hero"
import IntegrationsSections from "@/components/pages/integrations/integrations-sections"
import IntegrationsTabs from "@/components/pages/integrations/integrations-tabs"

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
      <CTA
        title={`Send notifications with\r\nthe providers you already use`}
        titleClassName="whitespace-pre-line"
        className="!pt-27 !pb-45"
        description={
          <>
            Start with one provider or connect multiple channels, and
            <br />
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
            label: "TALK TO us",
            href: ROUTE.contactUs,
          },
        ]}
      />
    </div>
  )
}

export default IntegrationsTabPageContent
