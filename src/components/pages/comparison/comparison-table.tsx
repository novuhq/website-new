import Image from "next/image"
import backgroundImage from "@/svgs/pages/comparison/comparison-table/background.svg"

import type { IComparisonTable } from "@/types/comparison"
import { cn } from "@/lib/utils"

function ComparisonTableSection({
  comparisonTable,
}: {
  comparisonTable: IComparisonTable
}) {
  return (
    <section id="comparison" className="relative xl:pt-41">
      <div className="mx-auto max-w-240 px-5 md:px-8 xl:max-w-304">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-[28px] leading-[1.125] font-medium tracking-tighter text-white md:text-[36px] lg:text-[44px]">
            {comparisonTable.title}
          </h2>
          <p className="text-base leading-relaxed font-book tracking-tighter text-gray-8">
            {comparisonTable.subtitle}
          </p>
        </div>

        <div className="relative mt-14 overflow-hidden rounded-[1.25rem]">
          <div className="relative z-10">
            {/* Header */}
            <div className="grid grid-cols-4 border-b border-white/12">
              {comparisonTable.columnHeaders.map((header, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-6 py-2.5",
                    index % 2 === 1 && "bg-white/6",
                    index > 0 && "border-l border-white/12"
                  )}
                >
                  <span className="text-[0.9375rem] leading-snug font-medium tracking-tighter text-white">
                    {header}
                  </span>
                </div>
              ))}
            </div>

            {/* Rows */}
            {comparisonTable.rows.map((row, index) => {
              return (
                <div
                  key={index}
                  className={cn(
                    "grid grid-cols-4",
                    index !== 0 && "border-t border-white/12"
                  )}
                >
                  {row.map((cell, celIndex) => (
                    <div
                      key={celIndex}
                      className={cn(
                        "flex items-center p-6",
                        celIndex % 2 === 1 && "bg-white/6",
                        celIndex > 0 && "border-l border-white/12"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[0.9375rem] leading-snug font-book tracking-tighter text-gray-9 [&_span]:font-medium [&_span]:text-white",
                          celIndex === 0 && "font-medium text-white"
                        )}
                      >
                        {cell}
                      </span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
          <Image
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-top select-none"
            src={backgroundImage}
            alt=""
            width={1152}
            height={764}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white mix-blend-overlay" />
        </div>
      </div>
    </section>
  )
}

export default ComparisonTableSection
