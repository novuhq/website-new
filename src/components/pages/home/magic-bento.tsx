"use client"

import { useEffect, useRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

import "@/styles/magic-bento.css"

// Ported from reactbits.dev/components/magic-bento (spotlight, border glow,
// star particles, click ripple) without the GSAP dependency. Attaches to
// descendants carrying the `magic-bento-card` class.
const SPOTLIGHT_RADIUS = 300
const PARTICLE_COUNT = 12

export interface IMagicBentoProps {
  children: ReactNode
  className?: string
  /** spawn hover star particles and click ripples (spotlight + border glow
   * always run). Turn off for content-heavy cards. */
  particles?: boolean
}

function MagicBento({
  children,
  className,
  particles = true,
}: IMagicBentoProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current

    if (!root || window.matchMedia("(hover: none)").matches) {
      return
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>(".magic-bento-card")
    )

    if (cards.length === 0) {
      return
    }

    const spotlight = document.createElement("div")
    spotlight.className = "magic-bento-spotlight"
    document.body.appendChild(spotlight)

    const proximity = SPOTLIGHT_RADIUS * 0.5
    const fadeDistance = SPOTLIGHT_RADIUS * 0.75

    const resetGlow = () => {
      spotlight.style.opacity = "0"
      cards.forEach((card) => {
        card.style.setProperty("--glow-intensity", "0")
        card.classList.remove("is-glowing")
      })
    }

    let rafId = 0

    const handleMouseMove = (event: MouseEvent) => {
      if (rafId) {
        return
      }

      rafId = requestAnimationFrame(() => {
        rafId = 0

        const sectionRect = root.getBoundingClientRect()
        const { clientX, clientY } = event
        const isNearSection =
          clientX >= sectionRect.left - fadeDistance &&
          clientX <= sectionRect.right + fadeDistance &&
          clientY >= sectionRect.top - fadeDistance &&
          clientY <= sectionRect.bottom + fadeDistance

        if (!isNearSection) {
          resetGlow()

          return
        }

        spotlight.style.left = `${clientX}px`
        spotlight.style.top = `${clientY}px`

        let minDistance = Infinity

        cards.forEach((card) => {
          const rect = card.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          const distance = Math.max(
            0,
            Math.hypot(clientX - centerX, clientY - centerY) -
              Math.max(rect.width, rect.height) / 2
          )

          minDistance = Math.min(minDistance, distance)

          let intensity = 0

          if (distance <= proximity) {
            intensity = 1
          } else if (distance <= fadeDistance) {
            intensity = (fadeDistance - distance) / (fadeDistance - proximity)
          }

          card.style.setProperty(
            "--glow-x",
            `${((clientX - rect.left) / rect.width) * 100}%`
          )
          card.style.setProperty(
            "--glow-y",
            `${((clientY - rect.top) / rect.height) * 100}%`
          )
          card.style.setProperty("--glow-intensity", String(intensity))
          card.style.setProperty("--glow-radius", `${SPOTLIGHT_RADIUS}px`)
          card.classList.toggle("is-glowing", intensity > 0.6)
        })

        spotlight.style.opacity =
          minDistance <= proximity
            ? "0.8"
            : minDistance <= fadeDistance
              ? String(
                  ((fadeDistance - minDistance) / (fadeDistance - proximity)) *
                    0.8
                )
              : "0"
      })
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.documentElement.addEventListener("mouseleave", resetGlow)

    const cardCleanups = !particles
      ? []
      : cards.map((card) => {
          let timeouts: number[] = []
          let spawned: HTMLElement[] = []

          const clearParticles = () => {
            timeouts.forEach((id) => window.clearTimeout(id))
            spawned.forEach((particle) => particle.remove())
            timeouts = []
            spawned = []
          }

          const handleEnter = () => {
            if (reducedMotion) {
              return
            }

            clearParticles()

            for (let index = 0; index < PARTICLE_COUNT; index++) {
              timeouts.push(
                window.setTimeout(() => {
                  const particle = document.createElement("div")
                  particle.className = "magic-bento-particle"
                  particle.style.left = `${10 + Math.random() * 80}%`
                  particle.style.top = `${10 + Math.random() * 80}%`
                  particle.style.setProperty(
                    "--mb-tx",
                    `${(Math.random() - 0.5) * 90}px`
                  )
                  particle.style.setProperty(
                    "--mb-ty",
                    `${(Math.random() - 0.5) * 90}px`
                  )
                  particle.style.setProperty(
                    "--mb-dur",
                    `${2 + Math.random() * 2}s`
                  )
                  card.appendChild(particle)
                  spawned.push(particle)
                }, index * 100)
              )
            }
          }

          const handleClick = (event: MouseEvent) => {
            if (reducedMotion) {
              return
            }

            const rect = card.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            const maxDistance = Math.max(
              Math.hypot(x, y),
              Math.hypot(rect.width - x, y),
              Math.hypot(x, rect.height - y),
              Math.hypot(rect.width - x, rect.height - y)
            )

            const ripple = document.createElement("div")
            ripple.className = "magic-bento-ripple"
            ripple.style.width = `${maxDistance * 2}px`
            ripple.style.height = `${maxDistance * 2}px`
            ripple.style.left = `${x - maxDistance}px`
            ripple.style.top = `${y - maxDistance}px`
            card.appendChild(ripple)
            window.setTimeout(() => ripple.remove(), 800)
          }

          card.addEventListener("mouseenter", handleEnter)
          card.addEventListener("mouseleave", clearParticles)
          card.addEventListener("click", handleClick)

          return () => {
            clearParticles()
            card.removeEventListener("mouseenter", handleEnter)
            card.removeEventListener("mouseleave", clearParticles)
            card.removeEventListener("click", handleClick)
          }
        })

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener("mousemove", handleMouseMove)
      document.documentElement.removeEventListener("mouseleave", resetGlow)
      spotlight.remove()
      cardCleanups.forEach((cleanup) => cleanup())
    }
  }, [particles])

  return (
    <div className={cn("magic-bento", className)} ref={rootRef}>
      {children}
    </div>
  )
}

export default MagicBento
