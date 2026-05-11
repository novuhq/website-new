"use client"

import React from "react"

import { IFaqSection } from "@/types/common"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ = ({
  title,
  accordion,
  className,
  onScheduleClick,
}: IFaqSection & {
  className?: string
  onScheduleClick?: (source: string) => void
}) => {
  if (!title || !accordion) {
    return null
  }

  return (
    <section
      className={cn(
        "safe-paddings pt-15 pb-20 sm:pb-10 md:pt-12.5 md:pb-5 lg:pb-16",
        className
      )}
    >
      <div className="container mx-auto max-w-[832px] px-5 md:px-8 lg:max-w-[896px]">
        <h2 className="text-[32px] leading-dense font-medium tracking-tighter text-white md:text-[40px]">
          {title}
        </h2>
        <Accordion type="single" collapsible className="mt-6 md:mt-[22px]">
          {accordion.items.map(({ question, answer }) => {
            const resolvedAnswer: React.ReactNode =
              typeof answer === "function"
                ? answer(onScheduleClick ?? (() => {}))
                : answer

            return (
              <AccordionItem
                key={question}
                value={question}
                className="border-b border-gray-3"
              >
                <AccordionTrigger className="pt-6 pb-5 text-start text-[20px] leading-snug font-medium tracking-snug hover:no-underline sm:pt-5 sm:pb-4 sm:text-[18px]">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="max-w-[752px] pt-2 pb-8 text-[18px] leading-relaxed font-book tracking-snug text-gray-8 sm:mr-7 sm:pb-6 sm:text-[16px] sm:leading-normal md:mr-14 [&_a]:text-primary [&_a]:transition-colors [&_a]:duration-300 [&_a:hover]:text-primary-muted [&_br]:mb-3 [&_br]:block">
                  {resolvedAnswer}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}

export default FAQ
