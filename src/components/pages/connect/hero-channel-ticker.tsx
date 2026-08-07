import Image from "next/image"
import { preload } from "react-dom"

import { cn } from "@/lib/utils"

import { CONNECT_HERO_CHANNELS } from "./connect-channels-data"
import FocusBlurTextCycle, {
  type FocusBlurCycleItem,
} from "./focus-blur-text-cycle"

type HeroChannel = (typeof CONNECT_HERO_CHANNELS)[number]

function preloadChannelIcons() {
  for (const channel of CONNECT_HERO_CHANNELS) {
    preload(channel.icon.src, { as: "image", fetchPriority: "high" })
  }
}

function ChannelItem({ channel }: { channel: HeroChannel }) {
  return (
    <>
      <span className="flex size-[1em] shrink-0 items-center justify-center">
        <Image
          className={cn("size-full shrink-0", channel.iconClassName)}
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
  preloadChannelIcons()

  const items: FocusBlurCycleItem[] = CONNECT_HERO_CHANNELS.map((channel) => ({
    content: <ChannelItem channel={channel} />,
    key: channel.name,
  }))

  return (
    <FocusBlurTextCycle
      className={cn(
        "h-[1.125em] w-[6.4em] text-center lg:text-left",
        className
      )}
      fallbackText="any channel"
      itemClassName="flex items-center justify-center gap-2 lg:justify-start"
      items={items}
      reserveItemWidths={false}
      staticClassName="flex items-center justify-center lg:justify-start"
      tickerName="channel"
    />
  )
}

export { ConnectHeroChannelTicker }
