"use client"

import { useRef, useState, type ReactNode } from "react"

import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"

function WebChatBuilderChannelHint({
  children,
  content,
}: {
  children: ReactNode
  content: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const keyboardFocus = useRef(false)

  function dismiss() {
    keyboardFocus.current = false
    setOpen(false)
  }

  return (
    <Tooltip
      open={open}
      onOpenChange={(nextOpen) => {
        // Native focus scrolling must not dismiss the keyboard user's hint.
        if (nextOpen || !keyboardFocus.current) setOpen(nextOpen)
      }}
    >
      <TooltipTrigger
        asChild
        onFocus={(event) => {
          keyboardFocus.current = event.currentTarget.matches(":focus-visible")
        }}
        onBlur={dismiss}
        onPointerDown={dismiss}
        onClick={dismiss}
        onKeyDown={(event) => {
          if (event.key === "Escape") dismiss()
        }}
      >
        {children}
      </TooltipTrigger>
      {content}
    </Tooltip>
  )
}

export default WebChatBuilderChannelHint
