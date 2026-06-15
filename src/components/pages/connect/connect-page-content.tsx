import type { IAgentTemplatesSectionData } from "@/types/templates"
import FAQ from "@/components/pages/faq"
import FinalCta from "@/components/pages/final-cta"
import SectionWithLogosAnimated from "@/components/section-with-logos-animated"

import ACI from "./aci"
import Channels from "./channels"
import CliSection from "./cli"
import Compliance from "./compliance"
import { CONNECT_FAQ } from "./faq-data"
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
      <ACI />
      <HowItWorks />
      <CliSection />
      <Templates templatesSection={templatesSection} />
      <Compliance />
      <Pricing />
      <FAQ
        {...CONNECT_FAQ}
        id="faq"
        className="scroll-mt-16 pt-28 md:pt-36 lg:pt-44 xl:pt-50"
        titleClassName="text-center text-[1.75rem] md:text-[40px] lg:text-left"
        containerClassName="max-w-272"
      />
      <FinalCta />
    </div>
  )
}

export default ConnectPageContent
