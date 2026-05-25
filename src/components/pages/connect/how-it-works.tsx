"use client"

import { useEffect, useRef, useState, type MutableRefObject } from "react"
import NextLink from "next/link"
import { ROUTE } from "@/constants/routes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)"
const VIDEO_BASE_PATH = "/videos/pages/connect/how-it-works"
const VIDEO_PLAY_VISIBILITY_THRESHOLD = 0.2

const VIDEOS = [
  {
    webm: `${VIDEO_BASE_PATH}/blob.webm`,
    mp4: `${VIDEO_BASE_PATH}/blob.hevc.mp4`,
    poster: `${VIDEO_BASE_PATH}/blob.jpg`,
  },
  {
    webm: `${VIDEO_BASE_PATH}/connect.webm`,
    mp4: `${VIDEO_BASE_PATH}/connect.hevc.mp4`,
    poster: `${VIDEO_BASE_PATH}/connect.jpg`,
  },
  {
    webm: `${VIDEO_BASE_PATH}/tools.webm`,
    mp4: `${VIDEO_BASE_PATH}/tools.hevc.mp4`,
    poster: `${VIDEO_BASE_PATH}/tools.jpg`,
  },
  {
    webm: `${VIDEO_BASE_PATH}/blob-connect.webm`,
    mp4: `${VIDEO_BASE_PATH}/blob-connect.hevc.mp4`,
    poster: `${VIDEO_BASE_PATH}/blob-connect.jpg`,
  },
  {
    webm: `${VIDEO_BASE_PATH}/chat.webm`,
    mp4: `${VIDEO_BASE_PATH}/chat.hevc.mp4`,
    poster: `${VIDEO_BASE_PATH}/chat.jpg`,
  },
] as const

const STEPS = [
  {
    title: "Prepare your agent",
    description:
      "Select Claude managed agents, paste your Anthropic API key, and configure your agent. Create a new one or import an existing Claude agent you've already built.",
    videoIndexes: [0, 1],
  },
  {
    title: "Connect the MCP tools and skills",
    description:
      "Connect the sources your agent relies on, from docs and code to MCP tools and product data, so it can work with real context.",
    videoIndexes: [2, 3],
  },
  {
    title: "Work where teams work",
    description:
      "Launch the same agent across Slack, WhatsApp, email, and more, with one setup, unified delivery, and visibility in one place.",
    videoIndexes: [4],
  },
] as const

const VIDEO_TO_STEP = [0, 0, 1, 1, 2] as const
const STEP_DESCRIPTION_CLASS_NAME =
  "min-h-0 max-w-101.75 overflow-hidden text-base leading-normal font-book tracking-tighter text-gray-8"

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function ConnectVideoCard({ video }: { video: (typeof VIDEOS)[number] }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const videoElement = videoRef.current

    if (!videoElement) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= VIDEO_PLAY_VISIBILITY_THRESHOLD) {
          void videoElement.play().catch(() => {})
        } else {
          videoElement.pause()
        }
      },
      { threshold: [0, VIDEO_PLAY_VISIBILITY_THRESHOLD] }
    )

    observer.observe(videoElement)

    return () => {
      observer.disconnect()
      videoElement.pause()
    }
  }, [])

  return (
    <div className="relative aspect-[704/420] w-full overflow-hidden rounded-xl bg-[#080812]">
      <video
        ref={videoRef}
        className="size-full object-cover"
        muted
        playsInline
        preload="metadata"
        poster={video.poster}
      >
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type='video/mp4; codecs="hvc1"' />
      </video>
      <div
        className="pointer-events-none absolute inset-0 rounded-xl border border-white opacity-70 mix-blend-overlay"
        aria-hidden
      />
    </div>
  )
}

function ProgressLine({
  setProgressNode,
}: {
  setProgressNode: (node: HTMLDivElement | null) => void
}) {
  return (
    <div className="relative h-px w-full overflow-hidden bg-[rgba(51,51,71,0.45)]">
      <div
        ref={setProgressNode}
        className="h-full origin-left bg-gray-8 will-change-transform"
        style={{ transform: "scaleX(0)" }}
        data-connect-progress-line
      />
    </div>
  )
}

function StepItem({
  title,
  description,
  isActive,
}: {
  title: string
  description: string
  isActive: boolean
}) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <h3
        className={cn(
          "text-xl leading-tight font-medium tracking-tighter transition-colors duration-300 ease-out",
          isActive ? "text-white" : "text-gray-9"
        )}
      >
        {title}
      </h3>
      <div
        className={cn(
          "grid w-full overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
          isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <p className={STEP_DESCRIPTION_CLASS_NAME}>{description}</p>
      </div>
    </div>
  )
}

function StaticStepItem({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <h3 className="text-xl leading-tight font-medium tracking-tighter text-white">
        {title}
      </h3>
      <p className={STEP_DESCRIPTION_CLASS_NAME}>{description}</p>
    </div>
  )
}

