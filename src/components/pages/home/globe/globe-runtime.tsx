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
import { motion, useMotionValue, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

import { GLOBE_INITIAL_TIME_MS } from "./globe-data"
import GlobeEventCard from "./globe-event-card"
import GlobeScene from "./globe-scene"
import { getActiveCardEvent } from "./globe-timeline"
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

interface ILastPointer {
  time: number
  x: number
  y: number
}

interface IGlobeCanvasErrorBoundaryProps {
  children: ReactNode
  onError: () => void
}

interface IGlobeContextMonitorProps {
  onContextLost: () => void
}

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

function getDebugTimeMs() {
  if (process.env.NODE_ENV === "production" || typeof window === "undefined") {
    return null
  }

  const rawValue = new URLSearchParams(window.location.search).get("globeTime")
  if (rawValue === null || rawValue.trim() === "") return null

  const value = Number(rawValue)
  return Number.isFinite(value) && value >= 0 ? value : null
}

export default function GlobeRuntime({
  interactionMode = "rotate",
  onUnavailable,
}: IGlobeRuntimeProps) {
  const shouldReduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const debugTimeMsRef = useRef(getDebugTimeMs())
  const initialTimeMs = debugTimeMsRef.current ?? GLOBE_INITIAL_TIME_MS
  const elapsedRef = useRef(initialTimeMs)
  const interactionRef = useRef<IGlobeInteractionState>({
    dragging: false,
    pitch: 0,
    velocityPitch: 0,
    velocityYaw: 0,
    yaw: 0,
  })
  const lastPointerRef = useRef<ILastPointer | null>(null)
  const activeCardIdRef = useRef<string | null>(
    getActiveCardEvent(initialTimeMs)?.id ?? null
  )
  const [activeCard, setActiveCard] = useState<IGlobeCardEvent | null>(() =>
    getActiveCardEvent(initialTimeMs)
  )
  const [documentVisible, setDocumentVisible] = useState(true)
  const [failed, setFailed] = useState(false)
  // Hero is above the fold. Start immediately, then let IntersectionObserver
  // pause the renderer after the user scrolls it out of view.
  const [inView, setInView] = useState(true)
  const [quality, setQuality] = useState<TGlobeQuality>(getInitialQuality)
  const [sceneReady, setSceneReady] = useState(false)
  const anchorX = useMotionValue(-1000)
  const anchorY = useMotionValue(-1000)
  const anchorOpacity = useMotionValue(0)
  const timelineTime = useMotionValue(initialTimeMs)
  const active = inView && documentVisible

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
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "180px 0px", threshold: 0.04 }
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
    if (
      debugTimeMsRef.current !== null ||
      !active ||
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
      elapsedRef.current += delta
      timelineTime.set(elapsedRef.current)

      const nextCard = getActiveCardEvent(elapsedRef.current)
      const nextCardId = nextCard?.id ?? null
      if (nextCardId !== activeCardIdRef.current) {
        activeCardIdRef.current = nextCardId
        setActiveCard(nextCard)
      }

      animationFrame = requestAnimationFrame(updateTimeline)
    }

    animationFrame = requestAnimationFrame(updateTimeline)
    return () => cancelAnimationFrame(animationFrame)
  }, [active, failed, shouldReduceMotion, timelineTime])

  const handleAnchorUpdate = useCallback(
    ({ visible, x, y }: IProjectedAnchor) => {
      const root = rootRef.current
      const width = root?.clientWidth ?? 0
      const height = root?.clientHeight ?? 0
      let resolvedX = x

      if (activeCard && width > 0) {
        if (activeCard.placement === "right") {
          resolvedX = Math.min(width - activeCard.widthPx - 20, Math.max(20, x))
        } else if (activeCard.placement === "left") {
          resolvedX = Math.min(width - 20, Math.max(activeCard.widthPx + 20, x))
        } else {
          resolvedX = Math.min(width - 150, Math.max(150, x))
        }
      }

      const minimumY =
        activeCard?.placement === "above" ||
        activeCard?.placement === "above-left"
          ? 650
          : 330

      anchorX.set(resolvedX)
      anchorY.set(
        height > 0 ? Math.min(height - 230, Math.max(minimumY, y)) : y
      )
      anchorOpacity.set(visible && sceneReady ? 1 : 0)
    },
    [activeCard, anchorOpacity, anchorX, anchorY, sceneReady]
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
      if (interactionMode !== "rotate" || shouldReduceMotion) return

      event.currentTarget.setPointerCapture(event.pointerId)
      interactionRef.current.dragging = true
      interactionRef.current.velocityPitch = 0
      interactionRef.current.velocityYaw = 0
      lastPointerRef.current = {
        time: performance.now(),
        x: event.clientX,
        y: event.clientY,
      }
    },
    [interactionMode, shouldReduceMotion]
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const interaction = interactionRef.current
      const previousPointer = lastPointerRef.current
      if (!interaction.dragging || !previousPointer) return

      const now = performance.now()
      const deltaTime = Math.max(8, now - previousPointer.time)
      const deltaX = event.clientX - previousPointer.x
      const deltaY = event.clientY - previousPointer.y
      const yawDelta = deltaX * 0.0042
      const pitchDelta = deltaY * 0.0024
      const velocityScale = 16 / deltaTime

      interaction.yaw += yawDelta
      interaction.pitch = Math.max(
        -0.28,
        Math.min(0.28, interaction.pitch + pitchDelta)
      )
      interaction.velocityYaw = yawDelta * velocityScale
      interaction.velocityPitch = pitchDelta * velocityScale
      lastPointerRef.current = {
        time: now,
        x: event.clientX,
        y: event.clientY,
      }
    },
    []
  )

  const handlePointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      interactionRef.current.dragging = false
      lastPointerRef.current = null
    },
    []
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
      onPointerCancel={handlePointerEnd}
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
              activeCard={activeCard}
              elapsedRef={elapsedRef}
              interactionRef={interactionRef}
              onAnchorUpdate={handleAnchorUpdate}
              onLoadError={handleLoadError}
              onReady={handleSceneReady}
              onSlowFrame={handleSlowFrame}
              quality={quality}
            />
          </Canvas>
        </motion.div>
      </GlobeCanvasErrorBoundary>

      <GlobeEventCard
        event={activeCard}
        opacity={anchorOpacity}
        timeMs={timelineTime}
        x={anchorX}
        y={anchorY}
      />

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
