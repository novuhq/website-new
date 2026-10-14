import FAQ from "@/components/pages/faq"

import UseCaseHero from "../child-hero"
import AgentReplies from "./agent-replies"
import { FAQ_SECTION, HERO } from "./data"
import {
  Channels,
  Closing,
  DeliveryControls,
  Observability,
  RichText,
  Routing,
  Why,
} from "./sections"
import WorkflowDemo from "./workflow-demo"

function MultiChannelPage() {
  return (
    <div className="-mt-16 overflow-hidden bg-background">
      <UseCaseHero data={HERO} />
      <Why />
      <Channels />
      <WorkflowDemo />
      <DeliveryControls />
      <Routing />
      <AgentReplies />
      <Observability />
      <FAQ
        className="mt-10 md:mt-16 lg:mt-20"
        title={FAQ_SECTION.title}
        accordion={{
          items: FAQ_SECTION.items.map(({ question, answer }) => ({
            question,
            answer: <RichText text={answer} />,
          })),
        }}
        keepAnswersInHtml
      />
      <Closing />
    </div>
  )
}

export default MultiChannelPage
