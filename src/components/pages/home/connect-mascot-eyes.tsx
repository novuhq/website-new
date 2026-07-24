"use client"

import { useEffect, useRef } from "react"
import eyesImg from "@/images/pages/home/novu-connect/mascot-eyes.png"
import visorImg from "@/images/pages/home/novu-connect/mascot-visor.png"

import { cn } from "@/lib/utils"

// Brand mascot eyes (exported from Figma) that move freely. The dark visor
// asset covers the baked eyes in one-conversation.jpg, and the eyes asset floats
// on top and follows the cursor. All positions are percentages of the image box
// so they track the mascot across breakpoints.
const VISOR = { left: 16.99, top: 50.0, width: 19.96 }
const EYES = { left: 23.7, top: 64.3, width: 8.6 }
const MAX_OFFSET_RATIO = 0.014 // of the image width
const EASING = 0.16

export interface IConnectMascotEyesProps {
  className?: string
}

function ConnectMascotEyes({ className }: IConnectMascotEyesProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const eyesRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const eyes = eyesRef.current

    if (!root || !eyes || window.matchMedia("(hover: none)").matches) {
      return
    }

    const card = root.closest<HTMLElement>(".magic-bento-card") ?? root

    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0
    let rafId = 0
    let running = true

    const tick = () => {
      currentX += (targetX - currentX) * EASING
      currentY += (targetY - currentY) * EASING
      eyes.style.translate = `${currentX.toFixed(2)}px ${currentY.toFixed(2)}px`
      if (running) {
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)

    const handleMouseMove = (event: MouseEvent) => {
      const cardRect = card.getBoundingClientRect()
      const inside =
        event.clientX >= cardRect.left &&
        event.clientX <= cardRect.right &&
        event.clientY >= cardRect.top &&
        event.clientY <= cardRect.bottom

      if (!inside) {
        targetX = 0
        targetY = 0
        return
      }

      const eyesRect = eyes.getBoundingClientRect()
      const midX = eyesRect.left + eyesRect.width / 2
      const midY = eyesRect.top + eyesRect.height / 2
      const dx = event.clientX - midX
      const dy = event.clientY - midY
      const distance = Math.hypot(dx, dy) || 1
      const rootRect = root.getBoundingClientRect()
      const maxOffset = rootRect.width * MAX_OFFSET_RATIO
      const reach = Math.min(1, distance / (rootRect.width * 0.4))

      targetX = (dx / distance) * maxOffset * reach
      // eyes have a little less vertical travel so they stay in the visor
      targetY = (dy / distance) * maxOffset * reach * 0.7
    }

    const handleLeave = () => {
      targetX = 0
      targetY = 0
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.documentElement.addEventListener("mouseleave", handleLeave)

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      document.removeEventListener("mousemove", handleMouseMove)
      document.documentElement.removeEventListener("mouseleave", handleLeave)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className={cn(
        "pointer-events-none absolute aspect-[1954/944]",
        className,
        "z-[2]"
      )}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={visorImg.src}
        alt=""
        className="absolute"
        style={{
          left: `${VISOR.left}%`,
          top: `${VISOR.top}%`,
          width: `${VISOR.width}%`,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={eyesRef}
        src={eyesImg.src}
        alt=""
        className="absolute [will-change:translate]"
        style={{
          left: `${EYES.left}%`,
          top: `${EYES.top}%`,
          width: `${EYES.width}%`,
        }}
      />
    </div>
  )
}

export default ConnectMascotEyes
