"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import EngageIcon from "@/images/pages/home/communication-lifecycle/engage.inline.svg"
import EventIcon from "@/images/pages/home/communication-lifecycle/event.inline.svg"
import NotifyIcon from "@/images/pages/home/communication-lifecycle/notify.inline.svg"
import ResolveIcon from "@/images/pages/home/communication-lifecycle/resolve.inline.svg"
import AgentAvatarImage from "@/images/pages/home/platform/agent-avatar.svg"
import PlatformFlowBackground from "@/images/pages/home/platform/background.jpg"
import imessageIcon from "@/images/pages/home/platform/imessage.svg"
import { Check } from "lucide-react"
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  useInView,
  useReducedMotion,
} from "motion/react"
import * as m from "motion/react-m"

import { cn } from "@/lib/utils"

const FLOW_ORDER = ["event", "notify", "engage", "resolve"] as const

type FlowStep = (typeof FLOW_ORDER)[number]

const TRACK_CHECKPOINTS: Record<FlowStep, number> = {
  event: 0,
  notify: 0.25,
  engage: 0.5,
  resolve: 0.75,
}

const FLOW_STEP_DURATION = 5

const TRACK_BASE_WIDTH = 1216
const TRACK_BASE_HEIGHT = 420
const TRACK_BASE_LEFT = 160
const TRACK_BASE_RIGHT = 1056
const TRACK_BASE_TOP = 72
const TRACK_BASE_BOTTOM = 349
const TRACK_COMPACT_SIDE_INSET = 0.0625

const EASE_OUT = [0.215, 0.61, 0.355, 1] as const

interface IPlatformFlowAnimationProps {
  activeTab?: string
  onStepComplete?: () => void
}

interface IFlowMarkerProps {
  activeStep: FlowStep
  step: FlowStep
}

interface ITrackSize {
  width: number
  height: number
  isDesktop: boolean
}

function createTrackPath({ width, height, isDesktop }: ITrackSize) {
  const scaleX = width / TRACK_BASE_WIDTH
  const scaleY = height / TRACK_BASE_HEIGHT
  const left = isDesktop
    ? TRACK_BASE_LEFT * scaleX
    : width * TRACK_COMPACT_SIDE_INSET
  const right = isDesktop
    ? TRACK_BASE_RIGHT * scaleX
    : width * (1 - TRACK_COMPACT_SIDE_INSET)
  const top = TRACK_BASE_TOP * scaleY
  const bottom = TRACK_BASE_BOTTOM * scaleY
  const radius = Math.min((bottom - top) / 2, (right - left) / 2)
  const centerX = (left + right) / 2
  const centerY = (top + bottom) / 2

  return `M${centerX} ${top}H${right - radius}A${radius} ${radius} 0 0 1 ${right} ${centerY}A${radius} ${radius} 0 0 1 ${right - radius} ${bottom}H${left + radius}A${radius} ${radius} 0 0 1 ${left} ${centerY}A${radius} ${radius} 0 0 1 ${left + radius} ${top}H${centerX}`
}

function normalizeFlowStep(value?: string): FlowStep {
  return FLOW_ORDER.includes(value as FlowStep) ? (value as FlowStep) : "event"
}

