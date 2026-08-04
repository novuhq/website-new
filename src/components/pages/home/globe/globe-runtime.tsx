"use client"

import {
  Component,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { motionValue, useReducedMotion, type MotionValue } from "motion/react"
import * as THREE from "three"

import { cn } from "@/lib/utils"

import {
  getPreferredGlobeLandPointQuality,
  getPreferredGlobeQuality,
} from "./globe-assets"
import {
  GLOBE_AUTO_ROTATION_TIME_SCALE,
  GLOBE_CARD_CONTENT_READY_MS,
  GLOBE_CARD_EVENTS,
  GLOBE_INITIAL_TIME_MS,
  GLOBE_ROUTE_EXIT_MS,
  GLOBE_ROUTE_HOLD_MS,
  GLOBE_ROUTE_REVEAL_MS,
  GLOBE_ROUTES,
  GLOBE_STORY_CARD_DELAY_MS,
  GLOBE_STORY_GAP_MS,
  GLOBE_STORY_REENTRY_DELAY_MS,
  GLOBE_STORY_SETTLE_MS,
} from "./globe-data"
import GlobeEventCard from "./globe-event-card"
import GlobeScene from "./globe-scene"
import {
  GLOBE_AMBIENT_ROUTE_GAP_MS,
  pickAmbientGlobeRoute,
  pickGlobeCardEvents,
} from "./globe-scheduler"
import {
  advanceGlobeRotation,
  getGlobeCardDurationMs,
  getGlobeCardExitStartMs,
  getGlobeRotation,
} from "./globe-timeline"
import type {
  IGlobeCardEvent,
  IGlobeInteractionState,
  IProjectedAnchor,
  TGlobeInteractionMode,
  TGlobeQuality,
} from "./globe-types"

interface IGlobeRuntimeProps {
  interactionMode?: TGlobeInteractionMode
  onReady: () => void
  onUnavailable: () => void
  playbackEnabled: boolean
}

interface IActivePointer {
  id: number
  lastMoveTime: number
  lastTime: number
  lastX: number
  lastY: number
  startX: number
  startY: number
}

interface IActiveCardPlayback {
  anchorOpacity: MotionValue<number>
  anchorX: MotionValue<number>
  anchorY: MotionValue<number>
  cardTime: MotionValue<number>
  event: IGlobeCardEvent
  id: string
}

interface IGlobeCanvasErrorBoundaryProps {
  children: ReactNode
  onError: () => void
}

interface IGlobeContextMonitorProps {
  onContextLost: () => void
}

const POINTER_DRAG_THRESHOLD_PX = 6
const POINTER_VELOCITY_STALE_MS = 80
const MAX_INTERACTION_STEP_MS = 16
const MAX_CONCURRENT_CARD_PLAYBACKS = 3
const MAX_CONCURRENT_AMBIENT_ROUTES = 4
const ROUTE_RESUME_EASE_MS = 240
const SCHEDULER_INTERVAL_MS = 100
const PITCH_MIN = -0.28
const PITCH_MAX = 0.28
const PERFORMANCE_SAMPLE_WINDOW_MS = 5_000
const SLOW_FRAME_THRESHOLD_MS = 22
const SLOW_FRAME_RATIO = 0.4
const GLOBE_MIN_VISIBLE_RATIO = 0.08
const ACTIVE_ROUTE_DURATION_MS =
  GLOBE_ROUTE_REVEAL_MS + GLOBE_ROUTE_HOLD_MS + GLOBE_ROUTE_EXIT_MS
const STORY_ROUTE_IDS = new Set(GLOBE_CARD_EVENTS.map(({ routeId }) => routeId))
const AMBIENT_ROUTES = GLOBE_ROUTES.filter(({ id }) => !STORY_ROUTE_IDS.has(id))

class GlobeCanvasErrorBoundary extends Component<
  IGlobeCanvasErrorBoundaryProps,
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    return this.state.hasError ? null : this.props.children
  }
}

