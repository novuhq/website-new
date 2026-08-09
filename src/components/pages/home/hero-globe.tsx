"use client"

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type TransitionEvent,
} from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import globeGlow from "@/images/pages/home/hero/bg.jpg"
import heroPoster from "@/images/pages/home/hero/hero-poster.webp"
import mobileGlobeBackground from "@/images/pages/home/hero/mobile-poster.webp"
import noiseLight from "@/images/pages/home/surface-noise.webp"

import {
  getPreferredGlobeLandPointQuality,
  loadGlobeLandPoints,
} from "./globe/globe-assets"
import GlobeMetric from "./globe/globe-metric"
import type { IGlobeCardEvent } from "./globe/globe-types"

const loadGlobeRuntime = () => import("./globe/globe-runtime")
const GlobeRuntime = dynamic(loadGlobeRuntime, {
  loading: () => null,
  ssr: false,
})

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"
const MOBILE_QUERY = "(max-width: 767px)"

function preloadGlobeResources() {
  if (
    typeof window === "undefined" ||
    window.matchMedia(MOBILE_QUERY).matches ||
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  ) {
    return
  }

  void loadGlobeRuntime().catch(() => undefined)
  void loadGlobeLandPoints(getPreferredGlobeLandPointQuality()).catch(
    () => undefined
  )
}

// Begin the two independent network branches as soon as the desktop hero
// module executes, before React finishes hydrating the component.
preloadGlobeResources()

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQuery.addEventListener("change", onChange)
  return () => mediaQuery.removeEventListener("change", onChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function getServerReducedMotionSnapshot() {
  return false
}

function subscribeToMobile(onChange: () => void) {
  const mediaQuery = window.matchMedia(MOBILE_QUERY)
  mediaQuery.addEventListener("change", onChange)
  return () => mediaQuery.removeEventListener("change", onChange)
}

function getMobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches
}

function getServerMobileSnapshot() {
  return false
}

export default function HeroGlobe({
  cardEvents,
}: {
  cardEvents?: IGlobeCardEvent[]
}) {
  const shouldReduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  )
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    getMobileSnapshot,
    getServerMobileSnapshot
  )
  const [animationUnavailable, setAnimationUnavailable] = useState(false)
  const [playbackEnabled, setPlaybackEnabled] = useState(false)
  const [runtimeReady, setRuntimeReady] = useState(false)
  const [shouldLoadRuntime, setShouldLoadRuntime] = useState(false)
  const handleUnavailable = useCallback(() => {
    setPlaybackEnabled(false)
    setRuntimeReady(false)
    setAnimationUnavailable(true)
  }, [])
  const handleRuntimeReady = useCallback(() => setRuntimeReady(true), [])
  const handlePosterTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (
        event.currentTarget !== event.target ||
        event.propertyName !== "opacity" ||
        !runtimeReady
      ) {
        return
      }

      setPlaybackEnabled(true)
    },
    [runtimeReady]
  )
  useEffect(() => {
    if (isMobile) {
      setPlaybackEnabled(false)
      setRuntimeReady(false)
      setShouldLoadRuntime(false)
      return
    }

    if (shouldReduceMotion || animationUnavailable) {
      setPlaybackEnabled(false)
      setRuntimeReady(false)
      setShouldLoadRuntime(false)
      return
    }

    // Start the runtime chunk and the exact quality data request together.
    // GlobeLandPoints reuses the cached request when it mounts, removing the
    // previous runtime-import -> mount -> land-fetch waterfall.
    preloadGlobeResources()
    setShouldLoadRuntime(true)
  }, [animationUnavailable, isMobile, shouldReduceMotion])

  return (
    <div
      aria-hidden="true"
      className="absolute bottom-18 left-1/2 z-0 aspect-[1520/745] w-[180%] max-w-480 -translate-x-1/2 overflow-hidden md:bottom-21.5 md:aspect-[1920/931] lg:w-480 lg:overflow-visible 2xl:-top-16 2xl:bottom-auto"
    >
      <div className="pointer-events-none absolute top-0 left-1/2 hidden h-full w-[max(120rem,100vw)] -translate-x-1/2 bg-[radial-gradient(ellipse_70rem_30rem_at_50%_72%,rgba(76,63,218,0.22),rgba(30,35,101,0.08)_54%,transparent_80%)] lg:block" />

      <div
        className={`pointer-events-none absolute inset-0 md:z-20 lg:right-auto lg:left-1/2 lg:w-[max(120rem,100vw)] lg:-translate-x-1/2 ${playbackEnabled ? "invisible opacity-0" : runtimeReady ? "will-change-opacity opacity-0 transition-opacity duration-300 ease-out" : "will-change-opacity opacity-100"}`}
        onTransitionEnd={handlePosterTransitionEnd}
      >
        <picture className="absolute inset-0 block size-full lg:right-auto lg:left-1/2 lg:w-480 lg:-translate-x-1/2">
          <source media="(min-width: 768px)" srcSet={heroPoster.src} />
          <img
            alt=""
            className="absolute inset-0 size-full max-w-none object-cover"
            decoding="async"
            fetchPriority="high"
            height={744}
            loading="eager"
            src={mobileGlobeBackground.src}
            width={1520}
          />
        </picture>
      </div>

      <div
        className="pointer-events-none absolute top-0 left-1/2 hidden h-full w-[max(120rem,100vw)] -translate-x-1/2 bg-center bg-repeat opacity-10 mix-blend-overlay lg:block"
        style={{
          backgroundImage: `url("${noiseLight.src}")`,
          backgroundSize: "256px 256px",
        }}
      />

      <div className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 justify-center md:bottom-6">
        <GlobeMetric />
      </div>

      {!isMobile && shouldLoadRuntime && !animationUnavailable ? (
        <div className="absolute inset-0 overflow-hidden mask-radial-from-black mask-radial-from-60% mask-radial-to-transparent mask-radial-to-85% mask-ellipse [mask-size:80%_100%] mask-top lg:z-10">
          <Image
            alt=""
            className="pointer-events-none absolute -bottom-[22%] left-1/2 z-0 h-auto w-[90%] max-w-none -translate-x-1/2"
            height={912}
            loading="eager"
            quality={90}
            sizes="(min-width: 1024px) 1728px, 162vw"
            src={globeGlow}
            width={1800}
          />
          <GlobeRuntime
            onReady={handleRuntimeReady}
            onUnavailable={handleUnavailable}
            playbackEnabled={playbackEnabled}
            cardEvents={cardEvents}
          />
        </div>
      ) : null}
    </div>
  )
}
