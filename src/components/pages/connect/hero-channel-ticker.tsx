import type { CSSProperties } from "react"
import Image, { type StaticImageData } from "next/image"

import { cn } from "@/lib/utils"

import {
  CONNECT_CHANNELS,
  isConnectChannelAvailable,
} from "./connect-channels-data"

type HeroChannel = {
  name: string
  icon: StaticImageData
  iconClassName?: string
}

const HERO_CHANNELS: HeroChannel[] = CONNECT_CHANNELS.filter(
  isConnectChannelAvailable
).map((channel) => ({
  name: channel.heroName ?? channel.name,
  icon: channel.heroIcon ?? channel.icon,
  iconClassName: channel.heroIconClassName,
}))

const CHANNEL_ITEM_CLASS =
  "absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap opacity-0 will-change-[filter,opacity] [backface-visibility:hidden] [filter:blur(12px)] lg:justify-start"

const CHANNEL_STATIC_CLASS =
  "absolute inset-0 flex items-center justify-center whitespace-nowrap opacity-0 lg:justify-start"

const CHANNEL_ANIMATION_NAME = "connect-hero-channel-cycle"
const CHANNEL_ITEM_DURATION_SECONDS = 1.8
const CHANNEL_ANIMATION_DURATION_SECONDS =
  Math.max(HERO_CHANNELS.length, 1) * CHANNEL_ITEM_DURATION_SECONDS

const CHANNEL_ANIMATION_STYLE = {
  animationDuration: `${CHANNEL_ANIMATION_DURATION_SECONDS}s`,
  animationIterationCount: "infinite",
  animationTimingFunction: "linear",
} satisfies CSSProperties

function formatPercent(value: number) {
  return Number(value.toFixed(4))
}

function getChannelTickerKeyframes(channelCount: number) {
  if (channelCount <= 1) {
    return `
@keyframes ${CHANNEL_ANIMATION_NAME} {
  0%,
  100% {
    opacity: 1;
    filter: blur(0.001px);
    transform: translate3d(0, 0, 0);
  }
}
`
  }

  const slotPercent = 100 / channelCount
  const transitionPercent = Math.min(8, slotPercent * 0.4)
  const visibleStartPercent = formatPercent(transitionPercent)
  const visibleEndPercent = formatPercent(slotPercent)
  const fadeOutEndPercent = formatPercent(
    Math.min(slotPercent + transitionPercent, 100)
  )

  return `
@keyframes ${CHANNEL_ANIMATION_NAME} {
  0%,
  100% {
    opacity: 0;
    filter: blur(12px);
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  ${visibleStartPercent}%,
  ${visibleEndPercent}% {
    opacity: 1;
    filter: blur(0.001px);
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  ${fadeOutEndPercent}% {
    opacity: 0;
    filter: blur(12px);
    transform: translate3d(0, 0, 0);
  }
}
`
}

const CHANNEL_TICKER_KEYFRAMES = `${getChannelTickerKeyframes(
  HERO_CHANNELS.length
)}

@media (prefers-reduced-motion: reduce) {
  [data-connect-hero-channel-item] {
    animation: none !important;
    opacity: 0;
    filter: none;
  }

  [data-connect-hero-channel-static] {
    opacity: 1;
  }
}
`

function getChannelAnimationStyle(index: number): CSSProperties {
  return {
    ...CHANNEL_ANIMATION_STYLE,
    animationDelay: `${(index - 0.5) * CHANNEL_ITEM_DURATION_SECONDS}s`,
    animationName: CHANNEL_ANIMATION_NAME,
  }
}

function ChannelItem({ channel }: { channel: HeroChannel }) {
  return (
    <>
      <span className="flex size-[0.9em] shrink-0 items-center justify-center">
        <Image
          className={cn("shrink-0", channel.iconClassName ?? "size-full")}
          src={channel.icon}
          alt=""
          width={68}
          height={68}
          loading="eager"
          aria-hidden
        />
      </span>
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
      {HERO_CHANNELS.map((channel, index) => (
        <span
          data-connect-hero-channel-item={channel.name}
          className={CHANNEL_ITEM_CLASS}
          key={channel.name}
          style={getChannelAnimationStyle(index)}
        >
          <ChannelItem channel={channel} />
        </span>
      ))}
      <span data-connect-hero-channel-static className={CHANNEL_STATIC_CLASS}>
        any channel
      </span>
    </span>
  )
}

function ConnectHeroChannelTickerStyles() {
  return <style>{CHANNEL_TICKER_KEYFRAMES}</style>
}

export { ConnectHeroChannelTicker, ConnectHeroChannelTickerStyles }
