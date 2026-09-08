"use client"

import type { CSSProperties } from "react"
import {
  HERO_AGENT_EMPTY_STATE,
  HERO_COMPOSER_PLACEHOLDER,
  HERO_MESSAGES,
  HERO_PANEL_TITLE,
} from "@/data/pages/web-chat"
import {
  STORYBOARD_TIMING,
  type StoryboardStep,
} from "@/data/pages/web-chat-storyboard"
import { ChevronUp, Maximize2, Sparkles, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { AgentFieldTable } from "@/components/pages/channels/web-chat/agent-field-table"
import {
  AgentMessage,
  AgentThinking,
} from "@/components/pages/channels/web-chat/agent-message"

export interface HeroAgentPanelProps {
  /** `null` is the pre-submit empty state. 0-5 are live storyboard steps. */
  step: StoryboardStep | null
}

/**
 * The agent's circular mark: the Figma logomark is a ~15-layer stack of
 * blurred, masked gradient shapes (`45487:90367` and friends) that isn't
 * practical to reproduce in a static/pure component, so this keeps a
 * simplified gradient disc and adds the accent ring the brief calls for
 * ("the send button and the avatar ring use --wc-accent"). A larger, more
 * blurred copy of the same gradient sits behind it as a halo so the mark
 * reads as a soft blended blob rather than a flat disc, and a small white
 * glyph sits centred on top — both per the diff's read of the Figma frame
 * (a blurred multi-colour blob with a centred glyph), approximated rather
 * than reproducing the full layer stack. The gradient
 * (`wc-agent-avatar-surface`, globals.css) and the ring read `var(--wc-accent)`
 * directly in CSS — confirmed against a second persona
 * (`hero-personalization-05-todesktop.com`, `45487:93325`) that this mark
 * recolours per visitor, not just the message bubbles — so recolouring
 * costs zero React re-renders.
 */
function AgentAvatar({
  className,
  glyphClassName,
  ringWidth = 2,
  square = false,
}: {
  className?: string
  glyphClassName?: string
  ringWidth?: number
  /** Header avatar (`45487:90366`) is a rounded square, not a circle. */
  square?: boolean
}) {
  const shape = square ? "rounded-[28%]" : "rounded-full"

  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        shape,
        className
      )}
    >
      <span
        className={cn(
          "absolute inset-[-35%] opacity-40 blur-lg wc-agent-avatar-surface",
          shape
        )}
      />
      <span
        className={cn("absolute inset-0 wc-agent-avatar-surface", shape)}
        style={{ boxShadow: `inset 0 0 0 ${ringWidth}px var(--wc-accent)` }}
      />
      <Sparkles
        className={cn("relative fill-white text-white", glyphClassName)}
      />
    </span>
  )
}

/**
 * Header bar: avatar + `HERO_PANEL_TITLE` + a decorative expand/close pair.
 * Figma desktop `45487:90366` (h-56, border-b `rgba(255,255,255,0.3)`,
 * avatar 40x40 at 8/8, title Inter Regular 18px/`-0.02em` at x60/y17, icon
 * pair 20x20 each with 16px gap at x332/y18 — confirmed present across
 * every rendered frame, `45487-79055`/`87703`/`89814`/`94116`); mobile
 * `45487:113162`/`113199` (~0.4662x, icons 9.32px, gap 7.46px). The API's
 * extracted data returned empty fills for these icon nodes with no name
 * beyond generic "Frame", so the glyphs (expand/maximize + close) are taken
 * from direct visual confirmation rather than the API. They're inert in
 * this mock — `aria-hidden`, no handlers, and (being plain `<svg>`s, not
 * buttons) never enter the tab order — and muted like the rest of the
 * header chrome rather than accented, matching the frames.
 */
function PanelHeader({ compact }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-3 border-b border-white/30 px-2",
        compact ? "h-[26px] gap-[5.6px] px-1" : "h-14"
      )}
    >
      <AgentAvatar
        className={compact ? "size-[18.65px]" : "size-10"}
        glyphClassName={compact ? "size-2" : "size-4"}
        ringWidth={compact ? 1 : 2}
        square
      />
      <span
        className={cn(
          "text-lg leading-[1.2] tracking-tighter text-white",
          compact && "text-[8.4px]"
        )}
      >
        {HERO_PANEL_TITLE}
      </span>
      <div
        aria-hidden
        className={cn(
          "ml-auto flex shrink-0 items-center gap-4 pr-2 text-white/40",
          compact && "gap-[7.46px] pr-1"
        )}
      >
        <Maximize2 className={cn("size-5", compact && "size-[9.32px]")} />
        <X className={cn("size-5", compact && "size-[9.32px]")} />
      </div>
    </div>
  )
}

