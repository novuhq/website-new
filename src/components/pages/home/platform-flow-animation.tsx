"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import Image from "next/image"
import EngageIcon from "@/images/pages/home/communication-lifecycle/engage.inline.svg"
import EventIcon from "@/images/pages/home/communication-lifecycle/event.inline.svg"
import NotifyIcon from "@/images/pages/home/communication-lifecycle/notify.inline.svg"
import ResolveIcon from "@/images/pages/home/communication-lifecycle/resolve.inline.svg"
import PlatformFlowBackground from "@/images/pages/home/platform/background.jpg"
import imessageIcon from "@/images/pages/home/platform/imessage.svg"
import { Check } from "lucide-react"
import {
  animate,
  AnimatePresence,
  domAnimation,
  LazyMotion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react"
import * as m from "motion/react-m"

import { cn } from "@/lib/utils"

import {
  createTrackPath,
  createTrackProgressPath,
  TRACK_BASE_SIZE,
  type ITrackPoint,
  type ITrackSize,
} from "./platform-flow-path"

const FLOW_ORDER = ["event", "notify", "engage", "resolve"] as const

type FlowStep = (typeof FLOW_ORDER)[number]

const TRACK_CHECKPOINTS: Record<FlowStep, number> = {
  event: 0,
  notify: 0.25,
  engage: 0.5,
  resolve: 0.75,
}

const FLOW_LINE_DURATION = 3.5
const MOBILE_FAST_FILL_DURATION = 0.8
const MOBILE_SLIDE_DURATION = 1.2
const MOBILE_CARD_SETTLE_DELAY = 0.45
const MOBILE_TIMELINE_SLOT_WIDTH = 20
const MOBILE_TIMELINE_POSITIONS = [
  "left-[10%]",
  "left-[30%]",
  "left-[50%]",
  "left-[70%]",
  "left-[90%]",
] as const
const MOBILE_TIMELINE_STEPS = [...FLOW_ORDER, FLOW_ORDER[0]] as const
const MOBILE_TIMELINE_SEGMENT_INDEXES = [0, 1, 2, 4] as const

const CARD_ENTER_DURATION = 0.35
const CARD_EXIT_DURATION = 0.2
const CARD_EASE_IN = [0.4, 0, 1, 1] as const
const CARD_EASE_OUT = [0, 0, 0.2, 1] as const
const LINE_EASE_OUT = [0.4, 0.08, 0.06, 0.85] as const

const ENGAGE_CONTENT_DELAY = 0.42
const ENGAGE_QUESTION_DURATION = 0.38
const ENGAGE_TYPING_DELAY = ENGAGE_CONTENT_DELAY + 0.4
const ENGAGE_TYPING_DURATION = 1.15
const ENGAGE_TYPING_DOT_DURATION = 0.28
const ENGAGE_TYPING_DOT_STAGGER = 0.12
const ENGAGE_TYPING_DOT_REPEAT_DELAY = ENGAGE_TYPING_DOT_STAGGER * 2
const ENGAGE_REPLY_DELAY = ENGAGE_CONTENT_DELAY + 1.55
const ENGAGE_WORD_DELAY = ENGAGE_CONTENT_DELAY + 1.63
const ENGAGE_WORD_DURATION = 0.16
const ENGAGE_WORD_STAGGER = 0.07
const ENGAGE_RESPONSE_WORDS =
  "Your connection is at risk. Would you like me to find another flight?".split(
    " "
  )
const ENGAGE_ANIMATION_DURATION =
  ENGAGE_WORD_DELAY +
  (ENGAGE_RESPONSE_WORDS.length - 1) * ENGAGE_WORD_STAGGER +
  ENGAGE_WORD_DURATION
const FLOW_DEFAULT_STAGE_HOLD_DURATION =
  CARD_EXIT_DURATION + CARD_ENTER_DURATION
const FLOW_ENGAGE_STAGE_HOLD_DURATION =
  CARD_EXIT_DURATION + ENGAGE_ANIMATION_DURATION + 0.1
const FLOW_STAGE_HOLD_DURATIONS: Record<FlowStep, number> = {
  event: FLOW_DEFAULT_STAGE_HOLD_DURATION,
  notify: FLOW_DEFAULT_STAGE_HOLD_DURATION,
  engage: FLOW_ENGAGE_STAGE_HOLD_DURATION,
  resolve: FLOW_DEFAULT_STAGE_HOLD_DURATION,
}
const MOBILE_STAGE_HOLD_DURATIONS: Record<FlowStep, number> = {
  event: FLOW_DEFAULT_STAGE_HOLD_DURATION + MOBILE_CARD_SETTLE_DELAY,
  notify: FLOW_DEFAULT_STAGE_HOLD_DURATION + MOBILE_CARD_SETTLE_DELAY,
  engage: FLOW_ENGAGE_STAGE_HOLD_DURATION,
  resolve: FLOW_DEFAULT_STAGE_HOLD_DURATION + MOBILE_CARD_SETTLE_DELAY,
}

interface IPlatformFlowAnimationProps {
  activeTab?: string
  isPlaying?: boolean
  onStepComplete?: () => void
}

interface IFlowMarkerProps {
  activeStep: FlowStep
  lineReachedStep: FlowStep | null
  step: FlowStep
}

interface IFlowMarkerBadgeProps {
  active: boolean
  step: FlowStep
}

interface IMobileTimelineProps {
  activeStep: FlowStep
  isPlaying: boolean
  onStepComplete?: () => void
}

interface ITrackBounds {
  left: number
  right: number
  top: number
  bottom: number
}

function normalizeFlowStep(value?: string): FlowStep {
  return FLOW_ORDER.includes(value as FlowStep) ? (value as FlowStep) : "event"
}

function FlowMarkerBadge({ active, step }: IFlowMarkerBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border-[1.5px] px-3 text-base leading-none font-medium tracking-tighter transition-[color,background-color,border-color,box-shadow] duration-200 ease-out select-none motion-reduce:transition-none sm:h-6 sm:px-2.5 sm:text-[0.625rem] lg:h-[2.375rem] lg:gap-[0.4375rem] lg:px-[0.8125rem] lg:text-lg",
        active
          ? "border-white bg-white text-[#191a1f] shadow-[0_0_14px_rgba(255,255,255,0.12)]"
          : "border-[#261e43] bg-black text-[#9a72df] shadow-[0_2px_5px_rgba(0,0,0,0.35)] backdrop-blur-[15px]",
        !active && step === "notify" && "text-[#ab4bbf]",
        !active && step === "resolve" && "text-[#9581e2]",
        !active && step === "engage" && "text-[#a271de]"
      )}
      data-flow-marker-active={active}
    >
      {step === "event" && (
        <EventIcon
          className="size-3.5 text-[#d6507a] sm:size-3 lg:size-4.5"
          aria-hidden
        />
      )}
      {step === "notify" && (
        <NotifyIcon
          className="size-3.5 text-[#bd57de] sm:size-3 lg:size-4.5"
          aria-hidden
        />
      )}
      {step === "engage" && (
        <EngageIcon
          className="size-3.5 text-[#8d5cda] sm:size-3 lg:size-4.5"
          aria-hidden
        />
      )}
      {step === "resolve" && (
        <ResolveIcon
          className="size-3.5 text-[#8767ff] sm:size-3 lg:size-5"
          aria-hidden
        />
      )}
      <span className="whitespace-nowrap">
        {step.charAt(0).toUpperCase() + step.slice(1)}
      </span>
    </div>
  )
}

