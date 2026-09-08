"use client"

import { useEffect, useRef, useState } from "react"
import {
  advanceStoryboard,
  initialStoryboardState,
  STORYBOARD_LAST_STEP,
  STORYBOARD_TIMING,
  type StoryboardState,
  type StoryboardStep,
} from "@/data/pages/web-chat-storyboard"
import { useReducedMotion } from "motion/react"

export interface UseStoryboardArgs {
  isRunning: boolean
  isInView: boolean
}

/**
 * Drives the Hero storyboard from `initialStoryboardState`/`advanceStoryboard`
 * (Task 2) with exactly one timer: a `setTimeout` for the current step's
 * `dwellMs`, rescheduled every time it fires. No frame loop, no `setInterval`.
 *
 * - Returns `null` until `isRunning` is true.
 * - Pauses while `isInView` is false (the timeout is cleared, not merely
 *   ignored) and resumes from the same step once back in view.
 * - Under `useReducedMotion`, jumps straight to the final step and never
 *   schedules a timer at all.
 * - Every effect that can hold a timer cleans it up on its own re-run, so
 *   unmounting or `isRunning` going false always clears it — a second submit
 *   never leaks the previous run's timeout.
 */
export function useStoryboard({
  isRunning,
  isInView,
}: UseStoryboardArgs): StoryboardStep | null {
  const reducedMotion = useReducedMotion()
  const [state, setState] = useState<StoryboardState | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Enter/leave the running state. Reduced motion jumps straight to the last
  // step; otherwise start at (or keep) the current step. Going idle clears
  // the state entirely, so the next run always starts fresh at step 0.
  useEffect(() => {
    if (!isRunning) {
      setState(null)
      return
    }

    if (reducedMotion) {
      setState({ step: STORYBOARD_LAST_STEP, dwellMs: 0 })
      return
    }

    setState(
      (previous) => previous ?? initialStoryboardState(STORYBOARD_TIMING)
    )
  }, [isRunning, reducedMotion])

  // The single timer. Only scheduled while running, in motion, in view, and
  // with a step to dwell on. Cleared on every re-run (pause, stop, unmount).
  useEffect(() => {
    if (!isRunning || reducedMotion || !isInView || state === null) {
      return
    }

    timerRef.current = setTimeout(() => {
      setState((previous) =>
        previous ? advanceStoryboard(previous, STORYBOARD_TIMING) : previous
      )
    }, state.dwellMs)

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRunning, reducedMotion, isInView, state])

  return state?.step ?? null
}
