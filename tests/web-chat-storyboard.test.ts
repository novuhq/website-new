import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  advanceStoryboard,
  initialStoryboardState,
  nextStoryboardStep,
  STORYBOARD_FIRST_STEP,
  STORYBOARD_LOOP_STEP,
  STORYBOARD_TIMING,
  storyboardDwellMs,
  type StoryboardStep,
} from "@/data/pages/web-chat-storyboard"

describe("storyboard timings", () => {
  it("holds the designer-fixed three-second values", () => {
    assert.equal(STORYBOARD_TIMING.gapMs, 3000)
    assert.equal(STORYBOARD_TIMING.finalHoldMs, 3000)
  })
})

describe("nextStoryboardStep", () => {
  it("walks the transition into the conversation", () => {
    assert.equal(nextStoryboardStep(0), 1)
    assert.equal(nextStoryboardStep(1), 2)
    assert.equal(nextStoryboardStep(2), 3)
    assert.equal(nextStoryboardStep(3), 4)
    assert.equal(nextStoryboardStep(4), 5)
  })

  it("loops the final step back to the first message, never to the transition", () => {
    assert.equal(nextStoryboardStep(5), STORYBOARD_LOOP_STEP)
    assert.equal(nextStoryboardStep(5), 1)
    assert.notEqual(nextStoryboardStep(5), STORYBOARD_FIRST_STEP)
  })

  it("never revisits step 0 once the conversation has started", () => {
    let step: StoryboardStep = 1
    const seen: StoryboardStep[] = []

    for (let i = 0; i < 12; i += 1) {
      step = nextStoryboardStep(step)
      seen.push(step)
    }

    assert.ok(!seen.includes(0))
  })
})

describe("storyboardDwellMs", () => {
  it("overlaps grayscale and blur in the transition, then adds the recolour", () => {
    assert.equal(
      storyboardDwellMs(0, STORYBOARD_TIMING),
      Math.max(STORYBOARD_TIMING.grayscaleMs, STORYBOARD_TIMING.blurMs) +
        STORYBOARD_TIMING.recolorMs
    )
  })

  it("gives each message its reveal plus the inter-message gap", () => {
    const expected = STORYBOARD_TIMING.messageRevealMs + STORYBOARD_TIMING.gapMs

    assert.equal(storyboardDwellMs(1, STORYBOARD_TIMING), expected)
    assert.equal(storyboardDwellMs(3, STORYBOARD_TIMING), expected)
    assert.equal(storyboardDwellMs(4, STORYBOARD_TIMING), expected)
  })

  it("dwells on the thinking step for its own duration", () => {
    assert.equal(
      storyboardDwellMs(2, STORYBOARD_TIMING),
      STORYBOARD_TIMING.thinkingMs
    )
  })

  it("holds the final step before looping", () => {
    assert.equal(
      storyboardDwellMs(5, STORYBOARD_TIMING),
      STORYBOARD_TIMING.messageRevealMs + STORYBOARD_TIMING.finalHoldMs
    )
  })

  it("scales with an edited timing block", () => {
    const doubled = { ...STORYBOARD_TIMING, thinkingMs: 1800 }

    assert.equal(storyboardDwellMs(2, doubled), 1800)
  })
})

describe("advanceStoryboard", () => {
  it("starts on the transition step", () => {
    const state = initialStoryboardState(STORYBOARD_TIMING)

    assert.equal(state.step, 0)
    assert.equal(state.dwellMs, storyboardDwellMs(0, STORYBOARD_TIMING))
  })

  it("carries the dwell for the step it moves to", () => {
    const state = advanceStoryboard(
      initialStoryboardState(STORYBOARD_TIMING),
      STORYBOARD_TIMING
    )

    assert.equal(state.step, 1)
    assert.equal(state.dwellMs, storyboardDwellMs(1, STORYBOARD_TIMING))
  })

  it("produces the full cycle then repeats from the first message", () => {
    let state = initialStoryboardState(STORYBOARD_TIMING)
    const steps = [state.step]

    for (let i = 0; i < 6; i += 1) {
      state = advanceStoryboard(state, STORYBOARD_TIMING)
      steps.push(state.step)
    }

    assert.deepEqual(steps, [0, 1, 2, 3, 4, 5, 1])
  })
})
