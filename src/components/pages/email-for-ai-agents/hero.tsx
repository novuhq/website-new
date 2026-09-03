import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import type { IChannelPageData } from "@/types/channel"
import { Button } from "@/components/ui/button"

import ConnectCommand from "./connect-command"
import EmailThreadPreview from "./email-thread-preview"

function EmailAgentsHero({ channel }: { channel: IChannelPageData }) {
  return (
    <section className="pt-16 md:pt-20 lg:pt-22">
      <div className="container mx-auto grid max-w-304 grid-cols-1 items-center gap-12 px-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,38rem)] xl:px-0">
        <div className="flex flex-col items-start">
          <p className="flex items-center gap-3">
            <span className="size-2.5 shrink-0 bg-purple-3" aria-hidden />
            <span className="text-[0.8125rem] leading-none font-medium text-purple-1 uppercase">
              {channel.hero.eyebrow}
            </span>
          </p>
          <h1 className="mt-4.5 max-w-full text-[2.25rem] leading-[1.04] font-normal tracking-plus-tight text-balance text-white md:text-5xl xl:text-[4rem]">
            {channel.hero.heading}
          </h1>
          <p className="mt-8 max-w-129.5 text-base leading-normal font-normal tracking-tight text-gray-70 md:text-lg">
            {channel.hero.subheading}
          </p>
          <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 lg:mt-12">
            <Button
              size="none"
              variant="default"
              className="h-11 w-full shrink-0 rounded-md px-5 text-base leading-none font-medium tracking-tight normal-case sm:w-auto"
              asChild
            >
              <NextLink
                href={ROUTE.connect}
                data-click-location="email_agents_hero"
                data-click-text="novu_connect"
              >
                Novu Connect
              </NextLink>
            </Button>
            <ConnectCommand
              className="sm:flex-1"
              command={`npx novu connect --channel ${channel.cliSlug}`}
            />
          </div>
        </div>

        <EmailThreadPreview />
      </div>
    </section>
  )
}

export default EmailAgentsHero