function GlobeContextMonitor({ onContextLost }: IGlobeContextMonitorProps) {
  const canvas = useThree((state) => state.gl.domElement)

  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault()
      onContextLost()
    }

    canvas.addEventListener("webglcontextlost", handleContextLost)
    return () =>
      canvas.removeEventListener("webglcontextlost", handleContextLost)
  }, [canvas, onContextLost])

  return null
}

function GlobeViewportCamera({
  virtualViewportRef,
}: {
  virtualViewportRef: RefObject<HTMLDivElement | null>
}) {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)

  useLayoutEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return

    const virtualViewport = virtualViewportRef.current
    if (!virtualViewport) return

    const fullWidth = virtualViewport.clientWidth
    const fullHeight = virtualViewport.clientHeight
    if (fullWidth <= 0 || fullHeight <= 0) return

    const manualCamera = camera as THREE.PerspectiveCamera & {
      manual?: boolean
    }
    const previousManual = manualCamera.manual
    const viewWidth = Math.min(size.width, fullWidth)
    const viewHeight = Math.min(size.height, fullHeight)

    // Keep the original 1920-wide projection, but ask WebGL to rasterize only
    // the central part that can actually appear inside the browser viewport.
    // The resulting pixels and projected DOM anchors stay in the same places.
    manualCamera.manual = true
    camera.aspect = fullWidth / fullHeight

    if (viewWidth < fullWidth || viewHeight < fullHeight) {
      camera.setViewOffset(
        fullWidth,
        fullHeight,
        (fullWidth - viewWidth) / 2,
        (fullHeight - viewHeight) / 2,
        viewWidth,
        viewHeight
      )
    } else {
      camera.clearViewOffset()
    }

    camera.updateProjectionMatrix()

    return () => {
      camera.clearViewOffset()
      manualCamera.manual = previousManual
      camera.updateProjectionMatrix()
    }
  }, [camera, size.height, size.width, virtualViewportRef])

  return null
}

function GlobePerformanceMonitor({
  enabled,
  onSustainedSlowFrames,
}: {
  enabled: boolean
  onSustainedSlowFrames: () => void
}) {
  const sampleRef = useRef({ elapsedMs: 0, frames: 0, slowFrames: 0 })

  useFrame((_, deltaSeconds) => {
    const sample = sampleRef.current

    if (!enabled) {
      sample.elapsedMs = 0
      sample.frames = 0
      sample.slowFrames = 0
      return
    }

    const deltaMs = Math.min(deltaSeconds * 1000, 100)
    sample.elapsedMs += deltaMs
    sample.frames += 1
    if (deltaMs > SLOW_FRAME_THRESHOLD_MS) sample.slowFrames += 1

    if (sample.elapsedMs < PERFORMANCE_SAMPLE_WINDOW_MS) return

    if (
      sample.frames >= 20 &&
      sample.slowFrames / sample.frames >= SLOW_FRAME_RATIO
    ) {
      onSustainedSlowFrames()
    }

    sample.elapsedMs = 0
    sample.frames = 0
    sample.slowFrames = 0
  })

  return null
}

function getInitialQuality(): TGlobeQuality {
  return typeof window === "undefined" ? "medium" : getPreferredGlobeQuality()
}

function getInitialLandPointQuality(): TGlobeQuality {
  return typeof window === "undefined"
    ? "medium"
    : getPreferredGlobeLandPointQuality()
}

