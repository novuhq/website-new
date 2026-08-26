import type { IChannelPageData } from "@/types/channel"
import { LIVE_CHANNEL_OPTIONS } from "@/components/pages/channels/channel-connect-stack"
import ConnectStack from "@/components/pages/home/connect-stack"

// The prompt generator for /email-for-ai-agents. It reuses the shared
// ConnectStack in its two-column form and only restates the section geometry
// and type scale the design calls for: a 1152 container, a 608 configurator
// right-aligned against it, and the copy top-aligned with "1. Choose your
// setup". The channel pages keep the single-column compact form.
function EmailAgentsConnectStack({ channel }: { channel: IChannelPageData }) {
  return (
    <ConnectStack
      className="mt-24 md:mt-32 lg:mt-55 xl:mt-55"
      containerClassName="max-w-288 lg:max-w-288 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,38rem)] xl:px-0"
      title={`Generate your ${channel.channelName} integration prompt`}
      titleClassName="md:text-[2rem] md:tracking-plus-tight lg:text-[2.5rem] xl:text-5xl"
      description={`Pick your AI framework and copy a ready-to-use prompt to connect your agent to ${channel.channelName} with Novu Connect.`}
      descriptionClassName="mt-7 text-base leading-normal tracking-tighter text-gray-70 md:text-lg md:leading-normal md:tracking-tighter"
      channels={LIVE_CHANNEL_OPTIONS}
      defaultChannelValue={channel.cliSlug}
    />
  )
}

export default EmailAgentsConnectStack
