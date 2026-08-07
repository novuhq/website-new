"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

const ENTER_DURATION_MS = 547
const EXIT_DURATION_MS = 374
const HOLD_DURATION_MS = 550
const MICRO_DELAY_MS = 35
const GAP_DURATION_MS = 320
const INITIAL_DELAY_MAX_MS = 400

const ENTER_EASING = "cubic-bezier(0.22, 1, 0.36, 1)"
const EXIT_EASING = "cubic-bezier(0.64, 0, 0.78, 0)"
const ANIMATED_WILL_CHANGE = "transform, opacity, filter"

interface TextAnimationFrame {
  filter: string
  opacity: number
  transform: string
}

const ENTER_FROM: TextAnimationFrame = {
  filter: "blur(14px)",
  opacity: 0,
  transform:
    "translate3d(0px, 8.12px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1.01)",
}

const VISIBLE: TextAnimationFrame = {
  filter: "blur(0px)",
  opacity: 1,
  transform:
    "translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1)",
}

const EXIT_TO: TextAnimationFrame = {
  filter: "blur(10px)",
  opacity: 0,
  transform:
    "translate3d(0px, -5.8px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1)",
}

const INITIAL_ITEM_STYLE: CSSProperties = {
  ...ENTER_FROM,
  backfaceVisibility: "hidden",
  transformOrigin: "50% 55%",
  transformStyle: "preserve-3d",
  willChange: ANIMATED_WILL_CHANGE,
}

type TickerName = "channel" | "framework"

interface FocusBlurCycleItem {
  content: ReactNode
  key: string
}

interface FocusBlurTextCycleProps {
  accessibleText?: string
  className?: string
  fallbackText: string
  itemClassName?: string
  items: readonly FocusBlurCycleItem[]
  reserveItemWidths?: boolean
  staticClassName?: string
  tickerName: TickerName
}

interface PendingIndexCommit {
  index: number
  onAbort: () => void
  resolve: (committed: boolean) => void
  signal: AbortSignal
}

type CommitIndex = (index: number, signal: AbortSignal) => Promise<boolean>

function applyFrame(element: HTMLElement, frame: TextAnimationFrame) {
  element.style.filter = frame.filter
  element.style.opacity = String(frame.opacity)
  element.style.transform = frame.transform
}

function toKeyframe(frame: TextAnimationFrame): Keyframe {
  return {
    filter: frame.filter,
    opacity: frame.opacity,
    transform: frame.transform,
  }
}

function waitFor(duration: number, signal: AbortSignal) {
  if (signal.aborted) {
    return Promise.resolve(false)
  }

  return new Promise<boolean>((resolve) => {
    const timeout = window.setTimeout(() => finish(true), duration)

    const finish = (completed: boolean) => {
      window.clearTimeout(timeout)
      signal.removeEventListener("abort", handleAbort)
      resolve(completed)
    }

    const handleAbort = () => finish(false)
    signal.addEventListener("abort", handleAbort, { once: true })
  })
}

async function animateFrame(
  element: HTMLElement,
  from: TextAnimationFrame,
  to: TextAnimationFrame,
  duration: number,
  easing: string,
  signal: AbortSignal
) {
  if (signal.aborted) {
    return false
  }

  applyFrame(element, from)

  const animation = element.animate([toKeyframe(from), toKeyframe(to)], {
    duration,
    easing,
    fill: "forwards",
  })
  const handleAbort = () => animation.cancel()

  signal.addEventListener("abort", handleAbort, { once: true })

  try {
    await animation.finished
    applyFrame(element, to)
    return !signal.aborted
  } catch {
    return false
  } finally {
    signal.removeEventListener("abort", handleAbort)
    animation.cancel()
  }
}

async function enterItem(element: HTMLElement, signal: AbortSignal) {
  return animateFrame(
    element,
    ENTER_FROM,
    VISIBLE,
    ENTER_DURATION_MS,
    ENTER_EASING,
    signal
  )
}

async function exitItem(element: HTMLElement, signal: AbortSignal) {
  return animateFrame(
    element,
    VISIBLE,
    EXIT_TO,
    EXIT_DURATION_MS,
    EXIT_EASING,
    signal
  )
}

async function runTextCycle(
  element: HTMLElement,
  itemCount: number,
  commitIndex: CommitIndex,
  signal: AbortSignal
) {
  if (!(await commitIndex(0, signal))) return
  applyFrame(element, ENTER_FROM)

  const initialDelay = Math.random() * INITIAL_DELAY_MAX_MS
  if (!(await waitFor(initialDelay, signal))) return
  if (!(await enterItem(element, signal))) return

  let currentIndex = 0

  while (!signal.aborted) {
    if (!(await waitFor(HOLD_DURATION_MS, signal))) return
    if (!(await exitItem(element, signal))) return
    if (!(await waitFor(MICRO_DELAY_MS, signal))) return

    currentIndex = (currentIndex + 1) % itemCount
    if (!(await commitIndex(currentIndex, signal))) return
    if (!(await enterItem(element, signal))) return
    if (!(await waitFor(GAP_DURATION_MS, signal))) return
  }
}

