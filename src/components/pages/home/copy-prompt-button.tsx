"use client"

import { useId } from "react"
import { Copy } from "lucide-react"

import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"
import { Button, type ButtonProps } from "@/components/ui/button"

import AnimatedCopyCheck from "./animated-copy-check"

interface ICopyPromptButtonProps
  extends Omit<ButtonProps, "children" | "onClick" | "type"> {
  copiedLabel?: string
  copiedMessage?: string
  label?: string
  onCopy?: () => void
  resetInterval?: number
  showCopyIcon?: boolean
  value: string
}

function CopyPromptButton({
  copiedLabel = "Copied",
  copiedMessage = "Prompt copied to clipboard",
  label = "Copy prompt",
  onCopy,
  resetInterval = 2500,
  showCopyIcon = true,
  value,
  ...buttonProps
}: ICopyPromptButtonProps) {
  const { isCopied, handleCopy } = useCopyToClipboard(resetInterval)
  const statusId = useId()

  const copy = () => {
    if (handleCopy(value)) onCopy?.()
  }

  return (
    <Button
      {...buttonProps}
      type="button"
      onClick={copy}
      aria-label={isCopied ? copiedLabel || "Copied" : label}
      aria-describedby={statusId}
    >
      {isCopied ? copiedLabel : label}
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
