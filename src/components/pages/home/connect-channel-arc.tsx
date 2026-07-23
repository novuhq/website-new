"use client"

import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react"
import Image from "next/image"
import novuLogomark from "@/images/pages/mcp/icons/novu-gradient-logo.svg"
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

// A vector rebuild of customer-facing.jpg: each tile keeps a position (percent
// of the image box), size, and slight rotation. Live channels carry a `command`
// (copied to the clipboard on click); the rest are upcoming (click jumps to the
// channel section to get notified). The Novu mark is the center focal tile.
// Every tile can be dragged around.
interface IArcTile {
  key: string
  label: string
  command?: string
  x: number
  y: number
  w: number
  rot: number
  z: number
}

const ARC_TILES: IArcTile[] = [
  {
    key: "telegram",
    label: "Telegram",
    command: "npx novu connect --channel telegram",
    x: 28.5,
    y: 61,
    w: 10.5,
    rot: -6,
    z: 2,
  },
  { key: "discord", label: "Discord", x: 70, y: 97, w: 10.5, rot: -2, z: 2 },
  {
    key: "slack",
    label: "Slack",
    command: "npx novu connect --channel slack",
    x: 55.5,
    y: 47,
    w: 12,
    rot: 0,
    z: 5,
  },
  {
    key: "email",
    label: "Email",
    command: "npx novu connect --channel email",
    x: 70,
    y: 50,
    w: 11,
    rot: 3,
    z: 3,
  },
  {
    key: "messenger",
    label: "FB Messenger",
    x: 84,
    y: 61,
    w: 10.5,
    rot: 7,
    z: 2,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    command: "npx novu connect --channel whatsapp",
    x: 42,
    y: 80,
    w: 11,
    rot: -3,
    z: 3,
  },
  {
    key: "teams",
    label: "Microsoft Teams",
    command: "npx novu connect --channel teams",
    x: 70,
    y: 80,
    w: 11,
    rot: 2,
    z: 3,
  },
  { key: "github", label: "GitHub", x: 16.5, y: 79, w: 10.5, rot: -9, z: 3 },
  { key: "novu", label: "Novu", x: 55.5, y: 79, w: 12.5, rot: 0, z: 6 },
  { key: "zoom", label: "Zoom", x: 28.5, y: 96, w: 10.5, rot: -4, z: 2 },
  {
    key: "google-chat",
    label: "Google Chat",
    x: 85.5,
    y: 80,
    w: 10.5,
    rot: 8,
    z: 2,
  },
  {
    key: "imessage",
    label: "iMessage",
    command: "npx novu connect --channel sendblue",
    x: 42,
    y: 51,
    w: 10.5,
    rot: 4,
    z: 2,
  },
]

const DRAG_THRESHOLD = 4

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

interface IArcTileProps {
  tile: IArcTile
  index: number
}

function ArcTile({ tile, index }: IArcTileProps) {
  const { isCopied, handleCopy } = useCopyToClipboard(2400)
  const [open, setOpen] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  const dragState = useRef<{
    startX: number
    startY: number
    baseX: number
    baseY: number
    moved: boolean
  } | null>(null)
  const draggedRef = useRef(false)

  const isNovu = tile.key === "novu"
  const isLive = Boolean(tile.command)
  const isUpcoming = !isLive && !isNovu

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      baseX: offset.x,
      baseY: offset.y,
      moved: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const state = dragState.current
    if (!state) return

    const dx = event.clientX - state.startX
    const dy = event.clientY - state.startY

    if (!state.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      state.moved = true
      setDragging(true)
    }
    if (state.moved) {
      setOffset({ x: state.baseX + dx, y: state.baseY + dy })
    }
  }

  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const state = dragState.current
    dragState.current = null
    if (state?.moved) {
      draggedRef.current = true
    }
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleClick = () => {
    // Swallow the click that ends a drag so dragging never copies or navigates.
    if (draggedRef.current) {
      draggedRef.current = false
      return
    }
    if (isLive && tile.command) {
      handleCopy(tile.command)
      setOpen(true)
    } else if (isUpcoming) {
      goToChannel(tile.key)
    }
  }

  const spokeStyle: CSSProperties = {
    left: `${tile.x}%`,
    top: `${tile.y}%`,
    width: `${tile.w}%`,
    zIndex: dragging ? 50 : isLive ? tile.z + 20 : tile.z,
    translate: offset.x || offset.y ? `${offset.x}px ${offset.y}px` : undefined,
  }
  const floatStyle: CSSProperties = {
    "--mb-float-dur": `${5 + (index % 4) * 0.7}s`,
    "--mb-float-delay": `${(index % 5) * 0.45}s`,
  } as CSSProperties
  const tileStyle: CSSProperties = {
    aspectRatio: "1",
    "--mb-rot": `${tile.rot}deg`,
    cursor: dragging ? "grabbing" : "grab",
    touchAction: "none",
  } as CSSProperties

  const dragHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  }

  const ariaLabel = isLive
    ? `Copy the CLI command for ${tile.label}, or drag to move`
    : isUpcoming
      ? `Get notified when ${tile.label} is live, or drag to move`
      : tile.label

  const icon = isNovu ? (
    <Image className="w-[52%]" src={novuLogomark} alt="" aria-hidden />
  ) : (
    <ChannelIcon
      channel={tile.key}
      className={cn(
        "size-[52%] md:size-[52%]",
        tile.key === "email" && "!text-white"
      )}
      isActive
    />
  )

  return (
    <div
      className={cn("mb-arc-spoke", dragging && "mb-arc-spoke-dragging")}
      style={spokeStyle}
    >
      <div className="mb-arc-float" style={floatStyle}>
        <Tooltip open={open || isCopied} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            {isNovu ? (
              <span
                className="mb-arc-tile"
                style={tileStyle}
                tabIndex={0}
                role="img"
                aria-label={tile.label}
                {...dragHandlers}
              >
                {icon}
              </span>
            ) : (
              <button
                type="button"
                className={cn("mb-arc-tile", isUpcoming && "mb-arc-tile-dim")}
                style={tileStyle}
                onClick={handleClick}
                aria-label={ariaLabel}
                {...dragHandlers}
              >
                {icon}
              </button>
            )}
          </TooltipTrigger>
          <TooltipContent side="top">
            {isCopied ? (
              <span className="flex items-center gap-1.5 text-foreground">
                <Check
                  className="size-3.5 shrink-0 text-[#3ac47d]"
                  aria-hidden
                />
                Command copied. Paste it in your terminal.
              </span>
            ) : isLive ? (
              <code className="font-mono text-[13px] tracking-tight text-foreground">
                {tile.command}
              </code>
            ) : isUpcoming ? (
              `Notify me when ${tile.label} is live`
            ) : (
              "One layer for every channel"
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export interface IConnectChannelArcProps {
  className?: string
}

function ConnectChannelArc({ className }: IConnectChannelArcProps) {
  return (
    <div className={cn("absolute aspect-[1960/944]", className)}>
      <div className="mb-arc">
        <div className="mb-arc-glow mb-arc-glow-primary" />
        <div className="mb-arc-glow mb-arc-glow-secondary" />

        {ARC_TILES.map((tile, index) => (
          <ArcTile key={tile.key} tile={tile} index={index} />
        ))}
      </div>
    </div>
  )
}

export default ConnectChannelArc
