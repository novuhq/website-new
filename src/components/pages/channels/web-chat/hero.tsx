"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import {
  HERO_BADGE_LABEL,
  HERO_CLI_COMMAND,
  HERO_COPY_PROMPT_LABEL,
  HERO_DESCRIPTION_TEXT,
  HERO_HEADING,
  HERO_IMPLEMENT_PROMPT,
  HERO_META_LINE,
  HERO_TOOLTIP_LINK_LABEL,
  HERO_TOOLTIP_TEXT,
} from "@/data/pages/web-chat"
import type { StoryboardStep } from "@/data/pages/web-chat-storyboard"
import { useInView } from "motion/react"

import { cn } from "@/lib/utils"
import { CopyCommand } from "@/components/ui/copy-command"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { BrandAlert } from "@/components/pages/channels/web-chat/brand-alert"
import { useWebChatBrand } from "@/components/pages/channels/web-chat/brand-provider"
import { HeroAgentPanel } from "@/components/pages/channels/web-chat/hero-agent-panel"
import { HeroProductUI } from "@/components/pages/channels/web-chat/hero-product-ui"
import { HueLayer } from "@/components/pages/channels/web-chat/hue-layer"
import { UrlPersonalizer } from "@/components/pages/channels/web-chat/url-personalizer"
import { useStoryboard } from "@/components/pages/channels/web-chat/use-storyboard"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"

const COPY_PROMPT_BUTTON_CLASSES =
  "h-11 w-full shrink-0 rounded-md px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case sm:w-auto"

/**
 * "Copy Prompt" plus its hover tooltip. Figma (`45487-111197`) styles
 * `HERO_TOOLTIP_LINK_LABEL` as underlined text but the file carries no
 * hyperlink target for that node, so it stays inert rather than pointing at
 * a guessed URL.
 */
function CopyPromptWithTooltip({ className }: { className?: string }) {
  return (
    <Tooltip>
      {/* CopyPromptButton isn't a forwardRef component, so the trigger wraps
          it in a plain span rather than using `asChild` directly on it —
          Radix needs a real DOM node to anchor the popper and attach its
          hover/focus listeners to. */}
      <TooltipTrigger asChild>
        <span className={cn("inline-flex w-full sm:w-auto", className)}>
          <CopyPromptButton
            className={COPY_PROMPT_BUTTON_CLASSES}
            label={HERO_COPY_PROMPT_LABEL}
            size="none"
            value={HERO_IMPLEMENT_PROMPT}
            variant="default"
          />
        </span>
      </TooltipTrigger>
      <TooltipContent
        align="center"
        className="w-[332px] max-w-[calc(100vw-2.5rem)] flex-col items-stretch gap-3 rounded-md border-[#2A2B33] bg-[#0B0C0E] p-2.5 text-left before:hidden after:hidden"
        side="bottom"
      >
        <p className="text-[13px] leading-[1.38em] tracking-[-0.0246em] text-[#C2C4CC]">
          {HERO_TOOLTIP_TEXT}
        </p>
        <span className="text-[13px] leading-[1.38em] tracking-[-0.0246em] text-[#E0E1E5] underline">
          {HERO_TOOLTIP_LINK_LABEL}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Figma's CLI pill (`.input-field` `45487:83403`) is a plain bordered box —
 * black fill, `#41434D` 1px border, radius 6px — with the full mono command
 * visible and a small copy *icon* at the right, not a "Copy" text button.
 * `CopyCommand`'s `default` variant already renders that icon-only
 * affordance (`highlighted` renders a solid white "Copy" button instead),
 * so this uses `default` with just the border/fill recoloured to match.
 */
function CliPill({ className }: { className?: string }) {
  return (
    <CopyCommand
      className={cn("sm:w-auto", className)}
      command={HERO_CLI_COMMAND}
      commandClassName="pointer-events-auto select-text"
      controlClassName="border-[#41434D] bg-black text-white"
    />
  )
}

function MetaLine({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-[14px] leading-[1.38em] tracking-[-0.025em] text-white/40 md:max-w-[369px] md:text-[15px]",
        className
      )}
    >
      {HERO_META_LINE}
    </p>
  )
}

function HeroBadge() {
  return (
    <span className="inline-flex items-center gap-3">
      <span aria-hidden className="size-2 bg-[#C25CD6]" />
      <span className="text-[13px] leading-[1em] font-medium tracking-normal text-[#F5CFFC] uppercase">
        {HERO_BADGE_LABEL}
      </span>
    </span>
  )
}

// Figma breaks the heading after "live" (`45487-83391`, a fixed 557px-wide
// frame). Real browser Inter at 56px/-0.04em doesn't reach that wrap point
// on its own — the whole first line fits inside 557px — so the break is
// pinned explicitly (desktop only, via a `<br>`) rather than left to
// reflow. Derived from `HERO_HEADING` itself, not a separate literal, so it
// can't drift from the data file.
const HERO_HEADING_BREAK_AFTER = "Your agent, live"
const HERO_HEADING_BEFORE_BREAK = HERO_HEADING.startsWith(
  HERO_HEADING_BREAK_AFTER
)
  ? HERO_HEADING_BREAK_AFTER
  : HERO_HEADING
