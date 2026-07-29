import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import type { IChannelFrameworkCombo } from "@/data/pages/channel-frameworks"
import { getSiblingChannels } from "@/data/pages/channel-frameworks"

import { Button } from "@/components/ui/button"
import ChannelIcon from "@/components/pages/home/features/channel-icon"

function FrameworkChannelChooser({ combo }: { combo: IChannelFrameworkCombo }) {
  const { framework } = combo
  const siblings = getSiblingChannels(combo)

  return (
    <section className="safe-paddings mt-18">
      <div className="container mx-auto max-w-176 px-5 md:px-8 lg:px-0">
        <div className="flex flex-col gap-3">
          <h2 className="text-[1.75rem] leading-[1.125] font-normal tracking-[-0.04em] text-white md:text-[2rem]">
            Connect your {framework.name} agent to another channel
          </h2>
          <p className="max-w-160 text-base leading-normal font-normal tracking-tighter text-gray-70">
            Same agent, built once. Pick where it talks next, and it holds one
            conversation across every channel.
          </p>
        </div>

        {siblings.length > 0 && (
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {siblings.map((channel) => (
              <li key={channel.slug}>
                <NextLink
                  href={`/channels/${channel.slug}/${framework.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-gray-20 bg-[#05050b] px-4 py-6 transition-colors hover:border-purple-3/50 focus-visible:border-purple-3/50 focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:outline-none"
                  data-click-location={`framework_${framework.slug}_channel_chooser`}
                  data-click-text={`connect_${channel.cliSlug}`}
                >
                  <span className="flex size-12 items-center justify-center rounded-lg border border-gray-20 bg-black transition-colors group-hover:border-gray-40">
                    <ChannelIcon channel={channel.cliSlug} />
                  </span>
                  <span className="text-center text-sm leading-tight font-medium tracking-tighter text-gray-80 transition-colors group-hover:text-white">
                    {channel.channelName}
                  </span>
                </NextLink>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Button
            size="none"
            variant="default"
            className="h-11 shrink-0 rounded-md px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case"
            asChild
          >
            <NextLink
              href={ROUTE.connect}
              data-click-location={`framework_${framework.slug}_channel_chooser`}
              data-click-text="explore_connect"
            >
              Explore Novu Connect
            </NextLink>
          </Button>
          <Button
            size="none"
            variant="outline"
            className="h-11 shrink-0 rounded-md px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case"
            asChild
          >
            <NextLink
              href={ROUTE.bookADemoConnect}
              data-click-location={`framework_${framework.slug}_channel_chooser`}
              data-click-text="book_a_demo"
            >
              Book a Demo
            </NextLink>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FrameworkChannelChooser
