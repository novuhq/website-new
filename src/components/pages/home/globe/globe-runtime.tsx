"use client"

import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react"
import { Canvas, useThree } from "@react-three/fiber"
import {
  motion,
  motionValue,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "motion/react"

import { cn } from "@/lib/utils"

import {
  GLOBE_CARD_EVENTS,
  GLOBE_INITIAL_TIME_MS,
  GLOBE_ROUTES,
  GLOBE_STORY_CARD_DELAY_MS,
  GLOBE_STORY_REENTRY_DELAY_MS,
  GLOBE_STORY_SETTLE_MS,
} from "./globe-data"
import GlobeEventCard from "./globe-event-card"
import GlobeScene from "./globe-scene"
import { pickGlobeCardEvents } from "./globe-scheduler"
import {
  advanceGlobeRotation,
  getActiveCardEvent,
  getGlobeCardDurationMs,
  getGlobeCycleStartMs,
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
  onUnavailable: () => void
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
  event: IGlobeCardEvent
  startedAtMs: number
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

function getPreferredQuality(): TGlobeQuality {
  const navigatorWithMemory = navigator as Navigator & {
    deviceMemory?: number
  }
  const memory = navigatorWithMemory.deviceMemory ?? 8
  const cores = navigator.hardwareConcurrency ?? 8
  const width = window.innerWidth

  if (width < 768 || memory <= 4 || cores <= 4) return "low"
  if (width < 1440 || memory <= 8 || cores <= 8) return "medium"
  return "high"
}

function getInitialQuality(): TGlobeQuality {
  return typeof window === "undefined" ? "medium" : getPreferredQuality()
}

function getLowerQuality(quality: TGlobeQuality): TGlobeQuality {
  if (quality === "high") return "medium"
  return "low"
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
      -0.28,
      Math.min(0.28, interaction.pitch + interaction.velocityPitch * stepMs)
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
      stepMs * interaction.autoBlend
    )
  }
}

function getDebugTimeMs() {
  if (process.env.NODE_ENV === "production" || typeof window === "undefined") {
    return null
  }

  const rawValue = new URLSearchParams(window.location.search).get("globeTime")
  if (rawValue === null || rawValue.trim() === "") return null

  const value = Number(rawValue)
  return Number.isFinite(value) && value >= 0 ? value : null
}

function createCardPlayback(
  event: IGlobeCardEvent,
  startedAtMs: number
): IActiveCardPlayback {
  return {
    anchorOpacity: motionValue(0),
    anchorX: motionValue(-1000),
    anchorY: motionValue(-1000),
    event,
    startedAtMs,
  }
}

