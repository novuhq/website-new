import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import type { IChannelPageData } from "@/types/channel"
import { Button } from "@/components/ui/button"
import CliCommand from "@/components/pages/home/features/cli-command"

function ChannelHero({ channel }: { channel: IChannelPageData }) {
  return (
    <section className="relative pt-16 pb-10 md:pt-24 md:pb-14 lg:pt-36 xl:pt-45">
      <div className="container mx-auto flex max-w-208 flex-col items-center px-5 text-center md:px-8">
        <div className="flex items-center gap-3">
          <Image
            src={channel.icon}
            alt=""
            width={32}
            height={32}
            className="size-8"
            aria-hidden
            unoptimized
          />
          <span className="bg-[linear-gradient(238deg,#FFBA33_32%,#FF006A_71%,#FF4CE1_103%)] bg-clip-text text-sm font-medium tracking-tighter text-transparent uppercase">
            {channel.hero.eyebrow}
          </span>
        </div>
        <h1 className="mt-5 text-[1.75rem] leading-dense font-medium tracking-tighter text-white md:text-[2.25rem] lg:text-[2.75rem]">
          {channel.hero.heading}
        </h1>
        <p className="mt-4 max-w-176 text-base font-book tracking-tighter text-gray-8 md:text-lg">
          {channel.hero.subheading}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            variant="default"
            className="max-sm:h-10 max-sm:px-5 max-sm:text-xs max-2xs:w-full"
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
          />
        </div>
      </div>
    </section>
  )
}

export default ChannelHero
