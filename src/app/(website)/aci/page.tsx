import type { Metadata } from "next"

import { BookADemoSchedulingProvider } from "@/components/pages/book-a-demo/scheduling-provider"
import AciCta from "@/components/pages/aci/aci-cta"
import AciDefinition from "@/components/pages/aci/aci-definition"
import CommunicationFlow from "@/components/pages/aci/communication-flow"
import Hero from "@/components/pages/aci/hero"
import HowItWorksIntro from "@/components/pages/aci/how-it-works-intro"
import NotificationsAnimation from "@/components/pages/aci/notifications-animation"
import OwnershipTable from "@/components/pages/aci/ownership-table"
import StopReinventing from "@/components/pages/aci/stop-reinventing"

export const metadata: Metadata = {
  title: "Agent Communication Infrastructure | Novu",
  description:
    "The missing agent-to-user communication layer between every customer, channel, and agent.",
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
    </BookADemoSchedulingProvider>
  )
}
