import type { CSSProperties } from "react"
import Image, { type StaticImageData } from "next/image"
import emailLogo from "@/svgs/pages/connect/hero/email.svg"
import slackLogo from "@/svgs/pages/connect/hero/slack.svg"
import teamsLogo from "@/svgs/pages/connect/hero/teams.svg"
import telegramLogo from "@/svgs/pages/connect/hero/telegram.svg"
import whatsappLogo from "@/svgs/pages/connect/hero/whatsapp.svg"

import { cn } from "@/lib/utils"

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

function ConnectHeroChannelTicker({ className }: { className?: string }) {
  return (
    <span
      data-connect-hero-channel-ticker
      className={cn(
        "relative z-0 inline-block h-[1.125em] w-[6.4em] max-w-full text-center align-bottom lg:text-left",
        className
      )}
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
  )
}

function ConnectHeroChannelTickerStyles() {
  return <style>{CHANNEL_TICKER_KEYFRAMES}</style>
}

export { ConnectHeroChannelTicker, ConnectHeroChannelTickerStyles }
