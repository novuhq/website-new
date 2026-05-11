import { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import { getMetadata } from "@/lib/get-metadata"
import Hero from "@/components/pages/copilot/hero"
import HowItWorks from "@/components/pages/copilot/how-it-works"
import OldWay, { YourTeam } from "@/components/pages/copilot/old-way"
import PromptsInTheWild from "@/components/pages/copilot/prompts-in-the-wild"
import TrustedWorkflows from "@/components/pages/copilot/trusted-workflows"
import CTA from "@/components/pages/cta"
import SectionWithLogosAnimated from "@/components/section-with-logos-animated"

export default function CopilotPage() {
  return (
    <div className="relative overflow-clip pt-10 md:pt-12 lg:pt-24.5">
      <Hero />
      <SectionWithLogosAnimated
        title={`Trusted by the best product and\n engineering teams`}
        titleClassName="!max-w-[80%] whitespace-pre-line lg:text-[2.5rem] mb-6 md:mb-0"
        rows={2}
        className="xl:mt-50 xl:mb-48"
      />
      <OldWay />
      <HowItWorks />
      <PromptsInTheWild />
      <TrustedWorkflows />
      <YourTeam />
      <CTA
        title="Your next workflow is one prompt away."
        titleClassName="whitespace-pre-line !text-[1.75rem] md:!text-[2.75rem]"
        className="py-32 md:py-48 lg:py-60"
        containerClassName="!max-w-none"
        description="Free to start, no credit card. BETA — we're shipping improvements weekly based on what product teams ask for."
        descriptionClassName="max-w-177"
        actions={[
          {
            kind: "primary-button",
            label: "start shipping",
            href: ROUTE.dashboardV2SignUp,
            openInNewTab: true,
            clickLocation: "copilot_cta",
            clickText: "start_shipping",
          },
        ]}
      />
    </div>
  )
}

export const metadata: Metadata = getMetadata(SEO_DATA.copilot)
