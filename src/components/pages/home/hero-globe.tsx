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
  getPreferredGlobeQuality,
  loadGlobeLandPoints,
} from "./globe/globe-assets"
import GlobeMetric from "./globe/globe-metric"

const loadGlobeRuntime = () => import("./globe/globe-runtime")
const GlobeRuntime = dynamic(loadGlobeRuntime, {
  loading: () => null,
  ssr: false,
})

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"
const MOBILE_QUERY = "(max-width: 767px)"

if (
  typeof window !== "undefined" &&
  !window.matchMedia(MOBILE_QUERY).matches &&
  !window.matchMedia(REDUCED_MOTION_QUERY).matches
) {
  // Start the split bundle as soon as the Hero module is evaluated. Rendering
  // still waits for hydration, while the browser can fetch Three.js in parallel.
  void loadGlobeRuntime()
  void loadGlobeLandPoints(getPreferredGlobeQuality()).catch(() => undefined)
}

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

export default function HeroGlobe() {
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

    // This is the primary above-the-fold visual. Start its split bundle after
    // hydration instead of waiting for every below-the-fold asset to finish.
    setShouldLoadRuntime(true)
  }, [animationUnavailable, isMobile, shouldReduceMotion])

  return (
    <div
      aria-hidden="true"
      className="absolute bottom-22 left-1/2 z-0 aspect-[1520/745] w-[180%] max-w-480 -translate-x-1/2 overflow-hidden md:aspect-[1920/931] lg:-top-16 lg:bottom-auto lg:w-480 lg:overflow-visible"
    >
      <div className="pointer-events-none absolute top-0 left-1/2 hidden h-full w-[max(120rem,100vw)] -translate-x-1/2 bg-[radial-gradient(ellipse_70rem_30rem_at_50%_72%,rgba(76,63,218,0.22),rgba(30,35,101,0.08)_54%,transparent_80%)] lg:block" />
      <div
        className="pointer-events-none absolute top-0 left-1/2 hidden h-full w-[max(120rem,100vw)] -translate-x-1/2 bg-center bg-repeat opacity-10 mix-blend-overlay lg:block"
        style={{
          backgroundImage: `url("${noiseLight.src}")`,
          backgroundSize: "256px 256px",
        }}
      />

      <div
        className={`pointer-events-none absolute inset-0 lg:right-auto lg:left-1/2 lg:z-20 lg:w-[max(120rem,100vw)] lg:-translate-x-1/2 ${playbackEnabled ? "invisible opacity-0" : runtimeReady ? "will-change-opacity opacity-0 transition-opacity duration-700 ease-out" : "will-change-opacity opacity-100"}`}
        onTransitionEnd={handlePosterTransitionEnd}
      >
        <picture className="absolute inset-0 block size-full lg:right-auto lg:left-1/2 lg:w-480 lg:-translate-x-1/2 lg:[mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
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
        <div
          className="pointer-events-none absolute inset-0 hidden bg-center bg-repeat opacity-[0.07] mix-blend-overlay lg:block"
          style={{
            backgroundImage: `url("${noiseLight.src}")`,
            backgroundSize: "256px 256px",
          }}
        />
      </div>

      {isMobile ? (
        <div className="absolute right-0 bottom-5 left-0 z-10 flex justify-center">
          <GlobeMetric compact />
        </div>
      ) : shouldLoadRuntime && !animationUnavailable ? (
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
          />
        </div>
      ) : null}
    </div>
  )
}
