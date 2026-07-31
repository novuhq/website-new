import { domAnimation, LazyMotion, m } from "motion/react"

const TRANSITION = {
  duration: 0.2,
  ease: "easeOut",
} as const

interface IBurgerProps {
  isToggled: boolean
}

const Burger = ({ isToggled }: IBurgerProps) => (
  <LazyMotion features={domAnimation}>
    <div className="relative size-6" aria-hidden="true">
      <m.span
        className="absolute top-1.5 left-0 block h-px w-4.5 origin-center rounded-full bg-white"
        initial={false}
        animate={{
          y: isToggled ? 6 : 0,
          rotate: isToggled ? 45 : 0,
        }}
        transition={TRANSITION}
      />
      <m.span
        className="absolute top-3 left-0 block h-px w-3 rounded-full bg-white"
        initial={false}
        animate={{ opacity: isToggled ? 0 : 1 }}
        transition={TRANSITION}
      />
      <m.span
        className="absolute top-4.5 left-0 block h-px w-4.5 origin-center rounded-full bg-white"
        initial={false}
        animate={{
          y: isToggled ? -6 : 0,
          rotate: isToggled ? -45 : 0,
        }}
        transition={TRANSITION}
      />
    </div>
  </LazyMotion>
)

export default Burger
