import { CHANNELS } from "@/data/pages/usecase-multi-channel"

import { ProviderSection } from "./provider-section"

/** "Use the providers you already have" `45929-10302`. */
export function MultiChannelChannels() {
  return (
    <ProviderSection
      id="channels"
      titleLines={CHANNELS.titleLines}
      description={CHANNELS.description}
      action={CHANNELS.action}
      items={CHANNELS.items}
      align="center"
      headingOffsetClassName="lg:pt-8"
    />
  )
}
