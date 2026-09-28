import { FiveBlockGrid } from "./card-sections"
import { CodeShowcase } from "./code-showcase"
import {
  inboxCode,
  inboxCodeDots,
  inboxComponents,
  inboxCta,
  inboxCtaBackground,
  inboxExample,
  inboxFeatures,
  inboxHero,
  inboxReadySetGo,
} from "./data/inbox"
import { DualCta } from "./dual-cta"
import { IconGridSection } from "./icon-grid-section"
import { InboxHero, InboxShowcase } from "./inbox-sections"

export function InboxLandingPage() {
  return (
    <div className="overflow-hidden">
      <InboxHero {...inboxHero} />

      <IconGridSection {...inboxFeatures} />

      <InboxShowcase {...inboxExample} />

      <CodeShowcase {...inboxCode} codeDotsSrc={inboxCodeDots} />

      <FiveBlockGrid
        {...inboxComponents}
        className="mt-22 md:mt-22 lg:mt-48 xl:mt-48"
      />

      <IconGridSection {...inboxReadySetGo} centered />

      <DualCta
        {...inboxCta}
        backgroundSrc={inboxCtaBackground}
        className="relative mt-35 mb-[207px] overflow-visible lg:mt-51 xl:mt-55"
      />
    </div>
  )
}
