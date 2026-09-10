import Image from "next/image"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import {
  CHANNELS_GRID_BOOK_A_DEMO_LABEL,
  CHANNELS_GRID_CLI_COMMAND,
  CHANNELS_GRID_DESCRIPTION,
  CHANNELS_GRID_HEADING_DESKTOP_LINES,
  CHANNELS_GRID_HEADING_FULL,
  CHANNELS_GRID_HEADING_MOBILE_LINES,
  CHANNELS_GRID_TILES,
  CHANNELS_GRID_WEB_CHAT_TILE,
  type IChannelsGridTile,
  type ILinkedChannelsGridTile,
} from "@/data/pages/web-chat-channels"
import mascotTileImage from "@/images/pages/channels/web-chat/channels-grid-mascot.jpg"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CopyCommand } from "@/components/ui/copy-command"

/**
 * §5 "channels grid" (Figma `45487-81559` desktop, `45497-144406` mobile).
 * Not personalized — no `HueLayer`, no `--wc-accent*` custom properties.
 */

const TILE_CLASSES =
  "flex aspect-square w-full flex-col items-center gap-[11.6px] rounded-[12.9px] bg-gray-12 justify-center py-3 transition-colors duration-300 md:gap-[18px] md:rounded-[20px] xl:justify-start xl:pt-10.5 xl:pb-0"

function ChannelTileIcon({ icon }: { icon: IChannelsGridTile["icon"] }) {
  return (
    <Image
      alt=""
      aria-hidden
      unoptimized
      className="size-9 object-contain p-1 min-[360px]:size-11 min-[360px]:p-1.25 md:size-15 md:p-1.75 xl:size-17 xl:p-2"
      src={icon}
    />
  )
}

function ChannelTileLabel({ children }: { children: string }) {
  return (
    <span className="px-2 text-center text-[9px] leading-[1.13] tracking-[-0.02em] text-gray-60 md:text-sm">
      {children}
    </span>
  )
}

function ChannelTile({ href, icon, name }: ILinkedChannelsGridTile) {
  return (
    <NextLink
      className={cn(
        TILE_CLASSES,
        "outline-none hover:bg-gray-20 focus-visible:bg-gray-20 focus-visible:ring-2 focus-visible:ring-white/30"
      )}
      href={href}
      aria-label={`${name}: connect this channel to your agent`}
    >
      <ChannelTileIcon icon={icon} />
      <ChannelTileLabel>{name}</ChannelTileLabel>
    </NextLink>
  )
}

function ActiveWebChatTile({ icon, name }: IChannelsGridTile) {
  return (
    <div aria-current="page" className={TILE_CLASSES}>
      <ChannelTileIcon icon={icon} />
      <ChannelTileLabel>{name}</ChannelTileLabel>
    </div>
  )
}

function MascotTile() {
  return (
    <div
      aria-hidden
      className="relative isolate col-span-2 aspect-[328/160] overflow-hidden rounded-[12.9px] bg-[#0B0C0E] md:rounded-[20px]"
    >
      {/* This tile spans two fluid columns and shares the adjacent tile's height. */}
      <Image
        alt=""
        className="object-cover"
        fill
        unoptimized
        sizes="(min-width: 768px) 328px, 212px"
        src={mascotTileImage}
      />
    </div>
  )
}

function ChannelsGridTiles() {
  return (
    <div className="grid w-full max-w-full grid-cols-3 gap-[5.16px] md:max-w-124 md:gap-2 lg:min-w-0 lg:shrink lg:grow-0 lg:basis-124">
      {CHANNELS_GRID_TILES.map((tile) => (
        <ChannelTile key={tile.name} {...tile} />
      ))}
      <MascotTile />
      <ActiveWebChatTile {...CHANNELS_GRID_WEB_CHAT_TILE} />
    </div>
  )
}

function ChannelsGridHeading() {
  return (
    <h2 className="text-[32px] leading-[1.25] font-normal tracking-[-0.04em] text-white md:text-[48px] md:leading-[1.04] lg:text-[40px] xl:text-[48px]">
      <span aria-hidden className="md:hidden">
        {CHANNELS_GRID_HEADING_MOBILE_LINES.map((line, index) => (
          <span key={line}>
            {index > 0 && <br />}
            {line}
          </span>
        ))}
      </span>
      <span aria-hidden className="hidden md:inline">
        {CHANNELS_GRID_HEADING_DESKTOP_LINES.map((line, index) => (
          <span key={line}>
            {index > 0 && <br />}
            {line}
          </span>
        ))}
      </span>
      <span className="sr-only">{CHANNELS_GRID_HEADING_FULL}</span>
    </h2>
  )
}

function ChannelsGridActions() {
  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:flex-wrap sm:gap-3">
      <Button
        asChild
        className="w-full px-5 py-3.5 text-base leading-none font-medium tracking-[-0.025em] normal-case sm:w-fit"
        size="none"
        variant="default"
      >
        <NextLink href={ROUTE.bookADemoConnect}>
          {CHANNELS_GRID_BOOK_A_DEMO_LABEL}
        </NextLink>
      </Button>

      <CopyCommand
        className="w-full sm:w-58"
        command={CHANNELS_GRID_CLI_COMMAND}
        commandClassName="pointer-events-auto select-text text-base tracking-[-0.02em] text-white"
        controlClassName="h-11 border-gray-30 bg-black text-white"
      />
    </div>
  )
}

function ChannelsGrid() {
  return (
    <section>
      {/* Keep the narrower Figma row at desktop; stack and cap tablet content like home. */}
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 md:px-8 lg:max-w-288 lg:flex-row-reverse lg:items-center lg:gap-12">
        <div className="flex min-w-0 flex-col gap-10 md:gap-8 lg:shrink lg:grow lg:basis-136">
          <div className="flex flex-col gap-5 md:gap-[18px]">
            <ChannelsGridHeading />
            <p className="text-base leading-[1.5] tracking-[-0.025em] text-white/80 md:max-w-[483px] md:text-gray-70">
              {CHANNELS_GRID_DESCRIPTION}
            </p>
          </div>

          <ChannelsGridActions />
        </div>

        <ChannelsGridTiles />
      </div>
    </section>
  )
}

export { ChannelsGrid }
