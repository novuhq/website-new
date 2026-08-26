import {
  CHANNEL_PREVIEW_COMPANIES,
  CHANNEL_PREVIEW_VIDEOS,
} from "@/data/pages/channel-previews"
import { EMAIL_AGENTS_USE_CASE } from "@/data/pages/email-for-ai-agents"
import featuresBackground from "@/images/pages/home/features/bg.jpg"

import type { IChannelPageData } from "@/types/channel"
import Preview from "@/components/pages/home/features/preview"

import ConnectCommand from "./connect-command"

// The use-case section for /email-for-ai-agents: the email-client animation on
// one side, the pitch and the connect command on the other. A route-local
// section rather than a variant of the shared ChannelUseCase, which the channel
// pages still render in its single-column form.
function EmailAgentsUseCase({ channel }: { channel: IChannelPageData }) {
  const clientFacingVideo =
    CHANNEL_PREVIEW_VIDEOS[channel.slug] ??
    CHANNEL_PREVIEW_VIDEOS[channel.cliSlug]
  const company =
    CHANNEL_PREVIEW_COMPANIES[channel.slug] ??
    CHANNEL_PREVIEW_COMPANIES[channel.cliSlug]

  return (
    <section className="mt-24 md:mt-32 lg:mt-50">
      <div className="container mx-auto grid max-w-304 grid-cols-1 items-center gap-12 px-5 md:px-8 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[minmax(0,38rem)_minmax(0,1fr)] xl:px-0">
        <div className="flex flex-col items-start gap-8 lg:order-2 lg:gap-11">
          <div className="flex flex-col gap-4 lg:gap-7">
            <h2 className="text-[1.75rem] leading-[1.125] font-normal tracking-plus-tight text-balance text-white md:text-[2rem] lg:text-[2.25rem] xl:text-5xl">
              {EMAIL_AGENTS_USE_CASE.title}
            </h2>
            <p className="text-base leading-normal font-normal tracking-tight text-gray-70 md:text-lg">
              {EMAIL_AGENTS_USE_CASE.description}
            </p>
          </div>
          <ConnectCommand
            className="w-full sm:w-95.5"
            command={`npx novu connect --channel ${channel.cliSlug}`}
          />
        </div>

        <div className="relative aspect-10/11 w-full overflow-clip rounded-2xl border border-gray-20 sm:aspect-5/4 lg:order-1 lg:aspect-[608/532]">
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

export default EmailAgentsUseCase