function FlowMarker({ activeStep, lineReachedStep, step }: IFlowMarkerProps) {
  const isReached =
    FLOW_ORDER.indexOf(step) <= FLOW_ORDER.indexOf(activeStep) ||
    step === lineReachedStep

  return (
    <div
      className={cn(
        "absolute z-20 hidden sm:block",
        step === "event" &&
          "top-[17.14%] left-1/2 -translate-x-1/2 -translate-y-1/2",
        step === "notify" &&
          "top-1/2 left-[93.75%] -translate-x-1/2 -translate-y-1/2 lg:left-[86.84%]",
        step === "engage" &&
          "top-[83.1%] left-1/2 -translate-x-1/2 -translate-y-1/2",
        step === "resolve" &&
          "top-1/2 left-[6.25%] -translate-x-1/2 -translate-y-1/2 lg:left-[13.16%]"
      )}
      data-flow-marker={step}
    >
      <FlowMarkerBadge active={isReached} step={step} />
    </div>
  )
}

function MobileTimeline({
  activeStep,
  isPlaying,
  onStepComplete,
}: IMobileTimelineProps) {
  const activeIndex = FLOW_ORDER.indexOf(activeStep)
  const [hasArrived, setHasArrived] = useState(false)
  const startOffset = `${-activeIndex * MOBILE_TIMELINE_SLOT_WIDTH}%`
  const targetOffset = `${-(activeIndex + 1) * MOBILE_TIMELINE_SLOT_WIDTH}%`
  const isFinalStep = activeStep === "resolve"
  const stageHoldDuration = MOBILE_STAGE_HOLD_DURATIONS[activeStep]
  const timelineDuration = isFinalStep
    ? stageHoldDuration + MOBILE_SLIDE_DURATION
    : stageHoldDuration + MOBILE_FAST_FILL_DURATION + MOBILE_SLIDE_DURATION
  const timelineTimes = isFinalStep
    ? [0, stageHoldDuration / timelineDuration, 1]
    : [
        0,
        stageHoldDuration / timelineDuration,
        (stageHoldDuration + MOBILE_FAST_FILL_DURATION) / timelineDuration,
        1,
      ]
  const trackKeyframes = isFinalStep
    ? [startOffset, startOffset, targetOffset]
    : [startOffset, startOffset, startOffset, targetOffset]
  const timelineTransition = {
    duration: isPlaying ? timelineDuration : 0,
    ease: "linear" as const,
    times: timelineTimes,
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-10 z-20 h-px overflow-visible sm:hidden">
      <m.div
        data-mobile-timeline-track
        className="absolute top-0 left-0 h-px w-[500%] will-change-transform"
        initial={{ x: startOffset }}
        animate={{ x: isPlaying ? trackKeyframes : startOffset }}
        onAnimationComplete={() => {
          if (isPlaying) {
            setHasArrived(true)
            onStepComplete?.()
          }
        }}
        transition={timelineTransition}
      >
        {MOBILE_TIMELINE_SEGMENT_INDEXES.map((segmentIndex) => (
          <span
            className={cn(
              "absolute top-0 h-px w-1/5 overflow-visible bg-[#7480ff]/60",
              MOBILE_TIMELINE_POSITIONS[segmentIndex]
            )}
            key={`mobile-timeline-segment-${segmentIndex}`}
          >
            {segmentIndex < activeIndex && (
              <span className="absolute inset-0 bg-white shadow-[0_0_7px_rgba(255,255,255,0.55)]" />
            )}
            {segmentIndex === activeIndex && (
              <m.span
                data-mobile-timeline-fill
                className="absolute inset-0 origin-left bg-white shadow-[0_0_7px_rgba(255,255,255,0.55)] will-change-transform"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isPlaying ? [0, 0, 0.8, 1] : 0 }}
                transition={timelineTransition}
              />
            )}
          </span>
        ))}

        {MOBILE_TIMELINE_STEPS.map((step, index) => (
          <div
            className={cn(
              "absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2",
              MOBILE_TIMELINE_POSITIONS[index]
            )}
            key={`${step}-${index}`}
          >
            <FlowMarkerBadge
              active={
                index === activeIndex ||
                (hasArrived && index === activeIndex + 1)
              }
              step={step}
            />
          </div>
        ))}
      </m.div>
    </div>
  )
}

