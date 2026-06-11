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

export const metadata: Metadata = {
  title: "Agent Communication Infrastructure | Novu",
  description:
    "The missing agent-to-user communication layer between every customer, channel, and agent.",
}

export default function AciPage() {
  return (
    <>
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
    </>
  )
}
