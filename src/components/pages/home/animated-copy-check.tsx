"use client"

import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

interface IAnimatedCopyCheckProps {
  className?: string
  stroke?: string
}

function AnimatedCopyCheck({
  className,
  stroke = "black",
}: IAnimatedCopyCheckProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <svg
      className={cn("h-[15px] w-4", className)}
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <motion.path
        d="M2 8L6 12L14 4"
        stroke={stroke}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="square"
        initial={prefersReducedMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.32,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </svg>
  )
}

export default AnimatedCopyCheck
