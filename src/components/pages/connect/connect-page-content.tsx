import type { IAgentTemplatesSectionData } from "@/types/templates"
import SectionWithLogosAnimated from "@/components/section-with-logos-animated"

import Channels from "./channels"
import CliSection from "./cli"
import Compliance from "./compliance"
import ConnectFaq from "./faq"
import FinalCta from "./final-cta"
import Hero from "./hero"
import HowItWorks from "./how-it-works"
import Pricing from "./pricing"
import Templates from "./templates"

interface IConnectPageContentProps {
  templatesSection: IAgentTemplatesSectionData
}

function ConnectPageContent({ templatesSection }: IConnectPageContentProps) {
  return (
    <div className="relative overflow-clip bg-black">
      <Hero />
      <SectionWithLogosAnimated
        className="mt-6.25 mb-0 px-5 md:mt-6.25 md:mb-0 md:px-8 lg:mt-6.25 lg:mb-0 xl:mt-6.25 xl:mb-0"
        titleHighlight="Novu"
        title="is trusted by leading teams worldwide"
        titleSize="sm"
        titleClassName="leading-normal font-normal tracking-tighter"
        rows={2}
      />
      <Channels />
      <HowItWorks />
      <CliSection />
      <Templates templatesSection={templatesSection} />
      <Compliance />
      <Pricing />
      <ConnectFaq />
      <FinalCta />
    </div>
  )
}

export default ConnectPageContent
