import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { Button } from "@/components/ui/button"

import ConnectHeroVideo from "./hero-video"

function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-30 pb-20 md:pt-36 md:pb-26 lg:pt-44 lg:pb-34">
      <div className="relative mx-auto w-full max-w-304 px-5 md:px-8 2xl:px-0">
        <div className="flex w-full max-w-154.5 flex-col items-start gap-4">
          <div className="flex w-full flex-col items-start gap-8">
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-2">
                <span className="size-1.5 bg-lagune-3" />
                <span className="text-sm leading-none overflow-visible font-normal tracking-normal text-lagune-1 uppercase">
                  Built for AI agents
                </span>
              </div>

              <div className="flex w-full flex-col items-start gap-4">
                <h1 className="w-full text-4xl leading-dense font-medium tracking-tighter text-foreground md:text-5xl lg:text-[3.25rem]">
                  Connect Claude Managed Agents to any channel
                </h1>

                <p className="max-w-[523.4609375px] text-base leading-normal font-normal tracking-tighter text-pretty text-gray-8 md:text-lg">
                  Novu brings Anthropic&apos;s Claude managed agents
                  infrastructure into Slack, Teams, Discord, WhatsApp, email,
                  and more — with powerful reasoning, tool use, and MCP support.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center lg:gap-7">
              <Button
                variant="default"
                size="lg"
                className="w-full px-5 sm:w-auto"
                asChild
              >
                <NextLink
                  href={ROUTE.dashboardV2SignUp}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-click-location="connect_hero"
                  data-click-text="connect_an_agent_for_free"
                >
                  Connect an agent for free
                </NextLink>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full overflow-visible sm:w-auto"
                asChild
              >
                <NextLink
                  href="#connect-demo"
                  data-click-location="connect_hero"
                  data-click-text="watch_the_30_second_demo"
                >
                  Watch the 30-second demo
                </NextLink>
              </Button>
            </div>
          </div>

          <p className="text-[0.9375rem] leading-normal font-normal tracking-tighter text-gray-5">
            No credit card required
          </p>
        </div>

        <ConnectHeroVideo />
      </div>
    </section>
  )
}

export default Hero
