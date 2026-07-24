import {
  GLOBE_AUTO_ROTATION_TIME_SCALE,
  GLOBE_ROUTE_REVEAL_MS,
  GLOBE_STORY_CARD_DELAY_MS,
} from "./globe-data"
import {
  advanceGlobeRotation,
  getGlobeCardDurationMs,
  getGlobeCardExitStartMs,
} from "./globe-timeline"
import type { IGlobeCardEvent, IGlobeRoute, TGlobeQuality } from "./globe-types"

const RADIANS_TO_DEGREES = 180 / Math.PI

// A story is armed just behind the left horizon. By the time its route has
// finished revealing, the destination and popup have moved into the readable
// part of the globe instead of already heading off the right edge.
const CARD_TRIGGER_MIN_DEGREES = -108
const CARD_TRIGGER_MAX_DEGREES = -52
const CARD_TRIGGER_IDEAL_DEGREES = -98
const CARD_START_MIN_DEGREES = -72
const CARD_START_MAX_DEGREES = 8
const CARD_READ_END_MAX_DEGREES = 76
const CARD_EXIT_END_MAX_DEGREES = 96
const VISIBLE_CARD_MIN_DEGREES = -120
const VISIBLE_CARD_MAX_DEGREES = -8
const VISIBLE_CARD_IDEAL_DEGREES = -72

const AMBIENT_WINDOW_MIN_DEGREES = -105
const AMBIENT_WINDOW_MAX_DEGREES = -48
const AMBIENT_IDEAL_DEGREES = -78

// Runtime records completion, not start, so this is a true post-playback rest.
export const GLOBE_CARD_COOLDOWN_MS = 3_500
export const GLOBE_AMBIENT_ROUTE_COOLDOWN_MS = 16_000
export const GLOBE_AMBIENT_ROUTE_GAP_MS = 1_100

type TCardTriggerMode = "crossing" | "visible"

export function normalizeSignedDegrees(degrees: number) {
  return ((((degrees + 180) % 360) + 360) % 360) - 180
}

export function getRelativeLongitude(
  longitude: number,
  rotationRadians: number
) {
  return normalizeSignedDegrees(
    longitude + rotationRadians * RADIANS_TO_DEGREES
  )
}

function getUnwrappedRelativeLongitude(
  longitude: number,
  rotationRadians: number
) {
  return longitude + rotationRadians * RADIANS_TO_DEGREES
}

function crossedPeriodicAngle(
  previousDegrees: number,
  currentDegrees: number,
  targetDegrees: number
) {
  if (currentDegrees <= previousDegrees) return false

  const turn = Math.ceil((previousDegrees - targetDegrees + 0.0001) / 360)
  const nextTarget = targetDegrees + turn * 360
  return nextTarget <= currentDegrees + 0.0001
}

function wasCardTriggerReached(
  longitude: number,
  previousRotationRadians: number | null,
  rotationRadians: number
) {
  const relativeLongitude = getRelativeLongitude(longitude, rotationRadians)
  if (
    relativeLongitude >= CARD_TRIGGER_MIN_DEGREES &&
    relativeLongitude <= CARD_TRIGGER_MAX_DEGREES
  ) {
    return true
  }

  if (previousRotationRadians === null) return false

  return crossedPeriodicAngle(
    getUnwrappedRelativeLongitude(longitude, previousRotationRadians),
    getUnwrappedRelativeLongitude(longitude, rotationRadians),
    CARD_TRIGGER_IDEAL_DEGREES
  )
}

function isCardReadableThroughExit(
  event: IGlobeCardEvent,
  rotationRadians: number,
  rotationTimeScale: number
) {
  const cardStartRotation = advanceGlobeRotation(
    rotationRadians,
    GLOBE_STORY_CARD_DELAY_MS * rotationTimeScale
  )
  const readEndRotation = advanceGlobeRotation(
    rotationRadians,
    (GLOBE_STORY_CARD_DELAY_MS + getGlobeCardExitStartMs(event)) *
      rotationTimeScale
  )
  const exitEndRotation = advanceGlobeRotation(
    rotationRadians,
    (GLOBE_STORY_CARD_DELAY_MS + getGlobeCardDurationMs(event)) *
      rotationTimeScale
  )
  const startLongitude = getRelativeLongitude(
    event.anchor.longitude,
    cardStartRotation
  )
  const readEndLongitude = getRelativeLongitude(
    event.anchor.longitude,
    readEndRotation
  )
  const exitEndLongitude = getRelativeLongitude(
    event.anchor.longitude,
    exitEndRotation
  )

  return (
    startLongitude >= CARD_START_MIN_DEGREES &&
    startLongitude <= CARD_START_MAX_DEGREES &&
    readEndLongitude <= CARD_READ_END_MAX_DEGREES &&
    exitEndLongitude <= CARD_EXIT_END_MAX_DEGREES
  )
}

