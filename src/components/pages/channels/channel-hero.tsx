import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import type { IChannelPageData } from "@/types/channel"
import { Button } from "@/components/ui/button"
import CliCommand from "@/components/pages/home/features/cli-command"

function ChannelHero({ channel }: { channel: IChannelPageData }) {
  return (
    <section className="relative pt-20 md:pt-24 lg:pt-32">
      <div className="container mx-auto flex max-w-176 flex-col items-start px-5 md:px-8 lg:px-0">
        <div className="flex flex-col items-start gap-3.5">
          <span className="rounded-full border border-purple-3/40 bg-purple-3/30 px-2.5 py-1.25 text-sm leading-none font-normal tracking-tighter text-purple-1">
            {channel.hero.eyebrow}
          </span>
          <h1 className="max-w-full text-[2.25rem] leading-[1.125] font-normal tracking-[-0.04em] text-balance text-white md:text-5xl">
            {channel.hero.heading}
          </h1>
        </div>
        <p className="mt-4 max-w-168.5 text-base leading-normal font-normal tracking-tighter text-gray-70 md:text-xl md:leading-normal">
          {channel.hero.subheading}
        </p>
        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Button
            size="none"
            variant="default"
            className="h-11 shrink-0 rounded-md px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case"
            asChild
          >
            <NextLink
              href={ROUTE.connect}
              data-click-location="channel_hero"
              data-click-text="explore_connect"
            >
              Explore Novu Connect
            </NextLink>
          </Button>
          <CliCommand
            command={`npx novu connect --channel ${channel.cliSlug}`}
            className="w-full rounded-md border-[#25262c] bg-[#05050b] text-base tracking-normal text-gray-80 sm:w-97.5"
          />
        </div>
      </div>
    </section>
  )
}

export default ChannelHero
