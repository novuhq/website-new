import {
  GLOBE_CARD_BACKGROUND_ENTER_MS,
  GLOBE_CARD_CONTENT_READY_MS,
  GLOBE_CARD_EVENTS,
  GLOBE_CARD_EXIT_MS,
  GLOBE_CARD_HEADER_ENTER_MS,
  GLOBE_CARD_HEADER_SCRAMBLE_MS,
  GLOBE_CARD_STATUS_DELAY_MS,
  GLOBE_CARD_STATUS_ENTER_MS,
  GLOBE_CARD_TEXT_DELAY_MS,
  GLOBE_CARD_TEXT_ENTER_MS,
  GLOBE_CYCLE_MS,
  GLOBE_ROUTE_CYCLE_MS,
  GLOBE_ROUTE_DOT_LEAD_MS,
} from "./globe-data"
import type {
  IGlobeCardEvent,
  IGlobeCardMotionState,
  IGlobeRoute,
  IRouteVisualState,
} from "./globe-types"

const LINE_ENTRY_END = 0.35
const LINE_PAUSE_END = 0.55
const LINE_EXIT_END = 0.9
const DOT_ENTER_DURATION = 0.08
const DOT_EXIT_DURATION = 0.06
const END_DOT_EXIT_START = 0.94 - 200 / GLOBE_ROUTE_CYCLE_MS

// Start with North America entering from the left horizon. Its first route is
// therefore armed on the opening frames instead of waiting for Eurasia.
const ROTATION_START_DEGREES = 50
const PACIFIC_ACCELERATION_MULTIPLIER = 1.5
const PACIFIC_ACCELERATION_START_DEGREES = 163.91894161537945
const PACIFIC_CRUISE_START_DEGREES = 190.78462047971854
const PACIFIC_CRUISE_END_DEGREES = 239.1428271541378
const PACIFIC_ACCELERATION_END_DEGREES = 266.00850601847685
const DEGREES_TO_RADIANS = Math.PI / 180
const RADIANS_TO_DEGREES = 180 / Math.PI
const FULL_ROTATION_RADIANS = Math.PI * 2
const ROTATION_LOOKUP_STEPS = 1_440

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function cubicCoordinate(
  progress: number,
  controlPoint1: number,
  controlPoint2: number
) {
  const inverse = 1 - progress
  return (
    3 * inverse * inverse * progress * controlPoint1 +
    3 * inverse * progress * progress * controlPoint2 +
    progress * progress * progress
  )
}

/** Evaluates a CSS cubic-bezier by solving its x coordinate first. */
function cubicBezier(
  progress: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const target = clamp01(progress)
  if (target === 0 || target === 1) return target

  let lower = 0
  let upper = 1
  let parameter = target

  for (let iteration = 0; iteration < 14; iteration += 1) {
    const x = cubicCoordinate(parameter, x1, x2)
    if (Math.abs(x - target) < 0.00001) break
    if (x < target) lower = parameter
    else upper = parameter
    parameter = (lower + upper) / 2
  }

  return cubicCoordinate(parameter, y1, y2)
}

const easeInOut = (progress: number) => cubicBezier(progress, 0.42, 0, 0.58, 1)
const easePopup = (progress: number) =>
  cubicBezier(progress, 0.17, 0.17, 0.83, 0.83)
const easeHeaderOpacity = (progress: number) =>
  cubicBezier(progress, 0.17, 0.17, 0.67, 1)

function smoothstep(progress: number) {
  const clampedProgress = clamp01(progress)
  return clampedProgress * clampedProgress * (3 - 2 * clampedProgress)
}

function phaseProgress(timeMs: number, startMs: number, durationMs: number) {
  return clamp01((timeMs - startMs) / durationMs)
}

function getMarkerEnterScale(progress: number, start: number) {
  return easeInOut(clamp01((progress - start) / DOT_ENTER_DURATION))
}

function getMarkerExitScale(progress: number, start: number) {
  return 1 - easeInOut(clamp01((progress - start) / DOT_EXIT_DURATION))
}

function normalizeDegrees(degrees: number) {
  return ((degrees % 360) + 360) % 360
}

export function normalizeCycleTime(timeMs: number) {
  const normalizedTime =
    ((timeMs % GLOBE_CYCLE_MS) + GLOBE_CYCLE_MS) % GLOBE_CYCLE_MS

  // Keep exact timeline boundaries stable after many floating-point cycles.
  return Math.round(normalizedTime * 1000) / 1000
}

export function getGlobeCycleStartMs(timeMs: number) {
  return timeMs - normalizeCycleTime(timeMs)
}

