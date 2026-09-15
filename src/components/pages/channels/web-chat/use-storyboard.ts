"use client"

import { useEffect, useState } from "react"
import {
  advanceStoryboard,
  initialStoryboardState,
  STORYBOARD_LAST_STEP,
  STORYBOARD_TIMING,
  type StoryboardPhase,
  type StoryboardState,
  type StoryboardStep,
} from "@/data/pages/web-chat-storyboard"
import { useReducedMotion } from "motion/react"

export interface UseStoryboardArgs {
  isRunning: boolean
  isInView: boolean
  /** True when extraction has settled, including the default-brand fallback. */
  isBrandReady: boolean
  /** Changes only for a new submission, so conversation loops skip the fade. */
  submitEpoch: number
}

interface StoryboardRun {
  epoch: number
  state: StoryboardState
}

interface StoryboardFrame {
  step: StoryboardStep | null
  phase: StoryboardPhase
}

const WAITING_STATE: StoryboardState = {
  step: 0,
  phase: "waiting",
  dwellMs: 0,
}

const REDUCED_MOTION_STATE: StoryboardState = {
  step: STORYBOARD_LAST_STEP,
  phase: "conversation",
  dwellMs: 0,
}

/**
 * One timer drives each fade or conversation step. The fully blurred waiting
 * phase has no timer: extraction must settle before recoloring can begin.
 * Timers pause out of view and are cleared on reset, resubmit, and unmount.
 */
export function useStoryboard({
  isRunning,
  isInView,
  isBrandReady,
  submitEpoch,
}: UseStoryboardArgs): StoryboardFrame {
  const reducedMotion = useReducedMotion()
  const [run, setRun] = useState<StoryboardRun | null>(null)
  const activeState = isRunning && run?.epoch === submitEpoch ? run.state : null
  const reducedState = isBrandReady ? REDUCED_MOTION_STATE : WAITING_STATE

  // Readiness updates do not restart an existing run. Under reduced motion,
  // wait for the brand and then display the complete conversation immediately.
  useEffect(() => {
    if (!isRunning) {
      setRun(null)
      return
    }

    setRun((previous) => {
      if (reducedMotion) {
        return previous?.epoch === submitEpoch &&
          previous.state === reducedState
          ? previous
          : { epoch: submitEpoch, state: reducedState }
      }

      return previous?.epoch === submitEpoch
        ? previous
        : {
            epoch: submitEpoch,
            state: initialStoryboardState(STORYBOARD_TIMING),
          }
    })
  }, [isRunning, reducedMotion, reducedState, submitEpoch])

  // This boolean changes only while waiting. A fast fetch finishing during
  // grayscale must not tear down and restart the fade's existing timer.
  const canResolveBrand = activeState?.phase === "waiting" && isBrandReady

  useEffect(() => {
    if (!isRunning || reducedMotion || !isInView || !activeState) return

    const advance = () => {
      setRun((previous) =>
        previous?.epoch === submitEpoch && previous.state === activeState
          ? {
              epoch: submitEpoch,
              state: advanceStoryboard(
                previous.state,
                STORYBOARD_TIMING,
                canResolveBrand
              ),
            }
          : previous
      )
    }

    if (activeState.phase === "waiting") {
      if (canResolveBrand) advance()
      return
    }

    const timer = setTimeout(advance, activeState.dwellMs)
    return () => clearTimeout(timer)
  }, [
    isRunning,
    reducedMotion,
    isInView,
    activeState,
    canResolveBrand,
    submitEpoch,
  ])

  // Derive reset and resubmit immediately, before effects synchronize state,
  // so a previous domain's conversation cannot flash during the new fade.
  if (!isRunning) return { step: null, phase: "idle" }
  if (reducedMotion) return reducedState
  return activeState ?? initialStoryboardState(STORYBOARD_TIMING)
}
