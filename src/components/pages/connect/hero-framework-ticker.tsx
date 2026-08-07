import FocusBlurTextCycle, {
  type FocusBlurCycleItem,
} from "./focus-blur-text-cycle"

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

const HERO_FRAMEWORK_ITEMS: FocusBlurCycleItem[] = HERO_FRAMEWORKS.map(
  (framework) => ({
    content: framework,
    key: framework,
  })
)

function ConnectHeroFrameworkTicker({ className }: { className?: string }) {
  return (
    <FocusBlurTextCycle
      accessibleText="LangChain, Vercel AI SDK, Chat SDK, or custom code."
      className={className}
      fallbackText="your framework."
      itemClassName="inline-block"
      items={HERO_FRAMEWORK_ITEMS}
      tickerName="framework"
    />
  )
}

export { ConnectHeroFrameworkTicker }