/** Returns the geographic speed profile for the globe's actual orientation. */
export function getGlobeSpeedMultiplier(rotationRadians: number) {
  const degrees = normalizeDegrees(rotationRadians * RADIANS_TO_DEGREES)

  if (
    degrees >= PACIFIC_ACCELERATION_START_DEGREES &&
    degrees < PACIFIC_CRUISE_START_DEGREES
  ) {
    const progress =
      (degrees - PACIFIC_ACCELERATION_START_DEGREES) /
      (PACIFIC_CRUISE_START_DEGREES - PACIFIC_ACCELERATION_START_DEGREES)
    return 1 + (PACIFIC_ACCELERATION_MULTIPLIER - 1) * smoothstep(progress)
  }

  if (
    degrees >= PACIFIC_CRUISE_START_DEGREES &&
    degrees < PACIFIC_CRUISE_END_DEGREES
  ) {
    return PACIFIC_ACCELERATION_MULTIPLIER
  }

  if (
    degrees >= PACIFIC_CRUISE_END_DEGREES &&
    degrees < PACIFIC_ACCELERATION_END_DEGREES
  ) {
    const progress =
      (degrees - PACIFIC_CRUISE_END_DEGREES) /
      (PACIFIC_ACCELERATION_END_DEGREES - PACIFIC_CRUISE_END_DEGREES)
    return (
      PACIFIC_ACCELERATION_MULTIPLIER -
      (PACIFIC_ACCELERATION_MULTIPLIER - 1) * smoothstep(progress)
    )
  }

  return 1
}

const rotationLookup = (() => {
  const rotations = new Float64Array(ROTATION_LOOKUP_STEPS + 1)
  const rawTimes = new Float64Array(ROTATION_LOOKUP_STEPS + 1)
  const angleStep = 360 / ROTATION_LOOKUP_STEPS

  rotations[0] = ROTATION_START_DEGREES * DEGREES_TO_RADIANS

  for (let index = 1; index <= ROTATION_LOOKUP_STEPS; index += 1) {
    const midpointDegrees = ROTATION_START_DEGREES + (index - 0.5) * angleStep
    const multiplier = getGlobeSpeedMultiplier(
      midpointDegrees * DEGREES_TO_RADIANS
    )
    rawTimes[index] = rawTimes[index - 1] + angleStep / multiplier
    rotations[index] =
      (ROTATION_START_DEGREES + index * angleStep) * DEGREES_TO_RADIANS
  }

  const rawDuration = rawTimes[ROTATION_LOOKUP_STEPS]
  const times = Array.from(
    rawTimes,
    (time) => (time / rawDuration) * GLOBE_CYCLE_MS
  )

  return { rotations, times }
})()

function getRotationPhaseTimeMs(rotationRadians: number) {
  const offsetTurns =
    (rotationRadians - ROTATION_START_DEGREES * DEGREES_TO_RADIANS) /
    FULL_ROTATION_RADIANS
  const completedTurns = Math.floor(offsetTurns)
  const phase = offsetTurns - completedTurns
  const lookupPosition = phase * ROTATION_LOOKUP_STEPS
  const lower = Math.floor(lookupPosition)
  const upper = Math.min(ROTATION_LOOKUP_STEPS, lower + 1)
  const progress = lookupPosition - lower

  return {
    completedTurns,
    phaseTimeMs:
      rotationLookup.times[lower] +
      (rotationLookup.times[upper] - rotationLookup.times[lower]) * progress,
  }
}

/** Deterministic reference rotation used by debug time and initial render. */
export function getGlobeRotation(timeMs: number) {
  const cycleTime = normalizeCycleTime(timeMs)
  let lower = 0
  let upper = ROTATION_LOOKUP_STEPS

  while (lower + 1 < upper) {
    const midpoint = Math.floor((lower + upper) / 2)
    if (rotationLookup.times[midpoint] <= cycleTime) lower = midpoint
    else upper = midpoint
  }

  const segmentDuration =
    rotationLookup.times[upper] - rotationLookup.times[lower]
  const progress =
    segmentDuration > 0
      ? (cycleTime - rotationLookup.times[lower]) / segmentDuration
      : 0

  return (
    rotationLookup.rotations[lower] +
    (rotationLookup.rotations[upper] - rotationLookup.rotations[lower]) *
      progress
  )
}

/**
 * Advances an arbitrary, unwrapped globe orientation through the same
 * geographic speed profile as the deterministic reference timeline.
 */
export function advanceGlobeRotation(
  rotationRadians: number,
  durationMs: number
) {
  if (durationMs <= 0) return rotationRadians

  const { completedTurns, phaseTimeMs } =
    getRotationPhaseTimeMs(rotationRadians)
  const targetTimeMs =
    completedTurns * GLOBE_CYCLE_MS + phaseTimeMs + durationMs
  const targetTurn = Math.floor(targetTimeMs / GLOBE_CYCLE_MS)

  return targetTurn * FULL_ROTATION_RADIANS + getGlobeRotation(targetTimeMs)
}

