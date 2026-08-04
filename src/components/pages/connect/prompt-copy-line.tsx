"use client"

import copyIcon from "@/images/pages/connect/hero/copy.svg"
import checkIcon from "@/svgs/icons/check.svg"

import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"

const CONNECT_PROMPT_PLACEHOLDER = `Connect this project's AI agent to customer channels (Slack, Microsoft Teams, WhatsApp, Telegram, Email, or iMessage) with Novu Connect.

Follow https://novu.co/agents.md end to end. Default to the non-interactive CLI (\`npx novu@latest connect … --ci\`).

Inspect the repo first. Ask me which channel to connect if it is not clear. Detect the framework/runtime from the project, or ask once. Then run one connect command per agents.md (bridge vs managed, keyless vs dashboard OAuth).

Prefer the secure setup links the CLI prints. Do not invent setup steps or ask for secrets in chat unless agents.md says that channel requires it (e.g. iMessage/Sendblue).`
const COPY_ICON_SRC = copyIcon.src
const CHECK_ICON_SRC = checkIcon.src

function ConnectPromptCopyLine() {
  const { isCopied, handleCopy } = useCopyToClipboard(3000)
  const iconSrc = isCopied ? CHECK_ICON_SRC : COPY_ICON_SRC

  return (
    <p className="text-base leading-normal font-normal tracking-tighter whitespace-nowrap text-gray-8">
      Or{" "}
      <button
        type="button"
        className="mr-1 inline-flex items-center gap-1 rounded-sm text-lagune-3 transition-colors duration-200 hover:text-lagune-2 focus-visible:ring-2 focus-visible:ring-lagune-3/40 focus-visible:outline-none"
        onClick={() => handleCopy(CONNECT_PROMPT_PLACEHOLDER)}
        aria-label={isCopied ? "Prompt copied" : "Copy prompt to Claude"}
        data-click-location="connect_hero"
        data-click-text="copy_prompt"
      >
        <span>copy prompt</span>
        <span
          aria-hidden
          className="size-4 shrink-0 translate-y-0.5 bg-current"
          style={{
            mask: `url(${iconSrc}) center / contain no-repeat`,
            WebkitMask: `url(${iconSrc}) center / contain no-repeat`,
          }}
        />
      </button>{" "}
      to Claude
      <span className="sr-only" aria-live="polite">
        {isCopied ? "Prompt copied" : ""}
      </span>
    </p>
  )
}

export default ConnectPromptCopyLine
