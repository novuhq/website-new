import Image from "next/image"
import featuresBackground from "@/images/pages/home/features/bg.jpg"

import type { IChannelPageData } from "@/types/channel"

function ChannelUseCase({ channel }: { channel: IChannelPageData }) {
  const clientFacingVideo = {
    webm: `/videos/channels/${channel.cliSlug}-client-facing.webm`,
    mp4: `/videos/channels/${channel.cliSlug}-client-facing.hevc.mp4`,
    poster: `/videos/channels/${channel.cliSlug}-client-facing-poster.png`,
  }

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

        <div className="relative mt-8 aspect-703/432 overflow-hidden rounded-[0.625rem] border border-gray-20">
          <Image
            className="object-cover"
            src={featuresBackground}
            alt=""
            fill
            sizes="(min-width: 768px) 704px, calc(100vw - 40px)"
            quality={100}
            loading="eager"
            aria-hidden
          />
          <video
            className="absolute top-1/2 left-1/2 h-[87%] w-[72.5%] -translate-1/2 rounded-[0.9375rem] object-contain"
            poster={clientFacingVideo.poster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={`${channel.channelName} client-facing preview`}
          >
            <source src={clientFacingVideo.webm} type="video/webm" />
            <source
              src={clientFacingVideo.mp4}
              type='video/mp4; codecs="hvc1"'
            />
          </video>
        </div>
      </div>
    </section>
  )
}

export default ChannelUseCase
