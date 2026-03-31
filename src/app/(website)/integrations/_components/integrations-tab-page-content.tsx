import { ROUTE } from "@/constants/routes"

import {
  getIntegrationCategories,
  getIntegrationsByTab,
} from "@/lib/integrations"
import type { IntegrationTabType } from "@/types/integration"
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
      <IntegrationsTabs activeTab={tab} categoryItems={categoryItems} />
      <IntegrationsSections
        tab={tab}
        categories={categories}
        integrations={integrations}
      />
      <CTA
        title={`Send notifications\r\nwith your providers`}
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
