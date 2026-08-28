"use client"

import { motion, useReducedMotion } from "motion/react"

const EASE = [0.32, 0.72, 0, 1] as const

export function HeroVisual() {
  const reduce = useReducedMotion()

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: EASE, delay },
        }

  return (
    <div className="relative mx-auto w-full max-w-md lg:mx-0">
      <div
        className="pointer-events-none absolute -inset-8 -z-10 bg-[radial-gradient(closest-side,hsl(var(--purple-3)/0.16),transparent_70%)]"
        aria-hidden
      />

      <div className="rounded-2xl border border-gray-20 bg-[#08080f] p-4">
        {/* One-way notification, no reply */}
        <motion.div
          {...rise(0.05)}
          className="rounded-xl border border-gray-20 bg-[#0c0c14] p-4"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-mono text-xs tracking-tighter text-gray-60">
              <span className="grid size-6 place-items-center rounded-md bg-white/10 text-xs">
                📦
              </span>
              Your app · notification
            </span>
            <span className="rounded-md border border-gray-20 px-2 py-0.5 font-mono text-[10px] tracking-tighter text-gray-60 line-through decoration-purple-1/70">
              no-reply
            </span>
          </div>
          <p className="mt-3 text-sm leading-snug text-gray-80">
            Your order shipped. Tracking #TN4471, arriving Thursday.
          </p>
        </motion.div>

        {/* The turn: it can reply now */}
        <motion.div
          {...rise(0.28)}
          className="flex items-center justify-center gap-2 py-2.5"
          aria-hidden
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-purple-3/60" />
          <span className="rounded-full border border-purple-3/50 bg-purple-3/15 px-2.5 py-1 font-mono text-[10px] tracking-tighter text-purple-1">
            now it can reply
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-purple-3/60" />
        </motion.div>

        {/* Two-way conversation */}
        <div className="flex flex-col gap-2.5">
          <motion.div
            {...rise(0.42)}
            className="max-w-[85%] self-end rounded-2xl rounded-br-md border border-gray-20 bg-[#15151d] px-3.5 py-2.5"
          >
            <p className="text-sm leading-snug text-white">
              can I change the delivery address?
            </p>
          </motion.div>
          <motion.div
            {...rise(0.62)}
            className="max-w-[85%] self-start rounded-2xl rounded-bl-md border border-purple-3/40 bg-purple-3/[0.18] px-3.5 py-2.5"
          >
            <div className="mb-1 font-mono text-[10px] tracking-tighter text-purple-1">
              Ada · support
            </div>
            <p className="text-sm leading-snug text-white">
              Sure. It&rsquo;s still in transit to 12 Oak St. What&rsquo;s the
              new address?
            </p>
          </motion.div>
          <motion.div
            {...rise(0.82)}
            className="flex items-center gap-1.5 self-start rounded-2xl rounded-bl-md border border-purple-3/40 bg-purple-3/[0.18] px-4 py-3.5"
            aria-label="agent is replying"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-purple-1 motion-reduce:animate-none" />
            <span className="size-1.5 animate-pulse rounded-full bg-purple-1 [animation-delay:0.15s] motion-reduce:animate-none" />
            <span className="size-1.5 animate-pulse rounded-full bg-purple-1 [animation-delay:0.3s] motion-reduce:animate-none" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
