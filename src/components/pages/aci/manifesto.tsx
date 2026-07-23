"use client"

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import Image from "next/image"
import avatarBlue from "@/images/pages/aci/manifesto/avatar-blue.png"
import avatarPink from "@/images/pages/aci/manifesto/avatar-pink.png"
import avatarPurple from "@/images/pages/aci/manifesto/avatar-purple.png"
import {
  domAnimation,
  LazyMotion,
  m,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"

const MANIFESTO_WIDTH = 832
const DESKTOP_PADDING = 40
const MAX_BLUR = 6
const INACTIVE_COLOR = "#464853"
const SCROLL_START_VIEWPORT_OFFSET = 0.42
const SCROLL_END_VIEWPORT_OFFSET = 0.675
const STICKY_VIEWPORT_HEIGHT =
  SCROLL_END_VIEWPORT_OFFSET - SCROLL_START_VIEWPORT_OFFSET
const STAGE_VIEWPORT_OFFSET = 0.5 - SCROLL_START_VIEWPORT_OFFSET
const SECTION_HEIGHT_VH = 112
const SHARE_URL =
  "https://x.com/intent/post?url=https%3A%2F%2Fnovu.co%2Faci&text=Agent%20Communication%20Infrastructure%20by%20Novu"

type OffsetMap = [number, number, number, number]

const SECOND_LINE_PROGRESS = 0.333
const THIRD_LINE_PROGRESS = 0.666
const FOURTH_LINE_PROGRESS = 1
const ITEM_OFFSET_INPUT = [
  0,
  SECOND_LINE_PROGRESS,
  THIRD_LINE_PROGRESS,
  1,
]
const INITIAL_OFFSET_MAP: OffsetMap = [0, 0, 0, 0]

const ACCENT_TEXT_STYLE = {
  backgroundImage:
    "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%), linear-gradient(68.55101189432266deg, rgb(255, 253, 255) 1.2774%, rgb(255, 221, 186) 13.962%, rgb(252, 174, 156) 25.25%, rgb(235, 71, 224) 48.762%, rgb(176, 40, 236) 70.43%, rgb(79, 50, 240) 97.169%)",
} satisfies CSSProperties

const AGENTS_TEXT_STYLE = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 832 162' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.6000000238418579'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-16.45 8.6899e-14 1.5254e-12 -3.9254 669 142.29)'><stop stop-color='rgba(13,189,175,1)' offset='0'/><stop stop-color='rgba(13,189,175,0)' offset='1'/></radialGradient></defs></svg>\"), url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 832 162' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.6000000238418579'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-17.45 1.5353e-14 -2.8678e-12 -4.7857 773 85.714)'><stop stop-color='rgba(112,10,244,1)' offset='0'/><stop stop-color='rgba(112,10,244,0)' offset='1'/></radialGradient></defs></svg>\"), url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 832 162' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.5'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(17.85 9.5993e-14 3.0217e-12 7.0986 375.5 87)'><stop stop-color='rgba(233,37,250,1)' offset='0'/><stop stop-color='rgba(233,37,250,0)' offset='1'/></radialGradient></defs></svg>\"), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
} satisfies CSSProperties

const MANIFESTO_GLOW_LAYER_CLASS_NAME = [
  "pointer-events-none absolute z-0",
  "left-[-319px] top-[-325.98992919921875px]",
  "h-[1242.4798583984375px] w-[1564.46875px]",
].join(" ")

