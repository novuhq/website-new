"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { Geist_Mono } from "next/font/google"
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
import type {
  StoryboardPhase,
  StoryboardStep,
} from "@/data/pages/web-chat-storyboard"
import TooltipLinkArrow from "@/images/pages/channels/web-chat/tooltip-link-arrow.inline.svg"
import TooltipPointer from "@/images/pages/channels/web-chat/tooltip-pointer.inline.svg"
import { useInView } from "motion/react"

import { cn } from "@/lib/utils"
import { brandCssVars } from "@/lib/web-chat-theme"
import { CopyCommand } from "@/components/ui/copy-command"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { BrandAlert } from "@/components/pages/channels/web-chat/brand-alert"
import {
  useWebChatBrand,
  type WebChatBrand,
} from "@/components/pages/channels/web-chat/brand-provider"
import { HeroAgentPanel } from "@/components/pages/channels/web-chat/hero-agent-panel"
import {
  HeroBackdrop,
  HeroResponsiveBackdrop,
} from "@/components/pages/channels/web-chat/hero-backdrop"
import { HeroProductUI } from "@/components/pages/channels/web-chat/hero-product-ui"
import { UrlPersonalizer } from "@/components/pages/channels/web-chat/url-personalizer"
import { useStoryboard } from "@/components/pages/channels/web-chat/use-storyboard"
import CopyPromptButton from "@/components/pages/home/copy-prompt-button"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-web-chat-mono",
})

const COPY_PROMPT_BUTTON_CLASSES =
  "h-11 w-full shrink-0 rounded-md px-5 text-base leading-none font-medium tracking-[-0.025em] normal-case xl:w-34"

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
        <span className={cn("inline-flex w-full xl:w-auto", className)}>
          <CopyPromptButton
            className={COPY_PROMPT_BUTTON_CLASSES}
            label={HERO_COPY_PROMPT_LABEL}
            size="none"
            showCopyIcon={false}
            value={HERO_IMPLEMENT_PROMPT}
            variant="default"
          />
        </span>
      </TooltipTrigger>
      <TooltipContent
        align="center"
        arrow={
          <TooltipPointer
            aria-hidden="true"
            className="-translate-y-px"
            width={30}
            height={8}
            viewBox="0 0 30 8"
          />
        }
        className="w-[332px] max-w-[calc(100vw-2.5rem)] rounded-md border-[#2A2B33] bg-[#0B0C0E] p-2.5 text-left"
        side="top"
        sideOffset={12}
      >
        <span className="flex flex-col gap-3">
          <span className="text-[13px] leading-[1.38em] tracking-[-0.0246em] text-[#C2C4CC]">
            {HERO_TOOLTIP_TEXT}
          </span>
          <span className="flex items-center gap-1 text-[13px] leading-[1.38em] tracking-[-0.0246em] text-[#E0E1E5]">
            <span className="underline decoration-1 underline-offset-2">
              {HERO_TOOLTIP_LINK_LABEL}
            </span>
            <TooltipLinkArrow
              aria-hidden="true"
              className="size-3.5 shrink-0"
            />
          </span>
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
      className={cn("min-w-0 xl:w-[393px]", className)}
      command={HERO_CLI_COMMAND}
      commandClassName="pointer-events-auto min-w-0 flex-1 text-base leading-none tracking-[-0.02em] text-white select-text"
      copyButtonClassName="size-4 lg:size-4 [&_svg]:size-4"
      controlClassName={cn(
        "h-11 gap-6 border-0 bg-black px-3.5 text-white ring-1 ring-gray-30 ring-inset",
        geistMono.className
      )}
    />
  )
}

function MetaLine({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-sm leading-[1.375] tracking-tight text-white/40 md:max-w-[369px] md:text-[15px]",
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
      <span aria-hidden className="size-2 bg-purple-3" />
      <span className="text-[13px] leading-[1em] font-medium tracking-normal text-purple-1 uppercase">
        {HERO_BADGE_LABEL}
      </span>
    </span>
  )
}

