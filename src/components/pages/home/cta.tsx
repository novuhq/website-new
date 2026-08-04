import type { TSectionAction } from "@/types/common"
import { cn } from "@/lib/utils"
import ActionGroup from "@/components/ui/action-group"
import { CopyCommand } from "@/components/ui/copy-command"
import { FinalCtaVideo } from "@/components/pages/final-cta"

import AnimatedCopyCheck from "./animated-copy-check"
import CopyPromptButton from "./copy-prompt-button"

interface ICTAProps {
  actions?: TSectionAction[]
  className?: string
  command?: string
  description: string
  prompt?: string
  title: string
}

const DEFAULT_PROMPT = `Connect this project's AI agent to customer channels (Slack, Microsoft Teams, WhatsApp, Telegram, Email, or iMessage) with Novu Connect.

Follow https://novu.co/agents.md end to end. Default to the non-interactive CLI (\`npx novu@latest connect … --ci\`).

Inspect the repo first. Ask me which channel to connect if it is not clear. Detect the framework/runtime from the project, or ask once. Then run one connect command per agents.md (bridge vs managed, keyless vs dashboard OAuth).

Prefer the secure setup links the CLI prints. Do not invent setup steps or ask for secrets in chat unless agents.md says that channel requires it (e.g. iMessage/Sendblue).`

function Cta({
  actions,
  className,
  title,
  description,
  command = "npx novu connect",
  prompt = DEFAULT_PROMPT,
}: ICTAProps) {
  return (
    <section
      className={cn(
        "cta px-safe relative mt-20 overflow-hidden font-inter md:mt-32 lg:mt-44",
        className
      )}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-210.5 flex-col items-center px-5 text-center md:px-8 lg:px-0">
        <h2
          id="cta-heading"
          className="w-full font-inter text-[2.5rem] leading-[1.125] font-normal tracking-plus-tight text-balance text-white md:text-[3.25rem] lg:text-[4rem]"
        >
          {title}
        </h2>
        <p className="mt-4 max-w-151.5 text-base font-normal tracking-tighter text-balance text-gray-60 lg:text-xl/normal">
          {description}
        </p>
        {actions?.length ? (
          <ActionGroup
            className="mt-8 gap-x-5 max-sm:w-full max-sm:flex-col md:gap-x-5 [&_[data-slot=button]]:h-11 [&_[data-slot=button]]:min-w-0 [&_[data-slot=button]]:rounded-md [&_[data-slot=button]]:px-5 [&_[data-slot=button]]:text-base [&_[data-slot=button]]:tracking-[-0.025em] [&_[data-slot=button]]:normal-case max-sm:[&_[data-slot=button]]:w-full"
            actions={actions}
          />
        ) : (
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-5 sm:w-auto sm:flex-row">
            <CopyCommand
              className="w-full max-w-xs sm:w-70.5"
              controlClassName="pl-3"
              command={command}
              variant="highlighted"
              copiedContent={<AnimatedCopyCheck />}
            />
            <CopyPromptButton
              className="h-11 w-full max-w-xs px-5 text-base leading-none font-medium tracking-[-0.4px] normal-case sm:w-39 [&_svg]:!size-3.5"
              variant="outline-transparent"
              size="none"
              resetInterval={2000}
              value={prompt}
            />
          </div>
        )}
      </div>

      <FinalCtaVideo className="relative -mt-20 aspect-auto h-65 md:-mt-40 md:h-100 lg:-mt-54 lg:aspect-1920/742 lg:h-184" />
    </section>
  )
}

export default Cta
