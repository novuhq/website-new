import featuresBackground from "@/images/pages/home/features/bg.jpg"
import clientFacingPreview from "@/images/pages/home/features/client-facing.png"

import type { IChannelPageData, IChannelTranscriptLine } from "@/types/channel"
import { cn } from "@/lib/utils"
import Preview from "@/components/pages/home/features/preview"

function TranscriptLine({ line }: { line: IChannelTranscriptLine }) {
  if (line.role === "system") {
    return (
      <div className="rounded-[0.625rem] border border-gray-20 bg-black px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-gray-60">
        <span className="mb-1 block text-gray-50">Tool approval</span>
        {line.text}
      </div>
    )
  }

  const isAgent = line.role === "agent"

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        isAgent ? "items-start" : "items-end"
      )}
    >
      <span className="px-1 text-xs font-medium tracking-tighter text-gray-50">
        {line.from}
      </span>
      <p
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed tracking-tighter",
          isAgent
            ? "rounded-tl-sm bg-gray-3 text-white"
            : "rounded-tr-sm bg-[linear-gradient(238deg,#FFBA33_-10%,#FF006A_60%,#FF4CE1_120%)] text-white"
        )}
      >
        {line.text}
      </p>
    </div>
  )
}

function ChannelUseCase({ channel }: { channel: IChannelPageData }) {
  const clientFacingVideo = {
    webm: `/videos/channels/${channel.cliSlug}-client-facing.webm`,
    mp4: `/videos/channels/${channel.cliSlug}-client-facing.hevc.mp4`,
    poster: `/videos/channels/${channel.cliSlug}-client-facing-poster.png`,
  }

  return (
    <section className="safe-paddings py-14 md:py-20">
      <div className="container mx-auto max-w-320 px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="rounded-xl border-l-2 border-primary bg-gray-2/40 px-5 py-4 text-base leading-relaxed tracking-tighter text-gray-90">
              {channel.citation}
            </p>
            <h2 className="mt-8 text-[28px] leading-dense font-medium tracking-tighter text-white md:text-[32px]">
              One agent, {channel.channelName}, resolved in the thread
            </h2>
            <p className="mt-3 text-base font-book tracking-tighter text-gray-8">
              {channel.useCase.summary}
            </p>
            <dl className="mt-6 space-y-2 text-sm tracking-tighter text-gray-8">
              <div className="flex gap-2">
                <dt className="text-gray-50">Agent:</dt>
                <dd>{channel.useCase.company}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-gray-50">Talking to:</dt>
                <dd>{channel.useCase.audience}</dd>
              </div>
            </dl>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl border border-gray-3">
            <Preview
              backgroundImage={featuresBackground}
              clientFacingImage={clientFacingPreview}
              clientFacingVideo={clientFacingVideo}
              channelLabel={channel.channelName}
            />
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-208">
          <h3 className="text-sm font-medium tracking-tighter text-gray-50 uppercase">
            The conversation
          </h3>
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-gray-3 bg-gray-1/50 p-5 md:p-7">
            {channel.useCase.transcript.map((line, index) => (
              <TranscriptLine key={index} line={line} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChannelUseCase
