"use client"

import { useLayoutEffect, useRef } from "react"
import { ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

/**
 * The draft, focus and a pending send outlive each hand-over (idle panel to
 * live chat), so typing carries on while the chat loads and connects.
 */
export type ComposerState = {
  draft: string
  setDraft: (value: string) => void
  focused: boolean
  setFocused: (focused: boolean) => void
  pendingSend: boolean
  setPendingSend: (pending: boolean) => void
}

/**
 * The hero chat's message box, shared by the idle panel and the live chat so
 * the hand-over is seamless. The textarea never becomes `disabled`: that
 * would drop keyboard focus to <body> every time a message is sent. While a
 * reply is in progress only the send button waits; when chat is unavailable
 * the field is read-only.
 */
export function LiveComposer({
  compact,
  value,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  readOnly = false,
  canSend = true,
  status,
  autoFocus,
}: {
  compact: boolean
  value: string
  onChange?: (value: string) => void
  onSubmit?: () => void
  onFocus?: () => void
  onBlur?: () => void
  readOnly?: boolean
  canSend?: boolean
  /** Why the field is read-only, shown as a tooltip. */
  status?: string
  autoFocus?: boolean
}) {
  const textarea = useRef<HTMLTextAreaElement>(null)
  const focusOnMount = useRef(autoFocus)

  // Continue where the visitor was typing in the box this one replaced: focus
  // it (only the visible responsive copy) with the caret after the text. A
  // layout effect runs before the browser handles another keystroke.
  useLayoutEffect(() => {
    const element = textarea.current
    if (!focusOnMount.current || !element?.getClientRects().length) return
    element.focus()
    element.setSelectionRange(element.value.length, element.value.length)
  }, [])

  return (
    <form
      className={cn("group/composer shrink-0 p-[11px]", compact && "p-[5.6px]")}
      title={status}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.()
      }}
    >
      <div
        className={cn(
          "flex min-h-[42px] items-center gap-1 rounded-xl border border-white/30 bg-black/88 pr-[3px] pl-3.5 focus-within:border-white/70",
          compact && "min-h-[19.6px] rounded-[5.6px] pr-[1.4px] pl-[6.5px]"
        )}
      >
        <Textarea
          aria-label="Message the agent"
          aria-disabled={readOnly || undefined}
          placeholder="Message the agent ..."
          rows={1}
          value={value}
          ref={textarea}
          readOnly={readOnly}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(event) => onChange?.(event.target.value)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
          className={cn(
            "max-h-28 min-h-0 resize-none rounded-none border-0 bg-transparent p-0 text-[15px] leading-[1.2] font-medium tracking-[-0.01em] text-white shadow-none placeholder:text-white/40 focus-visible:ring-0 md:text-[15px] dark:bg-transparent",
            compact &&
              "text-[7px] group-focus-within/composer:py-2 group-focus-within/composer:text-base md:text-[7px]"
          )}
        />
        <Button
          type="button"
          aria-label="Send message"
          variant="none"
          size="icon-sm"
          disabled={readOnly || !canSend || !value.trim()}
          onMouseDown={(event) => event.preventDefault()}
          onClick={onSubmit}
          className={cn(
            "size-[34px] shrink-0 rounded-[8px] bg-purple-2 text-black disabled:opacity-100",
            compact &&
              "size-[15.85px] rounded-[3.7px] group-focus-within/composer:size-8 [&_svg]:size-2 group-focus-within/composer:[&_svg]:size-4"
          )}
        >
          <ChevronUp className="size-4" aria-hidden />
        </Button>
      </div>
    </form>
  )
}
