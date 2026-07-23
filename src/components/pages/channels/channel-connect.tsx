import { Check } from "lucide-react"

import type { IChannelPageData } from "@/types/channel"
import CliCommand from "@/components/pages/home/features/cli-command"

function ChannelConnect({ channel }: { channel: IChannelPageData }) {
  return (
    <section className="safe-paddings py-14 md:py-20">
      <div className="container mx-auto grid max-w-320 gap-10 px-5 md:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-[28px] leading-dense font-medium tracking-tighter text-white md:text-[32px]">
            What your agent can do in {channel.channelName}
          </h2>
          <ul className="mt-6 space-y-3.5">
            {channel.capabilities.map((capability) => (
              <li
                key={capability}
                className="flex items-start gap-3 text-base tracking-tighter text-gray-8"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-3.5" aria-hidden />
                </span>
                {capability}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium tracking-tighter text-gray-50 uppercase">
            Connect it in one command
          </h3>
          <CliCommand
            command={`npx novu connect --channel ${channel.cliSlug}`}
          />
          <p className="text-sm leading-relaxed tracking-tighter text-gray-8">
            {channel.onRamp.note}
          </p>
        </div>
      </div>
    </section>
  )
}

export default ChannelConnect
