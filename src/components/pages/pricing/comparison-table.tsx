"use client"

import React, { useState } from "react"
import {
  PortableText,
  PortableTextBlock,
  PortableTextReactComponents,
} from "@portabletext/react"
import { Check, ChevronLeft, ChevronRight, Info } from "lucide-react"

import { Headings, PlanHeading, Plans, Row } from "@/types/pricing"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const portableTextComponents = {
  marks: {
    link: ({
      value,
      children,
    }: {
      value: { href: string; isExternal: boolean }
      children: React.ReactNode
    }) => (
      <Link
        href={value.href}
        target={value.isExternal ? "_blank" : undefined}
        rel={value.isExternal ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    ),
  },
}

const getFeaturedPlanId = (headings: Headings) => {
  const featured = headings.find((heading) => heading.isFeatured)
  return featured?.id
}

const getColumnStartClass = (columnIndex: number) => {
  switch (columnIndex) {
    case 0:
      return "md:col-start-2"
    case 1:
      return "md:col-start-3"
    case 2:
      return "md:col-start-4"
    case 3:
      return "md:col-start-5"
    default:
      return "md:col-start-2"
  }
}
interface TableHeaderProps {
  plan?: any
  planId: string
  isFeatured: boolean
  plansCount: number
}

function TableHeader({ plan, planId, plansCount }: TableHeaderProps) {
  const { label, isFeatured, buttonUrl, buttonText } = plan || {}
  return (
    <div
      className={cn(
        "table-header sticky top-(--sticky-header-height) z-30 bg-background pt-5 pb-6 lg:top-[calc(var(--sticky-header-height)+3rem)]",
        "before:absolute before:-top-4 before:left-0 before:z-10 before:h-4 before:w-full before:bg-background lg:before:-top-12 lg:before:h-12"
      )}
      role="columnheader"
    >
      {isFeatured && (
        <div
          className="pointer-events-none absolute top-3 right-4 bottom-0 -left-4 hidden rounded-t-xl bg-[#14141FBF] md:block xl:top-0 xl:right-5"
          aria-hidden
        />
      )}
      <div className="relative z-10 flex h-full flex-col pl-4 md:pr-8 md:pl-0 xl:pr-10">
        <div className="flex items-center gap-x-2">
          <h3 className="text-[24px] leading-none tracking-tighter">
            {label || planId.charAt(0).toUpperCase() + planId.slice(1)}
          </h3>
        </div>
        {plan && buttonUrl && (
          <Button
            className={cn("mt-auto w-full px-3.5 text-[12px] lg:px-5", {
              "md:max-w-48 lg:max-w-56": plansCount < 3,
            })}
            size="default"
            variant={isFeatured ? "default" : "outline"}
            asChild
          >
            <Link variant="white" className="rounded-sm" href={buttonUrl}>
              {buttonText}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

interface Feature {
  value?: PortableTextBlock[]
  booleanValue?: boolean
}
interface ITableCellProps {
  feature: Feature
  featureName: string
  planId: string
}

function TableCell({ feature, featureName, planId }: ITableCellProps) {
  const value =
    feature?.value && feature?.value?.length > 0
      ? feature.value
      : feature?.booleanValue

  const isBoolean = typeof value === "boolean"
  const isText = !isBoolean && value !== undefined && value !== null

  return (
    <div
      className="relative z-10 flex min-h-11 flex-col items-start gap-y-0.5 border-b border-dashed border-gray-4 py-3 pr-5 pl-4 md:pl-0"
      role="cell"
      aria-label={`${featureName} for ${planId} plan`}
    >
      {isBoolean &&
        (value ? (
          <Check className="mt-1 text-gray-9" size={14} />
        ) : (
          <span className="mt-1 text-gray-9">—</span>
        ))}
      {isText && (
        <div className="text-[14px] text-gray-9">
          <PortableText
            value={value}
            components={
              portableTextComponents as Partial<PortableTextReactComponents>
            }
          />
        </div>
      )}
    </div>
  )
}

interface TableColumnProps {
  planId: string
  totalRows: number
  headings: Headings
  rows: Row[]
  isFeatured: boolean
  className?: string
}

function TableColumn({
  planId,
  totalRows,
  headings,
  rows,
  isFeatured,
  className,
}: TableColumnProps) {
  return (
    <div
      className={cn("relative grid min-w-0 grid-rows-subgrid", className)}
      style={{
        gridRow: "1 / span " + totalRows,
      }}
      role="row"
      aria-label={`${planId} plan features`}
    >
      {isFeatured && (
        <div
          className="pointer-events-none absolute top-3 right-4 -bottom-4 -left-4 z-0 hidden rounded-xl bg-[#14141FBF] md:block xl:top-0 xl:right-5"
          aria-hidden
        />
      )}
      {/* Column header */}
      <TableHeader
        plan={headings.find((h) => h.id === planId)}
        planId={planId}
        isFeatured={isFeatured}
        plansCount={headings.length}
      />

      {/* All feature rows in correct order - mirror the structure of FeaturesColumn */}
      {rows.map((row, index) => {
        const isGroupTitle = row.title && row.isGroupTitle

        if (isGroupTitle) {
          return (
            <div
              className={cn("pb-3", index > 0 && "pt-10 md:pt-11")}
              key={`category-${row.title}-${planId}`}
            />
          )
        }

        const planData = row[planId as keyof Row] as any
        const feature = {
          value: planData?.value,
          booleanValue: planData?.booleanValue,
        }

        return (
          <TableCell
            key={`feature-${row.title}-${planId}`}
            feature={feature}
            featureName={row.title}
            planId={planId}
          />
        )
      })}
    </div>
  )
}

interface IFeaturesColumnProps {
  rows: Row[]
  totalRows: number
  handlePrevPlan: () => void
  handleNextPlan: () => void
  plansCount: number
}

function FeaturesColumn({
  rows,
  totalRows,
  handlePrevPlan,
  handleNextPlan,
  plansCount,
}: IFeaturesColumnProps) {
  return (
    <div
      className="relative grid grid-rows-subgrid border-muted/30 bg-background"
      style={{
        gridRow: "1 / span " + totalRows,
      }}
    >
      <div
        className={cn(
          "sticky top-(--sticky-header-height) z-30 flex min-h-32 flex-col justify-end bg-background pb-6 md:pb-5 lg:top-[calc(var(--sticky-header-height)+3rem)]",
          "before:absolute before:-top-4 before:left-0 before:z-10 before:h-4 before:w-full before:bg-background lg:before:-top-12 lg:before:h-12"
        )}
      >
        <div
          className={cn(
            "flex touch-manipulation items-end gap-x-3 pb-1",
            plansCount === 1 ? "hidden" : "lg:hidden"
          )}
        >
          <Button
            className="size-8 rounded-full"
            variant="outline"
            size="icon"
            onClick={handlePrevPlan}
            aria-label="Previous plan"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            className="size-8 rounded-full"
            variant="outline"
            size="icon"
            onClick={handleNextPlan}
            aria-label="Next plan"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Category headers and feature names in correct order */}
      {rows.map((row, index) => {
        const isGroupTitle = row.title && row.isGroupTitle

        if (isGroupTitle) {
          return (
            <div
              className={cn("pb-3", index > 0 && "pt-10 md:pt-11")}
              key={`category-${row.title}`}
            >
              <span className="inline-block text-xl leading-snug font-semibold tracking-tight whitespace-nowrap text-foreground">
                {row.title}
              </span>
            </div>
          )
        }
        return (
          <React.Fragment key={`feature-group-${row.title}`}>
            {/* Feature names for this category */}
            <div
              className={cn(
                "relative flex flex-col gap-y-0.5 border-b border-dashed border-gray-4 bg-background py-3 pr-4 text-left text-sm font-medium tracking-tight text-foreground"
              )}
              key={`feature-${row.title}`}
            >
              <span
                className={cn(
                  "flex max-w-64 items-center text-base leading-snug font-medium tracking-tight text-gray-10"
                )}
              >
                {row.title}
                {row.tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="ml-1.5 cursor-pointer">
                          <Info className="size-3.5 text-gray-10" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-80 p-4 text-white/80">
                        <PortableText
                          value={row.tooltip as PortableTextBlock[]}
                        />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </span>
              {row.subtitle && (
                <span className="max-w-60 text-[13px] leading-snug tracking-tight text-muted-foreground">
                  {row.subtitle}
                </span>
              )}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

// Mirror the structure of the first column
function TableDividerColumn({
  className,
  rows,
  totalRows,
}: {
  rows: Row[]
  totalRows: number
  className?: string
}) {
  return (
    <div
      className={cn("hidden grid-rows-subgrid", className)}
      style={{
        gridRow: "1 / span " + totalRows,
      }}
      aria-hidden
    >
      {/* Empty cell at the top */}
      <div
        className={cn(
          "sticky top-(--sticky-header-height) z-30 min-h-32 bg-background lg:top-[calc(var(--sticky-header-height)+3rem)]",
          "before:absolute before:-top-4 before:left-0 before:z-10 before:h-4 before:w-full before:bg-background lg:before:-top-12 lg:before:h-12"
        )}
      />

      {rows.map((row, index) => {
        const isGroupTitle = row.title && row.isGroupTitle

        if (isGroupTitle) {
          return (
            <div
              className={cn("pb-3", index > 0 && "pt-10 md:pt-11")}
              key={`category-${row.title}`}
            />
          )
        }
        return (
          <React.Fragment key={`divider-group-${row.title}`}>
            <div
              className="border-b border-dashed border-gray-4 py-3"
              key={`divider-${row.title}`}
            />
          </React.Fragment>
        )
      })}
    </div>
  )
}

interface IComparisonTableProps extends Plans {
  className?: string
}

function ComparisonTable({
  title,
  className,
  headings,
  rows,
}: IComparisonTableProps) {
  const planIds = headings.map((h) => h.id)
  const featuredPlanId = getFeaturedPlanId(headings)

  // Add state for active plan ID in mobile view
  const [activePlanId, setActivePlanId] = useState(planIds[0])
  // Add state for active plan IDs in md view (2 plans)
  const [activePlanIds, setActivePlanIds] = useState([
    planIds[0],
    planIds[1] || planIds[0],
  ])

  const handlePrevPlan = () => {
    const currentIndex = planIds.indexOf(activePlanId)
    const prevIndex = currentIndex <= 0 ? planIds.length - 1 : currentIndex - 1
    setActivePlanId(planIds[prevIndex])

    // Update md view plans
    const newFirstPlan = planIds[prevIndex]
    const newSecondPlan = planIds[prevIndex + 1] || planIds[0]
    setActivePlanIds([newFirstPlan, newSecondPlan])
  }

  const handleNextPlan = () => {
    const currentIndex = planIds.indexOf(activePlanId)
    const nextIndex = currentIndex >= planIds.length - 1 ? 0 : currentIndex + 1
    setActivePlanId(planIds[nextIndex])

    // Update md view plans
    const newFirstPlan = planIds[nextIndex]
    const newSecondPlan = planIds[nextIndex + 1] || planIds[0]
    setActivePlanIds([newFirstPlan, newSecondPlan])
  }

  const totalRowsCount = rows.length + 1
  const plansCount = headings.length

  return (
    <section
      className={cn(
        "comparison-table pt-[114px] md:pt-[140px] lg:pt-[156px] xl:pt-40",
        className
      )}
    >
      <div
        className={cn("mx-auto w-full px-5 md:px-8", {
          "xl:max-w-4xl": plansCount < 3,
          "max-w-6xl": plansCount === 3,
          "max-w-7xl": plansCount > 3,
        })}
      >
        <h2 className="mb-[52px] text-center text-[32px] leading-tight font-medium tracking-tighter lg:text-[40px] lg:leading-1.125 xl:text-[44px]">
          {title}
        </h2>
        <div className="relative overflow-clip pb-[26px]">
          <div
            className={cn(
              "relative -mt-5 grid w-full grid-cols-2",
              plansCount === 1 &&
                "md:grid-cols-[minmax(12rem,15rem)_minmax(1.25rem,5rem)_1fr]",
              plansCount === 2 &&
                "md:grid-cols-[12rem_repeat(2,1fr)] lg:grid-cols-[minmax(12rem,15rem)_minmax(1.25rem,5rem)_repeat(2,1fr)]",
              plansCount === 3 &&
                "md:grid-cols-[12rem_repeat(3,1fr)] lg:grid-cols-[minmax(12rem,15rem)_minmax(1.25rem,5rem)_repeat(3,1fr)]",
              plansCount === 4 &&
                "md:grid-cols-[45fr_repeat(2,26fr)] lg:grid-cols-[20rem_repeat(4,1fr)] xl:grid-cols-[minmax(12rem,15rem)_minmax(1.25rem,5rem)_repeat(4,1fr)]",
              plansCount >= 5 &&
                "lg:grid-cols-[minmax(12rem,15rem)_minmax(1.25rem,5rem)_repeat(5,1fr)]"
            )}
            role="table"
            aria-rowcount={totalRowsCount}
            aria-label="Pricing comparison table"
          >
            {/* First column with headers */}
            <FeaturesColumn
              rows={rows}
              totalRows={totalRowsCount}
              handlePrevPlan={handlePrevPlan}
              handleNextPlan={handleNextPlan}
              plansCount={plansCount}
            />
            {/* Empty column as the divider */}
            <TableDividerColumn
              className={cn("hidden", {
                "md:grid": plansCount < 2,
                "xl:grid": plansCount >= 2,
              })}
              rows={rows}
              totalRows={totalRowsCount}
            />
            {/* Plan columns - on mobile only show active column, on md show 2 columns */}
            {planIds.map((planId: string) => {
              const isActiveMobile = planId === activePlanId
              const isActiveMd = activePlanIds.includes(planId)
              const mdColumnIndex = activePlanIds.indexOf(planId)

              return (
                <TableColumn
                  className={cn(
                    "row-start-1 grid",
                    // Mobile logic (sm and below)
                    !isActiveMobile &&
                      "pointer-events-none invisible col-start-2 sm:pointer-events-none sm:invisible sm:col-start-2",
                    isActiveMobile && "col-start-2 sm:col-start-2",
                    // MD logic (md breakpoint)
                    !isActiveMd && "md:pointer-events-none md:invisible",
                    isActiveMd && "md:pointer-events-auto md:visible",
                    isActiveMd && getColumnStartClass(mdColumnIndex),
                    // LG and above - show all
                    "lg:pointer-events-auto lg:visible lg:col-start-auto"
                  )}
                  key={planId}
                  planId={planId}
                  totalRows={totalRowsCount}
                  isFeatured={planId === featuredPlanId}
                  rows={rows}
                  headings={headings}
                />
              )
            })}
          </div>
          <div
            className="absolute inset-x-0 -bottom-4 z-40 bg-linear-to-b from-transparent to-white to-75%"
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}

export default ComparisonTable
