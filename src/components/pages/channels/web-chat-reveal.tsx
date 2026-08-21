"use client"

import { type ReactNode, useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

// Physics-style curve from the landing-page design skill.
const EASE = [0.32, 0.72, 0, 1] as const

type RevealProps = {
  children: ReactNode
  className?: string
  /** Delay in seconds, for staggering siblings. */
  delay?: number
  /** Vertical offset the content rises from, in px. */
  y?: number
}

/**
 * Fades and lifts its children into view once, on scroll.
 * Falls back to a static wrapper when the user prefers reduced motion.
 */
export function Reveal({ children, className, delay = 0, y = 20 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12% 0px" })
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

export default Reveal
