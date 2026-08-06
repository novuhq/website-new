import FocusBlurTextCycle from "./focus-blur-text-cycle"

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

function ConnectHeroFrameworkTicker({ className }: { className?: string }) {
  return (
    <FocusBlurTextCycle
      accessibleText="LangChain, Vercel AI SDK, Chat SDK, or custom code."
      className={className}
      fallbackText="your framework."
      items={HERO_FRAMEWORKS}
    />
  )
}

export { ConnectHeroFrameworkTicker }
