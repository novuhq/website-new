"use client"

import { useState } from "react"
import Image, { type StaticImageData } from "next/image"
import { Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import AnimatedCopyCheck from "./animated-copy-check"

export interface INotifyCodeTab {
  code: string
  highlightedHtml: string
  icon: StaticImageData
  title: string
}

interface INotifyCodeTabsProps {
  className?: string
  tabs: INotifyCodeTab[]
}

function NotifyCodeTabs({ className, tabs }: INotifyCodeTabsProps) {
  const [activeTab, setActiveTab] = useState(
    tabs.find((tab) => tab.title === "Remix")?.title ?? tabs[0]?.title ?? ""
  )
  const { isCopied, handleCopy, resetCopied } = useCopyToClipboard(2500)

  if (!tabs.length) {
    return null
  }

  const activeCode = tabs.find((tab) => tab.title === activeTab)?.code ?? ""

  return (
    <Tabs
      activationMode="manual"
      className={cn(
        "relative h-52 w-full overflow-hidden rounded-t-xl border border-b-0 border-gray-20 bg-black/95 shadow-[0_6px_22px_rgba(0,8,49,0.7)] backdrop-blur-2xl",
        className
      )}
      value={activeTab}
      onValueChange={(value) => {
        setActiveTab(value)
        resetCopied()
      }}
    >
      <div className="relative z-10 flex h-9 items-start border-b border-gray-20 bg-black/90">
        <TabsList className="h-full flex-1 items-start justify-start rounded-none bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              className="relative h-8.75 gap-1 rounded-none px-4 py-2 text-xs leading-none font-normal text-gray-60 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-foreground after:opacity-0 after:transition-transform hover:text-foreground focus-visible:ring-1 focus-visible:ring-foreground/70 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:ring-inset data-[state=active]:text-foreground data-[state=active]:after:opacity-100 sm:px-5 sm:text-sm"
              key={tab.title}
              tabIndex={0}
              value={tab.title}
            >
              <Image
                className="size-4"
                src={tab.icon}
                alt=""
                width={16}
                height={16}
                draggable={false}
              />
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <button
        className="absolute top-12 right-4 z-20 grid size-7 shrink-0 place-items-center rounded border border-gray-20 text-gray-50 transition-colors hover:border-gray-50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/70 focus-visible:outline-none md:right-15 lg:max-[72rem]:right-22 xl:right-7"
        type="button"
        onClick={() => handleCopy(activeCode)}
        aria-label={isCopied ? "Code copied" : "Copy code"}
      >
        {isCopied ? (
          <AnimatedCopyCheck className="!h-3.5 !w-3.5" stroke="currentColor" />
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
      </button>

      {tabs.map((tab) => (
        <TabsContent
          className="scrollbar-hidden numbered-lines mt-0 h-[calc(100%-2.25rem)] overflow-auto pt-4 pr-4.5 pb-5 pl-2 text-xs leading-normal font-normal md:text-sm md:leading-[1.6] [&_.line]:pl-[26px]"
          key={tab.title}
          value={tab.title}
        >
          <div
            className="[&_.shiki]:!bg-transparent [&_pre]:m-0 [&_pre]:!bg-transparent"
            dangerouslySetInnerHTML={{ __html: tab.highlightedHtml }}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default NotifyCodeTabs