function compareLastActivityAt(
  firstId: string,
  secondId: string,
  lastActivityAt: Readonly<Record<string, number>>
) {
  const first = lastActivityAt[firstId]
  const second = lastActivityAt[secondId]

  if (first === undefined && second !== undefined) return -1
  if (first !== undefined && second === undefined) return 1
  return (first ?? 0) - (second ?? 0)
}

export function pickGlobeCardEvents({
  events,
  lastCompletedAt,
  limit,
  nowMs,
  previousRotationRadians,
  rotationRadians,
  rotationTimeScale = 1,
  triggerMode = "crossing",
}: {
  events: IGlobeCardEvent[]
  lastCompletedAt: Readonly<Record<string, number>>
  limit: number
  nowMs: number
  previousRotationRadians: number | null
  rotationRadians: number
  rotationTimeScale?: number
  triggerMode?: TCardTriggerMode
}) {
  if (limit <= 0) return []

  return events
    .map((event, order) => ({
      event,
      order,
      relativeLongitude: getRelativeLongitude(
        event.anchor.longitude,
        rotationRadians
      ),
    }))
    .filter(({ event, relativeLongitude }) => {
      const lastCompletion = lastCompletedAt[event.id] ?? -Infinity
      if (nowMs - lastCompletion < GLOBE_CARD_COOLDOWN_MS) return false
      if (
        !isCardReadableThroughExit(event, rotationRadians, rotationTimeScale)
      ) {
        return false
      }

      return triggerMode === "visible"
        ? relativeLongitude >= VISIBLE_CARD_MIN_DEGREES &&
            relativeLongitude <= VISIBLE_CARD_MAX_DEGREES
        : wasCardTriggerReached(
            event.anchor.longitude,
            previousRotationRadians,
            rotationRadians
          )
    })
    .sort((first, second) => {
      const idealDegrees =
        triggerMode === "visible"
          ? VISIBLE_CARD_IDEAL_DEGREES
          : CARD_TRIGGER_IDEAL_DEGREES

      return (
        compareLastActivityAt(
          first.event.id,
          second.event.id,
          lastCompletedAt
        ) ||
        Math.abs(first.relativeLongitude - idealDegrees) -
          Math.abs(second.relativeLongitude - idealDegrees) ||
        first.order - second.order
      )
    })
    .slice(0, limit)
    .map(({ event }) => event)
}

function getRouteCenterLongitude(route: IGlobeRoute) {
  const fromRadians = (route.from.longitude * Math.PI) / 180
  const toRadians = (route.to.longitude * Math.PI) / 180

  return (
    (Math.atan2(
      Math.sin(fromRadians) + Math.sin(toRadians),
      Math.cos(fromRadians) + Math.cos(toRadians)
    ) *
      180) /
    Math.PI
  )
}

export function isRouteEnabledForQuality(
  route: IGlobeRoute,
  quality: TGlobeQuality
) {
  return (
    quality === "high" ||
    (quality === "medium" && route.tier !== "detail") ||
    (quality === "low" && route.tier === "narrative")
  )
}

export function pickAmbientGlobeRoute({
  blockedRouteIds,
  lastStartedAt,
  nowMs,
  quality,
  rotationRadians,
  routes,
}: {
  blockedRouteIds: ReadonlySet<string>
  lastStartedAt: Readonly<Record<string, number>>
  nowMs: number
  quality: TGlobeQuality
  rotationRadians: number
  routes: IGlobeRoute[]
}) {
  return (
    routes
      .map((route, order) => {
        const centerLongitude = getRouteCenterLongitude(route)
        return {
          centerLongitude,
          order,
          relativeLongitude: getRelativeLongitude(
            centerLongitude,
            rotationRadians
          ),
          route,
        }
      })
      .filter(({ centerLongitude, relativeLongitude, route }) => {
        const lastStart = lastStartedAt[route.id] ?? -Infinity
        const revealEndLongitude = getRelativeLongitude(
          centerLongitude,
          advanceGlobeRotation(
            rotationRadians,
            GLOBE_ROUTE_REVEAL_MS * GLOBE_AUTO_ROTATION_TIME_SCALE
          )
        )

        return (
          !blockedRouteIds.has(route.id) &&
          isRouteEnabledForQuality(route, quality) &&
          nowMs - lastStart >= GLOBE_AMBIENT_ROUTE_COOLDOWN_MS &&
          relativeLongitude >= AMBIENT_WINDOW_MIN_DEGREES &&
          relativeLongitude <= AMBIENT_WINDOW_MAX_DEGREES &&
          revealEndLongitude <= 55
        )
      })
      .sort(
        (first, second) =>
          compareLastActivityAt(
            first.route.id,
            second.route.id,
            lastStartedAt
          ) ||
          Math.abs(first.relativeLongitude - AMBIENT_IDEAL_DEGREES) -
            Math.abs(second.relativeLongitude - AMBIENT_IDEAL_DEGREES) ||
          first.order - second.order
      )[0]?.route ?? null
  )
}
