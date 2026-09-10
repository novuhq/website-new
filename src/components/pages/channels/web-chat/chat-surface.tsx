import type { CSSProperties } from "react"
import {
  DESIGN_SYSTEM_AGENT_LABEL,
  DESIGN_SYSTEM_COMPOSER_PLACEHOLDER,
  DESIGN_SYSTEM_TYPING_LABEL,
  type DesignSystemBubble,
  type DesignSystemSurface,
} from "@/data/pages/web-chat-design-system"
import { ArrowUp, Maximize2, Sparkles, X } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Per-theme styling for the three fixed "design system" surfaces
 * (`45487-82563`: amber `45487:82629`, purple/centre `45487:82686`, blue
 * `45487:82587`). These are literal, non-personalized values — the whole
 * point of §7 is that the chat UI can be restyled to any design system, so
 * none of this reads `var(--wc-accent*)`.
 *
 * Pixel values below round Figma's fractional numbers (most of them are a
 * clean figure times a repeating ~0.9073 scale factor baked into this
 * frame, e.g. `14.516304969787598 = 16 * 0.9072690606117249`) to the
 * nearest sensible pixel — visually equivalent, not a different design.
 */
const SURFACE_THEME = {
  amber: {
    cardBg: "rgba(0,0,0,0.44)",
    cardBorder: "rgba(255,255,255,0.1)",
    bubbleBg:
      "linear-gradient(90deg, rgba(153,80,43,0.4) 0%, rgba(255,133,71,0.4) 100%)",
    bubbleRadius: "9px",
    accent: "rgba(252,131,70,0.8)",
    labelColor: "rgba(252,131,70,0.8)",
  },
  purple: {
    cardBg: "rgba(0,0,0,0.74)",
    cardBorder: "rgba(255,255,255,0.16)",
    bubbleBg:
      "linear-gradient(134deg, rgba(129,91,212,0.94) 0%, rgba(248,106,203,0.94) 100%)",
    bubbleRadius: "16px 16px 4px 16px",
    accent: "rgba(188,120,230,0.94)",
    labelColor: "#8A8C99",
  },
  blue: {
    cardBg: "rgba(0,0,0,0.5)",
    cardBorder: "rgba(255,255,255,0.12)",
    bubbleBg:
      "linear-gradient(136deg, rgba(75,115,236,0.9) 0%, rgba(75,115,236,0.54) 100%)",
    bubbleRadius: "16px",
    accent: "#4B73EC",
    labelColor: "#8A8C99",
  },
} as const

/**
 * Only the centre (purple, `45487:82686`) and right (blue, `45487:82587`)
 * surfaces show the maximize/close window controls in Figma; the left
 * (amber, `45487:82629`) surface has none.
 */
const SHOWS_CONTROLS: Record<DesignSystemSurface["id"], boolean> = {
  amber: false,
  purple: true,
  blue: true,
}

const STATUS_COLOR = "#8A8C99"
const CHECKLIST_TEXT_COLOR = "#9799A3"
const CHECKLIST_MARK_COLOR = "#C2C4CC"

function AgentGlyph({ style }: { style?: CSSProperties }) {
  return (
    <span
      aria-hidden
      className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full"
      style={style}
    >
      <Sparkles className="size-2.5" />
    </span>
  )
}

