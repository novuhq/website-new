"use client"

import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"
import { Check, Copy } from "lucide-react"

import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/components/ui/button"

const ACI_PROMPT = "Add an agent to my app https://novu.co/agents.md"

function HeroActions() {
  const { isCopied, handleCopy } = useCopyToClipboard(3000)

  return (
    <div className="flex w-full max-w-79.25 flex-col items-center lg:items-start">
      <div className="flex w-full flex-row gap-3 sm:gap-5">
        <Button
          variant="default"
          size="lg"
          className="w-full sm:w-40.75"
          asChild
        >
          <NextLink
            href={ROUTE.docsOverview}
            target="_blank"
            rel="noopener noreferrer"
            data-click-location="aci_hero"
            data-click-text="read_the_docs"
          >
            Read the docs
          </NextLink>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-33.5"
          asChild
        >
          <NextLink
            href="#what-is-aci"
            data-click-location="aci_hero"
            data-click-text="what_is_aci"
          >
            What is ACI
          </NextLink>
        </Button>
      </div>

      <p className="mt-4.5 flex min-h-6 items-center text-base leading-normal font-book tracking-tighter text-gray-8">
        <span>Or&nbsp;</span>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-lagune-3 transition-colors hover:text-lagune-1 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-lagune-3/50 focus-visible:outline-none"
          onClick={() => handleCopy(ACI_PROMPT)}
          disabled={isCopied}
          aria-label={isCopied ? "Prompt copied" : "Copy prompt to Claude"}
          data-click-location="aci_hero"
          data-click-text="copy_prompt_to_claude"
        >
          {isCopied ? "prompt copied" : "copy prompt"}
          {isCopied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
        </button>
        <span>&nbsp;to Claude</span>
      </p>

      <span className="sr-only" aria-live="polite">
        {isCopied ? "Prompt copied" : ""}
      </span>
    </div>
  )
}

export default HeroActions