function finishPendingCommit(
  pendingCommitRef: React.MutableRefObject<PendingIndexCommit | null>,
  committed: boolean
) {
  const pending = pendingCommitRef.current
  if (!pending) return

  pending.signal.removeEventListener("abort", pending.onAbort)
  pendingCommitRef.current = null
  pending.resolve(committed)
}

function useCommittedIndex() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentIndexRef = useRef(currentIndex)
  const pendingCommitRef = useRef<PendingIndexCommit | null>(null)

  useEffect(() => {
    currentIndexRef.current = currentIndex

    if (pendingCommitRef.current?.index === currentIndex) {
      finishPendingCommit(pendingCommitRef, true)
    }
  }, [currentIndex])

  useEffect(
    () => () => {
      finishPendingCommit(pendingCommitRef, false)
    },
    []
  )

  const commitIndex = useCallback<CommitIndex>((index, signal) => {
    if (signal.aborted) return Promise.resolve(false)
    if (currentIndexRef.current === index) return Promise.resolve(true)

    return new Promise<boolean>((resolve) => {
      const onAbort = () => finishPendingCommit(pendingCommitRef, false)

      pendingCommitRef.current = { index, onAbort, resolve, signal }
      signal.addEventListener("abort", onAbort, { once: true })
      setCurrentIndex(index)
    })
  }, [])

  return [currentIndex, commitIndex] as const
}

function FocusBlurTextCycle({
  accessibleText,
  className,
  fallbackText,
  itemClassName,
  items,
  reserveItemWidths = true,
  staticClassName,
  tickerName,
}: FocusBlurTextCycleProps) {
  const itemRef = useRef<HTMLSpanElement>(null)
  const [currentIndex, commitIndex] = useCommittedIndex()
  const currentItem = items[currentIndex] ?? items[0]
  const isChannelTicker = tickerName === "channel"

  useEffect(() => {
    const item = itemRef.current
    if (!item) return

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY)
    let controller = new AbortController()

    const start = () => {
      controller.abort()
      controller = new AbortController()

      if (items.length === 0) {
        item.style.willChange = "auto"
        applyFrame(item, VISIBLE)
        return
      }

      if (reducedMotion.matches) {
        item.style.willChange = "auto"
        applyFrame(item, ENTER_FROM)
        return
      }

      if (items.length === 1) {
        item.style.willChange = "auto"
        applyFrame(item, VISIBLE)
        return
      }

      item.style.willChange = ANIMATED_WILL_CHANGE
      void runTextCycle(item, items.length, commitIndex, controller.signal)
    }

    reducedMotion.addEventListener("change", start)
    start()

    return () => {
      controller.abort()
      reducedMotion.removeEventListener("change", start)
    }
  }, [commitIndex, items])

  return (
    <>
      <span
        data-connect-hero-channel-ticker={isChannelTicker ? "" : undefined}
        data-connect-hero-framework-ticker={isChannelTicker ? undefined : ""}
        className={cn(
          "relative z-0 inline-grid max-w-full text-left align-bottom [perspective:900px]",
          className
        )}
        aria-hidden
      >
        <span
          ref={itemRef}
          data-connect-hero-channel-item={
            isChannelTicker ? currentItem?.key : undefined
          }
          data-connect-hero-framework-item={
            isChannelTicker ? undefined : currentItem?.key
          }
          className={cn(
            "whitespace-nowrap [grid-area:1/1] motion-reduce:opacity-0",
            itemClassName
          )}
          style={INITIAL_ITEM_STYLE}
        >
          {currentItem?.content ?? fallbackText}
        </span>
        {reserveItemWidths &&
          items.map((item) => (
            <span
              className={cn(
                "invisible whitespace-nowrap [grid-area:1/1]",
                itemClassName
              )}
              key={item.key}
            >
              {item.content}
            </span>
          ))}
        <span
          data-connect-hero-channel-static={isChannelTicker ? "" : undefined}
          data-connect-hero-framework-static={isChannelTicker ? undefined : ""}
          className={cn(
            "whitespace-nowrap opacity-0 [grid-area:1/1] motion-reduce:opacity-100",
            staticClassName
          )}
        >
          {fallbackText}
        </span>
      </span>
      {accessibleText && <span className="sr-only">{accessibleText}</span>}
    </>
  )
}

export type { FocusBlurCycleItem }
export default FocusBlurTextCycle