// Figma breaks the heading after "live" (`45487-83391`, a fixed 557px-wide
// frame). Real browser Inter at 56px/-0.04em doesn't reach that wrap point
// on its own — the whole first line fits inside 557px — so the break is
// pinned explicitly at both sizes rather than left to
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
    <div className="flex max-w-184 min-w-0 flex-col gap-5 md:max-w-[557px] md:gap-4 lg:gap-4.5 xl:flex-1 xl:gap-5">
      <div className="flex flex-col gap-3.5 md:gap-4">
        <HeroBadge />
        <h1 className="text-[36px] leading-[1.04em] tracking-[-0.04em] text-white md:text-[40px] lg:text-5xl xl:text-[56px]">
          {HERO_HEADING_BEFORE_BREAK}
          <br />
          {HERO_HEADING_AFTER_BREAK}
        </h1>
      </div>
      <p className="text-[16px] leading-[1.5em] tracking-[-0.025em] text-white/80 md:max-w-125 xl:max-w-none xl:text-[18px]">
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
    <div className="hidden xl:flex xl:shrink-0 xl:flex-col xl:items-start xl:gap-5 xl:pb-2">
      <MetaLine />
      <div className="flex w-full items-center gap-4">
        <CopyPromptWithTooltip />
        <CliPill />
      </div>
    </div>
  )
}

/** Phones lead with the CLI; tablets put Copy Prompt first, with meta below. */
function HeroCtaColumnMobile() {
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,24.5625rem)_8.5rem] md:w-[545px] md:grid-cols-[8.5rem_minmax(0,1fr)] md:gap-y-4.5 lg:gap-y-5 xl:hidden">
      <CliPill className="md:col-start-2 md:row-start-1" />
      <CopyPromptWithTooltip className="md:col-start-1 md:row-start-1" />
      <MetaLine className="mt-0.5 sm:col-span-2 md:mt-0" />
    </div>
  )
}

function HeroCopy() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 md:min-h-[319px] md:gap-9 lg:min-h-[341px] lg:gap-10 xl:min-h-0 xl:flex-row xl:items-end xl:justify-between xl:gap-12">
      <HeroTitleColumn />
      <HeroCtaColumnDesktop />
      <HeroCtaColumnMobile />
    </div>
  )
}

/** Figma 45487:79082 / 112601: outside strokes blend with the hero backdrop.
 * The inverse gradient transforms give these axis-aligned ellipses. Paint
 * bottom to top, keeping each overlay blend separate. A padding mask retains
 * the fractional mobile stroke, which CSS border widths round to a full pixel.
 */
function DashboardBorder({ compact = false }: { compact?: boolean }) {
  return (
    <>
      {[
        "bg-[radial-gradient(ellipse_44.7845%_37.5%_at_50%_105.6618%,white_0%,transparent_76.3849%)]",
        "bg-[radial-gradient(ellipse_57.8614%_102.0107%_at_50%_-2.0107%,white_0%,transparent_41.0963%)]",
        "bg-white",
      ].map((paint) => (
        <span
          key={paint}
          aria-hidden
          data-slot="hero-dashboard-border"
          className={cn(
            "pointer-events-none absolute -inset-(--wc-frame-stroke) z-20 rounded-[calc(var(--wc-frame-radius)+var(--wc-frame-stroke))] mask-[linear-gradient(white,white),linear-gradient(white,white)] mask-exclude [mask-clip:content-box,border-box] p-(--wc-frame-stroke) mix-blend-overlay",
            compact
              ? "[--wc-frame-radius:12px] [--wc-frame-stroke:0.466px] md:hidden"
              : "hidden [--wc-frame-radius:16.8px] [--wc-frame-stroke:0.7px] md:block xl:[--wc-frame-radius:24px] xl:[--wc-frame-stroke:1px]",
            paint
          )}
        />
      ))}
    </>
  )
}

function HeroLiveUi({
  step,
  phase,
  brand,
  personalizedTable,
}: {
  step: StoryboardStep | null
  phase: StoryboardPhase
  brand: WebChatBrand
  personalizedTable: boolean
}) {
  return (
    // Tablets use the desktop scene at 70%; the chat overlaps the fixed-width
    // dashboard at 768px. Scale the outside stroke with the scene as well.
    <div className="relative -mx-5 overflow-x-clip md:mx-auto md:h-119 md:max-w-[955px] md:overflow-visible xl:h-170 xl:max-w-none">
      <div className="relative md:w-[calc(100%/0.7)] md:origin-top-left md:scale-70 xl:w-full xl:scale-100">
        <div className="relative md:flex md:h-170 md:items-stretch md:overflow-hidden md:rounded-3xl md:border md:border-transparent md:bg-black md:bg-[linear-gradient(180deg,rgba(0,0,0,0.98)_58%,rgba(0,0,0,0)_100%)] md:shadow-[0_-2px_24px_0_rgba(0,0,0,0.45)] md:backdrop-blur-[48px]">
          <div className="relative left-[calc(100%-656px)] w-[636px] rounded-xl sm:left-0 sm:mx-auto md:contents">
            <div className="relative isolate flex items-start overflow-hidden rounded-[inherit] bg-black md:contents">
              <HeroProductUI
                phase={phase}
                brand={brand}
                personalizedTable={personalizedTable}
              />
              <HeroAgentPanel
                step={step}
                phase={phase}
                personalized={brand.hasAccent}
              />
            </div>
            <DashboardBorder compact />
          </div>
        </div>
      </div>
      <DashboardBorder />
    </div>
  )
}