/**
 * Composer input. Figma desktop `45487:90361` (384x42, radius 12,
 * `rgba(0,0,0,0.88)` fill, border `rgba(255,255,255,0.3)`, placeholder
 * Inter Medium 15px/`-0.01em` `rgba(255,255,255,0.4)`, send icon 34x34
 * radius 8 filled with the accent); mobile `45487:113116` (~0.4662x).
 */
function Composer({ compact }: { compact?: boolean }) {
  return (
    <div className={cn("shrink-0 p-3", compact && "p-[5.6px]")}>
      <div
        className={cn(
          "flex h-[42px] items-center justify-between rounded-xl border border-white/30 bg-black/88 pr-1 pl-3.5",
          compact && "h-[19.6px] rounded-[5.6px] pr-0.5 pl-1.5"
        )}
      >
        <span
          className={cn(
            "truncate text-[15px] leading-[1.2] font-medium tracking-[-0.01em] text-white/40",
            compact && "text-[7px]"
          )}
        >
          {HERO_COMPOSER_PLACEHOLDER}
        </span>
        <span
          className={cn(
            "flex size-[34px] shrink-0 items-center justify-center rounded-lg",
            compact && "size-[15.85px] rounded-[3.7px]"
          )}
          style={{ backgroundColor: "var(--wc-accent)" }}
        >
          <ChevronUp
            className={cn("size-4", compact && "size-2")}
            style={{ color: "var(--wc-accent-foreground)" }}
            aria-hidden
          />
        </span>
      </div>
    </div>
  )
}

/**
 * Pre-submit state: orb, title and body, no messages. Figma desktop
 * `45487:79602`-`45487:79605` (title 20px, body 14px/50% white, both
 * centred, width 255); mobile ~0.4662x. Also reused verbatim (per the
 * decisions in the task brief) for step 0, wrapped by the panel's grayscale
 * filter.
 */
function EmptyState({ compact }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-8 px-8 text-center",
        compact && "gap-[3.7px] px-[3.7px]"
      )}
    >
      <AgentAvatar
        className={compact ? "size-[65px]" : "size-[140px]"}
        glyphClassName={compact ? "size-5" : "size-10"}
        ringWidth={compact ? 2 : 3}
      />
      <div
        className={cn(
          "flex max-w-[255px] flex-col items-center gap-2",
          compact && "max-w-[119px] gap-1"
        )}
      >
        <p
          className={cn(
            "text-xl leading-[1.2] tracking-tighter text-white",
            compact && "text-[9.3px]"
          )}
        >
          {HERO_AGENT_EMPTY_STATE.title}
        </p>
        <p
          className={cn(
            "text-sm leading-[1.25] tracking-tighter text-white/50",
            compact && "text-[6.5px]"
          )}
        >
          {HERO_AGENT_EMPTY_STATE.body}
        </p>
      </div>
    </div>
  )
}

/**
 * The scripted conversation. Message visibility is cumulative — at step N,
 * every `HERO_MESSAGES` entry with `step <= N` is shown (brief Behaviour).
 * Step 2 additionally shows `AgentThinking`, which disappears once step 3's
 * real reply lands. The step-5 message also carries `AgentFieldTable`.
 */
function ConversationBody({
  step,
  compact,
}: {
  step: Exclude<StoryboardStep, 0>
  compact?: boolean
}) {
  const visibleMessages = HERO_MESSAGES.filter(
    (message) => message.step <= step
  )

  return (
    <div
      className={cn(
        "flex flex-1 flex-col justify-end gap-4 overflow-hidden px-4 py-4",
        compact && "gap-2 px-2 py-2"
      )}
    >
      {visibleMessages.map((message) => (
        <div
          key={message.text}
          className={cn("flex flex-col gap-2", compact && "gap-1")}
        >
          <AgentMessage
            role={message.role}
            text={message.text}
            compact={compact}
          />
          {message.step === 5 && <AgentFieldTable compact={compact} />}
        </div>
      ))}
      {step === 2 && <AgentThinking compact={compact} />}
    </div>
  )
}

