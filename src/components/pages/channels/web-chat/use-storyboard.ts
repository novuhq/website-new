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
  /**
   * Bumped by the caller on every submission (including a resubmit while
   * already running). A change here forces a fresh step-0 start even though
   * `isRunning` stays `true` across the resubmit — React would otherwise
   * bail on an identical `isRunning` value and never re-initialise. It must
   * NOT change on its own during a run (e.g. on each `advanceStoryboard`
   * tick), or step 0 would replay every loop instead of only on a new
   * submission.
   */
  submitEpoch: number
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
 * - `submitEpoch` changing (a fresh submission, whether or not a previous
 *   run was still looping) always restarts at step 0; the loop itself
 *   (re-entering at step 1 via `advanceStoryboard`) never touches
 *   `submitEpoch`, so step 0 still never replays *within* a run.
 */
export function useStoryboard({
  isRunning,
  isInView,
  submitEpoch,
}: UseStoryboardArgs): StoryboardStep | null {
  const reducedMotion = useReducedMotion()
  const [state, setState] = useState<StoryboardState | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Tracks the last `submitEpoch` this hook has initialised for, so the
  // effect below can tell "still the same run" (keep the in-progress step)
  // apart from "a new submission landed" (force step 0), even though both
  // can arrive with `isRunning` already `true`.
  const lastEpochRef = useRef(submitEpoch)

  // Enter/leave the running state. Reduced motion jumps straight to the last
  // step; otherwise start at (or keep) the current step — unless a new
  // submission (a changed `submitEpoch`) just landed, which always starts
  // fresh at step 0 regardless of what was in flight before.
  useEffect(() => {
    if (!isRunning) {
      lastEpochRef.current = submitEpoch
      setState(null)
      return
    }

    if (reducedMotion) {
      lastEpochRef.current = submitEpoch
      setState({ step: STORYBOARD_LAST_STEP, dwellMs: 0 })
      return
    }

    const isNewSubmission = submitEpoch !== lastEpochRef.current
    lastEpochRef.current = submitEpoch

    setState((previous) =>
      isNewSubmission || !previous
        ? initialStoryboardState(STORYBOARD_TIMING)
        : previous
    )
  }, [isRunning, reducedMotion, submitEpoch])

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
