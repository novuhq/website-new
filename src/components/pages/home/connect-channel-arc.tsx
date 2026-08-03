"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import Image, { type StaticImageData } from "next/image"
import mascotIcon from "@/images/pages/home/novu-connect/mascot.svg"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"

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
  mascot: {
    key: "mascot",
    label: "Novu mascot",
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
  "mascot",
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
  "slack",
  "telegram",
  "mascot",
  "google-chat",
  "imessage",
  "whatsapp",
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
  id: string
  index: number
  onActivate: (tile: IActiveOrbitTile) => void
  onCopy: (tile: IActiveOrbitTile) => void
  onDeactivate: (id: string) => void
  orbit: IActiveOrbitTile["orbit"]
  radius: number
  startAngle: number
  tile: IOrbitTile
  total: number
}

interface IActiveOrbitTile extends IOrbitTile {
  id: string
  orbit: "inner" | "outer"
}

function OrbitTile({
  id,
  tile,
  index,
  onActivate,
  onCopy,
  onDeactivate,
  orbit,
  radius,
  startAngle,
  total,
}: IOrbitTileProps) {
  const isLive = Boolean(tile.command)
  const angle = startAngle + (360 / total) * index
  const radians = (angle * Math.PI) / 180
  const style = {
    left: `${(50 + Math.cos(radians) * radius).toFixed(4)}%`,
    top: `${(50 + Math.sin(radians) * radius).toFixed(4)}%`,
    "--mb-tile-rot": `${(angle + 90).toFixed(4)}deg`,
  } as CSSProperties

  if (tile.key === "mascot") {
    return (
      <div
        className="mb-arc-mascot rounded-full shadow-[0_0_28px_4px_rgba(0,14,49,0.10)]"
        style={style}
        aria-hidden
      >
        <Image
          className="size-full"
          src={mascotIcon}
          alt=""
          draggable={false}
          aria-hidden
        />
      </div>
    )
  }

  const activeTile = { ...tile, id, orbit }

  const handleClick = () => {
    if (tile.command) {
      onCopy(activeTile)
      return
    }

    goToChannel(tile.key)
  }

  const ariaLabel = isLive
    ? `Copy the CLI command for ${tile.label}`
    : `Get notified when ${tile.label} is live`

  return (
    <button
      type="button"
      className="mb-arc-tile group shadow-[0_14px_34px_rgba(0,0,0,.55)] hover:shadow-[0_6px_24px_rgba(0,8,49,.7)]"
      style={style}
      tabIndex={-1}
      onClick={handleClick}
      onPointerEnter={() => onActivate(activeTile)}
      onPointerLeave={() => onDeactivate(id)}
      onFocus={() => onActivate(activeTile)}
      onBlur={() => onDeactivate(id)}
      aria-label={ariaLabel}
    >
      <span
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] border-gradient bg-white/15 opacity-0 mix-blend-overlay transition-opacity duration-250 group-hover:opacity-100"
        aria-hidden
      />
      <ChannelIcon
        channel={tile.key}
        className={cn(
          "relative z-20 size-[52%] md:size-[52%]",
          tile.key === "email" && "!text-white"
        )}
        isActive
      />
    </button>
  )
}

interface IChannelOrbitProps {
  direction: "clockwise" | "counter-clockwise"
  position: "inner" | "outer"
  paused: boolean
  radius: number
  startAngle: number
  tiles: IOrbitTile[]
  onActivate: (tile: IActiveOrbitTile) => void
  onCopy: (tile: IActiveOrbitTile) => void
  onDeactivate: (id: string) => void
}