interface IBadgeProps {
  className?: string
  label: string
  variant?: "alert" | "success"
}

function Badge({ className, label, variant = "alert" }: IBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border px-2 py-1 text-xs leading-none font-medium tracking-tighter sm:px-1.5 sm:py-0.5 sm:text-[0.5rem] lg:px-2.5 lg:py-1 lg:text-[0.8125rem]",
        variant === "success"
          ? "border-[#008A58]/30 bg-[#008A58]/20 text-[#006943]"
          : "border-[#FF4C88]/30 bg-[#FF4C88]/20 text-[#EA3974]",
        className
      )}
    >
      {label}
    </span>
  )
}

function EventCard() {
  return (
    <div className="h-37 w-full rounded-[0.625rem] bg-white px-4 pt-2.5 pb-4 font-mono text-black shadow-[0_19.564px_47.824px_rgba(0,8,49,0.6)] sm:h-auto sm:px-3 sm:py-2.5 lg:h-[7.125rem] lg:px-4 lg:pt-3 lg:pb-4">
      <div className="flex items-center justify-between gap-2 border-b border-[#e3e4e9] pb-2.5 sm:pb-2 lg:pb-3">
        <span className="text-[.8125rem] leading-none font-medium tracking-tighter sm:text-[0.625rem] lg:text-sm lg:leading-4">
          flight.delayed
        </span>
        <Badge className="font-inter" label="Received just now" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-y-0.5 text-[.8125rem] leading-snug tracking-tight sm:mt-1.5 sm:grid-cols-2 sm:gap-x-3 sm:text-[0.5rem] lg:mt-4 lg:gap-x-6 lg:text-sm">
        <div>
          <p className="whitespace-nowrap">
            <span className="text-black/60">Passenger:</span> Alex Morgan
          </p>
          <p className="whitespace-nowrap">
            <span className="text-black/60">Flight:</span>
            <span className="lg:ml-[1.375rem]"> BA2048</span>
          </p>
        </div>
        <div className="contents sm:block">
          <p className="whitespace-nowrap">
            <span className="text-black/60">Delay:</span> 45 min
          </p>
          <p className="whitespace-nowrap">
            <span className="text-black/70">Reason:</span> late arrival
          </p>
        </div>
      </div>
    </div>
  )
}

