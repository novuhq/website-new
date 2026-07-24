"use client"

import { useState, type CSSProperties } from "react"
import Image, { type StaticImageData } from "next/image"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  HOME_CHANNEL_SELECT_EVENT,
  HOME_FEATURES_SECTION_ID,
  type IHomeChannelSelectDetail,
} from "./channel-navigation"
import ChannelIcon from "./features/channel-icon"

interface IOrbitTile {
  command?: string
  key: string
  label: string
}

const CHANNEL_TILES = {
  telegram: {
    key: "telegram",
    label: "Telegram",
    command: "npx novu connect --channel telegram",
  },
  discord: {
    key: "discord",
    label: "Discord",
  },
  whatsapp: {
    key: "whatsapp",
    label: "WhatsApp",
    command: "npx novu connect --channel whatsapp",
  },
  teams: {
    key: "teams",
    label: "Microsoft Teams",
    command: "npx novu connect --channel teams",
  },
  imessage: {
    key: "imessage",
    label: "iMessage",
    command: "npx novu connect --channel sendblue",
  },
  "google-chat": {
    key: "google-chat",
    label: "Google Chat",
  },
  slack: {
    key: "slack",
    label: "Slack",
    command: "npx novu connect --channel slack",
  },
  email: {
    key: "email",
    label: "Email",
    command: "npx novu connect --channel email",
  },
  messenger: {
    key: "messenger",
    label: "FB Messenger",
  },
  github: {
    key: "github",
    label: "GitHub",
  },
  linear: {
    key: "linear",
    label: "Linear",
  },
  zoom: {
    key: "zoom",
    label: "Zoom",
  },
} satisfies Record<string, IOrbitTile>

type ChannelTileKey = keyof typeof CHANNEL_TILES

// Preserve the source artwork's density: 25 positions on the outer ring and
// 19 on the inner ring. Repeated channels are intentional.
const OUTER_ORBIT_KEYS: ChannelTileKey[] = [
  "slack",
  "email",
  "messenger",
  "github",
  "linear",
  "zoom",
  "imessage",
  "google-chat",
  "discord",
  "telegram",
  "whatsapp",
  "teams",
  "email",
  "slack",
  "github",
  "messenger",
  "zoom",
  "linear",
  "teams",
  "whatsapp",
  "telegram",
  "discord",
  "google-chat",
  "imessage",
  "slack",
]

const INNER_ORBIT_KEYS: ChannelTileKey[] = [
  "discord",
  "github",
  "linear",
  "zoom",
  "messenger",
  "email",
  "slack",
  "teams",
  "whatsapp",
  "telegram",
  "imessage",
  "google-chat",
  "github",
  "zoom",
  "email",
  "slack",
  "whatsapp",
  "teams",
  "messenger",
]

const OUTER_ORBIT_TILES = OUTER_ORBIT_KEYS.map((key) => CHANNEL_TILES[key])
const INNER_ORBIT_TILES = INNER_ORBIT_KEYS.map((key) => CHANNEL_TILES[key])

function goToChannel(key: string) {
  const detail: IHomeChannelSelectDetail = { key, focusNotify: true }
  window.dispatchEvent(
    new CustomEvent<IHomeChannelSelectDetail>(HOME_CHANNEL_SELECT_EVENT, {
      detail,
    })
  )

  const target = document.getElementById(HOME_FEATURES_SECTION_ID)
  if (!target) return

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches
  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  })
}

interface IOrbitTileProps {
  index: number
  radius: number
  startAngle: number
  tile: IOrbitTile
  total: number
}

function OrbitTile({
  tile,
  index,
  radius,
  startAngle,
  total,
}: IOrbitTileProps) {
  const { isCopied, handleCopy } = useCopyToClipboard(2400)
  const [open, setOpen] = useState(false)
  const isLive = Boolean(tile.command)
  const angle = startAngle + (360 / total) * index
  const radians = (angle * Math.PI) / 180
  const style = {
    left: `${50 + Math.cos(radians) * radius}%`,
    top: `${50 + Math.sin(radians) * radius}%`,
    "--mb-tile-rot": `${angle + 90}deg`,
  } as CSSProperties

  const handleClick = () => {
    if (tile.command) {
      handleCopy(tile.command)
      setOpen(true)
      return
    }

    goToChannel(tile.key)
  }

  const ariaLabel = isLive
    ? `Copy the CLI command for ${tile.label}`
    : `Get notified when ${tile.label} is live`

  return (
    <Tooltip open={open || isCopied} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="mb-arc-tile group"
          style={style}
          onClick={handleClick}
          aria-label={ariaLabel}
        >
          <ChannelIcon
            channel={tile.key}
            className={cn(
              "size-[52%] md:size-[52%]",
              tile.key === "email" && "!text-white"
            )}
            isActive
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        {isCopied ? (
          <span className="flex items-center gap-1.5 text-foreground">
            <Check className="size-3.5 shrink-0 text-[#3ac47d]" aria-hidden />
            Command copied. Paste it in your terminal.
          </span>
        ) : isLive ? (
          <code className="font-mono text-[13px] tracking-tight text-foreground">
            {tile.command}
          </code>
        ) : (
          `Notify me when ${tile.label} is live`
        )}
      </TooltipContent>
    </Tooltip>
  )
}

interface IChannelOrbitProps {
  direction: "clockwise" | "counter-clockwise"
  position: "inner" | "outer"
  radius: number
  startAngle: number
  tiles: IOrbitTile[]
}

function ChannelOrbit({
  direction,
  position,
  radius,
  startAngle,
  tiles,
}: IChannelOrbitProps) {
  return (
    <div
      className={cn(
        "mb-channel-orbit",
        position === "inner"
          ? "mb-channel-orbit-inner"
          : "mb-channel-orbit-outer"
      )}
    >
      <div
        className={cn(
          "mb-channel-orbit-rotator",
          direction === "counter-clockwise" &&
            "mb-channel-orbit-rotator-reverse"
        )}
      >
        {tiles.map((tile, index) => (
          <OrbitTile
            key={`${tile.key}-${index}`}
            tile={tile}
            index={index}
            radius={radius}
            startAngle={startAngle}
            total={tiles.length}
          />
        ))}
      </div>
    </div>
  )
}

export interface IConnectChannelArcProps {
  backgroundImage?: StaticImageData
  backgroundSizes?: string
  className?: string
}

function ConnectChannelArc({
  backgroundImage,
  backgroundSizes,
  className,
}: IConnectChannelArcProps) {
  return (
    <div className={cn("absolute aspect-[1960/944]", className)}>
      <div className="mb-arc">
        {backgroundImage && (
          <Image
            className="object-cover"
            src={backgroundImage}
            alt=""
            fill
            sizes={backgroundSizes}
            quality={100}
            aria-hidden
            draggable={false}
          />
        )}

        <ChannelOrbit
          direction="clockwise"
          position="outer"
          radius={43.856}
          startAngle={-90}
          tiles={OUTER_ORBIT_TILES}
        />
        <ChannelOrbit
          direction="counter-clockwise"
          position="inner"
          radius={41.818}
          startAngle={-94.42}
          tiles={INNER_ORBIT_TILES}
        />
      </div>
    </div>
  )
}

export default ConnectChannelArc
