"use client"

import { useCallback, useState } from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import PlatformFlowAnimation from "./platform-flow-animation"
import ProductBadge, { type ProductBadgeType } from "./product-badge"

interface IPlatformLabel {
  label: string
  labelType: ProductBadgeType
}

export interface IPlatformAction extends IPlatformLabel {
  title: string
  description: string
  linkText: string
  linkUrl: string
}

export interface IPlatformTabItem extends IPlatformLabel {
  key: string
  title: string
  description: string
}

export interface ISectionTabsProps {
  className?: string
  title: string
  actions: IPlatformAction[]
  items: IPlatformTabItem[]
  defaultValue?: string
}

interface IPlatformLabelProps {
  className?: string
  label: string
  type: ProductBadgeType
}

function PlatformLabel({ className, label, type }: IPlatformLabelProps) {
  return (
    <ProductBadge className={className} type={type}>
      {label}
    </ProductBadge>
  )
}

function SectionTabs({
  className,
  title,
  actions,
  items,
  defaultValue,
}: ISectionTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue ?? items[0]?.key)

  const handleStepComplete = useCallback(() => {
    setActiveTab((currentTab) => {
      const currentIndex = items.findIndex((item) => item.key === currentTab)
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length

      return items[nextIndex]?.key ?? currentTab
    })
  }, [items])

  if (!items.length) {
    return null
  }

  return (
    <section
      className={cn(
        "section-tabs mt-24 font-inter md:mt-28 lg:mt-32 xl:mt-60",
        className
      )}
    >
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:max-w-7xl">
        <header className="grid gap-10 xl:grid-cols-[35.875rem_35.25rem] xl:items-start xl:gap-19.5">
          <h2 className="max-w-xl text-[2.5rem] leading-[1.125] font-normal tracking-plus-tight text-balance text-foreground md:text-5xl xl:text-[3.5rem]">
            {title}
          </h2>

          <ul className="grid gap-8 sm:grid-cols-2 sm:gap-10 xl:gap-14 xl:pt-1.25">
            {actions.slice(0, 2).map((action) => (
              <li className="flex flex-col" key={action.title}>
                <div className="relative inline-flex w-fit">
                  <h3 className="text-lg leading-none font-medium tracking-tighter text-foreground">
                    {action.title}
                  </h3>
                  <PlatformLabel
                    className="relative -top-1 ml-3 whitespace-nowrap"
                    label={action.label}
                    type={action.labelType}
                  />
                </div>
                <p className="mt-1.5 text-base tracking-tight text-gray-50">
                  {action.description}
                </p>
                <Link
                  className="mt-5 leading-none font-medium tracking-normal hover:text-primary [&_svg]:size-3.5"
                  href={action.linkUrl}
                  variant="white"
                >
                  {action.linkText}
                  <ChevronRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </header>

        <div className="mt-18">
          <PlatformFlowAnimation
            activeTab={activeTab}
            onStepComplete={handleStepComplete}
          />
        </div>

        <Tabs
          className="mt-8 w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList
            className="grid h-auto w-full grid-cols-1 items-start gap-3 rounded-none bg-transparent p-0 sm:grid-cols-2 sm:gap-4 xl:grid-cols-[repeat(4,minmax(0,17.5rem))] xl:gap-8"
            aria-label="Communication flow"
          >
            {items.map((item) => (
              <TabsTrigger
                className="group h-full w-full min-w-0 flex-col items-start justify-start gap-1 rounded-[0.625rem] border-0 px-4.5 pt-4 pb-4.5 text-left whitespace-normal text-foreground opacity-50 transition-[opacity,box-shadow,background-color] hover:opacity-75 data-[state=active]:border-gray-20 data-[state=active]:bg-[#0B0C0E] data-[state=active]:opacity-100 data-[state=active]:ring-1 data-[state=active]:ring-gray-3 data-[state=active]:ring-inset"
                key={item.key}
                value={item.key}
              >
                <span className="inline-flex w-full flex-wrap items-center gap-2.5">
                  <span className="inline text-lg leading-snug font-medium tracking-tighter">
                    {item.title}
                  </span>
                  <PlatformLabel label={item.label} type={item.labelType} />
                </span>
                <span className="text-base leading-snug font-normal tracking-tighter text-gray-50">
                  {item.description}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </section>
  )
}

export default SectionTabs
