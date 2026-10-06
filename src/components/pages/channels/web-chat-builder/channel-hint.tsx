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
  // Touch has no hover, so a tap toggles the hint; a mouse click dismisses it.
  // Radix closes an open tooltip on pointerdown, so remember whether this tap
  // started with the hint open.
  const tap = useRef<{ wasOpen: boolean } | null>(null)

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
        onPointerDown={(event) => {
          tap.current = event.pointerType === "mouse" ? null : { wasOpen: open }
          if (!tap.current) dismiss()
        }}
        onClick={(event) => {
          if (!tap.current) return dismiss()
          const { wasOpen } = tap.current
          tap.current = null
          keyboardFocus.current = false
          // Radix closes the tooltip on click unless the default is prevented.
          event.preventDefault()
          setOpen(!wasOpen)
        }}
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