const MANIFESTO_GLOW_ELLIPSE_CLASS_NAMES = [
  [
    "absolute rounded-full mix-blend-normal",
    "left-[656.46875px] top-[645.87744140625px]",
    "h-[129px] w-[317px]",
    "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(68,116,242,1)_0%,rgba(68,116,242,0)_100%)]",
    "opacity-[0.11999999731779099]",
  ].join(" "),
  [
    "absolute origin-top-left rounded-full mix-blend-normal",
    "left-[1564.46875px] top-[340.7813720703125px]",
    "h-[1384px] w-[705.0000610351562px]",
    "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(245,117,202,1)_18.510127067565918%,rgba(245,117,202,1)_50%,rgba(245,117,202,0)_100%)]",
    "opacity-[0.03999999910593033]",
    "[transform:matrix(-0.00000004371139183945161,1,-1,-0.00000004371139183945161,0,0)]",
  ].join(" "),
  [
    "absolute origin-top-left rounded-full mix-blend-normal",
    "left-[1529.421875px] top-[473.095458984375px]",
    "h-[799.6069946289062px] w-[954.34912109375px]",
    "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(245,117,202,1)_0%,rgba(245,117,202,0)_100%)]",
    "opacity-[0.07000000029802322]",
    "[transform:matrix(-0.5916599035263062,0.8061876893043518,-0.8061876893043518,-0.5916599035263062,0,0)]",
  ].join(" "),
  [
    "absolute origin-top-left rounded-full mix-blend-normal",
    "left-0 top-[710.348876953125px]",
    "h-[588.2268676757812px] w-[942.9749145507812px]",
    "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(103,137,255,1)_27.198195457458496%,rgba(103,137,255,0)_100%)]",
    "opacity-[0.10999999940395355]",
    "[transform:matrix(0.8792047500610352,-0.4764440953731537,0.4764440953731537,0.8792047500610352,0,0)]",
  ].join(" "),
  [
    "absolute origin-top-left rounded-full mix-blend-normal",
    "left-[398.6796875px] top-[494.26397705078125px]",
    "h-[588.2268676757812px] w-[723.8033447265625px]",
    "bg-[radial-gradient(50%_50%_at_50%_50%,rgba(103,137,255,1)_27.198195457458496%,rgba(103,137,255,0)_100%)]",
    "opacity-[0.03999999910593033]",
    "[transform:matrix(0.8792047500610352,-0.4764440953731537,0.4764440953731537,0.8792047500610352,0,0)]",
  ].join(" "),
]

const LINE_PROGRESS = [
  {
    visibilityInput: [0, SECOND_LINE_PROGRESS, THIRD_LINE_PROGRESS],
    opacity: [1, 0.34, 0],
    blur: [0, 4, MAX_BLUR],
    colorInput: [0, SECOND_LINE_PROGRESS],
    color: ["#ffffff", INACTIVE_COLOR],
  },
  {
    visibilityInput: [0, SECOND_LINE_PROGRESS, THIRD_LINE_PROGRESS],
    opacity: [0.34, 1, 0],
    blur: [4, 0, MAX_BLUR],
    colorInput: [0, SECOND_LINE_PROGRESS, THIRD_LINE_PROGRESS],
    color: [INACTIVE_COLOR, "#ffffff", INACTIVE_COLOR],
  },
  {
    visibilityInput: [
      SECOND_LINE_PROGRESS,
      THIRD_LINE_PROGRESS,
      FOURTH_LINE_PROGRESS,
    ],
    opacity: [0.34, 1, 0.34],
    blur: [4, 0, 4],
    colorInput: [
      SECOND_LINE_PROGRESS,
      THIRD_LINE_PROGRESS,
      FOURTH_LINE_PROGRESS,
    ],
    color: [INACTIVE_COLOR, "#ffffff", INACTIVE_COLOR],
  },
  {
    visibilityInput: [THIRD_LINE_PROGRESS, FOURTH_LINE_PROGRESS],
    opacity: [0.34, 1],
    blur: [4, 0],
    colorInput: [THIRD_LINE_PROGRESS, FOURTH_LINE_PROGRESS],
    color: [INACTIVE_COLOR, "#ffffff"],
  },
]

function getManifestoScale() {
  if (typeof window === "undefined") {
    return 1
  }

  return Math.min(1, (window.innerWidth - DESKTOP_PADDING) / MANIFESTO_WIDTH)
}

function GradientText({ children }: { children: ReactNode }) {
  return (
    <span
      className="bg-clip-text font-bold text-transparent"
      data-aci-accent-gradient
      style={ACCENT_TEXT_STYLE}
    >
      {children}
    </span>
  )
}

function ManifestoAvatar({
  src,
  className,
}: {
  src: typeof avatarPink
  className?: string
}) {
  return (
    <Image
      src={src}
      alt=""
      width={56}
      height={56}
      className={className}
      aria-hidden
      placeholder="blur"
    />
  )
}