function NotifyCard() {
  return (
    <div className="relative flex h-20 w-full items-center gap-3 rounded-[0.625rem] bg-white p-3 text-gray-20 shadow-[0_19.564px_23.912px_rgba(0,8,49,0.6)] sm:h-auto sm:gap-3 sm:p-3 lg:h-[5.625rem] lg:py-[0.8125rem] lg:pr-[1.125rem] lg:pl-[0.8125rem]">
      <span className="flex size-13 shrink-0 items-center justify-center sm:size-10 lg:size-16">
        <Image
          className="size-13 sm:size-8.5 lg:size-13"
          src={imessageIcon}
          width={52}
          height={52}
          alt=""
          aria-hidden
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5 text-left sm:gap-1 lg:gap-2">
        <strong className="flex items-center truncate text-base leading-none font-medium tracking-tighter text-black/90 sm:text-xs lg:text-xl">
          Flight Agent
          <Badge className="ml-1.5 lg:ml-2.5" label="iMessage" />
        </strong>
        <span className="block truncate text-sm leading-tight tracking-tighter text-gray-40 sm:text-[0.625rem] lg:text-[1.0625rem]">
          Your flight is being delayed
        </span>
      </span>
    </div>
  )
}

function ConversationCard({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex aspect-[400/174] w-full max-w-100 flex-col justify-between rounded-[0.625rem] bg-white p-[4.819%] text-left font-inter shadow-[0_19.564px_47.824px_rgba(0,8,49,0.6)] md:py-3 lg:aspect-[400/160] xl:aspect-[400/174] xl:p-4.5">
      <m.div
        className="relative flex w-[75%] shrink-0 items-center self-end rounded-[1.375rem] bg-[#1995FD] px-3 py-2 text-[0.8125rem] leading-[1.2] font-normal tracking-tighter text-white sm:px-3.5 sm:text-sm md:px-3.5 lg:px-4.25 lg:text-base/[1.1] xl:text-[1.1875rem]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: isPlaying ? ENGAGE_QUESTION_DURATION : 0,
          delay: isPlaying ? ENGAGE_CONTENT_DELAY : 0,
          ease: CARD_EASE_OUT,
        }}
      >
        Will I miss my connection?
        <svg
          className="pointer-events-none absolute right-[-1%] bottom-0 h-[30.29%] w-[6.54%] text-[#1995FD]"
          viewBox="420.492 88.381 14.949 11.903"
          fill="none"
          aria-hidden
        >
          <path
            d="M434.555 88.3809C431.319 90.2527 425.594 92.6112 421.587 92.6112H420.492C424.178 95.7191 429.177 98.5552 432.881 100.284C434.509 101.044 435.441 99.6278 434.393 98.169C433.597 97.0626 432.923 95.9494 432.766 95.1688C432.366 93.1688 431.417 91.4187 434.555 88.3809Z"
            fill="currentColor"
          />
        </svg>
        <m.span
          className="absolute top-[calc(100%+0.25rem)] right-0 text-xs leading-[1.1] font-[510] tracking-[0.005rem] whitespace-nowrap text-[#3C3C43]/60 lg:top-[calc(100%+0.5rem)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: isPlaying ? ENGAGE_QUESTION_DURATION : 0,
            delay: isPlaying ? ENGAGE_TYPING_DELAY : 0,
            ease: CARD_EASE_OUT,
          }}
        >
          Read 10:02
        </m.span>
      </m.div>

      <div className="relative aspect-[329/68] w-[89%] shrink-0 self-start">
        <m.div
          className="absolute top-0 left-0 flex h-8 items-center gap-1 rounded-full bg-[#E9E9EB] px-3.5 lg:h-10"
          initial={{ opacity: 0, y: 4 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [4, 0, 0, 0],
          }}
          transition={{
            duration: isPlaying ? ENGAGE_TYPING_DURATION : 0,
            delay: isPlaying ? ENGAGE_TYPING_DELAY : 0,
            ease: CARD_EASE_OUT,
            times: [0, 0.16, 0.84, 1],
          }}
          aria-hidden
        >
          {[0, 1, 2].map((dotIndex) => (
            <m.span
              className="size-2 rounded-full bg-[#AEADAE] lg:size-2.5"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: isPlaying ? ENGAGE_TYPING_DOT_DURATION : 0,
                delay: isPlaying
                  ? ENGAGE_TYPING_DELAY +
                    0.05 +
                    dotIndex * ENGAGE_TYPING_DOT_STAGGER
                  : 0,
                ease: "easeInOut",
                times: [0, 0.5, 1],
                repeat: isPlaying ? 1 : 0,
                repeatDelay: ENGAGE_TYPING_DOT_REPEAT_DELAY,
              }}
              key={dotIndex}
            />
          ))}
          <span className="absolute bottom-0 -left-0.5 size-3 rounded-full bg-[#E9E9EB] lg:size-3.5" />
          <span className="absolute bottom-0 left-0 size-1.5 -translate-x-[150%] translate-y-1/2 rounded-full bg-[#E9E9EB] lg:bottom-0" />
        </m.div>

        <m.div
          className="absolute inset-0 flex items-center rounded-[1.375rem] bg-[#E9E9EA] px-3 text-[0.8125rem] leading-[1.2] font-normal tracking-tighter text-[#040406] sm:px-3.5 sm:text-sm md:px-4 lg:px-4.25 lg:text-base/[1.1] xl:text-[1.1875rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: isPlaying ? 0.01 : 0,
            delay: isPlaying ? ENGAGE_REPLY_DELAY : 0,
          }}
        >
          <span aria-label={ENGAGE_RESPONSE_WORDS.join(" ")}>
            {ENGAGE_RESPONSE_WORDS.map((word, index) => (
              <m.span
                className="inline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: isPlaying ? ENGAGE_WORD_DURATION : 0,
                  delay: isPlaying
                    ? ENGAGE_WORD_DELAY + index * ENGAGE_WORD_STAGGER
                    : 0,
                  ease: "easeOut",
                }}
                aria-hidden
                key={`${word}-${index}`}
              >
                {word}
                {index < ENGAGE_RESPONSE_WORDS.length - 1 ? " " : null}
              </m.span>
            ))}
          </span>
          <svg
            className="pointer-events-none absolute -bottom-0.5 left-0.5 h-[30.29%] w-[5.17%] text-[#E9E9EA] lg:left-[-0.5%]"
            viewBox="76.086 169.381 14.062 11.903"
            fill="none"
            aria-hidden
          >
            <path
              d="M76.0859 169.381C79.3218 171.253 85.0463 173.611 89.0535 173.611H90.1484C86.4627 176.719 81.4638 179.555 77.7599 181.284C76.1319 182.044 75.1994 180.628 76.2481 179.169C77.0435 178.063 77.718 176.949 77.8741 176.169C78.2741 174.169 79.2235 172.419 76.0859 169.381Z"
              fill="currentColor"
            />
          </svg>
        </m.div>
      </div>
    </div>
  )
}

