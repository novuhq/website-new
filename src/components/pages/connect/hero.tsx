import type { CSSProperties } from "react"
import Image, { type StaticImageData } from "next/image"
import emailLogo from "@/svgs/pages/connect/hero/email.svg"
import slackLogo from "@/svgs/pages/connect/hero/slack.svg"
import teamsLogo from "@/svgs/pages/connect/hero/teams.svg"
import telegramLogo from "@/svgs/pages/connect/hero/telegram.svg"
import whatsappLogo from "@/svgs/pages/connect/hero/whatsapp.svg"

import ProductHuntBadge from "@/components/ui/product-hunt-badge"

import ConnectHeroActions from "./hero-actions"
import ConnectHeroVideo from "./hero-video"
import ConnectPromptCopyLine from "./prompt-copy-line"

type HeroChannel = {
  name: string
  icon: StaticImageData
}

const HERO_CHANNELS: HeroChannel[] = [
  { name: "Slack", icon: slackLogo },
  { name: "WhatsApp", icon: whatsappLogo },
  { name: "MS Teams", icon: teamsLogo },
  { name: "Telegram", icon: telegramLogo },
  { name: "Email", icon: emailLogo },
]

const HERO_CHANNELS_LOOP = [...HERO_CHANNELS, HERO_CHANNELS[0]]

const CHANNEL_TICKER_STYLE = {
  "--connect-hero-channel-row-height": "1.45em",
  height: "1lh",
} as CSSProperties

const CHANNEL_TICKER_KEYFRAMES = `
@keyframes connect-hero-channel-scroll {
  0%,
  10% {
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.25);
  }

  15% {
    transform: translate3d(0, calc(var(--connect-hero-channel-row-height) * -1.06), 0);
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  18%,
  30% {
    transform: translate3d(0, calc(var(--connect-hero-channel-row-height) * -1), 0);
    animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.25);
  }

  35% {
    transform: translate3d(0, calc(var(--connect-hero-channel-row-height) * -2.06), 0);
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  38%,
  50% {
    transform: translate3d(0, calc(var(--connect-hero-channel-row-height) * -2), 0);
    animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.25);
  }

  55% {
    transform: translate3d(0, calc(var(--connect-hero-channel-row-height) * -3.06), 0);
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  58%,
  70% {
    transform: translate3d(0, calc(var(--connect-hero-channel-row-height) * -3), 0);
    animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.25);
  }

  75% {
    transform: translate3d(0, calc(var(--connect-hero-channel-row-height) * -4.06), 0);
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  78%,
  90% {
    transform: translate3d(0, calc(var(--connect-hero-channel-row-height) * -4), 0);
    animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.25);
  }

  95% {
    transform: translate3d(0, calc(var(--connect-hero-channel-row-height) * -5.06), 0);
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  100% {
    transform: translate3d(0, calc(var(--connect-hero-channel-row-height) * -5), 0);
  }
}
`

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
                  className="relative isolate w-full text-4xl leading-dense font-medium tracking-tighter text-foreground md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem]"
                  aria-label="Connect your agent to Slack, WhatsApp, MS Teams, Telegram, and Email"
                >
                  <span className="relative z-10 block">Connect your</span>
                  <span className="flex flex-col items-center justify-center gap-y-0 lg:flex-row lg:justify-start lg:gap-x-2">
                    <span className="relative z-10 shrink-0">agent to</span>
                    <span
                      data-connect-hero-channel-ticker
                      className="relative z-0 inline-block h-[1.125em] w-[6.4em] max-w-full text-center align-bottom lg:text-left"
                      style={CHANNEL_TICKER_STYLE}
                      aria-hidden
                    >
                      <span className="absolute inset-x-0 top-1/2 h-[var(--connect-hero-channel-row-height)] -translate-y-1/2 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_88%,transparent_100%)] [mask-size:100%_100%] [mask-repeat:no-repeat] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_88%,transparent_100%)] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_100%]">
                        <span
                          data-connect-hero-channel-track
                          className="block will-change-transform motion-safe:animate-[connect-hero-channel-scroll_9s_linear_infinite] motion-reduce:will-change-auto"
                        >
                          {HERO_CHANNELS_LOOP.map((channel, index) => (
                            <span
                              data-connect-hero-channel-item
                              className="flex h-[var(--connect-hero-channel-row-height)] items-center justify-center gap-2 whitespace-nowrap lg:justify-start"
                              key={`${channel.name}-${index}`}
                            >
                              <Image
                                className="size-[0.9em] shrink-0"
                                src={channel.icon}
                                alt=""
                                width={68}
                                height={68}
                                loading="eager"
                                aria-hidden
                              />
                              <span>{channel.name}</span>
                            </span>
                          ))}
                        </span>
                      </span>
                    </span>
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
      <style>{CHANNEL_TICKER_KEYFRAMES}</style>
    </section>
  )
}

export default Hero