export default function GlobeRuntime({
  interactionMode = "rotate",
  onUnavailable,
}: IGlobeRuntimeProps) {
  const shouldReduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const debugTimeMsRef = useRef(getDebugTimeMs())
  const initialTimeMs = debugTimeMsRef.current ?? GLOBE_INITIAL_TIME_MS
  const debugCycleStartMs = getGlobeCycleStartMs(initialTimeMs)
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
  const debugCard = getActiveCardEvent(initialTimeMs)
  const bootstrapEvents =
    debugTimeMsRef.current === null
      ? GLOBE_CARD_EVENTS.filter((event) => (event.initialRouteLeadMs ?? 0) > 0)
      : []
  const routePlaybackRef = useRef<Record<string, number>>(
    debugTimeMsRef.current === null
      ? Object.fromEntries(
          bootstrapEvents.map((event) => [
            event.routeId,
            -(event.initialRouteLeadMs ?? 0),
          ])
        )
      : Object.fromEntries(
          GLOBE_ROUTES.map((route) => [
            route.id,
            debugCycleStartMs + route.startMs,
          ])
        )
  )
  const lastCardStartedAtRef = useRef<Record<string, number>>(
    Object.fromEntries(
      bootstrapEvents.map((event) => [
        event.id,
        -(event.initialRouteLeadMs ?? 0),
      ])
    )
  )
  const reentryReadyAtRef = useRef(0)
  const hasStartedPlaybackRef = useRef(false)
  const initialCardPlaybacksRef = useRef<IActiveCardPlayback[] | null>(null)
  if (initialCardPlaybacksRef.current === null) {
    initialCardPlaybacksRef.current = debugCard
      ? [createCardPlayback(debugCard, debugCycleStartMs + debugCard.startMs)]
      : bootstrapEvents.map((event) =>
          createCardPlayback(
            event,
            GLOBE_STORY_CARD_DELAY_MS - (event.initialRouteLeadMs ?? 0)
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
  const [quality, setQuality] = useState<TGlobeQuality>(getInitialQuality)
  const [sceneReady, setSceneReady] = useState(false)
  const timelineTime = useMotionValue(initialTimeMs)
  const active = inView && documentVisible
  const playbackActive = active && sceneReady

  useEffect(() => {
    const handleResize = () => {
      setQuality((currentQuality) => {
        const preferredQuality = getPreferredQuality()
        if (currentQuality === "low" || preferredQuality === "high") {
          return currentQuality
        }
        return preferredQuality
      })
    }

    window.addEventListener("resize", handleResize, { passive: true })
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      ([entry]) =>
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.45),
      { threshold: [0, 0.45, 1] }
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
    if (shouldReduceMotion || failed) {
      onUnavailable()
    }
  }, [failed, onUnavailable, shouldReduceMotion])

  useEffect(() => {
    if (!playbackActive) return

    reentryReadyAtRef.current = hasStartedPlaybackRef.current
      ? performance.now() + GLOBE_STORY_REENTRY_DELAY_MS
      : performance.now()
    hasStartedPlaybackRef.current = true
  }, [playbackActive])

  useEffect(() => {
    if (
      debugTimeMsRef.current !== null ||
      !playbackActive ||
      shouldReduceMotion ||
      failed
    ) {
      return
    }

    let animationFrame = 0
    let lastFrameTime = performance.now()

    const updateTimeline = (time: number) => {
      const delta = Math.max(0, time - lastFrameTime)
      lastFrameTime = time

      const interaction = interactionRef.current
      advanceGlobeInteraction(interaction, delta, time)

      const storyPlaybackPaused =
        interaction.dragging ||
        interaction.autoBlend < 0.98 ||
        Math.abs(interaction.velocityYaw) >= 0.00002 ||
        Math.abs(interaction.velocityPitch) >= 0.00002

      // Route geometry and every popup motion track share this clock. Freezing
      // it during drag/inertia keeps the current route and readable card on the
      // exact frame where the user started manipulating the globe.
      if (!storyPlaybackPaused) {
        elapsedRef.current += delta
        timelineTime.set(elapsedRef.current)
      }
      const storyTime = elapsedRef.current

      const currentCardPlaybacks = activeCardPlaybacksRef.current
      const remainingCardPlaybacks = currentCardPlaybacks.filter(
        (playback) =>
          storyTime <
          playback.startedAtMs + getGlobeCardDurationMs(playback.event)
      )
      if (remainingCardPlaybacks.length !== currentCardPlaybacks.length) {
        activeCardPlaybacksRef.current = remainingCardPlaybacks
        setActiveCardPlaybacks(remainingCardPlaybacks)
      }

      const interactionSettled =
        !storyPlaybackPaused && time >= reentryReadyAtRef.current

      if (interactionSettled) {
        const availableCardSlots =
          MAX_CONCURRENT_CARD_PLAYBACKS - activeCardPlaybacksRef.current.length

        if (availableCardSlots > 0) {
          const events = pickGlobeCardEvents({
            events: GLOBE_CARD_EVENTS,
            lastStartedAt: lastCardStartedAtRef.current,
            limit: availableCardSlots,
            nowMs: storyTime,
            previousRotationRadians: previousScheduleRotationRef.current,
            rotationRadians: interaction.rotation,
          })

          if (events.length > 0) {
            const cardStartedAtMs = storyTime + GLOBE_STORY_CARD_DELAY_MS
            const newPlaybacks = events.map((event) => {
              routePlaybackRef.current[event.routeId] = storyTime
              lastCardStartedAtRef.current[event.id] = storyTime

              return createCardPlayback(event, cardStartedAtMs)
            })
            const nextPlaybacks = [
              ...activeCardPlaybacksRef.current,
              ...newPlaybacks,
            ]

            activeCardPlaybacksRef.current = nextPlaybacks
            setActiveCardPlaybacks(nextPlaybacks)
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
  }, [failed, playbackActive, quality, shouldReduceMotion, timelineTime])

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

  const handleLoadError = useCallback(() => setFailed(true), [])
  const handleSlowFrame = useCallback(() => {
    setSceneReady(false)
    setQuality((currentQuality) => getLowerQuality(currentQuality))
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
        -0.28,
        Math.min(0.28, interaction.pitch + pitchDelta)
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

  const dpr: number | [number, number] =
    quality === "high" ? [1, 1.5] : quality === "medium" ? [1, 1.25] : 1

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
      <GlobeCanvasErrorBoundary onError={handleLoadError}>
        <motion.div
          animate={{ opacity: sceneReady ? 1 : 0 }}
          className="absolute inset-0 opacity-0"
          initial={{ opacity: 0 }}
          style={{ visibility: sceneReady ? "visible" : "hidden" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Canvas
            camera={{ far: 40, fov: 40, near: 0.1, position: [0, 0, 6.85] }}
            dpr={dpr}
            fallback={null}
            frameloop={active ? "always" : "demand"}
            gl={{
              alpha: true,
              antialias: quality !== "low",
              powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            className="bg-transparent"
          >
            <GlobeContextMonitor onContextLost={handleLoadError} />
            <GlobeScene
              active={active}
              activeCards={activeCards}
              elapsedRef={elapsedRef}
              interactionRef={interactionRef}
              onAnchorUpdate={handleAnchorUpdate}
              onLoadError={handleLoadError}
              onReady={handleSceneReady}
              onSlowFrame={handleSlowFrame}
              quality={quality}
              routePlaybackRef={routePlaybackRef}
            />
          </Canvas>
        </motion.div>
      </GlobeCanvasErrorBoundary>

      {activeCardPlaybacks.map((playback) => (
        <GlobeEventCard
          event={playback.event}
          key={playback.event.id}
          opacity={playback.anchorOpacity}
          startedAtMs={playback.startedAtMs}
          timeMs={timelineTime}
          x={playback.anchorX}
          y={playback.anchorY}
        />
      ))}

      <motion.div
        animate={{ opacity: sceneReady ? 1 : 0, y: sceneReady ? 0 : 6 }}
        className="absolute right-0 bottom-5 left-0 flex justify-center"
        initial={false}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative flex h-7.5 items-center justify-center border border-gray-20 bg-[#0B0C0E] px-3 font-mono text-sm leading-none tracking-tighter text-white uppercase">
          <span className="absolute inset-x-8 -top-16 h-20 bg-[radial-gradient(ellipse_at_center,rgba(159,74,255,0.24),transparent_70%)] blur-lg" />
          <span className="relative">2.5m messages just sent out today</span>
        </div>
      </motion.div>
    </div>
  )
}
