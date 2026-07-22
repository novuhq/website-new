import {
  GLOBE_CARD_BACKGROUND_ENTER_MS,
  GLOBE_CARD_EVENTS,
  GLOBE_CARD_EXIT_MS,
  GLOBE_CARD_EXIT_START_MS,
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

const ROTATION_START_DEGREES = 100
const ROTATION_END_DEGREES = ROTATION_START_DEGREES + 360
const PACIFIC_ACCELERATION_MULTIPLIER = 1.5
const PACIFIC_ACCELERATION_START_MS = 3_137.097
const PACIFIC_RAMP_DURATION_MS = 1_054.839
const PACIFIC_CRUISE_DURATION_MS = 1_582.258
const PACIFIC_CRUISE_START_MS =
  PACIFIC_ACCELERATION_START_MS + PACIFIC_RAMP_DURATION_MS
const PACIFIC_CRUISE_END_MS =
  PACIFIC_CRUISE_START_MS + PACIFIC_CRUISE_DURATION_MS
const PACIFIC_ACCELERATION_END_MS =
  PACIFIC_CRUISE_END_MS + PACIFIC_RAMP_DURATION_MS

// A smoothstep ramp averages the base and peak multipliers. Expressing the
// whole cycle as equivalent base-speed time preserves the established
// acceleration window, the 16.35 s loop, and an exact 360-degree turn.
const PACIFIC_RAMP_AVERAGE_MULTIPLIER =
  (1 + PACIFIC_ACCELERATION_MULTIPLIER) / 2
const PACIFIC_EXTRA_EQUIVALENT_MS =
  PACIFIC_RAMP_DURATION_MS * (PACIFIC_RAMP_AVERAGE_MULTIPLIER - 1) * 2 +
  PACIFIC_CRUISE_DURATION_MS * (PACIFIC_ACCELERATION_MULTIPLIER - 1)
const ROTATION_BASE_DEGREES_PER_MS =
  (ROTATION_END_DEGREES - ROTATION_START_DEGREES) /
  (GLOBE_CYCLE_MS + PACIFIC_EXTRA_EQUIVALENT_MS)
const PACIFIC_ACCELERATION_START_DEGREES =
  ROTATION_START_DEGREES +
  ROTATION_BASE_DEGREES_PER_MS * PACIFIC_ACCELERATION_START_MS
const PACIFIC_CRUISE_START_DEGREES =
  PACIFIC_ACCELERATION_START_DEGREES +
  ROTATION_BASE_DEGREES_PER_MS *
    PACIFIC_RAMP_DURATION_MS *
    PACIFIC_RAMP_AVERAGE_MULTIPLIER
const PACIFIC_CRUISE_END_DEGREES =
  PACIFIC_CRUISE_START_DEGREES +
  ROTATION_BASE_DEGREES_PER_MS *
    PACIFIC_CRUISE_DURATION_MS *
    PACIFIC_ACCELERATION_MULTIPLIER
const PACIFIC_ACCELERATION_END_DEGREES =
  PACIFIC_CRUISE_END_DEGREES +
  ROTATION_BASE_DEGREES_PER_MS *
    PACIFIC_RAMP_DURATION_MS *
    PACIFIC_RAMP_AVERAGE_MULTIPLIER
const DEGREES_TO_RADIANS = Math.PI / 180

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

// Integral of smoothstep from 0 to progress. At 1 it equals 0.5, which keeps
// the angular distance of the acceleration and deceleration ramps symmetric.
function integratedSmoothstep(progress: number) {
  const clampedProgress = clamp01(progress)
  return (
    clampedProgress * clampedProgress * clampedProgress -
    0.5 * clampedProgress * clampedProgress * clampedProgress * clampedProgress
  )
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

function getRouteElapsedMs(
  cycleTime: number,
  routeStartMs: number,
  absoluteTimeMs: number
) {
  const elapsedMs = cycleTime - routeStartMs
  const previousCycleElapsedMs = elapsedMs + GLOBE_CYCLE_MS

  // Late routes are allowed to finish after the master timeline loops. The
  // globe itself ends one full turn from where it started, so carrying only an
  // unfinished route across this boundary is visually continuous.
  if (
    absoluteTimeMs >= GLOBE_CYCLE_MS &&
    elapsedMs < -GLOBE_ROUTE_DOT_LEAD_MS &&
    previousCycleElapsedMs < GLOBE_ROUTE_CYCLE_MS
  ) {
    return previousCycleElapsedMs
  }

  return elapsedMs
}

export function normalizeCycleTime(timeMs: number) {
  const normalizedTime =
    ((timeMs % GLOBE_CYCLE_MS) + GLOBE_CYCLE_MS) % GLOBE_CYCLE_MS

  // Keep exact timeline boundaries stable after many floating-point cycles.
  return Math.round(normalizedTime * 1000) / 1000
}

export function getGlobeRotation(timeMs: number) {
  const cycleTime = normalizeCycleTime(timeMs)
  let rotationDegrees: number

  if (cycleTime <= PACIFIC_ACCELERATION_START_MS) {
    rotationDegrees =
      ROTATION_START_DEGREES + ROTATION_BASE_DEGREES_PER_MS * cycleTime
  } else if (cycleTime <= PACIFIC_CRUISE_START_MS) {
    const progress =
      (cycleTime - PACIFIC_ACCELERATION_START_MS) / PACIFIC_RAMP_DURATION_MS
    const baseDistance =
      ROTATION_BASE_DEGREES_PER_MS * PACIFIC_RAMP_DURATION_MS * progress
    const accelerationDistance =
      ROTATION_BASE_DEGREES_PER_MS *
      PACIFIC_RAMP_DURATION_MS *
      (PACIFIC_ACCELERATION_MULTIPLIER - 1) *
      integratedSmoothstep(progress)

    rotationDegrees =
      PACIFIC_ACCELERATION_START_DEGREES + baseDistance + accelerationDistance
  } else if (cycleTime <= PACIFIC_CRUISE_END_MS) {
    rotationDegrees =
      PACIFIC_CRUISE_START_DEGREES +
      ROTATION_BASE_DEGREES_PER_MS *
        PACIFIC_ACCELERATION_MULTIPLIER *
        (cycleTime - PACIFIC_CRUISE_START_MS)
  } else if (cycleTime <= PACIFIC_ACCELERATION_END_MS) {
    const progress =
      (cycleTime - PACIFIC_CRUISE_END_MS) / PACIFIC_RAMP_DURATION_MS
    const acceleratedDistance =
      ROTATION_BASE_DEGREES_PER_MS *
      PACIFIC_RAMP_DURATION_MS *
      PACIFIC_ACCELERATION_MULTIPLIER *
      progress
    const decelerationDistance =
      ROTATION_BASE_DEGREES_PER_MS *
      PACIFIC_RAMP_DURATION_MS *
      (PACIFIC_ACCELERATION_MULTIPLIER - 1) *
      integratedSmoothstep(progress)

    rotationDegrees =
      PACIFIC_CRUISE_END_DEGREES + acceleratedDistance - decelerationDistance
  } else {
    rotationDegrees =
      PACIFIC_ACCELERATION_END_DEGREES +
      ROTATION_BASE_DEGREES_PER_MS * (cycleTime - PACIFIC_ACCELERATION_END_MS)
  }

  // Positive Y rotation moves land from left to right. North America is
  // centered at t=0. Rotation is linear over land, eases up to 1.5x while the
  // Pacific crosses the viewport, then returns smoothly to the base speed.
  return rotationDegrees * DEGREES_TO_RADIANS
}

export function getRouteVisualState(
  route: IGlobeRoute,
  timeMs: number
): IRouteVisualState {
  const cycleTime = normalizeCycleTime(timeMs)
  const routeElapsedMs = getRouteElapsedMs(cycleTime, route.startMs, timeMs)
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
  timeMs: number
): IGlobeCardMotionState {
  const localTime = normalizeCycleTime(timeMs) - event.startMs
  const endTime = GLOBE_CARD_EXIT_START_MS + GLOBE_CARD_EXIT_MS

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

  const exitProgress = phaseProgress(
    localTime,
    GLOBE_CARD_EXIT_START_MS,
    GLOBE_CARD_EXIT_MS
  )

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

export function getActiveCardEvent(timeMs: number): IGlobeCardEvent | null {
  const cycleTime = normalizeCycleTime(timeMs)
  return (
    GLOBE_CARD_EVENTS.find((candidate) => {
      const endTime =
        candidate.startMs + GLOBE_CARD_EXIT_START_MS + GLOBE_CARD_EXIT_MS
      return cycleTime >= candidate.startMs && cycleTime < endTime
    }) ?? null
  )
}