function FlowMarker({ activeStep, step }: IFlowMarkerProps) {
  const isReached = FLOW_ORDER.indexOf(step) <= FLOW_ORDER.indexOf(activeStep)

  return (
    <div
      className={cn(
        "absolute z-20",
        step === "event" &&
          "top-[17.14%] left-1/2 -translate-x-1/2 -translate-y-1/2",
        step === "notify" &&
          "top-1/2 left-[93.75%] -translate-x-full -translate-y-1/2 sm:-translate-x-1/2 lg:left-[86.84%]",
        step === "engage" &&
          "top-[83.1%] left-1/2 -translate-x-1/2 -translate-y-1/2",
        step === "resolve" &&
          "top-1/2 left-[6.25%] -translate-y-1/2 sm:-translate-x-1/2 lg:left-[13.16%]"
      )}
    >
      <div
        className={cn(
          "inline-flex h-5 items-center gap-1 rounded-full border-[1.5px] px-2 text-[0.5rem] leading-none font-medium tracking-tighter transition-[color,background-color,border-color,box-shadow] duration-200 ease-out select-none motion-reduce:transition-none sm:h-6 sm:gap-1.5 sm:px-2.5 sm:text-[0.625rem] lg:h-[2.375rem] lg:gap-[0.4375rem] lg:px-[0.8125rem] lg:text-lg",
          isReached
            ? "border-white bg-white text-[#191a1f] shadow-[0_0_14px_rgba(255,255,255,0.12)]"
            : "border-[#261e43] bg-black text-[#9a72df] shadow-[0_2px_5px_rgba(0,0,0,0.35)] backdrop-blur-[15px]",
          isReached && step === "event" && "lg:pr-[0.9375rem]",
          isReached && step === "engage" && "lg:pr-[0.9375rem]",
          isReached && step === "resolve" && "lg:pr-[0.9375rem]",
          !isReached && step === "notify" && "text-[#ab4bbf]",
          !isReached && step === "resolve" && "text-[#9581e2]",
          !isReached && step === "engage" && "text-[#a271de]"
        )}
      >
        {step === "event" && (
          <EventIcon
            className="size-2.5 text-[#d6507a] sm:size-3 lg:size-6"
            aria-hidden
          />
        )}
        {step === "notify" && (
          <NotifyIcon
            className="size-2.5 text-[#bd57de] sm:size-3 lg:size-5"
            aria-hidden
          />
        )}
        {step === "engage" && (
          <EngageIcon
            className="size-2.5 text-[#8d5cda] sm:size-3 lg:size-5"
            aria-hidden
          />
        )}
        {step === "resolve" && (
          <ResolveIcon
            className="size-2.5 text-[#8767ff] sm:size-3 lg:size-4"
            aria-hidden
          />
        )}
        <span className="whitespace-nowrap">
          {step.charAt(0).toUpperCase() + step.slice(1)}
        </span>
      </div>
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
        "inline-flex shrink-0 items-center justify-center rounded-full border px-1.5 py-0.5 text-[0.375rem] leading-none font-medium tracking-tighter sm:text-[0.5rem] lg:px-2.5 lg:py-1 lg:text-[0.8125rem]",
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
    <div className="w-full rounded-[0.625rem] bg-white px-2.5 py-2 font-mono text-black shadow-[0_19.564px_47.824px_rgba(0,8,49,0.6)] sm:px-3 sm:py-2.5 lg:h-[7.125rem] lg:px-4 lg:pt-3 lg:pb-4">
      <div className="flex items-center justify-between gap-2 border-b border-[#e3e4e9] pb-1.5 sm:pb-2 lg:pb-3">
        <span className="text-[0.5rem] leading-none font-medium tracking-tighter sm:text-[0.625rem] lg:text-sm lg:leading-4">
          flight.delayed
        </span>
        <Badge className="font-inter" label="Received just now" />
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-x-3 text-[0.375rem] leading-snug tracking-tight sm:text-[0.5rem] lg:mt-4 lg:gap-x-6 lg:text-sm">
        <div>
          <p className="whitespace-nowrap">
            <span className="text-black/60">Passenger:</span> Alex Morgan
          </p>
          <p className="whitespace-nowrap">
            <span className="text-black/60">Flight:</span>
            <span className="lg:ml-[1.375rem]"> BA2048</span>
          </p>
        </div>
        <div>
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
    <div className="relative flex w-full items-center gap-2 rounded-[0.625rem] bg-white py-2 pr-2.5 pl-2 text-gray-20 shadow-[0_19.564px_23.912px_rgba(0,8,49,0.6)] sm:gap-3 sm:p-3 lg:h-[5.625rem] lg:gap-3 lg:py-[0.8125rem] lg:pr-[1.125rem] lg:pl-[0.8125rem]">
      <span className="flex size-8 shrink-0 items-center justify-center sm:size-10 lg:size-16">
        <Image
          className="size-6 sm:size-8.5 lg:size-13"
          src={imessageIcon}
          width={52}
          height={52}
          alt=""
          aria-hidden
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1 text-left lg:gap-2">
        <strong className="flex items-center truncate text-[0.625rem] leading-none font-medium tracking-tighter text-black/90 sm:text-xs lg:text-xl">
          Flight delayed
          <Badge className="ml-1.5 lg:ml-2.5" label="iMessage" />
        </strong>
        <span className="block truncate text-[0.5rem] leading-tight tracking-tighter text-gray-40 sm:text-[0.625rem] lg:text-[1.0625rem]">
          Your flight is being delayed
        </span>
      </span>
    </div>
  )
}

