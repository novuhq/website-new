import type { Metadata } from "next"
import { ROUTE } from "@/constants/routes"
import { SEO_DATA } from "@/constants/seo-data"

import type { IFaqSection } from "@/types/common"
import { getMetadata } from "@/lib/get-metadata"
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

const ACI_FAQ: IFaqSection = {
  title: "Frequently asked questions",
  accordion: {
    items: [
      {
        question: "What is Agent Communication Infrastructure (ACI)?",
        answer:
          "ACI is the layer between an autonomous agent and the channels where people actually receive messages. Where older software waited for users to open it and notify them one way, agents reach out, follow up, and hold a conversation and ACI is the infrastructure that makes that conversation work across every channel without you building the plumbing yourself.",
      },
      {
        question: "How is ACI different from MCP and A2A?",
        answer:
          "They solve three different connection problems. MCP is how an agent thinks with the world (agent-to-tools), A2A is how agents coordinate with each other (agent-to-agent), and ACI is how an agent reaches the people who care (agent-to-people). Most teams wire up the first two and then spend months hand-building the third. ACI is the standardized layer for that last mile.",
      },
      {
        question: "Does Novu ever see my model, prompts, or data?",
        answer:
          "No. The principle is simple: you own the brain, ACI owns the communication. ACI never sees your prompts, memory, or model. Novu runs only the agent bridge while your model, prompts, tools, business logic, keys, and runtime stay entirely on your side.",
      },
      {
        question: "Can I connect an agent I've already built?",
        answer:
          "Yes. ACI is unopinionated about intelligence. You can bring your own agent built on the Agent SDK, LangChain, a managed Claude agent, or your own server. Connecting it is a single command `npx novu connect` which wires up the SDK with no plumbing for you to maintain.",
      },
      {
        question: "How many channels can one agent talk on?",
        answer:
          "Build the agent once; ACI handles every channel. A single brain answering on Slack also answers on Teams, WhatsApp, Telegram, and Email, with every long-tail channel sitting behind one adapter normalized to a single message shape. Channel availability depends on your plan, and more channels are on the way, including Google Chat, iMessage, Discord, and others.",
      },
      {
        question: "How does ACI relate to Novu Connect and the Novu Platform?",
        answer:
          "ACI is the category; Novu Connect is Novu's implementation of that ACI layer. The broader Novu Platform is the notification infrastructure the company has run for half a decade; channels, identity, and delivery for product notifications. Connect brings that same delivery backbone to agents, and like the rest of Novu, the adapters, identity resolver, and conversation store are open source on GitHub.",
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

export const metadata: Metadata = getMetadata({
  ...SEO_DATA.aci,
  markdownPathname: true,
})
