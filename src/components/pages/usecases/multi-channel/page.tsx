import { CTA, FAQ_SECTION } from "@/data/pages/usecase-multi-channel"

import { Link } from "@/components/ui/link"
import FAQ from "@/components/pages/faq"
import Cta from "@/components/pages/home/cta"

import { MultiChannelAgentReplies } from "./agent-replies"
import { MultiChannelChannels } from "./channels"
import { MultiChannelDeliveryControls } from "./delivery-controls"
import { MultiChannelHero } from "./hero"
import { MultiChannelObservability } from "./observability"
import { MultiChannelRouting } from "./routing"
import { MultiChannelWhy } from "./why"
import { MultiChannelWorkflowDemo } from "./workflow-demo"

// Follow the Web Chat page's mobile/tablet/laptop rhythm; keep Figma's
// wide-screen gaps (`45929-5232`).
const GAP = {
  why: "mt-24 md:mt-28 lg:mt-32 xl:mt-49.5",
  channels: "mt-24 md:mt-28 lg:mt-32 xl:mt-57",
  workflowDemo: "mt-24 md:mt-28 lg:mt-32 xl:mt-70.5",
  deliveryControls: "mt-24 md:mt-28 lg:mt-32 xl:mt-73",
  routing: "mt-24 md:mt-28 lg:mt-32 xl:mt-57",
  agentReplies: "mt-24 md:mt-28 lg:mt-32 xl:mt-59",
  observability: "mt-24 md:mt-28 lg:mt-40 xl:mt-63",
  faq: "mt-24 md:mt-28 lg:mt-40 xl:mt-59",
  cta: "mt-24 md:mt-28 lg:mt-32 xl:mt-61",
}

const INLINE_LINK = /(\[[^\]]+\]\([^)]+\))/
const LINK_PARTS = /^\[([^\]]+)\]\(([^)]+)\)$/

/** Renders the FAQ copy's [text](url) marks as links. */
function RichText({ text }: { text: string }) {
  return text.split(INLINE_LINK).map((part, index) => {
    const link = LINK_PARTS.exec(part)

    return link ? (
      <Link className="inline" href={link[2]} size="none" key={index}>
        {link[1]}
      </Link>
    ) : (
      part
    )
  })
}

function MultiChannelPage() {
  return (
    <div className="overflow-clip bg-black font-inter">
      <MultiChannelHero />
      <div className={GAP.why}>
        <MultiChannelWhy />
      </div>
      <div className={GAP.channels}>
        <MultiChannelChannels />
      </div>
      <div className={GAP.workflowDemo}>
        <MultiChannelWorkflowDemo />
      </div>
      <div className={GAP.deliveryControls}>
        <MultiChannelDeliveryControls />
      </div>
      <div className={GAP.routing}>
        <MultiChannelRouting />
      </div>
      <div className={GAP.agentReplies}>
        <MultiChannelAgentReplies />
      </div>
      <div className={GAP.observability}>
        <MultiChannelObservability />
      </div>
      <FAQ
        id="multi-channel-faq"
        title={FAQ_SECTION.title}
        accordion={{
          items: FAQ_SECTION.items.map(({ question, answer }) => ({
            question,
            answer: <RichText text={answer} />,
          })),
        }}
        variant="minimal"
        defaultOpenFirst
        keepAnswersInHtml
        className={`${GAP.faq} pt-0 pb-0 sm:pb-0 md:pt-0 md:pb-0 lg:pb-0`}
        titleClassName="font-normal tracking-(--tracking-plus-tight) md:text-[44px]"
        containerClassName="max-w-240 gap-y-4.5 md:gap-y-10"
        itemClassName="md:relative md:mb-10 md:border-b-0 md:after:pointer-events-none md:after:absolute md:after:inset-x-0 md:after:-bottom-5 md:after:h-px md:after:bg-gray-3 md:last:mb-0 md:last:after:hidden"
        triggerClassName="md:min-h-6.5 md:py-0.75 md:[&>svg]:size-3.5"
        contentClassName="md:pt-4 md:pb-2"
      />
      <Cta
        // Figma's description is 736px wide and breaks after the first
        // sentence; the shared CTA caps it at 606px.
        className={`${GAP.cta} lg:[&_p]:max-w-184 lg:[&_p]:whitespace-pre-line`}
        title={CTA.title}
        description={CTA.description}
        actions={[
          {
            kind: "primary-button",
            label: CTA.primaryAction.label,
            href: CTA.primaryAction.href,
            clickLocation: "usecase_multi_channel_cta",
            clickText: CTA.primaryAction.clickText,
          },
          {
            kind: "secondary-button",
            label: CTA.secondaryAction.label,
            href: CTA.secondaryAction.href,
            clickLocation: "usecase_multi_channel_cta",
            clickText: CTA.secondaryAction.clickText,
          },
        ]}
      />
    </div>
  )
}

export default MultiChannelPage
