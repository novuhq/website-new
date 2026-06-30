import ProductHuntBadge from "@/components/ui/product-hunt-badge"

import ConnectHeroActions from "./hero-actions"
import {
  ConnectHeroChannelTicker,
  ConnectHeroChannelTickerStyles,
} from "./hero-channel-ticker"
import ConnectHeroVideo from "./hero-video"
import ConnectPromptCopyLine from "./prompt-copy-line"

function Hero() {
  return (
    <section
      id="connect"
      className="relative isolate scroll-mt-25 overflow-hidden pt-12 pb-20 md:pt-24 md:pb-26 lg:pt-33 lg:pb-34"
    >
      <div className="relative mx-auto w-full max-w-304 px-5 md:px-8 2xl:px-0">
        <div className="relative z-10 mx-auto flex w-full max-w-154.5 flex-col items-center gap-4 text-center lg:mx-0 lg:max-w-128 lg:items-start lg:text-left xl:max-w-140">
          <div className="flex w-full flex-col items-center gap-8 lg:items-start">
            <div className="flex flex-col items-center gap-5 lg:items-start">
              <div className="flex items-center gap-2">
                <span className="size-1.5 bg-lagune-3" />
                <span className="overflow-visible text-sm leading-none font-normal tracking-normal text-lagune-1 uppercase">
                  Novu connect
                </span>
              </div>

              <div className="flex w-full flex-col items-center gap-4 lg:items-start">
                <h1
                  className="relative isolate w-full text-[2.5rem] leading-dense font-medium tracking-tighter text-foreground min-[390px]:text-[2.75rem] md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem]"
                  aria-label="Connect your agent to Slack, WhatsApp, MS Teams, Telegram, and Email"
                >
                  <span className="relative z-10 block">Connect your</span>
                  <span className="flex flex-col items-center justify-center gap-y-0 lg:flex-row lg:justify-start lg:gap-x-2">
                    <span className="relative z-10 shrink-0">agent to</span>
                    <ConnectHeroChannelTicker />
                  </span>
                </h1>

                <p className="max-w-[523.4609375px] text-base leading-normal font-normal tracking-tighter text-pretty text-gray-8 md:text-lg">
                  Novu Connect plugs any Claude Managed Agent into Slack, Teams,
                  WhatsApp, email, and more. Two minutes from template to live
                  agent. No infrastructure to babysit.
                </p>
              </div>
            </div>

            <ConnectHeroActions />
          </div>

          <ConnectPromptCopyLine />
          <ProductHuntBadge
            className="mt-6 lg:mt-11"
            linkProps={{
              "data-click-location": "connect_hero",
              "data-click-text": "product_hunt",
            }}
          />
        </div>

        <ConnectHeroVideo />
      </div>
      <ConnectHeroChannelTickerStyles />
    </section>
  )
}

export default Hero
