import React from "react"
import { domAnimation, LazyMotion, m } from "motion/react"

const ANIMATION_DURATION = 0.2

interface IBurgerProps {
  isToggled: boolean
}

const Burger = ({ isToggled }: IBurgerProps) => (
  <LazyMotion features={domAnimation}>
    <m.div className="relative size-6">
      <m.span
        className="absolute top-1 left-0 block h-px w-4.5 rounded-full bg-white"
        animate={isToggled ? "toggled" : "initial"}
        variants={{
          initial: {
            top: 6,
            display: "block",
            transition: {
              duration: ANIMATION_DURATION,
              delay: ANIMATION_DURATION,
            },
          },
          toggled: {
            top: 12,
            transition: { duration: ANIMATION_DURATION },
            transitionEnd: { display: "none" },
          },
        }}
      />
      <m.span
        className="absolute top-3 left-0 block h-px w-3 rounded-full bg-white"
        animate={isToggled ? "toggled" : "initial"}
        variants={{
          initial: {
            display: "block",
          },
          toggled: {
            display: "none",
          },
        }}
      />
      <m.span
        className="absolute bottom-1 left-0 block h-px w-4.5 rounded-full bg-white"
        animate={isToggled ? "toggled" : "initial"}
        variants={{
          initial: {
            bottom: 6,
            display: "block",
            transition: {
              duration: ANIMATION_DURATION,
              delay: ANIMATION_DURATION,
            },
          },
          toggled: {
            bottom: 12,
            transition: { duration: ANIMATION_DURATION },
            transitionEnd: { display: "none" },
          },
        }}
      />
      <m.span
        className="absolute top-3 left-0 hidden h-px w-4.5 rounded-full bg-white"
        animate={isToggled ? "toggled" : "initial"}
        variants={{
          initial: {
            rotate: "0deg",
            transition: { duration: ANIMATION_DURATION },
            transitionEnd: { display: "none" },
          },
          toggled: {
            display: "block",
            rotate: "45deg",
            transition: {
              duration: ANIMATION_DURATION,
              delay: ANIMATION_DURATION,
            },
          },
        }}
      />
      <m.span
        className="absolute top-3 left-0 hidden h-px w-4.5 rounded-full bg-white"
        animate={isToggled ? "toggled" : "initial"}
        variants={{
          initial: {
            rotate: "0deg",
            transition: { duration: ANIMATION_DURATION },
            transitionEnd: { display: "none" },
          },
          toggled: {
            display: "block",
            rotate: "-45deg",
            transition: {
              duration: ANIMATION_DURATION,
              delay: ANIMATION_DURATION,
            },
          },
        }}
      />
      <span className="sr-only">{isToggled ? "Close menu" : "Open menu"}</span>
    </m.div>
  </LazyMotion>
)

export default Burger