function Bubble({
  bubble,
  theme,
}: {
  bubble: DesignSystemBubble
  theme: (typeof SURFACE_THEME)[keyof typeof SURFACE_THEME]
}) {
  if (bubble.kind === "user") {
    return (
      <div className="flex justify-end">
        <p
          className="max-w-[78%] px-4 py-2.5 text-[13px] leading-[1.2] tracking-[-0.01em] text-white"
          style={{
            background: theme.bubbleBg,
            borderRadius: theme.bubbleRadius,
          }}
        >
          {bubble.text}
        </p>
      </div>
    )
  }

  if (bubble.kind === "typing") {
    return (
      <div
        className="flex items-center gap-1.5 text-[11px] leading-none tracking-[-0.01em]"
        style={{ color: theme.labelColor }}
      >
        <AgentGlyph style={{ color: theme.labelColor }} />
        {DESIGN_SYSTEM_TYPING_LABEL}
      </div>
    )
  }

  if (bubble.kind === "status") {
    return (
      <div
        className="flex items-center gap-1.5 text-[11px] leading-[1.5] tracking-[-0.025em]"
        style={{ color: STATUS_COLOR }}
      >
        <AgentGlyph style={{ color: STATUS_COLOR }} />
        {bubble.text}
      </div>
    )
  }

  if (bubble.kind === "checklist") {
    return (
      <ul
        className="flex flex-col gap-1.5 border-l pl-3"
        style={{ borderColor: "#41434D" }}
      >
        {bubble.items.map((item) => (
          <li
            className="text-[11px] leading-[1.5] tracking-[-0.025em]"
            key={item}
            style={{ color: CHECKLIST_TEXT_COLOR }}
          >
            <span style={{ color: CHECKLIST_MARK_COLOR }}>✓</span> {item}
          </li>
        ))}
      </ul>
    )
  }

  // agent
  return (
    <div className="flex flex-col gap-1">
      {bubble.skipLabel ? null : (
        <span
          className="flex items-center gap-1.5 text-[11px] leading-none tracking-[-0.01em]"
          style={{ color: theme.labelColor }}
        >
          <AgentGlyph style={{ color: theme.labelColor }} />
          {DESIGN_SYSTEM_AGENT_LABEL}
        </span>
      )}
      <p className="text-[13px] leading-[1.5] tracking-[-0.025em] text-white/90">
        {bubble.text}
        {bubble.linkText ? (
          <>
            {" "}
            <span className="text-white/60 underline underline-offset-2">
              {bubble.linkText}
            </span>
          </>
        ) : null}
      </p>
    </div>
  )
}

function Composer({
  theme,
  variant,
}: {
  theme: (typeof SURFACE_THEME)[keyof typeof SURFACE_THEME]
  variant: "light" | "dark"
}) {
  const isLight = variant === "light"

  return (
    <div
      className={cn(
        "mt-auto flex items-center justify-between gap-3 rounded-[10px] border px-3 py-2.5",
        isLight
          ? "border-white/50 bg-white shadow-[0_8px_19px_rgba(0,0,0,0.25)]"
          : "border-white/10 bg-black/70"
      )}
    >
      <span className="text-[13px] leading-[1.2] tracking-[-0.01em] text-[#707280]">
        {DESIGN_SYSTEM_COMPOSER_PLACEHOLDER}
      </span>
      <span
        aria-hidden
        className="flex size-6 shrink-0 items-center justify-center rounded-[7px]"
        style={{ background: isLight ? "#000" : theme.accent }}
      >
        <ArrowUp className="size-3.5 text-white" />
      </span>
    </div>
  )
}

export interface ChatSurfaceProps {
  surface: DesignSystemSurface
  /** The centre surface renders larger, elevated, and on top (z-index). */
  prominent?: boolean
  className?: string
}

export function ChatSurface({
  surface,
  prominent,
  className,
}: ChatSurfaceProps) {
  const theme = SURFACE_THEME[surface.id]

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[18px] border p-3 backdrop-blur-3xl",
        prominent
          ? "shadow-[0_24px_72px_-2px_rgba(0,0,0,0.9),0_24px_24px_-8px_rgba(0,0,0,0.2)]"
          : "shadow-[0_0_53px_rgba(0,0,0,0.1),0_16px_48px_-4px_rgba(0,0,0,0.6)]",
        className
      )}
      style={{ background: theme.cardBg, borderColor: theme.cardBorder }}
    >
      {surface.title ? (
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="flex items-center gap-2 text-[15px] leading-[1.2] tracking-[-0.01em] text-white">
            <span
              aria-hidden
              className="inline-flex size-6 items-center justify-center rounded-full"
              style={{ background: theme.bubbleBg }}
            >
              <Sparkles className="size-3 text-white" />
            </span>
            {surface.title}
          </span>
          <span className="flex items-center gap-2 text-white/40">
            <Maximize2 aria-hidden className="size-3.5" />
            <X aria-hidden className="size-3.5" />
          </span>
        </div>
      ) : SHOWS_CONTROLS[surface.id] ? (
        <div className="flex items-center justify-end gap-2 text-white/40">
          <Maximize2 aria-hidden className="size-3.5" />
          <X aria-hidden className="size-3.5" />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col justify-end gap-3">
        {surface.bubbles.map((bubble, index) => (
          <Bubble
            bubble={bubble}
            key={`${bubble.kind}-${index}`}
            theme={theme}
          />
        ))}
      </div>

      {surface.showComposer ? (
        <Composer
          theme={theme}
          variant={surface.id === "purple" ? "light" : "dark"}
        />
      ) : null}
    </div>
  )
}