function ManifestoGlowLayer() {
  return (
    <div
      aria-hidden
      className={MANIFESTO_GLOW_LAYER_CLASS_NAME}
      data-aci-manifesto-glow
    >
      {MANIFESTO_GLOW_ELLIPSE_CLASS_NAMES.map((className, index) => (
        <div
          className={className}
          data-aci-manifesto-glow-ellipse={index}
          key={index}
        />
      ))}
    </div>
  )
}

function ManifestoLine({
  children,
  index,
  scrollYProgress,
  setLineRef,
}: {
  children: ReactNode
  index: number
  scrollYProgress: MotionValue<number>
  setLineRef: (node: HTMLDivElement | null) => void
}) {
  const progress = LINE_PROGRESS[index]
  const opacity = useTransform(
    scrollYProgress,
    progress.visibilityInput,
    progress.opacity
  )
  const filter = useTransform(
    scrollYProgress,
    progress.visibilityInput,
    progress.blur.map((value) => `blur(${value}px)`)
  )
  const color = useTransform(
    scrollYProgress,
    progress.colorInput,
    progress.color
  )

  return (
    <m.div
      className="w-full text-center text-[48px] leading-[1.125] font-medium tracking-[-0.02em] text-white will-change-[filter,opacity,color]"
      data-aci-manifesto-line={index}
      ref={setLineRef}
      style={{ opacity, filter, color }}
    >
      {children}
    </m.div>
  )
}

