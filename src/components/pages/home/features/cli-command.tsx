"use client"

import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"

interface ICliCommandProps {
  command: string
  className?: string
}

function CliCommand({ command, className }: ICliCommandProps) {
  const { isCopied, handleCopy } = useCopyToClipboard(2000)

  return (
    <button
      type="button"
      onClick={() => handleCopy(command)}
      aria-label={isCopied ? "Command copied" : "Copy command"}
      className={cn(
        "group flex h-11 min-w-0 items-center gap-3 rounded-[0.625rem] border border-gray-20 bg-black px-4 font-mono text-sm text-gray-90 transition-colors hover:border-gray-40 focus-visible:ring-2 focus-visible:ring-foreground/70 focus-visible:outline-none",
        className
      )}
    >
      <span className="shrink-0 text-gray-50 select-none">$</span>
      <span className="inline-flex w-[calc(100vw-12rem)] min-w-0 justify-start truncate sm:inline sm:w-auto">
        {command}
      </span>
      <span className="ml-auto shrink-0 text-gray-50 transition-colors group-hover:text-foreground">
        {isCopied ? (
          <Check className="size-3.5" aria-hidden />
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
      </span>
    </button>
  )
}

export default CliCommand
