/**
 * The Hero storyboard, as a pure state machine.
 *
 * Step 0 is the transition into the personalized theme and plays exactly once.
 * Steps 1-5 are the conversation, and the loop re-enters at step 1 so the
 * grayscale-and-blur transition never replays. Reference frames:
 * hero-personalization-00(transition) through -05 in Figma node 45487-82743.
 */

export type StoryboardStep = 0 | 1 | 2 | 3 | 4 | 5

export interface StoryboardTiming {
  /** Chat desaturating to grayscale. Runs concurrently with the blur. */
  grayscaleMs: number
  /** Dashboard content blurring. Runs concurrently with the grayscale. */
  blurMs: number
  /** New table and accent-coloured chat resolving in. */
  recolorMs: number
  /** One message going from blurred-and-transparent to sharp. */
  messageRevealMs: number
  /** How long the "agent is thinking" state holds. */
  thinkingMs: number
  /** Pause between a message landing and the next one starting. */
  gapMs: number
  /** How long the final state holds before the loop restarts. */
  finalHoldMs: number
}

/**
 * gapMs and finalHoldMs are fixed by the designer at 3s. The rest are the
 * first-preview proposal and are meant to be tuned here, in one place.
 */
export const STORYBOARD_TIMING: StoryboardTiming = {
  grayscaleMs: 600,
  blurMs: 600,
  recolorMs: 800,
  messageRevealMs: 700,
  thinkingMs: 900,
  gapMs: 3000,
  finalHoldMs: 3000,
}

export interface StoryboardState {
  step: StoryboardStep
  /** How long to stay on `step` before advancing. */
  dwellMs: number
}

export const STORYBOARD_FIRST_STEP: StoryboardStep = 0
export const STORYBOARD_LOOP_STEP: StoryboardStep = 1
export const STORYBOARD_LAST_STEP: StoryboardStep = 5

export function storyboardDwellMs(
  step: StoryboardStep,
  timing: StoryboardTiming
): number {
  switch (step) {
    case 0:
      return Math.max(timing.grayscaleMs, timing.blurMs) + timing.recolorMs
    case 2:
      return timing.thinkingMs
    case 5:
      return timing.messageRevealMs + timing.finalHoldMs
    default:
      return timing.messageRevealMs + timing.gapMs
  }
}

export function nextStoryboardStep(step: StoryboardStep): StoryboardStep {
  return step === STORYBOARD_LAST_STEP
    ? STORYBOARD_LOOP_STEP
    : ((step + 1) as StoryboardStep)
}

export function initialStoryboardState(
  timing: StoryboardTiming
): StoryboardState {
  return {
    step: STORYBOARD_FIRST_STEP,
    dwellMs: storyboardDwellMs(STORYBOARD_FIRST_STEP, timing),
  }
}

export function advanceStoryboard(
  state: StoryboardState,
  timing: StoryboardTiming
): StoryboardState {
  const step = nextStoryboardStep(state.step)

  return { step, dwellMs: storyboardDwellMs(step, timing) }
}
