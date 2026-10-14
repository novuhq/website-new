import { ROUTING } from "@/data/pages/usecase-multi-channel"

import { ProviderSection } from "./provider-section"

/** "Keep your providers. Centralize routing" `45942-10937`. */
export function MultiChannelRouting() {
  return (
    <ProviderSection
      id="routing"
      titleLines={ROUTING.titleLines}
      description={ROUTING.description}
      action={ROUTING.action}
      items={ROUTING.items}
      align="start"
      headingOffsetClassName="lg:pt-4"
    />
  )
}
