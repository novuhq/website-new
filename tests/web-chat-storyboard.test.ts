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
  it("reaches the final reply in six seconds and leaves time to read it", () => {
    const timeToFinalReply = [1, 2, 3, 4].reduce(
      (total, step) =>
        total + storyboardDwellMs(step as StoryboardStep, STORYBOARD_TIMING),
      0
    )
    assert.equal(timeToFinalReply, 6000)
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
  it("lets grayscale and blur finish together before the brand can change", () => {
    assert.equal(
      storyboardDwellMs(0, STORYBOARD_TIMING),
      Math.max(STORYBOARD_TIMING.grayscaleMs, STORYBOARD_TIMING.blurMs)
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
  it("starts with the old content fading to grayscale", () => {
    const state = initialStoryboardState(STORYBOARD_TIMING)

    assert.equal(state.step, 0)
    assert.equal(state.phase, "grayscale")
    assert.equal(state.dwellMs, storyboardDwellMs(0, STORYBOARD_TIMING))
  })

  it("waits at full grayscale when extraction takes longer than the fade", () => {
    const waiting = advanceStoryboard(
      initialStoryboardState(STORYBOARD_TIMING),
      STORYBOARD_TIMING
    )

    assert.equal(waiting.step, 0)
    assert.equal(waiting.phase, "waiting")
    assert.equal(waiting.dwellMs, 0)
    assert.equal(advanceStoryboard(waiting, STORYBOARD_TIMING), waiting)
  })

  it("does not bypass grayscale or recoloring for a cached brand response", () => {
    const initial = initialStoryboardState(STORYBOARD_TIMING)
    const waiting = advanceStoryboard(initial, STORYBOARD_TIMING, true)
    const recoloring = advanceStoryboard(waiting, STORYBOARD_TIMING, true)
    const firstMessage = advanceStoryboard(recoloring, STORYBOARD_TIMING, true)

    assert.equal(waiting.phase, "waiting")
    assert.equal(recoloring.phase, "recolor")
    assert.equal(recoloring.step, 0)
    assert.equal(recoloring.dwellMs, STORYBOARD_TIMING.recolorMs)
    assert.equal(firstMessage.phase, "conversation")
    assert.equal(firstMessage.step, 1)
    assert.equal(firstMessage.dwellMs, storyboardDwellMs(1, STORYBOARD_TIMING))
  })

  it("releases the waiting phase only after a brand or fallback is ready", () => {
    const waiting = advanceStoryboard(
      initialStoryboardState(STORYBOARD_TIMING),
      STORYBOARD_TIMING
    )

    assert.equal(advanceStoryboard(waiting, STORYBOARD_TIMING, false), waiting)
    assert.equal(
      advanceStoryboard(waiting, STORYBOARD_TIMING, true).phase,
      "recolor"
    )
  })

  it("produces the full cycle then repeats from the first message", () => {
    let state = initialStoryboardState(STORYBOARD_TIMING)
    const steps = [`${state.phase}:${state.step}`]

    for (let i = 0; i < 8; i += 1) {
      state = advanceStoryboard(state, STORYBOARD_TIMING, true)
      steps.push(`${state.phase}:${state.step}`)
    }

    assert.deepEqual(steps, [
      "grayscale:0",
      "waiting:0",
      "recolor:0",
      "conversation:1",
      "conversation:2",
      "conversation:3",
      "conversation:4",
      "conversation:5",
      "conversation:1",
    ])
  })
})
