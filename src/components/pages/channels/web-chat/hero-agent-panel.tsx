"use client"

import type { CSSProperties } from "react"
import dynamic from "next/dynamic"
import {
  AGENT_MARK_IMAGE,
  HERO_AGENT_EMPTY_STATE,
  HERO_AGENT_IMAGE,
  HERO_CHAT_LIGHT_IMAGE,
  HERO_CHAT_SURFACE_IMAGE,
  HERO_COMPOSER_PLACEHOLDER,
  HERO_MESSAGES,
  HERO_PANEL_TITLE,
  NOISE_GRAIN_SVG,
} from "@/data/pages/web-chat"
import {
  STORYBOARD_TIMING,
  type StoryboardPhase,
  type StoryboardStep,
} from "@/data/pages/web-chat-storyboard"
import agentGlyph from "@/svgs/pages/channels/web-chat/agent-glyph.svg"
import { ChevronUp, Maximize2, X } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { AgentFieldTable } from "@/components/pages/channels/web-chat/agent-field-table"
import {
  AgentMessage,
  AgentThinking,
} from "@/components/pages/channels/web-chat/agent-message"
import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"

import type { LiveAgentRenderer } from "./live-agent-chat"

const LiveAgentChat = dynamic(() => import("./live-agent-chat"), {
  ssr: false,
  loading: () => <HeroAgentPanels step={null} />,
})

export interface HeroAgentPanelProps {
  /** `null` is interactive live chat. 0-5 are scripted preview steps. */
  step: StoryboardStep | null
  phase?: StoryboardPhase
  personalized?: boolean
}

/**
 * The agent's mark, as Figma builds it (`45440:71881` header): a soft
 * multi-hue blob — violet top-right, magenta through the middle,
 * peach bottom-left — with the Novu glyph centred on top.
 *
 * The blob ships as an image. It is a ~15-layer stack of blurred, masked
 * gradient shapes, and the previous stand-in (a single accent linear gradient
 * plus a lucide `Sparkles`) is what made the avatar read as a flat magenta
 * disc instead. The 2× export includes asymmetric blur padding; its measured
 * origin is (-8.336, -9) within the 40px avatar, with a 59.219×57.332 footprint.
 * Preserve those bounds so its 36.667px core shares the glyph's center.
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
  personalized = false,
}: {
  className?: string
  glyphClassName?: string
  personalized?: boolean
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative isolate inline-flex shrink-0 items-center justify-center rounded-full",
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
        // Scale Figma's measured export bounds with both avatar sizes.
        className="pointer-events-none absolute top-[-22.5%] left-[-20.84%] isolate h-[143.33%] w-[148.047%]"
        style={{
          backgroundImage: `url(${AGENT_MARK_IMAGE.src})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <HueLayer active={personalized} maskImage={AGENT_MARK_IMAGE.src} />
      </span>
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
function PanelHeader({
  compact,
  personalized,
}: {
  compact?: boolean
  personalized: boolean
}) {
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
        personalized={personalized}
      />
      <span
        className={cn(
          "text-lg leading-[1.2] tracking-[-0.02em] text-white",
          compact && "text-[8.4px]"
        )}
      >
        {HERO_PANEL_TITLE}
      </span>
      <div
        aria-hidden
        className={cn(
          "ml-auto flex shrink-0 items-center gap-4 pr-2 text-white",
          compact && "gap-[7.46px] pr-1"
        )}
      >
        <Maximize2
          className={cn("size-5 -scale-x-100", compact && "size-[9.32px]")}
        />
        <X className={cn("size-5", compact && "size-[9.32px]")} />
      </div>
    </div>
  )
}

/**
 * Composer input. Figma desktop `45487:90361` (384x42, radius 12,
 * `rgba(0,0,0,0.88)` fill, border `rgba(255,255,255,0.3)`, placeholder
 * Inter Medium 15px/`-0.01em` `rgba(255,255,255,0.4)`, send icon 34x34
 * radius 8 filled with purple-2 by default, or the personalized accent);
 * mobile `45487:113116` (~0.4662x).
 */
