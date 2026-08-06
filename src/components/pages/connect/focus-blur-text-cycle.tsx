"use client"

import { useEffect, useRef, type CSSProperties } from "react"

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

interface FocusBlurTextCycleProps {
  accessibleText: string
  className?: string
  fallbackText: string
  items: readonly string[]
}

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

async function runTextCycle(
  element: HTMLElement,
  items: readonly string[],
  signal: AbortSignal
) {
  element.textContent = items[0]
  applyFrame(element, ENTER_FROM)

  const initialDelay = Math.random() * INITIAL_DELAY_MAX_MS
  if (!(await waitFor(initialDelay, signal))) return
  if (
    !(await animateFrame(
      element,
      ENTER_FROM,
      VISIBLE,
      ENTER_DURATION_MS,
      ENTER_EASING,
      signal
    ))
  ) {
    return
  }

  let currentIndex = 0

  while (!signal.aborted) {
    if (!(await waitFor(HOLD_DURATION_MS, signal))) return
    if (
      !(await animateFrame(
        element,
        VISIBLE,
        EXIT_TO,
        EXIT_DURATION_MS,
        EXIT_EASING,
        signal
      ))
    ) {
      return
    }

    if (!(await waitFor(MICRO_DELAY_MS, signal))) return

    currentIndex = (currentIndex + 1) % items.length
    element.textContent = items[currentIndex]

    if (
      !(await animateFrame(
        element,
        ENTER_FROM,
        VISIBLE,
        ENTER_DURATION_MS,
        ENTER_EASING,
        signal
      ))
    ) {
      return
    }

    if (!(await waitFor(GAP_DURATION_MS, signal))) return
  }
}

function FocusBlurTextCycle({
  accessibleText,
  className,
  fallbackText,
  items,
}: FocusBlurTextCycleProps) {
  const itemRef = useRef<HTMLSpanElement>(null)
  const initialText = items[0] ?? fallbackText
  const sizingItems = [...items, fallbackText]

  useEffect(() => {
    const item = itemRef.current
    if (!item) return

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY)
    let controller = new AbortController()

    const start = () => {
      controller.abort()
      controller = new AbortController()

      if (reducedMotion.matches || items.length === 0) {
        item.style.willChange = "auto"
        applyFrame(item, ENTER_FROM)
        return
      }

      if (items.length === 1) {
        item.style.willChange = "auto"
        item.textContent = items[0]
        applyFrame(item, VISIBLE)
        return
      }

      item.style.willChange = ANIMATED_WILL_CHANGE
      void runTextCycle(item, items, controller.signal)
    }

    reducedMotion.addEventListener("change", start)
    start()

    return () => {
      controller.abort()
      reducedMotion.removeEventListener("change", start)
    }
  }, [items])

  return (
    <>
      <span
        data-connect-hero-framework-ticker
        className={cn(
          "relative z-0 inline-grid max-w-full text-left align-bottom [perspective:900px]",
          className
        )}
        aria-hidden
      >
        <span
          ref={itemRef}
          data-connect-hero-framework-item
          className="inline-block whitespace-nowrap [grid-area:1/1] motion-reduce:opacity-0"
          style={INITIAL_ITEM_STYLE}
        >
          {initialText}
        </span>
        {sizingItems.map((item) => (
          <span
            className="invisible whitespace-nowrap [grid-area:1/1]"
            key={item}
          >
            {item}
          </span>
        ))}
        <span
          data-connect-hero-framework-static
          className="whitespace-nowrap opacity-0 [grid-area:1/1] motion-reduce:opacity-100"
        >
          {fallbackText}
        </span>
      </span>
      <span className="sr-only">{accessibleText}</span>
    </>
  )
}

export default FocusBlurTextCycle
