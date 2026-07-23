"use client"

import { useEffect, useRef, useState } from "react"
import Image, { type StaticImageData } from "next/image"
import emailIcon from "@/svgs/pages/connect/channels/email.svg"
import smsIcon from "@/svgs/pages/connect/channels/imessage.svg"
import slackIcon from "@/svgs/pages/connect/channels/slack.svg"
import whatsappIcon from "@/svgs/pages/connect/channels/whatsapp.svg"
import { motion, useMotionValue, type MotionValue } from "motion/react"

import { getGlobeCardMotionState } from "./globe-timeline"
import type {
  IGlobeCardEvent,
  TCardPlacement,
  TGlobeChannel,
} from "./globe-types"

interface IGlobeEventCardProps {
  event: IGlobeCardEvent | null
  opacity: MotionValue<number>
  startedAtMs: number
  timeMs: MotionValue<number>
  x: MotionValue<number>
  y: MotionValue<number>
}

interface IScrambleProgress {
  header: number
  text: number
}

interface IScrambleTextProps {
  progress: number
  seed: number
  value: string
}

const CHANNEL_ICONS: Record<TGlobeChannel, StaticImageData | string> = {
  email: emailIcon,
  slack: slackIcon,
  sms: smsIcon,
  whatsapp: whatsappIcon,
}

const PLACEMENT_CLASSES: Record<TCardPlacement, string> = {
  above: "-translate-x-1/2 -translate-y-[calc(100%+0.75rem)]",
  "above-left":
    "-translate-x-[calc(100%-0.5rem)] -translate-y-[calc(100%+0.75rem)]",
  "above-right": "translate-x-2 -translate-y-[calc(100%+0.75rem)]",
  "below-left": "-translate-x-[calc(100%-0.5rem)] translate-y-3",
  "below-right": "translate-x-2 translate-y-3",
  left: "-translate-x-[calc(100%+0.5rem)] -translate-y-2",
  right: "translate-x-2 -translate-y-2",
}

const SCRAMBLE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*"
const SCRAMBLE_STEPS = 28

function getScrambledText(value: string, progress: number, seed: number) {
  if (progress >= 1) return value

  const characters = Array.from(value)
  const mutableIndexes = characters.flatMap((character, index) =>
    /[a-z0-9]/i.test(character) ? [index] : []
  )
  const revealedCharacters = Math.floor(mutableIndexes.length * progress)
  const frame = Math.floor(progress * SCRAMBLE_STEPS)

  mutableIndexes.forEach((characterIndex, index) => {
    if (index < revealedCharacters) return

    const randomIndex =
      (characterIndex * 17 + index * 11 + frame * 7 + seed * 13) %
      SCRAMBLE_CHARACTERS.length
    characters[characterIndex] = SCRAMBLE_CHARACTERS[randomIndex]
  })

  return characters.join("")
}

function ScrambleText({ progress, seed, value }: IScrambleTextProps) {
  return (
    <span aria-label={value}>
      <span aria-hidden="true">{getScrambledText(value, progress, seed)}</span>
    </span>
  )
}

export default function GlobeEventCard({
  event,
  opacity,
  startedAtMs,
  timeMs,
  x,
  y,
}: IGlobeEventCardProps) {
  const popupOpacity = useMotionValue(0)
  const backgroundOpacity = useMotionValue(0)
  const headerOpacity = useMotionValue(0)
  const textOpacity = useMotionValue(0)
  const statusOpacity = useMotionValue(0)
  const progressRef = useRef<IScrambleProgress>({ header: 0, text: 0 })
  const [scrambleProgress, setScrambleProgress] = useState<IScrambleProgress>({
    header: 0,
    text: 0,
  })

  useEffect(() => {
    const update = (currentTimeMs: number) => {
      if (!event) {
        popupOpacity.set(0)
        backgroundOpacity.set(0)
        headerOpacity.set(0)
        textOpacity.set(0)
        statusOpacity.set(0)
        return
      }

      const state = getGlobeCardMotionState(event, currentTimeMs, startedAtMs)
      popupOpacity.set(state.popupOpacity)
      backgroundOpacity.set(state.backgroundOpacity)
      headerOpacity.set(state.headerOpacity)
      textOpacity.set(state.textOpacity)
      statusOpacity.set(state.statusOpacity)

      const nextProgress = {
        header:
          Math.round(state.headerScramble * SCRAMBLE_STEPS) / SCRAMBLE_STEPS,
        text: Math.round(state.textScramble * SCRAMBLE_STEPS) / SCRAMBLE_STEPS,
      }

      if (
        nextProgress.header !== progressRef.current.header ||
        nextProgress.text !== progressRef.current.text
      ) {
        progressRef.current = nextProgress
        setScrambleProgress(nextProgress)
      }
    }

    update(timeMs.get())
    return timeMs.on("change", update)
  }, [
    backgroundOpacity,
    event,
    headerOpacity,
    popupOpacity,
    startedAtMs,
    statusOpacity,
    textOpacity,
    timeMs,
  ])

  return (
    <motion.div
      className="pointer-events-none absolute top-0 left-0 hidden lg:block"
      style={{ opacity, x, y }}
    >
      {event ? (
        <motion.div
          className={PLACEMENT_CLASSES[event.placement]}
          key={event.id}
          style={{ opacity: popupOpacity }}
        >
          <div
            className="origin-top-left font-mono text-white"
            style={{ width: event.widthPx }}
          >
            <motion.div
              className="inline-flex h-4.5 items-center gap-1.5 border-[#aaa0df] bg-white px-1.25 font-mono text-[11px] leading-none font-medium tracking-tighter text-black uppercase"
              style={{ opacity: headerOpacity }}
            >
              <span className="size-1.5 bg-[#b56aff]" />
              <ScrambleText
                progress={scrambleProgress.header}
                seed={3}
                value={event.label}
              />
            </motion.div>

            <div className="relative px-3.5 pt-3.5 pb-3.5">
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 border border-white/10 bg-[#130C3D]/70 backdrop-blur-xl"
                style={{ opacity: backgroundOpacity }}
              />

              <motion.div className="relative" style={{ opacity: textOpacity }}>
                <div className="flex items-center gap-2 text-[.8125rem] leading-none tracking-tighter text-[#D0BEFF] uppercase">
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="size-4 object-contain [filter:grayscale(1)_sepia(.55)_saturate(4)_hue-rotate(210deg)_brightness(1.08)]"
                    height={24}
                    src={CHANNEL_ICONS[event.channel]}
                    width={24}
                  />
                  <ScrambleText
                    progress={scrambleProgress.text}
                    seed={7}
                    value={event.channelLabel}
                  />
                </div>

                <dl className="mt-2 grid grid-cols-[4rem_minmax(0,1fr)] gap-x-0 text-[.8125rem] leading-snug tracking-tighter uppercase">
                  {event.lines.map((line, index) => (
                    <div className="contents" key={`${event.id}-${line.label}`}>
                      <dt className="text-white/94">
                        <ScrambleText
                          progress={scrambleProgress.text}
                          seed={index * 2 + 11}
                          value={`${line.label}:`}
                        />
                      </dt>
                      <dd className="text-white/94">
                        <ScrambleText
                          progress={scrambleProgress.text}
                          seed={index * 2 + 12}
                          value={line.value}
                        />
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>

              <motion.div
                className="relative mt-2 text-[.8125rem] leading-snug tracking-tight text-[#D0BEFF]/60 uppercase"
                style={{ opacity: statusOpacity }}
              >
                [ {event.status} ]
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  )
}