function Composer({
  compact,
  personalized,
}: {
  compact?: boolean
  personalized: boolean
}) {
  return (
    <div className={cn("shrink-0 p-[11px]", compact && "p-[5.6px]")}>
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
            "flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-purple-2 text-black",
            compact && "size-[15.85px] rounded-[3.7px]"
          )}
          style={
            personalized
              ? {
                  backgroundColor: "var(--wc-accent)",
                  color: "var(--wc-accent-foreground)",
                }
              : undefined
          }
        >
          <ChevronUp
            className={cn("size-4", compact && "size-2")}
            aria-hidden
          />
        </span>
      </div>
    </div>
  )
}

/** Figma positions the orb and copy relative to the panel, at both sizes. */
function EmptyState({
  compact,
  personalized = false,
}: {
  compact?: boolean
  personalized?: boolean
}) {
  return (
    <div className="min-h-0 flex-1">
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 isolate aspect-[350/262] w-[350px] -translate-x-1/2 ease-out motion-reduce:transition-none!",
          compact ? "top-[39.16px] w-[163.16px]" : "top-[84px]"
        )}
        style={{
          backgroundImage: `url(${HERO_AGENT_IMAGE.src})`,
          backgroundSize: "100% 100%",
        }}
      >
        <HueLayer active={personalized} maskImage={HERO_AGENT_IMAGE.src} />
        {/* Figma places the 40px glyph 168px down in the 350×262 glow export. */}
        <span
          className="absolute top-[64.1221%] left-1/2 aspect-square w-[11.4286%] -translate-x-1/2 mix-blend-plus-lighter"
          style={{
            backgroundImage: `url(${agentGlyph.src})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        />
      </span>
      <div
        className={cn(
          "absolute top-[53.3%] left-1/2 flex w-[255px] -translate-x-1/2 flex-col items-center gap-2 text-center tracking-[-0.02em]",
          compact && "w-[118.875px] gap-[3.7px]"
        )}
      >
        <p
          className={cn(
            "text-xl leading-[1.2] text-white",
            compact && "text-[9.3px]"
          )}
        >
          {HERO_AGENT_EMPTY_STATE.title}
        </p>
        <p
          className={cn(
            "text-sm leading-[1.25] text-white/50",
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
  personalized,
}: {
  step: Exclude<StoryboardStep, 0>
  compact?: boolean
  personalized: boolean
}) {
  const visibleMessages = HERO_MESSAGES.filter(
    (message) => message.step <= step
  )

  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-8 overflow-hidden px-[15px] pt-6 pb-4",
        compact && "gap-[14.92px] px-[6.46px] pt-[10.76px] pb-2"
      )}
    >
      {visibleMessages.map((message) => (
        <div
          key={message.text}
          className={cn(
            "flex shrink-0 animate-wc-message-enter flex-col gap-2",
            compact && "gap-[3.73px]"
          )}
        >
          <AgentMessage
            role={message.role}
            text={message.text}
            compact={compact}
            personalized={personalized}
            animate={false}
            className={
              message.step === 5
                ? compact
                  ? "w-[118.875px]"
                  : "w-[255px]"
                : undefined
            }
          />
          {message.step === 5 && <AgentFieldTable compact={compact} />}
        </div>
      ))}
      {step === 2 && <AgentThinking compact={compact} />}
    </div>
  )
}

/**
 * Figma's 408×647 panel and 0.4662-scale mobile panel share its exported
 * gradient. HueLayer preserves that lighting while tinting brand previews.
 */
function AgentPanel({
  step,
  compact,
  renderLive,
  phase = "idle",
  personalized = false,
}: {
  step: StoryboardStep | null
  compact?: boolean
  renderLive?: LiveAgentRenderer
  phase?: StoryboardPhase
  personalized?: boolean
}) {
  const isGrayscale = phase === "grayscale" || phase === "waiting"
  const reducedMotion = useReducedMotion()

  return (
    <div
      data-slot="web-chat-panel"
      className={cn(
        "relative isolate flex flex-col overflow-hidden rounded-[14px] bg-black p-px shadow-[0_12px_32px_rgba(0,0,0,0.64),0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[48px] after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:mix-blend-soft-light after:inset-ring-1 after:inset-ring-white/90",
        compact
          ? "h-[301.62px] w-[190.2px] rounded-[6.526px] p-[0.466px] backdrop-blur-[22.38px] after:inset-ring-[0.466px]"
          : // Desktop: fills whatever height the shared card (`HeroLiveUi`
            // in hero.tsx) gives its margined wrapper, matching Figma's
            // `❖chat` panel filling ~647 of the 680-tall card rather than a
            // hardcoded height that leaves dead space below it.
            "h-full w-[408px]"
      )}
    >
      <motion.div
        aria-hidden
        data-slot="web-chat-panel-background"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        initial={{ filter: "grayscale(0)", opacity: 1 }}
        animate={{
          filter:
            isGrayscale && !reducedMotion ? "grayscale(1)" : "grayscale(0)",
          // Figma lowers the surface fill from 56% to 36% while waiting.
          opacity: isGrayscale && !reducedMotion ? 0.36 / 0.56 : 1,
        }}
        transition={{
          duration: reducedMotion
            ? 0
            : (isGrayscale
                ? STORYBOARD_TIMING.grayscaleMs
                : STORYBOARD_TIMING.recolorMs) / 1000,
          ease: "easeOut",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 isolate -z-10 bg-black"
          style={{
            backgroundImage: `url(${HERO_CHAT_SURFACE_IMAGE.src})`,
            backgroundSize: "100% 100%",
          }}
        >
          <HueLayer active={personalized} />
        </div>
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -z-10 -translate-x-1/2 -translate-y-1/2 rotate-[62.9deg] transition-opacity duration-700 motion-reduce:transition-none",
            personalized && "opacity-0",
            compact
              ? "top-[-52.28px] left-[11.29px] h-[237.57px] w-[597.12px]"
              : "top-[-112.14px] left-[24.22px] h-[509.6px] w-[1280.88px]"
          )}
          style={{
            backgroundImage: `url(${HERO_CHAT_LIGHT_IMAGE.src})`,
            backgroundSize: "100% 100%",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage: `url("${NOISE_GRAIN_SVG}")`,
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px",
          }}
        />
      </motion.div>
      <PanelHeader compact={compact} personalized={personalized} />
      {renderLive ? (
        renderLive(
          Boolean(compact),
          <EmptyState compact={compact} personalized={personalized} />
        )
      ) : (
        <>
          <div className="flex min-h-0 flex-1 flex-col">
            {step === null || step === 0 ? (
              <EmptyState compact={compact} personalized={personalized} />
            ) : (
              <ConversationBody
                step={step}
                compact={compact}
                personalized={personalized}
              />
            )}
          </div>
          <Composer compact={compact} personalized={personalized} />
        </>
      )}
    </div>
  )
}

/**
 * Both responsive frames share one live chat session. Preview visuals remain
 * driven by `step`, with no additional storyboard timers here.
 * `--wc-message-reveal-ms` is set here (not per-message) since every message
 * shares the same reveal duration.
 */
function HeroAgentPanels({
  step,
  renderLive,
  phase,
  personalized,
}: HeroAgentPanelProps & { renderLive?: LiveAgentRenderer }) {
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
      <div className="hidden lg:mt-[15px] lg:mr-[15px] lg:mb-4 lg:block">
        <AgentPanel
          step={step}
          phase={phase}
          personalized={personalized}
          renderLive={renderLive}
        />
      </div>
      {/* `shrink-0`: this sits beside `HeroProductUI`'s mobile dashboard
          slice in a `w-max` row (`HeroLiveUi`, hero.tsx) — without it a
          flex item can shrink below its content size and get squeezed. */}
      <div className="mt-[7.46px] mr-[7.46px] shrink-0 lg:hidden">
        <AgentPanel
          step={step}
          phase={phase}
          personalized={personalized}
          compact
          renderLive={renderLive}
        />
      </div>
    </div>
  )
}

export function HeroAgentPanel({
  step,
  phase,
  personalized,
}: HeroAgentPanelProps) {
  if (step !== null)
    return (
      <HeroAgentPanels step={step} phase={phase} personalized={personalized} />
    )

  return (
    <LiveAgentChat>
      {(renderLive) => <HeroAgentPanels step={null} renderLive={renderLive} />}
    </LiveAgentChat>
  )
}