export function getRouteVisualState(
  route: IGlobeRoute,
  timeMs: number,
  startedAtMs = route.startMs
): IRouteVisualState {
  const routeElapsedMs = timeMs - startedAtMs
  const lineProgress = routeElapsedMs / GLOBE_ROUTE_CYCLE_MS
  const dotProgress =
    (routeElapsedMs + GLOBE_ROUTE_DOT_LEAD_MS) / GLOBE_ROUTE_CYCLE_MS

  let startProgress = 0
  let endProgress = 0
  let opacity = 0

  if (lineProgress >= 0 && lineProgress < LINE_ENTRY_END) {
    endProgress = lineProgress / LINE_ENTRY_END
    opacity = 1
  } else if (lineProgress >= LINE_ENTRY_END && lineProgress < LINE_PAUSE_END) {
    endProgress = 1
    opacity = 1
  } else if (lineProgress >= LINE_PAUSE_END && lineProgress < LINE_EXIT_END) {
    startProgress =
      (lineProgress - LINE_PAUSE_END) / (LINE_EXIT_END - LINE_PAUSE_END)
    endProgress = 1
    opacity = 1
  }

  // The start marker leads the line, then starts scaling out on the exact
  // frame where the route begins trimming from its origin.
  const startMarkerScale =
    getMarkerEnterScale(dotProgress, 0) *
    getMarkerExitScale(lineProgress, LINE_PAUSE_END)

  // The destination must not announce itself ahead of the line. Its scale-in
  // starts only after the reveal reaches the final route segment.
  const endMarkerScale =
    getMarkerEnterScale(lineProgress, LINE_ENTRY_END) *
    getMarkerExitScale(lineProgress, END_DOT_EXIT_START)

  return {
    endProgress,
    endMarkerScale,
    opacity,
    startProgress,
    startMarkerScale,
  }
}

export function getGlobeCardMotionState(
  event: IGlobeCardEvent,
  timeMs: number,
  startedAtMs = event.startMs
): IGlobeCardMotionState {
  const localTime = timeMs - startedAtMs
  const exitStartMs = getGlobeCardExitStartMs(event)
  const endTime = exitStartMs + GLOBE_CARD_EXIT_MS

  if (localTime < 0 || localTime >= endTime) {
    return {
      backgroundOpacity: 0,
      headerOpacity: 0,
      headerScramble: 0,
      popupOpacity: 0,
      statusOpacity: 0,
      textOpacity: 0,
      textScramble: 0,
    }
  }

  const exitProgress = phaseProgress(localTime, exitStartMs, GLOBE_CARD_EXIT_MS)

  return {
    backgroundOpacity: easePopup(
      phaseProgress(localTime, 0, GLOBE_CARD_BACKGROUND_ENTER_MS)
    ),
    headerOpacity: easeHeaderOpacity(
      phaseProgress(localTime, 0, GLOBE_CARD_HEADER_ENTER_MS)
    ),
    headerScramble: easePopup(
      phaseProgress(localTime, 0, GLOBE_CARD_HEADER_SCRAMBLE_MS)
    ),
    popupOpacity: 1 - easePopup(exitProgress),
    statusOpacity: easePopup(
      phaseProgress(
        localTime,
        GLOBE_CARD_STATUS_DELAY_MS,
        GLOBE_CARD_STATUS_ENTER_MS
      )
    ),
    textOpacity: easePopup(
      phaseProgress(
        localTime,
        GLOBE_CARD_TEXT_DELAY_MS,
        GLOBE_CARD_TEXT_ENTER_MS
      )
    ),
    textScramble: easePopup(
      phaseProgress(
        localTime,
        GLOBE_CARD_TEXT_DELAY_MS,
        GLOBE_CARD_TEXT_ENTER_MS
      )
    ),
  }
}

export function getGlobeCardExitStartMs(event: IGlobeCardEvent) {
  return GLOBE_CARD_CONTENT_READY_MS + event.readHoldMs
}

export function getGlobeCardDurationMs(event: IGlobeCardEvent) {
  return getGlobeCardExitStartMs(event) + GLOBE_CARD_EXIT_MS
}

export function getActiveCardEvent(timeMs: number): IGlobeCardEvent | null {
  const cycleTime = normalizeCycleTime(timeMs)
  return (
    GLOBE_CARD_EVENTS.find((candidate) => {
      const endTime = candidate.startMs + getGlobeCardDurationMs(candidate)
      return cycleTime >= candidate.startMs && cycleTime < endTime
    }) ?? null
  )
}
