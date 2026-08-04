import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

/**
 * Runtimes the CLI currently supports, mirrored from the homepage prompt
 * generator (connect-stack). Each item carries its own trailing period so the
 * sentence stays flush against variable-width names.
 */
const HERO_FRAMEWORKS = [
  "LangChain.",
  "Vercel AI SDK.",
  "Chat SDK.",
  "custom code.",
] as const

const FRAMEWORK_ITEM_CLASS =
  "[grid-area:1/1] whitespace-nowrap opacity-0 will-change-[filter,opacity] [backface-visibility:hidden] [filter:blur(12px)]"

const FRAMEWORK_STATIC_CLASS = "[grid-area:1/1] whitespace-nowrap opacity-0"

const FRAMEWORK_ANIMATION_NAME = "connect-hero-framework-cycle"
const FRAMEWORK_ITEM_DURATION_SECONDS = 1.8
const FRAMEWORK_ANIMATION_DURATION_SECONDS =
  Math.max(HERO_FRAMEWORKS.length, 1) * FRAMEWORK_ITEM_DURATION_SECONDS

const FRAMEWORK_ANIMATION_STYLE = {
  animationDuration: `${FRAMEWORK_ANIMATION_DURATION_SECONDS}s`,
  animationIterationCount: "infinite",
  animationTimingFunction: "linear",
} satisfies CSSProperties

function formatPercent(value: number) {
  return Number(value.toFixed(4))
}

function getFrameworkTickerKeyframes(frameworkCount: number) {
  if (frameworkCount <= 1) {
    return `
@keyframes ${FRAMEWORK_ANIMATION_NAME} {
  0%,
  100% {
    opacity: 1;
    filter: blur(0.001px);
    transform: translate3d(0, 0, 0);
  }
}
`
  }

  const slotPercent = 100 / frameworkCount
  const transitionPercent = Math.min(8, slotPercent * 0.4)
  const visibleStartPercent = formatPercent(transitionPercent)
  const visibleEndPercent = formatPercent(slotPercent)
  const fadeOutEndPercent = formatPercent(
    Math.min(slotPercent + transitionPercent, 100)
  )

  return `
@keyframes ${FRAMEWORK_ANIMATION_NAME} {
  0%,
  100% {
    opacity: 0;
    filter: blur(12px);
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  ${visibleStartPercent}%,
  ${visibleEndPercent}% {
    opacity: 1;
    filter: blur(0.001px);
    transform: translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }

  ${fadeOutEndPercent}% {
    opacity: 0;
    filter: blur(12px);
    transform: translate3d(0, 0, 0);
  }
}
`
}

const FRAMEWORK_TICKER_KEYFRAMES = `${getFrameworkTickerKeyframes(
  HERO_FRAMEWORKS.length
)}

@media (prefers-reduced-motion: reduce) {
  [data-connect-hero-framework-item] {
    animation: none !important;
    opacity: 0;
    filter: none;
  }

  [data-connect-hero-framework-static] {
    opacity: 1;
  }
}
`

function getFrameworkAnimationStyle(index: number): CSSProperties {
  return {
    ...FRAMEWORK_ANIMATION_STYLE,
    animationDelay: `${(index - 0.5) * FRAMEWORK_ITEM_DURATION_SECONDS}s`,
    animationName: FRAMEWORK_ANIMATION_NAME,
  }
}

function ConnectHeroFrameworkTicker({ className }: { className?: string }) {
  return (
    <>
      <span
        data-connect-hero-framework-ticker
        className={cn(
          "relative z-0 inline-grid max-w-full align-bottom text-left",
          className
        )}
        aria-hidden
      >
        {HERO_FRAMEWORKS.map((framework, index) => (
          <span
            data-connect-hero-framework-item={framework}
            className={FRAMEWORK_ITEM_CLASS}
            key={framework}
            style={getFrameworkAnimationStyle(index)}
          >
            {framework}
          </span>
        ))}
        <span
          data-connect-hero-framework-static
          className={FRAMEWORK_STATIC_CLASS}
        >
          your framework.
        </span>
      </span>
      <span className="sr-only">
        LangChain, Vercel AI SDK, Chat SDK, or custom code.
      </span>
    </>
  )
}

function ConnectHeroFrameworkTickerStyles() {
  return <style>{FRAMEWORK_TICKER_KEYFRAMES}</style>
}

export { ConnectHeroFrameworkTicker, ConnectHeroFrameworkTickerStyles }
