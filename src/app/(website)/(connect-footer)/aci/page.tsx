import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"
import { getMetadata } from "@/lib/get-metadata"
import type { IFaqSection } from "@/types/common"
import type { Metadata } from "next"

import AciCta from "@/components/pages/aci/aci-cta"
import AciDefinition from "@/components/pages/aci/aci-definition"
import CommunicationFlow from "@/components/pages/aci/communication-flow"
import FoundersTestimonials from "@/components/pages/aci/founders-testimonials"
import Hero from "@/components/pages/aci/hero"
import HowItWorksIntro from "@/components/pages/aci/how-it-works-intro"
import Manifesto from "@/components/pages/aci/manifesto"
import NotificationsAnimation from "@/components/pages/aci/notifications-animation"
import OpenSourceCta from "@/components/pages/aci/open-source-cta"
import OwnershipTable from "@/components/pages/aci/ownership-table"
import StopReinventing from "@/components/pages/aci/stop-reinventing"
import { BookADemoSchedulingProvider } from "@/components/pages/book-a-demo/scheduling-provider"
import FAQ from "@/components/pages/faq"
import FinalCta, { type FinalCtaProps } from "@/components/pages/final-cta"

const ACI_FAQ_ANSWER =
  "Claude Managed Agents are Anthropic’s fully managed infrastructure for building and running autonomous AI agents. You define what the agent should do, the tools it can use, and the guardrails it should follow, while Anthropic handles the managed runtime behind it. Novu Connect then brings that agent into the channels where people already work, such as Slack, WhatsApp, email, Telegram, and Discord."

const ACI_FAQ: IFaqSection = {
  title: "Frequently asked questions",
  accordion: {
    items: [
      {
        question: "What are Claude Managed Agents?",
        answer: ACI_FAQ_ANSWER,
      },
      {
        question: "Does Novu manage or host my Claude agent?",
        answer: ACI_FAQ_ANSWER,
      },
      {
        question: "Can I use a Claude agent I've already built?",
        answer: ACI_FAQ_ANSWER,
      },
      {
        question: "Can I share my agent with my team?",
        answer: ACI_FAQ_ANSWER,
      },
      {
        question: "How many channels can I connect to a single agent?",
        answer: ACI_FAQ_ANSWER,
      },
      {
        question: "Novu Connect vs Novu Platform",
        answer: ACI_FAQ_ANSWER,
      },
    ],
  },
}

const ACI_FINAL_CTA: FinalCtaProps = {
  title: (
    <>
      <span>Give your agent a voice</span>
      <br className="hidden sm:block" aria-hidden />
      <span className="sm:hidden"> </span>
      <span>everywhere your users are</span>
    </>
  ),
  description: "Build the agent once. ACI handles the rest.",
  actions: [
    {
      kind: "primary-button",
      label: "Start building",
      href: ROUTE.dashboardV2,
      clickLocation: "aci_final_cta",
      clickText: "start_building",
      openInNewTab: true,
    },
    {
      kind: "scheduling-button",
      label: "Talk to the team",
      source: "aci_final_cta",
      clickLocation: "aci_final_cta",
      clickText: "talk_to_the_team",
      variant: "secondary",
    },
  ],
}

export default function AciPage() {
  return (
    <BookADemoSchedulingProvider utmCampaign="aci">
      <Hero />
      <NotificationsAnimation />
      <StopReinventing />
      <AciDefinition />
      <HowItWorksIntro />
      <CommunicationFlow />
      <AciCta />
      <OwnershipTable />
      <FoundersTestimonials />
      <OpenSourceCta />
      <Manifesto />
      <FAQ
        {...ACI_FAQ}
        className="pt-26 md:pt-48 lg:pt-73"
        titleClassName="text-center text-[1.75rem] md:text-[40px] lg:text-left"
        containerClassName="max-w-272"
      />
      <FinalCta
        {...ACI_FINAL_CTA}
        className="pt-28 md:pt-44 lg:pt-60 xl:pt-60"
        dataConnectSection={null}
        descriptionClassName="max-w-139.75 tracking-[-0.02em]"
      />
    </BookADemoSchedulingProvider>
  )
}

export const metadata: Metadata = getMetadata(SEO_DATA.aci)
