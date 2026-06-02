"use client"

import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"

import { Button } from "./button"

interface ICopyCliCommandProps {
  command: string
  className?: string
  clickLocation?: string
  clickText?: string
}

function CopyCliCommand({
  command,
  className,
  clickLocation,
  clickText,
}: ICopyCliCommandProps) {
  const { isCopied, handleCopy } = useCopyToClipboard(1500)

  function handleCopyClick() {
    handleCopy(command)
  }

  return (
    <div
      className={cn(
        "relative flex h-12 w-full min-w-0 items-center justify-between gap-3 rounded-md border border-transparent bg-black bg-clip-border pl-4 pr-1.5 sm:max-w-98 sm:pl-5",
        "before:pointer-events-none before:absolute before:-inset-0.5 before:-z-10 before:rounded-md before:bg-[linear-gradient(0deg,rgba(255,255,255,0.5),rgba(255,255,255,0.5)),radial-gradient(30.74%_144.53%_at_59.44%_100%,#FFFFFF_2.5%,#A7BBFF_21.5%,rgba(183,165,255,0.2)_100%)]",
        className
      )}
    >
      <code className="min-w-0 font-mono text-sm leading-none font-medium tracking-tight whitespace-nowrap text-foreground select-all">
        {command}
      </code>

      <Button
        type="button"
        variant="default"
        size="sm"
        className="h-9 shrink-0 min-w-22 px-4 text-sm normal-case sm:min-w-22"
        onClick={handleCopyClick}
        data-click-location={clickLocation}
        data-click-text={clickText ?? "copy_command"}
        aria-label={isCopied ? "Command copied" : "Copy command"}
      >
        {isCopied ? (
          <>
            <span className="sm:hidden">Copied!</span>
            <Check className="hidden size-4 sm:block" aria-hidden />
          </>
        ) : (
          <>
            <span className="sm:hidden">Copy</span>
            <Copy className="hidden size-4 sm:block" aria-hidden />
          </>
        )}
      </Button>

      <span
        className="pointer-events-none absolute -top-0.5 right-px h-0.75 w-36 bg-[linear-gradient(91.15deg,rgba(205,204,255,0)_2.67%,rgba(205,204,255,0.76156)_21.19%,#CDCCFF_60.95%,rgba(205,204,255,0)_93.27%)] opacity-70 mix-blend-plus-lighter blur-[2px]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-0.75 left-38.75 h-0.75 w-36 bg-[linear-gradient(91.15deg,rgba(205,204,255,0)_2.67%,rgba(205,204,255,0.76156)_21.19%,#CDCCFF_60.95%,rgba(205,204,255,0)_93.27%)] opacity-50 mix-blend-plus-lighter blur-[2px]"
        aria-hidden
      />
    </div>
  )
}

export default CopyCliCommand
