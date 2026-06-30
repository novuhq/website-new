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
  animationName: string
}

const HERO_CHANNELS: HeroChannel[] = [
  {
    name: "Slack",
    icon: slackLogo,
    animationName: "connect-hero-channel-slack",
  },
  {
    name: "WhatsApp",
    icon: whatsappLogo,
    animationName: "connect-hero-channel-whatsapp",
  },
  {
    name: "MS Teams",
    icon: teamsLogo,
    animationName: "connect-hero-channel-teams",
  },
  {
    name: "Telegram",
    icon: telegramLogo,
    animationName: "connect-hero-channel-telegram",
  },
  {
    name: "Email",
    icon: emailLogo,
    animationName: "connect-hero-channel-email",
  },
]

const CHANNEL_ITEM_CLASS =
  "absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap opacity-0 will-change-[filter,opacity] [backface-visibility:hidden] [filter:blur(12px)] lg:justify-start"

const CHANNEL_ANIMATION_STYLE = {
  animationDuration: "9s",
  animationIterationCount: "infinite",
  animationTimingFunction: "linear",
} satisfies CSSProperties

const CHANNEL_TICKER_KEYFRAMES = `
@keyframes connect-hero-channel-slack {
  0%,
  10% {
    opacity: 1;
    filter: blur(0.001px);
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  18%,
  90% {
    opacity: 0;
    filter: blur(12px);
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  100% {
    opacity: 1;
    filter: blur(0.001px);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes connect-hero-channel-whatsapp {
  0%,
  10% {
    opacity: 0;
    filter: blur(12px);
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  18%,
  30% {
    opacity: 1;
    filter: blur(0.001px);
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  38%,
  100% {
    opacity: 0;
    filter: blur(12px);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes connect-hero-channel-teams {
  0%,
  30% {
    opacity: 0;
    filter: blur(12px);
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  38%,
  50% {
    opacity: 1;
    filter: blur(0.001px);
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  58%,
  100% {
    opacity: 0;
    filter: blur(12px);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes connect-hero-channel-telegram {
  0%,
  50% {
    opacity: 0;
    filter: blur(12px);
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  58%,
  70% {
    opacity: 1;
    filter: blur(0.001px);
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  78%,
  100% {
    opacity: 0;
    filter: blur(12px);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes connect-hero-channel-email {
  0%,
  70% {
    opacity: 0;
    filter: blur(12px);
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  78%,
  90% {
    opacity: 1;
    filter: blur(0.001px);
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  100% {
    opacity: 0;
    filter: blur(12px);
    transform: translate3d(0, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-connect-hero-channel-item] {
    animation: none !important;
    opacity: 0;
    filter: none;
  }

  [data-connect-hero-channel-item="Slack"] {
    opacity: 1;
  }
}
`

function ChannelItem({ channel }: { channel: HeroChannel }) {
  return (
    <>
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
    </>
  )
}

function ConnectHeroChannelTicker({ className }: { className?: string }) {
  return (
    <span
      data-connect-hero-channel-ticker
      className={cn(
        "relative z-0 inline-block h-[1.125em] w-[6.4em] max-w-full text-center align-bottom lg:text-left",
        className
      )}
      aria-hidden
    >
      {HERO_CHANNELS.map((channel) => (
        <span
          data-connect-hero-channel-item={channel.name}
          className={CHANNEL_ITEM_CLASS}
          key={channel.name}
          style={{
            ...CHANNEL_ANIMATION_STYLE,
            animationName: channel.animationName,
          }}
        >
          <ChannelItem channel={channel} />
        </span>
      ))}
    </span>
  )
}

function ConnectHeroChannelTickerStyles() {
  return <style>{CHANNEL_TICKER_KEYFRAMES}</style>
}

export { ConnectHeroChannelTicker, ConnectHeroChannelTickerStyles }
