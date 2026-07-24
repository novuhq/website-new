import type { IChannelPageData } from "@/types/channel"
import CliCommand from "@/components/pages/home/features/cli-command"

function ChannelConnect({ channel }: { channel: IChannelPageData }) {
  return (
    <section className="safe-paddings mt-18">
      <div className="container mx-auto max-w-176 px-5 md:px-8 lg:px-0">
        <div className="flex flex-col gap-4">
          <h2 className="text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-white md:text-[2rem]">
            What your agent can do in {channel.channelName}
          </h2>
          <p className="text-base leading-normal font-normal tracking-tighter text-gray-80">
            {channel.onRamp.note}
          </p>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-4">
          {channel.capabilities.map((capability) => (
            <li
              key={capability}
              className="flex items-start gap-2 text-base leading-normal font-normal tracking-tighter text-gray-80"
            >
              <span
                className="mt-2.25 size-1.5 shrink-0 rounded-xs bg-purple-3"
                aria-hidden
              />
              {capability}
            </li>
          ))}
        </ul>

        <CliCommand
          command={`npx novu connect --channel ${channel.cliSlug}`}
          className="mt-8 w-full rounded-md border-[#25262c] bg-[#05050b] text-base tracking-normal text-gray-80 sm:w-97.5"
        />
      </div>
    </section>
  )
}

export default ChannelConnect