function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const itemsWrapperRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const [scale, setScale] = useState(1)
  const [itemsWrapperOffsetMap, setItemsWrapperOffsetMap] =
    useState<OffsetMap>(INITIAL_OFFSET_MAP)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 42vh", "end 67.5vh"],
  })

  const itemsWrapperOffset = useTransform(
    scrollYProgress,
    ITEM_OFFSET_INPUT,
    itemsWrapperOffsetMap
  )

  useEffect(() => {
    const updateLayout = () => {
      const nextScale = getManifestoScale()

      setScale(nextScale)

      const lineOffsets = lineRefs.current.map((line) =>
        line ? -line.offsetTop - line.offsetHeight / 2 : 0
      )
      const stickyRect = stickyRef.current?.getBoundingClientRect()
      const stageRect = stageRef.current?.getBoundingClientRect()
      const stageOffset =
        stickyRect && stageRect
          ? stageRect.top - stickyRect.top
          : window.innerHeight * STAGE_VIEWPORT_OFFSET
      const initialOffset = -stageOffset / nextScale

      const nextOffsetMap: OffsetMap = [
        initialOffset,
        lineOffsets[1] ?? 0,
        lineOffsets[2] ?? 0,
        lineOffsets[3] ?? 0,
      ]

      setItemsWrapperOffsetMap(nextOffsetMap)
    }

    updateLayout()

    const resizeObserver = new ResizeObserver(updateLayout)
    const observedElements: Element[] = []

    if (stickyRef.current) observedElements.push(stickyRef.current)
    if (stageRef.current) observedElements.push(stageRef.current)
    if (itemsWrapperRef.current) observedElements.push(itemsWrapperRef.current)

    observedElements.forEach((element) => {
      resizeObserver.observe(element)
    })

    window.addEventListener("resize", updateLayout)
    window.visualViewport?.addEventListener("resize", updateLayout)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateLayout)
      window.visualViewport?.removeEventListener("resize", updateLayout)
    }
  }, [])

  return (
    <section
      className="relative isolate mt-26 bg-black text-white md:mt-48 lg:mt-60"
      data-aci-manifesto
      ref={sectionRef}
      style={{ height: `${SECTION_HEIGHT_VH}vh` }}
    >
      <div
        ref={stickyRef}
        className="pointer-events-none sticky overflow-visible px-5"
        style={{
          top: `${SCROLL_START_VIEWPORT_OFFSET * 100}vh`,
          height: `${STICKY_VIEWPORT_HEIGHT * 100}vh`,
        }}
      >
        <LazyMotion features={domAnimation}>
          <div
            ref={stageRef}
            className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2"
            data-aci-manifesto-scale-shell
            style={{
              top: `${STAGE_VIEWPORT_OFFSET * 100}vh`,
              width: MANIFESTO_WIDTH * scale,
            }}
          >
            <div
              className="relative origin-top-left overflow-visible"
              data-aci-manifesto-scale-content
              style={{
                width: MANIFESTO_WIDTH,
                transform: `scale(${scale})`,
              }}
            >
              <m.div
                className="pointer-events-none absolute top-0 left-0 z-0 w-full overflow-visible will-change-transform"
                aria-hidden
                style={{ y: itemsWrapperOffset }}
              >
                <ManifestoGlowLayer />
              </m.div>

              <m.div
                className="relative z-10 flex w-full flex-col items-center will-change-transform"
                ref={itemsWrapperRef}
                style={{ y: itemsWrapperOffset }}
              >
                <div className="relative z-10 flex w-full flex-col items-center gap-10">
                  <ManifestoLine
                    index={0}
                    scrollYProgress={scrollYProgress}
                    setLineRef={(node) => {
                      lineRefs.current[0] = node
                    }}
                  >
                    <span className="block">For decades, software waited.</span>
                    <span className="block">It opened when you opened it.</span>
                  </ManifestoLine>

                  <ManifestoLine
                    index={1}
                    scrollYProgress={scrollYProgress}
                    setLineRef={(node) => {
                      lineRefs.current[1] = node
                    }}
                  >
                    <div className="relative h-[162px] w-full">
                      <div
                        className="h-full w-full bg-clip-text text-center whitespace-pre-wrap text-transparent"
                        data-aci-agents-gradient
                        style={AGENTS_TEXT_STYLE}
                      >
                        <p className="mb-0 leading-[1.125]">
                          Agents don&apos;t wait.
                        </p>
                        <p className="leading-[1.125]">
                          {`They reach out     , they follow up     , they live where you live     .`}
                        </p>
                      </div>
                      <ManifestoAvatar
                        src={avatarPink}
                        className="absolute top-[58px] left-[351px] size-14"
                      />
                      <ManifestoAvatar
                        src={avatarPurple}
                        className="absolute top-[58px] left-[742px] size-14"
                      />
                      <ManifestoAvatar
                        src={avatarBlue}
                        className="absolute top-[113px] left-[639px] size-14"
                      />
                    </div>
                  </ManifestoLine>

                  <ManifestoLine
                    index={2}
                    scrollYProgress={scrollYProgress}
                    setLineRef={(node) => {
                      lineRefs.current[2] = node
                    }}
                  >
                    <span className="block">MCP connects agents to tools.</span>
                    <span className="block">
                      A2A connects agents to each other.
                    </span>
                  </ManifestoLine>

                  <ManifestoLine
                    index={3}
                    scrollYProgress={scrollYProgress}
                    setLineRef={(node) => {
                      lineRefs.current[3] = node
                    }}
                  >
                    <span className="block whitespace-nowrap">
                      <GradientText>ACI</GradientText> connects agents to
                      people.
                    </span>
                    <span className="block whitespace-nowrap">
                      Novu Connect is the <GradientText>ACI</GradientText>{" "}
                      layer.
                    </span>
                  </ManifestoLine>
                </div>

                <a
                  className="pointer-events-auto relative z-10 mt-16 inline-flex h-12 origin-top items-center justify-center rounded-md border border-[#534B5D] bg-[linear-gradient(218.095deg,rgba(176,166,191,0.06)_8.6198%,rgba(176,166,191,0.03)_113.79%)] px-6 text-center text-sm leading-none font-medium whitespace-nowrap text-white uppercase transition-colors hover:border-[#766C85] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
                  href={SHARE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ transform: `scale(${1 / scale})` }}
                  data-click-location="aci_manifesto"
                  data-click-text="share_the_manifesto_on_x"
                >
                  Share the manifesto on x.com
                </a>
              </m.div>
            </div>
          </div>
        </LazyMotion>
      </div>
    </section>
  )
}

export default Manifesto