function FallbackAlertSlot({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-x-0 top-0 flex justify-center">
        {children}
      </div>
    </div>
  )
}

/**
 * The Web Chat hero: brand-personalized copy, the live product/agent
 * storyboard, and the URL personalizer. Must render inside
 * `WebChatBrandProvider` — it reads `useWebChatBrand()` and relies on that
 * provider's `data-wc-state` wrapper for the ambient glow/hue effects in
 * `HeroBackdrop` below.
 */
export function WebChatHero() {
  const brand = useWebChatBrand()
  const { status, errorMessage } = brand
  // Keep the previous frame visible while it blurs. Extraction can finish
  // earlier or later than the fade; only recolor publishes its visual result.
  const [previousBrand, setPreviousBrand] = useState<WebChatBrand>(brand)
  const [previousTable, setPreviousTable] = useState(false)
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

  const { step, phase } = useStoryboard({
    isRunning: isRunning && status !== "idle",
    isInView,
    isBrandReady: status === "personalized" || status === "fallback",
    submitEpoch,
  })
  const showNewBrand = phase === "recolor" || phase === "conversation"
  const displayedBrand =
    phase === "idle" || showNewBrand ? brand : previousBrand
  const personalizedTable = phase !== "idle" && (showNewBrand || previousTable)

  // `UrlPersonalizer` calls `personalize()` itself and owns the reset button;
  // it exposes no reset callback. Its `reset()` is the only path back to
  // `status === "idle"`, so watching for that stops the storyboard without
  // needing to change Task 5's component.
  useEffect(() => {
    if (status === "idle") setIsRunning(false)
  }, [status])

  const handleSubmit = useCallback(() => {
    setPreviousBrand(displayedBrand)
    setPreviousTable(personalizedTable)
    setIsRunning(true)
    setSubmitEpoch((epoch) => epoch + 1)
  }, [displayedBrand, personalizedTable])

  return (
    <section
      ref={inViewRef}
      className={cn(
        // Preserve the backdrop's 80px bleed without letting its opaque canvas
        // cover the next section. The upper allowance keeps tooltips visible.
        "relative pt-10 font-inter max-lg:[clip-path:inset(-100vh_0_-80px)] md:pt-12 lg:pt-14 xl:min-h-314 xl:pt-23",
        geistMono.variable
      )}
      data-testid="web-chat-hero"
      data-storyboard-phase={phase}
      data-storyboard-step={step ?? "idle"}
      style={brandCssVars(displayedBrand.theme)}
    >
      <HeroBackdrop personalized={displayedBrand.hasAccent} />
      {/*
        Figma puts the card and the copy on DIFFERENT columns: the card's `ui`
        group spans x278-1642 (1364 wide) and the `typography` group spans
        x320-1600 (1280). This container serves the card — 1428 = 1364 + 2*32
        (`px-8`), so at 1920 it reproduces x278 and 1364 exactly — and
        `HeroCopy` re-centres itself to 1280 inside it, which lands at x320
        because (1364 - 1280) / 2 = 42.

        An earlier pass ran the copy on the card's column too and recorded the
        resulting 42px offset as "an accepted trade-off over pushing the CTA
        column out of place." That was a false dilemma: centring the copy
        block moves both of its edges at once, so the title column reaches
        x320 and the CTA column's right edge reaches Figma's x1600 (it had
        overshot to x1642). Verified by pixel diff against the frame.
      */}
      {/* The smaller-screen backdrop lives inside this stacking context.
          Desktop strokes still blend with the section-level backdrop. */}
      <div className="relative isolate mx-auto w-full max-w-3xl px-5 md:px-8 lg:isolation-auto lg:max-w-357">
        <HeroCopy />

        <div className="relative mt-17.5 md:mt-26.5 lg:mt-23 xl:mt-16">
          <HeroResponsiveBackdrop personalized={displayedBrand.hasAccent} />
          <HeroLiveUi
            step={step}
            phase={phase}
            brand={displayedBrand}
            personalizedTable={personalizedTable}
          />
        </div>

        <div className="mt-7 flex flex-col items-center gap-4 md:mt-8.25 xl:mt-5">
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