function ChannelOrbit({
  direction,
  position,
  paused,
  radius,
  startAngle,
  tiles,
  onActivate,
  onCopy,
  onDeactivate,
}: IChannelOrbitProps) {
  return (
    <div
      className={cn(
        "mb-channel-orbit",
        position === "inner"
          ? "mb-channel-orbit-inner"
          : "mb-channel-orbit-outer"
      )}
      data-paused={paused || undefined}
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
            id={`${position}-${tile.key}-${index}`}
            tile={tile}
            index={index}
            onActivate={onActivate}
            onCopy={onCopy}
            onDeactivate={onDeactivate}
            orbit={position}
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
  const { isCopied, handleCopy } = useCopyToClipboard(2400)
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [hoveredTile, setHoveredTile] = useState<IActiveOrbitTile | null>(null)
  const [copiedTile, setCopiedTile] = useState<IActiveOrbitTile | null>(null)
  const [copyPausedOrbit, setCopyPausedOrbit] = useState<
    IActiveOrbitTile["orbit"] | null
  >(null)
  const [resumedOrbit, setResumedOrbit] = useState<
    IActiveOrbitTile["orbit"] | null
  >(null)
  const copyPauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeTile = isCopied && copiedTile ? copiedTile : hoveredTile
  const pausedOrbit =
    copyPausedOrbit ??
    (hoveredTile?.orbit === resumedOrbit ? null : hoveredTile?.orbit)

  useEffect(
    () => () => {
      if (copyPauseTimeoutRef.current) {
        clearTimeout(copyPauseTimeoutRef.current)
      }
    },
    []
  )

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(
          Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.2)
        )
      },
      { threshold: [0, 0.5, 1] }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleTileActivate = (tile: IActiveOrbitTile) => {
    const isSameResumedTile =
      resumedOrbit === tile.orbit && hoveredTile?.id === tile.id

    setHoveredTile(tile)
    if (!isSameResumedTile) {
      setResumedOrbit(null)
    }
  }

  const handleTileCopy = (tile: IActiveOrbitTile) => {
    if (!tile.command) return

    if (copyPauseTimeoutRef.current) {
      clearTimeout(copyPauseTimeoutRef.current)
    }

    setCopiedTile(tile)
    setCopyPausedOrbit(tile.orbit)
    setResumedOrbit(null)
    handleCopy(tile.command)

    copyPauseTimeoutRef.current = setTimeout(() => {
      setCopyPausedOrbit(null)
      setResumedOrbit(tile.orbit)
      copyPauseTimeoutRef.current = null
    }, 1000)
  }

  const handleTileDeactivate = (id: string) => {
    if (hoveredTile?.id !== id) return

    setHoveredTile(null)
    setResumedOrbit(null)
  }

  const notice = isCopied
    ? "Command copied!"
    : activeTile?.command
      ? "Click to copy command"
      : activeTile
        ? "Notify me when it's live"
        : ""

  return (
    <div
      ref={containerRef}
      className="connect-channel-arc pointer-events-none absolute inset-0"
      data-in-view={isInView}
    >
      <div className={cn("absolute aspect-[1960/944]", className)}>
        <div className="mb-arc">
          {backgroundImage && (
            <Image
              className="pointer-events-none object-cover"
              src={backgroundImage}
              alt=""
              fill
              sizes={backgroundSizes}
              quality={100}
              aria-hidden="true"
            />
          )}

          <ChannelOrbit
            direction="clockwise"
            position="outer"
            paused={pausedOrbit === "outer"}
            radius={43.856}
            startAngle={-90}
            tiles={OUTER_ORBIT_TILES}
            onActivate={handleTileActivate}
            onCopy={handleTileCopy}
            onDeactivate={handleTileDeactivate}
          />
          <ChannelOrbit
            direction="counter-clockwise"
            position="inner"
            paused={pausedOrbit === "inner"}
            radius={41.818}
            startAngle={-94.42}
            tiles={INNER_ORBIT_TILES}
            onActivate={handleTileActivate}
            onCopy={handleTileCopy}
            onDeactivate={handleTileDeactivate}
          />
        </div>
      </div>

      <AnimatePresence>
        {activeTile && (
          <motion.div
            className="absolute bottom-3.5 left-1/2 isolate z-40 max-w-90 -translate-x-1/2 overflow-hidden rounded-md shadow-[0_0_14px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            role="status"
            aria-live="polite"
          >
            <span
              className="pointer-events-none absolute inset-0 -z-20 rounded-[inherit] bg-[linear-gradient(90deg,rgba(66,28,180,.50)_0%,rgba(27,37,138,.50)_100%)]"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] bg-black/20"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-gradient bg-[linear-gradient(90deg,rgba(171,92,255,0.7),rgba(105,46,255,0.7))]"
              aria-hidden
            />
            <div className="relative z-10 px-2.5 pt-[5px] pb-1.5 text-sm leading-[1.2] font-medium tracking-tighter whitespace-nowrap text-white">
              {notice}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ConnectChannelArc
