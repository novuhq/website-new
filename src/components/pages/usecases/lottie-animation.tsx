"use client"

import { useEffect, useRef } from "react"
import type { AnimationItem } from "lottie-web"

interface UseCaseLottieAnimationProps {
  src: string
}

function UseCaseLottieAnimation({ src }: UseCaseLottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    let animation: AnimationItem | null = null
    let cancelled = false
    let hasEnteredViewport = false

    const playWhenReady = () => {
      if (!animation) {
        return
      }

      if (reducedMotion) {
        animation.goToAndStop(0, true)
      } else if (hasEnteredViewport) {
        animation.play()
      }
    }

    const loadAnimation = async () => {
      const { default: lottie } = await import("lottie-web")

      if (cancelled) {
        return
      }

      const animationName = src
        .split("/")
        .at(-1)
        ?.replace("-lottie-data.json", "")

      animation = lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: src,
        assetsPath: `/images/pages/usecases/lottie-assets/pages/home/features/${animationName}/`,
      })
      animation.addEventListener("DOMLoaded", playWhenReady)
    }

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return
        }

        loadObserver.disconnect()
        void loadAnimation()
      },
      { rootMargin: "200px" }
    )

    const playObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return
        }

        hasEnteredViewport = true
        playObserver.disconnect()
        playWhenReady()
      },
      { threshold: 0.6 }
    )

    loadObserver.observe(container)
    playObserver.observe(container)

    return () => {
      cancelled = true
      loadObserver.disconnect()
      playObserver.disconnect()

      if (animation) {
        animation.removeEventListener("DOMLoaded", playWhenReady)
        animation.destroy()
      }
    }
  }, [src])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none aspect-[244/130] h-14 w-auto max-w-31 select-none md:h-16"
      data-usecase-lottie=""
      aria-hidden
    />
  )
}

export default UseCaseLottieAnimation
