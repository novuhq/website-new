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
import { Reveal } from "@/components/pages/channels/web-chat-reveal"
import { BrandAlert } from "@/components/pages/channels/web-chat/brand-alert"
import { useWebChatBrand } from "@/components/pages/channels/web-chat/brand-provider"
import { HeroAgentPanel } from "@/components/pages/channels/web-chat/hero-agent-panel"
import { HeroProductUI } from "@/components/pages/channels/web-chat/hero-product-ui"
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

function CliPill({ className }: { className?: string }) {
  return (
    <CopyCommand
      className={cn("sm:w-auto", className)}
      command={HERO_CLI_COMMAND}
      commandClassName="pointer-events-auto select-text"
      variant="highlighted"
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

function HeroTitleColumn() {
  return (
    <div className="flex flex-col gap-4 md:max-w-[557px] md:gap-5">
      <div className="flex flex-col gap-3.5 md:gap-4">
        <HeroBadge />
        <h1 className="text-[36px] leading-[1.04em] tracking-[-0.04em] text-white md:text-[56px]">
          {HERO_HEADING}
        </h1>
      </div>
      <p className="text-[16px] leading-[1.5em] tracking-[-0.025em] text-white/80 md:text-[18px]">
        {HERO_DESCRIPTION_TEXT}
      </p>
    </div>
  )
}

/** Desktop-only: meta line above the CTA row, `Copy Prompt` before the CLI pill. */
function HeroCtaColumnDesktop() {
  return (
    <div className="hidden md:flex md:w-[401px] md:flex-col md:items-start md:gap-5">
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
    <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-16">
      <HeroTitleColumn />
      <HeroCtaColumnDesktop />
      <HeroCtaColumnMobile />
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
    <div className="flex flex-col items-start gap-4 md:flex-row md:gap-4">
      <HeroProductUI step={step} isPersonalized={isPersonalized} />
      <HeroAgentPanel step={step} />
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
 * provider's `data-wc-state` wrapper for the ambient glow/hue effects inside
 * `HeroProductUI`.
 */
export function WebChatHero() {
  const { status, errorMessage } = useWebChatBrand()
  const [isRunning, setIsRunning] = useState(false)
  const inViewRef = useRef<HTMLDivElement>(null)
  // Continuous (not `once`) tracking: the storyboard needs to know whenever
  // the hero scrolls out of and back into view, for the whole page lifetime.
  const isInView = useInView(inViewRef, { margin: "-10% 0px" })

  const step = useStoryboard({ isRunning, isInView })
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
  }, [])

  return (
    <section ref={inViewRef} className="relative pt-20 md:pt-24 lg:pt-28">
      <div className="container mx-auto max-w-288 px-5 md:px-8">
        <Reveal>
          <HeroCopy />
        </Reveal>

        <Reveal delay={0.1} className="mt-16">
          <HeroLiveUi step={step} isPersonalized={isPersonalized} />
        </Reveal>

        <Reveal delay={0.16} className="mt-5 flex flex-col items-center gap-4">
          <UrlPersonalizer onSubmit={handleSubmit} />
          {status === "fallback" && errorMessage && (
            <FallbackAlertSlot>
              <BrandAlert message={errorMessage} />
            </FallbackAlertSlot>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export default WebChatHero