function ResolveCard() {
  return (
    <div className="h-41 w-full rounded-[0.625rem] bg-white px-4 pt-2.5 pb-4 text-left text-gray-30 shadow-[0_19.564px_47.824px_rgba(0,8,49,0.6)] sm:h-auto sm:px-3 sm:py-2.5 lg:h-[7.375rem] lg:px-4 lg:py-3.5">
      <div className="flex items-center justify-between gap-2 border-b border-[#e3e4e9] pb-2.5 sm:pb-2 lg:pb-3">
        <strong className="truncate text-sm leading-none font-medium tracking-tighter text-black sm:text-[0.625rem] lg:text-base lg:leading-[1.125]">
          Travel issue resolved
        </strong>
        <Badge label="Success" variant="success" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-y-1 text-[0.8125rem] leading-[1.5] tracking-tight sm:mt-2 sm:grid-cols-2 sm:gap-x-3 sm:text-[0.5rem] lg:mt-2.5 lg:gap-x-10 lg:text-sm">
        <div className="contents sm:block sm:space-y-0.5 lg:space-y-1">
          <p className="flex items-center gap-1.5 whitespace-nowrap">
            <Check className="size-3.5 shrink-0 text-gray-60" aria-hidden />
            Alternative flight found
          </p>
          <p className="flex items-center gap-1.5 whitespace-nowrap">
            <Check className="size-3.5 shrink-0 text-gray-60" aria-hidden />
            Itinerary updated
          </p>
        </div>
        <div className="contents sm:block sm:space-y-0.5 lg:space-y-1">
          <p className="flex items-center gap-1.5 whitespace-nowrap">
            <Check className="size-3.5 shrink-0 text-gray-60" aria-hidden />
            Passenger rebooked
          </p>
          <p className="flex items-center gap-1.5 whitespace-nowrap">
            <Check className="size-3.5 shrink-0 text-gray-60" aria-hidden />
            Issue resolved
          </p>
        </div>
      </div>
    </div>
  )
}