const HERO_HEADING_AFTER_BREAK = HERO_HEADING.slice(
  HERO_HEADING_BEFORE_BREAK.length
)

function HeroTitleColumn() {
  return (
    <div className="flex flex-col gap-4 md:max-w-[557px] md:gap-5">
      <div className="flex flex-col gap-3.5 md:gap-4">
        <HeroBadge />
        <h1 className="text-[36px] leading-[1.04em] tracking-[-0.04em] text-white md:text-[56px]">
          {HERO_HEADING_BEFORE_BREAK}
          <br className="hidden md:inline" />
          {HERO_HEADING_AFTER_BREAK}
        </h1>
      </div>
      <p className="text-[16px] leading-[1.5em] tracking-[-0.025em] text-white/80 md:text-[18px]">
        {HERO_DESCRIPTION_TEXT}
      </p>
    </div>
  )
}

/**
 * Desktop-only: meta line above the CTA row, `Copy Prompt` before the CLI
 * pill. Not width-constrained beyond fitting content — a fixed 401px
 * previously forced the CLI pill's full command to truncate; Figma's
 * `buttons` row (`45487-83394`) just hugs its two children.
 */
function HeroCtaColumnDesktop() {
  return (
    <div className="hidden md:flex md:flex-col md:items-start md:gap-5">
      <MetaLine />
      <div className="flex w-full items-center gap-4">
        <CopyPromptWithTooltip />
        <CliPill />
      </div>
    </div>
  )
}

/** Mobile-only: CLI pill, then `Copy Prompt`, then the meta line below — the CTA order flips. */
function HeroCtaColumnMobile() {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      <CliPill />
      <CopyPromptWithTooltip />
      <MetaLine />
    </div>
  )
}

function HeroCopy() {
  return (
    <div className="flex flex-col gap-10 font-inter md:flex-row md:items-start md:justify-between md:gap-16">
      <HeroTitleColumn />
      <HeroCtaColumnDesktop />
      <HeroCtaColumnMobile />
    </div>
  )
}

/**
 * Section-level ambient background. Figma's `hero-section` carries a `bg`
 * group (`45487-82746`, sibling of the `ui`/card group) — a large blurred
 * glow plus a fine noise grain — behind BOTH the copy and the product/agent
 * mockup, visible even before personalization (confirmed against the
 * `hero-default` reference frame, not just the loading/personalized ones).
 *
 * Re-checked against the Figma MCP dump of `45487-82746`: the DEFAULT frame
 * has no `❖color` ellipse at all — that layer exists only in the
 * *personalized* frames, filled with the brand accent at `blur(174px)`. So
 * the base glow here is a fixed violet-to-deep-blue treatment that never
 * reads `var(--wc-accent)` (it's the fallback for "no brand extracted
 * yet"), and `HueLayer` is the only thing that ever tints it — visible
 * only at loading/personalized, per its own `group-data-[wc-state=...]`
 * classes, exactly mirroring "the `❖color` ellipse only exists once
 * personalized." Colours picked to land clearly blue-violet (B channel
 * well above R) rather than the pink-magenta a `--wc-accent`-adjacent hue
 * would read as — this is deliberately *not* derived from the same accent
 * family. `HueLayer` blends on top of this glow only, never over the
 * product/agent cards — those recolour through their own accent-derived
 * fills (`wc-agent-panel-surface`, `wc-agent-avatar-surface`).
 */
function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 isolate overflow-hidden"
    >
      <div
        className="absolute top-[6%] left-1/2 h-[85%] w-[150%] -translate-x-1/2 rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 35%, rgba(66,58,183,0.6) 0%, rgba(35,28,110,0.42) 45%, rgba(8,10,46,0.3) 75%, rgba(8,10,46,0) 100%)",
        }}
      />
      <HueLayer />
      {/* Noise grain: Figma's `noise` instance sits at 0.32 opacity. */}
      <div className="absolute inset-0 wc-noise-overlay opacity-[0.32]" />
      {/* Dotted band beneath the card (Figma `dots-pattern`, `45487:82767`
          — a radial white mask blurred over a repeating pixel texture).
          Approximated as a CSS dot-grid, masked and blurred to the same
          soft, subtle band rather than shipping the source texture image
          for one low-opacity decorative strip. */}
      <div
        className="absolute inset-x-0 top-[83%] mx-auto h-24 w-[70%] max-w-3xl opacity-25 blur-[6px]"
        style={{
          maskImage:
            "radial-gradient(closest-side, black 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(closest-side, black 0%, transparent 100%)",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1.5px)",
          backgroundSize: "14px 14px",
        }}
      />
    </div>
  )
}

