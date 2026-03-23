"use client"

import Image from "next/image"

import type { IComparisonCodeSection } from "@/types/comparison"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function CodeSection({ codeSection }: { codeSection: IComparisonCodeSection }) {
  return (
    <section className="relative xl:pt-50">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          <h2 className="max-w-176 text-[1.75rem] leading-dense font-medium tracking-tighter text-pretty text-white md:text-[2.25rem] lg:text-[2.75rem]">
            {codeSection.title}
          </h2>
          <p className="max-w-160 font-book tracking-tighter text-pretty text-gray-8">
            {codeSection.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-10 lg:mt-18 lg:flex-row lg:items-start lg:gap-24">
          <div className="pointer-events-none relative z-0 aspect-16/10 h-auto w-160 shrink-0 select-none">
            <Image
              className={cn("absolute max-w-none", codeSection.image.className)}
              src={codeSection.image.src}
              alt=""
              width={codeSection.image.width}
              height={codeSection.image.height}
              aria-hidden
              sizes={`(max-width: 768px) 100vw, ${codeSection.image.width * 2}px`}
              quality={100}
            />
          </div>

          <Accordion
            className="relative z-10 mt-7 grow"
            type="single"
            defaultValue="item-0"
            collapsible
          >
            {codeSection.items.map((item, index) => (
              <AccordionItem
                key={item.title}
                value={`item-${index}`}
                className="border-b border-gray-3"
              >
                <AccordionTrigger className="py-5 text-lg font-medium tracking-tighter text-white hover:no-underline">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="max-w-[384px] text-[15px] leading-relaxed font-book tracking-tighter text-gray-8">
                  {item.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default CodeSection
