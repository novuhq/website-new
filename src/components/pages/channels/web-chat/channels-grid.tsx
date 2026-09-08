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
import mascotTileImage from "@/images/pages/channels/web-chat/channels-grid-mascot.webp"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CopyCommand } from "@/components/ui/copy-command"

/**
 * §5 "channels grid" (Figma `45487-81559` desktop, `45497-144406` mobile).
 * Not personalized — no `HueLayer`, no `--wc-accent*` custom properties.
 */

const TILE_CLASSES =
  "flex size-[103.23px] flex-col items-center gap-[11.6px] rounded-[12.9px] bg-gray-12 pt-[27px] transition-colors duration-300 md:size-40 md:gap-[18px] md:rounded-[20px] md:pt-[42px]"

function ChannelTileIcon({ icon }: { icon: IChannelsGridTile["icon"] }) {
  return (
    <Image
      alt=""
      aria-hidden
      className="size-11 object-contain md:size-17"
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
      className="relative isolate col-span-2 h-[103.23px] overflow-hidden rounded-[12.9px] bg-[#0B0C0E] md:h-40 md:rounded-[20px]"
    >
      {/* The tile spans 2 of the grid's 3 columns: 2*103.23px + one 5.16px
          gap = 211.62px mobile; 2*160px (md:size-40) + one 8px gap = 328px
          desktop (md+). `fill`+`sizes` replaces the previous
          `absolute inset-0 size-full`, which carried no width hint and made
          next/image request its largest breakpoint (w=2048) for this
          ~328px tile. */}
      <Image
        alt=""
        className="object-cover"
        fill
        sizes="(min-width: 768px) 328px, 212px"
        src={mascotTileImage}
      />
    </div>
  )
}

function ChannelsGridTiles() {
  return (
    <div className="grid w-[320px] shrink-0 grid-cols-3 gap-[5.16px] md:w-[496px] md:gap-2">
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
    <h2 className="text-[32px] leading-[1.25] font-normal tracking-[-0.04em] text-white md:text-[48px] md:leading-[1.04]">
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
    <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-3">
      <Button
        asChild
        className="w-full px-5 py-3.5 text-base leading-none font-medium tracking-[-0.025em] normal-case md:w-fit"
        size="none"
        variant="default"
      >
        <NextLink href={ROUTE.bookADemoConnect}>
          {CHANNELS_GRID_BOOK_A_DEMO_LABEL}
        </NextLink>
      </Button>

      <CopyCommand
        className="w-full md:w-58"
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
      {/*
        `max-w-288` is 1152px = the 1088px Figma row (`45487-81559`: tiles
        496 + `gap-12` 48 + text column 544) plus `md:px-8` on both sides.
        This section is deliberately NARROWER than its neighbours' 1280px
        content column — Figma centres the row at x416, not at the shared
        x320 content edge — so it must not be normalised to `max-w-[1344px]`.
        A final-review pass did exactly that, on the assumption that every
        section shares one content edge; the Figma frame says otherwise. The
        1344px container also introduced 192px of slack, which needed a
        `md:justify-between` to hold the row's two ends in place. At 1152 the
        row fills the box exactly, so no justification is needed.

        `md:flex-row-reverse` visually flips the DOM order (text column
        first, tiles grid second) so the tiles grid renders on the LEFT and
        the text column on the right, matching Figma.
      */}
      <div className="container mx-auto flex max-w-288 flex-col gap-10 px-5 md:flex-row-reverse md:items-center md:gap-12 md:px-8">
        <div className="flex flex-col gap-10 md:w-[544px] md:shrink-0 md:gap-8">
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
