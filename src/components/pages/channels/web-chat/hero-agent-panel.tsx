"use client"

import type { CSSProperties } from "react"
import {
  AGENT_MARK_IMAGE,
  HERO_AGENT_EMPTY_STATE,
  HERO_COMPOSER_PLACEHOLDER,
  HERO_MESSAGES,
  HERO_PANEL_TITLE,
  NOISE_GRAIN_SVG,
} from "@/data/pages/web-chat"
import {
  STORYBOARD_TIMING,
  type StoryboardStep,
} from "@/data/pages/web-chat-storyboard"
import agentGlyph from "@/svgs/pages/channels/web-chat/agent-glyph.svg"
import { ChevronUp, Maximize2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { AgentFieldTable } from "@/components/pages/channels/web-chat/agent-field-table"
import {
  AgentMessage,
  AgentThinking,
} from "@/components/pages/channels/web-chat/agent-message"
import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

export interface HeroAgentPanelProps {
  /** `null` is the pre-submit empty state. 0-5 are live storyboard steps. */
  step: StoryboardStep | null
}

/**
 * The agent's mark, as Figma builds it (`45487-79645` header, `45487-79608`
 * orb): a soft multi-hue blob — violet top-right, magenta through the middle,
 * peach bottom-left — with the Novu glyph centred on top.
 *
 * The blob ships as an image. It is a ~15-layer stack of blurred, masked
 * gradient shapes, and the previous stand-in (a single accent linear gradient
 * plus a lucide `Sparkles`) is what made the avatar read as a flat magenta
 * disc instead. The export is 208 units wide for a 140-unit core, because the
 * blur bleeds past the group box — hence the negative insets below, which size
 * the *core* rather than the export.
 *
 * `HueLayer` preserves the recolour behaviour a personalized frame confirms
 * (`hero-personalization-05-todesktop.com`, `45487:93325`): the blob's own
 * colours are Figma's at rest, and the hue overlay shifts them to the visitor's
 * brand only once `data-wc-state` says so — the same mechanism the hero glow
 * uses, and still zero React re-renders. `isolate` scopes both that blend and
 * the glyph's to this mark.
 *
 * The glyph is `white` at 50% in `plus-lighter` (per the exported SVG), which
 * is what gives it its pale lavender cast over the blob rather than flat white.
 */
function AgentAvatar({
  className,
  glyphClassName,
  square = false,
}: {
  className?: string
  glyphClassName?: string
  /**
   * Header avatar. Figma's frame clips the logomark to its 40px circle
   * (`borderRadius` 72.58 on a 40x40 box) and insets it to 36.67; the
   * empty-state orb is unclipped, so its blurred edges spill as designed.
   */
  square?: boolean
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative isolate inline-flex shrink-0 items-center justify-center rounded-full",
        square && "overflow-hidden",
        className
      )}
    >
      {/*
        Background spans rather than `next/image`: a static import carries
        intrinsic width/height, so `left`/`right` stop stretching the box and
        the negative insets that size the blob's core are ignored — the blob
        rendered at 300px or not at all. A background also skips lazy-loading
        for two marks that are on screen from the first paint.
      */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute",
          // The export is 208x201 for a 140x140 core, so the bleed is not
          // square: -24.3% horizontally, -21.8% vertically. Insetting equally
          // stretched the blob and shifted its colour distribution.
          square
            ? "-inset-x-[18.1%] -inset-y-[16.2%]"
            : "-inset-x-[24.3%] -inset-y-[21.8%]"
        )}
        style={{
          backgroundImage: `url(${AGENT_MARK_IMAGE.src})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      />
      <HueLayer />
      <span
        aria-hidden
        className={cn("relative", glyphClassName)}
        style={{
          backgroundImage: `url(${agentGlyph.src})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          mixBlendMode: "plus-lighter",
        }}
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
        glyphClassName={compact ? "size-[9.3px]" : "size-5"}
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
        glyphClassName={compact ? "size-[18.6px]" : "size-10"}
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
      {!compact && (
        <>
          {/*
            Two layers Figma's `chat` frame carries over the gradient that
            were missing here, both at 0.10 opacity:

            `light` (`45487-79596`) — a 746x1082 #E4C1EA ellipse at
            (-348, -652), `blur(54px)`. It sits almost entirely off the
            panel's top-left, and what reaches inside is the soft lift that
            makes the frame's upper half read lighter than its lower.

            `noise` (`45487-79595`) — the same grain as the hero backdrop.
            Figma's texture is sparse, so 0.10 there corresponds to 0.027 of
            this full-coverage stand-in (the same ~0.27 factor calibrated for
            the hero).

            `-z-10` keeps both above the root's gradient background but below
            the header and body, which are in normal flow. The root already
            establishes a stacking context via `backdrop-blur`.
          */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[652px] -left-[348px] -z-10 h-[1082px] w-[746px] rounded-[50%] bg-[#E4C1EA] opacity-10 blur-[54px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.027]"
            style={{
              backgroundImage: `url("${NOISE_GRAIN_SVG}")`,
              backgroundRepeat: "repeat",
              backgroundSize: "180px 180px",
            }}
          />
        </>
      )}
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
