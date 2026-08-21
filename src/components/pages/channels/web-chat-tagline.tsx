"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

// Physics-style curve from the landing-page design skill.
const EASE = [0.32, 0.72, 0, 1] as const

// The brand boundary line. First sentence in white, the payoff in purple.
const WORDS: Array<{ text: string; accent: boolean }> = [
  { text: "We", accent: false },
  { text: "never", accent: false },
  { text: "run", accent: false },
  { text: "your", accent: false },
  { text: "brain.", accent: false },
  { text: "That's", accent: true },
  { text: "the", accent: true },
  { text: "whole", accent: true },
  { text: "point.", accent: true },
]

/**
 * The design skill's mandatory tagline reveal: words fade from muted to full
 * one by one, in reading order, as the line enters the viewport.
 */
export function TaglineReveal() {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: "-20% 0px" })
  const reduced = useReducedMotion()

  return (
    <h2
      ref={ref}
      className="text-[1.75rem] leading-[1.1] font-normal tracking-[-0.04em] text-balance md:text-[2.25rem]"
    >
      {WORDS.map((word, i) => (
        <motion.span
          key={i}
          className={word.accent ? "text-purple-1" : "text-white"}
          initial={reduced ? false : { opacity: 0.22 }}
          animate={reduced || inView ? { opacity: 1 } : { opacity: 0.22 }}
          transition={{
            duration: 0.5,
            ease: EASE,
            delay: reduced ? 0 : i * 0.11,
          }}
        >
          {word.text}
          {i < WORDS.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </h2>
  )
}

export default TaglineReveal