function FlowCard({ isPlaying, step }: { isPlaying: boolean; step: FlowStep }) {
  switch (step) {
    case "event":
      return <EventCard />
    case "notify":
      return <NotifyCard />
    case "engage":
      return (
        <ConversationCard
          isPlaying={isPlaying}
          key={isPlaying ? "playing" : "paused"}
        />
      )
    case "resolve":
      return <ResolveCard />
  }
}

function PlatformFlowAnimation({
  activeTab,
  isPlaying = true,
  onStepComplete,
}: IPlatformFlowAnimationProps) {
  const activeStep = normalizeFlowStep(activeTab)
  const prefersReducedMotion = useReducedMotion()
  const sceneRef = useRef<HTMLDivElement>(null)
  const glowLineRef = useRef<SVGPathElement>(null)
  const animatedLineRef = useRef<SVGPathElement>(null)
  const reachedStepRef = useRef<FlowStep | null>(null)
  const markerBoundsRef = useRef<ITrackBounds | null>(null)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [lineReachedStep, setLineReachedStep] = useState<FlowStep | null>(null)
  const [trackSize, setTrackSize] = useState<ITrackSize>(TRACK_BASE_SIZE)
  const trackSizeRef = useRef(trackSize)
  const activeIndex = FLOW_ORDER.indexOf(activeStep)
  const nextStep = FLOW_ORDER[(activeIndex + 1) % FLOW_ORDER.length]
  const startProgress = TRACK_CHECKPOINTS[activeStep]
  const targetProgress = nextStep === "event" ? 1 : TRACK_CHECKPOINTS[nextStep]
  const stageHoldDuration = FLOW_STAGE_HOLD_DURATIONS[activeStep]
  const activeTitle = activeStep.charAt(0).toUpperCase() + activeStep.slice(1)
  const trackPath = createTrackPath(trackSize)
  const lineProgress = useMotionValue(startProgress)
  const initialLinePath = createTrackProgressPath(trackSize, startProgress).path

  const renderLineProgress = useCallback((progress: number): ITrackPoint => {
    const { path, endPoint } = createTrackProgressPath(
      trackSizeRef.current,
      progress
    )

    glowLineRef.current?.setAttribute("d", path)
    animatedLineRef.current?.setAttribute("d", path)

    return endPoint
  }, [])

  const completeStep = useCallback(() => {
    if (reachedStepRef.current === nextStep) {
      return
    }

    reachedStepRef.current = nextStep
    setLineReachedStep(nextStep)
    onStepComplete?.()
  }, [nextStep, onStepComplete])

  const updateMarkerBounds = useCallback(() => {
    const line = animatedLineRef.current
    const marker = sceneRef.current?.querySelector<HTMLElement>(
      `[data-flow-marker="${nextStep}"]`
    )
    const screenMatrix = line?.getScreenCTM()

    if (!line || !marker || !screenMatrix) {
      markerBoundsRef.current = null
      return
    }

    try {
      const inverseMatrix = screenMatrix.inverse()
      const markerRect = marker.getBoundingClientRect()
      const markerCorners = [
        new DOMPoint(markerRect.left, markerRect.top),
        new DOMPoint(markerRect.right, markerRect.top),
        new DOMPoint(markerRect.right, markerRect.bottom),
        new DOMPoint(markerRect.left, markerRect.bottom),
      ].map((point) => point.matrixTransform(inverseMatrix))
      const markerXs = markerCorners.map((point) => point.x)
      const markerYs = markerCorners.map((point) => point.y)

      markerBoundsRef.current = {
        left: Math.min(...markerXs),
        right: Math.max(...markerXs),
        top: Math.min(...markerYs),
        bottom: Math.max(...markerYs),
      }
    } catch {
      markerBoundsRef.current = null
    }
  }, [nextStep])

  useLayoutEffect(() => {
    trackSizeRef.current = trackSize
    renderLineProgress(lineProgress.get())
    updateMarkerBounds()

    const marker = sceneRef.current?.querySelector<HTMLElement>(
      `[data-flow-marker="${nextStep}"]`
    )

    if (!marker) {
      return
    }

    const markerResizeObserver = new ResizeObserver(updateMarkerBounds)
    markerResizeObserver.observe(marker)
    window.addEventListener("resize", updateMarkerBounds)
    window.visualViewport?.addEventListener("resize", updateMarkerBounds)

    return () => {
      markerResizeObserver.disconnect()
      window.removeEventListener("resize", updateMarkerBounds)
      window.visualViewport?.removeEventListener("resize", updateMarkerBounds)
    }
  }, [
    lineProgress,
    nextStep,
    renderLineProgress,
    trackSize,
    updateMarkerBounds,
  ])

  useMotionValueEvent(lineProgress, "change", (progress) => {
    if (!Number.isFinite(progress)) {
      return
    }

    const lineEndPoint = renderLineProgress(progress)

    if (!isPlaying || isMobileViewport || reachedStepRef.current === nextStep) {
      return
    }

    const markerBounds = markerBoundsRef.current
    if (!markerBounds) {
      return
    }

    const hasTouchedMarker =
      lineEndPoint.x >= markerBounds.left &&
      lineEndPoint.x <= markerBounds.right &&
      lineEndPoint.y >= markerBounds.top &&
      lineEndPoint.y <= markerBounds.bottom

    if (hasTouchedMarker) {
      completeStep()
    }
  })

  useLayoutEffect(() => {
    reachedStepRef.current = null
    setLineReachedStep(null)
    lineProgress.set(startProgress)
    renderLineProgress(startProgress)

    if (!isPlaying || isMobileViewport) {
      return
    }

    const lineAnimation = animate(lineProgress, targetProgress, {
      delay: stageHoldDuration,
      duration: FLOW_LINE_DURATION,
      ease: LINE_EASE_OUT,
      onComplete: completeStep,
    })

    return () => {
      lineAnimation.stop()
    }
  }, [
    activeStep,
    completeStep,
    isMobileViewport,
    isPlaying,
    lineProgress,
    renderLineProgress,
    stageHoldDuration,
    startProgress,
    targetProgress,
  ])

  useEffect(() => {
    const scene = sceneRef.current

    if (!scene) {
      return
    }

    const desktopMediaQuery = window.matchMedia("(min-width: 1024px)")

    const updateTrackSize = (width: number, height: number) => {
      const nextSize = {
        width: Math.round(width * 100) / 100,
        height: Math.round(height * 100) / 100,
        isDesktop: desktopMediaQuery.matches,
      }

      setTrackSize((currentSize) =>
        currentSize.width === nextSize.width &&
        currentSize.height === nextSize.height &&
        currentSize.isDesktop === nextSize.isDesktop
          ? currentSize
          : nextSize
      )
    }

    const { width, height } = scene.getBoundingClientRect()
    updateTrackSize(width, height)

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) {
        return
      }

      updateTrackSize(entry.contentRect.width, entry.contentRect.height)
    })

    resizeObserver.observe(scene)

    const handleDesktopChange = () => {
      const { width: sceneWidth, height: sceneHeight } =
        scene.getBoundingClientRect()

      updateTrackSize(sceneWidth, sceneHeight)
    }

    desktopMediaQuery.addEventListener("change", handleDesktopChange)

    return () => {
      resizeObserver.disconnect()
      desktopMediaQuery.removeEventListener("change", handleDesktopChange)
    }
  }, [])

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia("(max-width: 639px)")
    const handleMobileChange = () => {
      setIsMobileViewport(mobileMediaQuery.matches)
    }

    handleMobileChange()
    mobileMediaQuery.addEventListener("change", handleMobileChange)

    return () => {
      mobileMediaQuery.removeEventListener("change", handleMobileChange)
    }
  }, [])

  return (
    <div
      ref={sceneRef}
      className="relative isolate h-68 w-full overflow-hidden rounded-[0.625rem] border border-gray-20 bg-[#0e0c17] sm:aspect-video sm:h-auto lg:aspect-[1216/420]"
      data-flow-step={activeStep}
      data-flow-playing={isPlaying}
      data-flow-line-reached={lineReachedStep ?? undefined}
      data-flow-progress-start={startProgress}
      data-flow-progress-target={targetProgress}
      role="img"
      aria-label={`${activeTitle} stage of a notification flow from an application event to resolution`}
    >
      <Image
        className="pointer-events-none absolute inset-0 size-full object-cover select-none"
        src={PlatformFlowBackground}
        alt=""
        sizes="(min-width: 1280px) 1216px, calc(100vw - 40px)"
        unoptimized
        aria-hidden
      />

      <LazyMotion features={domAnimation}>
        <MobileTimeline
          activeStep={activeStep}
          isPlaying={isPlaying && isMobileViewport}
          onStepComplete={onStepComplete}
          key={`${activeStep}-${isPlaying && isMobileViewport ? "playing" : "paused"}`}
        />

        <svg
          data-flow-layer="track-and-line"
          className="pointer-events-none absolute inset-0 hidden size-full sm:block"
          viewBox={`0 0 ${trackSize.width} ${trackSize.height}`}
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            d={trackPath}
            stroke="white"
            strokeWidth="1.5"
            className="mix-blend-overlay"
          />
          <path
            ref={glowLineRef}
            d={initialLinePath}
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            className="opacity-20 blur-[2.5px]"
          />
          <path
            ref={animatedLineRef}
            data-flow-line
            d={initialLinePath}
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {FLOW_ORDER.map((step) => (
          <FlowMarker
            activeStep={activeStep}
            lineReachedStep={lineReachedStep}
            step={step}
            key={step}
          />
        ))}

        <div className="pointer-events-none absolute top-[58.1%] left-1/2 z-10 grid w-[90%] max-w-104 -translate-x-1/2 -translate-y-1/2 sm:top-1/2 sm:w-[52%]">
          <AnimatePresence initial={false} mode="wait">
            <m.div
              className={cn(
                "col-start-1 row-start-1 mx-auto w-full will-change-transform",
                activeStep === "event" &&
                  "w-[88.8889%] max-w-64 sm:w-full sm:max-w-[24.9375rem]",
                activeStep === "notify" && "max-w-72 sm:max-w-[21.5rem]",
                activeStep === "engage" &&
                  "w-[88.8889%] max-w-xs sm:w-full sm:max-w-104",
                activeStep === "resolve" &&
                  "w-[88.8889%] max-w-64 sm:w-full sm:max-w-[24.9375rem]"
              )}
              data-flow-card={activeStep}
              key={activeStep}
              initial={
                prefersReducedMotion || !isPlaying
                  ? false
                  : {
                      opacity: 0,
                      transform: "translate3d(0,-16px,0)",
                    }
              }
              animate={{
                opacity: 1,
                transform: "translate3d(0,0,0)",
                transition: {
                  duration: prefersReducedMotion ? 0 : CARD_ENTER_DURATION,
                  ease: CARD_EASE_OUT,
                },
              }}
              exit={
                prefersReducedMotion || !isPlaying
                  ? { opacity: 1, transition: { duration: 0 } }
                  : {
                      opacity: 0,
                      transform: "translate3d(0,12px,0)",
                      transition: {
                        duration: CARD_EXIT_DURATION,
                        ease: CARD_EASE_IN,
                      },
                    }
              }
            >
              <FlowCard isPlaying={isPlaying} step={activeStep} />
            </m.div>
          </AnimatePresence>
        </div>
      </LazyMotion>
    </div>
  )
}

export default PlatformFlowAnimation
