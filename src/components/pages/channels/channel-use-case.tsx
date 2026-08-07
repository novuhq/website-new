import {
  CHANNEL_PREVIEW_COMPANIES,
  CHANNEL_PREVIEW_VIDEOS,
} from "@/data/pages/channel-previews"
import featuresBackground from "@/images/pages/home/features/bg.jpg"

import type { IChannelPageData } from "@/types/channel"
import Preview from "@/components/pages/home/features/preview"

function ChannelUseCase({ channel }: { channel: IChannelPageData }) {
  const clientFacingVideo =
    CHANNEL_PREVIEW_VIDEOS[channel.slug] ??
    CHANNEL_PREVIEW_VIDEOS[channel.cliSlug]
  const company =
    CHANNEL_PREVIEW_COMPANIES[channel.slug] ??
    CHANNEL_PREVIEW_COMPANIES[channel.cliSlug]

  return (
    <section className="safe-paddings mt-24">
      <div className="container mx-auto max-w-176 px-5 md:px-8 lg:px-0">
        <div className="flex flex-col gap-4">
          <h2 className="text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-white md:text-[2rem]">
            One agent, {channel.channelName}, resolved in the thread
          </h2>
          <p className="text-base leading-normal font-normal tracking-tighter text-gray-80">
            {channel.citation} {channel.useCase.summary}
          </p>
        </div>

        <div className="relative mt-8 aspect-10/11 overflow-hidden rounded-[0.625rem] border border-gray-20 sm:aspect-5/4 lg:aspect-[640/536]">
          <Preview
            backgroundImage={featuresBackground}
            channelLabel={channel.channelName}
            clientFacingVideo={clientFacingVideo}
            company={company}
            isActive
          />
        </div>
      </div>
    </section>
  )
}

export default ChannelUseCase
