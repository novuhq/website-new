"use client"

import { useId } from "react"
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
  resetInterval?: number
  showCopyIcon?: boolean
  showLabel?: boolean
  value: string
}

function CopyPromptButton({
  copiedLabel = "Copied",
  copiedMessage = "Prompt copied to clipboard",
  label = "Copy prompt",
  resetInterval = 2500,
  showCopyIcon = true,
  showLabel = true,
  value,
  textClassName,
  ...buttonProps
}: ICopyPromptButtonProps) {
  const { isCopied, handleCopy } = useCopyToClipboard(resetInterval)
  const statusId = useId()

  return (
    <Button
      {...buttonProps}
      type="button"
      onClick={() => handleCopy(value)}
      aria-label={isCopied ? copiedLabel || "Copied" : label}
      aria-describedby={statusId}
      textClassName={cn("gap-2", textClassName)}
    >
      {showLabel ? (isCopied ? copiedLabel : label) : null}
      {isCopied ? (
        <AnimatedCopyCheck stroke="currentColor" />
      ) : showCopyIcon ? (
        <Copy aria-hidden />
      ) : null}
      <span className="sr-only" id={statusId} aria-live="polite">
        {isCopied ? copiedMessage : ""}
      </span>
    </Button>
  )
}

export default CopyPromptButton