function advanceGlobeInteraction(
  interaction: IGlobeInteractionState,
  deltaMs: number,
  frameTimeMs: number
) {
  if (interaction.dragging || deltaMs <= 0) return

  let remainingMs = deltaMs
  let stepTimeMs = frameTimeMs - deltaMs

  while (remainingMs > 0) {
    const stepMs = Math.min(MAX_INTERACTION_STEP_MS, remainingMs)
    remainingMs -= stepMs
    stepTimeMs += stepMs

    interaction.rotation += interaction.velocityYaw * stepMs
    interaction.pitch = Math.max(
      PITCH_MIN,
      Math.min(
        PITCH_MAX,
        interaction.pitch + interaction.velocityPitch * stepMs
      )
    )

    const damping = Math.pow(0.88, stepMs * 0.06)
    interaction.velocityYaw *= damping
    interaction.velocityPitch *= damping

    const settleProgress = Math.min(
      1,
      Math.max(
        0,
        (stepTimeMs - interaction.releasedAtMs) / GLOBE_STORY_SETTLE_MS
      )
    )
    interaction.autoBlend =
      interaction.releasedAtMs === -Infinity
        ? 1
        : settleProgress * settleProgress * (3 - 2 * settleProgress)
    interaction.rotation = advanceGlobeRotation(
      interaction.rotation,
      stepMs * interaction.autoBlend * GLOBE_AUTO_ROTATION_TIME_SCALE
    )
  }
}

function createCardPlayback(
  event: IGlobeCardEvent,
  id: string,
  initialCardTimeMs: number
): IActiveCardPlayback {
  return {
    anchorOpacity: motionValue(0),
    anchorX: motionValue(-1000),
    anchorY: motionValue(-1000),
    cardTime: motionValue(initialCardTimeMs),
    event,
    id,
  }
}

