"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

// Physics-style curve from the landing-page design skill.
const EASE = [0.32, 0.72, 0, 1] as const

export interface TaglineWord {
  text: string
  accent: boolean
}

interface TaglineRevealProps {
  words?: TaglineWord[]
  className?: string
}

/**
 * The old page's boundary-line copy, kept here as this component's default
 * so the still-live call in `page.tsx` (`<TaglineReveal />`, no props) keeps
 * rendering exactly as before until the integration pass swaps that section
 * out for `<Ownership />`. `words` is optional rather than required for
 * exactly this reason: `page.tsx` is owned by a later integration pass and
 * out of scope here, so the signature can't demand an argument that call
 * site doesn't pass.
 */
const DEFAULT_WORDS: TaglineWord[] = [
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
 *
 * `words` is caller-supplied (not hardcoded here) so this can be reused
 * across sections with different boundary-line copy; each consumer owns its
 * own copy in its data module.
 *
 * The reveal's un-hydrated resting state starts at `opacity: 0.22` rather
 * than 0 deliberately — this app does not hydrate in some render paths, and
 * `useInView` never fires there, so the initial opacity IS the shipped state
 * for those views. Do not lower it. (If a future caller's accent colour is
 * too muted to survive that compounded opacity, render statically instead
 * of reusing this component — see `Ownership`'s tagline for a worked
 * example and the reasoning.)
 */
export function TaglineReveal({
  words = DEFAULT_WORDS,
  className,
}: TaglineRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: "-20% 0px" })
  const reduced = useReducedMotion()

  return (
    <h2
      ref={ref}
      className={
        className ??
        "text-[1.75rem] leading-[1.1] font-normal tracking-[-0.04em] text-balance md:text-[2.25rem]"
      }
    >
      {words.map((word, i) => (
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
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </h2>
  )
}

export default TaglineReveal