/**
 * The card itself. Figma desktop `45487:90358`/`45487:88247` (408x647,
 * radius 14, border `rgba(255,255,255,0.9)`, shadow
 * `0 12px 32px rgba(0,0,0,0.64), 0 4px 4px rgba(0,0,0,0.25)`,
 * `backdrop-filter: blur(48px)`); mobile `45487:113113` (190.2x301.62,
 * ~0.4662x, real measured values, not a guess). The fill IS accent-driven —
 * confirmed against a second persona (`hero-personalization-05-
 * todesktop.com`, `45487:93325`: panel reads blue, vs. orange for
 * recent.dev) — so `wc-agent-panel-surface` (globals.css) derives its
 * radial-gradient stops from `var(--wc-accent)` via `color-mix()`, keeping
 * the original black base stop and the 0.56 alpha feel. Step 0 desaturates
 * the body via a CSS filter transition reading
 * `STORYBOARD_TIMING.grayscaleMs`/`recolorMs` — the panel's analogue of
 * Task 6's dashboard blur (which hardcodes `duration-500` against
 * `blurMs: 600`; this file reads the constants directly instead, so Task 8
 * should reconcile the two).
 */
function AgentPanel({
  step,
  compact,
}: {
  step: StoryboardStep | null
  compact?: boolean
}) {
  const isGrayscale = step === 0

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[14px] border border-white/90 shadow-[0_12px_32px_rgba(0,0,0,0.64),0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[48px] wc-agent-panel-surface",
        compact
          ? "h-[301.62px] w-[190.2px] rounded-[6.5px]"
          : // Desktop: fills whatever height the shared card (`HeroLiveUi`
            // in hero.tsx) gives its margined wrapper, matching Figma's
            // `❖chat` panel filling ~647 of the 680-tall card rather than a
            // hardcoded height that leaves dead space below it.
            "h-full w-[408px]"
      )}
    >
      <PanelHeader compact={compact} />
      <div
        className="wc-agent-panel-recolor flex min-h-0 flex-1 flex-col ease-out"
        style={{
          filter: isGrayscale ? "grayscale(1)" : "grayscale(0)",
          transitionProperty: "filter",
          transitionDuration: `${
            isGrayscale
              ? STORYBOARD_TIMING.grayscaleMs
              : STORYBOARD_TIMING.recolorMs
          }ms`,
        }}
      >
        {step === null || step === 0 ? (
          <EmptyState compact={compact} />
        ) : (
          <ConversationBody step={step} compact={compact} />
        )}
      </div>
      <Composer compact={compact} />
    </div>
  )
}

/**
 * The hero agent chat panel: pure function of `step`, no state/effects/
 * timers — every visual change (message reveal, thinking indicator,
 * grayscale-to-color) is driven by CSS reading the current render's props.
 * `--wc-message-reveal-ms` is set here (not per-message) since every message
 * shares the same reveal duration.
 */
export function HeroAgentPanel({ step }: HeroAgentPanelProps) {
  return (
    <div
      className="contents"
      style={
        {
          "--wc-message-reveal-ms": `${STORYBOARD_TIMING.messageRevealMs}ms`,
        } as CSSProperties
      }
    >
      {/* `my-4`/`mr-4` reproduce the Figma `❖chat` panel's 16px inset from
          the shared card's top/right/bottom edges (`chat-area` 440 wide,
          panel 408 wide at x16); the left inset is already the `gap-4`
          between this and `HeroProductUI` in `HeroLiveUi`. Auto height lets
          it stretch to match the card's real height as a flex sibling. */}
      <div className="hidden md:my-4 md:mr-4 md:block">
        <AgentPanel step={step} />
      </div>
      {/* `shrink-0`: this sits beside `HeroProductUI`'s mobile dashboard
          slice in a `w-max` row (`HeroLiveUi`, hero.tsx) — without it a
          flex item can shrink below its content size and get squeezed. */}
      <div className="shrink-0 md:hidden">
        <AgentPanel step={step} compact />
      </div>
    </div>
  )
}