function ConnectAgentButton() {
  return (
    <Button
      variant="default"
      size="lg"
      className="h-12 overflow-visible rounded-md px-5 py-4.25 text-sm leading-none font-medium tracking-normal uppercase"
      asChild
    >
      <NextLink
        href={ROUTE.dashboardV2SignUp}
        target="_blank"
        rel="noopener noreferrer"
        data-click-location="connect_how_it_works"
        data-click-text="connect_an_agent_for_free"
      >
        Connect an agent for free
      </NextLink>
    </Button>
  )
}

function DesktopStepsPanel({
  activeStep,
  progressLineRefs,
}: {
  activeStep: number
  progressLineRefs: MutableRefObject<Array<HTMLDivElement | null>>
}) {
  return (
    <div className="flex w-full max-w-104.5 flex-col items-start gap-10 lg:sticky lg:top-28 lg:max-w-none">
      <div className="flex w-full flex-col items-start gap-7">
        {STEPS.map((step, index) => (
          <div key={step.title} className="contents">
            <StepItem
              title={step.title}
              description={step.description}
              isActive={activeStep === index}
            />
            <ProgressLine
              setProgressNode={(node) => {
                progressLineRefs.current[index] = node
              }}
            />
          </div>
        ))}
      </div>

      <ConnectAgentButton />
    </div>
  )
}

function MobileStepsWithVideos() {
  return (
    <div className="flex w-full flex-col items-start gap-10 lg:hidden">
      {STEPS.map((step, index) => (
        <div
          key={step.title}
          className="flex w-full flex-col items-start gap-6"
        >
          <StaticStepItem title={step.title} description={step.description} />

          {index === STEPS.length - 1 && <ConnectAgentButton />}

          <div className="flex w-full flex-col gap-4 md:gap-6">
            {step.videoIndexes.map((videoIndex) => (
              <ConnectVideoCard key={videoIndex} video={VIDEOS[videoIndex]} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function HowItWorks() {
  const mediaRef = useRef<HTMLDivElement>(null)
  const progressLineRefs = useRef<Array<HTMLDivElement | null>>([])
  const activeStepRef = useRef(0)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY)
    let frame: number | null = null

    const updateProgress = () => {
      frame = null

      if (!desktopQuery.matches) {
        return
      }

      const media = mediaRef.current

      if (!media) {
        return
      }

      const rect = media.getBoundingClientRect()

      if (rect.height === 0) {
        return
      }

      const anchor = window.innerHeight * 0.5
      const scrollProgress = clamp((anchor - rect.top) / rect.height)
      const activeVideo = Math.min(
        Math.floor(scrollProgress * VIDEO_TO_STEP.length),
        VIDEO_TO_STEP.length - 1
      )
      const nextActiveStep = VIDEO_TO_STEP[activeVideo]
      const nextProgress: [number, number, number] = [0, 0, 0]

      if (nextActiveStep === 0) {
        nextProgress[0] = clamp(scrollProgress / 0.4)
      } else if (nextActiveStep === 1) {
        nextProgress[1] = clamp((scrollProgress - 0.4) / 0.4)
      } else {
        nextProgress[2] = clamp((scrollProgress - 0.8) / 0.2)
      }

      nextProgress.forEach((value, index) => {
        const progressLine = progressLineRefs.current[index]

        if (progressLine) {
          progressLine.style.transform = `scaleX(${value})`
        }
      })

      if (activeStepRef.current !== nextActiveStep) {
        activeStepRef.current = nextActiveStep
        setActiveStep(nextActiveStep)
      }
    }

    const scheduleUpdate = () => {
      if (frame !== null) {
        return
      }

      frame = requestAnimationFrame(updateProgress)
    }

    scheduleUpdate()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("scrollend", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)
    desktopQuery.addEventListener("change", scheduleUpdate)

    return () => {
      if (frame !== null) {
        cancelAnimationFrame(frame)
      }

      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("scrollend", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      desktopQuery.removeEventListener("change", scheduleUpdate)
    }
  }, [])

  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 pt-28 md:pt-36 lg:pt-44 xl:pt-50"
      data-connect-section="how-it-works"
    >
      <div className="mx-auto flex w-full max-w-304 flex-col items-start gap-16 px-5 md:px-8 2xl:px-0">
        <div className="flex w-full max-w-174.75 flex-col items-start gap-5">
          <div className="flex items-center gap-2">
            <span className="size-1.5 bg-lagune-3" />
            <span className="overflow-visible text-sm leading-none font-normal tracking-normal text-lagune-1 uppercase">
              How it works
            </span>
          </div>

          <h2 className="max-w-134 text-[1.75rem] leading-dense font-medium tracking-tighter text-white md:text-5xl">
            Everything your agent needs to run
          </h2>
        </div>

        <MobileStepsWithVideos />

        <div className="hidden w-full gap-12 lg:grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start xl:grid-cols-[418px_704px] xl:gap-23.5">
          <DesktopStepsPanel
            activeStep={activeStep}
            progressLineRefs={progressLineRefs}
          />

          <div ref={mediaRef} className="flex w-full flex-col gap-8">
            {VIDEOS.map((video, index) => (
              <ConnectVideoCard key={index} video={video} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
