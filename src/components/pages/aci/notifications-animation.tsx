"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import bellIcon from "@/images/pages/aci/notifications-animation/bell.png"
import { AnimatePresence, motion, useInView } from "motion/react"

type Phase = "idle" | "striking" | "swapped"

const STRIKE_DURATION = 0.55
const INITIAL_DELAY_MS = 700

export default function NotificationsAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [phase, setPhase] = useState<Phase>("idle")

  useEffect(() => {
    if (!isInView) return
    let t2: ReturnType<typeof setTimeout>
    const t1 = setTimeout(() => {
      setPhase("striking")
      t2 = setTimeout(() => setPhase("swapped"), STRIKE_DURATION * 1000 + 250)
    }, INITIAL_DELAY_MS)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [isInView])

  return (
    <section className="bg-black px-5 py-28 text-white md:py-42.5">
      <div
        ref={ref}
        className="mx-auto flex max-w-176 flex-col items-center text-center"
      >
        <div className="relative z-0 flex size-64 items-center justify-center md:size-72 lg:size-91">
          <Image src={bellIcon} alt="" width={368} height={368} aria-hidden />
          <div className="absolute inset-x-0 bottom-0 h-42 bg-[linear-gradient(180deg,rgba(0,0,0,0)_20%,#000000_50%)] md:h-48 lg:h-52" />
        </div>
        <div className="relative z-10 -mt-28 lg:-mt-32.5">
          <div className="relative flex h-16 items-center justify-center overflow-visible sm:h-18">
            <AnimatePresence mode="wait">
              {phase !== "swapped" ? (
                <motion.h2
                  key="notifications"
                  className="relative text-[2.75rem] font-medium tracking-tight text-gray-8 md:text-[3.5rem] lg:text-[4rem]"
                  exit={{
                    opacity: 0,
                    y: -10,
                    transition: { duration: 0.3, ease: "easeIn" },
                  }}
                >
                  Notifications
                  {phase === "striking" && (
                    <motion.span
                      aria-hidden
                      className="absolute top-[52%] left-0 h-[3px] w-full -translate-y-1/2 rounded-full bg-gray-8"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      style={{ transformOrigin: "left center" }}
                      transition={{
                        duration: STRIKE_DURATION,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    />
                  )}
                </motion.h2>
              ) : (
                <motion.h2
                  key="communication"
                  className="text-[2.75rem] font-medium tracking-tight text-white md:text-[3.5rem] lg:text-[4rem]"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  Communication
                </motion.h2>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-6 text-[1.125rem] leading-normal font-book tracking-tighter text-gray-8 md:text-xl lg:text-2xl [&_strong]:font-medium [&_strong]:text-white">
            For decades, products notifed users one way{" "}
            <strong>via notifications</strong>, that always{" "}
            <strong>
              lacked the correct context, and limited users&apos; ability
            </strong>{" "}
            to perform meaningful interactions with them. Software has changed,
            now it needs to communicate <strong>via conversations.</strong>
          </p>
        </div>
      </div>
    </section>
  )
}
