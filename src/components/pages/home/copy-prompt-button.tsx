"use client"

import { useId, type MouseEvent } from "react"
import { Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"
import { Button, type ButtonProps } from "@/components/ui/button"

import AnimatedCopyCheck from "./animated-copy-check"

interface ICopyPromptButtonProps
  extends Omit<ButtonProps, "children" | "onClick" | "type"> {
  copiedLabel?: string
  copiedMessage?: string
  label?: string
  onCopySuccess?: (target: HTMLButtonElement) => void
  resetInterval?: number
  showCopyIcon?: boolean
  showLabel?: boolean
  suppressCopyHydrationWarning?: boolean
  value: string
}

function CopyPromptButton({
  copiedLabel = "Copied",
  copiedMessage = "Prompt copied to clipboard",
  label = "Copy prompt",
  onCopySuccess,
  resetInterval = 2500,
  showCopyIcon = true,
  showLabel = true,
  suppressCopyHydrationWarning = false,
  value,
  textClassName,
  ...buttonProps
}: ICopyPromptButtonProps) {
  const { isCopied, handleCopy } = useCopyToClipboard(resetInterval)
  const statusId = useId()

  const copy = (event: MouseEvent<HTMLButtonElement>) => {
    if (handleCopy(value)) onCopySuccess?.(event.currentTarget)
  }

  return (
    <Button
      {...buttonProps}
      type="button"
      onClick={copy}
      aria-label={isCopied ? copiedLabel || "Copied" : label}
      aria-describedby={statusId}
      suppressHydrationWarning={suppressCopyHydrationWarning}
      textClassName={cn("gap-2", textClassName)}
    >
      {showLabel ? (isCopied ? copiedLabel : label) : null}
      {isCopied ? (
        <AnimatedCopyCheck stroke="currentColor" />
      ) : showCopyIcon ? (
        <Copy aria-hidden />
      ) : null}
      <span
        className="sr-only"
        id={statusId}
        aria-live="polite"
        suppressHydrationWarning={suppressCopyHydrationWarning}
      >
        {isCopied ? copiedMessage : ""}
      </span>
    </Button>
  )
}

export default CopyPromptButton
