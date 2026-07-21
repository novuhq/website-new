"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Image, { type StaticImageData } from "next/image"
import { Copy } from "lucide-react"
import { domAnimation, LazyMotion, useReducedMotion } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "@/lib/utils"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import AnimatedCopyCheck from "../animated-copy-check"

export interface IPreviewData {
  backgroundImage: StaticImageData | string
  clientFacingImage: StaticImageData | string
  implementationCode: string
  implementationHighlightedHtml: string
}

interface IPreviewProps extends IPreviewData {
  channelLabel: string
}

function ImplementationCodeBlock({
  code,
  highlightedHtml,
}: {
  code: string
  highlightedHtml: string
}) {
  const { isCopied, handleCopy } = useCopyToClipboard(2500)

  return (
    <div className="relative size-full overflow-hidden rounded-[10px] border border-gray-20 bg-black shadow-[0_18px_44px_0_rgba(0,8,49,.60)]">
      <button
        className="absolute top-4.5 right-4.5 z-20 grid size-7 shrink-0 place-items-center rounded border border-gray-20 text-gray-50 transition-colors hover:border-gray-50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/70 focus-visible:outline-none"
        type="button"
        onClick={() => handleCopy(code)}
        aria-label={isCopied ? "Code copied" : "Copy code"}
      >
        {isCopied ? (
          <AnimatedCopyCheck className="!h-3.5 !w-3.5" stroke="currentColor" />
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
      </button>

      <div className="scrollbar-hidden numbered-lines size-full overflow-auto pt-5 pr-14 pb-5 pl-2 text-xs leading-normal font-normal md:text-sm md:leading-[1.6] [&_.line]:pl-[26px]">
        <div
          className="[&_.shiki]:!bg-transparent [&_pre]:m-0 [&_pre]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </div>
    </div>
  )
}

function Preview({
  backgroundImage,
  clientFacingImage,
  implementationCode,
  implementationHighlightedHtml,
  channelLabel,
}: IPreviewProps) {
  const [activeTab, setActiveTab] = useState<
    "client-facing" | "implementation"
  >("client-facing")
  const tabsListRef = useRef<HTMLDivElement>(null)
  const [indicatorRect, setIndicatorRect] = useState<{
    x: number
    width: number
  } | null>(null)
  const reducedMotion = Boolean(useReducedMotion())
  const activeTabIndex = activeTab === "client-facing" ? 0 : 1
  const indicatorTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }

  useLayoutEffect(() => {
    const tabsList = tabsListRef.current
    const activeTrigger =
      tabsList?.querySelectorAll<HTMLButtonElement>("[role=tab]")[
        activeTabIndex
      ]

    if (!tabsList || !activeTrigger) return

    const updateIndicator = () => {
      const tabsListRect = tabsList.getBoundingClientRect()
      const activeTriggerRect = activeTrigger.getBoundingClientRect()

      setIndicatorRect({
        x: activeTriggerRect.left - tabsListRect.left,
        width: activeTriggerRect.width,
      })
    }

    updateIndicator()

    const resizeObserver = new ResizeObserver(updateIndicator)
    resizeObserver.observe(tabsList)
    resizeObserver.observe(activeTrigger)

    return () => resizeObserver.disconnect()
  }, [activeTabIndex])

  return (
    <div className="relative size-full">
      <Tabs
        className="z-10 flex flex-col pt-10"
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "client-facing" | "implementation")
        }
      >
        <Image
          className="z-0 object-cover"
          src={backgroundImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 640px, 100vw"
          quality={100}
          aria-hidden
          draggable={false}
        />
        <LazyMotion features={domAnimation}>
          <TabsList
            ref={tabsListRef}
            className="relative mx-auto inline-flex h-11.5 w-fit gap-1 rounded-full bg-transparent p-1.5"
          >
            <span className="absolute inset-0 rounded-full border border-white/70 bg-[linear-gradient(0deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.20)_100%),radial-gradient(120.1%_175.96%_at_54.41%_-35.58%,rgba(42,93,194,0.50)_2.53%,rgba(38,25,51,0)_100%)] mix-blend-overlay backdrop-blur-md" />
            {indicatorRect && (
              <m.span
                className="pointer-events-none absolute left-0 z-10 h-8.5 rounded-full border border-white bg-white/90"
                initial={false}
                animate={{
                  x: indicatorRect.x,
                  width: indicatorRect.width,
                }}
                transition={indicatorTransition}
                aria-hidden
              />
            )}
            <TabsTrigger
              className={cn(
                "relative z-20 h-8.5 gap-2.5 rounded-full border border-transparent px-4.5 text-[0.9375rem] leading-none font-normal tracking-tighter text-[#ABBEFF]/90 transition-colors focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none",
                "font-medium data-[state=active]:border-white data-[state=active]:bg-white/90 data-[state=active]:text-[#00217C]"
              )}
              value="client-facing"
              onClick={() => setActiveTab("client-facing")}
            >
              Client facing
            </TabsTrigger>
            <TabsTrigger
              className={cn(
                "relative z-20 h-8.5 gap-2.5 rounded-full border border-transparent px-4.5 text-[0.9375rem] leading-none font-normal tracking-tighter text-[#ABBEFF]/90 transition-colors focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none",
                "font-medium data-[state=active]:border-white data-[state=active]:bg-white/90 data-[state=active]:text-[#00217C]"
              )}
              value="implementation"
              onClick={() => setActiveTab("implementation")}
            >
              Implementation
            </TabsTrigger>
          </TabsList>
        </LazyMotion>

        <TabsContent
          className="relative z-10 sm:-mt-2 lg:mt-0 2xl:-mt-2"
          value="client-facing"
        >
          <Image
            className="mx-auto -ml-[2%] h-auto w-[104%] max-w-xl sm:ml-auto sm:w-[87%] sm:max-w-none"
            src={clientFacingImage}
            alt={`${channelLabel} client-facing preview`}
            sizes="(min-width: 1024px) 559px, 87vw"
            quality={100}
            draggable={false}
          />
        </TabsContent>

        <TabsContent
          className="relative z-10 mt-5 px-5 sm:px-0"
          value="implementation"
        >
          <div className="mx-auto w-full max-w-md sm:aspect-471/340 sm:w-[73.5%] sm:max-w-none">
            <ImplementationCodeBlock
              code={implementationCode}
              highlightedHtml={implementationHighlightedHtml}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Preview
