"use client"

import { useCallback, useEffect, useState, useSyncExternalStore } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import noiseLight from "@/images/pages/home/bento-noise-light.webp"
import globeGlow from "@/images/pages/home/hero/bg.jpg"
import heroPoster from "@/images/pages/home/hero/hero-bg.jpg"

const GlobeRuntime = dynamic(() => import("./globe/globe-runtime"), {
  loading: () => null,
  ssr: false,
})

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

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

export default function HeroGlobe() {
  const shouldReduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  )
  const [isHydrated, setIsHydrated] = useState(false)
  const [animationUnavailable, setAnimationUnavailable] = useState(false)
  const [shouldLoadRuntime, setShouldLoadRuntime] = useState(false)
  const showStaticPoster =
    isHydrated && (shouldReduceMotion || animationUnavailable)
  const handleUnavailable = useCallback(() => {
    setAnimationUnavailable(true)
  }, [])

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (shouldReduceMotion || animationUnavailable) return

    let idleCallbackId: number | null = null
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const loadRuntime = () => setShouldLoadRuntime(true)
    const scheduleRuntime = () => {
      if ("requestIdleCallback" in window) {
        idleCallbackId = window.requestIdleCallback(loadRuntime, {
          timeout: 1_200,
        })
      } else {
        timeoutId = setTimeout(loadRuntime, 250)
      }
    }

    if (document.readyState === "complete") {
      scheduleRuntime()
    } else {
      window.addEventListener("load", scheduleRuntime, { once: true })
    }

    return () => {
      window.removeEventListener("load", scheduleRuntime)
      if (idleCallbackId !== null) window.cancelIdleCallback(idleCallbackId)
      if (timeoutId !== null) clearTimeout(timeoutId)
    }
  }, [animationUnavailable, shouldReduceMotion])

  return (
    <div
      aria-hidden="true"
      className="absolute bottom-22 left-1/2 aspect-[1920/931] w-[180%] max-w-480 -translate-x-1/2 overflow-hidden lg:-top-16 lg:bottom-auto lg:w-480"
    >
      {showStaticPoster ? (
        <Image
          alt=""
          className="pointer-events-none absolute inset-0 mx-auto w-full max-w-none"
          height={931}
          loading="eager"
          priority
          quality={100}
          sizes="(min-width: 1024px) 1920px, 180vw"
          src={heroPoster}
          width={1920}
        />
      ) : (
        <div className="absolute inset-0 overflow-hidden mask-radial-from-black mask-radial-from-60% mask-radial-to-transparent mask-radial-to-85% mask-ellipse [mask-size:80%_100%] mask-top">
          <Image
            alt=""
            className="pointer-events-none absolute -bottom-[22%] left-1/2 z-0 h-auto w-[90%] max-w-none -translate-x-1/2"
            height={912}
            loading="eager"
            priority
            quality={90}
            sizes="(min-width: 1024px) 1728px, 162vw"
            src={globeGlow}
            width={1800}
          />
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-center bg-repeat opacity-10 mix-blend-overlay"
            style={{
              backgroundImage: `url("${noiseLight.src}")`,
              backgroundSize: "1024px 1024px",
            }}
          />

          {shouldLoadRuntime ? (
            <GlobeRuntime onUnavailable={handleUnavailable} />
          ) : null}
        </div>
      )}
    </div>
  )
}