function PersonAvatar() {
  return (
    <span className="relative flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-[#e7922d] sm:size-7 lg:size-[2.4375rem] lg:rounded-md">
      <span className="absolute top-[18%] size-[35%] rounded-full bg-[#fcf4e7]" />
      <span className="absolute -bottom-[3%] h-[47%] w-[65%] rounded-t-full bg-[#fcf4e7]" />
    </span>
  )
}

function AgentAvatar() {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center sm:size-7 lg:size-10">
      <Image className="size-full" src={AgentAvatarImage} alt="" aria-hidden />
    </span>
  )
}

function ConversationCard() {
  return (
    <div className="flex w-full flex-col gap-1.5 rounded-[0.625rem] bg-white px-2.5 py-2 text-left text-gray-20 shadow-[0_19.564px_47.824px_rgba(0,8,49,0.6)] sm:gap-2 sm:px-3 sm:py-2.5 lg:h-[11.1875rem] lg:gap-3.5 lg:p-3.5">
      <div className="flex items-start gap-2 sm:gap-2.5 lg:gap-3">
        <PersonAvatar />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[0.5rem] leading-none tracking-tighter sm:text-[0.625rem] lg:gap-[0.4375rem] lg:text-base">
            <strong className="font-semibold">Alex Morgan</strong>
            <span className="text-gray-60 lg:text-[0.8125rem]">Now</span>
          </p>
          <p className="mt-1 truncate text-[0.4375rem] leading-snug tracking-tighter sm:text-[0.5625rem] lg:mt-1.5 lg:text-base">
            Will I miss my connection?
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-[0.375rem] leading-none tracking-tighter text-gray-60 sm:text-[0.5rem] lg:text-[0.7925rem]">
          1 reply
        </span>
        <span className="h-px flex-1 bg-[#e3e4e9]" />
      </div>
      <div className="flex items-start gap-2 sm:gap-2.5 lg:gap-3">
        <AgentAvatar />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[0.5rem] leading-none tracking-tighter sm:text-[0.625rem] lg:gap-[0.4375rem] lg:text-base">
            <strong className="font-semibold">Agent</strong>
            <span className="rounded-[0.175rem] bg-[#f0f0f0] px-1 py-0.5 text-[0.3125rem] font-medium text-[#828282] sm:text-[0.375rem] lg:text-[0.5845rem]">
              APP
            </span>
            <span className="text-gray-60 lg:text-[0.8125rem]">Now</span>
          </p>
          <p className="mt-1 line-clamp-2 text-[0.4375rem] leading-snug tracking-tighter sm:text-[0.5625rem] lg:mt-1.5 lg:text-base">
            Your connection is at risk. Would you like me to find another
            flight?
          </p>
        </div>
      </div>
    </div>
  )
}

