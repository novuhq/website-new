import FAQ from "@/components/pages/faq"

import UseCaseHero from "../child-hero"
import AgentReplies from "./agent-replies"
import {
  DEPLOYMENT,
  FAQ_SECTION,
  HERO,
  INBOX,
  OBSERVABILITY,
  TEAM_COLLABORATION,
} from "./data"
import {
  Channels,
  Closing,
  DeliveryControls,
  RichText,
  TextSection,
} from "./sections"
import WorkflowDemo from "./workflow-demo"

function MultiChannelPage() {
  return (
    <div className="-mt-16 overflow-hidden bg-background">
      <UseCaseHero data={HERO} />
      <WorkflowDemo />
      <AgentReplies />
      <Channels />
      <TextSection data={INBOX} />
      <DeliveryControls />
      <TextSection data={TEAM_COLLABORATION} />
      <TextSection data={OBSERVABILITY} />
      <TextSection data={DEPLOYMENT} />
      <FAQ
        className="mt-10 md:mt-16 lg:mt-20"
        title={FAQ_SECTION.title}
        description={FAQ_SECTION.description}
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
