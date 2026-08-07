import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import type { IChannelFrameworkCombo } from "@/data/pages/channel-frameworks"
import {
  getConnectCommand,
  getCoverImagePath,
} from "@/data/pages/channel-frameworks"

import { Button } from "@/components/ui/button"
import CliCommand from "@/components/pages/home/features/cli-command"

function FrameworkHero({ combo }: { combo: IChannelFrameworkCombo }) {
  const { channel, framework } = combo

  return (
    <section className="relative pt-18">
      <div className="container mx-auto flex max-w-176 flex-col items-start px-5 md:px-8 lg:px-0">
        <div className="flex flex-col items-start gap-3.5">
          <span className="flex items-center gap-2 rounded-full border border-purple-3/40 bg-purple-3/30 px-2.5 py-1.25 text-sm leading-none font-normal tracking-tighter text-purple-1">
            <Image
              className="size-4 object-contain"
              src={framework.icon}
              alt=""
              width={16}
              height={16}
              aria-hidden
            />
            {framework.name} + {channel.channelName}
          </span>
          <h1 className="max-w-full text-[2.25rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-white md:text-5xl">
            Connect your {framework.name} agent to {channel.channelName}
          </h1>
        </div>
        <p className="mt-4 max-w-168.5 text-base leading-normal font-normal tracking-tighter text-gray-70 md:text-xl md:leading-normal">
          {framework.tagline} Novu Connect gives it a voice in{" "}
          {channel.channelName}, with a real two-way conversation and reliable
          delivery. Build the agent once, reach users where they already work.
        </p>
        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Button
            size="none"
            variant="default"
            className="h-11 w-full shrink-0 rounded-md px-5 text-base leading-none font-medium tracking-tight normal-case sm:w-fit"
            asChild
          >
            <NextLink
              href={ROUTE.connect}
              data-click-location="framework_hero"
              data-click-text="explore_connect"
            >
              Explore Novu Connect
            </NextLink>
          </Button>
          <CliCommand
            command={getConnectCommand(combo)}
            className="w-full rounded-md border-gray-30 bg-[#05050b] text-base tracking-normal text-gray-80 sm:w-auto sm:max-w-full"
          />
        </div>
        <div className="mt-9 w-full overflow-hidden rounded-2xl border border-gray-20 bg-[#05050b] md:mt-10">
          <Image
            src={getCoverImagePath(combo)}
            alt={`Connect your ${framework.name} agent to ${channel.channelName} with Novu Connect`}
            width={1200}
            height={630}
            className="w-full"
            quality={100}
            loading="eager"
          />
        </div>
      </div>
    </section>
  )
}

export default FrameworkHero