function ResolveCard() {
  return (
    <div className="w-full rounded-[0.625rem] bg-white px-2.5 py-2 text-left text-gray-30 shadow-[0_19.564px_47.824px_rgba(0,8,49,0.6)] sm:px-3 sm:py-2.5 lg:h-[7.375rem] lg:px-4 lg:py-3.5">
      <div className="flex items-center justify-between gap-2 border-b border-[#e3e4e9] pb-1.5 sm:pb-2 lg:pb-3">
        <strong className="truncate text-[0.5rem] leading-none font-medium tracking-tighter text-black sm:text-[0.625rem] lg:text-base lg:leading-[1.125]">
          Travel issue resolved
        </strong>
        <Badge label="Success" variant="success" />
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-x-3 text-[0.375rem] leading-[1.5] tracking-tight sm:mt-2 sm:text-[0.5rem] lg:mt-2.5 lg:gap-x-10 lg:text-sm">
        <div className="space-y-0.5 lg:space-y-1">
          <p className="flex items-center gap-1.5 whitespace-nowrap">
            <Check className="size-3.5 shrink-0 text-gray-60" aria-hidden />
            Alternative flight found
          </p>
          <p className="flex items-center gap-1.5 whitespace-nowrap">
            <Check className="size-3.5 shrink-0 text-gray-60" aria-hidden />
            Itinerary updated
          </p>
        </div>
        <div className="space-y-0.5 lg:space-y-1">
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

function FlowCard({ step }: { step: FlowStep }) {
  switch (step) {
    case "event":
      return <EventCard />
    case "notify":
      return <NotifyCard />
    case "engage":
      return <ConversationCard />
    case "resolve":
      return <ResolveCard />
  }
}

function PlatformFlowAnimation({
  activeTab,
  onStepComplete,
}: IPlatformFlowAnimationProps) {
  const activeStep = normalizeFlowStep(activeTab)
  const prefersReducedMotion = useReducedMotion()
  const sceneRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sceneRef, { amount: 0.35 })
  const [isPageVisible, setIsPageVisible] = useState(true)
  const [trackSize, setTrackSize] = useState<ITrackSize>({
    width: TRACK_BASE_WIDTH,
    height: TRACK_BASE_HEIGHT,
    isDesktop: true,
  })
  const activeIndex = FLOW_ORDER.indexOf(activeStep)
  const nextStep = FLOW_ORDER[(activeIndex + 1) % FLOW_ORDER.length]
  const startProgress = TRACK_CHECKPOINTS[activeStep]
  const targetProgress = nextStep === "event" ? 1 : TRACK_CHECKPOINTS[nextStep]
  const shouldAnimate = isInView && isPageVisible && !prefersReducedMotion
  const progress = shouldAnimate ? targetProgress : startProgress
  const progressKey = `${activeStep}-${shouldAnimate ? "playing" : "paused"}`
  const activeTitle = activeStep.charAt(0).toUpperCase() + activeStep.slice(1)
  const trackPath = createTrackPath(trackSize)
  const pathTransition = {
    duration: shouldAnimate ? FLOW_STEP_DURATION : 0,
    ease: "linear" as const,
  }

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
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden)
    }

    handleVisibilityChange()
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (!shouldAnimate || !onStepComplete) {
      return
    }

    const timer = window.setTimeout(onStepComplete, FLOW_STEP_DURATION * 1000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [activeStep, onStepComplete, shouldAnimate])

  return (
    <div
      ref={sceneRef}
      className="relative isolate aspect-4/3 w-full overflow-hidden rounded-[0.625rem] border border-gray-20 bg-[#0e0c17] sm:aspect-video lg:aspect-[1216/420]"
      data-flow-step={activeStep}
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
        <svg
          className="pointer-events-none absolute inset-0 size-full"
          viewBox={`0 0 ${trackSize.width} ${trackSize.height}`}
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            d={trackPath}
            stroke="white"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            className="mix-blend-overlay"
          />
          <m.path
            key={`${progressKey}-glow`}
            d={trackPath}
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="opacity-20 blur-[2.5px]"
            initial={{ pathLength: startProgress }}
            animate={{ pathLength: progress }}
            transition={pathTransition}
          />
          <m.path
            key={`${progressKey}-line`}
            d={trackPath}
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: startProgress }}
            animate={{ pathLength: progress }}
            transition={pathTransition}
          />
        </svg>

        {FLOW_ORDER.map((step) => (
          <FlowMarker activeStep={activeStep} step={step} key={step} />
        ))}

        <div
          className={cn(
            "pointer-events-none absolute top-1/2 left-1/2 z-10 w-[60%] -translate-x-1/2 -translate-y-1/2 sm:w-[52%]",
            activeStep === "notify" ? "max-w-[21.5rem]" : "max-w-[24.9375rem]"
          )}
        >
          <AnimatePresence initial={false} mode="wait">
            <m.div
              className="w-full will-change-transform"
              key={activeStep}
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      transform: "translate3d(0,-16px,0)",
                    }
              }
              animate={{
                opacity: 1,
                transform: "translate3d(0,0,0)",
              }}
              exit={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 0,
                      transform: "translate3d(0,12px,0)",
                    }
              }
              transition={{
                duration: prefersReducedMotion ? 0 : 0.26,
                ease: EASE_OUT,
              }}
            >
              <FlowCard step={activeStep} />
            </m.div>
          </AnimatePresence>
        </div>
      </LazyMotion>
    </div>
  )
}

export default PlatformFlowAnimation