function HeroLiveUi({
  step,
  isPersonalized,
}: {
  step: StoryboardStep | null
  isPersonalized: boolean
}) {
  return (
    <div
      className={cn(
        // Mobile: `-mx-5` cancels the section's own `px-5` padding so this
        // frame clips against the true viewport edge — Figma's `ui` group
        // (`45487-112600`) is positioned "at x-296 on a 360 viewport",
        // i.e. relative to the device edge, not the padded content column.
        "relative -mx-5 overflow-hidden",
        // Desktop: Figma's `dashboard` frame (`45487-89843`, 1364x680,
        // radius 24) is ONE continuous card — the sidebar/table mock and
        // the floating agent panel share its background/border/shadow/
        // blur, rather than being two separately-chromed boxes with a
        // visible seam between them.
        "md:relative md:mx-0 md:flex md:flex-row md:items-stretch md:overflow-hidden md:rounded-3xl md:border md:border-white/10 md:bg-[linear-gradient(180deg,rgba(0,0,0,0.98)_58%,rgba(0,0,0,0)_100%)] md:shadow-[0_-2px_24px_0_rgba(0,0,0,0.45)] md:backdrop-blur-[48px]"
      )}
    >
      {/*
        Mobile only: the dashboard slice (`HeroProductUI`, 438x317) and the
        agent panel (190.2x301.62) sit side by side as one 628px-wide row,
        shifted left by 296px so only the dashboard's right sliver shows
        beside the fully-visible agent panel — reproducing Figma's bleed
        instead of stacking them as two separate boxes. `md:contents`
        hands the two children back to the desktop flex row above at md+
        (where this wrapper's own sizing/transform stop applying, since a
        `display:contents` box generates no box for them to apply to).
      */}
      <div className="flex w-max -translate-x-[296px] items-start md:contents">
        <HeroProductUI step={step} isPersonalized={isPersonalized} />
        <HeroAgentPanel step={step} />
      </div>
    </div>
  )
}

function FallbackAlertSlot({ children }: { children: ReactNode }) {
  return <div className="flex justify-center md:justify-start">{children}</div>
}

/**
 * The Web Chat hero: brand-personalized copy, the live product/agent
 * storyboard, and the URL personalizer. Must render inside
 * `WebChatBrandProvider` — it reads `useWebChatBrand()` and relies on that
 * provider's `data-wc-state` wrapper for the ambient glow/hue effects in
 * `HeroBackdrop` below.
 */
export function WebChatHero() {
  const { status, errorMessage } = useWebChatBrand()
  const [isRunning, setIsRunning] = useState(false)
  // Bumped on every submit, including a resubmit while already running.
  // `isRunning` alone can't signal "a new submission just landed" — on a
  // resubmit it's already `true`, so React bails on the identical value and
  // `useStoryboard` never restarts. This counter always changes, forcing the
  // storyboard back to its step-0 transition for the new brand.
  const [submitEpoch, setSubmitEpoch] = useState(0)
  const inViewRef = useRef<HTMLDivElement>(null)
  // Continuous (not `once`) tracking: the storyboard needs to know whenever
  // the hero scrolls out of and back into view, for the whole page lifetime.
  const isInView = useInView(inViewRef, { margin: "-10% 0px" })

  const step = useStoryboard({ isRunning, isInView, submitEpoch })
  const isPersonalized = status === "personalized"

  // `UrlPersonalizer` calls `personalize()` itself and owns the reset button;
  // it exposes no reset callback. Its `reset()` is the only path back to
  // `status === "idle"`, so watching for that stops the storyboard without
  // needing to change Task 5's component.
  useEffect(() => {
    if (status === "idle") setIsRunning(false)
  }, [status])

  const handleSubmit = useCallback(() => {
    setIsRunning(true)
    setSubmitEpoch((epoch) => epoch + 1)
  }, [])

  return (
    <section
      ref={inViewRef}
      className="relative pt-20 md:pt-24 lg:pt-28"
      data-testid="web-chat-hero"
    >
      <HeroBackdrop />
      {/*
        Figma's card spans x278-1640 in a 1920 frame (1364 wide, centred).
        With the standard site container (max-w-288/px-8) that content edge
        lands at x417 — too narrow by ~290px for the card and too far right
        for the title column. 1428 = 1364 (card) + 2*32 (px-8), so at 1920
        this container reproduces the card's x278 start and its 1364 width
        exactly; the title column (Figma x320) lands ~42px short of that,
        an accepted trade-off over pushing the CTA column out of place too.
      */}
      <div className="relative z-10 container mx-auto max-w-[1428px] px-5 md:px-8">
        <HeroCopy />

        <div className="mt-16">
          <HeroLiveUi step={step} isPersonalized={isPersonalized} />
        </div>

        <div className="mt-5 flex flex-col items-center gap-4">
          <UrlPersonalizer onSubmit={handleSubmit} />
          {/*
            Mounted unconditionally (final-review Fix 5) so the alert's
            `role="status"` node exists before, not just during, a fallback
            — only `message` toggles between `null` and the real string.
            See `brand-alert.tsx` for why that ordering matters.
          */}
          <FallbackAlertSlot>
            <BrandAlert message={status === "fallback" ? errorMessage : null} />
          </FallbackAlertSlot>
        </div>
      </div>
    </section>
  )
}

export default WebChatHero