export default function GlobeRuntime({
  interactionMode = "rotate",
  onReady,
  onUnavailable,
  playbackEnabled,
}: IGlobeRuntimeProps) {
  const shouldReduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const initialTimeMs = GLOBE_INITIAL_TIME_MS
  const elapsedRef = useRef(initialTimeMs)
  const interactionRef = useRef<IGlobeInteractionState>({
    autoBlend: 1,
    dragging: false,
    pitch: 0,
    releasedAtMs: -Infinity,
    rotation: getGlobeRotation(initialTimeMs),
    velocityPitch: 0,
    velocityYaw: 0,
  })
  const activePointerRef = useRef<IActivePointer | null>(null)
  const previousScheduleRotationRef = useRef<number | null>(
    interactionRef.current.rotation
  )
  const bootstrapEvents = GLOBE_CARD_EVENTS.filter(
    (event) => (event.initialRouteLeadMs ?? 0) > 0
  )
  const routePlaybackRef = useRef<Record<string, number>>(
    Object.fromEntries(
      bootstrapEvents.map((event) => [
        event.routeId,
        -(event.initialRouteLeadMs ?? 0),
      ])
    )
  )
  const lastCardCompletedAtRef = useRef<Record<string, number>>({})
  const lastAmbientRouteStartedAtRef = useRef<Record<string, number>>({})
  const lastAmbientRouteSpawnAtRef = useRef(-Infinity)
  const lastStoryRouteSpawnAtRef = useRef(
    bootstrapEvents.length > 0
      ? Math.max(
          ...bootstrapEvents.map((event) => -(event.initialRouteLeadMs ?? 0))
        )
      : -Infinity
  )
  const lastScheduleCheckAtRef = useRef(-Infinity)
  const playbackSequenceRef = useRef(bootstrapEvents.length)
  const reentryReadyAtRef = useRef(0)
  const hasStartedPlaybackRef = useRef(false)
  const initialCardPlaybacksRef = useRef<IActiveCardPlayback[] | null>(null)
  if (initialCardPlaybacksRef.current === null) {
    initialCardPlaybacksRef.current = bootstrapEvents.map((event, index) =>
      createCardPlayback(
        event,
        `${event.id}:bootstrap-${index}`,
        (event.initialRouteLeadMs ?? 0) - GLOBE_STORY_CARD_DELAY_MS
      )
    )
  }
  const [activeCardPlaybacks, setActiveCardPlaybacks] = useState<
    IActiveCardPlayback[]
  >(initialCardPlaybacksRef.current)
  const activeCardPlaybacksRef = useRef<IActiveCardPlayback[]>(
    initialCardPlaybacksRef.current
  )
  const activeCards = activeCardPlaybacks.map(({ event }) => event)
  const [documentVisible, setDocumentVisible] = useState(true)
  const [failed, setFailed] = useState(false)
  // Hero is above the fold. Start immediately, then let IntersectionObserver
  // pause the renderer after the user scrolls it out of view.
  const [inView, setInView] = useState(true)
  const [quality] = useState<TGlobeQuality>(getInitialQuality)
  const [landPointQuality] = useState<TGlobeQuality>(getInitialLandPointQuality)
  const [dprCap, setDprCap] = useState(() =>
    quality === "high" ? 1.5 : quality === "medium" ? 1.25 : 1
  )
  const [sceneReady, setSceneReady] = useState(false)
  const active = inView && documentVisible
  const playbackActive = active && sceneReady && playbackEnabled

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      ([entry]) =>
        setInView(
          entry.isIntersecting &&
            entry.intersectionRatio >= GLOBE_MIN_VISIBLE_RATIO
        ),
      { threshold: [0, GLOBE_MIN_VISIBLE_RATIO, 1] }
    )

    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      setDocumentVisible(document.visibilityState === "visible")
    }

    handleVisibilityChange()
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  useEffect(() => {
    const hideRuntimeBeforePageExit = () => {
      // During a reload the old DOM can remain visible for a frame after its
      // WebGL context has already been reset. Hide the whole runtime so its DOM
      // cards cannot outlive the canvas while the next document is loading.
      rootRef.current?.style.setProperty("opacity", "0")
    }
    const handleReloadKey = (event: KeyboardEvent) => {
      if (
        event.key === "F5" ||
        ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r")
      ) {
        hideRuntimeBeforePageExit()
      }
    }
    const restoreRuntimeAfterPageShow = () => {
      rootRef.current?.style.removeProperty("opacity")
    }
    // Chromium can clear the old WebGL backbuffer well before `pagehide`
    // during a reload. Keep the earlier guard there (and in Safari), but avoid
    // installing it in Firefox where `beforeunload` disables the bfcache.
    const needsEarlyReloadGuard = !/firefox/i.test(navigator.userAgent)

    if (needsEarlyReloadGuard) {
      window.addEventListener("beforeunload", hideRuntimeBeforePageExit, {
        capture: true,
      })
    }
    window.addEventListener("pagehide", hideRuntimeBeforePageExit, {
      capture: true,
    })
    window.addEventListener("pageshow", restoreRuntimeAfterPageShow)
    window.addEventListener("keydown", handleReloadKey, { capture: true })

    return () => {
      if (needsEarlyReloadGuard) {
        window.removeEventListener("beforeunload", hideRuntimeBeforePageExit, {
          capture: true,
        })
      }
      window.removeEventListener("pagehide", hideRuntimeBeforePageExit, {
        capture: true,
      })
      window.removeEventListener("pageshow", restoreRuntimeAfterPageShow)
      window.removeEventListener("keydown", handleReloadKey, { capture: true })
    }
  }, [])

  useEffect(() => {
    if (shouldReduceMotion || failed) {
      onUnavailable()
    }
  }, [failed, onUnavailable, shouldReduceMotion])

  useEffect(() => {
    if (!sceneReady) return
    onReady()
  }, [onReady, sceneReady])

  useEffect(() => {
    if (!playbackActive) return

    reentryReadyAtRef.current = hasStartedPlaybackRef.current
      ? performance.now() + GLOBE_STORY_REENTRY_DELAY_MS
      : performance.now()
    hasStartedPlaybackRef.current = true
  }, [playbackActive])

  useEffect(() => {
    if (!playbackActive || shouldReduceMotion || failed) {
      return
    }

    let animationFrame = 0
    let lastFrameTime = performance.now()

    const updateTimeline = (time: number) => {
      const delta = Math.max(0, time - lastFrameTime)
      lastFrameTime = time

      const interaction = interactionRef.current
      advanceGlobeInteraction(interaction, delta, time)

      const routeResumeProgress =
        interaction.releasedAtMs === -Infinity
          ? 1
          : Math.min(
              1,
              Math.max(
                0,
                (time - interaction.releasedAtMs) / ROUTE_RESUME_EASE_MS
              )
            )
      const routePlaybackRate = interaction.dragging
        ? 0
        : routeResumeProgress * routeResumeProgress
      const routeDelta = delta * routePlaybackRate
      elapsedRef.current += routeDelta
      const routeTime = elapsedRef.current

      const currentCardPlaybacks = activeCardPlaybacksRef.current
      currentCardPlaybacks.forEach((playback) => {
        const localTime = playback.cardTime.get()

        if (localTime < 0) {
          playback.cardTime.set(Math.min(0, localTime + routeDelta))
          return
        }

        const exitStartMs = getGlobeCardExitStartMs(playback.event)
        const holdPaused =
          interaction.dragging &&
          localTime >= GLOBE_CARD_CONTENT_READY_MS &&
          localTime < exitStartMs

        if (!holdPaused) playback.cardTime.set(localTime + delta)
      })

      const remainingCardPlaybacks = currentCardPlaybacks.filter(
        (playback) =>
          playback.cardTime.get() < getGlobeCardDurationMs(playback.event)
      )
      if (remainingCardPlaybacks.length !== currentCardPlaybacks.length) {
        currentCardPlaybacks.forEach((playback) => {
          if (!remainingCardPlaybacks.includes(playback)) {
            lastCardCompletedAtRef.current[playback.event.id] = routeTime
          }
        })
        activeCardPlaybacksRef.current = remainingCardPlaybacks
        setActiveCardPlaybacks(remainingCardPlaybacks)
      }

      const interactionSettled =
        !interaction.dragging &&
        interaction.autoBlend >= 0.85 &&
        time >= reentryReadyAtRef.current
      const schedulerDue =
        time - lastScheduleCheckAtRef.current >= SCHEDULER_INTERVAL_MS

      if (interactionSettled && schedulerDue) {
        lastScheduleCheckAtRef.current = time
        const availableCardSlots =
          MAX_CONCURRENT_CARD_PLAYBACKS - activeCardPlaybacksRef.current.length
        const storySpawnDue =
          routeTime - lastStoryRouteSpawnAtRef.current >= GLOBE_STORY_GAP_MS

        if (availableCardSlots > 0 && storySpawnDue) {
          const activeEventIds = new Set(
            activeCardPlaybacksRef.current.map(({ event }) => event.id)
          )
          const events = pickGlobeCardEvents({
            events: GLOBE_CARD_EVENTS.filter(
              (event) => !activeEventIds.has(event.id)
            ),
            lastCompletedAt: lastCardCompletedAtRef.current,
            limit: 1,
            nowMs: routeTime,
            previousRotationRadians: previousScheduleRotationRef.current,
            rotationRadians: interaction.rotation,
            rotationTimeScale: GLOBE_AUTO_ROTATION_TIME_SCALE,
            triggerMode: "visible",
          })

          if (events.length > 0) {
            const newPlaybacks = events.map((event) => {
              routePlaybackRef.current[event.routeId] = routeTime
              playbackSequenceRef.current += 1

              return createCardPlayback(
                event,
                `${event.id}:${playbackSequenceRef.current}`,
                -GLOBE_STORY_CARD_DELAY_MS
              )
            })
            const nextPlaybacks = [
              ...activeCardPlaybacksRef.current,
              ...newPlaybacks,
            ]

            lastStoryRouteSpawnAtRef.current = routeTime
            activeCardPlaybacksRef.current = nextPlaybacks
            setActiveCardPlaybacks(nextPlaybacks)
          }
        }

        const activeStoryRouteIds = new Set(
          activeCardPlaybacksRef.current.map(({ event }) => event.routeId)
        )
        const activeAmbientRouteIds = Object.entries(
          lastAmbientRouteStartedAtRef.current
        )
          .filter(
            ([, startedAtMs]) =>
              routeTime - startedAtMs < ACTIVE_ROUTE_DURATION_MS
          )
          .map(([routeId]) => routeId)
        const ambientSpawnDue =
          routeTime - lastAmbientRouteSpawnAtRef.current >=
          GLOBE_AMBIENT_ROUTE_GAP_MS

        if (
          ambientSpawnDue &&
          activeAmbientRouteIds.length < MAX_CONCURRENT_AMBIENT_ROUTES
        ) {
          const ambientRoute = pickAmbientGlobeRoute({
            blockedRouteIds: new Set([
              ...activeStoryRouteIds,
              ...activeAmbientRouteIds,
            ]),
            lastStartedAt: lastAmbientRouteStartedAtRef.current,
            nowMs: routeTime,
            quality,
            rotationRadians: interaction.rotation,
            routes: AMBIENT_ROUTES,
          })

          if (ambientRoute) {
            routePlaybackRef.current[ambientRoute.id] = routeTime
            lastAmbientRouteStartedAtRef.current[ambientRoute.id] = routeTime
            lastAmbientRouteSpawnAtRef.current = routeTime
          }
        }
      }

      // Updating this even while scheduling is gated prevents a drag or
      // viewport re-entry from being mistaken for an automatic longitude
      // crossing and replaying a story immediately.
      previousScheduleRotationRef.current = interaction.rotation

      animationFrame = requestAnimationFrame(updateTimeline)
    }

    animationFrame = requestAnimationFrame(updateTimeline)
    return () => cancelAnimationFrame(animationFrame)
  }, [failed, playbackActive, quality, shouldReduceMotion])

  const handleAnchorUpdate = useCallback(
    (eventId: string, { visible, x, y }: IProjectedAnchor) => {
      const playback = activeCardPlaybacksRef.current.find(
        ({ event }) => event.id === eventId
      )
      if (!playback) return

      playback.anchorX.set(x)
      playback.anchorY.set(y)
      playback.anchorOpacity.set(visible && sceneReady ? 1 : 0)
    },
    [sceneReady]
  )

  const handleSceneReady = useCallback(() => {
    setSceneReady(true)
  }, [])

  const handleSustainedSlowFrames = useCallback(() => {
    setDprCap((currentDpr) =>
      currentDpr > 1.25 ? 1.25 : currentDpr > 1 ? 1 : currentDpr
    )
  }, [])

  const handleLoadError = useCallback(() => setFailed(true), [])
  const handleContextLost = useCallback(() => {
    rootRef.current?.style.setProperty("opacity", "0")
    setFailed(true)
  }, [])

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (
        interactionMode !== "rotate" ||
        shouldReduceMotion ||
        !event.isPrimary ||
        event.button !== 0 ||
        activePointerRef.current
      ) {
        return
      }

      event.currentTarget.setPointerCapture(event.pointerId)
      const now = performance.now()
      activePointerRef.current = {
        id: event.pointerId,
        lastMoveTime: now,
        lastTime: now,
        lastX: event.clientX,
        lastY: event.clientY,
        startX: event.clientX,
        startY: event.clientY,
      }
    },
    [interactionMode, shouldReduceMotion]
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const pointer = activePointerRef.current
      if (!pointer || pointer.id !== event.pointerId) return

      const interaction = interactionRef.current
      const totalDistance = Math.hypot(
        event.clientX - pointer.startX,
        event.clientY - pointer.startY
      )

      if (!interaction.dragging) {
        if (totalDistance < POINTER_DRAG_THRESHOLD_PX) return

        interaction.autoBlend = 0
        interaction.dragging = true
        interaction.velocityPitch = 0
        interaction.velocityYaw = 0
      }

      const now = performance.now()
      const deltaTime = Math.max(8, now - pointer.lastTime)
      const deltaX = event.clientX - pointer.lastX
      const deltaY = event.clientY - pointer.lastY
      const yawDelta = deltaX * 0.0042
      const pitchDelta = deltaY * 0.0024
      const velocityWeight = 0.65

      interaction.rotation += yawDelta
      interaction.pitch = Math.max(
        PITCH_MIN,
        Math.min(PITCH_MAX, interaction.pitch + pitchDelta)
      )
      interaction.velocityYaw =
        interaction.velocityYaw * (1 - velocityWeight) +
        (yawDelta / deltaTime) * velocityWeight
      interaction.velocityPitch =
        interaction.velocityPitch * (1 - velocityWeight) +
        (pitchDelta / deltaTime) * velocityWeight
      pointer.lastMoveTime = now
      pointer.lastTime = now
      pointer.lastX = event.clientX
      pointer.lastY = event.clientY
    },
    []
  )

  const finishPointerGesture = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, allowInertia: boolean) => {
      const pointer = activePointerRef.current
      if (!pointer || pointer.id !== event.pointerId) return

      const now = performance.now()
      const interaction = interactionRef.current
      const wasDragging = interaction.dragging

      if (
        !allowInertia ||
        now - pointer.lastMoveTime > POINTER_VELOCITY_STALE_MS
      ) {
        interaction.velocityPitch = 0
        interaction.velocityYaw = 0
      }

      interaction.dragging = false
      if (wasDragging) interaction.releasedAtMs = now
      activePointerRef.current = null

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    },
    []
  )

  const handlePointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      finishPointerGesture(event, true)
    },
    [finishPointerGesture]
  )

  const handlePointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      finishPointerGesture(event, false)
    },
    [finishPointerGesture]
  )

  if (shouldReduceMotion || failed) return null

  const dpr: number | [number, number] = dprCap > 1 ? [1, dprCap] : 1

  return (
    <div
      className={cn(
        "absolute inset-0 z-10 select-none",
        interactionMode === "rotate" && "cursor-grab active:cursor-grabbing"
      )}
      onLostPointerCapture={handlePointerCancel}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      ref={rootRef}
      style={{ touchAction: "pan-y" }}
    >
      <div className="absolute inset-y-0 left-1/2 w-screen max-w-full -translate-x-1/2">
        <GlobeCanvasErrorBoundary onError={handleLoadError}>
          <div
            className="absolute inset-0"
            ref={canvasHostRef}
            style={{ opacity: sceneReady ? 1 : 0 }}
          >
            <Canvas
              camera={{ far: 40, fov: 40, near: 0.1, position: [0, 0, 6.85] }}
              dpr={dpr}
              fallback={null}
              frameloop={active && sceneReady ? "always" : "demand"}
              gl={{
                alpha: true,
                antialias: false,
                powerPreference: "high-performance",
              }}
              onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
              className="bg-transparent"
            >
              <GlobeViewportCamera virtualViewportRef={rootRef} />
              <GlobePerformanceMonitor
                enabled={playbackEnabled && dprCap > 1}
                onSustainedSlowFrames={handleSustainedSlowFrames}
              />
              <GlobeContextMonitor onContextLost={handleContextLost} />
              <GlobeScene
                activeCards={activeCards}
                elapsedRef={elapsedRef}
                interactionRef={interactionRef}
                landPointQuality={landPointQuality}
                onAnchorUpdate={handleAnchorUpdate}
                onLoadError={handleLoadError}
                onReady={handleSceneReady}
                quality={quality}
                routePlaybackRef={routePlaybackRef}
              />
            </Canvas>
          </div>
        </GlobeCanvasErrorBoundary>

        {activeCardPlaybacks.map((playback) => (
          <GlobeEventCard
            event={playback.event}
            key={playback.id}
            opacity={playback.anchorOpacity}
            startedAtMs={0}
            timeMs={playback.cardTime}
            x={playback.anchorX}
            y={playback.anchorY}
          />
        ))}
      </div>
    </div>
  )
}
