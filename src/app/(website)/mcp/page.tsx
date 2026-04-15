import { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import { getCustomersPage } from "@/lib/customers"
import { getMetadata } from "@/lib/get-metadata"
import CTA from "@/components/pages/cta"
import McpAgenticToolsSection from "@/components/pages/mcp/agentic-tools"
import McpFrameworksSection from "@/components/pages/mcp/frameworks"
import GetInvolved from "@/components/pages/mcp/get-involved"
import McpHeroSection from "@/components/pages/mcp/hero"
import McpHowItWorksSection from "@/components/pages/mcp/how-it-works"
import McpPromptsSection from "@/components/pages/mcp/prompts"
import Reviews from "@/components/pages/reviews"

export default async function McpPage() {
  const customersPage = await getCustomersPage()

  return (
    <div className="relative overflow-clip pt-10 md:pt-12 lg:pt-24.5">
      <McpHeroSection />
      <McpHowItWorksSection />
      <McpPromptsSection />
      <McpAgenticToolsSection />
      <McpFrameworksSection />
      {customersPage?.tweets?.length ? (
        <Reviews
          reviews={customersPage.tweets}
          title="Don’t just take our word for it..."
          subtitle="Explore what developers and non-technical users say about why they're fans of our open-source notifications framework."
          className="lg:mt-0"
        />
      ) : null}
      <GetInvolved />
      <CTA
        title="Start building with MCP"
        titleClassName="whitespace-pre-line !text-4xl md:!text-[2.75rem]"
        className="py-32 md:py-48 lg:py-60"
        description="Connect your first AI agent in under 5 minutes."
        actions={[
          {
            kind: "primary-button",
            label: "GET STARTED FREE",
            href: `${ROUTE.dashboard}?utm_campaign=gs-website-mcp`,
            openInNewTab: true,
          },
          {
            kind: "secondary-button",
            label: "READ THE DOCS",
            href: ROUTE.docsMcp,
            openInNewTab: true,
          },
        ]}
      />
    </div>
  )
}

export const metadata: Metadata = getMetadata(SEO_DATA.mcp)
