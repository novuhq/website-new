"use client"

import Image from "next/image"
import NextLink from "next/link"
import claudeIcon from "@/images/pages/aci/aci-cta/claude-logo.svg"
import { Check } from "lucide-react"

import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/components/ui/button"

const CONNECT_COMMAND = "npx novu connect"
const ACI_PROMPT =
  "Add an agent to my app using instructions from <https://novu.co/agents.md>"
const CLAUDE_PROMPT_URL = `https://claude.ai/new?q=${ACI_PROMPT}`

function AciCtaActions() {
  const { isCopied, handleCopy } = useCopyToClipboard(3000)

  return (
    <div className="mt-7 flex w-full max-w-167 flex-col gap-3 sm:flex-row sm:gap-5">
      <div className="relative h-14 w-full shrink-0 items-center rounded-md bg-white/50 p-[1.5px] shadow-[0_0_14px_rgba(167,187,255,0.2)] sm:flex-1">
        <div className="absolute inset-0 z-0 rounded-md bg-[radial-gradient(circle,#fff_3%,#a7bbff_22%,rgba(183,165,255,0.2)_100%)]" />
        <div className="relative z-10 flex h-full items-center rounded-[4px] bg-[#05050B] pr-25 pl-5">
          <code className="truncate font-mono text-base leading-[1.2] font-medium text-white">
            {CONNECT_COMMAND}
          </code>
          <button
            type="button"
            className="absolute top-2 right-2 flex h-10 w-22 items-center justify-center rounded-sm bg-white text-xs font-medium text-black uppercase transition-colors hover:bg-gray-10 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none disabled:cursor-default"
            onClick={() => handleCopy(CONNECT_COMMAND)}
            disabled={isCopied}
            aria-label={isCopied ? "Command copied" : "Copy command"}
            data-click-location="aci_cta"
            data-click-text="copy_connect_command"
          >
            {isCopied ? <Check className="size-4" aria-hidden /> : "Copy"}
          </button>
          <span className="sr-only" aria-live="polite">
            {isCopied ? "Command copied" : ""}
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        size="lg"
        className="h-14 w-full sm:w-64"
        asChild
      >
        <NextLink
          href={CLAUDE_PROMPT_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-click-location="aci_cta"
          data-click-text="open_prompt_in_claude"
          className="uppercase"
        >
          <Image
            src={claudeIcon}
            width={20}
            height={20}
            alt=""
            className="mr-2.5 opacity-70"
            aria-hidden
          />
          copy prompt to claude
        </NextLink>
      </Button>
    </div>
  )
}

export default AciCtaActions
